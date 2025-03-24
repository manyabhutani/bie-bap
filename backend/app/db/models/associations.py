#for many to many relationship between entities

from sqlalchemy import Table, Column, Integer, ForeignKey , String
from app.db.session import  Base



volunteer_events = Table(
    "volunteer_events",
    Base.metadata,
    Column("volunteer_id", Integer, ForeignKey("volunteers.id")),
    Column("event_id", Integer, ForeignKey("events.id")),
    Column("status", String, default="registered"),  # e.g. registered, confirmed, attended, cancelled
)

