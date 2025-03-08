from sqlalchemy import Column, Integer, String, Text, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import  Base
from app.db.models.associations import volunteer_events, event_required_skills

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

    # Relationships
    organizer = relationship("Organizer", back_populates="events")
    volunteers = relationship("Volunteer", secondary=volunteer_events, back_populates="events")
    required_skills = relationship("Skill", secondary=event_required_skills)

    def __repr__(self):
        return f"<Event(id={self.id}, title={self.title})>"
