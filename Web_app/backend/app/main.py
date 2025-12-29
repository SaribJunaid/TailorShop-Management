from fastapi import FastAPI
from app.routers import (
    auth,
    customers,
    measurements,
    pieces,
    shops,
    stitchers,
    assignments,
    users
)

app = FastAPI(title="Tailor Shop Management API")

# Include routers
app.include_router(auth.router)
app.include_router(customers.router)
app.include_router(measurements.router)
app.include_router(pieces.router)
app.include_router(shops.router)
app.include_router(stitchers.router)
app.include_router(assignments.router)
app.include_router(users.router)

@app.get("/")
def read_root():
    return {"message": "Tailor Shop Management API Running"}
