# app/services/image_analysis.py

from google.cloud import vision
import logging
from typing import Dict, Any, Optional, List
import os
import numpy as np
from PIL import Image, ImageStat
import io
import cv2
import torch
import torchvision.transforms as transforms
from transformers import pipeline, AutoImageProcessor, AutoModelForImageClassification
import asyncio
import aiohttp
from concurrent.futures import ThreadPoolExecutor
import hashlib

logger = logging.getLogger(__name__)

class ImageAnalysisService:
    """Enhanced service for analyzing images using multiple AI models"""
    
    def __init__(self):
        self.google_client = None
        self.nsfw_classifier = None
        self.violence_classifier = None
        self.executor = ThreadPoolExecutor(max_workers=4)
        self._initialize_clients()
    
    def _initialize_clients(self):
        """Initialize all available AI clients and models"""
        # Initialize Google Cloud Vision
        try:
            if os.getenv('GOOGLE_APPLICATION_CREDENTIALS') or os.getenv('GOOGLE_CLOUD_PROJECT'):
                self.google_client = vision.ImageAnnotatorClient()
                logger.info("Google Cloud Vision client initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Google Vision client: {e}")
            self.google_client = None
        
        # Initialize Hugging Face models for local inference
        try:
            # NSFW detection model
            self.nsfw_classifier = pipeline(
                "image-classification",
                model="Falconsai/nsfw_image_detection",
                device=0 if torch.cuda.is_available() else -1
            )
            logger.info("NSFW classifier initialized successfully")
        except Exception as e:
            logger.warning(f"Failed to initialize NSFW classifier: {e}")
            self.nsfw_classifier = None
        
        try:
            # Violence detection model - using a placeholder, you'll need a proper model
            # Consider using "microsoft/DialoGPT-medium" or similar for now
            logger.info("Violence classifier placeholder - implement proper model")
            self.violence_classifier = None
        except Exception as e:
            logger.warning(f"Failed to initialize violence classifier: {e}")
            self.violence_classifier = None
    
    def _ensure_python_types(self, obj):
        """Convert numpy types to Python native types for JSON serialization"""
        if isinstance(obj, np.bool_):
            return bool(obj)
        elif isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        elif isinstance(obj, dict):
            return {key: self._ensure_python_types(value) for key, value in obj.items()}
        elif isinstance(obj, list):
            return [self._ensure_python_types(item) for item in obj]
        else:
            return obj
    
    async def analyze_image(self, image_bytes: bytes, filename: str = "") -> Dict[str, Any]:
        """
        Comprehensive image analysis using multiple methods
        """
        try:
            # Convert image to different formats for analysis
            pil_image = Image.open(io.BytesIO(image_bytes))
            if pil_image.mode != 'RGB':
                pil_image = pil_image.convert('RGB')
            
            # Run multiple analyses concurrently
            tasks = []
            
            # Google Vision API analysis
            if self.google_client:
                tasks.append(self._analyze_with_google_vision(image_bytes))
            
            # Computer vision based analysis
            tasks.append(self._analyze_with_cv(pil_image))
            
            # Deep learning model analysis
            tasks.append(self._analyze_with_ml_models(pil_image))
            
            # Color and statistical analysis
            tasks.append(self._analyze_image_properties(pil_image))
            
            # Execute all analyses
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Combine results
            combined_results = self._combine_analysis_results(results, filename)
            
            # Ensure all values are JSON serializable
            return self._ensure_python_types(combined_results)
            
        except Exception as e:
            logger.error(f"Image analysis failed: {e}")
            return {
                'overall_score': 0.05,
                'is_safe': True,
                'categories': {
                    'violence': {'detected': False, 'confidence': 0.05},
                    'nudity': {'detected': False, 'confidence': 0.05},
                    'weapons': {'detected': False, 'confidence': 0.05},
                    'drugs': {'detected': False, 'confidence': 0.05},
                    'hate_symbols': {'detected': False, 'confidence': 0.05},
                    'self_harm': {'detected': False, 'confidence': 0.05},
                    'extremist_propaganda': {'detected': False, 'confidence': 0.05}
                },
                'provider': 'enhanced_multi_model',
                'analysis_sources': [],
                'errors': [str(e)]
            }
    
    async def _analyze_with_google_vision(self, image_bytes: bytes) -> Dict[str, Any]:
        """Enhanced Google Vision API analysis"""
        try:
            image = vision.Image(content=image_bytes)
            
            # Multiple detection types
            safe_search_response = self.google_client.safe_search_detection(image=image)
            label_response = self.google_client.label_detection(image=image)
            object_response = self.google_client.object_localization(image=image)
            
            safe_search = safe_search_response.safe_search_annotation
            labels = label_response.label_annotations
            objects = object_response.localized_object_annotations
            
            # Process safe search results
            likelihood_to_score = {
                vision.Likelihood.VERY_UNLIKELY: 0.05,
                vision.Likelihood.UNLIKELY: 0.15, 
                vision.Likelihood.POSSIBLE: 0.45,
                vision.Likelihood.LIKELY: 0.75,
                vision.Likelihood.VERY_LIKELY: 0.90
            }
            
            adult_score = likelihood_to_score.get(safe_search.adult, 0.05)
            violence_score = likelihood_to_score.get(safe_search.violence, 0.05)
            racy_score = likelihood_to_score.get(safe_search.racy, 0.05)
            
            # Analyze labels for additional context
            weapon_labels = ['weapon', 'gun', 'rifle', 'pistol', 'knife', 'sword', 'military']
            drug_labels = ['drug', 'syringe', 'pill', 'marijuana', 'cannabis']
            hate_labels = ['symbol', 'flag', 'graffiti']
            
            weapons_confidence = self._check_labels_for_keywords(labels, weapon_labels)
            drugs_confidence = self._check_labels_for_keywords(labels, drug_labels)
            hate_confidence = self._check_labels_for_keywords(labels, hate_labels)
            
            # Analyze objects
            weapon_objects = self._check_objects_for_weapons(objects)
            
            return {
                'source': 'google_vision',
                'categories': {
                    'violence': max(violence_score, weapon_objects),
                    'nudity': max(adult_score, racy_score),
                    'weapons': max(weapons_confidence, weapon_objects),
                    'drugs': drugs_confidence,
                    'hate_symbols': hate_confidence,
                    'self_harm': 0.05,  # Google Vision doesn't detect this directly
                    'extremist_propaganda': 0.05
                },
                'labels': [{'description': label.description, 'score': float(label.score)} for label in labels[:10]],
                'objects': [{'name': obj.name, 'score': float(obj.score)} for obj in objects[:10]]
            }
            
        except Exception as e:
            logger.error(f"Google Vision analysis failed: {e}")
            return {'source': 'google_vision', 'error': str(e)}
    
    async def _analyze_with_cv(self, image: Image.Image) -> Dict[str, Any]:
        """Computer vision based analysis using OpenCV"""
        def _cv_analysis():
            try:
                # Convert PIL to CV2
                cv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
                
                # Skin detection for nudity
                skin_score = self._detect_skin_regions(cv_image)
                
                # Edge detection for weapons/violence
                edges_score = self._analyze_edges_for_weapons(cv_image)
                
                # Color analysis for blood/violence
                blood_score = self._detect_blood_colors(cv_image)
                
                # Texture analysis
                texture_score = self._analyze_texture_patterns(cv_image)
                
                return {
                    'source': 'computer_vision',
                    'categories': {
                        'nudity': float(skin_score),
                        'violence': float(max(blood_score, edges_score)),
                        'weapons': float(edges_score),
                        'drugs': float(texture_score * 0.3),
                        'hate_symbols': float(texture_score * 0.2),
                        'self_harm': float(blood_score * 0.8),
                        'extremist_propaganda': 0.05
                    }
                }
                
            except Exception as e:
                logger.error(f"CV analysis failed: {e}")
                return {'source': 'computer_vision', 'error': str(e)}
        
        return await asyncio.get_event_loop().run_in_executor(self.executor, _cv_analysis)
    
    async def _analyze_with_ml_models(self, image: Image.Image) -> Dict[str, Any]:
        """Analysis using pre-trained ML models"""
        def _ml_analysis():
            try:
                results = {'source': 'ml_models', 'categories': {}}
                
                # NSFW detection
                if self.nsfw_classifier:
                    nsfw_result = self.nsfw_classifier(image)
                    nsfw_score = 0.05
                    for result in nsfw_result:
                        if result['label'].lower() in ['nsfw', 'porn', 'explicit']:
                            nsfw_score = max(nsfw_score, float(result['score']))
                    results['categories']['nudity'] = nsfw_score
                else:
                    results['categories']['nudity'] = 0.05
                
                # Violence detection placeholder
                violence_score = 0.05
                
                results['categories'].update({
                    'violence': violence_score,
                    'weapons': violence_score * 0.7,
                    'drugs': 0.05,
                    'hate_symbols': 0.05,
                    'self_harm': 0.05,
                    'extremist_propaganda': 0.05
                })
                
                return results
                
            except Exception as e:
                logger.error(f"ML models analysis failed: {e}")
                return {'source': 'ml_models', 'error': str(e)}
        
        return await asyncio.get_event_loop().run_in_executor(self.executor, _ml_analysis)
    
    async def _analyze_image_properties(self, image: Image.Image) -> Dict[str, Any]:
        """Analyze basic image properties and statistics"""
        def _properties_analysis():
            try:
                # Color statistics
                stat = ImageStat.Stat(image)
                
                # Calculate brightness and contrast
                brightness = sum(stat.mean) / len(stat.mean)
                contrast = sum(stat.stddev) / len(stat.stddev)
                
                # Dominant colors analysis
                colors = image.getcolors(maxcolors=256*256*256)
                if colors:
                    dominant_color = max(colors, key=lambda x: x[0])[1]
                    red_dominance = dominant_color[0] / 255.0 if len(dominant_color) >= 3 else 0
                else:
                    red_dominance = 0
                
                # Heuristic scoring based on properties
                violence_score = min(red_dominance * 0.3 + (1 - brightness/255) * 0.2, 0.5)
                
                return {
                    'source': 'image_properties',
                    'categories': {
                        'violence': float(violence_score),
                        'nudity': float(min(brightness/255 * 0.1, 0.3)),
                        'weapons': float(violence_score * 0.5),
                        'drugs': 0.05,
                        'hate_symbols': 0.05,
                        'self_harm': float(violence_score * 0.6),
                        'extremist_propaganda': 0.05
                    },
                    'properties': {
                        'brightness': float(brightness),
                        'contrast': float(contrast),
                        'red_dominance': float(red_dominance)
                    }
                }
                
            except Exception as e:
                logger.error(f"Properties analysis failed: {e}")
                return {'source': 'image_properties', 'error': str(e)}
        
        return await asyncio.get_event_loop().run_in_executor(self.executor, _properties_analysis)
    
    def _detect_skin_regions(self, cv_image: np.ndarray) -> float:
        """Detect skin-colored regions in the image"""
        try:
            # Convert to HSV for better skin detection
            hsv = cv2.cvtColor(cv_image, cv2.COLOR_BGR2HSV)
            
            # Define skin color range in HSV
            lower_skin = np.array([0, 20, 70], dtype=np.uint8)
            upper_skin = np.array([20, 255, 255], dtype=np.uint8)
            
            # Create mask for skin regions
            skin_mask = cv2.inRange(hsv, lower_skin, upper_skin)
            
            # Calculate percentage of skin pixels
            total_pixels = cv_image.shape[0] * cv_image.shape[1]
            skin_pixels = np.sum(skin_mask > 0)
            skin_percentage = skin_pixels / total_pixels
            
            # Return confidence score (higher skin percentage = higher NSFW risk)
            return min(float(skin_percentage * 2.0), 1.0)
            
        except Exception:
            return 0.05
    
    def _analyze_edges_for_weapons(self, cv_image: np.ndarray) -> float:
        """Analyze edge patterns that might indicate weapons"""
        try:
            gray = cv2.cvtColor(cv_image, cv2.COLOR_BGR2GRAY)
            edges = cv2.Canny(gray, 50, 150)
            
            # Look for straight lines (potential weapons)
            lines = cv2.HoughLinesP(edges, 1, np.pi/180, threshold=100, minLineLength=50, maxLineGap=10)
            
            if lines is not None:
                # More straight lines might indicate weapons
                line_score = min(len(lines) / 100.0, 1.0)
                return float(line_score * 0.5)
            
            return 0.05
            
        except Exception:
            return 0.05
    
    def _detect_blood_colors(self, cv_image: np.ndarray) -> float:
        """Detect red colors that might indicate blood/violence"""
        try:
            # Convert to HSV
            hsv = cv2.cvtColor(cv_image, cv2.COLOR_BGR2HSV)
            
            # Define red color ranges (blood-like colors)
            lower_red1 = np.array([0, 50, 50])
            upper_red1 = np.array([10, 255, 255])
            lower_red2 = np.array([170, 50, 50])
            upper_red2 = np.array([180, 255, 255])
            
            mask1 = cv2.inRange(hsv, lower_red1, upper_red1)
            mask2 = cv2.inRange(hsv, lower_red2, upper_red2)
            red_mask = mask1 + mask2
            
            total_pixels = cv_image.shape[0] * cv_image.shape[1]
            red_pixels = np.sum(red_mask > 0)
            red_percentage = red_pixels / total_pixels
            
            return min(float(red_percentage * 1.5), 0.8)
            
        except Exception:
            return 0.05
    
    def _analyze_texture_patterns(self, cv_image: np.ndarray) -> float:
        """Analyze texture patterns for various content types"""
        try:
            gray = cv2.cvtColor(cv_image, cv2.COLOR_BGR2GRAY)
            
            # Calculate texture using standard deviation of Laplacian
            laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
            
            # Normalize the variance score
            texture_score = min(laplacian_var / 1000.0, 1.0)
            
            return float(texture_score * 0.3)
            
        except Exception:
            return 0.05
    
    def _check_labels_for_keywords(self, labels, keywords: List[str]) -> float:
        """Check Google Vision labels for specific keywords"""
        max_confidence = 0.05
        for label in labels:
            label_desc = label.description.lower()
            for keyword in keywords:
                if keyword in label_desc:
                    confidence = float(label.score * 0.8)
                    max_confidence = max(max_confidence, confidence)
        return max_confidence
    
    def _check_objects_for_weapons(self, objects) -> float:
        """Check detected objects for weapons"""
        weapon_objects = ['weapon', 'gun', 'rifle', 'pistol', 'knife']
        max_confidence = 0.05
        for obj in objects:
            obj_name = obj.name.lower()
            for weapon in weapon_objects:
                if weapon in obj_name:
                    max_confidence = max(max_confidence, float(obj.score * 0.9))
        return max_confidence
    
    def _combine_analysis_results(self, results: List[Any], filename: str) -> Dict[str, Any]:
        """Combine results from multiple analysis methods"""
        combined_categories = {
            'violence': [],
            'nudity': [],
            'hate_symbols': [],
            'self_harm': [],
            'extremist_propaganda': [],
            'drugs': [],
            'weapons': []
        }
        
        analysis_sources = []
        errors = []
        
        # Process each result
        for result in results:
            if isinstance(result, Exception):
                errors.append(str(result))
                continue
                
            if isinstance(result, dict) and 'categories' in result:
                analysis_sources.append(result.get('source', 'unknown'))
                for category, score in result['categories'].items():
                    if category in combined_categories:
                        combined_categories[category].append(float(score))
        
        # Calculate final scores using weighted average and max
        final_categories = {}
        for category, scores in combined_categories.items():
            if scores:
                # Use a combination of max and weighted average
                max_score = max(scores)
                avg_score = sum(scores) / len(scores)
                # Weight towards the higher score but consider average
                final_score = (max_score * 0.7) + (avg_score * 0.3)
                final_categories[category] = {
                    'detected': bool(final_score >= 0.5),
                    'confidence': round(float(final_score), 3)
                }
            else:
                final_categories[category] = {
                    'detected': False,
                    'confidence': 0.05
                }
        
        # Calculate overall safety
        max_confidence = max([cat['confidence'] for cat in final_categories.values()])
        is_safe = max_confidence < 0.5
        
        return {
            'overall_score': round(float(max_confidence), 3),
            'is_safe': bool(is_safe),
            'categories': final_categories,
            'provider': 'enhanced_multi_model',
            'analysis_sources': analysis_sources,
            'errors': errors if errors else None
        }

# Create singleton instance
image_analysis_service = ImageAnalysisService()