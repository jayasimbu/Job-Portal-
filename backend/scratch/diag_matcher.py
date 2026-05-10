import sys
from pathlib import Path
backend_root = Path(__file__).resolve().parents[1]
sys.path.append(str(backend_root))

from ai_engine.semantic_matching.matcher import SemanticMatcher
import time

try:
    print("Initializing SemanticMatcher...")
    start = time.time()
    matcher = SemanticMatcher()
    score = matcher.match_score("Python Developer with React experience", "Looking for a Python and React engineer")
    print(f"Score: {score}")
    print(f"Time taken: {time.time() - start:.2f}s")
except Exception as e:
    print(f"Error: {e}")
