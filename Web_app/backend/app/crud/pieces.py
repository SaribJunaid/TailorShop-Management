from sqlalchemy.orm import Session
from app.models.piece import Piece
from app.schemas.piece import PieceCreate, PieceUpdate

def get_piece(db: Session, piece_id: int):
    return db.query(Piece).filter(Piece.id == piece_id).first()

def get_pieces(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Piece).offset(skip).limit(limit).all()

def create_piece(db: Session, piece: PieceCreate):
    db_piece = Piece(**piece.dict())
    db.add(db_piece)
    db.commit()
    db.refresh(db_piece)
    return db_piece

def update_piece(db: Session, db_piece: Piece, updates: PieceUpdate):
    for key, value in updates.dict(exclude_unset=True).items():
        setattr(db_piece, key, value)
    db.commit()
    db.refresh(db_piece)
    return db_piece

def delete_piece(db: Session, db_piece: Piece):
    db.delete(db_piece)
    db.commit()
