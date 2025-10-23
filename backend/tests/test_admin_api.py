"""
Admin API 테스트
POST, PUT, DELETE 엔드포인트 테스트 (제품 및 카테고리 관리)
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from models.safety import SafetyCategory, SafetyProduct

def test_create_category(client: TestClient):
    """카테고리 생성 테스트"""
    category_data = {
        "name": "안전장갑",
        "code": "safety_gloves",
        "slug": "safety_gloves",
        "description": "손을 보호하는 안전장갑",
        "display_order": 2,
        "image": "/images/gloves/default.jpg",
        "image_count": 10
    }
    response = client.post("/api/admin/categories", json=category_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "안전장갑"
    assert data["code"] == "safety_gloves"
    assert "id" in data

def test_update_category(client: TestClient, sample_category: SafetyCategory):
    """카테고리 수정 테스트"""
    update_data = {
        "name": "프리미엄 안전모",
        "description": "고급 안전모"
    }
    response = client.put(f"/api/admin/categories/{sample_category.id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "프리미엄 안전모"
    assert data["description"] == "고급 안전모"

def test_delete_category(client: TestClient, sample_category: SafetyCategory):
    """카테고리 삭제 테스트"""
    response = client.delete(f"/api/admin/categories/{sample_category.id}")
    assert response.status_code == 200
    
    # 삭제 확인
    response = client.get(f"/api/categories/{sample_category.id}")
    assert response.status_code == 404

def test_create_product(client: TestClient, sample_category: SafetyCategory):
    """제품 생성 테스트"""
    product_data = {
        "category_id": sample_category.id,
        "name": "신규 안전모",
        "model_number": "NEW-001",
        "description": "새로운 안전모",
        "price": 30000,
        "file_name": "new.jpg",
        "file_path": "/images/new.jpg",
        "stock_status": "in_stock"
    }
    response = client.post("/api/admin/products", json=product_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "신규 안전모"
    assert data["model_number"] == "NEW-001"
    assert data["price"] == 30000
    assert "id" in data

def test_create_product_missing_required_field(client: TestClient, sample_category: SafetyCategory):
    """필수 필드 누락 시 제품 생성 실패 테스트"""
    product_data = {
        "category_id": sample_category.id,
        "name": "불완전한 제품",
        # model_number 누락
    }
    response = client.post("/api/admin/products", json=product_data)
    assert response.status_code == 422  # Validation Error

def test_update_product(client: TestClient, sample_product: SafetyProduct):
    """제품 수정 테스트"""
    update_data = {
        "name": "업데이트된 안전모",
        "price": 35000,
        "description": "업데이트된 설명"
    }
    response = client.put(f"/api/admin/products/{sample_product.id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "업데이트된 안전모"
    assert data["price"] == 35000
    assert data["description"] == "업데이트된 설명"

def test_update_product_not_found(client: TestClient):
    """존재하지 않는 제품 수정 시도"""
    update_data = {"name": "존재하지 않는 제품"}
    response = client.put("/api/admin/products/999", json=update_data)
    assert response.status_code == 404

def test_delete_product(client: TestClient, sample_product: SafetyProduct):
    """제품 삭제 테스트"""
    response = client.delete(f"/api/admin/products/{sample_product.id}")
    assert response.status_code == 200
    
    # 삭제 확인
    response = client.get(f"/api/products/{sample_product.id}")
    assert response.status_code == 404

def test_bulk_create_products(client: TestClient, test_db: Session, sample_category: SafetyCategory):
    """여러 제품 일괄 생성 테스트"""
    products = []
    for i in range(5):
        product_data = {
            "category_id": sample_category.id,
            "name": f"제품 {i+1}",
            "model_number": f"BULK-{i+1:03d}",
            "description": f"대량 생성 테스트 제품 {i+1}",
            "price": 10000 * (i + 1),
            "file_name": f"bulk_{i+1}.jpg",
            "file_path": f"/images/bulk_{i+1}.jpg",
            "stock_status": "in_stock"
        }
        response = client.post("/api/admin/products", json=product_data)
        assert response.status_code == 200
        products.append(response.json())
    
    # 생성 확인
    response = client.get("/api/products")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 5

def test_update_product_stock_status(client: TestClient, sample_product: SafetyProduct):
    """재고 상태 변경 테스트"""
    update_data = {"stock_status": "out_of_stock"}
    response = client.put(f"/api/admin/products/{sample_product.id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["stock_status"] == "out_of_stock"

def test_toggle_featured_product(client: TestClient, sample_product: SafetyProduct):
    """추천 제품 토글 테스트"""
    # 추천 해제
    update_data = {"is_featured": False}
    response = client.put(f"/api/admin/products/{sample_product.id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["is_featured"] is False
    
    # 다시 추천 설정
    update_data = {"is_featured": True}
    response = client.put(f"/api/admin/products/{sample_product.id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["is_featured"] is True
