from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.shop import ShopCreate, ShopRead, ShopUpdate
from app.crud import shops as crud
from app.core.deps import get_db

router = APIRouter(
    prefix="/shops",
    tags=["shops"]
)

@router.post("/", response_model=ShopRead)
def create_shop_endpoint(shop: ShopCreate, db: Session = Depends(get_db)):
    return crud.create_shop(db, shop)

@router.get("/{shop_id}", response_model=ShopRead)
def get_shop_endpoint(shop_id: int, db: Session = Depends(get_db)):
    return crud.get_shop(db, shop_id)

@router.get("/", response_model=list[ShopRead])
def list_shops_endpoint(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_shops(db, skip, limit)

@router.put("/{shop_id}", response_model=ShopRead)
def update_shop_endpoint(shop_id: int, updates: ShopUpdate, db: Session = Depends(get_db)):
    db_shop = crud.get_shop(db, shop_id)
    return crud.update_shop(db, db_shop, updates)

@router.delete("/{shop_id}")
def delete_shop_endpoint(shop_id: int, db: Session = Depends(get_db)):
    db_shop = crud.get_shop(db, shop_id)
    crud.delete_shop(db, db_shop)
    return {"detail": "Shop deleted"}
