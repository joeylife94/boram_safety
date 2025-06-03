import os
import uuid
from sqlalchemy.orm import Session
from fastapi import UploadFile
from backend.models.image import Image, ImageType
from backend.utils.upload import save_upload_file, delete_file

def create_image(db: Session, product_id: int, file: UploadFile, image_type: ImageType, display_order: int = 0) -> Image:
    """새로운 이미지를 생성합니다."""
    # 고유한 이미지 키 생성
    image_key = f"{str(uuid.uuid4())}"
    
    # 파일 저장 및 경로 받기
    file_path = save_upload_file(file)
    
    db_image = Image(
        file_path=file_path,
        image_type=image_type,
        product_id=product_id,
        display_order=display_order,
        image_key=image_key
    )
    
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image

def get_product_images(db: Session, product_id: int, image_type: ImageType = None):
    """제품의 이미지들을 조회합니다."""
    query = db.query(Image).filter(Image.product_id == product_id)
    if image_type:
        query = query.filter(Image.image_type == image_type)
    return query.order_by(Image.display_order).all()

def get_image_by_key(db: Session, image_key: str):
    """이미지 키로 이미지를 조회합니다."""
    return db.query(Image).filter(Image.image_key == image_key).first()

def update_image(db: Session, image_key: str, file: UploadFile = None, display_order: int = None):
    """이미지를 업데이트합니다."""
    db_image = get_image_by_key(db, image_key)
    if not db_image:
        return None
        
    if file:
        # 기존 파일 삭제
        delete_file(db_image.file_path)
        # 새 파일 저장
        new_file_path = save_upload_file(file)
        db_image.file_path = new_file_path
        
    if display_order is not None:
        db_image.display_order = display_order
        
    db.commit()
    db.refresh(db_image)
    return db_image

def delete_image(db: Session, image_key: str):
    """이미지를 삭제합니다."""
    db_image = get_image_by_key(db, image_key)
    if db_image:
        # 실제 파일 삭제
        delete_file(db_image.file_path)
        # DB에서 삭제
        db.delete(db_image)
        db.commit()
        return True
    return False 