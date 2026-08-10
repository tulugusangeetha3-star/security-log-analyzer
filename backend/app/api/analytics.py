from fastapi import APIRouter
from app.services.log_parser import parse_log_file
from app.services.detection_engine import detect_threats
from app.services.risk_engine import calculate_risk

router = APIRouter()


@router.get("/analytics")
def get_analytics():

    files = [
        "../data/sample_logs/auth.log",
        "../data/sample_logs/web.log",
        "../data/sample_logs/cloud.log"
    ]

    all_logs = []
    all_alerts = []

    for file in files:
        logs = parse_log_file(file)
        all_logs.extend(logs)

        alerts = detect_threats(logs)
        risks = calculate_risk(alerts)
        all_alerts.extend(risks)

    critical = 0
    high = 0
    medium = 0
    low = 0

    for alert in all_alerts:
        level = alert.get("risk_level")

        if level == "CRITICAL":
            critical += 1
        elif level == "HIGH":
            high += 1
        elif level == "MEDIUM":
            medium += 1
        elif level == "LOW":
            low += 1

    return {
        "total_logs": len(all_logs),
        "total_alerts": len(all_alerts),
        "critical": critical,
        "high": high,
        "medium": medium,
        "low": low
    }