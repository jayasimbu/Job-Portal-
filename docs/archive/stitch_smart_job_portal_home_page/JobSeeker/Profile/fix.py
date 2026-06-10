import tempfile
import subprocess
import os

filepath = r"e:\Desktop\Antigravity\Final Sem Project Anti\stitch_smart_job_portal_home_page\resume_insights\resume_insights.html"
with open(filepath, "r", encoding="utf-8") as f:
    text = f.read()

print("Found backslash-backticks before:", text.count("\\`"))
print("Found backslash-dollar-brace before:", text.count("\\${"))

new_text = text.replace("\\`", "`").replace("\\${", "${")

print("Found backslash-backticks after:", new_text.count("\\`"))

with open(filepath, "w", encoding="utf-8") as f:
    f.write(new_text)

import re
scripts = re.findall(r"<script>(.*?)</script>", new_text, re.DOTALL)
error_free = True
for i, script in enumerate(scripts):
    with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False, encoding="utf-8") as temp_f:
        temp_f.write(script)
        temp_path = temp_f.name
    res = subprocess.run(["node", "-c", temp_path], capture_output=True, text=True)
    if res.returncode != 0:
        print(f"Script {i} syntax error!")
        error_free = False
    else:
        print(f"Script {i} is OK")
    os.remove(temp_path)

if error_free:
    print("ALL REPLACEMENTS SUCCESSFUL! NO MORE SYNTAX ERRORS!")
