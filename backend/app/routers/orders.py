# from fastapi import APIRouter, Depends, HTTPException, status
# from sqlalchemy.orm import Session
# from typing import List
# from typing import Optional

# from app.models.database import get_db
# from app.models.order import Order
# from app.models.order_item import OrderItem
# from app.models.user import User
# from app.schemas.order import OrderCreate, OrderRead
# from app.api.deps import get_current_user
# from app.models.shop import Shop
# from app.schemas.order import OrderItemRead
# router = APIRouter(prefix="/orders", tags=["Orders"])
# from pydantic import BaseModel
# class ItemUpdate(BaseModel):
#     stitcher_id: int
#     status: Optional[str] = "in_progress"

# @router.post("/", response_model=OrderRead)
# def create_full_order(
#     order_in: OrderCreate, 
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user)
# ):
#     """
#     Creates a master order and all associated garments (items) in one go.
#     """
#     # 1. Calculate the initial balance
#     balance = order_in.total_amount - order_in.advance_paid

#     # 2. Create the Master Order
#     new_order = Order(
#         customer_id=order_in.customer_id,
#         shop_id=current_user.shop_id,
#         due_date=order_in.due_date,
#         total_amount=order_in.total_amount,
#         advance_paid=order_in.advance_paid,
#         balance_due=balance,
#         priority=order_in.priority,
#         status=order_in.status
#     )
    
#     db.add(new_order)
#     db.flush() # Flush gives us the new_order.id without committing yet

#     # 3. Create individual OrderItems (the garments)
#     for item_data in order_in.items:
#         new_item = OrderItem(
#             order_id=new_order.id,
#             garment_type=item_data.garment_type,
#             price=item_data.price,
#             measurement_id=item_data.measurement_id,
#             stitcher_id=item_data.stitcher_id,
#             notes=item_data.notes,
#             status=item_data.status
#         )
#         db.add(new_item)

#     # 4. Commit everything together
#     try:
#         db.commit()
#         db.refresh(new_order)
#     except Exception as e:
#         db.rollback()
#         raise HTTPException(status_code=400, detail=f"Failed to create order: {str(e)}")

#     return new_order

# @router.get("/public/{public_id}")
# def get_public_receipt(public_id: str, db: Session = Depends(get_db)):
#     """
#     Publicly accessible receipt view via UUID.
#     Includes Shop details so the customer knows who they are dealing with.
#     """
#     # 1. Fetch the order and join with OrderItems
#     order = db.query(Order).filter(Order.public_id == public_id).first()
    
#     if not order:
#         raise HTTPException(status_code=404, detail="Receipt not found")

#     # 2. Fetch the Shop details to show on the header of the receipt
#     shop = db.query(Shop).filter(Shop.id == order.shop_id).first()

#     return {
#         "shop_name": shop.name,
#         "receipt_no": f"ORD-{order.id}",
#         "date": order.created_at.strftime("%Y-%m-%d"),
#         "customer_name": order.customer.name,
#         "items": [
#             {
#                 "garment": item.garment_type,
#                 "price": item.price,
#                 "status": item.status,
#                 "notes": item.notes
#             } for item in order.items
#         ],
#         "summary": {
#             "total": order.total_amount,
#             "advance": order.advance_paid,
#             "balance": order.balance_due,
#             "status": order.status,
#             "due_date": order.due_date
#         },
#         "footer_message": f"Thank you for choosing {shop.name}!"
#     }

# @router.patch("/items/{item_id}/status")
# def update_item_status(
#     item_id: int, 
#     new_status: str, 
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user)
# ):
#     """Update status of a specific garment (e.g., from 'pending' to 'stitching')."""
#     item = db.query(OrderItem).join(Order).filter(
#         OrderItem.id == item_id,
#         Order.shop_id == current_user.shop_id
#     ).first()

#     if not item:
#         raise HTTPException(status_code=404, detail="Garment not found")

#     item.status = new_status
#     db.commit()
#     return {"message": "Status updated successfully", "new_status": new_status}

# @router.get("/", response_model=List[OrderRead])
# def list_orders(
#     status: Optional[str] = None,
#     priority: Optional[str] = None,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user)
# ):
#     """List shop orders with optional filtering by status and priority."""
#     query = db.query(Order).filter(Order.shop_id == current_user.shop_id)
    
#     if status:
#         query = query.filter(Order.status == status)
#     if priority:
#         query = query.filter(Order.priority == priority)
        
#     return query.order_by(Order.due_date.asc()).all()

# @router.get("/public/{public_id}", response_model=OrderRead)
# def get_public_order(public_id: str, db: Session = Depends(get_db)):
#     """
#     Special PUBLIC endpoint for customers to view their receipt via UUID.
#     Notice: No authentication (get_current_user) required here.
#     """
#     order = db.query(Order).filter(Order.public_id == public_id).first()
#     if not order:
#         raise HTTPException(status_code=404, detail="Order not found")
#     return order

# @router.get("/items/", response_model=List[OrderItemRead])
# def list_order_items(
#     assigned: Optional[bool] = None,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user)
# ):
#     query = db.query(OrderItem).join(Order).filter(Order.shop_id == current_user.shop_id)
    
#     if assigned is False:
#         query = query.filter(OrderItem.stitcher_id == None)
#     elif assigned is True:
#         query = query.filter(OrderItem.stitcher_id != None)
        
#     return query.all()

# @router.put("/items/{item_id}/")
# def update_order_item_assignment(
#     item_id: int,
#     update_data: ItemUpdate,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user)
# ):
#     # 1. Find the item
#     item = db.query(OrderItem).filter(OrderItem.id == item_id).first()
    
#     if not item:
#         raise HTTPException(status_code=404, detail="Item not found")

#     # 2. Update the fields
#     item.stitcher_id = update_data.stitcher_id
#     item.status = update_data.status

#     db.commit()
#     db.refresh(item)
#     return item

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from app.models.database import get_db
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.user import User
from app.models.shop import Shop
from app.schemas.order import OrderCreate, OrderRead, OrderItemRead
from app.api.deps import get_current_user
from app.schemas.order_item import OrderItemUpdate # Import the new schema
from app.schemas.order import OrderUpdate

router = APIRouter(prefix="/orders", tags=["Orders"])

# --- Request Schemas ---
class ItemUpdate(BaseModel):
    stitcher_id: int
    status: Optional[str] = "in_progress"

# --- Endpoints ---

@router.post("/", response_model=OrderRead)
def create_full_order(
    order_in: OrderCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Requirement: Create a master order and all garments in one go.
    """
    balance = order_in.total_amount - order_in.advance_paid

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
    db.flush() 

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

    try:
        db.commit()
        db.refresh(new_order)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Failed to create order: {str(e)}")

    return new_order


@router.get("/", response_model=List[OrderRead])
def list_orders(
    status: Optional[str] = None,
    customer_id: Optional[int] = None,
    priority: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List shop orders with optional filtering."""
    query = db.query(Order).filter(Order.shop_id == current_user.shop_id)
    
    if status:
        query = query.filter(Order.status == status)
    if priority:
        query = query.filter(Order.priority == priority)
        
    return query.order_by(Order.due_date.asc()).all()


@router.get("/items/", response_model=List[OrderItemRead])
def list_order_items(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Requirement #8: Fetches ALL items for the workshop page.
    The frontend will filter these into Pending, In-Progress, and Completed tabs.
    """
    return db.query(OrderItem).join(Order).filter(Order.shop_id == current_user.shop_id).all()


@router.put("/items/{item_id}", response_model=OrderItemRead) # Ensure it returns OrderItemRead
def update_order_item(
    item_id: int, 
    item_in: OrderItemUpdate, 
    db: Session = Depends(get_db)
):
    # 1. Fetch the item with its relationship
    item = db.query(OrderItem).filter(OrderItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    # 2. Update the item fields (status, stitcher_id, etc.)
    update_data = item_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(item, key, value)
    
    db.commit()

    # 3. AUTO-SYNC: Update Main Order Status based on all items
    all_items = db.query(OrderItem).filter(OrderItem.order_id == item.order_id).all()
    
    # Logic:
    # - If ANY item is "in_progress", the main order is "in_progress"
    # - If ALL items are "completed", main order is "ready" (for pickup)
    # - If ALL items are "delivered", main order is "completed"
    
    statuses = [i.status for i in all_items]
    
    if all(s == "delivered" for s in statuses):
        new_main_status = "completed"
    elif all(s == "completed" for s in statuses):
        new_main_status = "ready"
    elif any(s in ["in_progress", "stitching", "cutting"] for s in statuses):
        new_main_status = "in_progress"
    else:
        new_main_status = "pending"

    # 4. Save the Main Order status
    db.query(Order).filter(Order.id == item.order_id).update({"status": new_main_status})
    db.commit()
    
    # Refresh to ensure relationships (like stitcher name) are loaded
    db.refresh(item) 
    return item


@router.patch("/items/{item_id}/status")
def update_item_status(
    item_id: int, 
    new_status: str, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Manual status update for a specific garment."""
    item = db.query(OrderItem).join(Order).filter(
        OrderItem.id == item_id,
        Order.shop_id == current_user.shop_id
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="Garment not found")

    item.status = new_status
    db.commit()
    return {"message": "Status updated successfully", "new_status": new_status}


@router.delete("/{order_id}/")
def delete_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Requirement #6: Delete an order and its associated items."""
    order = db.query(Order).filter(
        Order.id == order_id, 
        Order.shop_id == current_user.shop_id
    ).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    db.delete(order)
    db.commit()
    return {"message": "Order and associated items deleted successfully"}


@router.get("/public/{public_id}")
def get_public_receipt(public_id: str, db: Session = Depends(get_db)):
    """Publicly accessible receipt view via UUID."""
    order = db.query(Order).filter(Order.public_id == public_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Receipt not found")

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

@router.put("/{order_id}")
def update_order(
    order_id: int,
    order_in: OrderUpdate, # Use the Update schema here
    db: Session = Depends(get_db)
):
    order_query = db.query(Order).filter(Order.id == order_id)
    db_order = order_query.first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order_query.update(order_in.model_dump(exclude_unset=True))
    db.commit()
    return db_order