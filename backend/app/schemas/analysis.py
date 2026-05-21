from datetime import datetime
from pydantic import BaseModel


class AnalysisOut(BaseModel):
    id: int
    upload_id: int
    status: str
    ai_score: float
    human_score: float
    confidence: float
    visual_flags: list
    audio_flags: list
    timeline: list
    created_at: datetime

    class Config:
        from_attributes = True
