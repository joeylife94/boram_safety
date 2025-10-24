"""
Draft Products 테이블 생성 스크립트
"""
from database import engine, Base
from models.draft import DraftProduct

if __name__ == "__main__":
    print("Creating draft_products table...")
    Base.metadata.create_all(bind=engine, tables=[DraftProduct.__table__])
    print("✅ draft_products table created successfully!")
