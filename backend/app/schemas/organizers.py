from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class OrganizerBase(BaseModel):
    organization_name: str
    description: Optional[str] = None
    phone: str
    address: Optional[str] = None

class OrganizerCreate(OrganizerBase):
    user_id: int

class OrganizerUpdate(BaseModel):
    organization_name: Optional[str] = None
    description: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

class OrganizerRead(OrganizerBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True
