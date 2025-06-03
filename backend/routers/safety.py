from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import safety as models
from ..schemas import safety as schemas
import os
from pathlib import Path

router = APIRouter(
    prefix="/api/safety",
    tags=["safety"]
)

@router.get("/categories/", response_model=List[schemas.SafetyCategory])
def get_categories(db: Session = Depends(get_db)):
    return db.query(models.SafetyCategory).all()

@router.post("/categories/", response_model=schemas.SafetyCategory)
def create_category(category: schemas.SafetyCategoryCreate, db: Session = Depends(get_db)):
    db_category = models.SafetyCategory(**category.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@router.get("/categories/{category_id}", response_model=schemas.SafetyCategory)
def get_category(category_id: int, db: Session = Depends(get_db)):
    db_category = db.query(models.SafetyCategory).filter(models.SafetyCategory.id == category_id).first()
    if db_category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return db_category

@router.put("/categories/{category_id}", response_model=schemas.SafetyCategory)
def update_category(category_id: int, category: schemas.SafetyCategoryUpdate, db: Session = Depends(get_db)):
    db_category = db.query(models.SafetyCategory).filter(models.SafetyCategory.id == category_id).first()
    if db_category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    
    for key, value in category.dict(exclude_unset=True).items():
        setattr(db_category, key, value)
    
    db.commit()
    db.refresh(db_category)
    return db_category

@router.delete("/categories/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db)):
    db_category = db.query(models.SafetyCategory).filter(models.SafetyCategory.id == category_id).first()
    if db_category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    
    db.delete(db_category)
    db.commit()
    return {"message": "Category deleted successfully"}

@router.get("/images/", response_model=List[schemas.SafetyItemsImage])
def get_images(category_id: int = None, db: Session = Depends(get_db)):
    query = db.query(models.SafetyItemsImages)
    if category_id:
        query = query.filter(models.SafetyItemsImages.category_id == category_id)
    return query.all()

@router.post("/images/", response_model=schemas.SafetyItemsImage)
async def create_image(
    category_id: int,
    description: str = None,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Verify category exists
    category = db.query(models.SafetyCategory).filter(models.SafetyCategory.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    # Create directory if it doesn't exist
    upload_dir = Path("backend/static/images") / category.code
    upload_dir.mkdir(parents=True, exist_ok=True)

    # Save file
    file_path = upload_dir / file.filename
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)

    # Create database record
    db_image = models.SafetyItemsImages(
        category_id=category_id,
        file_name=file.filename,
        file_path=str(file_path),
        description=description
    )
    
    # Update category image count
    category.image_count += 1
    
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    
    return db_image

@router.delete("/images/{image_id}")
async def delete_image(image_id: int, db: Session = Depends(get_db)):
    db_image = db.query(models.SafetyItemsImages).filter(models.SafetyItemsImages.id == image_id).first()
    if db_image is None:
        raise HTTPException(status_code=404, detail="Image not found")

    # Delete file
    if os.path.exists(db_image.file_path):
        os.remove(db_image.file_path)

    # Update category image count
    category = db.query(models.SafetyCategory).filter(models.SafetyCategory.id == db_image.category_id).first()
    if category:
        category.image_count = max(0, category.image_count - 1)

    db.delete(db_image)
    db.commit()
    
    return {"message": "Image deleted successfully"} 