# 1. Base Image: 공식 Python 런타임 이미지를 기반으로 합니다.
FROM python:3.9-slim

# 2. Environment variables: 파이썬이 .pyc 파일을 생성하지 않도록 하고, 버퍼링을 비활성화합니다.
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# 3. Work directory: 컨테이너 내의 작업 디렉토리를 설정합니다.
WORKDIR /app

# 4. Install dependencies: 의존성을 먼저 설치하여 Docker 빌드 캐시를 활용합니다.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copy project: 프로젝트 파일을 작업 디렉토리로 복사합니다.
COPY . .

# 6. Expose port: FastAPI 앱이 실행될 포트를 노출합니다.
EXPOSE 8000

# 7. Run app: uvicorn 서버를 실행하여 애플리케이션을 시작합니다.
# main.py 파일의 app 객체를 호스트 0.0.0.0, 포트 8000으로 실행합니다.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"] 