from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.piece import PieceCreate, PieceRead, PieceUpdate
from app.crud import pieces as crud
from app.core.deps import get_db

router = APIRouter(
    prefix="/pieces",
    tags=["pieces"]
)

@router.post("/", response_model=PieceRead)
def create_piece_endpoint(piece: PieceCreate, db: Session = Depends(get_db)):
    return crud.create_piece(db, piece)

@router.get("/{piece_id}", response_model=PieceRead)
def get_piece_endpoint(piece_id: int, db: Session = Depends(get_db)):
    return crud.get_piece(db, piece_id)

@router.get("/", response_model=list[PieceRead])
def list_pieces_endpoint(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_pieces(db, skip, limit)

@router.put("/{piece_id}", response_model=PieceRead)
def update_piece_endpoint(piece_id: int, updates: PieceUpdate, db: Session = Depends(get_db)):
    db_piece = crud.get_piece(db, piece_id)
    return crud.update_piece(db, db_piece, updates)

@router.delete("/{piece_id}")
def delete_piece_endpoint(piece_id: int, db: Session = Depends(get_db)):
    db_piece = crud.get_piece(db, piece_id)
    crud.delete_piece(db, db_piece)
    return {"detail": "Piece deleted"}
