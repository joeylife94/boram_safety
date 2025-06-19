from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional

# 상대 경로로 import 수정
import sys
sys.path.append('..')
from database import get_db
from crud import product as product_crud
from crud import category as category_crud
from schemas.product import ProductResponse, ProductCreate, ProductUpdate
from schemas.category import Category, CategoryCreate, CategoryUpdate
from models.safety import SafetyProduct, SafetyCategory

# 🔐 Admin Router - 모든 CRUD 작업 허용
router = APIRouter(
    tags=["admin-api"]
)

@router.get("/health")
def admin_health_check():
    """Admin API 상태 확인"""
    return {"status": "healthy", "role": "admin"}

@router.get("/dashboard")
async def admin_dashboard(db: Session = Depends(get_db)):
    """관리자 대시보드 정보를 반환합니다."""
    total_products = product_crud.get_product_count(db)
    total_categories = category_crud.get_category_count(db)
    featured_products = product_crud.get_featured_product_count(db)
    
    return {
        "message": "관리자 대시보드에 오신 것을 환영합니다",
        "status": "authenticated",
        "stats": {
            "total_products": total_products,
            "total_categories": total_categories,
            "featured_products": featured_products,
            "total_images": total_products
        }
    }

@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    """제품 이미지를 업로드합니다."""
    import os
    import uuid
    from pathlib import Path
    
    try:
        # 허용된 파일 형식 체크
        allowed_extensions = {'.jpg', '.jpeg', '.png', '.gif'}
        file_extension = os.path.splitext(file.filename)[1].lower()
        
        if file_extension not in allowed_extensions:
            raise HTTPException(status_code=400, detail="지원하지 않는 파일 형식입니다")
        
        # 고유한 파일명 생성
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        
        # 업로드 디렉토리 설정 (public/images/)
        upload_dir = Path("../frontend/public/images")
        upload_dir.mkdir(parents=True, exist_ok=True)
        
        # 파일 저장
        file_path = upload_dir / unique_filename
        
        contents = await file.read()
        with open(file_path, "wb") as f:
            f.write(contents)
        
        # 웹에서 접근 가능한 URL 반환
        file_url = f"/images/{unique_filename}"
        
        return {"url": file_url, "filename": unique_filename}
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"파일 업로드 중 오류가 발생했습니다: {str(e)}")

# ============= 카테고리 관리 =============

@router.get("/categories", response_model=List[Category])
async def read_categories(
    skip: int = 0,
    limit: int = 1000,
    db: Session = Depends(get_db)
):
    """카테고리 목록을 조회합니다."""
    return category_crud.get_categories(db, skip=skip, limit=limit)

@router.get("/categories/{category_id}", response_model=Category)
async def read_category(
    category_id: int,
    db: Session = Depends(get_db)
):
    """특정 카테고리를 조회합니다."""
    category = category_crud.get_category(db, category_id)
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

@router.post("/categories", response_model=Category)
async def create_category(
    name: str = Form(...),
    code: str = Form(...),
    slug: str = Form(...),
    description: Optional[str] = Form(None),
    display_order: Optional[int] = Form(0),
    image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    """새로운 카테고리를 생성합니다 (FormData 지원)."""
    from schemas.category import CategoryCreate
    
    # 디버깅: 받은 데이터 출력
    print(f"=== CREATE CATEGORY ===")
    print(f"name: {name}")
    print(f"code: {code}")
    print(f"slug: {slug}")
    print(f"description: {description}")
    print(f"display_order: {display_order}")
    print(f"image: {image.filename if image else None}")
    
    # CategoryCreate 객체 생성
    category_data = {
        'name': name.strip(),
        'code': code.strip(),
        'slug': slug.strip(),
        'description': description.strip() if description and description.strip() else None,
        'display_order': display_order or 0
    }
    
    print(f"category_data to create: {category_data}")
    
    category = CategoryCreate(**category_data)
    print(f"CategoryCreate object: {category}")
    
    created_category = category_crud.create_category(db, category)
    print(f"Created category: {created_category}")
    
    return created_category

@router.put("/categories/{category_id}", response_model=Category)
async def update_category(
    category_id: int,
    name: Optional[str] = Form(None),
    code: Optional[str] = Form(None),
    slug: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    display_order: Optional[int] = Form(None),
    image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    """카테고리 정보를 수정합니다 (FormData 지원)."""
    from schemas.category import CategoryUpdate
    
    # 디버깅: 받은 데이터 출력
    print(f"=== UPDATE CATEGORY {category_id} ===")
    print(f"name: {name}")
    print(f"code: {code}")
    print(f"slug: {slug}")
    print(f"description: {description}")
    print(f"display_order: {display_order}")
    print(f"image: {image.filename if image else None}")
    
    # CategoryUpdate 객체 생성 (None이 아닌 값들만)
    category_data = {}
    if name is not None and name.strip():
        category_data['name'] = name.strip()
    if code is not None and code.strip():
        category_data['code'] = code.strip()
    if slug is not None and slug.strip():
        category_data['slug'] = slug.strip()
    if description is not None:
        category_data['description'] = description.strip() if description.strip() else None
    if display_order is not None:
        category_data['display_order'] = display_order
    
    print(f"category_data to update: {category_data}")
    
    if not category_data:
        raise HTTPException(status_code=400, detail="업데이트할 데이터가 없습니다")
    
    category = CategoryUpdate(**category_data)
    print(f"CategoryUpdate object: {category}")
    
    db_category = category_crud.update_category(db, category_id, category)
    if db_category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    
    print(f"Updated category: {db_category}")
    return db_category

@router.delete("/categories/{category_id}")
async def delete_category(
    category_id: int,
    db: Session = Depends(get_db)
):
    """카테고리를 삭제합니다."""
    db_category = category_crud.delete_category(db, category_id)
    if db_category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": f"카테고리 {category_id}가 성공적으로 삭제되었습니다"}

# ============= 제품 관리 =============

@router.get("/products", response_model=List[ProductResponse])
async def read_products(
    skip: int = 0,
    limit: int = 1000,
    category_code: str = None,
    search: str = None,
    db: Session = Depends(get_db)
):
    """제품 목록을 조회합니다."""
    products = product_crud.get_products(db, skip=skip, limit=limit, category_code=category_code, search=search)
    return products

@router.get("/products/{product_id}", response_model=ProductResponse)
async def read_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    """특정 제품을 조회합니다."""
    product = product_crud.get_product(db, product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.post("/products", response_model=ProductResponse)
async def create_product(
    name: str = Form(...),
    model_number: str = Form(...),
    category_id: int = Form(...),
    description: Optional[str] = Form(None),
    specifications: Optional[str] = Form(None),
    price: Optional[float] = Form(None),
    is_featured: Optional[int] = Form(0),
    display_order: Optional[int] = Form(0),
    images: List[UploadFile] = File([]),
    db: Session = Depends(get_db)
):
    """새로운 제품을 추가합니다 (FormData 지원)."""
    from schemas.product import ProductCreate
    
    # 디버깅: 받은 데이터 출력
    print(f"=== CREATE PRODUCT ===")
    print(f"name: {name}")
    print(f"model_number: {model_number}")
    print(f"category_id: {category_id}")
    print(f"description: {description}")
    print(f"specifications: {specifications}")
    print(f"price: {price}")
    print(f"is_featured: {is_featured}")
    print(f"display_order: {display_order}")
    print(f"images count: {len(images) if images else 0}")
    
    # ProductCreate 객체 생성
    product_data = {
        'name': name.strip() if name else "",
        'model_number': model_number.strip() if model_number else "",
        'category_id': category_id if category_id is not None else 0,
        'description': description.strip() if description and description.strip() else None,
        'specifications': specifications.strip() if specifications and specifications.strip() else None,
        'price': price if price is not None else None,
        'is_featured': int(is_featured) if is_featured is not None else 0,
        'display_order': int(display_order) if display_order is not None else 0
    }
    
    # 여러 이미지 파일 처리 및 저장
    image_paths = []
    if images and len(images) > 0:
        import os
        import uuid
        import json
        from pathlib import Path
        
        # 업로드 디렉토리 설정
        upload_dir = Path("../frontend/public/images")
        upload_dir.mkdir(parents=True, exist_ok=True)
        
        for image in images:
            if image.filename and image.filename.strip():
                # 고유한 파일명 생성
                file_extension = os.path.splitext(image.filename)[1].lower()
                unique_filename = f"{uuid.uuid4()}{file_extension}"
                
                # 파일 저장
                file_path = upload_dir / unique_filename
                contents = await image.read()
                with open(file_path, "wb") as f:
                    f.write(contents)
                
                image_path = f"/images/{unique_filename}"
                image_paths.append(image_path)
                print(f"이미지 저장 완료: {unique_filename}")
        
        if image_paths:
            # 첫 번째 이미지를 메인 이미지로 설정
            product_data['file_name'] = os.path.basename(image_paths[0])
            # 모든 이미지 경로를 JSON 배열로 저장
            product_data['file_path'] = json.dumps(image_paths)
        else:
            # 기본값 설정
            product_data['file_name'] = "default.jpg"
            product_data['file_path'] = json.dumps(["/images/default.jpg"])
    else:
        # 기본값 설정
        product_data['file_name'] = "default.jpg"
        product_data['file_path'] = json.dumps(["/images/default.jpg"])
    
    print(f"product_data to create: {product_data}")
    
    try:
        product = ProductCreate(**product_data)
        print(f"ProductCreate object: {product}")
        
        created_product = product_crud.create_product(db, product)
        print(f"Created product: {created_product}")
        
        return created_product
    except Exception as e:
        print(f"Error creating ProductCreate object: {e}")
        print(f"product_data that failed: {product_data}")
        raise HTTPException(status_code=400, detail=f"제품 생성 실패: {str(e)}")

@router.put("/products/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: int,
    name: Optional[str] = Form(None),
    model_number: Optional[str] = Form(None),
    category_id: Optional[int] = Form(None),
    description: Optional[str] = Form(None),
    specifications: Optional[str] = Form(None),
    price: Optional[float] = Form(None),
    is_featured: Optional[int] = Form(None),
    display_order: Optional[int] = Form(None),
    existing_images: Optional[str] = Form(None),  # 유지할 기존 이미지들 (JSON 배열)
    images: List[UploadFile] = File([]),
    db: Session = Depends(get_db)
):
    """기존 제품 정보를 수정합니다 (FormData 지원)."""
    from schemas.product import ProductUpdate
    
    # 디버깅: 받은 데이터 출력
    print(f"=== UPDATE PRODUCT {product_id} ===")
    print(f"name: {name}")
    print(f"model_number: {model_number}")
    print(f"category_id: {category_id}")
    print(f"description: {description}")
    print(f"specifications: {specifications}")
    print(f"price: {price}")
    print(f"is_featured: {is_featured}")
    print(f"display_order: {display_order}")
    print(f"images count: {len(images) if images else 0}")
    
    # ProductUpdate 객체 생성 (None이 아닌 값들만)
    product_data = {}
    if name is not None and name.strip():
        product_data['name'] = name.strip()
    if model_number is not None and model_number.strip():
        product_data['model_number'] = model_number.strip()
    if category_id is not None:
        product_data['category_id'] = category_id
    if description is not None:
        product_data['description'] = description.strip() if description.strip() else None
    if specifications is not None:
        product_data['specifications'] = specifications.strip() if specifications.strip() else None
    if price is not None:
        product_data['price'] = price
    if is_featured is not None:
        product_data['is_featured'] = is_featured
    if display_order is not None:
        product_data['display_order'] = display_order
    
    # 이미지 처리 (기존 + 새로운 이미지)
    import os
    import uuid
    import json
    from pathlib import Path
    
    # 기존 제품 정보 가져오기
    existing_product = db.query(SafetyProduct).filter(SafetyProduct.id == product_id).first()
    if not existing_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # 1. 유지할 기존 이미지 파싱
    keep_existing_paths = []
    if existing_images:
        try:
            keep_existing_paths = json.loads(existing_images)
            if not isinstance(keep_existing_paths, list):
                keep_existing_paths = []
        except (json.JSONDecodeError, TypeError):
            keep_existing_paths = []
    
    # 2. 삭제될 기존 이미지 파악 및 실제 파일 삭제
    if existing_product.file_path:
        try:
            all_existing_paths = json.loads(existing_product.file_path)
            if isinstance(all_existing_paths, list):
                paths_to_delete = [path for path in all_existing_paths if path not in keep_existing_paths]
                for path_to_delete in paths_to_delete:
                    if path_to_delete and path_to_delete.startswith('/images/'):
                        file_path = Path("../frontend/public") / path_to_delete.lstrip('/')
                        if file_path.exists():
                            try:
                                os.remove(file_path)
                                print(f"삭제된 이미지 파일: {file_path}")
                            except Exception as e:
                                print(f"이미지 파일 삭제 실패: {file_path}, 오류: {e}")
        except (json.JSONDecodeError, TypeError):
            pass
    
    # 3. 새 이미지들 저장
    new_image_paths = []
    if images and len(images) > 0:
        upload_dir = Path("../frontend/public/images")
        upload_dir.mkdir(parents=True, exist_ok=True)
        
        for image in images:
            if image.filename and image.filename.strip():
                # 고유한 파일명 생성
                file_extension = os.path.splitext(image.filename)[1].lower()
                unique_filename = f"{uuid.uuid4()}{file_extension}"
                
                # 파일 저장
                file_path = upload_dir / unique_filename
                contents = await image.read()
                with open(file_path, "wb") as f:
                    f.write(contents)
                
                image_path = f"/images/{unique_filename}"
                new_image_paths.append(image_path)
                print(f"새 이미지 저장 완료: {unique_filename}")
    
    # 4. 최종 이미지 경로 리스트 구성 (기존 유지 + 새 이미지)
    final_image_paths = keep_existing_paths + new_image_paths
    
    if final_image_paths:
        product_data['file_name'] = os.path.basename(final_image_paths[0])
        product_data['file_path'] = json.dumps(final_image_paths)
        print(f"총 {len(final_image_paths)}개 이미지로 업데이트: {final_image_paths}")
    elif existing_product.file_path:  # 모든 이미지가 삭제된 경우
        product_data['file_name'] = "default.jpg"
        product_data['file_path'] = json.dumps(["/images/default.jpg"])
    
    print(f"product_data to update: {product_data}")
    
    if not product_data:
        raise HTTPException(status_code=400, detail="업데이트할 데이터가 없습니다")
    
    try:
        product = ProductUpdate(**product_data)
        print(f"ProductUpdate object: {product}")
        
        db_product = product_crud.update_product(db, product_id, product)
        if db_product is None:
            raise HTTPException(status_code=404, detail="Product not found")
        
        print(f"Updated product: {db_product}")
        return db_product
    except ValueError as ve:
        print(f"Validation error: {ve}")
        raise HTTPException(status_code=422, detail=f"데이터 검증 오류: {str(ve)}")
    except Exception as e:
        print(f"Error updating product: {e}")
        print(f"Error type: {type(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"제품 업데이트 실패: {str(e)}")

@router.delete("/products/{product_id}")
async def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    """제품을 삭제합니다."""
    db_product = product_crud.delete_product(db, product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": f"제품 {product_id}가 성공적으로 삭제되었습니다"}

@router.post("/content")
async def create_content(content: dict):
    """새로운 컨텐츠를 추가하는 엔드포인트"""
    return {
        "message": "컨텐츠가 성공적으로 추가되었습니다",
        "content": content
    }

@router.put("/content/{content_id}")
async def update_content(content_id: str, content: dict):
    """기존 컨텐츠를 수정하는 엔드포인트"""
    return {
        "message": f"컨텐츠 {content_id}가 성공적으로 수정되었습니다",
        "content": content
    }

@router.delete("/content/{content_id}")
async def delete_content(content_id: str):
    """컨텐츠를 삭제하는 엔드포인트"""
    return {
        "message": f"컨텐츠 {content_id}가 성공적으로 삭제되었습니다"
    } 