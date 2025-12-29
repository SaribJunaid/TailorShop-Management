from sqlalchemy.orm import Session
from app.models.stitcher import Stitcher
from app.schemas.stitcher import StitcherCreate, StitcherUpdate

def get_stitcher(db: Session, stitcher_id: int):
    return db.query(Stitcher).filter(Stitcher.id == stitcher_id).first()

def get_stitchers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Stitcher).offset(skip).limit(limit).all()

def create_stitcher(db: Session, stitcher: StitcherCreate):
    db_stitcher = Stitcher(**stitcher.dict())
    db.add(db_stitcher)
    db.commit()
    db.refresh(db_stitcher)
    return db_stitcher

def update_stitcher(db: Session, db_stitcher: Stitcher, updates: StitcherUpdate):
    for key, value in updates.dict(exclude_unset=True).items():
        setattr(db_stitcher, key, value)
    db.commit()
    db.refresh(db_stitcher)
    return db_stitcher

def delete_stitcher(db: Session, db_stitcher: Stitcher):
    db.delete(db_stitcher)
    db.commit()
