from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.stitcher import StitcherCreate, StitcherRead, StitcherUpdate
from app.crud import stitchers as crud
from app.core.deps import get_db

router = APIRouter(
    prefix="/stitchers",
    tags=["stitchers"]
)

@router.post("/", response_model=StitcherRead)
def create_stitcher_endpoint(stitcher: StitcherCreate, db: Session = Depends(get_db)):
    return crud.create_stitcher(db, stitcher)

@router.get("/{stitcher_id}", response_model=StitcherRead)
def get_stitcher_endpoint(stitcher_id: int, db: Session = Depends(get_db)):
    return crud.get_stitcher(db, stitcher_id)

@router.get("/", response_model=list[StitcherRead])
def list_stitchers_endpoint(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_stitchers(db, skip, limit)

@router.put("/{stitcher_id}", response_model=StitcherRead)
def update_stitcher_endpoint(stitcher_id: int, updates: StitcherUpdate, db: Session = Depends(get_db)):
    db_stitcher = crud.get_stitcher(db, stitcher_id)
    return crud.update_stitcher(db, db_stitcher, updates)

@router.delete("/{stitcher_id}")
def delete_stitcher_endpoint(stitcher_id: int, db: Session = Depends(get_db)):
    db_stitcher = crud.get_stitcher(db, stitcher_id)
    crud.delete_stitcher(db, db_stitcher)
    return {"detail": "Stitcher deleted"}
