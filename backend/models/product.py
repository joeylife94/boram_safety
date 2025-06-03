from sqlalchemy import Column, Integer, String, Text, Float
from ..database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False)
    description = Column(Text)
    image_url = Column(String(200))
    price = Column(Float)
    stock = Column(Integer, default=0)
    specifications = Column(Text)  # JSON string으로 저장
    created_at = Column(String(50))  # ISO format datetime string
    updated_at = Column(String(50))  # ISO format datetime string 