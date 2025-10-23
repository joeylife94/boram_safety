"""
pytest 테스트 설정 파일
테스트용 데이터베이스 및 FastAPI 클라이언트 설정
"""
import os
import sys
import pytest
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient

# 상위 디렉토리를 sys.path에 추가
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import Base, get_db
from main import app
from models.safety import SafetyCategory, SafetyProduct

# 테스트용 인메모리 SQLite 데이터베이스 설정
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///:memory:"

@pytest.fixture(scope="function")
def test_db() -> Generator[Session, None, None]:
    """
    테스트용 데이터베이스 세션 생성
    각 테스트마다 새로운 데이터베이스 생성 및 삭제
    """
    # 인메모리 SQLite 엔진 생성
    engine = create_engine(
        SQLALCHEMY_TEST_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    
    # 테이블 생성
    Base.metadata.create_all(bind=engine)
    
    # 세션 생성
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = TestingSessionLocal()
    
    try:
        yield session
    finally:
        session.close()
        # 테이블 삭제
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(test_db: Session) -> Generator[TestClient, None, None]:
    """
    FastAPI 테스트 클라이언트 생성
    테스트용 데이터베이스 사용
    """
    def override_get_db():
        try:
            yield test_db
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    
    # TestClient에 app을 직접 전달
    test_client = TestClient(app)
    yield test_client
    
    app.dependency_overrides.clear()

@pytest.fixture
def sample_category(test_db: Session) -> SafetyCategory:
    """테스트용 샘플 카테고리 생성"""
    category = SafetyCategory(
        name="안전모",
        code="safety_helmet",
        slug="safety_helmet",
        description="머리 보호를 위한 안전모",
        display_order=1,
        image="/images/safety_helmet/default.jpg",
        image_count=5
    )
    test_db.add(category)
    test_db.commit()
    test_db.refresh(category)
    return category

@pytest.fixture
def sample_product(test_db: Session, sample_category: SafetyCategory) -> SafetyProduct:
    """테스트용 샘플 제품 생성"""
    product = SafetyProduct(
        category_id=sample_category.id,
        name="테스트 안전모",
        model_number="TEST-001",
        description="테스트용 안전모입니다",
        price=25000,
        file_name="test.jpg",
        file_path="/images/safety_helmet/test.jpg",
        is_featured=1,
        stock_status="in_stock"
    )
    test_db.add(product)
    test_db.commit()
    test_db.refresh(product)
    return product
