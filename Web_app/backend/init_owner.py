from app.models.database import SessionLocal
from app.models.user import User
from app.core.security import hash_password as get_password_hash

db = SessionLocal()
owner = User(
    name="Owner",
    username="owner",
    password_hash=get_password_hash("owner123"),
    role="OWNER",
    shop_id=None
)
db.add(owner)
db.commit()
db.close()
