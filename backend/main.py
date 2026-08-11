import sqlite3
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Security Log Analyzer API")

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# SQLite Database Path
DB_PATH = os.path.join(os.path.dirname(__file__), "..", "database", "security.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            ip TEXT,
            event TEXT,
            risk TEXT
        )
    ''')
    cursor.execute("SELECT COUNT(*) FROM logs")
    if cursor.fetchone()[0] == 0:
        sample_data = [
            ("2026-08-10 10:00:00", "192.168.1.105", "Failed SSH Login", "High"),
            ("2026-08-10 10:05:00", "10.0.0.12", "Unusual Traffic Spike", "Medium"),
            ("2026-08-10 10:12:00", "172.16.0.4", "Port Scan Detected", "High"),
            ("2026-08-10 10:20:00", "192.168.1.1", "User Login Success", "Low"),
            ("2026-08-10 10:25:00", "10.0.0.15", "Multiple Auth Failures", "High")
        ]
        cursor.executemany("INSERT INTO logs (timestamp, ip, event, risk) VALUES (?, ?, ?, ?)", sample_data)
        conn.commit()
    conn.close()

# Initialize Database on app startup
init_db()

@app.get("/")
def root():
    return {"message": "Security Log Analyzer API", "database": "connected"}

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.get("/analytics")
def get_analytics():
    conn = get_db()
    logs = [dict(row) for row in conn.execute("SELECT * FROM logs").fetchall()]
    conn.close()
    return {
        "total_logs": len(logs),
        "high_risk": sum(1 for log in logs if log["risk"] == "High"),
        "medium_risk": sum(1 for log in logs if log["risk"] == "Medium"),
        "low_risk": sum(1 for log in logs if log["risk"] == "Low")
    }

@app.get("/logs")
def get_logs():
    conn = get_db()
    logs = [dict(row) for row in conn.execute("SELECT * FROM logs").fetchall()]
    conn.close()
    return {"logs": logs}

@app.get("/incidents")
def get_incidents():
    conn = get_db()
    incidents = [dict(row) for row in conn.execute("SELECT * FROM logs WHERE risk IN ('High', 'Medium')").fetchall()]
    conn.close()
    return {"incidents": incidents}

@app.get("/reports")
def get_reports():
    conn = get_db()
    total = conn.execute("SELECT COUNT(*) FROM logs").fetchone()[0]
    conn.close()
    return {
        "summary": "Automated Security Assessment",
        "total_events_analyzed": total,
        "risk_level": "Elevated",
        "status": "Generated"
    }