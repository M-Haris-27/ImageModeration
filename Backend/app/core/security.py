from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.config import settings
import secrets
from typing import Dict, Any

# HTTP Bearer security scheme  
security = HTTPBearer()

def create_token(is_admin: bool = False) -> str:
    """Generate a secure random token"""
    return secrets.token_urlsafe(settings.TOKEN_LENGTH)

async def get_current_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    """
    Validate the current token and return token info.
    Import database inside function to avoid circular imports.
    """
    from app.core.database import get_db
    
    token = credentials.credentials
    db = get_db()
    
    # Find token in database
    token_doc = await db.tokens.find_one({"token": token})
    
    if not token_doc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return token_doc


async def get_current_user(token: Dict[str, Any] = Depends(get_current_token)):
    """Return both token and isAdmin status"""
    return {
        "token": token["token"],
        "isAdmin": token.get("isAdmin", False)
    }

async def get_admin_token(current_token: Dict[str, Any] = Depends(get_current_token)) -> Dict[str, Any]:
    """
    Validate that the current token has admin privileges.
    """
    if not current_token.get("isAdmin", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required. This endpoint requires an admin token."
        )
    
    return current_token

async def log_usage(token: str, endpoint: str):
    """Log API usage to the database"""
    from app.core.database import get_db
    from datetime import datetime
    
    db = get_db()
    usage_doc = {
        "token": token,
        "endpoint": endpoint,
        "timestamp": datetime.utcnow()
    }
    
    await db.usages.insert_one(usage_doc)