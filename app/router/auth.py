from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from app.schemas.auth import UserSignup, UserLogin
from app.database import get_db
from app.services.auth_service import create_user, authenticate_user

router = APIRouter()

@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(user_data: UserSignup, db: Session = Depends(get_db)):
    user = create_user(db, user_data)
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists")
    return {"message": "User created successfully", "user": {"id": user.id, "email": user.email, "role": user.role}}

@router.post("/login")
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = authenticate_user(db, credentials.email, credentials.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = "dummy-token-for-" + user.email
    return {"access_token": token, "token_type": "bearer", "role": user.role}
