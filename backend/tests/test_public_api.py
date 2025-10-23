"""
Public API 테스트
GET 엔드포인트 테스트 (카테고리, 제품 조회)
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from models.safety import SafetyCategory, SafetyProduct

def test_get_root(client: TestClient):
    """루트 엔드포인트 테스트"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "보람안전" in data["message"]
    assert data["status"] == "running"

def test_get_categories_empty(client: TestClient):
    """빈 카테고리 리스트 조회"""
    response = client.get("/api/categories")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 0

def test_get_categories_with_data(client: TestClient, sample_category: SafetyCategory):
    """카테고리 리스트 조회 (데이터 있음)"""
    response = client.get("/api/categories")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 1
    assert data[0]["name"] == "안전모"
    assert data[0]["code"] == "safety_helmet"
    assert data[0]["slug"] == "safety_helmet"

def test_get_category_by_id(client: TestClient, sample_category: SafetyCategory):
    """ID로 카테고리 조회"""
    response = client.get(f"/api/categories/{sample_category.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == sample_category.id
    assert data["name"] == "안전모"
    assert data["code"] == "safety_helmet"

def test_get_category_not_found(client: TestClient):
    """존재하지 않는 카테고리 조회"""
    response = client.get("/api/categories/999")
    assert response.status_code == 404

def test_get_category_by_slug(client: TestClient, sample_category: SafetyCategory):
    """Slug로 카테고리 조회"""
    response = client.get(f"/api/categories/slug/{sample_category.slug}")
    assert response.status_code == 200
    data = response.json()
    assert data["slug"] == "safety_helmet"
    assert data["name"] == "안전모"

def test_get_products_empty(client: TestClient):
    """빈 제품 리스트 조회"""
    response = client.get("/api/products")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 0

def test_get_products_with_data(client: TestClient, sample_product: SafetyProduct):
    """제품 리스트 조회 (데이터 있음)"""
    response = client.get("/api/products")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 1
    assert data[0]["name"] == "테스트 안전모"
    assert data[0]["model_number"] == "TEST-001"

def test_get_product_by_id(client: TestClient, sample_product: SafetyProduct):
    """ID로 제품 조회"""
    response = client.get(f"/api/products/{sample_product.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == sample_product.id
    assert data["name"] == "테스트 안전모"
    assert data["price"] == 25000

def test_get_product_not_found(client: TestClient):
    """존재하지 않는 제품 조회"""
    response = client.get("/api/products/999")
    assert response.status_code == 404

def test_get_products_by_category(client: TestClient, sample_category: SafetyCategory, sample_product: SafetyProduct):
    """카테고리별 제품 조회"""
    response = client.get(f"/api/products?category_id={sample_category.id}")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 1
    assert data[0]["category_id"] == sample_category.id

def test_get_featured_products(client: TestClient, sample_product: SafetyProduct):
    """추천 제품 조회"""
    response = client.get("/api/products?is_featured=true")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 1
    assert data[0]["is_featured"] is True

def test_search_products(client: TestClient, sample_product: SafetyProduct):
    """제품 검색"""
    response = client.get("/api/products/search?q=안전모")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1

def test_pagination(client: TestClient, test_db: Session, sample_category: SafetyCategory):
    """페이지네이션 테스트"""
    # 10개의 제품 생성
    for i in range(10):
        product = SafetyProduct(
            category_id=sample_category.id,
            name=f"테스트 제품 {i+1}",
            model_number=f"TEST-{i+1:03d}",
            description=f"테스트용 제품 {i+1}",
            price=10000 * (i + 1),
            file_name=f"test_{i+1}.jpg",
            file_path=f"/images/test_{i+1}.jpg",
            stock_status="in_stock"
        )
        test_db.add(product)
    test_db.commit()
    
    # 첫 페이지 조회 (limit=5)
    response = client.get("/api/products?skip=0&limit=5")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 5
    
    # 두 번째 페이지 조회
    response = client.get("/api/products?skip=5&limit=5")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 5
