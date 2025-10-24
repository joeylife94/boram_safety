"""
Draft Product 모델
제품 등록 중 임시 저장을 위한 모델
"""
from sqlalchemy import Column, Integer, String, Text, DECIMAL, Boolean, DateTime, JSON
from sqlalchemy.sql import func
from database import Base


class DraftProduct(Base):
    """임시 저장 제품 모델"""
    __tablename__ = "draft_products"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # 제품 정보 (Product 모델과 동일한 구조)
    name = Column(String(200), nullable=True)  # Draft는 nullable
    model_number = Column(String(100), nullable=True)
    category_id = Column(Integer, nullable=True)
    description = Column(Text, nullable=True)
    specifications = Column(Text, nullable=True)
    
    # 가격 및 재고
    price = Column(DECIMAL(10, 2), nullable=True)
    stock_status = Column(String(50), nullable=True, default='in_stock')
    
    # 표시 옵션
    is_featured = Column(Boolean, default=False)
    display_order = Column(Integer, default=0)
    
    # 이미지
    file_name = Column(String(255), nullable=True)
    file_path = Column(String(500), nullable=True)
    
    # 추가 메타데이터 (JSON 형식으로 확장 가능)
    extra_data = Column(JSON, nullable=True, comment="추가 메타데이터 (tags, notes 등)")
    
    # Draft 상태
    draft_status = Column(
        String(20), 
        default='draft',
        comment="draft, auto_saved, ready_to_publish"
    )
    
    # 연결된 실제 제품 ID (수정 중인 경우)
    product_id = Column(Integer, nullable=True, comment="수정 중인 제품의 ID")
    
    # 타임스탬프
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_auto_saved_at = Column(DateTime(timezone=True), nullable=True)
    
    # 사용자 정보 (향후 확장 가능)
    created_by = Column(String(100), nullable=True, comment="작성자")
    
    def __repr__(self):
        return f"<DraftProduct(id={self.id}, name={self.name}, status={self.draft_status})>"
