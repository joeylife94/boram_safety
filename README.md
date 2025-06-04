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

📱 **반응형 디자인**
- 모든 디바이스에서 최적화된 사용자 경험
- 모바일 우선 디자인 접근법

## 기술 스택

### Frontend
- **Next.js 13+** - App Router, SSR/SSG
- **TypeScript** - 타입 안전성
- **Tailwind CSS** - 유틸리티 우선 CSS 프레임워크
- **React** - 컴포넌트 기반 UI

### Backend
- **FastAPI** - 고성능 Python 웹 프레임워크
- **SQLAlchemy** - ORM 및 데이터베이스 관리
- **PostgreSQL** - 관계형 데이터베이스
- **Pydantic** - 데이터 검증 및 직렬화

## 프로젝트 구조

```
├── frontend/
│   ├── src/
│   │   ├── pages/              # Next.js 페이지
│   │   ├── components/         # 재사용 가능한 컴포넌트
│   │   ├── api/               # API 호출 함수
│   │   ├── types/             # TypeScript 타입 정의
│   │   ├── utils/             # 유틸리티 함수
│   │   └── styles/            # 전역 스타일
│   └── public/                # 정적 파일 (이미지 등)
├── backend/
│   ├── app/
│   │   ├── api/               # API 라우터
│   │   ├── models/            # 데이터베이스 모델
│   │   └── schemas/           # Pydantic 스키마
│   └── requirements.txt       # Python 의존성
└── docs/                      # 프로젝트 문서
```

## 빠른 시작

### 프론트엔드 실행

```bash
cd frontend
npm install
npm run dev
```

### 백엔드 실행

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## API 엔드포인트

### 제품 관련
- `GET /api/categories` - 제품 카테고리 목록
- `GET /api/products/{category_code}` - 카테고리별 제품 목록
- `GET /api/products/{category_code}/{product_id}` - 제품 상세 정보

### 검색 관련
- `GET /api/search` - 고급 검색 (필터링, 정렬)
- `GET /api/search/suggestions` - 실시간 검색 제안

## 주요 페이지

- `/` - 메인 페이지
- `/products` - 제품 카테고리 목록
- `/products/[category]` - 카테고리별 제품 목록 (검색/필터 통합)
- `/products/[category]/[slug]` - 제품 상세 페이지
- `/about` - 회사 소개
- `/contact` - 문의하기

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
