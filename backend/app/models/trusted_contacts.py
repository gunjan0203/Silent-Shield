from sqlalchemy import Column, Integer, String, ForeignKey
from app.models.base import Base

class TrustedContact(Base):
    __tablename__ = "trusted_contacts"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String(100))
    phone = Column(String(20))
    email = Column(String(100))
    relation = Column(String(50))
