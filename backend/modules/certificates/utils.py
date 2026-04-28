import datetime
import difflib

# Attempt to load pyTesseract but fallback cleanly
try:
    import pytesseract
    from PIL import Image
    TESSERACT_AVAILABLE = True
except ImportError:
    TESSERACT_AVAILABLE = False

def extract_certificate_text(file_bytes: bytes) -> str:
    # MOCK OCR logic as user suggested fallback-first architecture
    USE_REAL_OCR = False
    
    if USE_REAL_OCR and TESSERACT_AVAILABLE:
        try:
            # Need to save bytes to temporary file or BytesIO first to parse with PIL
            import io
            image = Image.open(io.BytesIO(file_bytes))
            text = pytesseract.image_to_string(image)
            return text
        except Exception as e:
            print("OCR Failed:", str(e))
    
    # Mock text logic if real OCR fails or is bypassed
    return "This is a digital certificate of completion. Awarded for successfully completing the AWS Cloud Solutions framework and Google Data Analytics fundamentals. Issued to candidate for participation."

# Try rapidfuzz, fallback to difflib
try:
    from rapidfuzz import fuzz
    USE_RAPIDFUZZ = True
except ImportError:
    USE_RAPIDFUZZ = False

def evaluate_certificate_score(user_name: str, ocr_text: str, filename: str) -> dict:
    if len(ocr_text.strip()) < 20:
        return {
            "confidence_score": 0,
            "confidence_level": "Low",
            "verification_status": "rejected",
            "issuer": "Unknown",
            "certificate_name": filename,
            "breakdown": ["Garbage text detected - Score zeroed"],
            "tags": ["Invalid"]
        }
        
    text_lower = ocr_text.lower()
    
    if USE_RAPIDFUZZ:
        name_match = fuzz.ratio(user_name.lower(), text_lower)
    else:
        name_match = difflib.SequenceMatcher(None, user_name.lower(), text_lower).ratio() * 100
        
    confidence = 0
    breakdown = []
    tags = []
    
    if name_match > 70:
        confidence += 20
        breakdown.append("✔ Name Match (+20)")
        
    if "amazon" in text_lower or "aws" in text_lower:
        confidence += 25
        breakdown.append("✔ Trusted Issuer - AWS (+25)")
        tags.append("Cloud")
    if "google" in text_lower:
        confidence += 25
        breakdown.append("✔ Trusted Issuer - Google (+25)")
        tags.append("Data")
    if "microsoft" in text_lower or "azure" in text_lower:
        confidence += 25
        breakdown.append("✔ Trusted Issuer - Microsoft (+25)")
        tags.append("Cloud")
        
    if "certificate" in text_lower or "certified" in text_lower:
        confidence += 10
        breakdown.append("✔ Certificate Keyword (+10)")
    if "participation" in text_lower:
        confidence -= 15
        breakdown.append("⚠ Participation Word (-15)")
        
    # Bounds check
    confidence = max(0, min(100, confidence))
    
    # Determine Status
    if confidence >= 80:
        status = "ai_reviewed"
    elif confidence >= 50:
        status = "pending"
    else:
        status = "pending" # suspicions mapped to pending with low confidence
        
    # Determine Level
    if confidence >= 90:
        level = "Highly Reliable"
    elif confidence >= 80:
        level = "High"
    elif confidence >= 50:
        level = "Medium"
    else:
        level = "Low"
        
    # Basic Extraction heuristic
    issuer = "Unknown"
    if "aws" in text_lower or "amazon" in text_lower:
        issuer = "AWS"
    elif "google" in text_lower:
        issuer = "Google"
    elif "microsoft" in text_lower:
        issuer = "Microsoft"
        
    return {
        "confidence_score": int(confidence),
        "confidence_level": level,
        "verification_status": status,
        "issuer": issuer,
        "certificate_name": filename,
        "breakdown": breakdown,
        "tags": tags
    }
