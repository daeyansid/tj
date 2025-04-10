from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import date

from app.database.database import get_db
from app.models.schemas import TradingPlan as TradingPlanSchema, TradingPlanCreate, TradingPlanUpdate
from app.models.trading_plan import TradingPlan
from app.utils.auth import get_current_active_user
from app.models.user import User

router = APIRouter(prefix="/trading-plans", tags=["trading plans"])

@router.get("/", response_model=List[TradingPlanSchema])
def get_trading_plans(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get all trading plans for the current user"""
    trading_plans = db.query(TradingPlan).filter(TradingPlan.user_id == current_user.id).all()
    return trading_plans

@router.get("/{plan_id}", response_model=TradingPlanSchema)
def get_trading_plan(
    plan_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get trading plan by ID"""
    plan = db.query(TradingPlan).filter(
        TradingPlan.id == plan_id, TradingPlan.user_id == current_user.id
    ).first()
    
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trading plan not found"
        )
    
    return plan

@router.post("/", response_model=TradingPlanSchema, status_code=status.HTTP_201_CREATED)
def create_trading_plan(
    plan_data: TradingPlanCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new trading plan"""
    db_plan = TradingPlan(
        **plan_data.dict(),
        user_id=current_user.id
    )
    
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)
    
    return db_plan

@router.put("/{plan_id}", response_model=TradingPlanSchema)
def update_trading_plan(
    plan_id: int,
    plan_data: TradingPlanUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update an existing trading plan"""
    plan = db.query(TradingPlan).filter(
        TradingPlan.id == plan_id, TradingPlan.user_id == current_user.id
    ).first()
    
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trading plan not found"
        )
    
    # Update plan fields
    for key, value in plan_data.dict().items():
        setattr(plan, key, value)
    
    db.commit()
    db.refresh(plan)
    
    return plan

@router.delete("/{plan_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_trading_plan(
    plan_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete a trading plan"""
    plan = db.query(TradingPlan).filter(
        TradingPlan.id == plan_id, TradingPlan.user_id == current_user.id
    ).first()
    
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trading plan not found"
        )
    
    db.delete(plan)
    db.commit()
    
    return None

@router.patch("/{plan_id}/toggle-status", response_model=TradingPlanSchema)
def toggle_plan_status(
    plan_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Toggle the status of a trading plan (pending/done)"""
    plan = db.query(TradingPlan).filter(
        TradingPlan.id == plan_id, TradingPlan.user_id == current_user.id
    ).first()
    
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trading plan not found"
        )
    
    # Toggle status
    plan.status = not plan.status
    
    db.commit()
    db.refresh(plan)
    
    return plan
