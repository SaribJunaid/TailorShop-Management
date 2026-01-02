from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date

from app.models.database import get_db
from app.models.order import Order
from app.models.customer import Customer
from app.models.user import User
from app.api.deps import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get key metrics for the Shop Dashboard.
    """
    shop_id = current_user.shop_id
    today = date.today()

    # 1. Total Customers
    total_customers = db.query(Customer).filter(Customer.shop_id == shop_id).count()

    # 2. Active Orders (Orders that are not 'completed' or 'delivered')
    active_orders_count = db.query(Order).filter(
        Order.shop_id == shop_id,
        Order.status.notin_(["completed", "delivered"])
    ).count()

    # 3. Orders Due Today
    orders_due_today = db.query(Order).filter(
        Order.shop_id == shop_id,
        Order.due_date == today
    ).count()

    # 4. Total Receivables (Money still owed to the shop)
    total_receivable = db.query(func.sum(Order.balance_due)).filter(
        Order.shop_id == shop_id
    ).scalar() or 0.0

    # 5. Recent Orders (Last 5 orders)
    recent_orders = db.query(Order).filter(
        Order.shop_id == shop_id
    ).order_by(Order.created_at.desc()).limit(5).all()

    return {
        "metrics": {
            "total_customers": total_customers,
            "active_orders": active_orders_count,
            "urgent_today": orders_due_today,
            "total_receivable": total_receivable,
        },
        "recent_orders": recent_orders
    }