# 보람안전 프로젝트 문서

이 디렉토리는 보람안전 웹사이트 프로젝트의 기술 문서를 포함하고 있습니다.

## 📋 문서 구조

### 프로젝트 개요 및 현황
- [프로젝트 개요](./project-overview.md) - 전체 프로젝트 소개 및 기술 스택
- [현재 문제점](./CURRENT-ISSUES.md) - **🚨 즉시 해결 필요한 이슈들**
- [할 일 목록](./TODO.md) - 우선순위별 작업 목록
- [작업 일지](./work-log.md) - 상세 개발 진행 상황
- [변경 이력](./CHANGELOG.md) - Stage별 주요 변경사항

### 프론트엔드
- [컴포넌트 명세](./frontend-components.md) - React 컴포넌트 문서
- [스타일 가이드](./frontend-style.md) - Tailwind CSS 스타일 가이드

### 백엔드
- [백엔드 개요](./backend-overview.md) - FastAPI 서버 구조
- [모델 명세](./backend-models.md) - SQLAlchemy 모델 정의
- [API 명세](./backend-api.md) - REST API 엔드포인트

### 특징 및 기능
- [기능 명세](./FEATURES.md) - 구현된 기능 목록
- [구조 문서](./STRUCTURE.md) - 프로젝트 구조 상세

## 🚨 현재 상태 (2025-06-03)

### ✅ Stage 4 완료 사항
- **이미지 시스템 완전 재구성**: Backend → Frontend 마이그레이션 (254개 이미지)
- **UI 프레임워크 통일**: MUI 완전 제거, Tailwind CSS 전환
- **데이터베이스 구축**: 254개 제품, 11개 카테고리 완료
- **한국어 지원**: UTF-8 인코딩 문제 해결
- **외부 의존성 제거**: 완전한 오프라인 시스템

### ❌ 현재 문제점
- **홈페이지 레이아웃 깨짐**: MUI import 제거했지만 여전히 문제
- **포트 충돌**: Frontend 3000 포트 사용 중
- **코드 정리 필요**: 사용되지 않는 변수들 존재

> **⚠️ 주의**: 현재 문제점은 [CURRENT-ISSUES.md](./CURRENT-ISSUES.md)에서 상세 확인 가능

## 🛠 프로젝트 개요

### 소개
보람안전의 공식 웹사이트 프로젝트입니다. Next.js + FastAPI 풀스택 구조로 제작된 현대적인 웹 애플리케이션입니다.

### 프로젝트 구조
```
boram-safety/
├── docs/                    # 📚 프로젝트 문서
├── frontend/               # 🖥 Next.js 프론트엔드
│   ├── src/
│   │   ├── pages/          # 페이지 컴포넌트
│   │   ├── components/     # 재사용 컴포넌트
│   │   ├── types/          # TypeScript 타입
│   │   └── api/            # API 호출 함수
│   └── public/
│       └── images/         # 제품 이미지 (254개)
├── backend/                # 🔧 FastAPI 백엔드
│   ├── models/             # SQLAlchemy 모델
│   ├── routers/            # API 라우터
│   ├── crud/               # CRUD 작업
│   └── schemas/            # Pydantic 스키마
└── safety.db              # SQLite 데이터베이스
```

### 기술 스택
- **프론트엔드**: Next.js 14 + TypeScript + Tailwind CSS
- **백엔드**: FastAPI + SQLAlchemy + PostgreSQL
- **데이터베이스**: PostgreSQL (254개 제품, 11개 카테고리)
- **이미지 관리**: Frontend 로컬 시스템

## 🚀 시작하기

### 1. 백엔드 실행
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2. 프론트엔드 실행
```bash
cd frontend
npm install
npm run dev
```

### 3. 접속
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API 문서**: http://localhost:8000/docs

## 📊 개발 진행도

### 백엔드 (90% 완료) ✅
- [x] FastAPI 서버 구축
- [x] SQLAlchemy 모델 정의
- [x] REST API 엔드포인트
- [x] 데이터베이스 연동
- [x] 254개 제품 데이터 구축

### 프론트엔드 (85% 완료) 🔄
- [x] Next.js 프로젝트 설정
- [x] Tailwind CSS 전환 완료
- [x] 제품 관련 페이지 완성
- [x] 네비게이션 시스템
- [ ] **홈페이지 레이아웃 수정 필요**

### 통합 (80% 완료) 🔄
- [x] API 연동 완료
- [x] 이미지 시스템 완전 재구성
- [x] 타입 안전성 확보
- [ ] 전체 시스템 안정성 검증

## 📝 문서 작성 가이드라인

### 파일 네이밍
- 기능별: `FEATURES.md`, `TODO.md`, `CHANGELOG.md`
- 영역별: `frontend-components.md`, `backend-api.md`

### 마크다운 스타일
- 이모지 활용으로 가독성 향상
- 코드 블록은 언어 표시 포함
- 체크리스트로 진행도 표시

### 문서 업데이트 원칙
- 코드 변경 시 관련 문서 동시 업데이트
- 이슈 발생 시 CURRENT-ISSUES.md에 즉시 기록
- 작업 완료 시 work-log.md에 기록

## 🎯 즉시 해결 필요 (다음 세션)

1. **홈페이지 레이아웃 수정** - 최우선
   - 사용되지 않는 변수 제거
   - MUI 잔재 완전 제거
   - Tailwind 스타일 검증

2. **포트 충돌 해결**
3. **전체 시스템 안정성 검증**

> 상세 내용은 [CURRENT-ISSUES.md](./CURRENT-ISSUES.md) 참조

## 🔗 주요 링크
- [작업 일지](./work-log.md) - 개발 진행 상황
- [현재 문제점](./CURRENT-ISSUES.md) - 해결 필요 이슈
- [할 일 목록](./TODO.md) - 우선순위별 작업
- [변경 이력](./CHANGELOG.md) - Stage별 변경사항

---

**마지막 업데이트**: 2025-06-03 (Stage 4 완료)  
**다음 작업**: 홈페이지 레이아웃 수정 