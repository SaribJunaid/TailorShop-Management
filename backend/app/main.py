from fastapi import FastAPI
from app.routers import auth, shops, customers, measurements, pieces, assignments, stitchers, users

app = FastAPI(title="Tailor Shop Management")

# Include all routers
app.include_router(auth.router)
app.include_router(shops.router)
app.include_router(customers.router)
app.include_router(measurements.router)
app.include_router(pieces.router)
app.include_router(assignments.router)
app.include_router(stitchers.router)
app.include_router(users.router)
