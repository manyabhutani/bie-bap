import re
from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from datetime import timedelta
from app.schemas.user import UserSignup, UserLogin, UserRead
from app.schemas.volunteers import VolunteerCreate
from app.db.session import get_db
from app.services.auth_services import create_user, authenticate_user, get_all_users
from app.auth.security import create_access_token, create_refresh_token
from app.config import settings

router = APIRouter()

def is_valid_whatsapp_number(phone: str) -> bool:
    pattern = r"^\+?[1-9]\d{7,14}$"
    return re.match(pattern, phone) is not None

@router.post("/signup", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def signup(user_data: UserSignup, db: Session = Depends(get_db)):
    if not is_valid_whatsapp_number(user_data.whatsapp_number):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid WhatsApp number format. Use international format, e.g., +1234567890"
        )
    try:
        user = create_user(db, user_data)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    return user

@router.post("/login")
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = authenticate_user(db, credentials.email, credentials.password)

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")



    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    refresh_token_expires = timedelta(minutes=settings.refresh_token_expire_minutes)
    access_token = create_access_token(data={"sub": str(user.id)}, expires_delta=access_token_expires)
    refresh_token = create_refresh_token(data={"sub": str(user.id)}, expires_delta=refresh_token_expires)
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "role": user.role
    }

@router.post("/refresh")
def refresh_token(refresh_token: str, db: Session = Depends(get_db)):
    from jose import JWTError, jwt
    try:
        payload = jwt.decode(refresh_token, settings.secret_key, algorithms=[settings.algorithm])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    # Generate new access token
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    new_access_token = create_access_token(data={"sub": str(user.id)}, expires_delta=access_token_expires)
    return {"access_token": new_access_token, "token_type": "bearer"}

@router.get("/users", response_model=list[UserRead])
def get_all_users_endpoint(db: Session = Depends(get_db)):
    return get_all_users(db)
