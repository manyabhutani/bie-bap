from pydantic import BaseModel
from datetime import datetime
from typing import List

class EventCreate(BaseModel):
    title: str
    description: str
    date: datetime
    location: str
    required_skills: List[str] = []

class EventRead(BaseModel):
    id: int
    title: str
    description: str
    date: datetime
    location: str
    required_skills: List[str]

    class Config:
        orm_mode = True

