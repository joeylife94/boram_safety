from backend.database import SessionLocal
from backend.models.category import Category
from backend.models.product import Product
from backend.models.inquiry import Inquiry
from backend.models.image import Image, ImageType
import json
from datetime import datetime, timedelta
import shutil
import os
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base

# 데이터베이스 테이블 생성
Base.metadata.create_all(bind=engine)

# 더미 제품 데이터
products = [
    {
        "name": "안전모 A-100",
        "category": "safety_helmet",
        "description": "고품질 안전모로, 충격 흡수력이 뛰어나며 편안한 착용감을 제공합니다.",
        "image_url": "/backend/static/images/safety_helmet/1.jpg",
        "price": 35000,
        "stock": 100,
        "specifications": '{"재질": "ABS 수지", "중량": "450g", "크기": "52-62cm", "색상": "흰색, 노란색, 파란색"}',
    },
    {
        "name": "안전장갑 G-200",
        "category": "safety_gloves",
        "description": "내구성이 뛰어난 안전장갑으로, 손의 보호와 작업 편의성을 모두 고려했습니다.",
        "image_url": "/backend/static/images/safety_gloves/1.jpg",
        "price": 12000,
        "stock": 200,
        "specifications": '{"재질": "니트릴 코팅", "사이즈": "M, L, XL", "색상": "검정, 회색", "용도": "일반작업용"}',
    },
    # 더 많은 제품 데이터 추가...
]

def create_dummy_data():
    db = SessionLocal()
    try:
        # 기존 데이터 삭제
        db.query(Product).delete()
        
        # 새 데이터 추가
        for product_data in products:
            product = Product(
                **product_data,
                created_at=datetime.now().isoformat(),
                updated_at=datetime.now().isoformat(),
            )
            db.add(product)
        
        db.commit()
        print("Dummy data created successfully!")
    except Exception as e:
        print(f"Error creating dummy data: {e}")
        db.rollback()
    finally:
        db.close()

def create_dummy_images():
    """더미 이미지 파일을 생성하고 데이터베이스에 등록합니다."""
    db = SessionLocal()
    try:
        # 이미지 저장 디렉토리 생성
        os.makedirs("backend/static/images/products", exist_ok=True)
        
        # 제품별 더미 이미지 생성
        products = db.query(Product).all()
        for product in products:
            # 메인 이미지
            main_image_path = f"/images/products/{product.id}_main.jpg"
            shutil.copy("backend/static/default/product_default.jpg", f"backend/static{main_image_path}")
            
            db_main_image = Image(
                file_path=main_image_path,
                image_type=ImageType.MAIN,
                product_id=product.id,
                display_order=0,
                image_key=f"main_{product.id}"
            )
            db.add(db_main_image)
            
            # 상세 이미지들
            for i in range(2):
                detail_image_path = f"/images/products/{product.id}_detail_{i+1}.jpg"
                shutil.copy("backend/static/default/product_detail_default.jpg", f"backend/static{detail_image_path}")
                
                db_detail_image = Image(
                    file_path=detail_image_path,
                    image_type=ImageType.DETAIL,
                    product_id=product.id,
                    display_order=i+1,
                    image_key=f"detail_{product.id}_{i+1}"
                )
                db.add(db_detail_image)
        
        db.commit()
        print("더미 이미지 데이터가 성공적으로 생성되었습니다!")
        
    except Exception as e:
        print(f"더미 이미지 생성 중 오류 발생: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    create_dummy_data()
    create_dummy_images() 