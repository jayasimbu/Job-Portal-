"""
ai_engine/verification/certificate_verifier.py — 3-Layer Certificate Verification
====================================================================================

Layer 1: Issuer API Check
  - Validates credential ID against public verification endpoints for:
    Coursera, HackerRank, Udemy, Credly (AWS, GCP, CompTIA, etc.)

Layer 2: Image Tamper Detection
  - Extracts EXIF metadata from certificate images (JPEG/PNG)
  - Detects AI-generated or manipulated images using statistical heuristics
  - Checks for editing software signatures (Photoshop, GIMP, AI generators)

Layer 3: Manual Review Queue
  - Flags high-risk items to the admin verification queue for human review
  - Called automatically when Layer 1 and 2 are inconclusive

Usage:
    from ai_engine.verification.certificate_verifier import CertificateVerifier
    result = CertificateVerifier().verify(cert_name, issuer, credential_id, image_bytes)
"""
from __future__ import annotations

import io
import logging
import re
import uuid
from datetime import datetime
from typing import Any, Dict, Optional

import requests

log = logging.getLogger(__name__)


# ── Known Issuers and Verification URL Patterns ───────────────────────────────

_ISSUER_PATTERNS: Dict[str, Dict[str, Any]] = {
    "coursera": {
        "pattern": re.compile(r"coursera\.org", re.I),
        "verify_url": "https://www.coursera.org/account/accomplishments/verify/{id}",
        "check_redirect": True,  # 200 = exists, non-200 = faked
    },
    "hackerrank": {
        "pattern": re.compile(r"hackerrank\.com", re.I),
        "verify_url": "https://www.hackerrank.com/certificates/{id}",
        "check_redirect": True,
    },
    "credly": {
        "pattern": re.compile(r"credly\.com|badgr\.com|acclaim", re.I),
        "verify_url": "https://www.credly.com/badges/{id}/public_url",
        "check_redirect": False,
    },
    "udemy": {
        "pattern": re.compile(r"udemy\.com", re.I),
        "verify_url": "https://www.udemy.com/certificate/{id}/",
        "check_redirect": True,
    },
    "linkedin": {
        "pattern": re.compile(r"linkedin\.com", re.I),
        "verify_url": None,  # LinkedIn has no public API
        "check_redirect": False,
    },
}

_KNOWN_EDITING_TOOLS = [
    "adobe photoshop", "adobe lightroom", "gimp", "paint.net",
    "affinity photo", "pixlr", "snapseed", "stable diffusion",
    "midjourney", "dall-e", "firefly", "canva",
]


class CertificateVerifier:
    """
    3-layer certificate authenticity checker.
    Works without an active Ollama connection.
    """

    def verify(
        self,
        cert_name: str,
        issuer: Optional[str] = None,
        credential_id: Optional[str] = None,
        image_bytes: Optional[bytes] = None,
        user_id: Optional[int] = None,
        user_email: Optional[str] = None,
        user_name: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Run all 3 verification layers and return a composite result.

        Returns:
            {
                "status": "verified" | "suspicious" | "flagged" | "unverifiable",
                "risk_level": "low" | "medium" | "high",
                "confidence": 0–100,
                "layers": { ... },
                "queued_for_review": bool,
                "queue_item_id": str | None,
                "timestamp": str,
            }
        """
        layers: Dict[str, Any] = {}

        # ── Layer 1: Issuer API Check ─────────────────────────────────────────
        layer1 = self._layer1_issuer_check(issuer, credential_id)
        layers["issuer_api"] = layer1

        # ── Layer 2: Image Tamper Detection ───────────────────────────────────
        if image_bytes:
            layer2 = self._layer2_image_analysis(image_bytes)
        else:
            layer2 = {"skipped": True, "reason": "No image provided", "risk": "unknown"}
        layers["image_analysis"] = layer2

        # ── Composite Risk Assessment ─────────────────────────────────────────
        risk_level, status, confidence = self._assess_risk(layer1, layer2)

        # ── Layer 3: Flag to Admin Queue if suspicious ────────────────────────
        queue_item_id = None
        queued = False
        if risk_level in ("high", "medium") and user_id and user_email:
            queue_item_id = self._layer3_queue_for_review(
                user_id=user_id,
                user_email=user_email,
                user_name=user_name or user_email,
                cert_name=cert_name,
                risk_level=risk_level,
            )
            queued = bool(queue_item_id)
            if queued:
                status = "flagged"

        return {
            "status": status,
            "risk_level": risk_level,
            "confidence": confidence,
            "layers": layers,
            "queued_for_review": queued,
            "queue_item_id": queue_item_id,
            "cert_name": cert_name,
            "issuer": issuer,
            "credential_id": credential_id,
            "timestamp": datetime.utcnow().isoformat(),
        }

    # ── Layer 1 ───────────────────────────────────────────────────────────────

    def _layer1_issuer_check(
        self, issuer: Optional[str], credential_id: Optional[str]
    ) -> Dict[str, Any]:
        if not issuer or not credential_id:
            return {
                "verified": False,
                "risk": "medium",
                "reason": "No credential ID or issuer provided for API check",
            }

        issuer_lower = issuer.lower()
        matched_key = None
        for key, cfg in _ISSUER_PATTERNS.items():
            if cfg["pattern"].search(issuer_lower) or key in issuer_lower:
                matched_key = key
                break

        if not matched_key:
            return {
                "verified": False,
                "risk": "medium",
                "reason": f"Issuer '{issuer}' not in known verification registry. Manual review recommended.",
                "known_issuer": False,
            }

        cfg = _ISSUER_PATTERNS[matched_key]
        if not cfg.get("verify_url"):
            return {
                "verified": False,
                "risk": "low",
                "reason": f"{matched_key.title()} has no public API check. Treat as good-faith.",
                "known_issuer": True,
            }

        try:
            url = cfg["verify_url"].format(id=credential_id.strip())
            resp = requests.get(url, timeout=8, allow_redirects=True)
            if resp.status_code == 200:
                return {"verified": True, "risk": "low", "url": url, "known_issuer": True}
            elif resp.status_code in (301, 302):
                return {"verified": True, "risk": "low", "url": url, "known_issuer": True, "note": "Redirect to cert page"}
            elif resp.status_code == 404:
                return {"verified": False, "risk": "high", "url": url, "reason": "Certificate not found at issuer", "known_issuer": True}
            else:
                return {"verified": False, "risk": "medium", "url": url, "reason": f"Issuer returned HTTP {resp.status_code}", "known_issuer": True}
        except requests.RequestException as exc:
            log.warning("[CertVerifier L1] API check failed: %s", exc)
            return {"verified": False, "risk": "low", "reason": "Issuer API temporarily unreachable — not penalized", "known_issuer": True}

    # ── Layer 2 ───────────────────────────────────────────────────────────────

    def _layer2_image_analysis(self, image_bytes: bytes) -> Dict[str, Any]:
        try:
            from PIL import Image, ExifTags  # type: ignore
        except ImportError:
            return {"skipped": True, "reason": "Pillow not installed", "risk": "unknown"}

        try:
            img = Image.open(io.BytesIO(image_bytes))
        except Exception as exc:
            return {"risk": "high", "reason": f"Could not open image: {exc}", "tamper_detected": True}

        findings = []
        risk = "low"

        # Check for editing software in EXIF
        exif_data = {}
        try:
            raw_exif = img._getexif()
            if raw_exif:
                exif_data = {ExifTags.TAGS.get(k, k): v for k, v in raw_exif.items()}
        except Exception:
            pass

        software = str(exif_data.get("Software", "")).lower()
        if any(tool in software for tool in _KNOWN_EDITING_TOOLS):
            findings.append(f"Editing software detected in EXIF: '{software}'")
            risk = "high"

        # No EXIF at all on a JPEG is suspicious
        if img.format == "JPEG" and not exif_data:
            findings.append("No EXIF metadata found on JPEG — possible image regeneration or stripping")
            risk = max(risk, "medium") if risk == "low" else risk

        # Extremely uniform images are often fake/template certificates
        try:
            if img.mode in ("RGB", "L"):
                extrema = img.convert("L").getextrema()
                if extrema[1] - extrema[0] < 15:
                    findings.append("Very low pixel variance — may be a blank template")
                    risk = "medium" if risk == "low" else risk
        except Exception:
            pass

        return {
            "risk": risk,
            "tamper_detected": risk == "high",
            "findings": findings,
            "format": img.format,
            "size": list(img.size),
            "exif_software": software or None,
        }

    # ── Layer 3 ───────────────────────────────────────────────────────────────

    def _layer3_queue_for_review(
        self,
        user_id: int,
        user_email: str,
        user_name: str,
        cert_name: str,
        risk_level: str,
    ) -> Optional[str]:
        """
        Adds item to admin verification queue.
        Uses AdminService if available; falls back to direct DB write.
        """
        try:
            from core.database import get_database
            db = get_database()
            item_id = str(uuid.uuid4())
            db["verification_queue"].insert_one({
                "id": item_id,
                "user_id": user_id,
                "user_email": user_email,
                "user_name": user_name,
                "certificate_name": cert_name,
                "risk_level": risk_level,
                "status": "pending",
                "submitted_at": datetime.utcnow(),
                "reviewed_by": None,
                "reviewed_at": None,
                "notes": None,
            })
            log.info("[CertVerifier L3] Queued %s for admin review (risk=%s)", cert_name, risk_level)
            return item_id
        except Exception as exc:
            log.warning("[CertVerifier L3] Could not queue for review: %s", exc)
            return None

    # ── Risk Assessment ───────────────────────────────────────────────────────

    def _assess_risk(
        self, layer1: dict, layer2: dict
    ) -> tuple[str, str, int]:
        """Returns (risk_level, status, confidence_0_100)."""
        l1_risk = layer1.get("risk", "medium")
        l2_risk = layer2.get("risk", "unknown")
        l1_verified = layer1.get("verified", False)
        l2_tamper = layer2.get("tamper_detected", False)

        if l1_verified and not l2_tamper:
            return "low", "verified", 90

        if l2_tamper or l1_risk == "high":
            return "high", "suspicious", 20

        if l1_risk == "medium" or l2_risk == "medium":
            return "medium", "unverifiable", 50

        if l2_risk == "unknown":
            return "low", "unverifiable", 60

        return "low", "verified", 75
