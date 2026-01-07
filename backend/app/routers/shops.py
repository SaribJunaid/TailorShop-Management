from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.database import get_db
from app.models.shop import Shop
from app.models.user import User
from app.api.deps import get_current_user

router = APIRouter(prefix="/shops", tags=["Shops"])

@router.get("/my-shop")
def get_my_shop(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    shop = db.query(Shop).filter(Shop.id == current_user.shop_id).first()
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")
    return shop

@router.put("/{shop_id}")
def update_shop(
    shop_id: int, 
    shop_data: dict, # Or use a proper Pydantic schema
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    if current_user.shop_id != shop_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this shop")
    
    shop = db.query(Shop).filter(Shop.id == shop_id).first()
    for key, value in shop_data.items():
        if hasattr(shop, key):
            setattr(shop, key, value)
    
    db.commit()
    return shop