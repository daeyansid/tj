from pydantic import BaseModel, EmailStr
from datetime import date
from typing import Optional
from enum import Enum

class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

# Account schemas
class AccountBase(BaseModel):
    account_name: str
    purpose: str
    broker: str
    account_balance: float

class AccountCreate(AccountBase):
    pass

class AccountUpdate(AccountBase):
    pass

class Account(AccountBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

# Trading Plan schemas
class TradingPlanBase(BaseModel):
    day: str
    account_balance: float
    daily_target: float
    required_lots: float
    rounded_lots: float
    risk_amount: float
    risk_percentage: float
    sl_pips: float
    tp_pips: float
    status: bool = False
    reason: Optional[str] = None
    plan_date: date

class TradingPlanCreate(TradingPlanBase):
    pass

class TradingPlanUpdate(TradingPlanBase):
    pass

class TradingPlan(TradingPlanBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

# Trading Daily Book schemas
class TradingResult(str, Enum):
    LOSS_OVERALL = "Loss Overall"
    PROFIT_OVERALL = "Profit Overall"
    LIQUIDATED = "Liquidated"
    BREAKEVEN = "Breakeven" 
    NO_TRADE = "No Trade"
    NO_RESULT = "No Result"

class TradingDailyBookBase(BaseModel):
    date: date
    account_id: int
    starting_balance: float
    ending_balance: float
    sentiment: Optional[str] = None
    withdraw: float = 0.0
    summary: Optional[str] = None
    result: TradingResult = TradingResult.NO_RESULT
    remarks: Optional[str] = None

class TradingDailyBookCreate(TradingDailyBookBase):
    pass

class TradingDailyBookUpdate(BaseModel):
    date: Optional[date] = None
    account_id: Optional[int] = None
    ending_balance: Optional[float] = None
    sentiment: Optional[str] = None
    withdraw: Optional[float] = None
    summary: Optional[str] = None
    result: Optional[TradingResult] = None
    remarks: Optional[str] = None

class TradingDailyBook(TradingDailyBookBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class AccountWithBalance(BaseModel):
    id: int
    account_name: str
    account_balance: float

    class Config:
        from_attributes = True
