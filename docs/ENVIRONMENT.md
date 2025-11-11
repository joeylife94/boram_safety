# 환경 변수 설정 가이드

> **프로젝트**: 보람안전물산(주) 웹사이트  
> **최종 업데이트**: 2025년 11월 11일

---

## 📋 개요

이 문서는 프로젝트 실행에 필요한 환경 변수 설정 방법을 설명합니다.

---

## 🚀 빠른 시작

### 1. 환경 변수 파일 생성

프로젝트 루트 디렉토리에서:

```bash
# .env.example을 복사하여 .env 생성
cp .env.example .env
```

### 2. 필수 값 설정

`.env` 파일을 열고 다음 값들을 수정하세요:

```bash
# 데이터베이스 비밀번호 (필수)
DB_PASSWORD=your_actual_password_here

# 프로덕션 환경에서는 추가 설정
SECRET_KEY=your_super_secret_key_min_32_chars
ADMIN_PASSWORD=strong_admin_password
```

### 3. 환경 확인

```bash
# Backend에서 환경 변수 로드 확인
cd backend
python -c "from core.config import settings; print(settings.database_url)"
```

---

## 📝 환경 변수 상세 설명

### 🗄️ Database Configuration (필수)

| 변수 | 기본값 | 설명 | 예시 |
|------|--------|------|------|
| `DB_USER` | `postgres` | 데이터베이스 사용자명 | `postgres` |
| `DB_PASSWORD` | - | 데이터베이스 비밀번호 (필수 변경!) | `mySecureP@ssw0rd` |
| `DB_HOST` | `localhost` | 데이터베이스 호스트 | `localhost` 또는 `db` (Docker) |
| `DB_PORT` | `5432` | PostgreSQL 포트 | `5432` |
| `DB_NAME` | `boram_safety` | 데이터베이스 이름 | `boram_safety` |

**주의사항:**
- Docker Compose 사용 시 `DB_HOST=db`로 설정
- 로컬 PostgreSQL 사용 시 `DB_HOST=localhost`
- 비밀번호는 반드시 강력한 값으로 변경!

---

### 🖥️ Backend Configuration

| 변수 | 기본값 | 설명 |
|------|--------|------|
| `BACKEND_HOST` | `0.0.0.0` | Backend 서버 호스트 |
| `BACKEND_PORT` | `8000` | Backend 서버 포트 |

---

### 🌐 Frontend Configuration

| 변수 | 기본값 | 설명 | 프로덕션 예시 |
|------|--------|------|--------------|
| `FRONTEND_URL` | `http://localhost:3000` | 프론트엔드 URL | `https://yourdomain.com` |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000/api` | API 엔드포인트 URL | `https://api.yourdomain.com/api` |

**주의사항:**
- `NEXT_PUBLIC_*` 변수는 클라이언트에 노출됩니다
- 민감한 정보는 절대 `NEXT_PUBLIC_*`로 시작하지 마세요

---

### 🔐 CORS Configuration

| 변수 | 설명 | 예시 |
|------|------|------|
| `CORS_ORIGINS` | 허용할 오리진 (쉼표로 구분) | `https://yourdomain.com,https://www.yourdomain.com` |

**개발 환경:**
- 자동으로 `localhost:3000`, `localhost:3001` 허용

**프로덕션 환경:**
- 반드시 실제 도메인으로 제한!

---

### 📁 File Upload Configuration

| 변수 | 기본값 | 설명 |
|------|--------|------|
| `UPLOAD_DIR` | `../frontend/public/images` | 이미지 업로드 디렉토리 |
| `MAX_FILE_SIZE` | `10` | 최대 파일 크기 (MB) |

---

### 🛠️ Environment

| 변수 | 가능한 값 | 설명 |
|------|----------|------|
| `ENVIRONMENT` | `development`, `production`, `test` | 실행 환경 |

**환경별 차이:**
- `development`: 디버그 모드, 자동 리로드, 상세 로그
- `production`: 최적화, 에러 최소화, 보안 강화
- `test`: 테스트용 설정

---

### 🔒 Security (프로덕션 필수)

| 변수 | 설명 | 예시 |
|------|------|------|
| `SECRET_KEY` | JWT 암호화 키 (최소 32자) | `a1b2c3d4e5f6...` |
| `ADMIN_PASSWORD` | 관리자 초기 비밀번호 | `AdminP@ssw0rd123` |

**생성 방법:**
```bash
# Python으로 랜덤 Secret Key 생성
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

---

### 📊 Logging

| 변수 | 기본값 | 가능한 값 |
|------|--------|----------|
| `LOG_LEVEL` | `INFO` | `DEBUG`, `INFO`, `WARNING`, `ERROR`, `CRITICAL` |
| `LOG_DIR` | `logs` | 로그 파일 저장 경로 |

---

### 🌍 Production Only

프로덕션 배포 시 추가 설정:

| 변수 | 설명 | 예시 |
|------|------|------|
| `USE_HTTPS` | HTTPS 사용 여부 | `true` |
| `DOMAIN` | 도메인 | `yourdomain.com` |
| `SSL_CERT_PATH` | SSL 인증서 경로 | `/etc/ssl/certs/cert.pem` |
| `SSL_KEY_PATH` | SSL 키 경로 | `/etc/ssl/private/key.pem` |

---

## 🎯 환경별 설정 예시

### 로컬 개발 환경

```bash
# .env
DB_USER=postgres
DB_PASSWORD=local_dev_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=boram_safety

BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000

FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000/api

ENVIRONMENT=development
LOG_LEVEL=DEBUG
```

### Docker 개발 환경

```bash
# .env
DB_USER=postgres
DB_PASSWORD=docker_dev_password
DB_HOST=db  # ← Docker Compose 서비스명
DB_PORT=5432
DB_NAME=boram_safety

BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000

FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000/api

ENVIRONMENT=development
```

### 프로덕션 환경

```bash
# .env (프로덕션)
DB_USER=prod_user
DB_PASSWORD=super_secure_production_password_123!@#
DB_HOST=your-database-host.com
DB_PORT=5432
DB_NAME=boram_safety_prod

BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000

FRONTEND_URL=https://boram-safety.com
NEXT_PUBLIC_API_URL=https://api.boram-safety.com/api

CORS_ORIGINS=https://boram-safety.com,https://www.boram-safety.com

ENVIRONMENT=production
LOG_LEVEL=WARNING

SECRET_KEY=your_super_secret_production_key_min_32_characters
ADMIN_PASSWORD=ProductionAdminP@ssw0rd!

USE_HTTPS=true
DOMAIN=boram-safety.com
```

---

## ⚠️ 보안 주의사항

### ✅ 해야 할 것

1. **`.env` 파일을 Git에 커밋하지 마세요**
   - `.gitignore`에 `.env`가 포함되어 있는지 확인
   
2. **강력한 비밀번호 사용**
   - 최소 12자 이상
   - 대소문자, 숫자, 특수문자 조합

3. **프로덕션 환경 분리**
   - 개발/프로덕션 환경 변수 완전 분리
   - 프로덕션 비밀번호는 별도 관리

4. **Secret Key 정기 변경**
   - 보안 사고 발생 시 즉시 변경
   - 주기적으로 갱신

### ❌ 하지 말아야 할 것

1. ~~코드에 비밀번호 하드코딩~~
2. ~~`.env` 파일을 Git에 커밋~~
3. ~~단순한 비밀번호 사용 (예: `password`, `123456`)~~
4. ~~개발/프로덕션 환경 변수 혼용~~
5. ~~`NEXT_PUBLIC_*`에 민감 정보 포함~~

---

## 🔍 트러블슈팅

### 문제: "환경 변수를 찾을 수 없습니다"

**해결:**
```bash
# 1. .env 파일이 존재하는지 확인
ls -la .env

# 2. .env 파일 내용 확인 (비밀번호 제외)
cat .env | grep -v PASSWORD

# 3. 환경 변수가 올바르게 로드되는지 확인
python -c "import os; from dotenv import load_dotenv; load_dotenv(); print(os.getenv('DB_USER'))"
```

### 문제: "데이터베이스 연결 실패"

**확인사항:**
1. PostgreSQL 서버가 실행 중인지 확인
2. `DB_HOST`, `DB_PORT`가 올바른지 확인
3. Docker 사용 시 `DB_HOST=db`로 설정했는지 확인
4. 비밀번호가 올바른지 확인

### 문제: "CORS 에러"

**해결:**
```bash
# 개발 환경: 자동으로 localhost 허용됨
# 프로덕션: CORS_ORIGINS 설정 확인
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

---

## 📚 참고 문서

- [프로젝트 개요](./project-overview.md)
- [개발 가이드](./DEVELOPMENT-GUIDE.md)
- [배포 가이드](./deployment.md)
- [보안 설정](../IMPROVEMENTS.md#보안-강화)

---

## 📞 문의

환경 설정 관련 문제가 있으면 프로젝트 관리자에게 문의하세요.
