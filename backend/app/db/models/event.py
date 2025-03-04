from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .user import Base
from .volunteer import volunteer_events

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    location = Column(String)
    start_time = Column(DateTime(timezone=True))
    end_time = Column(DateTime(timezone=True))
    organizer_id = Column(Integer, ForeignKey("organizers.id"))
    max_volunteers = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    organizer = relationship("Organizer", back_populates="events")
    volunteers = relationship("Volunteer", secondary=volunteer_events, back_populates="events")
    required_skills = relationship("Skill", secondary="event_required_skills")

    def __repr__(self):
        return f"<Event(id={self.id}, title={self.title})>"

from sqlalchemy import Table, Column, Integer, ForeignKey

event_required_skills = Table(
    "event_required_skills",
    Base.metadata,
    Column("event_id", Integer, ForeignKey("events.id")),
    Column("skill_id", Integer, ForeignKey("skills.id"))
)