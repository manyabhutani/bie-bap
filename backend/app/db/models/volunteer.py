from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import  Base

from app.db.models.associations import  volunteer_events


from sqlalchemy.ext.mutable import MutableList
from sqlalchemy.types import JSON


class Volunteer(Base):
    __tablename__ = "volunteers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    first_name = Column(String)
    last_name = Column(String)
    phone = Column(String)
    bio = Column(Text, nullable=True)
    location = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    #from the google form
    nationality = Column(String)
    languages = Column(MutableList.as_mutable(JSON), nullable=True)  


    # Relationships
    user = relationship("User", backref="volunteer", uselist=False)
    events = relationship("Event", secondary=volunteer_events, back_populates="volunteers")

    def __repr__(self):
        return f"<Volunteer(id={self.id}, name={self.first_name} {self.last_name})>"
