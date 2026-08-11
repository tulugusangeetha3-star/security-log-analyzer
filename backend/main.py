from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

app = FastAPI(title="Security Log Analyzer API")

# --- CORS Configuration ---
# Allows frontend applications (Render / localhost) to make API requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust to specific frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Data Schemas ---
class LogCreate(BaseModel):
    ip: str
    event: str
    risk: str

class LogItem(BaseModel):
    id: int
    timestamp: str
    ip: str
    event: str
    risk: str

# --- In-Memory Database / Sample Data ---
logs_db: List[dict] = [
    {
        "id": 1,
        "timestamp": "2026-08-11 07:15:00",
        "ip": "192.168.1.105",
        "event": "Unauthorized SSH Attempt",
        "risk": "High"
    },
    {
        "id": 2,
        "timestamp": "2026-08-11 07:20:12",
        "ip": "10.0.0.15",
        "event": "Port Scan Detected",
        "risk": "Medium"
    },
    {
        "id": 3,
        "timestamp": "2026-08-11 07:30:45",
        "ip": "192.168.1.50",
        "event": "Successful User Login",
        "risk": "Low"
    }
]

# --- API Endpoints ---

@app.get("/")
def read_root():
    return {"message": "Security Log Analyzer API is running"}

@app.get("/health")
def get_health():
    return {"status": "healthy"}

@app.get("/logs")
def get_logs():
    return {"logs": logs_db}

@app.post("/logs")
def create_log(log_data: LogCreate):
    new_id = len(logs_db) + 1 if logs_db else 1
    new_log = {
        "id": new_id,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "ip": log_data.ip,
        "event": log_data.event,
        "risk": log_data.risk
    }
    logs_db.insert(0, new_log)  # Prepend newest log
    return {"message": "Log recorded successfully", "log": new_log}

@app.get("/analytics")
def get_analytics():
    total_logs = len(logs_db)
    high_risk = sum(1 for log in logs_db if log.get("risk") == "High")
    medium_risk = sum(1 for log in logs_db if log.get("risk") == "Medium")
    low_risk = sum(1 for log in logs_db if log.get("risk") == "Low")

    return {
        "total_logs": total_logs,
        "high_risk": high_risk,
        "medium_risk": medium_risk,
        "low_risk": low_risk
    }

@app.get("/incidents")
def get_incidents():
    high_risk_incidents = [log for log in logs_db if log.get("risk") == "High"]
    return {"incidents": high_risk_incidents}

@app.get("/reports")
def get_reports():
    return {
        "top_threat": "Brute Force Authentication / SSH Attempts",
        "status": "Active - Real-time Log Stream Monitoring Enabled",
        "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }