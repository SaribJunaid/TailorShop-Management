from Web_app.backend.app.models.database import Base, engine, SessionLocal
from app.models.user import User
from app.core.security import hash_password
from app.models.shop import Shop

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

# Create DB session
db = SessionLocal()

# Check if OWNER already exists
owner_exists = db.query(User).filter(User.role == "OWNER").first()
if owner_exists:
    print("Owner already exists.")
else:
    owner = User(
        shop_id=1,               # single shop for Stage 01
        name="Owner Name",       # replace with real name
        username="admin",        # login username
        password_hash=hash_password("admin123"),  # replace with secure password
        role="OWNER"
    )
    db.add(owner)
    db.commit()
    print("OWNER user created successfully!")

db.close()
