from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# -------------------------------
# Database URL
# -------------------------------
# Using SQLite for local deployment
SQLALCHEMY_DATABASE_URL = "sqlite:///./tailor.db"

# If you want to switch to PostgreSQL or MySQL in future:
# SQLALCHEMY_DATABASE_URL = "postgresql://user:password@localhost/dbname"
# SQLALCHEMY_DATABASE_URL = "mysql+pymysql://user:password@localhost/dbname"

# -------------------------------
# Engine & Session Configuration
# -------------------------------
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}  # only for SQLite
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# -------------------------------
# Base Class for Models
# -------------------------------
Base = declarative_base()

# -------------------------------
# Dependency to use in FastAPI
# -------------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
