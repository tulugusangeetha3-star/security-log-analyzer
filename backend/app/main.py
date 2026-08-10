from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Security Log Analyzer",
    version="1.0.0"
)

# Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5178",
        "http://127.0.0.1:5178",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Security Log Analyzer API",
        "status": "running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.get("/logs")
def get_logs():
    return {
        "logs": [
            {
                "id": 1,
                "ip": "192.168.1.10",
                "event": "Failed login",
                "severity": "Medium"
            },
            {
                "id": 2,
                "ip": "10.0.0.5",
                "event": "Port scan detected",
                "severity": "High"
            },
            {
                "id": 3,
                "ip": "172.16.0.20",
                "event": "Successful login",
                "severity": "Low"
            }
        ]
    }


@app.get("/analytics")
def analytics():
    return {
        "total_logs": 3,
        "high_risk": 1,
        "medium_risk": 1,
        "low_risk": 1
    }


@app.get("/incidents")
def incidents():
    return {
        "incidents": [
            {
                "id": 1,
                "title": "Port Scan",
                "severity": "High",
                "status": "Open"
            }
        ]
    }


@app.get("/reports")
def reports():
    return {
        "message": "Reports endpoint working"
    }