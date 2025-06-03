from sqlalchemy.orm import Session
from backend.models.inquiry import Inquiry
from backend.schemas.inquiry import InquiryCreate

def get_inquiry(db: Session, inquiry_id: int):
    return db.query(Inquiry).filter(Inquiry.id == inquiry_id).first()

def get_inquiries(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Inquiry).order_by(Inquiry.created_at.desc())\
             .offset(skip).limit(limit).all()

def create_inquiry(db: Session, inquiry: InquiryCreate):
    db_inquiry = Inquiry(**inquiry.model_dump())
    db.add(db_inquiry)
    db.commit()
    db.refresh(db_inquiry)
    return db_inquiry

def mark_as_read(db: Session, inquiry_id: int):
    db_inquiry = get_inquiry(db, inquiry_id)
    if db_inquiry:
        db_inquiry.is_read = True
        db.commit()
        db.refresh(db_inquiry)
    return db_inquiry 