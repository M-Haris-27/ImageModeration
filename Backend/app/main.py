from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, moderation
from app.core.database import connect_to_mongo, close_mongo_connection

app = FastAPI(
    title="Image Moderation API",
    description="API for moderating images and managing authentication tokens",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(moderation.router, prefix="/moderate", tags=["Moderation"])

# Health check endpoint
@app.get("/", tags=["Health"])
async def root():
    return {"message": "Image Moderation API is running"}

@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy"}

# Lifecycle events for MongoDB connection
@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()