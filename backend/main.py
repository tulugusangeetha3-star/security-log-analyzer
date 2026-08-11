from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from datetime import datetime

app = FastAPI(title="Security Log Analyzer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security_logs = []

class LogEntry(BaseModel):
    ip_address: str
    event_description: str
    risk_severity: str

class LogResponse(LogEntry):
    id: int
    timestamp: str

@app.get("/")
def read_root():
    return {"status": "online", "message": "Backend connected successfully"}

@app.get("/logs", response_model=List[LogResponse])
def get_logs():
    return security_logs

@app.post("/logs", response_model=LogResponse, status_code=status.HTTP_201_CREATED)
def create_log(log: LogEntry):
    new_log = {
        "id": len(security_logs) + 1,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "ip_address": log.ip_address,
        "event_description": log.event_description,
        "risk_severity": log.risk_severity,
    }
    security_logs.append(new_log)
    return new_log

@app.get("/incidents")
def get_incidents():
    return [log for log in security_logs if log["risk_severity"].lower() == "high"]

@app.get("/reports")
def get_reports():
    return {
        "primary_threat_vector": "Brute Force Authentication",
        "rule_engine_status": "Generated",
        "total_analyzed": len(security_logs)
    }

@app.get("/analytics")
def get_analytics():
    return {
        "total_logs": len(security_logs),
        "high_risk": sum(1 for log in security_logs if log["risk_severity"].lower() == "high"),
        "medium_risk": sum(1 for log in security_logs if log["risk_severity"].lower() == "medium"),
        "low_risk": sum(1 for log in security_logs if log["risk_severity"].lower() == "low")
    }
