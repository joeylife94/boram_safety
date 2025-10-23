# 보람안전 웹사이트

보람안전의 공식 웹사이트 프로젝트입니다. Next.js와 TypeScript를 기반으로 제작된 현대적인 웹 애플리케이션입니다.

## 주요 기능

✨ **통합 검색 시스템**
- 헤더에서 실시간 검색 제안
- 카테고리별 상세 검색 및 필터링
- 가격, 재고, 추천 제품 필터
- 전문적인 이커머스 UI/UX 패턴

🏢 **제품 카탈로그**
- 카테고리별 제품 목록 및 상세 정보
- 반응형 제품 이미지 갤러리
- 모바일 최적화된 카드 디자인

🔧 **관리자 시스템**
- 완전한 제품/카테고리 CRUD 관리
- 실시간 대시보드 통계
- 다중 이미지 업로드 및 관리
- 직관적인 관리자 인터페이스

📱 **반응형 디자인**
- 모든 디바이스에서 최적화된 사용자 경험
- Tailwind CSS 기반 모던 UI

🐳 **Docker 지원**
- Docker Compose를 통한 원클릭 배포
- 개발/프로덕션 환경 분리

🧪 **테스트 커버리지**
- 백엔드 API 테스트 (pytest, 78% 통과율)
- 프론트엔드 컴포넌트 테스트 (Jest, React Testing Library)
- 테스트 커버리지 32%

## 기술 스택

### Frontend
- **Next.js 14.1.0** - App Router, SSR/SSG
- **TypeScript 5.3.3** - 타입 안전성
- **Tailwind CSS 3.4.3** - 유틸리티 우선 CSS 프레임워크
- **React 18.2.0** - 컴포넌트 기반 UI
- **Jest & React Testing Library** - 테스트

### Backend
- **FastAPI 0.109.2** - 고성능 Python 웹 프레임워크
- **SQLAlchemy 2.0.27** - ORM 및 데이터베이스 관리
- **PostgreSQL 13** - 관계형 데이터베이스
- **Pydantic v2** - 데이터 검증 및 직렬화
- **pytest** - 테스트 프레임워크

### Infrastructure
- **Docker & Docker Compose** - 컨테이너화
- **Nginx** - 리버스 프록시 (프로덕션)

## 프로젝트 구조

```
├── frontend/
│   ├── src/
│   │   ├── pages/              # Next.js 페이지
│   │   │   ├── admin/          # 관리자 페이지
│   │   │   │   ├── products/   # 제품 관리
│   │   │   │   └── categories/ # 카테고리 관리
│   │   │   └── products/       # 공개 제품 페이지
│   │   ├── components/         # 재사용 가능한 컴포넌트
│   │   ├── api/               # API 호출 함수
│   │   ├── types/             # TypeScript 타입 정의
│   │   ├── utils/             # 유틸리티 함수
│   │   └── styles/            # 전역 스타일
│   └── public/                # 정적 파일 (이미지 등)
├── backend/
│   ├── app/
│   │   ├── api/               # API 라우터
│   │   │   ├── admin.py       # 관리자 API
│   │   │   └── public.py      # 공개 API
│   │   ├── models/            # 데이터베이스 모델
│   │   └── schemas/           # Pydantic 스키마
│   └── requirements.txt       # Python 의존성
└── docs/                      # 프로젝트 문서
```

## 빠른 시작

### Docker Compose로 실행 (권장)

```bash
# 환경 변수 설정 (.env 파일 생성)
cp .env.example .env
# .env 파일에서 DB_PASSWORD 등 설정

# 모든 서비스 실행
docker-compose up -d

# 데이터베이스 테이블 생성
docker-compose exec backend python create_tables.py

# 더미 데이터 추가 (선택사항)
docker-compose exec backend python dummy_data.py

# 서비스 확인
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API 문서: http://localhost:8000/docs
```

### 개발 환경에서 실행

#### 프론트엔드

```bash
cd frontend
npm install
npm run dev
# http://localhost:3000
```

#### 백엔드

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
# http://localhost:8000
```

#### 테스트 실행

```bash
# 백엔드 테스트
cd backend
pytest tests/ -v --cov=.

# 프론트엔드 테스트  
cd frontend
npm test
```

## API 엔드포인트

### 공개 API
- `GET /api/categories` - 제품 카테고리 목록
- `GET /api/products/{category_code}` - 카테고리별 제품 목록
- `GET /api/products/{category_code}/{product_id}` - 제품 상세 정보
- `GET /api/search` - 고급 검색 (필터링, 정렬)
- `GET /api/search/suggestions` - 실시간 검색 제안

### 관리자 API
- `GET /api/admin/dashboard` - 대시보드 통계
- `GET /api/admin/products` - 제품 목록 관리
- `POST /api/admin/products` - 제품 생성 (이미지 업로드 포함)
- `PUT /api/admin/products/{id}` - 제품 수정
- `DELETE /api/admin/products/{id}` - 제품 삭제
- `GET /api/admin/categories` - 카테고리 목록 관리
- `POST /api/admin/categories` - 카테고리 생성 (이미지 업로드 포함)
- `PUT /api/admin/categories/{id}` - 카테고리 수정
- `DELETE /api/admin/categories/{id}` - 카테고리 삭제

## 주요 페이지

### 공개 페이지
- `/` - 메인 페이지
- `/products` - 제품 카테고리 목록
- `/products/[category]` - 카테고리별 제품 목록 (검색/필터 통합)
- `/products/[category]/[slug]` - 제품 상세 페이지
- `/about` - 회사 소개

### 관리자 페이지
- `/admin` - 관리자 대시보드
- `/admin/products` - 제품 목록 관리
- `/admin/products/new` - 새 제품 추가
- `/admin/products/[id]/edit` - 제품 편집
- `/admin/categories` - 카테고리 목록 관리
- `/admin/categories/new` - 새 카테고리 추가
- `/admin/categories/[id]/edit` - 카테고리 편집

## 검색 및 필터링 기능

### 실시간 검색 제안
- 300ms 디바운스 적용
- 제품 이미지와 함께 제안 표시
- 직접 제품 페이지로 이동

### 고급 필터링
- **가격 범위**: 최소/최대 금액 설정
- **재고 상태**: 재고 있음/없음 필터
- **추천 제품**: 인기 제품만 표시
- **정렬**: 이름순, 가격순, 추천순

## 개발 가이드라인

### 코드 스타일
- ESLint 및 Prettier 사용
- TypeScript strict 모드
- 컴포넌트 기반 아키텍처

### 커밋 메시지 컨벤션
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
```

## 문서

자세한 개발 문서는 `docs/` 디렉토리를 참조하세요:
- [프로젝트 개요](docs/project-overview.md)
- [작업 로그](docs/work-log.md)
- [할일 목록](docs/TODO.md)

## 라이선스

이 프로젝트는 보람안전의 소유입니다.
