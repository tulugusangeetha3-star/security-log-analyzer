from fastapi import APIRouter
from app.services.log_parser import parse_log_file
from app.services.detection_engine import detect_threats
from app.services.risk_engine import calculate_risk

router = APIRouter()


@router.get("/incidents")
def get_incidents():
    files = [
        "../data/sample_logs/auth.log",
        "../data/sample_logs/web.log",
        "../data/sample_logs/cloud.log"
    ]

    incidents = []

    for file in files:
        logs = parse_log_file(file)
        alerts = detect_threats(logs)
        risks = calculate_risk(alerts)
        incidents.extend(risks)

    return {
        "total_incidents": len(incidents),
        "incidents": incidents
    }