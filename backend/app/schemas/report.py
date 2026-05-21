from datetime import datetime
from pydantic import BaseModel


class ReportOut(BaseModel):
    id: int
    analysis_id: int
    summary: str
    details: dict
    pdf_path: str | None = None
    json_path: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True
