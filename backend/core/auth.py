from fastapi import HTTPException, Security
from fastapi.security import APIKeyHeader
from starlette.status import HTTP_403_FORBIDDEN
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY_NAME = "X-API-Key"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

# 환경 변수에서 API 키 가져오기
ADMIN_API_KEY = os.getenv("ADMIN_API_KEY", "your-secret-admin-key")

async def get_api_key(api_key_header: str = Security(api_key_header)) -> str:
    if api_key_header and api_key_header == ADMIN_API_KEY:
        return api_key_header
    raise HTTPException(
        status_code=HTTP_403_FORBIDDEN, detail="Could not validate API key"
    ) 