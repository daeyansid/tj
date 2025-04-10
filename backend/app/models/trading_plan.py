from sqlalchemy import Column, Integer, String, Float, Boolean, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base
from datetime import date

class TradingPlan(Base):
    __tablename__ = "trading_plans"

    id = Column(Integer, primary_key=True, index=True)
    day = Column(String, index=True)
    account_balance = Column(Float)
    daily_target = Column(Float)
    required_lots = Column(Float)
    rounded_lots = Column(Float)
    risk_amount = Column(Float)  # Risk ($)
    risk_percentage = Column(Float)  # Risk (%)
    sl_pips = Column(Float)  # SL (pips)
    tp_pips = Column(Float)  # TP (pips)
    status = Column(Boolean, default=False)  # Pending (False) or Done (True)
    reason = Column(String, nullable=True)
    plan_date = Column(Date, default=date.today)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Relationship with user
    user = relationship("User", back_populates="trading_plans")
