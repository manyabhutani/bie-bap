from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class SkillBase(BaseModel):
    name: str
    description: Optional[str] = None

class SkillCreate(SkillBase):
    pass

class Skill(SkillBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class VolunteerBase(BaseModel):
    first_name: str
    last_name: str
    phone: str
    bio: Optional[str] = None
    availability: Optional[str] = None
    location: Optional[str] = None
    whatsapp_opt_in: bool = False

class VolunteerCreate(VolunteerBase):
    user_id: int

class VolunteerUpdate(VolunteerBase):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None

class Volunteer(VolunteerBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    skills: List[Skill] = []

    class Config:
        orm_mode = True
