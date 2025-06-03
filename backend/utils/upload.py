import os
from fastapi import UploadFile
from datetime import datetime
import aiofiles
import uuid
import shutil

# 이미지 저장 경로 설정
UPLOAD_DIR = "backend/static/images"
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif"}

def is_valid_image(filename: str) -> bool:
    """파일 확장자 검증"""
    ext = os.path.splitext(filename)[1].lower()
    return ext in ALLOWED_EXTENSIONS

def copy_default_image(image_type: str, product_id: int) -> str:
    """기본 이미지를 복사하여 새 제품 이미지 생성"""
    source = f"backend/static/default/{image_type}_default.jpg"
    target_dir = f"{UPLOAD_DIR}/products"
    os.makedirs(target_dir, exist_ok=True)
    
    new_filename = f"{product_id}_{image_type}_{uuid.uuid4().hex[:8]}.jpg"
    target = f"{target_dir}/{new_filename}"
    
    shutil.copy2(source, target)
    return f"/images/products/{new_filename}"

async def save_upload_file(file: UploadFile) -> str:
    """이미지 파일을 저장하고 URL을 반환"""
    if not is_valid_image(file.filename):
        raise ValueError("Invalid file type")

    # 업로드 디렉토리가 없으면 생성
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    
    # 고유한 파일명 생성
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    unique_id = str(uuid.uuid4())[:8]
    ext = os.path.splitext(file.filename)[1]
    new_filename = f"{timestamp}_{unique_id}{ext}"
    
    file_path = os.path.join(UPLOAD_DIR, new_filename)
    
    # 파일 저장
    async with aiofiles.open(file_path, 'wb') as out_file:
        content = await file.read()
        await out_file.write(content)
    
    # 상대 URL 반환
    return f"/images/{new_filename}"

def delete_file(file_path: str):
    """파일 삭제"""
    if file_path.startswith('/'):
        file_path = file_path[1:]  # 앞의 / 제거
    full_path = os.path.join('backend/static', file_path)
    if os.path.exists(full_path):
        os.remove(full_path) 