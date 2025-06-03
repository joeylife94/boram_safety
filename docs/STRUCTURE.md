# 프로젝트 구조

## 백엔드 (FastAPI)

```
backend/
├── main.py              # FastAPI 애플리케이션 진입점
├── database.py          # 데이터베이스 설정
├── models/             # 데이터베이스 모델
│   └── safety.py      # 안전 장비 관련 모델
├── routers/           # API 라우터
│   └── safety.py      # 안전 장비 관련 API
├── schemas/          # Pydantic 스키마
│   └── safety.py     # 안전 장비 관련 스키마
├── static/          # 정적 파일
│   └── images/      # 이미지 파일
│       ├── safety_helmet/
│       ├── safety_belt/
│       ├── face_protection/
│       ├── respiratory_protection/
│       ├── hearing_protection/
│       ├── protective_clothing/
│       ├── gloves/
│       ├── safety_boots/
│       ├── leg_protection/
│       └── musculoskeletal_protection/
└── dummy_data.py     # 더미 데이터 생성 스크립트
```

## 프론트엔드 (Next.js)

```
frontend/
├── components/
│   └── safety/
│       ├── CategoryGrid.tsx    # 카테고리 그리드 컴포넌트
│       ├── ImageGrid.tsx       # 이미지 그리드 컴포넌트
│       └── ImageUpload.tsx     # 이미지 업로드 컴포넌트
├── pages/
│   ├── safety/
│   │   ├── index.tsx          # 메인 카테고리 페이지
│   │   └── [code].tsx         # 카테고리 상세 페이지
│   └── admin/
│       └── safety/
│           └── index.tsx       # 관리자 페이지
└── types/
    └── safety.ts              # 타입 정의
```

## 문서

```
docs/
├── CHANGELOG.md             # 변경 이력
├── FEATURES.md             # 기능 명세
├── STRUCTURE.md            # 프로젝트 구조
├── TODO.md                 # 할 일 목록
├── work-log.md             # 작업 로그
├── frontend-style.md       # 프론트엔드 스타일 가이드
├── frontend-components.md  # 프론트엔드 컴포넌트 문서
├── frontend-architecture.md # 프론트엔드 아키텍처 문서
├── backend-api.md          # 백엔드 API 문서
├── backend-models.md       # 백엔드 모델 문서
└── backend-overview.md     # 백엔드 개요 문서
```

## 데이터베이스 스키마

### SafetyCategory
- id: Integer (PK)
- name: String
- code: String
- description: Text
- image_count: Integer
- created_at: DateTime
- updated_at: DateTime

### SafetyItemsImages
- id: Integer (PK)
- category_id: Integer (FK)
- file_name: String
- file_path: String
- description: Text
- created_at: DateTime
- updated_at: DateTime 