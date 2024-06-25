# scripts/extract_word.py
import docx
import sys

file_path = sys.argv[1]

doc = docx.Document(file_path)
text = "\n".join([para.text for para in doc.paragraphs])

print(text)
