from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
from app.models.associations import volunteer_skills, volunteer_events

class Volunteer(Base):
    __tablename__ = "volunteers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    first_name = Column(String)
    last_name = Column(String)
    phone = Column(String)
    bio = Column(Text, nullable=True)
    availability = Column(String, nullable=True)
    location = Column(String, nullable=True)
    whatsapp_opt_in = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", backref="volunteer", uselist=False)
    skills = relationship("Skill", secondary=volunteer_skills, back_populates="volunteers")
    events = relationship("Event", secondary=volunteer_events, back_populates="volunteers")

    def __repr__(self):
        return f"<Volunteer(id={self.id}, name={self.first_name} {self.last_name})>"
