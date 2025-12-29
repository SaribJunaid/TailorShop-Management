from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models import piece, measurement
from app.models.database import get_db

router = APIRouter(prefix="/pieces", tags=["Pieces"])

@router.post("/")
def add_piece(measurement_id: int, name: str, size_details: dict = None, db: Session = Depends(get_db)):
    meas = db.query(measurement.Measurement).filter(measurement.Measurement.id == measurement_id).first()
    if not meas:
        raise HTTPException(status_code=404, detail="Measurement not found")

    new_piece = piece.Piece(measurement_id=measurement_id, name=name, size_details=size_details)
    db.add(new_piece)
    db.commit()
    db.refresh(new_piece)
    return new_piece

@router.get("/")
def get_pieces(db: Session = Depends(get_db)):
    return db.query(piece.Piece).all()
