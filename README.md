# 보람안전 안전용품 전시 웹사이트

보람안전의 안전용품 전시(Exhibition) 웹사이트입니다. Next.js와 FastAPI를 기반으로 제작되었으며, **관리자가 Excel로 제품을 쉽게 관리**할 수 있는 실용적인 시스템입니다.

## 🎯 프로젝트 특징

이 사이트는 **전시(Exhibition) 목적**의 웹사이트로, E-commerce가 아닌 제품 소개 및 카탈로그 제공에 초점을 맞춥니다.

- 254개 안전용품 전시
- 11개 카테고리 분류
- 관리자의 편리한 대량 제품 관리
- 복잡한 인증/결제 시스템 불필요

## ✨ 주요 기능

### 📊 Excel 일괄 관리 ⭐ (신규!)
- **Excel 템플릿 다운로드**: 제품 입력 양식 제공
- **제품 데이터 내보내기**: 전체 또는 카테고리별 Excel 다운로드
- **Excel 일괄 업로드**: 수백 개 제품 한번에 등록
- **추가/교체 모드**: 기존 데이터 유지 또는 전체 교체
- **데이터 검증**: 실시간 에러 확인 및 상세 피드백
- **한글 지원**: 한국어 컬럼명으로 쉬운 작성

### 🏢 제품 전시
- 11개 카테고리별 제품 분류
- 제품 상세 정보 및 이미지
- 검색 및 필터링 기능
- 반응형 디자인 (모바일/태블릿/PC)

### 🔧 관리자 시스템
- **대시보드**: 제품/카테고리 통계, 최근 활동
- **제품 관리**: CRUD, 이미지 업로드, 제품 복사
- **카테고리 관리**: 카테고리 추가/수정/삭제
- **Excel 일괄 관리**: 대량 제품 업로드/다운로드
- **감사 로그**: 모든 변경사항 추적

### 🎨 Public 페이지
- 메인 페이지
- 카테고리별 제품 목록
- 제품 상세 페이지
- 반응형 UI

## 기술 스택

### Frontend
- **Next.js 14.1.0** - React 프레임워크
- **TypeScript 5.3.3** - 타입 안전성
- **Tailwind CSS 3.4.3** - 유틸리티 우선 CSS
- **Axios** - HTTP 클라이언트

### Backend
- **FastAPI 0.109.2** - 고성능 Python 웹 프레임워크
- **SQLAlchemy 2.0.27** - ORM 및 데이터베이스 관리
- **PostgreSQL 13** - 관계형 데이터베이스
- **Pandas 2.2.0** - Excel 데이터 처리 ⭐
- **OpenPyXL 3.1.2** - Excel 파일 읽기/쓰기 ⭐
- **Pydantic v2** - 데이터 검증

### Infrastructure
- **Docker & Docker Compose** - 컨테이너화
- **pytest** - 백엔드 테스트

## 프로젝트 구조

```
boram_safety/
├── frontend/
│   ├── src/
│   │   ├── pages/              # Next.js 페이지
│   │   │   ├── admin/          # 관리자 페이지
│   │   │   │   ├── index.tsx   # 대시보드
│   │   │   │   ├── excel.tsx   # 📊 Excel 관리 (신규)
│   │   │   │   ├── products/   # 제품 관리
│   │   │   │   └── categories/ # 카테고리 관리
│   │   │   └── products/       # 공개 제품 페이지
│   │   ├── components/         # 재사용 컴포넌트
│   │   │   └── admin/
│   │   │       └── ExcelManagement.tsx  # 📊 Excel UI (신규)
│   │   ├── api/                # API 호출 함수
│   │   ├── types/              # TypeScript 타입
│   │   └── utils/              # 유틸리티
│   └── public/                 # 정적 파일
├── backend/
│   ├── admin/
│   │   └── router.py           # Admin API (Excel 엔드포인트 포함)
│   ├── public/
│   │   └── router.py           # Public API
│   ├── models/                 # 데이터베이스 모델
│   ├── schemas/                # Pydantic 스키마
│   ├── crud/                   # 데이터베이스 작업
│   ├── utils/
│   │   ├── excel_handler.py    # 📊 Excel 처리 (신규)
│   │   ├── audit_logger.py     # 감사 로그
│   │   └── upload.py           # 이미지 업로드
│   └── requirements.txt        # Python 의존성
└── docs/
    ├── PROJECT-COMPLETE.md     # 📋 프로젝트 완성 요약 (신규)
    ├── EXCEL-GUIDE.md          # 📊 Excel 사용 가이드 (신규)
    ├── TESTING.md              # 테스트 가이드
    ├── API-USAGE.md            # API 사용법
    └── DEPLOYMENT.md           # 배포 가이드
```

## 빠른 시작

### 📋 사전 요구사항
- Docker & Docker Compose
- 또는 Node.js 18+, Python 3.11+, PostgreSQL 13+

### Docker Compose로 실행 (권장)

```bash
# 1. 환경 변수 설정
cp .env.example .env
# .env 파일에서 DB_PASSWORD 등 설정

# 2. 모든 서비스 실행
docker-compose up -d

# 3. 데이터베이스 초기화
docker-compose exec backend python create_tables.py

# 4. 더미 데이터 추가 (선택사항)
docker-compose exec backend python dummy_data.py

# 5. 서비스 접속
# Frontend: http://localhost:3000
# Admin:    http://localhost:3000/admin
# Excel:    http://localhost:3000/admin/excel  ⭐
# Backend:  http://localhost:8000
# API 문서: http://localhost:8000/docs
```

## 📊 Excel 기능 빠른 시작

관리자의 가장 강력한 도구인 Excel 일괄 관리를 바로 사용해보세요!

### 1️⃣ 템플릿 다운로드
```
http://localhost:3000/admin/excel
→ "템플릿 다운로드" 버튼 클릭
```

### 2️⃣ Excel 파일 작성
```
카테고리코드    제품명                모델번호      가격
safety_helmet   산업용 안전모 A형    SH-2024-001   25000
safety_gloves   방한 안전장갑        SG-2024-015   12000
safety_boots    고무 안전화 260mm    SB-2024-032   85000
```

### 3️⃣ 업로드
- **모드 선택**: 추가 모드 (기존 데이터 유지 권장)
- **파일 선택**: 작성한 Excel 파일
- **업로드** → 결과 확인

### 📘 자세한 사용법
[Excel 사용 가이드](docs/EXCEL-GUIDE.md) 문서를 참조하세요.

## 📡 API 엔드포인트

### Excel 관리 API ⭐ (신규)
- `GET /api/admin/excel/template` - Excel 템플릿 다운로드
- `GET /api/admin/excel/export` - 제품 데이터 내보내기
- `POST /api/admin/excel/import` - Excel 파일 일괄 업로드
- `POST /api/admin/products/{id}/duplicate` - 제품 복사

### 공개 API
- `GET /api/categories` - 제품 카테고리 목록
- `GET /api/products/{category_code}` - 카테고리별 제품 목록
- `GET /api/products/{category_code}/{product_id}` - 제품 상세 정보
- `GET /api/search` - 고급 검색 (필터링, 정렬)
- `GET /api/search/suggestions` - 실시간 검색 제안

### 관리자 API
- `GET /api/admin/dashboard` - 대시보드 통계
- `GET /api/admin/products` - 제품 목록 관리
- `POST /api/admin/products` - 제품 생성 (이미지 업로드)
- `PUT /api/admin/products/{id}` - 제품 수정
- `DELETE /api/admin/products/{id}` - 제품 삭제
- `GET /api/admin/categories` - 카테고리 목록 관리
- `POST /api/admin/categories` - 카테고리 생성
- `PUT /api/admin/categories/{id}` - 카테고리 수정
- `DELETE /api/admin/categories/{id}` - 카테고리 삭제
- `GET /api/admin/audit` - 감사 로그 조회

자세한 API 문서는 http://localhost:8000/docs 에서 확인하세요.

## 🎯 주요 페이지

### 공개 페이지
- `/` - 메인 페이지
- `/products` - 제품 카테고리 목록
- `/products/[category]` - 카테고리별 제품 목록
- `/products/[category]/[slug]` - 제품 상세 페이지

### 관리자 페이지
- `/admin` - 관리자 대시보드
- `/admin/excel` - 📊 **Excel 일괄 관리** (신규) ⭐
- `/admin/products` - 제품 목록 관리
- `/admin/products/new` - 새 제품 추가
- `/admin/products/[id]/edit` - 제품 편집
- `/admin/categories` - 카테고리 목록 관리
- `/admin/categories/new` - 새 카테고리 추가
- `/admin/categories/[id]/edit` - 카테고리 편집

## 📚 상세 문서

프로젝트 문서는 `docs/` 디렉토리에 있습니다:

### 신규 문서
- **[프로젝트 완성 요약](docs/PROJECT-COMPLETE.md)** ⭐ - 전체 기능 및 완성 상태
- **[Excel 사용 가이드](docs/EXCEL-GUIDE.md)** ⭐ - Excel 기능 상세 사용법

### 기존 문서
- [테스트 가이드](docs/TESTING.md) - 테스트 실행 및 작성 방법
- [API 사용 가이드](docs/API-USAGE.md) - Frontend API 호출 가이드
- [배포 가이드](docs/DEPLOYMENT.md) - 프로덕션 배포 방법
- [프로젝트 개요](docs/project-overview.md) - 프로젝트 아키텍처
- [할일 목록](docs/TODO.md) - 향후 개선 사항

## 🔐 보안 고려사항

이 프로젝트는 **전시 사이트**이므로 복잡한 인증이 필요하지 않습니다.

### 현재 보안 설정
- ✅ 환경 변수로 민감 정보 관리
- ✅ SQL Injection 방지 (SQLAlchemy ORM)
- ✅ 파일 업로드 크기 제한 (10MB)
- ✅ 파일 확장자 검증

### 필요시 추가 가능
- [ ] Admin 페이지 단순 비밀번호 보호
- [ ] IP 화이트리스트
- [ ] Rate limiting

## 🎊 프로젝트 완성 요약

### 관리자가 할 수 있는 일
1. ✅ Excel로 수백 개 제품 한번에 업로드
2. ✅ 기존 제품 데이터 Excel로 다운로드
3. ✅ 특정 카테고리만 선택해서 관리
4. ✅ 제품 복사로 빠른 등록
5. ✅ 웹 UI로 개별 제품 관리
6. ✅ 이미지 업로드 및 관리
7. ✅ 모든 변경 사항 로그 확인

### 전시 사이트 방문자가 볼 수 있는 것
1. ✅ 11개 카테고리별 안전용품
2. ✅ 254개 제품 상세 정보
3. ✅ 제품 이미지 및 사양
4. ✅ 검색 및 필터 기능
5. ✅ 반응형 모바일 뷰

자세한 내용은 [프로젝트 완성 요약](docs/PROJECT-COMPLETE.md) 문서를 참조하세요.

## 📞 개발자 가이드

### 개발 환경 실행
```bash
# Frontend
cd frontend
npm install
npm run dev  # http://localhost:3000

# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload  # http://localhost:8000
```

### 테스트 실행
```bash
# Backend 테스트
cd backend
pytest tests/ -v --cov=.

# Frontend 테스트
cd frontend
npm test
```

### 코드 스타일
- ESLint 및 Prettier 사용
- TypeScript strict 모드
- 컴포넌트 기반 아키텍처

## 라이선스

이 프로젝트는 보람안전의 소유입니다.

---

**제작**: 보람안전 관리 시스템  
**버전**: 1.0.0  
**특징**: 전시 사이트 맞춤, Excel 일괄 관리 지원
