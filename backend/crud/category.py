from sqlalchemy.orm import Session
from typing import List, Optional
from backend.models.safety import SafetyCategory, SafetyProduct
from backend.schemas.category import CategoryCreate, CategoryUpdate

def get_category_count(db: Session) -> int:
    """총 카테고리 수를 반환합니다."""
    return db.query(SafetyCategory).count()

def get_categories(db: Session, skip: int = 0, limit: int = 100) -> List[SafetyCategory]:
    """카테고리 목록을 조회합니다."""
    return db.query(SafetyCategory).order_by(SafetyCategory.display_order).offset(skip).limit(limit).all()

def get_category(db: Session, category_id: int) -> Optional[SafetyCategory]:
    """특정 카테고리를 조회합니다."""
    return db.query(SafetyCategory).filter(SafetyCategory.id == category_id).first()

def get_category_by_code(db: Session, category_code: str) -> Optional[SafetyCategory]:
    """카테고리 코드로 카테고리를 조회합니다."""
    return db.query(SafetyCategory).filter(SafetyCategory.code == category_code).first()

def create_category(db: Session, category: CategoryCreate) -> SafetyCategory:
    """새로운 카테고리를 생성합니다."""
    db_category = SafetyCategory(**category.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

def update_category(db: Session, category_id: int, category: CategoryUpdate) -> Optional[SafetyCategory]:
    """카테고리 정보를 수정합니다."""
    db_category = db.query(SafetyCategory).filter(SafetyCategory.id == category_id).first()
    if db_category:
        for key, value in category.dict(exclude_unset=True).items():
            setattr(db_category, key, value)
        db.commit()
        db.refresh(db_category)
    return db_category

def delete_category(db: Session, category_id: int) -> Optional[SafetyCategory]:
    """카테고리를 삭제합니다."""
    # 먼저 해당 카테고리에 속한 제품이 있는지 확인
    products_count = db.query(SafetyProduct).filter(SafetyProduct.category_id == category_id).count()
    if products_count > 0:
        raise ValueError(f"카테고리에 {products_count}개의 제품이 있어 삭제할 수 없습니다.")
    
    db_category = db.query(SafetyCategory).filter(SafetyCategory.id == category_id).first()
    if db_category:
        db.delete(db_category)
        db.commit()
    return db_category 