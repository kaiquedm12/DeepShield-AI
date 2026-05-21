import json
from pathlib import Path
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from app.core.config import get_settings


def write_report_files(analysis_id: int, summary: str, details: dict) -> tuple[str, str]:
    settings = get_settings()
    reports_dir = Path(settings.reports_dir)
    reports_dir.mkdir(parents=True, exist_ok=True)

    json_path = reports_dir / f"analysis_{analysis_id}.json"
    with json_path.open("w", encoding="utf-8") as handle:
        json.dump({"summary": summary, "details": details}, handle, indent=2)

    pdf_path = reports_dir / f"analysis_{analysis_id}.pdf"
    pdf = canvas.Canvas(str(pdf_path), pagesize=letter)
    pdf.setTitle("DeepShield AI Report")
    pdf.drawString(72, 720, "DeepShield AI Report")
    pdf.drawString(72, 700, summary)
    pdf.save()

    return str(pdf_path), str(json_path)
