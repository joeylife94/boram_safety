"""
SQLite에서 PostgreSQL로 데이터 마이그레이션 스크립트
"""

import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from backend.models.safety import SafetyCategory, SafetyProduct, Base

# SQLite 연결
sqlite_url = "sqlite:///./safety.db"
sqlite_engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})
SQLiteSession = sessionmaker(bind=sqlite_engine)

# PostgreSQL 연결
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "ava1142")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_NAME = os.getenv("DB_NAME", "boram_safety")
DB_PORT = os.getenv("DB_PORT", "5432")

postgres_url = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

def migrate_data():
    try:
        # PostgreSQL 엔진 생성
        postgres_engine = create_engine(postgres_url)
        PostgreSQLSession = sessionmaker(bind=postgres_engine)
        
        print("🚀 SQLite → PostgreSQL 데이터 마이그레이션 시작...")
        
        # PostgreSQL 테이블 생성
        print("📋 PostgreSQL 테이블 생성 중...")
        Base.metadata.drop_all(bind=postgres_engine)  # 기존 테이블 삭제
        Base.metadata.create_all(bind=postgres_engine)  # 새 테이블 생성
        
        # SQLite에서 데이터 읽기
        sqlite_session = SQLiteSession()
        postgres_session = PostgreSQLSession()
        
        try:
            # 카테고리 마이그레이션
            print("📂 카테고리 데이터 마이그레이션 중...")
            sqlite_categories = sqlite_session.query(SafetyCategory).all()
            
            for category in sqlite_categories:
                new_category = SafetyCategory(
                    name=category.name,
                    code=category.code,
                    slug=category.slug,
                    description=category.description,
                    image=category.image,
                    display_order=category.display_order,
                    image_count=category.image_count,
                    created_at=category.created_at,
                    updated_at=category.updated_at
                )
                postgres_session.add(new_category)
            
            postgres_session.commit()
            print(f"✅ {len(sqlite_categories)}개 카테고리 마이그레이션 완료")
            
            # 제품 마이그레이션
            print("📦 제품 데이터 마이그레이션 중...")
            sqlite_products = sqlite_session.query(SafetyProduct).all()
            
            for product in sqlite_products:
                new_product = SafetyProduct(
                    category_id=product.category_id,
                    name=product.name,
                    model_number=product.model_number,
                    price=product.price,
                    description=product.description,
                    specifications=product.specifications,
                    stock_status=product.stock_status,
                    file_name=product.file_name,
                    file_path=product.file_path,
                    display_order=product.display_order,
                    is_featured=product.is_featured,
                    created_at=product.created_at,
                    updated_at=product.updated_at
                )
                postgres_session.add(new_product)
            
            postgres_session.commit()
            print(f"✅ {len(sqlite_products)}개 제품 마이그레이션 완료")
            
            # 검증
            postgres_categories = postgres_session.query(SafetyCategory).count()
            postgres_products = postgres_session.query(SafetyProduct).count()
            
            print(f"\n🎉 마이그레이션 완료!")
            print(f"📊 최종 결과:")
            print(f"  - 카테고리: {postgres_categories}개")
            print(f"  - 제품: {postgres_products}개")
            
        except Exception as e:
            postgres_session.rollback()
            print(f"❌ 마이그레이션 중 오류 발생: {e}")
            raise
        finally:
            sqlite_session.close()
            postgres_session.close()
            
    except Exception as e:
        print(f"❌ PostgreSQL 연결 실패: {e}")
        print("PostgreSQL 서버가 실행 중인지 확인하세요.")
        sys.exit(1)

if __name__ == "__main__":
    migrate_data() 