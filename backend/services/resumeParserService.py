"""
services/resumeParserService.py — Resume Parsing Service
Consolidates modules/jobseeker/resume_parser.py + resume_auto_fill.py
"""
from __future__ import annotations
import json, logging, re, io
from pathlib import Path
from typing import Any, Dict, List

# File extraction imports
import fitz  # PyMuPDF
import docx  # python-docx

from parsers.skill_extractor import skill_extractor

log = logging.getLogger(__name__)

class ResumeParserService:
    """Parses raw resume text into structured data."""

    def __init__(self):
        log.info("[ResumeParserService] Initialized with SkillExtractor.")

    def extract_text_from_bytes(self, file_bytes: bytes, filename: str) -> str:
        """Extracts raw text from PDF or DOCX bytes."""
        text = ""
        try:
            if filename.lower().endswith(".pdf"):
                doc = fitz.open(stream=file_bytes, filetype="pdf")
                text = chr(10).join([page.get_text() for page in doc])
                doc.close()
            elif filename.lower().endswith(".docx"):
                doc = docx.Document(io.BytesIO(file_bytes))
                text = chr(10).join([para.text for para in doc.paragraphs])
            else:
                text = file_bytes.decode("utf-8", errors="ignore")
        except Exception as e:
            log.error(f"[ResumeParserService] Extraction failed for {filename}: {e}")
            text = file_bytes.decode("utf-8", errors="ignore")
        return text

    def parse_text(self, text: str) -> Dict[str, Any]:
        """Extract structured data from raw resume text."""
        lowered = text.lower()
        return {
            "skills": skill_extractor.extract_skills(text),
            "experience_years": self._extract_experience_years(lowered),
            "education": self._extract_education(lowered),
            "projects": self._extract_projects(text),
            "parsed_text": text,
        }

    def build_profile_from_text(self, resume_text: str) -> Dict[str, Any]:
        """Auto-fill profile fields from raw resume text."""
        lines = [l.strip() for l in resume_text.splitlines() if l.strip()]
        return {
            "full_name": lines[0] if lines else "",
            "email": self._extract_email(resume_text),
            "phone": self._extract_phone(resume_text),
            "skills": skill_extractor.extract_skills(resume_text),
        }

    @staticmethod
    def _extract_experience_years(text: str) -> float:
        match = re.search(r"(\d+(?:\.\d+)?)\+?\s*(?:years|yrs)", text)
        return float(match.group(1)) if match else 0.0

    @staticmethod
    def _extract_education(text: str) -> str:
        if "phd" in text: return "phd"
        if "master" in text or "m.sc" in text or "mba" in text: return "masters"
        if "bachelor" in text or "b.tech" in text or "b.e" in text: return "bachelors"
        return "unknown"

    @staticmethod
    def _extract_projects(text: str) -> List[Dict[str, str]]:
        projects = []
        for line in text.splitlines():
            line = line.strip()
            if not line: continue
            if "github.com" in line or "project" in line.lower() or "portfolio" in line.lower():
                projects.append({"title": line[:80], "reference": line})
            if len(projects) >= 5: break
        return projects

    @staticmethod
    def _extract_email(text: str) -> str:
        match = re.search(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", text)
        return match.group(0) if match else ""

    @staticmethod
    def _extract_phone(text: str) -> str:
        match = re.search(r"(\+?\d[\d\s\-]{8,}\d)", text)
        return match.group(0).strip() if match else ""


resume_parser_service = ResumeParserService()
