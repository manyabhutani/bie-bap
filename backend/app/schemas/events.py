from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class EventBase(BaseModel):
    title: str
    description: str
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    start_time: datetime
    end_time: datetime
    max_volunteers: int = 0

class EventCreate(EventBase):
    organizer_id: int
    required_skill_ids: Optional[List[int]] = None

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    max_volunteers: Optional[int] = None

class EventVolunteerRegistration(BaseModel):
    volunteer_id: int
    event_id: int

class Event(EventBase):
    id: int
    organizer_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    volunteers_count: Optional[int] = None

    class Config:
        orm_mode = True

class EventDetail(Event):
    required_skills: List[Skill] = []

    class Config:
        orm_mode = True