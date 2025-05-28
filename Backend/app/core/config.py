import os
from typing import Optional, List

class Settings:
    # MongoDB settings
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "image_moderation")
    
    # Security settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    TOKEN_LENGTH: int = 32

    INITIAL_ADMIN_TOKEN: Optional[str] = os.getenv("INITIAL_ADMIN_TOKEN", None)
    
    # Enhanced Image Analysis Settings
    ALLOWED_IMAGE_TYPES: List[str] = [
        "image/jpeg",
        "image/jpg", 
        "image/png",
        "image/webp",
        "image/bmp",
        "image/tiff",
        "image/gif"
    ]
    
    MAX_FILE_SIZE: int = int(os.getenv("MAX_FILE_SIZE", str(10 * 1024 * 1024)))  # 10MB default
    
    # AI Model Settings
    USE_GPU_ACCELERATION: bool = os.getenv("USE_GPU_ACCELERATION", "false").lower() == "true"
    HUGGINGFACE_CACHE_DIR: str = os.getenv("HUGGINGFACE_CACHE_DIR", "./models_cache")
    
    # Google Cloud Vision Settings
    GOOGLE_APPLICATION_CREDENTIALS: str = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "")
    GOOGLE_CLOUD_PROJECT: str = os.getenv("GOOGLE_CLOUD_PROJECT", "")
    
    # Analysis Thresholds
    CONTENT_SAFETY_THRESHOLD: float = float(os.getenv("CONTENT_SAFETY_THRESHOLD", "0.5"))
    VIOLENCE_THRESHOLD: float = float(os.getenv("VIOLENCE_THRESHOLD", "0.6"))
    NUDITY_THRESHOLD: float = float(os.getenv("NUDITY_THRESHOLD", "0.5"))
    WEAPONS_THRESHOLD: float = float(os.getenv("WEAPONS_THRESHOLD", "0.7"))
    
    # Performance Settings
    MAX_CONCURRENT_ANALYSES: int = int(os.getenv("MAX_CONCURRENT_ANALYSES", "4"))
    ANALYSIS_TIMEOUT_SECONDS: int = int(os.getenv("ANALYSIS_TIMEOUT_SECONDS", "30"))
    
    # Batch Processing
    MAX_BATCH_SIZE: int = int(os.getenv("MAX_BATCH_SIZE", "10"))
    
    # Logging
    LOG_ANALYSIS_RESULTS: bool = os.getenv("LOG_ANALYSIS_RESULTS", "true").lower() == "true"
    LOG_PROCESSING_TIME: bool = os.getenv("LOG_PROCESSING_TIME", "true").lower() == "true"

settings = Settings()