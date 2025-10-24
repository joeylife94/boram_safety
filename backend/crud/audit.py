from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional, Tuple
from datetime import datetime
import json

from models.audit import AuditLog, AuditAction, AuditEntityType
from schemas.audit import AuditLogCreate, AuditLogFilter


def create_audit_log(
    db: Session,
    entity_type: AuditEntityType,
    entity_id: Optional[int],
    action: AuditAction,
    old_values: Optional[dict] = None,
    new_values: Optional[dict] = None,
    changes_summary: Optional[str] = None,
    user_id: Optional[str] = None,
    user_name: Optional[str] = None,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None
) -> AuditLog:
    """Audit Log 생성"""
    audit_log = AuditLog(
        entity_type=entity_type,
        entity_id=entity_id,
        action=action,
        old_values=json.dumps(old_values, ensure_ascii=False) if old_values else None,
        new_values=json.dumps(new_values, ensure_ascii=False) if new_values else None,
        changes_summary=changes_summary,
        user_id=user_id,
        user_name=user_name,
        ip_address=ip_address,
        user_agent=user_agent
    )
    db.add(audit_log)
    db.commit()
    db.refresh(audit_log)
    return audit_log


def get_audit_logs(
    db: Session,
    filters: AuditLogFilter
) -> Tuple[List[AuditLog], int]:
    """필터를 사용한 Audit Log 조회"""
    query = db.query(AuditLog)
    
    # 필터 적용
    conditions = []
    
    if filters.entity_type:
        conditions.append(AuditLog.entity_type == filters.entity_type)
    
    if filters.entity_id is not None:
        conditions.append(AuditLog.entity_id == filters.entity_id)
    
    if filters.action:
        conditions.append(AuditLog.action == filters.action)
    
    if filters.user_id:
        conditions.append(AuditLog.user_id == filters.user_id)
    
    if filters.date_from:
        conditions.append(AuditLog.created_at >= filters.date_from)
    
    if filters.date_to:
        conditions.append(AuditLog.created_at <= filters.date_to)
    
    if conditions:
        query = query.filter(and_(*conditions))
    
    # 총 개수 계산
    total = query.count()
    
    # 최신순 정렬 및 페이징
    logs = query.order_by(AuditLog.created_at.desc())\
               .offset(filters.skip)\
               .limit(filters.limit)\
               .all()
    
    return logs, total


def get_entity_history(
    db: Session,
    entity_type: AuditEntityType,
    entity_id: int,
    limit: int = 50
) -> List[AuditLog]:
    """특정 엔티티의 변경 이력 조회"""
    return db.query(AuditLog)\
             .filter(AuditLog.entity_type == entity_type)\
             .filter(AuditLog.entity_id == entity_id)\
             .order_by(AuditLog.created_at.desc())\
             .limit(limit)\
             .all()


def get_recent_activities(
    db: Session,
    limit: int = 20
) -> List[AuditLog]:
    """최근 변경 활동 조회"""
    return db.query(AuditLog)\
             .order_by(AuditLog.created_at.desc())\
             .limit(limit)\
             .all()


def generate_changes_summary(old_values: dict, new_values: dict) -> str:
    """변경 내용 요약 생성"""
    changes = []
    
    # 모든 필드 비교
    all_keys = set(old_values.keys()) | set(new_values.keys())
    
    for key in all_keys:
        old_val = old_values.get(key)
        new_val = new_values.get(key)
        
        if old_val != new_val:
            # 특정 필드는 사람이 읽기 쉬운 형태로 변환
            if key == "is_featured":
                old_val = "추천" if old_val else "일반"
                new_val = "추천" if new_val else "일반"
            
            changes.append(f"{key}: {old_val} → {new_val}")
    
    return ", ".join(changes) if changes else "변경 없음"
