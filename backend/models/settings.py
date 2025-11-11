"""
Site Settings Model
사이트 전역 설정을 저장하는 모델
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.sql import func
from database import Base


class SiteSettings(Base):
    """사이트 설정 테이블"""
    __tablename__ = "site_settings"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # 회사 기본 정보
    company_name = Column(String(100), nullable=False, default="보람안전")
    company_name_en = Column(String(100), nullable=True)
    company_slogan = Column(String(200), nullable=True, default="안전한 작업환경을 위한 최고의 파트너")
    
    # 연락처 정보
    phone = Column(String(20), nullable=True)
    fax = Column(String(20), nullable=True)
    email = Column(String(100), nullable=True)
    
    # 주소 정보
    address = Column(String(200), nullable=True)
    address_detail = Column(String(200), nullable=True)
    postal_code = Column(String(10), nullable=True)
    
    # 회사 소개
    about_title = Column(String(200), nullable=True, default="회사 소개")
    about_content = Column(Text, nullable=True)
    about_mission = Column(Text, nullable=True)
    about_vision = Column(Text, nullable=True)
    
    # 영업 정보
    business_hours = Column(String(100), nullable=True, default="평일 09:00 - 18:00")
    business_license = Column(String(50), nullable=True)
    ceo_name = Column(String(50), nullable=True)
    
    # 소셜 미디어
    facebook_url = Column(String(200), nullable=True)
    instagram_url = Column(String(200), nullable=True)
    youtube_url = Column(String(200), nullable=True)
    blog_url = Column(String(200), nullable=True)
    
    # 로고 및 파비콘
    logo_path = Column(String(200), nullable=True)
    logo_dark_path = Column(String(200), nullable=True)  # 다크모드용
    favicon_path = Column(String(200), nullable=True)
    
    # SEO
    meta_title = Column(String(100), nullable=True)
    meta_description = Column(String(200), nullable=True)
    meta_keywords = Column(String(200), nullable=True)
    
    # 기타 설정
    is_maintenance_mode = Column(Boolean, default=False)
    maintenance_message = Column(Text, nullable=True)
    
    # 타임스탬프
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def to_dict(self):
        """딕셔너리로 변환"""
        return {
            "id": self.id,
            "company_name": self.company_name,
            "company_name_en": self.company_name_en,
            "company_slogan": self.company_slogan,
            "phone": self.phone,
            "fax": self.fax,
            "email": self.email,
            "address": self.address,
            "address_detail": self.address_detail,
            "postal_code": self.postal_code,
            "about_title": self.about_title,
            "about_content": self.about_content,
            "about_mission": self.about_mission,
            "about_vision": self.about_vision,
            "business_hours": self.business_hours,
            "business_license": self.business_license,
            "ceo_name": self.ceo_name,
            "facebook_url": self.facebook_url,
            "instagram_url": self.instagram_url,
            "youtube_url": self.youtube_url,
            "blog_url": self.blog_url,
            "logo_path": self.logo_path,
            "logo_dark_path": self.logo_dark_path,
            "favicon_path": self.favicon_path,
            "meta_title": self.meta_title,
            "meta_description": self.meta_description,
            "meta_keywords": self.meta_keywords,
            "is_maintenance_mode": self.is_maintenance_mode,
            "maintenance_message": self.maintenance_message,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
