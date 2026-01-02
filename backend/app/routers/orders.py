from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from typing import Optional

from app.models.database import get_db
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.user import User
from app.schemas.order import OrderCreate, OrderRead
from app.api.deps import get_current_user
from app.models.shop import Shop
router = APIRouter(prefix="/orders", tags=["Orders"])

@router.post("/", response_model=OrderRead)
def create_full_order(
    order_in: OrderCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Creates a master order and all associated garments (items) in one go.
    """
    # 1. Calculate the initial balance
    balance = order_in.total_amount - order_in.advance_paid

    # 2. Create the Master Order
    new_order = Order(
        customer_id=order_in.customer_id,
        shop_id=current_user.shop_id,
        due_date=order_in.due_date,
        total_amount=order_in.total_amount,
        advance_paid=order_in.advance_paid,
        balance_due=balance,
        priority=order_in.priority,
        status=order_in.status
    )
    
    db.add(new_order)
    db.flush() # Flush gives us the new_order.id without committing yet

    # 3. Create individual OrderItems (the garments)
    for item_data in order_in.items:
        new_item = OrderItem(
            order_id=new_order.id,
            garment_type=item_data.garment_type,
            price=item_data.price,
            measurement_id=item_data.measurement_id,
            stitcher_id=item_data.stitcher_id,
            notes=item_data.notes,
            status=item_data.status
        )
        db.add(new_item)

    # 4. Commit everything together
    try:
        db.commit()
        db.refresh(new_order)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Failed to create order: {str(e)}")

    return new_order

@router.get("/public/{public_id}")
def get_public_receipt(public_id: str, db: Session = Depends(get_db)):
    """
    Publicly accessible receipt view via UUID.
    Includes Shop details so the customer knows who they are dealing with.
    """
    # 1. Fetch the order and join with OrderItems
    order = db.query(Order).filter(Order.public_id == public_id).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Receipt not found")

    # 2. Fetch the Shop details to show on the header of the receipt
    shop = db.query(Shop).filter(Shop.id == order.shop_id).first()

    return {
        "shop_name": shop.name,
        "receipt_no": f"ORD-{order.id}",
        "date": order.created_at.strftime("%Y-%m-%d"),
        "customer_name": order.customer.name,
        "items": [
            {
                "garment": item.garment_type,
                "price": item.price,
                "status": item.status,
                "notes": item.notes
            } for item in order.items
        ],
        "summary": {
            "total": order.total_amount,
            "advance": order.advance_paid,
            "balance": order.balance_due,
            "status": order.status,
            "due_date": order.due_date
        },
        "footer_message": f"Thank you for choosing {shop.name}!"
    }

@router.patch("/items/{item_id}/status")
def update_item_status(
    item_id: int, 
    new_status: str, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update status of a specific garment (e.g., from 'pending' to 'stitching')."""
    item = db.query(OrderItem).join(Order).filter(
        OrderItem.id == item_id,
        Order.shop_id == current_user.shop_id
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="Garment not found")

    item.status = new_status
    db.commit()
    return {"message": "Status updated successfully", "new_status": new_status}
@router.get("/", response_model=List[OrderRead])
def list_orders(
    status: Optional[str] = None,
    priority: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List shop orders with optional filtering by status and priority."""
    query = db.query(Order).filter(Order.shop_id == current_user.shop_id)
    
    if status:
        query = query.filter(Order.status == status)
    if priority:
        query = query.filter(Order.priority == priority)
        
    return query.order_by(Order.due_date.asc()).all()

@router.get("/public/{public_id}", response_model=OrderRead)
def get_public_order(public_id: str, db: Session = Depends(get_db)):
    """
    Special PUBLIC endpoint for customers to view their receipt via UUID.
    Notice: No authentication (get_current_user) required here.
    """
    order = db.query(Order).filter(Order.public_id == public_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order