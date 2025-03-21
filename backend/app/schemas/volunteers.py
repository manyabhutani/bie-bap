from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from app.schemas.skills import SkillRead

class VolunteerBase(BaseModel):
    first_name: str
    last_name: str
    phone: str
    bio: Optional[str] = None
    location: Optional[str] = None
    whatsapp_opt_in: bool = False
    nationality: Optional[str] = None
    languages: Optional[List[str]] = []

class VolunteerCreate(VolunteerBase):
    user_id: int

class VolunteerUpdate(VolunteerBase):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    nationality: Optional[str] = None
    languages: Optional[List[str]] = []

class VolunteerRead(VolunteerBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    skills: List[SkillRead] = []

    class Config:
        orm_mode = True
