from datetime import datetime
from pydantic import BaseModel


class UploadOut(BaseModel):
    id: int
    filename: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class UploadInitRequest(BaseModel):
    filename: str
    total_size: int
    total_chunks: int


class UploadInitResponse(BaseModel):
    upload_id: int
    temp_dir: str


class UploadHistoryItem(BaseModel):
    id: int
    filename: str
    status: str
    created_at: datetime
    analysis_id: int | None = None
    ai_score: float | None = None


class UploadHistoryResponse(BaseModel):
    items: list[UploadHistoryItem]
    total: int
    page: int
    page_size: int
