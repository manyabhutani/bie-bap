# app/models/skill.py
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base
from app.models.associations import volunteer_skills, event_required_skills

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    volunteers = relationship("Volunteer", secondary=volunteer_skills, back_populates="skills")
    events = relationship("Event", secondary=event_required_skills, back_populates="required_skills")

    def __repr__(self):
        return f"<Skill(id={self.id}, name={self.name})>"
