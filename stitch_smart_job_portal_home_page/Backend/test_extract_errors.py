import urllib.request
import json
import urllib.error
import ast

data = json.dumps({'resume_text':'Test resume text with some words', 'email': 'test@test.com', 'resume_id': 'res_1'}).encode('utf-8')
req = urllib.request.Request('http://localhost:5000/api/ats/extract', data=data, headers={'Content-Type': 'application/json'})
try:
    with urllib.request.urlopen(req, timeout=30) as response:
        print('SUCCESS:', response.read().decode('utf-8')[:300])
except urllib.error.HTTPError as e:
    err_body = json.loads(e.read().decode('utf-8'))
    print('HTTP ERROR DETAILS:')
    if 'details' in err_body:
        try:
            # Safely parse the Python list string
            err_str = err_body['details']
            if err_str.startswith("All providers exhausted: "):
                err_str = err_str[len("All providers exhausted: "):]
            errors = ast.literal_eval(err_str)
            for err in errors:
                print(' ->', err)
        except Exception as ex:
            print("Could not parse list:", ex)
            print(err_body['details'])
    else:
        print(err_body)
