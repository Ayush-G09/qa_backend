from transformers import pipeline
import sys

context = sys.argv[1]
question = sys.argv[2]

qa_pipeline = pipeline("question-answering")
result = qa_pipeline(question=question, context=context)

print(result['answer'])
