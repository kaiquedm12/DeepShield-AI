from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.analysis import Analysis
from app.models.upload import Upload
from app.models.report import Report
from app.schemas.report import ReportOut


router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/{analysis_id}", response_model=ReportOut)
def get_report(
    analysis_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
) -> ReportOut:
    report = (
        db.query(Report)
        .join(Analysis, Report.analysis_id == Analysis.id)
        .join(Upload, Analysis.upload_id == Upload.id)
        .filter(Report.analysis_id == analysis_id, Upload.user_id == user.id)
        .first()
    )
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    return report
