from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings
from typing import Optional
import logging

logger = logging.getLogger(__name__)

# Global variables to store database connection
mongodb_client: Optional[AsyncIOMotorClient] = None
database: Optional[AsyncIOMotorDatabase] = None

async def connect_to_mongo():
    """Create database connection and initialize collections"""
    global mongodb_client, database
    
    try:
        mongodb_client = AsyncIOMotorClient(settings.MONGODB_URL)
        database = mongodb_client[settings.DATABASE_NAME]
        
        # Test the connection
        await database.command("ping")
        logger.info(f"Connected to MongoDB at {settings.MONGODB_URL}")
        
        # Create indexes for better performance
        await create_indexes()
        
        # Create initial admin token if specified
        if settings.INITIAL_ADMIN_TOKEN:
            await create_initial_admin_token()
            
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        raise

async def close_mongo_connection():
    """Close database connection"""
    global mongodb_client
    if mongodb_client:
        mongodb_client.close()
        logger.info("Disconnected from MongoDB")

def get_db() -> AsyncIOMotorDatabase:
    """Get database instance"""
    if database is None:
        raise Exception("Database not initialized. Call connect_to_mongo() first.")
    return database

async def create_indexes():
    """Create database indexes for better performance"""
    db = get_db()
    
    # Create index on tokens collection
    await db.tokens.create_index("token", unique=True)
    await db.tokens.create_index("createdAt")
    
    # Create indexes on usages collection
    await db.usages.create_index("token")
    await db.usages.create_index("timestamp")
    await db.usages.create_index([("token", 1), ("timestamp", -1)])
    
    logger.info("Database indexes created successfully")

async def create_initial_admin_token():
    """Create initial admin token if it doesn't exist"""
    from datetime import datetime
    
    db = get_db()
    
    # Check if admin token already exists
    existing_token = await db.tokens.find_one({"token": settings.INITIAL_ADMIN_TOKEN})
    
    if not existing_token:
        token_doc = {
            "token": settings.INITIAL_ADMIN_TOKEN,
            "isAdmin": True,
            "createdAt": datetime.utcnow()
        }
        await db.tokens.insert_one(token_doc)
        logger.info("Initial admin token created")