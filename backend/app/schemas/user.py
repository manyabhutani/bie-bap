from pydantic import BaseModel, EmailStr
from typing import Optional
from enum import Enum

class UserRole(str, Enum):
    organizer = "organizer"
    volunteer = "volunteer"

class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str
    whatsapp_number: str
    role: Optional[str] = UserRole.volunteer

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserRead(BaseModel):
    id: int
    name: str
    email: EmailStr
    whatsapp_number: str
    role: str

    class Config:
        orm_mode = True
