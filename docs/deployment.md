# 배포 가이드 - Boram Safety (v1.2)

## 🚀 프로덕션 배포 준비

### 시스템 요구사항

#### 서버 환경
- **OS**: Ubuntu 20.04+ / CentOS 8+ / Windows Server 2019+
- **RAM**: 최소 4GB, 권장 8GB+
- **디스크**: 최소 20GB, 권장 50GB+
- **CPU**: 2코어 이상

#### 소프트웨어 요구사항
- **Node.js**: 18.0 이상
- **Python**: 3.9 이상
- **PostgreSQL**: 14.0 이상
- **Nginx**: 1.18+ (웹서버용)
- **PM2**: Node.js 프로세스 관리
- **Supervisor**: Python 프로세스 관리

---

## 🗄️ 데이터베이스 설정

### PostgreSQL 설치 및 설정

#### Ubuntu/Debian
```bash
# PostgreSQL 설치
sudo apt update
sudo apt install postgresql postgresql-contrib

# PostgreSQL 서비스 시작
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 데이터베이스 및 사용자 생성
sudo -u postgres psql
```

#### PostgreSQL 설정
```sql
-- 데이터베이스 생성
CREATE DATABASE boram_safety;

-- 사용자 생성 및 권한 부여
CREATE USER boram_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE boram_safety TO boram_user;

-- 종료
\q
```

#### 원격 접속 허용 (필요시)
```bash
# postgresql.conf 수정
sudo nano /etc/postgresql/14/main/postgresql.conf
# listen_addresses = '*' 주석 해제

# pg_hba.conf 수정
sudo nano /etc/postgresql/14/main/pg_hba.conf
# host all all 0.0.0.0/0 md5 추가

# 재시작
sudo systemctl restart postgresql
```

---

## 🔧 백엔드 배포

### 1. 프로젝트 준비
```bash
# 프로젝트 클론
git clone https://github.com/joeylife94/boram_safety.git
cd boram-safety/backend

# Python 가상환경 생성
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# 의존성 설치
pip install -r requirements.txt
```

### 2. 환경 변수 설정
```bash
# .env 파일 생성
nano .env
```

```env
# .env 파일 내용
DATABASE_URL=postgresql://boram_user:your_secure_password@localhost:5432/boram_safety
DEBUG=False
SECRET_KEY=your_secret_key_here
ALLOWED_HOSTS=your-domain.com,www.your-domain.com
CORS_ORIGINS=https://your-domain.com,https://www.your-domain.com
```

### 3. 데이터베이스 마이그레이션
```bash
# 테이블 생성
python create_tables.py

# 데이터 확인
python -c "
from database import get_db
from crud.category import get_categories
from crud.product import get_products

db = next(get_db())
categories = get_categories(db)
products = get_products(db)
print(f'카테고리: {len(categories)}개')
print(f'제품: {len(products)}개')
"
```

### 4. Gunicorn 설정
```bash
# Gunicorn 설치
pip install gunicorn

# Gunicorn 설정 파일 생성
nano gunicorn_config.py
```

```python
# gunicorn_config.py
import multiprocessing

# 서버 설정
bind = "0.0.0.0:8000"
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "uvicorn.workers.UvicornWorker"
worker_connections = 1000
max_requests = 1000
max_requests_jitter = 100

# 로깅
accesslog = "/var/log/boram_safety/access.log"
errorlog = "/var/log/boram_safety/error.log"
loglevel = "info"

# 프로세스
user = "www-data"
group = "www-data"
daemon = False
pidfile = "/var/run/boram_safety.pid"
```

### 5. Systemd 서비스 생성
```bash
# 서비스 파일 생성
sudo nano /etc/systemd/system/boram-safety-backend.service
```

```ini
[Unit]
Description=Boram Safety Backend API
After=network.target postgresql.service

[Service]
Type=notify
User=www-data
Group=www-data
WorkingDirectory=/path/to/boram-safety/backend
Environment=PATH=/path/to/boram-safety/backend/venv/bin
ExecStart=/path/to/boram-safety/backend/venv/bin/gunicorn main:app -c gunicorn_config.py
ExecReload=/bin/kill -s HUP $MAINPID
KillMode=mixed
TimeoutStopSec=5
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

```bash
# 서비스 시작
sudo systemctl daemon-reload
sudo systemctl enable boram-safety-backend
sudo systemctl start boram-safety-backend
sudo systemctl status boram-safety-backend
```

---

## 🎨 프론트엔드 배포

### 1. 빌드 준비
```bash
cd ../frontend

# 프로덕션 환경 변수 설정
nano .env.production
```

```env
# .env.production
NEXT_PUBLIC_API_URL=https://api.your-domain.com
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### 2. 프로덕션 빌드
```bash
# 의존성 설치
npm ci --only=production

# 빌드
npm run build

# 빌드 확인
npm run start
```

### 3. PM2 설정
```bash
# PM2 설치
npm install -g pm2

# PM2 설정 파일 생성
nano ecosystem.config.js
```

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'boram-safety-frontend',
    script: 'npm',
    args: 'start',
    cwd: '/path/to/boram-safety/frontend',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 'max',
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '1G',
    error_file: '/var/log/boram_safety/frontend-error.log',
    out_file: '/var/log/boram_safety/frontend-out.log',
    log_file: '/var/log/boram_safety/frontend.log'
  }]
};
```

```bash
# PM2로 시작
pm2 start ecosystem.config.js
pm2 save
pm2 startup
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