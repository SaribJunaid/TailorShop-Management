from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from app.models.database import get_db
from app.models.user import User
from app.models.shop import Shop
from app.schemas.user import UserCreate, UserRead, Token
from app.core.security import hash_password, verify_password
from app.core.jwt import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register_shop_owner(user_in: UserCreate, db: Session = Depends(get_db)):
    """
    Creates a new Shop and a User as the owner in one go.
    """
    # 1. Check if username already exists
    existing_user = db.query(User).filter(User.username == user_in.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")

    # 2. Create the Shop first
    new_shop = Shop(name=user_in.shop_name)
    db.add(new_shop)
    db.commit()
    db.refresh(new_shop)

    # 3. Create the User linked to that Shop
    new_user = User(
        username=user_in.username,
        name=user_in.name,
        password_hash=hash_password(user_in.password),
        phone=user_in.phone,
        shop_id=new_shop.id
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

@router.post("/login", response_model=Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(get_db)
):
    """
    Standard OAuth2 compatible token login.
    """
    user = db.query(User).filter(User.username == form_data.username).first()
    
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}