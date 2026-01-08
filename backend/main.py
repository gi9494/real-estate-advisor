from fastapi import FastAPI
from typing import Any, Dict

app = FastAPI()

@app.post("/evaluate")
def evaluate(payload: Dict[str, Any]):
    print("=== RECEIVED JSON ===")
    print(payload)
    print("=====================")
    return {"status": "received"}
