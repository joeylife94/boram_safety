from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float
from sqlalchemy.sql import func
from database import Base

class SafetyCategory(Base):
    __tablename__ = "safety_categories"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    code = Column(String(50), nullable=False, unique=True)
    slug = Column(String(50), nullable=False, unique=True)  # URL용 slug
    description = Column(Text)
    image = Column(String(500))  # 대표 이미지 경로
    display_order = Column(Integer, default=0)  # 표시 순서
    image_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class SafetyProduct(Base):  # SafetyItemsImages를 SafetyProduct로 확장
    __tablename__ = "safety_products"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("safety_categories.id", ondelete="CASCADE"), nullable=False)
    
    # 제품 정보
    name = Column(String(200), nullable=False)  # 제품명
    model_number = Column(String(100))  # 모델 번호
    price = Column(Float)  # 가격
    description = Column(Text)  # 제품 설명
    specifications = Column(Text)  # 제품 사양 (JSON 형태)
    stock_status = Column(String(50), default="in_stock")  # 재고 상태
    
    # 이미지 정보
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    
    # 메타 정보
    display_order = Column(Integer, default=0)  # 표시 순서
    is_featured = Column(Integer, default=0)  # 추천 제품 여부 (0: 일반, 1: 추천)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now()) 