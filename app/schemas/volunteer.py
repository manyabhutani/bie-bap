from pydantic import BaseModel, EmailStr
from typing import List, Optional

class VolunteerCreate(BaseModel):
    name: str
    email: EmailStr
    phone_number: str
    skills: List[str] = []
    availability: str

class VolunteerRead(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone_number: str
    skills: List[str]
    availability: str

    class Config:
        orm_mode = True

