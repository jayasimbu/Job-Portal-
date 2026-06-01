import os

def read_last_lines(filename, encoding='utf-16', num_lines=150):
    if not os.path.exists(filename):
        print(f"File {filename} does not exist.")
        return
    try:
        with open(filename, 'r', encoding=encoding, errors='ignore') as f:
            content = f.read()
            lines = content.splitlines()
            print(f"\n=== LAST {num_lines} LINES OF {filename} ({encoding}) ===")
            for line in lines[-num_lines:]:
                print(line)
    except Exception as e:
        print(f"Error reading {filename}: {e}")

read_last_lines("output.log", "utf-16")
