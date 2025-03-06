#for many to many relationship between entities

from sqlalchemy import Table, Column, Integer, ForeignKey
from app.database import Base

volunteer_skills = Table(
    "volunteer_skills",
    Base.metadata,
    Column("volunteer_id", Integer, ForeignKey("volunteers.id")),
    Column("skill_id", Integer, ForeignKey("skills.id"))
)

volunteer_events = Table(
    "volunteer_events",
    Base.metadata,
    Column("volunteer_id", Integer, ForeignKey("volunteers.id")),
    Column("event_id", Integer, ForeignKey("events.id")),
    Column("status", String, default="registered"),  # e.g. registered, confirmed, attended, cancelled
)

event_required_skills = Table(
    "event_required_skills",
    Base.metadata,
    Column("event_id", Integer, ForeignKey("events.id")),
    Column("skill_id", Integer, ForeignKey("skills.id"))
)
