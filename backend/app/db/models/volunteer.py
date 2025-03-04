from sqlalchemy import Column, Integer, String, ForeignKey, Table, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .user import Base

# Association table for many-to-many relationship between volunteers and skills
volunteer_skills = Table(
    "volunteer_skills",
    Base.metadata,
    Column("volunteer_id", Integer, ForeignKey("volunteers.id")),
    Column("skill_id", Integer, ForeignKey("skills.id"))
)

# Association table for many-to-many relationship between volunteers and events
volunteer_events = Table(
    "volunteer_events",
    Base.metadata,
    Column("volunteer_id", Integer, ForeignKey("volunteers.id")),
    Column("event_id", Integer, ForeignKey("events.id")),
    Column("status", String, default="registered"),  # registered, confirmed, attended, cancelled
    Column("created_at", DateTime(timezone=True), server_default=func.now())
)

class Volunteer(Base):
    __tablename__ = "volunteers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    first_name = Column(String)
    last_name = Column(String)
    phone = Column(String)
    bio = Column(Text, nullable=True)
    availability = Column(String, nullable=True)  # JSON string storing availability
    location = Column(String, nullable=True)
    whatsapp_opt_in = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="volunteer")
    skills = relationship("Skill", secondary=volunteer_skills, back_populates="volunteers")
    events = relationship("Event", secondary=volunteer_events, back_populates="volunteers")

    def __repr__(self):
        return f"<Volunteer(id={self.id}, name={self.first_name} {self.last_name})>"

