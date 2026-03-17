import os
import re
from urllib.parse import urlparse

PROJECT_ROOT = r"e:\Desktop\Antigravity\Final Sem Project Anti\stitch_smart_job_portal_home_page"

# Build file map
file_map = {}
skip_dirs = {".git", ".vscode", "node_modules", "tmp", "Backend", "DB", "Admin"}

for root, dirs, files in os.walk(PROJECT_ROOT):
    dirs[:] = [d for d in dirs if d not in skip_dirs and not d.startswith('.')]
    for file in files:
        if file.endswith(('.html', '.js', '.css', '.png', '.jpg', '.jpeg', '.svg', '.gif', '.json')):
            file_map.setdefault(file, []).append(os.path.join(root, file))

def resolve_link(current_file_path, link_target):
    parsed = urlparse(link_target)
    path_only = parsed.path
    
    # Ignore absolute URLs, data URIs, empty paths, root-relative paths
    if not path_only or path_only.startswith(('http', 'mailto:', 'tel:', 'javascript:', 'data:', '/')):
        return link_target
        
    current_dir = os.path.dirname(current_file_path)
    target_abs = os.path.normpath(os.path.join(current_dir, path_only))
    
    # If the file already exists at the computed path, it's a valid link!
    if os.path.exists(target_abs):
        return link_target
        
    # The link is broken. Let's find the correct file.
    target_filename = os.path.basename(path_only)
    if not target_filename:
        return link_target # it's a directory link, hard to auto-fix reliably without more logic
        
    if target_filename in file_map:
        candidates = file_map[target_filename]
        # Prefer candidates in Platform, Employer, JobSeeker, or assets
        best_candidate = None
        for cand in candidates:
            if any(mod in cand for mod in ['JobSeeker', 'Employer', 'Platform', 'assets']):
                best_candidate = cand
                break
        if not best_candidate and candidates:
            best_candidate = candidates[0]
            
        if best_candidate:
            new_rel = os.path.relpath(best_candidate, current_dir).replace('\\', '/')
            # re-attach query and fragment
            if parsed.query: new_rel += '?' + parsed.query
            if parsed.fragment: new_rel += '#' + parsed.fragment
            return new_rel
            
    # Try looking by directory name (e.g. if link is employer_dashboard_overview/employer_dashboard_overview.html)
    parts = path_only.split('/')
    for part in reversed(parts):
        if '.' in part and part in file_map:
            best_candidate = file_map[part][0]
            new_rel = os.path.relpath(best_candidate, current_dir).replace('\\', '/')
            if parsed.query: new_rel += '?' + parsed.query
            if parsed.fragment: new_rel += '#' + parsed.fragment
            return new_rel
            
    return link_target # Couldn't resolve

def fix_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    original_content = content

    # Regex patterns for HTML attributes: href="...", src="...", action="..."
    # and JS window.location...
    
    def replacer(match):
        prefix = match.group(1)
        quote = match.group(2)
        link = match.group(3)
        suffix = match.group(4)
        
        new_link = resolve_link(file_path, link)
        return f"{prefix}{quote}{new_link}{quote}{suffix}"

    # Group 1: Prefix (e.g. href=)
    # Group 2: Quote (' or ")
    # Group 3: The actual link
    # Group 4: Suffix (e.g. the closing parenthesis for window.location.replace)

    patterns = [
        # href, src, action
        r'(\b(?:href|src|action)\s*=\s*)(["\'])(.*?)\2()',
        # window.location.href = '...'
        r'((?:window\.)?location(?:\.href)?\s*=\s*)(["\'])(.*?)\2()',
        # window.location.replace('...')
        r'((?:window\.)?location\.replace\()(["\'])(.*?)\2(\))',
        # window.open('...')
        r'(window\.open\()(["\'])(.*?)\2((?:,\s*.*?)?\))',
    ]

    for pat in patterns:
        content = re.sub(pat, replacer, content)

    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    fixed_count = 0
    for root, dirs, files in os.walk(PROJECT_ROOT):
        dirs[:] = [d for d in dirs if d not in skip_dirs and not d.startswith('.')]
        for file in files:
            if file.endswith(('.html', '.js', '.css')):
                file_path = os.path.join(root, file)
                try:
                    if fix_file(file_path):
                        fixed_count += 1
                        print(f"Fixed broken links in: {os.path.relpath(file_path, PROJECT_ROOT)}")
                except Exception as e:
                    print(f"Error processing {file_path}: {e}")
                    
    print(f"Total files updated: {fixed_count}")

if __name__ == "__main__":
    main()
