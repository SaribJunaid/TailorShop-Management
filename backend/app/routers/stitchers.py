from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models import stitcher
from app.models.database import get_db

router = APIRouter(prefix="/stitchers", tags=["Stitchers"])

@router.post("/")
def add_stitcher(name: str, db: Session = Depends(get_db)):
    new_stitcher = stitcher.Stitcher(name=name)
    db.add(new_stitcher)
    db.commit()
    db.refresh(new_stitcher)
    return new_stitcher

@router.get("/")
def get_stitchers(db: Session = Depends(get_db)):
    return db.query(stitcher.Stitcher).all()
