# ⚠️ 보안 주의사항

> **중요도**: 🔴 긴급  
> **날짜**: 2025년 11월 11일

---

## 🚨 발견된 보안 이슈

### 1. Git 히스토리에 비밀번호 노출

**문제:**
- `backend/database.py` 파일의 Git 히스토리에 데이터베이스 비밀번호가 하드코딩되어 있습니다
- 커밋 히스토리: `DB_PASSWORD = os.getenv("DB_PASSWORD", "ava1142")`

**위험도:** 🔴 **높음**

**영향:**
- Git 저장소에 접근 가능한 모든 사람이 과거 비밀번호를 볼 수 있음
- Public 저장소인 경우 심각한 보안 위협

---

## ✅ 즉시 조치 사항

### Step 1: 데이터베이스 비밀번호 변경 (필수)

```sql
-- PostgreSQL에 접속
psql -U postgres

-- 비밀번호 변경
ALTER USER postgres WITH PASSWORD 'new_secure_password_123!@#';
```

### Step 2: .env 파일 업데이트

```bash
# .env 파일 수정
DB_PASSWORD=new_secure_password_123!@#
```

### Step 3: Git 저장소 확인

**저장소가 Public인 경우:**
```bash
# 저장소를 Private으로 변경하거나
# Git 히스토리를 완전히 정리해야 함
```

**저장소가 Private인 경우:**
- 접근 권한이 있는 사용자만 확인 가능
- 비밀번호 변경만으로 충분

---

## 🔒 Git 히스토리 정리 (선택사항)

### ⚠️ 주의: 이 작업은 매우 위험합니다!

Git 히스토리에서 민감한 정보를 완전히 제거하려면:

```bash
# 방법 1: BFG Repo-Cleaner 사용 (권장)
# https://rtyley.github.io/bfg-repo-cleaner/

# BFG 다운로드 후
java -jar bfg.jar --replace-text passwords.txt

# 방법 2: git filter-branch (복잡함)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch backend/database.py" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (팀원들과 협의 후)
git push origin --force --all
```

**경고:**
- 이 작업은 Git 히스토리를 다시 쓰므로 팀원들과 협의 필요
- 모든 팀원이 저장소를 다시 클론해야 함
- 백업 필수!

---

## 📋 현재 보안 상태

### ✅ 완료된 보안 조치

1. **환경 변수 사용**
   - `core/config.py`를 통한 중앙 관리
   - `.env` 파일로 비밀번호 분리
   - `.gitignore`에 `.env` 포함

2. **코드에서 하드코딩 제거**
   - 모든 비밀번호는 환경 변수로만 관리
   - 기본값으로 명확한 플레이스홀더 사용

3. **CORS 설정 환경별 분리**
   - 개발/프로덕션 환경 구분
   - 프로덕션에서는 특정 도메인만 허용

### ⚠️ 추가 필요 조치

1. **Git 히스토리 정리** (선택)
   - Public 저장소인 경우 필수
   - Private 저장소인 경우 선택

2. **비밀번호 정책 수립**
   - 정기적인 비밀번호 변경
   - 강력한 비밀번호 사용

3. **접근 제어**
   - Git 저장소 접근 권한 관리
   - 팀원 권한 최소화

---

## 🛡️ 향후 보안 강화 방안

### 1. Secret 관리 도구 사용

**개발 환경:**
- `python-dotenv` (현재 사용 중)
- `direnv`

**프로덕션 환경:**
- AWS Secrets Manager
- HashiCorp Vault
- Google Cloud Secret Manager
- Azure Key Vault

### 2. JWT 인증 구현

```python
# 관리자 인증 시스템
- JWT 토큰 기반 인증
- Refresh Token 사용
- 권한 관리 (RBAC)
```

### 3. API Rate Limiting

```python
# DDoS 공격 방어
- IP별 요청 제한
- 사용자별 요청 제한
```

### 4. HTTPS 강제

```nginx
# Nginx 설정
server {
    listen 80;
    return 301 https://$server_name$request_uri;
}
```

### 5. 보안 헤더 추가

```python
# FastAPI 미들웨어
- X-Content-Type-Options
- X-Frame-Options
- Strict-Transport-Security
- Content-Security-Policy
```

---

## 📊 보안 체크리스트

### 배포 전 필수 확인

- [x] 환경 변수로 비밀번호 관리
- [x] `.env` 파일이 `.gitignore`에 포함
- [ ] 데이터베이스 비밀번호 변경 (노출된 경우)
- [ ] Git 저장소가 Private인지 확인
- [ ] 강력한 비밀번호 사용
- [ ] CORS 설정 확인
- [ ] 프로덕션 환경 변수 분리

### 프로덕션 배포 시

- [ ] HTTPS 사용
- [ ] SSL 인증서 설치
- [ ] 방화벽 설정
- [ ] 데이터베이스 접근 제한
- [ ] 로그 모니터링 설정
- [ ] 백업 전략 수립
- [ ] 보안 업데이트 정책

---

## 📞 보안 사고 대응

### 비밀번호 노출 시

1. **즉시 비밀번호 변경**
2. **접근 로그 확인**
3. **비정상 활동 조사**
4. **팀원들에게 알림**

### 보안 사고 발견 시

1. **서비스 일시 중단** (필요시)
2. **원인 파악**
3. **긴급 패치**
4. **사후 분석**

---

## 📚 참고 자료

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [환경 변수 가이드](./ENVIRONMENT.md)
- [배포 가이드](./deployment.md)

---

## 🔍 추가 검토 필요

```bash
# 1. 다른 파일에도 비밀번호가 있는지 확인
git log -p --all | grep -i "password"

# 2. API 키나 토큰 확인
git log -p --all | grep -E "(api[_-]?key|token|secret)"

# 3. 민감한 정보 검색
git log -p --all | grep -E "(aws|google|azure|credentials)"
```

---

**이 문서는 민감한 보안 정보를 포함하고 있습니다. 팀 내부에서만 공유하세요.**
