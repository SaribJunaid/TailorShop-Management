from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from app.models.database import get_db
from app.models.user import User
from app.core.jwt import SECRET_KEY, ALGORITHM

# This tells FastAPI where to look for the login token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(
    db: Session = Depends(get_db), 
    token: str = Depends(oauth2_scheme)
) -> User:
    """
    1. Validates the JWT token.
    2. Extracts the username (sub).
    3. Fetches the User object from the DB.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Decode the token using our Secret Key
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    # Find the user in the database
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception
        
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
        
    return user

from datetime import datetime, timedelta

# ... (Keep your existing get_current_user code)

def active_subscription_required(current_user: User = Depends(get_current_user)):
    """
    Enforces the 7-day trial and manual subscription logic.
    Admins bypass this check.
    """
    if current_user.is_admin:
        return current_user

    # 1. Trial Check (7 days from created_at)
    trial_period = current_user.created_at + timedelta(days=7)
    is_within_trial = datetime.now() <= trial_period

    # 2. Manual Subscription Check
    is_subscribed = (
        current_user.subscription_expires_at is not None and 
        current_user.subscription_expires_at >= datetime.now()
    )

    if not (is_within_trial or is_subscribed):
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail="Your trial or subscription has expired. Please contact admin for activation."
        )

    return current_user