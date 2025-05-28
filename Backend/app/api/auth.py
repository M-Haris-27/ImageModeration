from fastapi import APIRouter, Depends, HTTPException, status
from app.core.database import get_db
from app.core.security import create_token, get_admin_token, log_usage
from app.models.token import Token, TokenCreate, TokenResponse
from datetime import datetime
from typing import List, Dict, Any

router = APIRouter()

@router.post("/tokens", response_model=TokenResponse, summary="Create a new token")
async def create_token_endpoint(
    token_create: TokenCreate, 
    admin: Dict[str, Any] = Depends(get_admin_token)
):
    """
    Create a new bearer token. Only accessible by admin tokens.
    
    Args:
        token_create: Token creation parameters
        admin: Admin token (automatically injected)
    
    Returns:
        TokenResponse: The created token with metadata
    """
    db = get_db()
    
    # Generate new token
    token_str = create_token(is_admin=token_create.isAdmin)
    
    # Create token document
    token_doc = {
        "token": token_str,
        "isAdmin": token_create.isAdmin,
        "createdAt": datetime.utcnow()
    }
    
    # Insert into database
    await db.tokens.insert_one(token_doc)
    
    # Log usage
    await log_usage(admin["token"], "/auth/tokens")
    
    return TokenResponse(
        token=token_str,
        isAdmin=token_create.isAdmin,
        createdAt=token_doc["createdAt"],
        message="Token created successfully"
    )

@router.get("/tokens", response_model=List[Token], summary="List all tokens")
async def get_tokens(admin: Dict[str, Any] = Depends(get_admin_token)):
    """
    Retrieve all tokens. Only accessible by admin tokens.
    
    Args:
        admin: Admin token (automatically injected)
    
    Returns:
        List[Token]: List of all tokens in the system
    """
    db = get_db()
    
    # Get all tokens
    tokens_cursor = db.tokens.find().sort("createdAt", -1)
    tokens = await tokens_cursor.to_list(length=None)
    
    # Log usage
    await log_usage(admin["token"], "/auth/tokens")
    
    return [Token(**token) for token in tokens]

@router.delete("/tokens/{token}", summary="Delete a token")
async def delete_token(
    token: str, 
    admin: Dict[str, Any] = Depends(get_admin_token)
):
    """
    Delete a specific token by its value. Only accessible by admin tokens.
    
    Args:
        token: The token string to delete
        admin: Admin token (automatically injected)
    
    Returns:
        dict: Success message
    """
    db = get_db()
    
    # Prevent admin from deleting their own token
    if token == admin["token"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own admin token"
        )
    
    # Delete the token
    result = await db.tokens.delete_one({"token": token})
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Token not found"
        )
    
    # Also delete usage records for this token
    await db.usages.delete_many({"token": token})
    
    # Log usage
    await log_usage(admin["token"], f"/auth/tokens/{token}")
    
    return {"message": "Token deleted successfully", "deleted_token": token}

@router.get("/usage-stats", summary="Get usage statistics")
async def get_usage_stats(admin: Dict[str, Any] = Depends(get_admin_token)):
    """
    Get API usage statistics. Only accessible by admin tokens.
    
    Args:
        admin: Admin token (automatically injected)
    
    Returns:
        dict: Usage statistics
    """
    db = get_db()
    
    # Get total usage count
    total_calls = await db.usages.count_documents({})
    
    # Get unique tokens count
    unique_tokens = len(await db.usages.distinct("token"))
    
    # Get calls by endpoint
    pipeline = [
        {"$group": {"_id": "$endpoint", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    endpoint_stats = await db.usages.aggregate(pipeline).to_list(length=None)
    calls_by_endpoint = {stat["_id"]: stat["count"] for stat in endpoint_stats}
    
    # Get recent activity (last 10 calls)
    recent_activity = await db.usages.find().sort("timestamp", -1).limit(10).to_list(length=10)
    
    # Log usage
    await log_usage(admin["token"], "/auth/usage-stats")
    
    return {
        "total_calls": total_calls,
        "unique_tokens": unique_tokens,
        "calls_by_endpoint": calls_by_endpoint,
        "recent_activity": recent_activity
    }