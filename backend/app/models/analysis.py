from datetime import datetime
from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, JSON, String
from sqlalchemy.orm import relationship
from app.db.base import Base


class Analysis(Base):
    __tablename__ = "analysis"

    id = Column(Integer, primary_key=True, index=True)
    upload_id = Column(Integer, ForeignKey("uploads.id"), nullable=False)
    status = Column(String, default="processing")
    ai_score = Column(Float, default=0.0)
    human_score = Column(Float, default=0.0)
    confidence = Column(Float, default=0.0)
    visual_flags = Column(JSON, default=list)
    audio_flags = Column(JSON, default=list)
    timeline = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)

    upload = relationship("Upload", back_populates="analysis")
    report = relationship("Report", back_populates="analysis", uselist=False)
