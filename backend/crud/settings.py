"""
Site Settings CRUD Operations
"""
from sqlalchemy.orm import Session
from models.settings import SiteSettings
from schemas.settings import SiteSettingsCreate, SiteSettingsUpdate
from typing import Optional


def get_settings(db: Session) -> Optional[SiteSettings]:
    """
    사이트 설정 조회
    설정이 없으면 None 반환
    """
    return db.query(SiteSettings).first()


def get_or_create_settings(db: Session) -> SiteSettings:
    """
    사이트 설정 조회 또는 기본값으로 생성
    """
    settings = get_settings(db)
    if not settings:
        settings = SiteSettings(
            company_name="보람안전",
            company_slogan="안전한 작업환경을 위한 최고의 파트너",
            business_hours="평일 09:00 - 18:00"
        )
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings


def create_settings(db: Session, settings_data: SiteSettingsCreate) -> SiteSettings:
    """
    사이트 설정 생성
    이미 설정이 있으면 업데이트
    """
    existing = get_settings(db)
    if existing:
        return update_settings(db, settings_data)
    
    settings = SiteSettings(**settings_data.model_dump())
    db.add(settings)
    db.commit()
    db.refresh(settings)
    return settings


def update_settings(db: Session, settings_data: SiteSettingsUpdate) -> SiteSettings:
    """
    사이트 설정 업데이트
    """
    settings = get_or_create_settings(db)
    
    # 제공된 필드만 업데이트
    update_data = settings_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(settings, key, value)
    
    db.commit()
    db.refresh(settings)
    return settings


def reset_settings(db: Session) -> SiteSettings:
    """
    사이트 설정을 기본값으로 초기화
    """
    settings = get_or_create_settings(db)
    
    # 기본값으로 리셋
    settings.company_name = "보람안전"
    settings.company_slogan = "안전한 작업환경을 위한 최고의 파트너"
    settings.business_hours = "평일 09:00 - 18:00"
    
    # 선택 필드 초기화
    settings.company_name_en = None
    settings.phone = None
    settings.fax = None
    settings.email = None
    settings.address = None
    settings.address_detail = None
    settings.postal_code = None
    settings.about_content = None
    settings.about_mission = None
    settings.about_vision = None
    settings.business_license = None
    settings.ceo_name = None
    settings.facebook_url = None
    settings.instagram_url = None
    settings.youtube_url = None
    settings.blog_url = None
    settings.logo_path = None
    settings.logo_dark_path = None
    settings.favicon_path = None
    settings.meta_title = None
    settings.meta_description = None
    settings.meta_keywords = None
    settings.is_maintenance_mode = False
    settings.maintenance_message = None
    
    db.commit()
    db.refresh(settings)
    return settings
