from app.models.database import Base, engine
from app.models import shop, user,assignment, customer, measurement, piece, stitcher

# Create all tables
Base.metadata.create_all(bind=engine)

print("Database tables created successfully!")
