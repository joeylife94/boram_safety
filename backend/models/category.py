from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from backend.database import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    description = Column(Text)
    image_url = Column(String(500))  # 카테고리 대표 이미지
    order = Column(Integer, default=0)  # 메뉴 표시 순서

    # 제품과의 관계 설정
    products = relationship("Product", back_populates="category") 