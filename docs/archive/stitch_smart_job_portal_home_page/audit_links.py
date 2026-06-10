import os
import re
from urllib.parse import urlparse

PROJECT_ROOT = r"e:\Desktop\Antigravity\Final Sem Project Anti\stitch_smart_job_portal_home_page"
skip_dirs = {".git", ".vscode", "node_modules", "tmp", "Backend", "DB", "Admin"}

def audit_links():
    broken = []
    for root, dirs, files in os.walk(PROJECT_ROOT):
        dirs[:] = [d for d in dirs if d not in skip_dirs and not d.startswith('.')]
        for file in files:
            if file.endswith(('.html', '.js', '.css')):
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, PROJECT_ROOT).replace('\\', '/')
                
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()

                patterns = [
                    r'(?:href|src|action)\s*=\s*["\'](.*?)["\']',
                    r'(?:window\.)?location(?:\.href)?\s*=\s*["\'](.*?)["\']',
                    r'(?:window\.)?location\.replace\s*\(\s*["\'](.*?)["\']\s*\)',
                    r'window\.open\s*\(\s*["\'](.*?)["\']'
                ]
                
                for pat in patterns:
                    for match in re.finditer(pat, content):
                        link = match.group(1)
                        parsed = urlparse(link)
                        path_only = parsed.path
                        
                        if not path_only or path_only.startswith(('http', 'mailto:', 'tel:', 'javascript:', 'data:', '#')):
                            continue
                            
                        if path_only.startswith('/'):
                            continue

                        current_dir = os.path.dirname(file_path)
                        target_abs = os.path.normpath(os.path.join(current_dir, path_only))
                        
                        if not os.path.exists(target_abs):
                            if '{' not in link and '$' not in link: # ignore JS template strings
                                broken.append(f"{rel_path}: {link}")

    with open(os.path.join(PROJECT_ROOT, "broken_links.log"), "w", encoding="utf-8") as out:
        for b in broken:
            out.write(b + "\n")

if __name__ == "__main__":
    audit_links()
