from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.models.database import get_db
from app.models.stitcher import Stitcher
from app.models.user import User
from app.schemas.stitcher import StitcherCreate, StitcherRead, StitcherUpdate
from app.api.deps import get_current_user

router = APIRouter(prefix="/stitchers", tags=["Stitchers"])

@router.post("/", response_model=StitcherRead)
def create_stitcher(
    stitcher_in: StitcherCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Register a new stitcher/tailor for the current shop."""
    new_stitcher = Stitcher(
        **stitcher_in.model_dump(),
        shop_id=current_user.shop_id
    )
    db.add(new_stitcher)
    db.commit()
    db.refresh(new_stitcher)
    return new_stitcher

@router.get("/", response_model=List[StitcherRead])
def list_stitchers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all stitchers working for the logged-in user's shop."""
    return db.query(Stitcher).filter(Stitcher.shop_id == current_user.shop_id).all()

@router.put("/{stitcher_id}", response_model=StitcherRead)
def update_stitcher(
    stitcher_id: int,
    stitcher_in: StitcherUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stitcher_query = db.query(Stitcher).filter(
        Stitcher.id == stitcher_id, 
        Stitcher.shop_id == current_user.shop_id
    )
    stitcher = stitcher_query.first()
    
    if not stitcher:
        raise HTTPException(status_code=404, detail="Stitcher not found")
    
    update_data = stitcher_in.model_dump(exclude_unset=True)
    stitcher_query.update(update_data)
    db.commit()
    db.refresh(stitcher)
    return stitcher

@router.delete("/{stitcher_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_stitcher(
    stitcher_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stitcher = db.query(Stitcher).filter(
        Stitcher.id == stitcher_id, 
        Stitcher.shop_id == current_user.shop_id
    ).first()
    
    if not stitcher:
        raise HTTPException(status_code=404, detail="Stitcher not found")
        
    db.delete(stitcher)
    db.commit()
    return None