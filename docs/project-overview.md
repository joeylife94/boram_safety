# 보람안전 웹사이트

보람안전의 공식 웹사이트 프로젝트입니다. Next.js + FastAPI 풀스택 구조로 제작되었습니다.

## 기술 스택

- **Frontend**
  - Next.js 14
  - TypeScript
  - Tailwind CSS (MUI 완전 제거)
  - React Query (데이터 관리)

- **Backend**
  - FastAPI
  - SQLAlchemy ORM
  - PostgreSQL
  - Uvicorn ASGI Server

- **Database**
  - PostgreSQL (11개 카테고리, 254개 제품)
  - 완전한 한국어 제품 데이터베이스

## 프로젝트 구조

```
boram-safety/
├── frontend/
│   ├── src/
│   │   ├── pages/            # Next.js 페이지
│   │   ├── components/       # 재사용 가능한 컴포넌트
│   │   ├── types/           # TypeScript 타입 정의
│   │   ├── utils/           # 유틸리티 함수
│   │   └── api/             # API 호출 함수
│   └── public/
│       └── images/          # 제품 이미지 (254개)
├── backend/
│   ├── models/              # SQLAlchemy 모델
│   ├── routers/             # FastAPI 라우터
│   ├── crud/                # CRUD 작업
│   ├── schemas/             # Pydantic 스키마
│   └── database/            # DB 설정
└── docs/                    # 프로젝트 문서
```

## 현재 상태 (Stage 4 완료)

### ✅ 완료된 작업
- **이미지 시스템 완전 재구성**: Backend → Frontend 이미지 마이그레이션
- **UI 프레임워크 통일**: MUI 완전 제거, Tailwind CSS 전환
- **데이터베이스 구축**: 254개 제품, 11개 카테고리 완료
- **한국어 지원**: UTF-8 인코딩 문제 해결
- **외부 의존성 제거**: 완전한 오프라인 시스템

### 🚨 현재 문제점
- **홈페이지 레이아웃 깨짐**: MUI import 제거했지만 여전히 문제 존재
- **포트 충돌**: Frontend 3000 포트 사용 중 문제
- **사용되지 않는 코드**: 정리 필요한 변수들 존재

## 시작하기

### 개발 환경 설정

1. 저장소 클론
```bash
git clone [repository-url]
cd boram-safety
```

2. 백엔드 설정
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

3. 프론트엔드 설정
```bash
cd frontend
npm install
npm run dev
```

## 주요 기능

- **제품 카탈로그**: 카테고리별 제품 목록 및 상세 정보 제공
- **반응형 디자인**: 모든 디바이스에서 최적화된 사용자 경험
- **실시간 데이터**: FastAPI 백엔드와 실시간 연동
- **이미지 관리**: 254개 제품 이미지 로컬 관리
- **한국어 완전 지원**: 모든 제품 정보 한국어 제공

## 페이지 구조

- `/`: 메인 페이지 (⚠️ 현재 레이아웃 문제)
- `/products`: 제품 카테고리 목록
- `/products/[category]`: 카테고리별 제품 목록
- `/products/[category]/[id]`: 제품 상세 페이지
- `/about`: 회사 소개
- `/contact`: 문의하기

## API 엔드포인트

- `GET /api/categories`: 카테고리 목록
- `GET /api/categories/{code}`: 카테고리 상세
- `GET /api/categories/{code}/products`: 카테고리별 제품 목록
- `GET /api/products/{id}`: 제품 상세 정보

## 아키텍처 특징

### 이미지 관리
- **위치**: `frontend/public/images/`
- **접근**: `/images/[category]/[filename]`
- **Fallback**: SVG 기반 로컬 placeholder

### 스타일링
- **완전한 Tailwind CSS**: 일관된 디자인 시스템
- **반응형**: 모바일 우선 설계
- **컴포넌트**: 재사용 가능한 Tailwind 컴포넌트

## 다음 단계

### 즉시 해결 필요
1. **홈페이지 레이아웃 수정**
2. **사용되지 않는 코드 정리**
3. **포트 충돌 해결**

### 향후 개선사항
- 관리자 인증 시스템
- 제품 검색 기능 고도화
- 성능 최적화
- SEO 개선

## 기술적 고려사항

- **Korean Text Encoding**: `btoa()` → `encodeURIComponent()` 변경으로 한국어 지원
- **Image Loading**: Lazy loading 및 fallback 시스템
- **API Integration**: React Query를 통한 효율적인 데이터 관리
- **Type Safety**: 엄격한 TypeScript 설정

## 문의

프로젝트 관련 문의사항은 개발팀으로 연락주시기 바랍니다. 