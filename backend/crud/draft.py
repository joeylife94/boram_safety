"""
Draft Product CRUD 함수
"""
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import Optional, Tuple, List
from datetime import datetime
import math

from models.draft import DraftProduct
from models.safety import SafetyProduct
from schemas.draft import DraftProductCreate, DraftProductUpdate


def create_draft(db: Session, draft: DraftProductCreate) -> DraftProduct:
    """Draft 생성"""
    db_draft = DraftProduct(**draft.dict(exclude_unset=True))
    db.add(db_draft)
    db.commit()
    db.refresh(db_draft)
    return db_draft


def get_draft(db: Session, draft_id: int) -> Optional[DraftProduct]:
    """특정 Draft 조회"""
    return db.query(DraftProduct).filter(DraftProduct.id == draft_id).first()


def get_drafts(
    db: Session,
    skip: int = 0,
    limit: int = 20,
    draft_status: Optional[str] = None,
    created_by: Optional[str] = None
) -> Tuple[List[DraftProduct], int]:
    """Draft 목록 조회"""
    query = db.query(DraftProduct)
    
    # 필터 적용
    if draft_status:
        query = query.filter(DraftProduct.draft_status == draft_status)
    if created_by:
        query = query.filter(DraftProduct.created_by == created_by)
    
    # 총 개수
    total = query.count()
    
    # 정렬 및 페이지네이션
    drafts = query.order_by(desc(DraftProduct.updated_at)).offset(skip).limit(limit).all()
    
    return drafts, total


def update_draft(
    db: Session,
    draft_id: int,
    draft_update: DraftProductUpdate,
    auto_save: bool = False
) -> Optional[DraftProduct]:
    """Draft 수정"""
    db_draft = get_draft(db, draft_id)
    if not db_draft:
        return None
    
    # 업데이트 데이터 적용
    update_data = draft_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_draft, key, value)
    
    # auto_save인 경우 타임스탬프 업데이트
    if auto_save:
        db_draft.last_auto_saved_at = datetime.utcnow()
    
    db.commit()
    db.refresh(db_draft)
    return db_draft


def delete_draft(db: Session, draft_id: int) -> bool:
    """Draft 삭제"""
    db_draft = get_draft(db, draft_id)
    if not db_draft:
        return False
    
    db.delete(db_draft)
    db.commit()
    return True


def publish_draft(
    db: Session,
    draft_id: int,
    delete_after_publish: bool = True
) -> Optional[SafetyProduct]:
    """
    Draft를 실제 제품으로 발행
    - product_id가 있으면 기존 제품 업데이트
    - product_id가 없으면 새 제품 생성
    """
    db_draft = get_draft(db, draft_id)
    if not db_draft:
        return None
    
    # 필수 필드 검증
    if not all([db_draft.name, db_draft.model_number, db_draft.category_id]):
        raise ValueError("필수 필드가 누락되었습니다: name, model_number, category_id")
    
    # 제품 데이터 준비
    product_data = {
        'name': db_draft.name,
        'model_number': db_draft.model_number,
        'category_id': db_draft.category_id,
        'description': db_draft.description,
        'specifications': db_draft.specifications,
        'price': db_draft.price,
        'stock_status': db_draft.stock_status or 'in_stock',
        'is_featured': db_draft.is_featured or False,
        'display_order': db_draft.display_order or 0,
        'file_name': db_draft.file_name,
        'file_path': db_draft.file_path
    }
    
    if db_draft.product_id:
        # 기존 제품 업데이트
        db_product = db.query(SafetyProduct).filter(SafetyProduct.id == db_draft.product_id).first()
        if db_product:
            for key, value in product_data.items():
                setattr(db_product, key, value)
        else:
            # 제품이 없으면 새로 생성
            db_product = SafetyProduct(**product_data)
            db.add(db_product)
    else:
        # 새 제품 생성
        db_product = SafetyProduct(**product_data)
        db.add(db_product)
    
    db.commit()
    db.refresh(db_product)
    
    # Draft 삭제
    if delete_after_publish:
        db.delete(db_draft)
        db.commit()
    
    return db_product


def get_draft_by_product_id(db: Session, product_id: int) -> Optional[DraftProduct]:
    """특정 제품의 Draft 조회 (수정 중인 Draft)"""
    return db.query(DraftProduct).filter(DraftProduct.product_id == product_id).first()


def create_draft_from_product(db: Session, product_id: int, created_by: Optional[str] = None) -> DraftProduct:
    """기존 제품에서 Draft 생성 (수정용)"""
    db_product = db.query(SafetyProduct).filter(SafetyProduct.id == product_id).first()
    if not db_product:
        raise ValueError(f"제품 ID {product_id}를 찾을 수 없습니다")
    
    # 제품 데이터를 Draft로 복사
    draft_data = {
        'name': db_product.name,
        'model_number': db_product.model_number,
        'category_id': db_product.category_id,
        'description': db_product.description,
        'specifications': db_product.specifications,
        'price': db_product.price,
        'stock_status': db_product.stock_status,
        'is_featured': db_product.is_featured,
        'display_order': db_product.display_order,
        'file_name': db_product.file_name,
        'file_path': db_product.file_path,
        'product_id': product_id,
        'draft_status': 'draft',
        'created_by': created_by
    }
    
    db_draft = DraftProduct(**draft_data)
    db.add(db_draft)
    db.commit()
    db.refresh(db_draft)
    return db_draft
