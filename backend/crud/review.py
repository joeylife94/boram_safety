from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from ..models.review import Review
from ..schemas.review import ReviewCreate

def get_reviews_by_product(
    db: Session,
    product_id: int,
    skip: int = 0,
    limit: int = 100
) -> List[Review]:
    """특정 제품의 리뷰 목록을 조회합니다."""
    return db.query(Review)\
        .filter(Review.product_id == product_id)\
        .offset(skip)\
        .limit(limit)\
        .all()

def get_product_rating(db: Session, product_id: int) -> dict:
    """특정 제품의 평균 평점과 총 리뷰 수를 조회합니다."""
    result = db.query(
        func.avg(Review.rating).label('average_rating'),
        func.count(Review.id).label('total_reviews')
    ).filter(Review.product_id == product_id).first()
    
    return {
        "average_rating": float(result.average_rating) if result.average_rating else 0.0,
        "total_reviews": result.total_reviews
    }

def create_review(db: Session, review: ReviewCreate) -> Review:
    """새로운 리뷰를 생성합니다."""
    db_review = Review(
        product_id=review.product_id,
        rating=review.rating,
        content=review.content,
        author_name=review.author_name
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review 