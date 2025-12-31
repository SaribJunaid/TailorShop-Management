from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, UserRead, UserUpdate
from app.crud import users as crud
from app.core.deps import get_db

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.post("/", response_model=UserRead)
def create_user_endpoint(user: UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db, user)

@router.get("/{user_id}", response_model=UserRead)
def get_user_endpoint(user_id: int, db: Session = Depends(get_db)):
    return crud.get_user(db, user_id)

@router.get("/", response_model=list[UserRead])
def list_users_endpoint(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_users(db, skip, limit)

@router.put("/{user_id}", response_model=UserRead)
def update_user_endpoint(user_id: int, updates: UserUpdate, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id)
    return crud.update_user(db, db_user, updates)

@router.delete("/{user_id}")
def delete_user_endpoint(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id)
    crud.delete_user(db, db_user)
    return {"detail": "User deleted"}
