from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from backend.database import Base

class CompanyInfo(Base):
    __tablename__ = "company_info"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text)
    address = Column(String(500))
    phone = Column(String(20))
    email = Column(String(100))
    business_hours = Column(String(200))
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class History(Base):
    __tablename__ = "company_history"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    order = Column(Integer, default=0)

class Certification(Base):
    __tablename__ = "company_certifications"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    issuer = Column(String(200))
    issue_date = Column(DateTime)
    description = Column(Text)
    image_url = Column(String(500))
    order = Column(Integer, default=0)

class Client(Base):
    __tablename__ = "company_clients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    logo_url = Column(String(500))
    description = Column(Text)
    order = Column(Integer, default=0) 