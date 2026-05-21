from __future__ import annotations

from dataclasses import dataclass
from typing import Any


@dataclass
class AnalysisResult:
    ai_score: float
    human_score: float
    confidence: float
    visual_flags: list[dict[str, Any]]
    audio_flags: list[dict[str, Any]]
    timeline: list[dict[str, Any]]
    summary: str
    details: dict[str, Any]


def run_analysis(video_path: str) -> AnalysisResult:
    visual_flags = [
        {"type": "eye_blink", "severity": 0.72, "frame": 120},
        {"type": "shadow_mismatch", "severity": 0.64, "frame": 220},
    ]
    audio_flags = [
        {"type": "synthetic_voice", "severity": 0.8, "timestamp": 14.5}
    ]
    timeline = [
        {"start": 12.1, "end": 16.8, "reason": "voice modulation artifact"},
        {"start": 32.4, "end": 35.2, "reason": "lip sync drift"},
    ]
    ai_score = 0.87
    human_score = 1.0 - ai_score
    confidence = 0.91
    summary = "87% chance de video gerado por IA"
    details = {
        "visual": {
            "eye_analysis": "inconsistent blink cadence",
            "shadow_consistency": "light direction mismatch",
        },
        "audio": {"voice_clone": "synthetic spectral artifacts"},
    }
    return AnalysisResult(
        ai_score=ai_score,
        human_score=human_score,
        confidence=confidence,
        visual_flags=visual_flags,
        audio_flags=audio_flags,
        timeline=timeline,
        summary=summary,
        details=details,
    )
