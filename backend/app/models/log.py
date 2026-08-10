from sqlalchemy import Column, Integer, String
from app.database.database import Base


class Log(Base):
    __tablename__ = "logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(String)
    level = Column(String)
    user = Column(String, nullable=True)
    action = Column(String)
    status = Column(String, nullable=True)
    ip = Column(String)
    provider = Column(String, nullable=True)
    service = Column(String, nullable=True)
    method = Column(String, nullable=True)
    path = Column(String, nullable=True)