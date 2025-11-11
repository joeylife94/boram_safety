# 배포 가이드# 배포 가이드 - Boram Safety (v2.0 - Docker)



> **프로젝트**: 보람안전물산(주) 웹사이트  이 문서는 보람안전 프로젝트를 서버에 배포하는 방법을 안내합니다. 배포 방식은 크게 두 가지가 있습니다.

> **최종 업데이트**: 2025년 11월 11일  

> **버전**: v1.31.  **Docker를 이용한 간편 배포 (권장)**: `docker-compose` 명령 한 줄로 전체 스택(Frontend, Backend, DB)을 실행합니다. 환경 분리, 쉬운 확장, 일관된 실행 환경의 장점이 있습니다.

2.  **서버에 직접 배포 (고급)**: 서버에 직접 Node.js, Python, PostgreSQL 등을 설치하고 설정하는 전통적인 방식입니다. 시스템에 대한 깊은 이해가 필요합니다.

---

---

## 📋 목차

## 🐳 Docker를 이용한 간편 배포 (권장)

1. [배포 전 체크리스트](#-배포-전-체크리스트)

2. [Docker 배포 (권장)](#-docker-배포-권장)이 방식은 서버에 [Docker](https://docs.docker.com/get-docker/)와 [Docker Compose](https://docs.docker.com/compose/install/)가 설치되어 있는 것을 전제로 합니다.

3. [프로덕션 배포](#-프로덕션-배포)

4. [배포 플랫폼별 가이드](#-배포-플랫폼별-가이드)### 1. 프로젝트 준비

5. [배포 후 확인사항](#-배포-후-확인사항)```bash

6. [트러블슈팅](#-트러블슈팅)# 프로젝트 클론

git clone https://github.com/joeylife94/boram_safety.git

---cd boram-safety

```

## ✅ 배포 전 체크리스트

### 2. 환경 변수 설정

### 필수 확인사항프로젝트 최상단에 `.env` 파일을 생성하고 아래 내용을 채웁니다. 이 값들은 `docker-compose.yml`에서 참조하여 각 컨테이너의 환경변수로 사용됩니다.



**보안:**```env

- [ ] `.env` 파일 생성 및 비밀번호 설정# .env 파일 예시

- [ ] Git 히스토리에 비밀번호 없는지 확인# PostgreSQL Database

- [ ] `.env` 파일이 `.gitignore`에 포함DB_USER=boramadmin

- [ ] CORS_ORIGINS 프로덕션 도메인 설정DB_PASSWORD=supersecretpassword

DB_NAME=boramsafetydb

**코드:**

- [ ] 모든 테스트 통과# Frontend에서 사용할 Backend API 주소

- [ ] console.log 제거# Docker 네트워크 내부에서는 서비스 이름으로 통신하지만,

- [ ] TypeScript 에러 없음# 사용자의 브라우저에서는 이 주소를 보고 API를 호출하므로 외부에서 접근 가능한 주소를 적어줍니다.

# 예: http://localhost:8000 또는 http://your-domain.com/api

**데이터베이스:**NEXT_PUBLIC_API_URL=http://localhost:8000

- [ ] PostgreSQL 13+ 준비```

- [ ] 데이터베이스 백업 전략 수립

### 3. 애플리케이션 실행

**문서:**아래 명령어를 실행하면 Docker 이미지를 빌드하고 3개의 컨테이너(db, backend, frontend)를 실행합니다.

- [ ] README.md 최신화

- [ ] API 문서 확인```bash

# --build 옵션으로 이미지를 새로 빌드하며 컨테이너를 시작합니다.

---# -d 옵션은 백그라운드에서 실행합니다.

docker-compose up --build -d

## 🐳 Docker 배포 (권장)```



### 개발 환경### 4. 실행 확인

- **Frontend**: 브라우저에서 `http://localhost:3000`으로 접속

```bash- **Backend API**: `http://localhost:8000/docs`로 접속하여 FastAPI 문서 확인

# 1. 프로젝트 클론- **컨테이너 상태 확인**: `docker-compose ps`

git clone https://github.com/joeylife94/boram_safety.git- **로그 확인**: `docker-compose logs -f [서비스이름]` (예: `docker-compose logs -f frontend`)

cd boram_safety

### 5. 애플리케이션 종료

# 2. 환경 변수 설정```bash

cp .env.example .env# 컨테이너를 중지하고 제거합니다.

# .env 파일 편집 (DB_PASSWORD 등 변경)docker-compose down



# 3. Docker Compose 실행# 데이터베이스 볼륨까지 완전히 삭제하려면 아래 명령을 사용합니다.

docker-compose up -d# docker-compose down --volumes

```

# 4. 데이터베이스 초기화

docker-compose exec backend python create_tables.py---

docker-compose exec backend python dummy_data.py

## 🛠️ 서버에 직접 배포 (고급)

# 5. 로그 확인

docker-compose logs -f이 섹션은 서버에 직접 Python, Node.js, PostgreSQL 등을 설치하여 배포하는 방법을 안내합니다.



# 접속: http://localhost:3000### 시스템 요구사항

```

#### 서버 환경

### 프로덕션 환경- **OS**: Ubuntu 20.04+ / CentOS 8+ / Windows Server 2019+

- **RAM**: 최소 4GB, 권장 8GB+

#### docker-compose.prod.yml- **디스크**: 최소 20GB, 권장 50GB+

- **CPU**: 2코어 이상

```yaml

version: '3.8'#### 소프트웨어 요구사항

- **Node.js**: 18.0 이상

services:- **Python**: 3.9 이상

  db:- **PostgreSQL**: 14.0 이상

    image: postgres:13-alpine- **Nginx**: 1.18+ (웹서버용)

    container_name: boram_db_prod- **PM2**: Node.js 프로세스 관리

    volumes:- **Supervisor**: Python 프로세스 관리

      - postgres_data:/var/lib/postgresql/data/

    environment:---

      - POSTGRES_USER=${DB_USER}

      - POSTGRES_PASSWORD=${DB_PASSWORD}## 🗄️ 데이터베이스 설정

      - POSTGRES_DB=${DB_NAME}

    restart: always### PostgreSQL 설치 및 설정

    networks:

      - boram_network#### Ubuntu/Debian

```bash

  backend:# PostgreSQL 설치

    container_name: boram_backend_prodsudo apt update

    build:sudo apt install postgresql postgresql-contrib

      context: ./backend

      dockerfile: Dockerfile# PostgreSQL 서비스 시작

    command: uvicorn main:app --host 0.0.0.0 --port 8000sudo systemctl start postgresql

    environment:sudo systemctl enable postgresql

      - DB_USER=${DB_USER}

      - DB_PASSWORD=${DB_PASSWORD}# 데이터베이스 및 사용자 생성

      - DB_HOST=dbsudo -u postgres psql

      - DB_PORT=5432```

      - DB_NAME=${DB_NAME}

      - ENVIRONMENT=production#### PostgreSQL 설정

      - FRONTEND_URL=${FRONTEND_URL}```sql

    depends_on:-- 데이터베이스 생성

      - dbCREATE DATABASE boram_safety;

    restart: always

    networks:-- 사용자 생성 및 권한 부여

      - boram_networkCREATE USER boram_user WITH PASSWORD 'your_secure_password';

GRANT ALL PRIVILEGES ON DATABASE boram_safety TO boram_user;

  frontend:

    container_name: boram_frontend_prod-- 종료

    build:\q

      context: ./frontend```

      dockerfile: Dockerfile

    restart: always#### 원격 접속 허용 (필요시)

    networks:```bash

      - boram_network# postgresql.conf 수정

sudo nano /etc/postgresql/14/main/postgresql.conf

  nginx:# listen_addresses = '*' 주석 해제

    image: nginx:alpine

    container_name: boram_nginx# pg_hba.conf 수정

    ports:sudo nano /etc/postgresql/14/main/pg_hba.conf

      - "80:80"# host all all 0.0.0.0/0 md5 추가

      - "443:443"

    volumes:# 재시작

      - ./nginx/nginx.conf:/etc/nginx/nginx.confsudo systemctl restart postgresql

      - ./nginx/ssl:/etc/nginx/ssl```

    depends_on:

      - frontend---

      - backend

    restart: always## 🔧 백엔드 배포

    networks:

      - boram_network### 1. 프로젝트 준비

```bash

volumes:# 프로젝트 클론

  postgres_data:git clone https://github.com/joeylife94/boram_safety.git

cd boram-safety/backend

networks:

  boram_network:# Python 가상환경 생성

    driver: bridgepython3 -m venv venv

```source venv/bin/activate  # Linux/Mac

# venv\Scripts\activate   # Windows

#### Nginx 설정

# 의존성 설치

```nginxpip install -r requirements.txt

# nginx/nginx.conf```

upstream frontend {

    server frontend:3000;### 2. 환경 변수 설정

}```bash

# .env 파일 생성

upstream backend {nano .env

    server backend:8000;```

}

```env

server {# .env 파일 내용

    listen 80;DATABASE_URL=postgresql://boram_user:your_secure_password@localhost:5432/boram_safety

    server_name yourdomain.com;DEBUG=False

    return 301 https://$server_name$request_uri;SECRET_KEY=your_secret_key_here

}ALLOWED_HOSTS=your-domain.com,www.your-domain.com

CORS_ORIGINS=https://your-domain.com,https://www.your-domain.com

server {```

    listen 443 ssl http2;

    server_name yourdomain.com;### 3. 데이터베이스 마이그레이션

```bash

    ssl_certificate /etc/nginx/ssl/cert.pem;# 테이블 생성

    ssl_certificate_key /etc/nginx/ssl/key.pem;python create_tables.py



    location / {# 데이터 확인

        proxy_pass http://frontend;python -c "

        proxy_set_header Host $host;from database import get_db

    }from crud.category import get_categories

from crud.product import get_products

    location /api {

        proxy_pass http://backend;db = next(get_db())

        proxy_set_header Host $host;categories = get_categories(db)

    }products = get_products(db)

}print(f'카테고리: {len(categories)}개')

```print(f'제품: {len(products)}개')

"

#### 프로덕션 실행```



```bash### 4. Gunicorn 설정

docker-compose -f docker-compose.prod.yml up -d```bash

```# Gunicorn 설치

pip install gunicorn

---

# Gunicorn 설정 파일 생성

## 🚀 프로덕션 배포nano gunicorn_config.py

```

### 환경 변수 (.env)

```python

```bash# gunicorn_config.py

# Databaseimport multiprocessing

DB_USER=prod_user

DB_PASSWORD=super_secure_password_change_this# 서버 설정

DB_HOST=dbbind = "0.0.0.0:8000"

DB_NAME=boram_safety_prodworkers = multiprocessing.cpu_count() * 2 + 1

worker_class = "uvicorn.workers.UvicornWorker"

# URLsworker_connections = 1000

FRONTEND_URL=https://yourdomain.commax_requests = 1000

NEXT_PUBLIC_API_URL=https://yourdomain.com/apimax_requests_jitter = 100

CORS_ORIGINS=https://yourdomain.com

# 로깅

# Securityaccesslog = "/var/log/boram_safety/access.log"

ENVIRONMENT=productionerrorlog = "/var/log/boram_safety/error.log"

LOG_LEVEL=WARNINGloglevel = "info"

SECRET_KEY=your_32_character_secret_key

```# 프로세스

user = "www-data"

### SSL 인증서group = "www-data"

daemon = False

```bashpidfile = "/var/run/boram_safety.pid"

# Let's Encrypt```

sudo certbot --nginx -d yourdomain.com

```### 5. Systemd 서비스 생성

```bash

---# 서비스 파일 생성

sudo nano /etc/systemd/system/boram-safety-backend.service

## 🌐 배포 플랫폼별 가이드```



### Vercel (Frontend)```ini

[Unit]

1. Vercel 프로젝트 생성Description=Boram Safety Backend API

2. GitHub 연결After=network.target postgresql.service

3. 설정:

   - Root Directory: `frontend`[Service]

   - Build Command: `npm run build`Type=notify

4. 환경 변수:User=www-data

   ```Group=www-data

   NEXT_PUBLIC_API_URL=https://your-backend/apiWorkingDirectory=/path/to/boram-safety/backend

   ```Environment=PATH=/path/to/boram-safety/backend/venv/bin

ExecStart=/path/to/boram-safety/backend/venv/bin/gunicorn main:app -c gunicorn_config.py

### Railway (Backend + DB)ExecReload=/bin/kill -s HUP $MAINPID

KillMode=mixed

1. Railway 프로젝트 생성TimeoutStopSec=5

2. PostgreSQL 추가PrivateTmp=true

3. Backend 배포

4. 환경 변수 자동 연결[Install]

WantedBy=multi-user.target

### AWS EC2```



```bash```bash

# 인스턴스 접속# 서비스 시작

ssh -i key.pem ubuntu@your-ipsudo systemctl daemon-reload

sudo systemctl enable boram-safety-backend

# Docker 설치sudo systemctl start boram-safety-backend

sudo apt updatesudo systemctl status boram-safety-backend

sudo apt install docker.io docker-compose```



# 프로젝트 배포---

git clone your-repo

cd boram_safety## 🎨 프론트엔드 배포

docker-compose -f docker-compose.prod.yml up -d

```### 1. 빌드 준비

```bash

---cd ../frontend



## ✅ 배포 후 확인사항# 프로덕션 환경 변수 설정

nano .env.production

### Health Check```



```bash```env

curl https://yourdomain.com/api/health# .env.production

```NEXT_PUBLIC_API_URL=https://api.your-domain.com

NEXT_PUBLIC_SITE_URL=https://your-domain.com

### 기능 테스트```



- [ ] 홈페이지 접속### 2. 프로덕션 빌드

- [ ] 제품 목록 조회```bash

- [ ] 제품 검색# 의존성 설치

- [ ] 관리자 기능npm ci --only=production



### 성능 테스트# 빌드

npm run build

```bash

lighthouse https://yourdomain.com --view# 빌드 확인

```npm run start

```

---

### 3. PM2 설정

## 🔧 트러블슈팅```bash

# PM2 설치

### 데이터베이스 연결 실패npm install -g pm2



```bash# PM2 설정 파일 생성

# 확인사항nano ecosystem.config.js

1. DB 서버 실행 확인```

2. 호스트/포트/비밀번호 확인

3. 방화벽 설정```javascript

```// ecosystem.config.js

module.exports = {

### CORS 에러  apps: [{

    name: 'boram-safety-frontend',

```bash    script: 'npm',

# .env 파일 확인    args: 'start',

CORS_ORIGINS=https://yourdomain.com    cwd: '/path/to/boram-safety/frontend',

```    env: {

      NODE_ENV: 'production',

### Docker 컨테이너 재시작      PORT: 3000

    },

```bash    instances: 'max',

docker logs container_name    exec_mode: 'cluster',

docker-compose restart    watch: false,

```    max_memory_restart: '1G',

    error_file: '/var/log/boram_safety/frontend-error.log',

---    out_file: '/var/log/boram_safety/frontend-out.log',

    log_file: '/var/log/boram_safety/frontend.log'

## 📚 참고 문서  }]

};

- [환경 변수 가이드](./ENVIRONMENT.md)```

- [보안 설정](./SECURITY-ALERT.md)

- [API 문서](./API-REFERENCE.md)```bash

# PM2로 시작

---pm2 start ecosystem.config.js

pm2 save

**배포 관련 문의: 프로젝트 관리자**pm2 startup

```

---

## 🌐 Nginx 설정

### 1. Nginx 설치
```bash
# Ubuntu/Debian
sudo apt install nginx

# 시작 및 활성화
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 2. 사이트 설정
```bash
# 설정 파일 생성
sudo nano /etc/nginx/sites-available/boram-safety
```

```nginx
# /etc/nginx/sites-available/boram-safety
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # HTTPS로 리다이렉트
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    
    # SSL 인증서 설정
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # SSL 보안 설정
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_stapling on;
    ssl_stapling_verify on;
    
    # 보안 헤더
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # 프론트엔드 (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # 백엔드 API
    location /api/ {
        proxy_pass http://localhost:8000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS 헤더
        add_header Access-Control-Allow-Origin "https://your-domain.com" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization" always;
        
        if ($request_method = 'OPTIONS') {
            return 204;
        }
    }
    
    # 정적 파일 (이미지)
    location /images/ {
        alias /path/to/boram-safety/frontend/public/images/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Gzip 압축
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
```

### 3. 사이트 활성화
```bash
# 사이트 활성화
sudo ln -s /etc/nginx/sites-available/boram-safety /etc/nginx/sites-enabled/

# 설정 테스트
sudo nginx -t

# Nginx 재시작
sudo systemctl restart nginx
```

---

## 🔒 SSL 인증서 설정 (Let's Encrypt)

### 1. Certbot 설치
```bash
# Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx
```

### 2. SSL 인증서 발급
```bash
# 인증서 발급
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 자동 갱신 설정
sudo crontab -e
# 다음 라인 추가:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 📊 모니터링 및 로깅

### 1. 로그 디렉토리 생성
```bash
sudo mkdir -p /var/log/boram_safety
sudo chown www-data:www-data /var/log/boram_safety
```

### 2. 로그 로테이션 설정
```bash
sudo nano /etc/logrotate.d/boram-safety
```

```
/var/log/boram_safety/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        sudo systemctl reload boram-safety-backend
        pm2 reload boram-safety-frontend
    endscript
}
```

### 3. 시스템 모니터링
```bash
# 서비스 상태 확인
sudo systemctl status boram-safety-backend
pm2 status

# 로그 확인
sudo journalctl -u boram-safety-backend -f
pm2 logs boram-safety-frontend

# 리소스 사용량 확인
htop
df -h
free -h
```

---

## 🔄 배포 자동화

### 1. 배포 스크립트 생성
```bash
nano deploy.sh
chmod +x deploy.sh
```

```bash
#!/bin/bash
# deploy.sh

set -e

echo "🚀 Boram Safety 배포 시작..."

# Git 최신 코드 가져오기
git pull origin main

# 백엔드 업데이트
echo "📦 백엔드 업데이트 중..."
cd backend
source venv/bin/activate
pip install -r requirements.txt
sudo systemctl restart boram-safety-backend

# 프론트엔드 업데이트
echo "🎨 프론트엔드 업데이트 중..."
cd ../frontend
npm ci --only=production
npm run build
pm2 reload boram-safety-frontend

# 서비스 상태 확인
echo "✅ 서비스 상태 확인 중..."
sleep 5
sudo systemctl is-active --quiet boram-safety-backend && echo "백엔드: 정상" || echo "백엔드: 오류"
pm2 list | grep "boram-safety-frontend" && echo "프론트엔드: 정상" || echo "프론트엔드: 오류"

echo "🎉 배포 완료!"
```

### 2. GitHub Actions (선택사항)
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /path/to/boram-safety
          ./deploy.sh
```

---

## 🔍 트러블슈팅

### 일반적인 문제들

#### 1. 백엔드 서비스 시작 실패
```bash
# 로그 확인
sudo journalctl -u boram-safety-backend -n 50

# 수동 테스트
cd /path/to/boram-safety/backend
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000
```

#### 2. 프론트엔드 빌드 실패
```bash
# Node.js 버전 확인
node --version
npm --version

# 캐시 클리어
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### 3. 데이터베이스 연결 오류
```bash
# PostgreSQL 상태 확인
sudo systemctl status postgresql

# 연결 테스트
psql -h localhost -U boram_user -d boram_safety

# 방화벽 확인
sudo ufw status
```

#### 4. Nginx 설정 오류
```bash
# 설정 문법 확인
sudo nginx -t

# 로그 확인
sudo tail -f /var/log/nginx/error.log
```

---

## 🛡️ 보안 고려사항

### 1. 방화벽 설정
```bash
# UFW 설정
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 2. 정기 업데이트
```bash
# 시스템 업데이트 자동화
sudo nano /etc/cron.weekly/system-update
```

```bash
#!/bin/bash
apt update && apt upgrade -y
apt autoremove -y
```

### 3. 백업 설정
```bash
# 데이터베이스 백업 스크립트
nano backup.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/backup/boram_safety"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# 데이터베이스 백업
pg_dump -h localhost -U boram_user boram_safety > $BACKUP_DIR/db_$DATE.sql

# 이미지 백업
rsync -av /path/to/boram-safety/frontend/public/images/ $BACKUP_DIR/images_$DATE/

# 오래된 백업 삭제 (30일 이상)
find $BACKUP_DIR -type f -mtime +30 -delete
```

---

## 📈 성능 최적화

### 1. 데이터베이스 최적화
```sql
-- 인덱스 추가
CREATE INDEX idx_products_category_id ON safety_products(category_id);
CREATE INDEX idx_products_featured ON safety_products(is_featured);
CREATE INDEX idx_products_name ON safety_products(name);

-- 통계 업데이트
ANALYZE;
```

### 2. 캐싱 설정
```bash
# Redis 설치 (선택사항)
sudo apt install redis-server
sudo systemctl enable redis-server
```

### 3. CDN 설정 (선택사항)
- Cloudflare 등의 CDN 서비스 활용
- 정적 파일 캐싱 및 전 세계 배포

---

> **배포 체크리스트**: 
> - [ ] PostgreSQL 설정 완료
> - [ ] 환경 변수 설정
> - [ ] SSL 인증서 설정
> - [ ] 백엔드 서비스 정상 작동
> - [ ] 프론트엔드 빌드 및 배포
> - [ ] Nginx 설정 및 프록시
> - [ ] 모니터링 및 로깅 설정
> - [ ] 보안 설정 (방화벽, 업데이트)
> - [ ] 백업 시스템 구축 