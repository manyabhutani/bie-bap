from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.schemas.skills import SkillRead

from app.schemas.volunteers import VolunteerRead


class EventBase(BaseModel):
    title: str
    description: str
    location: str
    start_time: datetime
    end_time: datetime
    max_volunteers: int = 0

class EventCreate(EventBase):
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
    volunteers: List[VolunteerRead] = []

class VolunteerAssignRequest(BaseModel):
    volunteer_ids: List[int]

class Config:
        orm_mode = True

class EventDetail(EventRead):
    required_skills: List[SkillRead] = []

    class Config:
        orm_mode = True
