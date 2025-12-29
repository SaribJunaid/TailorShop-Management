from fastapi import Depends, HTTPException
from jose import jwt
from app.core.jwt import SECRET_KEY, ALGORITHM

def get_current_user(token: str = Depends()):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

def owner_only(user=Depends(get_current_user)):
    if user["role"] != "OWNER":
        raise HTTPException(status_code=403, detail="Owner access required")
    return user
