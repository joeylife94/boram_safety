from sqlalchemy import Column, Integer, String, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from backend.database import Base
import enum

class ImageType(enum.Enum):
    MAIN = "main"
    DETAIL = "detail"
    ADDITIONAL = "additional"

class Image(Base):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True, index=True)
    file_path = Column(String(500), nullable=False)
    image_type = Column(SQLEnum(ImageType), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"))
    display_order = Column(Integer, default=0)  # 이미지 표시 순서
    image_key = Column(String(100), unique=True, nullable=False)  # 프론트엔드에서 참조할 키

    # 관계 설정
    product = relationship("Product", back_populates="images") 