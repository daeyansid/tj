from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.database.database import Base
from datetime import date
import enum

class TradingResult(str, enum.Enum):
    LOSS_OVERALL = "Loss Overall"
    PROFIT_OVERALL = "Profit Overall"
    LIQUIDATED = "Liquidated"
    BREAKEVEN = "Breakeven"
    NO_TRADE = "No Trade"
    NO_RESULT = "No Result"

class TradingDailyBook(Base):
    __tablename__ = "trading_daily_books"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, default=date.today, index=True)
    starting_balance = Column(Float)
    ending_balance = Column(Float)
    sentiment = Column(String, nullable=True)
    withdraw = Column(Float, default=0.0)
    summary = Column(String, nullable=True)
    result = Column(Enum(TradingResult), default=TradingResult.NO_RESULT)
    remarks = Column(String, nullable=True)
    
    # Foreign key to account
    account_id = Column(Integer, ForeignKey("accounts.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Relationships
    account = relationship("Account", back_populates="daily_books")
    user = relationship("User", back_populates="daily_books")
    
    @classmethod
    def from_dict(cls, data_dict, **kwargs):
        """
        Create a model instance from a dictionary, with the ability to override fields.
        Any kwargs will override values in the data_dict.
        """
        # Create a copy to avoid modifying the original
        merged_dict = data_dict.copy()
        
        # Override with any provided kwargs
        for key, value in kwargs.items():
            merged_dict[key] = value
            
        return cls(**merged_dict)
