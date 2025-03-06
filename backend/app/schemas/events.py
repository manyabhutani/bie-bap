from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.schemas.skill import SkillRead


class EventBase(BaseModel):
    title: str
    description: str
    location: str
    start_time: datetime
    end_time: datetime
    max_volunteers: int = 0

class EventCreate(EventBase):
    organizer_id: int
    required_skill_ids: Optional[List[int]] = []

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    max_volunteers: Optional[int] = None

class EventRead(EventBase):
    id: int
    organizer_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class EventDetail(EventRead):
    required_skills: List[SkillRead] = []

    class Config:
        orm_mode = True
