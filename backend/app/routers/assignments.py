from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models import assignment, piece, stitcher
from app.models.database import get_db

router = APIRouter(prefix="/assignments", tags=["Assignments"])

@router.post("/")
def create_assignment(piece_id: int, stitcher_id: int, db: Session = Depends(get_db)):
    p = db.query(piece.Piece).filter(piece.Piece.id == piece_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Piece not found")

    s = db.query(stitcher.Stitcher).filter(stitcher.Stitcher.id == stitcher_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Stitcher not found")

    new_assignment = assignment.Assignment(piece_id=piece_id, stitcher_id=stitcher_id)
    db.add(new_assignment)
    db.commit()
    db.refresh(new_assignment)
    return new_assignment

@router.get("/")
def get_assignments(db: Session = Depends(get_db)):
    return db.query(assignment.Assignment).all()
