# scripts/extract_pdf.py
import fitz
import sys

file_path = sys.argv[1]

doc = fitz.open(file_path)
text = ""
for page in doc:
    text += page.get_text()

print(text)
