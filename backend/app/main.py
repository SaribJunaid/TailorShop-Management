from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from app.routers import auth, customers, stitchers, measurements, orders,dashboard,shops, users
# Load environment variables
load_dotenv()

app = FastAPI(
    title="TailorShop SaaS API",
    description="Professional multi-tenant management system for tailoring shops.",
    version="1.0.0",
    redirect_slashes=False
)

# --- CORS Configuration ---
# This allows your frontend (e.g., React on port 5173) to make requests to this API
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:8080").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],  # Allows all headers (like Authorization)
)

# --- Root Endpoint ---
@app.get("/")
async def root():
    return {
        "message": "TailorShop API is online",
        "docs": "/docs",
        "status": "healthy"
    }

# --- Router Registration ---
app.include_router(auth.router)
app.include_router(customers.router)
app.include_router(stitchers.router)
app.include_router(measurements.router)
app.include_router(orders.router)
app.include_router(dashboard.router)
app.include_router(shops.router)
app.include_router(users.router)