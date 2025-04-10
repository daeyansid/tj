from pydantic import BaseModel, EmailStr

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
