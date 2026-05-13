import spacy
import json
import logging
from pathlib import Path
from spacy.matcher import PhraseMatcher
from typing import List, Set

log = logging.getLogger(__name__)

class SkillExtractor:
    """
    Industry-level Skill Extraction using spaCy PhraseMatcher.
    Uses skills_list.json as the primary knowledge base.
    """

    def __init__(self):
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except OSError:
            log.warning("[SkillExtractor] Model 'en_core_web_sm' not found. Downloading...")
            from spacy.cli import download
            download("en_core_web_sm")
            self.nlp = spacy.load("en_core_web_sm")

        self.matcher = PhraseMatcher(self.nlp.vocab, attr="LOWER")
        self._load_skills()

    def _load_skills(self):
        """Loads skills from database/reference/skills_list.json."""
        ref_path = Path(__file__).resolve().parents[2] / "database" / "reference" / "skills_list.json"
        try:
            with open(ref_path, "r", encoding="utf-8") as f:
                skills_data = json.load(f)
            
            # Create patterns for all canonical skills and their aliases
            for canonical, aliases in skills_data.items():
                patterns = [self.nlp.make_doc(canonical)]
                for alias in aliases:
                    if isinstance(alias, str) and alias.strip():
                        patterns.append(self.nlp.make_doc(alias))
                
                # Use canonical name as the Match ID
                self.matcher.add(canonical, patterns)
            
            log.info(f"[SkillExtractor] Loaded {len(skills_data)} skills with aliases.")
        except Exception as e:
            log.error(f"[SkillExtractor] Failed to load skills_list: {e}")

    def extract_skills(self, text: str) -> List[str]:
        """
        Extracts structured skills from raw text.
        Returns a list of deduplicated canonical skill names.
        """
        if not text:
            return []

        doc = self.nlp(text)
        matches = self.matcher(doc)
        
        found_skills: Set[str] = set()
        for match_id, start, end in matches:
            # match_id is the string ID we gave in matcher.add (the canonical name)
            canonical_name = self.nlp.vocab.strings[match_id]
            found_skills.add(canonical_name)

        return sorted(list(found_skills))

# Singleton instance
skill_extractor = SkillExtractor()
