from sqlalchemy import Column, Integer, String
from app.database.database import Base


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String)
    severity = Column(String)
    message = Column(String)
    ip = Column(String, nullable=True)
    user = Column(String, nullable=True)
    risk_score = Column(Integer)
    risk_level = Column(String)
    status = Column(String, default="OPEN")