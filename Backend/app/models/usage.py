from pydantic import BaseModel, Field
from datetime import datetime

class Usage(BaseModel):
    """Model representing API usage tracking"""
    token: str = Field(..., description="The token that made the API call")
    endpoint: str = Field(..., description="The API endpoint that was called")
    timestamp: datetime = Field(..., description="When the API call was made")
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class UsageStats(BaseModel):
    """Model for usage statistics"""
    total_calls: int = Field(..., description="Total number of API calls")
    unique_tokens: int = Field(..., description="Number of unique tokens")
    calls_by_endpoint: dict = Field(..., description="Breakdown of calls by endpoint")
    recent_activity: list = Field(..., description="Recent API activity")