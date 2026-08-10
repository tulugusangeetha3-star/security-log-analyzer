from fastapi import APIRouter

router = APIRouter()


@router.get("/logs")
def get_logs():
    return {"message": "Logs endpoint working"}


@router.get("/logs/alerts")
def get_alerts():
    return {"message": "Alerts endpoint working"}