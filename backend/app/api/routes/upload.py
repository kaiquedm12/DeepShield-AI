from pathlib import Path
from uuid import uuid4
from fastapi import APIRouter, Depends, File, Form, HTTPException, Request, UploadFile, status
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.core.config import get_settings
from app.core.rate_limit import limiter
from app.db.session import get_db
from app.models.analysis import Analysis
from app.models.upload import Upload
from app.schemas.upload import (
    UploadHistoryResponse,
    UploadInitRequest,
    UploadInitResponse,
    UploadOut,
)
from app.services.analysis.tasks import analyze_video_task
from app.utils.files import ensure_dirs, is_allowed_extension


router = APIRouter(prefix="/upload", tags=["upload"])


@router.post("/video", response_model=UploadOut)
@limiter.limit("10/minute")
def upload_video(
    request: Request,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
) -> UploadOut:
    settings = get_settings()
    if not is_allowed_extension(file.filename):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid file")
    size = getattr(file, "size", None)
    if size and size > settings.max_upload_mb * 1024 * 1024:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File too large")
    ensure_dirs()
    upload_path = Path(settings.upload_dir) / file.filename
    with upload_path.open("wb") as buffer:
        chunk = file.file.read(1024 * 1024)
        while chunk:
            buffer.write(chunk)
            chunk = file.file.read(1024 * 1024)

    upload = Upload(
        user_id=user.id,
        filename=file.filename,
        storage_path=str(upload_path),
        status="queued",
    )
    db.add(upload)
    db.commit()
    db.refresh(upload)

    analysis = Analysis(upload_id=upload.id, status="processing")
    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    analyze_video_task.delay(analysis.id, str(upload_path))
    upload.status = "processing"
    db.add(upload)
    db.commit()
    db.refresh(upload)
    return upload


@router.post("/init", response_model=UploadInitResponse)
@limiter.limit("20/minute")
def init_chunked_upload(
    request: Request,
    payload: UploadInitRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
) -> UploadInitResponse:
    settings = get_settings()
    if not is_allowed_extension(payload.filename):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid file")
    if payload.total_size > settings.max_upload_mb * 1024 * 1024:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File too large")
    ensure_dirs()
    upload_key = uuid4().hex
    safe_name = f"{upload_key}_{payload.filename}"
    upload_path = Path(settings.upload_dir) / safe_name
    upload = Upload(
        user_id=user.id,
        filename=payload.filename,
        storage_path=str(upload_path),
        status="uploading",
    )
    db.add(upload)
    db.commit()
    db.refresh(upload)

    temp_dir = Path(settings.upload_dir) / "tmp" / str(upload.id)
    temp_dir.mkdir(parents=True, exist_ok=True)
    return UploadInitResponse(upload_id=upload.id, temp_dir=str(temp_dir))


@router.post("/chunk")
@limiter.limit("120/minute")
def upload_chunk(
    request: Request,
    upload_id: int = Form(...),
    chunk_index: int = Form(...),
    total_chunks: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    settings = get_settings()
    upload = db.query(Upload).filter(Upload.id == upload_id).first()
    if not upload or upload.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    if chunk_index >= total_chunks:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid chunk")
    temp_dir = Path(settings.upload_dir) / "tmp" / str(upload.id)
    temp_dir.mkdir(parents=True, exist_ok=True)
    chunk_path = temp_dir / f"chunk_{chunk_index}.part"
    with chunk_path.open("wb") as buffer:
        chunk = file.file.read(1024 * 1024)
        while chunk:
            buffer.write(chunk)
            chunk = file.file.read(1024 * 1024)
    if chunk_index == total_chunks - 1:
        upload.status = "assembling"
        db.add(upload)
        db.commit()
    return {"received": chunk_index, "total": total_chunks}


@router.post("/complete", response_model=UploadOut)
@limiter.limit("20/minute")
def complete_upload(
    request: Request,
    upload_id: int = Form(...),
    total_chunks: int = Form(...),
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
) -> UploadOut:
    settings = get_settings()
    upload = db.query(Upload).filter(Upload.id == upload_id).first()
    if not upload or upload.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    temp_dir = Path(settings.upload_dir) / "tmp" / str(upload.id)
    if not temp_dir.exists():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing chunks")

    final_path = Path(upload.storage_path)
    with final_path.open("wb") as output:
        for index in range(total_chunks):
            chunk_path = temp_dir / f"chunk_{index}.part"
            if not chunk_path.exists():
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Chunk missing")
            with chunk_path.open("rb") as handle:
                output.write(handle.read())

    for chunk_file in temp_dir.glob("*.part"):
        chunk_file.unlink()
    temp_dir.rmdir()

    analysis = Analysis(upload_id=upload.id, status="processing")
    db.add(analysis)
    db.commit()
    db.refresh(analysis)
    analyze_video_task.delay(analysis.id, str(final_path))
    upload.status = "processing"
    db.add(upload)
    db.commit()
    db.refresh(upload)
    return upload


@router.get("/history", response_model=UploadHistoryResponse)
@limiter.limit("60/minute")
def list_history(
    request: Request,
    q: str | None = None,
    status: str | None = None,
    page: int = 1,
    page_size: int = 10,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
) -> UploadHistoryResponse:
    page = max(page, 1)
    page_size = min(max(page_size, 1), 50)
    query = (
        db.query(Upload, Analysis)
        .outerjoin(Analysis, Analysis.upload_id == Upload.id)
        .filter(Upload.user_id == user.id)
    )
    if q:
        query = query.filter(Upload.filename.ilike(f"%{q}%"))
    if status:
        query = query.filter(Upload.status == status)

    total = query.with_entities(func.count(Upload.id)).scalar() or 0
    rows = (
        query.order_by(Upload.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    items = []
    for upload, analysis in rows:
        items.append(
            {
                "id": upload.id,
                "filename": upload.filename,
                "status": upload.status,
                "created_at": upload.created_at,
                "analysis_id": analysis.id if analysis else None,
                "ai_score": analysis.ai_score if analysis else None,
            }
        )

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
    }
