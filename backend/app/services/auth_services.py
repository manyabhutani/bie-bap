
from sqlalchemy.orm import Session
from app.db.models.user import User
from app.schemas.user import UserSignup
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_user(db: Session, user_data: UserSignup) -> User:
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        return None
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
        whatsapp_number=user_data.whatsapp_number,
        role=user_data.role  # e.g., "volunteer" or "organiser"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def authenticate_user(db: Session, email: str, password: str) -> User:
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user

def get_all_users(db: Session) -> list:
    return db.query(User).all()
