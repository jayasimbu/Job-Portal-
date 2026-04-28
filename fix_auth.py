import os

path = r'backend/modules/auth/routes.py'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

old_line = 'fallback_password = f"google-oauth-{google_subject or \'generated\'}"'
new_line = 'fallback_password = f"google-oauth-{google_subject or \'generated\'}"[:64]'

if old_line in content:
    new_content = content.replace(old_line, new_line)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("SUCCESS: Password truncation fix applied.")
else:
    print("ERROR: Target line not found. Checking for whitespace issues...")
    # Try finding the line ignoring whitespace
    import re
    pattern = re.escape(old_line).replace('\\ ', '\\s+')
    if re.search(pattern, content):
        new_content = re.sub(pattern, new_line, content)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("SUCCESS: Password truncation fix applied with regex.")
    else:
        print("ERROR: Could not find target line even with regex.")
