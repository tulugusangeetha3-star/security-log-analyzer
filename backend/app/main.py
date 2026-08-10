from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Security Log Analyzer API")

# FIX: Allow CORS requests from deployed frontend on Render
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from https://security-log-analyzer-web-2026.onrender.com
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Sample Security Logs
SAMPLE_LOGS = [
    {"id": 1, "timestamp": "2026-08-10 10:00:00", "ip": "192.168.1.105", "event": "Failed SSH Login", "risk": "High"},
    {"id": 2, "timestamp": "2026-08-10 10:05:00", "ip": "10.0.0.12", "event": "Unusual Traffic Spike", "risk": "Medium"},
    {"id": 3, "timestamp": "2026-08-10 10:12:00", "ip": "172.16.0.4", "event": "Port Scan Detected", "risk": "High"},
    {"id": 4, "timestamp": "2026-08-10 10:20:00", "ip": "192.168.1.1", "event": "User Login Success", "risk": "Low"},
    {"id": 5, "timestamp": "2026-08-10 10:25:00", "ip": "10.0.0.15", "event": "Multiple Auth Failures", "risk": "High"},
]

@app.get("/")
def root():
    return {"message": "Security Log Analyzer API", "status": "running"}

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.get("/analytics")
def get_analytics():
    return {
        "total_logs": len(SAMPLE_LOGS),
        "high_risk": sum(1 for log in SAMPLE_LOGS if log["risk"] == "High"),
        "medium_risk": sum(1 for log in SAMPLE_LOGS if log["risk"] == "Medium"),
        "low_risk": sum(1 for log in SAMPLE_LOGS if log["risk"] == "Low")
    }

@app.get("/logs")
def get_logs():
    return {"logs": SAMPLE_LOGS}

@app.get("/incidents")
def get_incidents():
    incidents = [log for log in SAMPLE_LOGS if log["risk"] in ["High", "Medium"]]
    return {"incidents": incidents}

@app.get("/reports")
def get_reports():
    return {
        "summary": "Automated Security Assessment",
        "total_events_analyzed": len(SAMPLE_LOGS),
        "risk_level": "Elevated",
        "status": "Generated"
    }