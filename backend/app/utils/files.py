import os
from pathlib import Path
from app.core.config import get_settings


def ensure_dirs() -> None:
    settings = get_settings()
    Path(settings.upload_dir).mkdir(parents=True, exist_ok=True)
    Path(settings.reports_dir).mkdir(parents=True, exist_ok=True)
    (Path(settings.upload_dir) / "tmp").mkdir(parents=True, exist_ok=True)


def is_allowed_extension(filename: str) -> bool:
    settings = get_settings()
    allowed = {ext.strip().lower() for ext in settings.allowed_extensions.split(",")}
    ext = os.path.splitext(filename)[1].replace(".", "").lower()
    return ext in allowed
