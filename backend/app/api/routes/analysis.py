from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.analysis import Analysis
from app.models.upload import Upload
from app.schemas.analysis import AnalysisOut


router = APIRouter(prefix="/analysis", tags=["analysis"])


@router.get("/latest", response_model=AnalysisOut)
def get_latest_analysis(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
) -> AnalysisOut:
    analysis = (
        db.query(Analysis)
        .join(Upload, Analysis.upload_id == Upload.id)
        .filter(Upload.user_id == user.id)
        .order_by(Analysis.created_at.desc())
        .first()
    )
    if not analysis:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    return analysis


@router.get("/{analysis_id}", response_model=AnalysisOut)
def get_analysis(
    analysis_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
) -> AnalysisOut:
    analysis = (
        db.query(Analysis)
        .join(Upload, Analysis.upload_id == Upload.id)
        .filter(Analysis.id == analysis_id, Upload.user_id == user.id)
        .first()
    )
    if not analysis:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    return analysis
