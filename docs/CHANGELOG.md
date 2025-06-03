# Changelog

## [Unreleased]

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