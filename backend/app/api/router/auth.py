from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from app.schemas.user import UserSignup, UserLogin, UserRead
from app.db.session import get_db
from app.services.auth_services import create_user, authenticate_user, get_all_users

router = APIRouter()

@router.post("/signup", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def signup(user_data: UserSignup, db: Session = Depends(get_db)):
    user = create_user(db, user_data)
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists")
    return user

@router.post("/login")
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = authenticate_user(db, credentials.email, credentials.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = f"dummy-token-for-{user.email}"
    return {"access_token": token, "token_type": "bearer", "role": user.role}

@router.get("/users", response_model=list[UserRead])
def get_all_users_endpoint(db: Session = Depends(get_db)):
    return get_all_users(db)
