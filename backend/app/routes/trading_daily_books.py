from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import date

from app.database.database import get_db
from app.models.schemas import (
    TradingDailyBook as TradingDailyBookSchema,
    TradingDailyBookCreate,
    TradingDailyBookUpdate,
    AccountWithBalance
)
from app.models.trading_daily_book import TradingDailyBook
from app.models.account import Account
from app.utils.auth import get_current_active_user
from app.models.user import User

router = APIRouter(prefix="/trading-daily-books", tags=["trading daily books"])

@router.get("/", response_model=List[TradingDailyBookSchema])
def get_trading_daily_books(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get all trading daily books for the current user"""
    daily_books = db.query(TradingDailyBook).filter(
        TradingDailyBook.user_id == current_user.id
    ).order_by(TradingDailyBook.date.desc()).all()
    return daily_books

@router.get("/accounts", response_model=List[AccountWithBalance])
def get_accounts_with_balance(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get all accounts with their current balance for the dropdown selection"""
    accounts = db.query(Account).filter(
        Account.user_id == current_user.id
    ).all()
    return accounts

@router.get("/{book_id}", response_model=TradingDailyBookSchema)
def get_trading_daily_book(
    book_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get trading daily book by ID"""
    book = db.query(TradingDailyBook).filter(
        TradingDailyBook.id == book_id, TradingDailyBook.user_id == current_user.id
    ).first()
    
    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trading daily book entry not found"
        )
    
    return book

@router.post("/", response_model=TradingDailyBookSchema, status_code=status.HTTP_201_CREATED)
def create_trading_daily_book(
    book_data: TradingDailyBookCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new trading daily book entry and update account balance"""
    # Verify account exists and belongs to user
    account = db.query(Account).filter(
        Account.id == book_data.account_id, Account.user_id == current_user.id
    ).first()
    
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found or does not belong to you"
        )
    
    # Auto-fill starting balance from account
    starting_balance = account.account_balance
    
    # Create new book entry - handle both Pydantic v1 and v2
    if hasattr(book_data, "model_dump"):
        # Pydantic v2
        book_data_dict = book_data.model_dump()
    else:
        # Pydantic v1
        book_data_dict = book_data.dict()
    
    # Remove starting_balance if it exists in the dict to avoid duplication
    if 'starting_balance' in book_data_dict:
        book_data_dict.pop('starting_balance')
    
    db_book = TradingDailyBook(
        **book_data_dict,
        starting_balance=starting_balance,
        user_id=current_user.id
    )
    
    db.add(db_book)
    
    # Update the account balance to match the ending balance
    account.account_balance = book_data.ending_balance
    
    db.commit()
    db.refresh(db_book)
    
    return db_book

@router.put("/{book_id}", response_model=TradingDailyBookSchema)
def update_trading_daily_book(
    book_id: int,
    book_data: TradingDailyBookUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update an existing trading daily book entry and account balance if needed"""
    # Get the existing book entry
    book = db.query(TradingDailyBook).filter(
        TradingDailyBook.id == book_id, TradingDailyBook.user_id == current_user.id
    ).first()
    
    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trading daily book entry not found"
        )
    
    # Check if account is changing
    account_changing = book_data.account_id is not None and book_data.account_id != book.account_id
    
    # Check if ending balance is changing
    balance_changing = book_data.ending_balance is not None and book_data.ending_balance != book.ending_balance
    
    # If account is changing, verify new account exists and belongs to user
    if account_changing:
        new_account = db.query(Account).filter(
            Account.id == book_data.account_id, Account.user_id == current_user.id
        ).first()
        
        if not new_account:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="New account not found or does not belong to you"
            )
    
    # Update book entry fields
    for key, value in book_data.dict(exclude_unset=True).items():
        setattr(book, key, value)
    
    # If ending balance is changing, update the account balance
    if balance_changing or account_changing:
        # Get current account
        account = db.query(Account).filter(Account.id == book.account_id).first()
        
        if account:
            # Update account balance
            account.account_balance = book_data.ending_balance or book.ending_balance
    
    db.commit()
    db.refresh(book)
    
    return book

@router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_trading_daily_book(
    book_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete a trading daily book entry"""
    book = db.query(TradingDailyBook).filter(
        TradingDailyBook.id == book_id, TradingDailyBook.user_id == current_user.id
    ).first()
    
    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trading daily book entry not found"
        )
    
    db.delete(book)
    db.commit()
    
    return None
