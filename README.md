# 보람안전 웹사이트

보람안전의 공식 웹사이트 프로젝트입니다. Next.js와 TypeScript를 기반으로 제작된 현대적인 웹 애플리케이션입니다.

## 문서

모든 프로젝트 문서는 `docs/` 디렉토리에서 찾을 수 있습니다:

- [프로젝트 개요](docs/project-overview.md)
- [프론트엔드 문서](docs/frontend-architecture.md)
- [백엔드 문서](docs/backend-overview.md)

## 빠른 시작

```bash
# 프론트엔드 실행
cd frontend
npm install
npm run dev

# 백엔드 실행
cd backend
poetry install
poetry run uvicorn app.main:app --reload
```

자세한 설정 및 개발 가이드는 [프로젝트 문서](docs/project-overview.md)를 참조해주세요.

## 기술 스택

- **Frontend**
  - Next.js 14
  - TypeScript
  - Tailwind CSS
  - React Query (데이터 관리)

## 프로젝트 구조

```
frontend/
├── src/
│   ├── app/              # Next.js 14 App Router 페이지
│   ├── components/       # 재사용 가능한 컴포넌트
│   ├── types/           # TypeScript 타입 정의
│   ├── utils/           # 유틸리티 함수
│   └── styles/          # 전역 스타일
```

## 주요 기능

- **제품 카탈로그**: 카테고리별 제품 목록 및 상세 정보 제공
- **반응형 디자인**: 모든 디바이스에서 최적화된 사용자 경험
- **성능 최적화**: Next.js의 이미지 최적화 및 SSR/SSG 활용

## 페이지 구조

- `/`: 메인 페이지
- `/products`: 제품 목록
- `/products/[id]`: 제품 상세 페이지
- `/about`: 회사 소개
- `/contact`: 문의하기

## 컴포넌트 가이드

### ProductCard
제품 목록에서 사용되는 카드 컴포넌트
- Props:
  - `product`: Product 타입의 제품 정보
- 기능:
  - 반응형 이미지 표시
  - NEW, BEST 뱃지 지원
  - 호버 효과

### Header
- 반응형 네비게이션
- 스크롤 인터랙션
- 모바일 메뉴 지원

## 개발 가이드라인

### 코드 스타일
- ESLint 규칙 준수
- Prettier 포맷팅 사용
- TypeScript strict 모드 활성화

### 커밋 메시지 컨벤션
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 코드 추가/수정
chore: 빌드 프로세스 또는 보조 도구 변경
```

## 배포

현재 임시 데이터를 사용 중이며, 추후 백엔드 API 연동 예정입니다.

## 문의

프로젝트 관련 문의사항은 [담당자 이메일] 로 연락주시기 바랍니다. 