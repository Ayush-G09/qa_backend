# scripts/extract_txt.py
import sys

file_path = sys.argv[1]

with open(file_path, 'r') as file:
    text = file.read()

print(text)
