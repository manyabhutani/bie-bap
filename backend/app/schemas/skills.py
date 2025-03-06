# app/schemas/skill.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SkillBase(BaseModel):
    name: str
    description: Optional[str] = None

class SkillCreate(SkillBase):
    pass

class SkillRead(SkillBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
