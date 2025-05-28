from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from app.core.security import get_current_token, log_usage
from app.core.config import settings
from app.services.image_analysis import image_analysis_service
from typing import Dict, Any, List
import io
from PIL import Image
import time
import hashlib

router = APIRouter()

@router.post("/analyze", response_model=dict, summary="Moderate an uploaded image")  
async def moderate_image(
    file: UploadFile = File(..., description="Image file to moderate"),
    token: Dict[str, Any] = Depends(get_current_token)
):
    """
    Analyze an uploaded image and return a comprehensive content safety report.
    Uses multiple AI models and computer vision techniques for accurate detection.
    
    Args:
        file: The uploaded image file
        token: Valid bearer token (automatically injected)
    
    Returns:
        dict: Comprehensive content safety analysis report
    """
    
    start_time = time.time()
    
    # Validate file type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Only image files are allowed. Received: {file.content_type}"
        )
    
    if file.content_type not in settings.ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported image type: {file.content_type}. Supported types: {', '.join(settings.ALLOWED_IMAGE_TYPES)}"
        )
    
    # Check file size
    content = await file.read()
    if len(content) > settings.MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File too large. Maximum size: {settings.MAX_FILE_SIZE / (1024*1024):.1f}MB"
        )
    
    # Validate that it's actually an image by trying to open it
    try:
        image = Image.open(io.BytesIO(content))
        image.verify()  # Verify it's a valid image
        
        # Get image metadata
        image = Image.open(io.BytesIO(content))  # Reopen after verify
        width, height = image.size
        format_name = image.format
        mode = image.mode
        
        # Calculate image hash for potential duplicate detection
        image_hash = hashlib.md5(content).hexdigest()
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid image file or corrupted data"
        )
    
    # Log usage
    await log_usage(token["token"], "/moderate")
    
    # Analyze image using the enhanced image analysis service
    try:
        moderation_results = await image_analysis_service.analyze_image(
            image_bytes=content,
            filename=file.filename or ""
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Image analysis failed: {str(e)}"
        )
    
    processing_time = int((time.time() - start_time) * 1000)  # Convert to milliseconds
    
    # Enhanced content safety report
    content_safety_report = {
        "file_info": {
            "filename": file.filename,
            "size_bytes": len(content),
            "content_type": file.content_type,
            "dimensions": {"width": width, "height": height},
            "format": format_name,
            "mode": mode,
            "hash": image_hash
        },
        "moderation_results": moderation_results,
        "processing_info": {
            "api_version": "2.0.0",  # Updated version
            "analysis_provider": moderation_results.get("provider", "unknown"),
            "analysis_sources": moderation_results.get("analysis_sources", []),
            "processing_time_ms": processing_time,
            "timestamp": int(time.time())
        },
        "safety_summary": {
            "is_safe": moderation_results.get("is_safe", True),
            "overall_risk_score": moderation_results.get("overall_score", 0.0),
            "flagged_categories": [
                category for category, data in moderation_results.get("categories", {}).items() 
                if data.get("detected", False)
            ],
            "highest_risk_category": max(
                moderation_results.get("categories", {}).items(),
                key=lambda x: x[1].get("confidence", 0),
                default=("none", {"confidence": 0})
            )[0] if moderation_results.get("categories") else "none"
        }
    }
    
    # Add warnings if there were analysis errors
    if moderation_results.get("errors"):
        content_safety_report["warnings"] = {
            "analysis_errors": moderation_results["errors"],
            "message": "Some analysis methods failed. Results may be less accurate."
        }
    
    return content_safety_report

@router.get("/categories", summary="Get available moderation categories")
async def get_moderation_categories(token: Dict[str, Any] = Depends(get_current_token)):
    """
    Get the list of available content moderation categories with enhanced descriptions.
    
    Args:
        token: Valid bearer token (automatically injected)
    
    Returns:
        dict: Available moderation categories, detection methods, and configuration
    """
    
    # Log usage
    await log_usage(token["token"], "/moderate/categories")
    
    categories = {
        "violence": {
            "description": "Content depicting graphic violence, blood, physical harm, or aggressive behavior",
            "detection_methods": ["Google Vision API", "Computer Vision (blood detection)", "Edge analysis", "Color analysis"],
            "severity_levels": ["low", "medium", "high"],
            "examples": ["Fighting, blood, weapons in use, physical assault"]
        },
        "nudity": {
            "description": "Content containing nudity, sexually explicit material, or suggestive content",
            "detection_methods": ["Google Vision API", "NSFW AI models", "Skin region detection", "Color analysis"],
            "severity_levels": ["suggestive", "partial", "explicit"],
            "examples": ["Exposed body parts, sexual activities, suggestive poses"]
        },
        "hate_symbols": {
            "description": "Content containing hate symbols, racist imagery, or discriminatory symbols",
            "detection_methods": ["Google Vision API (labels)", "Pattern recognition", "Symbol detection"],
            "severity_levels": ["low", "medium", "high"],
            "examples": ["Nazi symbols, racist graffiti, hate group imagery"]
        },
        "self_harm": {
            "description": "Content depicting self-harm, suicide, or related imagery",
            "detection_methods": ["Medical content detection", "Blood analysis", "Pattern recognition"],
            "severity_levels": ["low", "medium", "high"],
            "examples": ["Self-inflicted injuries, suicide methods, self-harm tools"]
        },
        "extremist_propaganda": {
            "description": "Content promoting extremist ideologies or terrorist organizations",
            "detection_methods": ["Symbol detection", "Text analysis", "Pattern recognition"],
            "severity_levels": ["low", "medium", "high"],
            "examples": ["Terrorist flags, extremist symbols, propaganda materials"]
        },
        "drugs": {
            "description": "Content depicting illegal drugs, drug paraphernalia, or drug-related activities",
            "detection_methods": ["Object detection", "Google Vision API", "Pattern analysis"],
            "severity_levels": ["low", "medium", "high"],
            "examples": ["Drug substances, syringes, drug manufacturing equipment"]
        },
        "weapons": {
            "description": "Content depicting weapons, dangerous objects, or military equipment",
            "detection_methods": ["Object detection", "Edge analysis", "Google Vision API", "Shape recognition"],
            "severity_levels": ["low", "medium", "high"],
            "examples": ["Guns, knives, explosives, military weapons"]
        }
    }
    
    return {
        "categories": categories,
        "analysis_info": {
            "confidence_threshold": 0.5,
            "supported_formats": settings.ALLOWED_IMAGE_TYPES,
            "max_file_size_mb": settings.MAX_FILE_SIZE / (1024 * 1024),
            "analysis_methods": [
                "Google Cloud Vision API",
                "Deep Learning Models (NSFW detection)",
                "Computer Vision (OpenCV)",
                "Statistical Analysis",
                "Color and Pattern Analysis"
            ],
            "processing_approach": "Multi-model ensemble for maximum accuracy"
        },
        "api_info": {
            "version": "2.0.0",
            "response_time_typical": "2-5 seconds",
            "accuracy_level": "High (multi-model approach)"
        }
    }

@router.post("/batch-analyze", summary="Analyze multiple images in batch")
async def batch_moderate_images(
    files: List[UploadFile] = File(..., description="List of image files to moderate"),
    token: Dict[str, Any] = Depends(get_current_token)
):
    """
    Analyze multiple images in batch for content safety.
    Limited to 10 images per request to prevent overload.
    
    Args:
        files: List of uploaded image files (max 10)
        token: Valid bearer token (automatically injected)
    
    Returns:
        dict: Batch analysis results
    """
    
    if len(files) > 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maximum 10 images allowed per batch request"
        )
    
    start_time = time.time()
    results = []
    
    for i, file in enumerate(files):
        try:
            # Individual file validation and analysis
            if not file.content_type or not file.content_type.startswith("image/"):
                results.append({
                    "file_index": i,
                    "filename": file.filename,
                    "status": "error",
                    "error": f"Invalid file type: {file.content_type}"
                })
                continue
            
            content = await file.read()
            if len(content) > settings.MAX_FILE_SIZE:
                results.append({
                    "file_index": i,
                    "filename": file.filename,
                    "status": "error", 
                    "error": "File too large"
                })
                continue
            
            # Analyze the image
            moderation_results = await image_analysis_service.analyze_image(
                image_bytes=content,
                filename=file.filename or ""
            )
            
            results.append({
                "file_index": i,
                "filename": file.filename,
                "status": "success",
                "is_safe": moderation_results.get("is_safe", True),
                "overall_score": moderation_results.get("overall_score", 0.0),
                "flagged_categories": [
                    category for category, data in moderation_results.get("categories", {}).items() 
                    if data.get("detected", False)
                ],
                "analysis_provider": moderation_results.get("provider", "unknown")
            })
            
        except Exception as e:
            results.append({
                "file_index": i,
                "filename": file.filename,
                "status": "error",
                "error": str(e)
            })
    
    # Log batch usage
    await log_usage(token["token"], f"/moderate/batch/{len(files)}")
    
    processing_time = int((time.time() - start_time) * 1000)
    
    # Calculate batch summary
    successful_analyses = [r for r in results if r["status"] == "success"]
    unsafe_images = [r for r in successful_analyses if not r.get("is_safe", True)]
    
    return {
        "batch_info": {
            "total_images": len(files),
            "successful_analyses": len(successful_analyses),
            "failed_analyses": len(files) - len(successful_analyses),
            "unsafe_images_count": len(unsafe_images),
            "processing_time_ms": processing_time
        },
        "results": results,
        "summary": {
            "batch_is_safe": len(unsafe_images) == 0,
            "highest_risk_score": max([r.get("overall_score", 0) for r in successful_analyses], default=0),
            "most_common_violations": _get_most_common_violations(successful_analyses)
        }
    }

def _get_most_common_violations(results: List[dict]) -> dict:
    """Helper function to get most common violations in batch"""
    violation_counts = {}
    for result in results:
        for category in result.get("flagged_categories", []):
            violation_counts[category] = violation_counts.get(category, 0) + 1
    
    return dict(sorted(violation_counts.items(), key=lambda x: x[1], reverse=True))