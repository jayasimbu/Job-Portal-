import datetime
import uuid
import os
import hashlib
from fastapi import UploadFile, HTTPException
from core.database import doc_to_entity
from modules.certificates.utils import extract_certificate_text, evaluate_certificate_score

class CertificateService:
    def __init__(self, db):
        self.db = db
        self.collection = db["certificates"]
        self.upload_dir = "uploads/certificates"
        os.makedirs(self.upload_dir, exist_ok=True)
        
    async def process_and_upload(self, user_id: int, user_name: str, file: UploadFile):
        # Read the file to determine size
        file_bytes = await file.read()
        
        if len(file_bytes) > 5 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File too large (max 5MB)")
            
        file_hash = hashlib.sha256(file_bytes).hexdigest()
        existing = self.collection.find_one({"user_id": user_id, "file_hash": file_hash})
        if existing:
            raise HTTPException(status_code=400, detail="Duplicate certificate detected.")
            
        ext = file.filename.split('.')[-1].lower()
        if ext not in ["pdf", "jpg", "jpeg", "png"]:
            raise HTTPException(status_code=400, detail="Invalid file type. Only PDF, JPG, PNG allowed.")
            
        file_id = str(uuid.uuid4())
        file_path = os.path.join(self.upload_dir, f"{file_id}.{ext}")
        
        with open(file_path, "wb") as f:
            f.write(file_bytes)
            
        # Run AI OCR + Score Validation
        ocr_text = extract_certificate_text(file_bytes)
        evaluation = evaluate_certificate_score(user_name, ocr_text, file.filename)
        
        cert_doc = {
            "id": file_id,
            "user_id": user_id,
            "certificate_name": evaluation["certificate_name"],
            "issuer": evaluation["issuer"],
            "issue_date": None,
            "expiry_date": None,
            "file_url": f"/uploads/certificates/{file_id}.{ext}",
            "file_hash": file_hash,
            "ocr_text": ocr_text,
            "confidence_score": evaluation["confidence_score"],
            "confidence_level": evaluation["confidence_level"],
            "verification_status": str(evaluation["verification_status"]),
            "breakdown": evaluation.get("breakdown", []),
            "tags": evaluation.get("tags", []),
            "verified_by": None,
            "verified_at": None,
            "created_at": datetime.datetime.utcnow().isoformat()
        }
        
        self.collection.insert_one(cert_doc)
        return doc_to_entity(cert_doc)
        
    def get_user_certificates(self, user_id: int):
        cursor = self.collection.find({"user_id": user_id}).sort("created_at", -1)
        return [doc_to_entity(doc) for doc in cursor]

    def verify_certificate(self, cert_id: str, status: str, admin_id: str):
        if status not in ["verified", "rejected"]:
            raise ValueError("Status must be verified or rejected")
        
        updated = self.collection.find_one_and_update(
            {"id": cert_id},
            {
                "$set": {
                    "verification_status": status, 
                    "verified_by": admin_id,
                    "verified_at": datetime.datetime.utcnow().isoformat()
                }
            },
            return_document=True
        )
        if not updated:
            raise HTTPException(status_code=404, detail="Certificate not found")
        return doc_to_entity(updated)
        
    def get_all_pending(self):
        cursor = self.collection.find({"verification_status": {"$in": ["pending", "ai_reviewed"]}}).sort("created_at", -1)
        return [doc_to_entity(doc) for doc in cursor]
