import sqlite3
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Security Log Analyzer API")

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Path
DB_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "database", "security.db")
)


class LogEntry(BaseModel):
    timestamp: str
    ip: str
    event: str
    risk: str


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)

    conn = get_db()
    cursor = conn.cursor()

    # Create table if it does not exist
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            ip TEXT,
            event TEXT,
            risk TEXT
        )
    """)

    # Fix older database versions that may not have the event column
    cursor.execute("PRAGMA table_info(logs)")
    columns = [row[1] for row in cursor.fetchall()]

    if "event" not in columns:
        cursor.execute("ALTER TABLE logs ADD COLUMN event TEXT")

    if "timestamp" not in columns:
        cursor.execute("ALTER TABLE logs ADD COLUMN timestamp TEXT")

    if "ip" not in columns:
        cursor.execute("ALTER TABLE logs ADD COLUMN ip TEXT")

    if "risk" not in columns:
        cursor.execute("ALTER TABLE logs ADD COLUMN risk TEXT")

    # Add sample security logs if database is empty
    cursor.execute("SELECT COUNT(*) FROM logs")
    count = cursor.fetchone()[0]

    if count == 0:
        sample_data = [
            (
                "2026-08-10 10:00:00",
                "192.168.1.105",
                "Failed SSH Login",
                "High",
            ),
            (
                "2026-08-10 10:05:00",
                "10.0.0.12",
                "Unusual Traffic Spike",
                "Medium",
            ),
            (
                "2026-08-10 10:12:00",
                "172.16.0.4",
                "Port Scan Detected",
                "High",
            ),
            (
                "2026-08-10 10:20:00",
                "192.168.1.1",
                "User Login Success",
                "Low",
            ),
            (
                "2026-08-10 10:25:00",
                "10.0.0.15",
                "Multiple Auth Failures",
                "High",
            ),
        ]

        cursor.executemany(
            """
            INSERT INTO logs (timestamp, ip, event, risk)
            VALUES (?, ?, ?, ?)
            """,
            sample_data,
        )

    conn.commit()
    conn.close()


# Initialize database when application starts
init_db()


@app.get("/")
def root():
    return {
        "message": "Security Log Analyzer API",
        "status": "running",
        "database": "connected",
    }


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.get("/analytics")
def get_analytics():
    conn = get_db()

    logs = [
        dict(row)
        for row in conn.execute("SELECT * FROM logs").fetchall()
    ]

    conn.close()

    return {
        "total_logs": len(logs),
        "high_risk": sum(
            1 for log in logs if log["risk"] == "High"
        ),
        "medium_risk": sum(
            1 for log in logs if log["risk"] == "Medium"
        ),
        "low_risk": sum(
            1 for log in logs if log["risk"] == "Low"
        ),
    }


@app.get("/logs")
def get_logs():
    conn = get_db()

    logs = [
        dict(row)
        for row in conn.execute(
            "SELECT * FROM logs ORDER BY id DESC"
        ).fetchall()
    ]

    conn.close()

    return {"logs": logs}


@app.post("/logs")
def add_log(entry: LogEntry):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO logs (timestamp, ip, event, risk)
        VALUES (?, ?, ?, ?)
        """,
        (
            entry.timestamp,
            entry.ip,
            entry.event,
            entry.risk,
        ),
    )

    conn.commit()
    conn.close()

    return {
        "status": "success",
        "message": "New security log detected and recorded!",
    }


@app.get("/incidents")
def get_incidents():
    conn = get_db()

    incidents = [
        dict(row)
        for row in conn.execute(
            """
            SELECT * FROM logs
            WHERE risk IN ('High', 'Medium')
            ORDER BY id DESC
            """
        ).fetchall()
    ]

    conn.close()

    return {"incidents": incidents}


@app.get("/reports")
def get_reports():
    conn = get_db()

    total = conn.execute(
        "SELECT COUNT(*) FROM logs"
    ).fetchone()[0]

    conn.close()

    return {
        "summary": "Automated Security Assessment",
        "total_events_analyzed": total,
        "risk_level": "Elevated",
        "status": "Generated",
    }
