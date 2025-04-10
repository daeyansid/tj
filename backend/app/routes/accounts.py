from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.database import get_db
from app.models.schemas import Account as AccountSchema, AccountCreate, AccountUpdate
from app.models.account import Account
from app.utils.auth import get_current_active_user
from app.models.user import User

router = APIRouter(prefix="/accounts", tags=["accounts"])

@router.get("/", response_model=List[AccountSchema])
def get_accounts(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get all accounts for the current user"""
    accounts = db.query(Account).filter(Account.user_id == current_user.id).all()
    return accounts

@router.get("/{account_id}", response_model=AccountSchema)
def get_account(
    account_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get account by ID"""
    account = db.query(Account).filter(
        Account.id == account_id, Account.user_id == current_user.id
    ).first()
    
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found"
        )
    
    return account

@router.post("/", response_model=AccountSchema, status_code=status.HTTP_201_CREATED)
def create_account(
    account_data: AccountCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new account"""
    db_account = Account(
        **account_data.dict(),
        user_id=current_user.id
    )
    
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    
    return db_account

@router.put("/{account_id}", response_model=AccountSchema)
def update_account(
    account_id: int,
    account_data: AccountUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update an existing account"""
    account = db.query(Account).filter(
        Account.id == account_id, Account.user_id == current_user.id
    ).first()
    
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found"
        )
    
    # Update account fields
    for key, value in account_data.dict().items():
        setattr(account, key, value)
    
    db.commit()
    db.refresh(account)
    
    return account

@router.delete("/{account_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_account(
    account_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete an account"""
    account = db.query(Account).filter(
        Account.id == account_id, Account.user_id == current_user.id
    ).first()
    
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found"
        )
    
    db.delete(account)
    db.commit()
    
    return None
