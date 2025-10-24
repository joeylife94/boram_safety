"""
Audit Log 테이블 생성 스크립트
"""
from database import Base, engine
from models.audit import AuditLog
from models.safety import SafetyProduct, SafetyCategory

if __name__ == "__main__":
    print("Creating audit_logs table...")
    Base.metadata.create_all(bind=engine)
    print("✅ audit_logs table created successfully!")
