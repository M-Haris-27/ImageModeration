from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class TokenCreate(BaseModel):
    """Model for creating a new token"""
    isAdmin: bool = Field(..., description="Whether this token has admin privileges")

class Token(BaseModel):
    """Model representing a token in the database"""
    token: str = Field(..., description="The bearer token string")
    isAdmin: bool = Field(..., description="Whether this token has admin privileges")
    createdAt: datetime = Field(..., description="When the token was created")
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class TokenResponse(BaseModel):
    """Response model for token creation"""
    token: str = Field(..., description="The created bearer token")
    isAdmin: bool = Field(..., description="Whether this token has admin privileges")
    createdAt: datetime = Field(..., description="When the token was created")
    message: str = Field(..., description="Success message")
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }