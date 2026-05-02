import sys
from docx import Document

if len(sys.argv) < 3:
    print("Usage: extract_docx.py <docx-path> <out-txt>")
    sys.exit(2)

docx_path = sys.argv[1]
out_path = sys.argv[2]

try:
    doc = Document(docx_path)
    with open(out_path, "w", encoding="utf-8") as f:
        for para in doc.paragraphs:
            text = para.text.strip()
            if text:
                f.write(text + "\n")
    print(f"Wrote extracted text to {out_path}")
except Exception as e:
    print("Error:", e)
    sys.exit(1)
