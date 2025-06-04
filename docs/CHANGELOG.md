# Changelog

## [Unreleased] - 현재 문제점

### Issues (해결 필요)
- [ ] **홈페이지 레이아웃 깨짐 문제**
  - MUI import 제거했지만 여전히 레이아웃 문제 존재
  - 사용되지 않는 변수들(companyHistory, clientLogos) 정리 필요
  - 완전한 Tailwind CSS 전환 확인 필요
- [ ] Frontend 서버 포트 충돌 (3000 포트)
- [ ] 외부 placeholder 이미지 의존성 완전 제거 확인

## [Stage 4] - 2025-06-03 - Backend ↔ Frontend ↔ DB 통합

### Major Changes
- **이미지 관리 시스템 완전 재구성**
  - 이미지 저장 위치: `backend/static/images/` → `frontend/public/images/`
  - 254개 이미지 파일 마이그레이션 완료
  - URL 핸들링: `http://localhost:8000/static/images/...` → `/images/...`
  - Backend StaticFiles mount 제거

- **UI 프레임워크 표준화**
  - MUI 완전 제거, Tailwind CSS로 통일
  - Layout.tsx, Navbar.tsx 완전 Tailwind 변환
  - 제품 페이지들 Tailwind 변환 완료

### Added
- Local SVG 기반 placeholder 시스템
- UTF-8 한국어 텍스트 지원 (btoa → encodeURIComponent)
- 완전한 오프라인 이미지 시스템
- 반응형 Tailwind 네비게이션 바

### Fixed
- 한국어 텍스트 인코딩 오류 해결
- 외부 이미지 서비스 의존성 제거 (via.placeholder.com)
- 데이터베이스 스키마 불일치 문제 해결
- Image utility 함수 필드명 매핑 수정

### Technical Debt
- SQLAlchemy 순환 import 문제 해결
- Database 리셋 및 254개 제품 데이터 재구축
- 이미지 관리 아키텍처 완전 재설계

## [Stage 3] - Frontend Preparation

### Added
- 안전 장비 관리 시스템 구축
  - 백엔드 API 구현
    - 카테고리 CRUD
    - 이미지 업로드/관리
  - 프론트엔드 컴포넌트 구현
    - CategoryGrid: 카테고리 그리드 표시
    - ImageGrid: 이미지 그리드 표시
    - ImageUpload: 이미지 업로드 기능
  - 페이지 구현
    - /safety: 메인 카테고리 페이지
    - /safety/[code]: 카테고리 상세 페이지
    - /admin/safety: 관리자 페이지

### Changed
- 프로젝트 구조 변경
  - 제품 관리 시스템에서 안전 장비 관리 시스템으로 전환
  - 데이터베이스 스키마 재설계
  - 문서 구조 개선

### Fixed
- 이미지 업로드 시 디렉토리 자동 생성
- 카테고리별 이미지 카운트 자동 업데이트
- 타입스크립트 타입 정의 개선

## [0.1.0] - 2024-03-XX

### Added
- 기본 프로젝트 구조 설정
- 백엔드 (FastAPI + PostgreSQL)
  - 기본 모델 구현 (Product, Category, Inquiry)
  - API 라우터 구현
  - 더미 데이터 추가
- 프론트엔드 (Next.js)
  - 기본 페이지 구현
    - 메인(/)
    - 제품목록(/products)
    - 제품상세(/products/[id])
    - 연락처(/contact)
    - 소개(/about)
  - 기본 컴포넌트 구현
    - ProductCard
    - Layout
    - Navigation 

## [0.2.0] - 2024-03-21

### Added
- 제품 카드 컴포넌트 (ProductCard) 구현
- 이미지 로딩 상태 표시 기능
- 카테고리별 기본 이미지 시스템
- 반응형 그리드 레이아웃
- 검색 기능 구현

### Changed
- 더미 데이터에 실제 이미지 URL 추가
- 이미지 로딩 UX 개선
- 카드 디자인 개선 (호버 효과, 그림자 등)

### Fixed
- 이미지 로드 실패 시 대체 이미지 표시
- 타입스크립트 타입 정의 개선
- 반응형 레이아웃 문제 해결 