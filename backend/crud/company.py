from sqlalchemy.orm import Session
from models.company import CompanyInfo, History, Certification, Client
from schemas.company import (
    CompanyInfoUpdate,
    HistoryCreate, HistoryUpdate,
    CertificationCreate, CertificationUpdate,
    ClientCreate, ClientUpdate
)

# CompanyInfo CRUD
def get_company_info(db: Session):
    return db.query(CompanyInfo).first()

def update_company_info(db: Session, info: CompanyInfoUpdate):
    db_info = get_company_info(db)
    if not db_info:
        db_info = CompanyInfo(**info.model_dump())
        db.add(db_info)
    else:
        for key, value in info.model_dump(exclude_unset=True).items():
            setattr(db_info, key, value)
    db.commit()
    db.refresh(db_info)
    return db_info

# History CRUD
def get_histories(db: Session, skip: int = 0, limit: int = 100):
    return db.query(History).order_by(History.date.desc(), History.order.asc())\
             .offset(skip).limit(limit).all()

def create_history(db: Session, history: HistoryCreate):
    db_history = History(**history.model_dump())
    db.add(db_history)
    db.commit()
    db.refresh(db_history)
    return db_history

def update_history(db: Session, history_id: int, history: HistoryUpdate):
    db_history = db.query(History).filter(History.id == history_id).first()
    if db_history:
        for key, value in history.model_dump(exclude_unset=True).items():
            setattr(db_history, key, value)
        db.commit()
        db.refresh(db_history)
    return db_history

def delete_history(db: Session, history_id: int):
    db_history = db.query(History).filter(History.id == history_id).first()
    if db_history:
        db.delete(db_history)
        db.commit()
    return db_history

# Certification CRUD
def get_certifications(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Certification).order_by(Certification.order.asc())\
             .offset(skip).limit(limit).all()

def create_certification(db: Session, cert: CertificationCreate):
    db_cert = Certification(**cert.model_dump())
    db.add(db_cert)
    db.commit()
    db.refresh(db_cert)
    return db_cert

def update_certification(db: Session, cert_id: int, cert: CertificationUpdate):
    db_cert = db.query(Certification).filter(Certification.id == cert_id).first()
    if db_cert:
        for key, value in cert.model_dump(exclude_unset=True).items():
            setattr(db_cert, key, value)
        db.commit()
        db.refresh(db_cert)
    return db_cert

def delete_certification(db: Session, cert_id: int):
    db_cert = db.query(Certification).filter(Certification.id == cert_id).first()
    if db_cert:
        db.delete(db_cert)
        db.commit()
    return db_cert

# Client CRUD
def get_clients(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Client).order_by(Client.order.asc())\
             .offset(skip).limit(limit).all()

def create_client(db: Session, client: ClientCreate):
    db_client = Client(**client.model_dump())
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client

def update_client(db: Session, client_id: int, client: ClientUpdate):
    db_client = db.query(Client).filter(Client.id == client_id).first()
    if db_client:
        for key, value in client.model_dump(exclude_unset=True).items():
            setattr(db_client, key, value)
        db.commit()
        db.refresh(db_client)
    return db_client

def delete_client(db: Session, client_id: int):
    db_client = db.query(Client).filter(Client.id == client_id).first()
    if db_client:
        db.delete(db_client)
        db.commit()
    return db_client 