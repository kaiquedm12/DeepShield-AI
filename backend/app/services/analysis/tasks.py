from celery import Celery
from sqlalchemy.orm import Session
from app.core.config import get_settings
from app.db.session import SessionLocal
from app.models.analysis import Analysis
from app.models.report import Report
from app.services.analysis.pipeline import run_analysis
from app.utils.reporting import write_report_files


settings = get_settings()
celery_app = Celery("deepshield", broker=settings.redis_url, backend=settings.redis_url)


@celery_app.task
def analyze_video_task(analysis_id: int, video_path: str) -> None:
    db: Session = SessionLocal()
    try:
        analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
        if not analysis:
            return
        result = run_analysis(video_path)
        analysis.ai_score = result.ai_score
        analysis.human_score = result.human_score
        analysis.confidence = result.confidence
        analysis.visual_flags = result.visual_flags
        analysis.audio_flags = result.audio_flags
        analysis.timeline = result.timeline
        analysis.status = "completed"
        db.add(analysis)
        db.commit()

        pdf_path, json_path = write_report_files(analysis_id, result.summary, result.details)
        report = Report(
            analysis_id=analysis_id,
            summary=result.summary,
            details=result.details,
            pdf_path=pdf_path,
            json_path=json_path,
        )
        db.add(report)
        db.commit()
    finally:
        db.close()
