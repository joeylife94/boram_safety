from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from models.safety import SafetyProduct, SafetyCategory
from schemas.product import ProductCreate, ProductUpdate

def get_product_count(db: Session) -> int:
    """총 제품 수를 반환합니다."""
    return db.query(SafetyProduct).count()

def get_featured_product_count(db: Session) -> int:
    """추천 제품 수를 반환합니다."""
    return db.query(SafetyProduct).filter(SafetyProduct.is_featured == 1).count()

def get_products(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    category_code: Optional[str] = None,
    search: Optional[str] = None
) -> List[dict]:
    """제품 목록을 조회합니다 (카테고리 정보 포함)."""
    # 제품과 카테고리를 JOIN하여 조회
    query = db.query(
        SafetyProduct.id,
        SafetyProduct.name,
        SafetyProduct.model_number,
        SafetyProduct.category_id,
        SafetyProduct.description,
        SafetyProduct.specifications,
        SafetyProduct.price,
        SafetyProduct.stock_status,
        SafetyProduct.is_featured,
        SafetyProduct.display_order,
        SafetyProduct.file_name,
        SafetyProduct.file_path,
        SafetyProduct.created_at,
        SafetyProduct.updated_at,
        SafetyCategory.code.label('category_code'),
        SafetyCategory.name.label('category_name')
    ).join(SafetyCategory, SafetyProduct.category_id == SafetyCategory.id)
    
    if category_code:
        query = query.filter(SafetyCategory.code == category_code)
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            SafetyProduct.name.ilike(search_term) |
            SafetyProduct.description.ilike(search_term) |
            SafetyProduct.model_number.ilike(search_term)
        )
    
    # 정렬: 1) category_id, 2) is_featured (1이 먼저), 3) name
    results = query.order_by(
        SafetyProduct.category_id,
        SafetyProduct.is_featured.desc(),  # 1이 먼저 오도록 내림차순
        SafetyProduct.name
    ).offset(skip).limit(limit).all()
    
    # 결과를 dict 형태로 변환
    products = []
    for row in results:
        product = {
            'id': row.id,
            'name': row.name,
            'model_number': row.model_number,
            'category_id': row.category_id,
            'description': row.description,
            'specifications': row.specifications,
            'price': row.price,
            'stock_status': row.stock_status,
            'is_featured': row.is_featured,
            'display_order': row.display_order,
            'file_name': row.file_name,
            'file_path': row.file_path,
            'created_at': row.created_at,
            'updated_at': row.updated_at,
            'category_code': row.category_code,
            'category_name': row.category_name
        }
        products.append(product)
    
    return products

def get_product(db: Session, product_id: int) -> Optional[dict]:
    """특정 제품을 조회합니다 (카테고리 정보 포함)."""
    result = db.query(
        SafetyProduct.id,
        SafetyProduct.name,
        SafetyProduct.model_number,
        SafetyProduct.category_id,
        SafetyProduct.description,
        SafetyProduct.specifications,
        SafetyProduct.price,
        SafetyProduct.stock_status,
        SafetyProduct.is_featured,
        SafetyProduct.display_order,
        SafetyProduct.file_name,
        SafetyProduct.file_path,
        SafetyProduct.created_at,
        SafetyProduct.updated_at,
        SafetyCategory.code.label('category_code'),
        SafetyCategory.name.label('category_name')
    ).join(SafetyCategory, SafetyProduct.category_id == SafetyCategory.id).filter(SafetyProduct.id == product_id).first()
    
    if result:
        return {
            'id': result.id,
            'name': result.name,
            'model_number': result.model_number,
            'category_id': result.category_id,
            'description': result.description,
            'specifications': result.specifications,
            'price': result.price,
            'stock_status': result.stock_status,
            'is_featured': result.is_featured,
            'display_order': result.display_order,
            'file_name': result.file_name,
            'file_path': result.file_path,
            'created_at': result.created_at,
            'updated_at': result.updated_at,
            'category_code': result.category_code,
            'category_name': result.category_name
        }
    return None

def create_product(db: Session, product: ProductCreate) -> SafetyProduct:
    """새로운 제품을 생성합니다."""
    db_product = SafetyProduct(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def update_product(db: Session, product_id: int, product: ProductUpdate) -> Optional[SafetyProduct]:
    """제품 정보를 수정합니다."""
    db_product = db.query(SafetyProduct).filter(SafetyProduct.id == product_id).first()
    if db_product:
        for key, value in product.dict(exclude_unset=True).items():
            setattr(db_product, key, value)
        db.commit()
        db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: int) -> Optional[SafetyProduct]:
    """제품을 삭제합니다 (연관된 이미지 파일도 함께 삭제)."""
    import os
    import json
    from pathlib import Path
    
    db_product = db.query(SafetyProduct).filter(SafetyProduct.id == product_id).first()
    if db_product:
        # 연관된 이미지 파일들 삭제
        if db_product.file_path:
            try:
                # JSON 배열로 저장된 경우
                image_paths = json.loads(db_product.file_path)
                if isinstance(image_paths, list):
                    for image_path in image_paths:
                        if image_path and image_path.startswith('/images/'):
                            # /images/ 경로를 실제 파일 시스템 경로로 변환
                            file_path = Path("../frontend/public") / image_path.lstrip('/')
                            if file_path.exists():
                                try:
                                    os.remove(file_path)
                                    print(f"이미지 파일 삭제됨: {file_path}")
                                except Exception as e:
                                    print(f"이미지 파일 삭제 실패: {file_path}, 오류: {e}")
                else:
                    # 단일 경로인 경우
                    image_path = str(image_paths)
                    if image_path.startswith('/images/'):
                        file_path = Path("../frontend/public") / image_path.lstrip('/')
                        if file_path.exists():
                            try:
                                os.remove(file_path)
                                print(f"이미지 파일 삭제됨: {file_path}")
                            except Exception as e:
                                print(f"이미지 파일 삭제 실패: {file_path}, 오류: {e}")
            except (json.JSONDecodeError, TypeError):
                # JSON 파싱 실패시 단일 경로로 처리
                if db_product.file_path.startswith('/images/'):
                    file_path = Path("../frontend/public") / db_product.file_path.lstrip('/')
                    if file_path.exists():
                        try:
                            os.remove(file_path)
                            print(f"이미지 파일 삭제됨: {file_path}")
                        except Exception as e:
                            print(f"이미지 파일 삭제 실패: {file_path}, 오류: {e}")
        
        # 데이터베이스에서 제품 삭제
        db.delete(db_product)
        db.commit()
    return db_product

def get_search_suggestions(db: Session, query: str, limit: int = 5) -> List[str]:
    """검색 제안을 반환합니다."""
    search_term = f"%{query}%"
    results = db.query(SafetyProduct.name).filter(
        SafetyProduct.name.ilike(search_term)
    ).limit(limit).all()
    
    return [result.name for result in results] 