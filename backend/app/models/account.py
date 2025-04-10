from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base

class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)
    account_name = Column(String, index=True)
    purpose = Column(String)
    broker = Column(String)
    account_balance = Column(Float)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Relationship with user
    user = relationship("User", back_populates="accounts")
    
    # Relationship with trading daily books
    daily_books = relationship("TradingDailyBook", back_populates="account", cascade="all, delete-orphan")
