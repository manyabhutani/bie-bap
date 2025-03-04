import re
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User

# Define the OAuth2 scheme to extract the token from the Authorization header.
# The tokenUrl should point to your login endpoint.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(
        db: Session = Depends(get_db),
        token: str = Depends(oauth2_scheme)
) -> User:

    pattern = r"^dummy-token-for-(.+)$"
    match = re.match(pattern, token)
    if not match:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token format",
            headers={"WWW-Authenticate": "Bearer"},
        )
    email = match.group(1)
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

def organiser_required(user: User = Depends(get_current_user)):

    if user.role != "organiser":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied, organiser role required"
        )
    return user



