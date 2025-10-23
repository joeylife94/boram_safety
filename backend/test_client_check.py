from fastapi import FastAPI
from fastapi.testclient import TestClient

app = FastAPI()

@app.get("/test")
async def test():
    return {"msg": "ok"}

client = TestClient(app)
response = client.get("/test")
print("Status:", response.status_code)
print("Data:", response.json())
