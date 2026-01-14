from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List

from app.models.database import get_db
from app.models.user import User
from app.schemas.user import UserRead
from app.api.deps import get_current_user # Use your existing dependency

router = APIRouter(prefix="/admin", tags=["Admin Control"])

# Internal Security Helper
def validate_admin(current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Access denied. Admins only."
        )
    return current_user

@router.get("/users", response_model=List[UserRead])
def get_all_users(db: Session = Depends(get_db), admin: User = Depends(validate_admin)):
    # Now secured: only an admin can see this list
    return db.query(User).filter(User.is_admin == False).all()

@router.post("/renew/{user_id}")
def renew_subscription(user_id: int, db: Session = Depends(get_db), admin: User = Depends(validate_admin)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Senior Dev Logic: Handle 'None' expiry dates safely
    current_expiry = user.subscription_expires_at or datetime.now()
    base_date = max(current_expiry, datetime.now())
    
    user.subscription_expires_at = base_date + timedelta(days=30)
    user.is_active = True 
    
    db.commit()
    return {"message": f"Success. New expiry: {user.subscription_expires_at}"}