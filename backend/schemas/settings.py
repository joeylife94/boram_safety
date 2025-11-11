"""
Site Settings Schema
사이트 설정 Pydantic 스키마
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class SiteSettingsBase(BaseModel):
    """사이트 설정 기본 스키마"""
    company_name: str = Field(default="보람안전", max_length=100)
    company_name_en: Optional[str] = Field(None, max_length=100)
    company_slogan: Optional[str] = Field(None, max_length=200)
    
    phone: Optional[str] = Field(None, max_length=20)
    fax: Optional[str] = Field(None, max_length=20)
    email: Optional[str] = Field(None, max_length=100)
    
    address: Optional[str] = Field(None, max_length=200)
    address_detail: Optional[str] = Field(None, max_length=200)
    postal_code: Optional[str] = Field(None, max_length=10)
    
    about_title: Optional[str] = Field(None, max_length=200)
    about_content: Optional[str] = None
    about_mission: Optional[str] = None
    about_vision: Optional[str] = None
    
    business_hours: Optional[str] = Field(None, max_length=100)
    business_license: Optional[str] = Field(None, max_length=50)
    ceo_name: Optional[str] = Field(None, max_length=50)
    
    facebook_url: Optional[str] = Field(None, max_length=200)
    instagram_url: Optional[str] = Field(None, max_length=200)
    youtube_url: Optional[str] = Field(None, max_length=200)
    blog_url: Optional[str] = Field(None, max_length=200)
    
    logo_path: Optional[str] = Field(None, max_length=200)
    logo_dark_path: Optional[str] = Field(None, max_length=200)
    favicon_path: Optional[str] = Field(None, max_length=200)
    
    meta_title: Optional[str] = Field(None, max_length=100)
    meta_description: Optional[str] = Field(None, max_length=200)
    meta_keywords: Optional[str] = Field(None, max_length=200)
    
    is_maintenance_mode: bool = False
    maintenance_message: Optional[str] = None


class SiteSettingsCreate(SiteSettingsBase):
    """사이트 설정 생성 스키마"""
    pass


class SiteSettingsUpdate(SiteSettingsBase):
    """사이트 설정 수정 스키마 - 모든 필드 선택적"""
    company_name: Optional[str] = Field(None, max_length=100)


class SiteSettingsResponse(SiteSettingsBase):
    """사이트 설정 응답 스키마"""
    id: int
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class SiteSettingsPublic(BaseModel):
    """공개 API용 사이트 설정 (민감 정보 제외)"""
    company_name: str
    company_name_en: Optional[str]
    company_slogan: Optional[str]
    phone: Optional[str]
    email: Optional[str]
    address: Optional[str]
    address_detail: Optional[str]
    postal_code: Optional[str]
    business_hours: Optional[str]
    facebook_url: Optional[str]
    instagram_url: Optional[str]
    youtube_url: Optional[str]
    blog_url: Optional[str]
    logo_path: Optional[str]
    logo_dark_path: Optional[str]
    
    class Config:
        from_attributes = True
