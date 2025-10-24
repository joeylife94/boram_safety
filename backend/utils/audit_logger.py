"""
Audit Log 헬퍼 함수
제품/카테고리 변경 시 자동으로 Audit Log를 기록하는 유틸리티
"""
from sqlalchemy.orm import Session
from typing import Optional, Any
from fastapi import Request

from crud import audit as audit_crud
from models.audit import AuditAction, AuditEntityType


def log_product_create(
    db: Session,
    product_id: int,
    product_data: dict,
    request: Optional[Request] = None
):
    """제품 생성 로그"""
    audit_crud.create_audit_log(
        db=db,
        entity_type=AuditEntityType.PRODUCT,
        entity_id=product_id,
        action=AuditAction.CREATE,
        new_values=product_data,
        changes_summary=f"제품 생성: {product_data.get('name', 'Unknown')}",
        ip_address=request.client.host if request and request.client else None,
        user_agent=request.headers.get("user-agent") if request else None
    )


def log_product_update(
    db: Session,
    product_id: int,
    old_data: dict,
    new_data: dict,
    request: Optional[Request] = None
):
    """제품 수정 로그"""
    changes_summary = audit_crud.generate_changes_summary(old_data, new_data)
    
    audit_crud.create_audit_log(
        db=db,
        entity_type=AuditEntityType.PRODUCT,
        entity_id=product_id,
        action=AuditAction.UPDATE,
        old_values=old_data,
        new_values=new_data,
        changes_summary=changes_summary,
        ip_address=request.client.host if request and request.client else None,
        user_agent=request.headers.get("user-agent") if request else None
    )


def log_product_delete(
    db: Session,
    product_id: int,
    product_data: dict,
    request: Optional[Request] = None
):
    """제품 삭제 로그"""
    audit_crud.create_audit_log(
        db=db,
        entity_type=AuditEntityType.PRODUCT,
        entity_id=product_id,
        action=AuditAction.DELETE,
        old_values=product_data,
        changes_summary=f"제품 삭제: {product_data.get('name', 'Unknown')}",
        ip_address=request.client.host if request and request.client else None,
        user_agent=request.headers.get("user-agent") if request else None
    )


def log_bulk_update(
    db: Session,
    entity_type: AuditEntityType,
    count: int,
    summary: str,
    request: Optional[Request] = None
):
    """대량 수정 로그"""
    audit_crud.create_audit_log(
        db=db,
        entity_type=entity_type,
        entity_id=None,
        action=AuditAction.BULK_UPDATE,
        changes_summary=f"{summary} ({count}건)",
        ip_address=request.client.host if request and request.client else None,
        user_agent=request.headers.get("user-agent") if request else None
    )


def log_bulk_delete(
    db: Session,
    entity_type: AuditEntityType,
    count: int,
    summary: str,
    request: Optional[Request] = None
):
    """대량 삭제 로그"""
    audit_crud.create_audit_log(
        db=db,
        entity_type=entity_type,
        entity_id=None,
        action=AuditAction.BULK_DELETE,
        changes_summary=f"{summary} ({count}건)",
        ip_address=request.client.host if request and request.client else None,
        user_agent=request.headers.get("user-agent") if request else None
    )


def log_category_create(
    db: Session,
    category_id: int,
    category_data: dict,
    request: Optional[Request] = None
):
    """카테고리 생성 로그"""
    audit_crud.create_audit_log(
        db=db,
        entity_type=AuditEntityType.CATEGORY,
        entity_id=category_id,
        action=AuditAction.CREATE,
        new_values=category_data,
        changes_summary=f"카테고리 생성: {category_data.get('name', 'Unknown')}",
        ip_address=request.client.host if request and request.client else None,
        user_agent=request.headers.get("user-agent") if request else None
    )


def log_category_update(
    db: Session,
    category_id: int,
    old_data: dict,
    new_data: dict,
    request: Optional[Request] = None
):
    """카테고리 수정 로그"""
    changes_summary = audit_crud.generate_changes_summary(old_data, new_data)
    
    audit_crud.create_audit_log(
        db=db,
        entity_type=AuditEntityType.CATEGORY,
        entity_id=category_id,
        action=AuditAction.UPDATE,
        old_values=old_data,
        new_values=new_data,
        changes_summary=changes_summary,
        ip_address=request.client.host if request and request.client else None,
        user_agent=request.headers.get("user-agent") if request else None
    )


def log_category_delete(
    db: Session,
    category_id: int,
    category_data: dict,
    request: Optional[Request] = None
):
    """카테고리 삭제 로그"""
    audit_crud.create_audit_log(
        db=db,
        entity_type=AuditEntityType.CATEGORY,
        entity_id=category_id,
        action=AuditAction.DELETE,
        old_values=category_data,
        changes_summary=f"카테고리 삭제: {category_data.get('name', 'Unknown')}",
        ip_address=request.client.host if request and request.client else None,
        user_agent=request.headers.get("user-agent") if request else None
    )


def model_to_dict(model: Any, exclude: list = None) -> dict:
    """SQLAlchemy 모델을 딕셔너리로 변환"""
    if exclude is None:
        exclude = []
    
    result = {}
    for column in model.__table__.columns:
        if column.name not in exclude:
            value = getattr(model, column.name)
            # datetime은 ISO 형식 문자열로 변환
            if hasattr(value, 'isoformat'):
                value = value.isoformat()
            result[column.name] = value
    
    return result
