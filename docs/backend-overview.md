# 보람안전 백엔드 시스템 문서

## 목차

1. [시스템 개요](#1-시스템-개요)
2. [기술 스택](#2-기술-스택)
3. [아키텍처](#3-아키텍처)
4. [API 명세](#4-api-명세)
5. [데이터베이스 설계](#5-데이터베이스-설계)
6. [보안](#6-보안)
7. [배포 및 운영](#7-배포-및-운영)

---

## 1. 시스템 개요

### 1.1 소개
보람안전 웹사이트의 백엔드 시스템으로, RESTful API를 제공하여 제품 정보 관리, 문의사항 처리, 관리자 기능을 지원합니다.

### 1.2 주요 기능
- 제품 정보 관리 API
- 문의사항 접수 및 관리
- 관리자 인증/인가
- 이미지 파일 업로드/관리
- 회사 정보 관리

## 2. 기술 스택

### 2.1 주요 기술
- **FastAPI**: Python 기반 고성능 웹 프레임워크
- **SQLAlchemy**: ORM (Object-Relational Mapping)
- **MySQL**: 주 데이터베이스
- **Redis**: 캐싱 및 세션 관리
- **JWT**: 인증 토큰 관리

### 2.2 개발 도구
- **Poetry**: 의존성 관리
- **Alembic**: 데이터베이스 마이그레이션
- **pytest**: 단위/통합 테스트
- **Black**: 코드 포맷팅
- **isort**: import 문 정렬

## 3. 아키텍처

### 3.1 시스템 구조
```
backend/
├── app/
│   ├── core/           # 핵심 설정 및 유틸리티
│   ├── models/         # 데이터베이스 모델
│   ├── schemas/        # Pydantic 스키마
│   ├── api/           # API 라우터
│   ├── crud/          # CRUD 작업
│   └── utils/         # 유틸리티 함수
├── tests/             # 테스트 코드
├── alembic/           # DB 마이그레이션
└── scripts/           # 유틸리티 스크립트
```

### 3.2 주요 컴포넌트
- API 라우터: 엔드포인트 정의
- 모델: 데이터베이스 테이블 구조
- 스키마: 요청/응답 데이터 검증
- CRUD: 데이터베이스 작업 로직

## 4. API 명세

### 4.1 제품 관련 API

#### 제품 목록 조회
```
GET /api/products

Query Parameters:
- category: string (optional)
- page: integer (default: 1)
- limit: integer (default: 10)

Response:
{
  "items": [
    {
      "id": string,
      "name": string,
      "category": string,
      "description": string,
      "images": string[],
      "isNew": boolean,
      "isFeatured": boolean
    }
  ],
  "total": integer,
  "page": integer,
  "pages": integer
}
```

#### 제품 상세 조회
```
GET /api/products/{id}

Response:
{
  "id": string,
  "name": string,
  "category": string,
  "description": string,
  "images": string[],
  "specifications": object,
  "features": string[],
  "isNew": boolean,
  "isFeatured": boolean
}
```

### 4.2 문의하기 API

#### 문의 등록
```
POST /api/inquiries

Request Body:
{
  "name": string,
  "email": string,
  "phone": string,
  "subject": string,
  "message": string,
  "agreement": boolean
}

Response:
{
  "id": string,
  "createdAt": string,
  "status": string
}
```

### 4.3 관리자 API

#### 관리자 로그인
```
POST /api/admin/login

Request Body:
{
  "username": string,
  "password": string
}

Response:
{
  "access_token": string,
  "token_type": string
}
```

## 5. 데이터베이스 설계

### 5.1 ERD
```
Product
- id (PK)
- name
- category
- description
- specifications (JSON)
- created_at
- updated_at

ProductImage
- id (PK)
- product_id (FK)
- url
- is_primary
- created_at

Inquiry
- id (PK)
- name
- email
- phone
- subject
- message
- status
- created_at
- updated_at

Admin
- id (PK)
- username
- hashed_password
- is_active
- created_at
```

### 5.2 인덱스 설계
- products: category, created_at
- inquiries: status, created_at
- product_images: product_id

## 6. 보안

### 6.1 인증/인가
- JWT 기반 토큰 인증
- Role 기반 접근 제어
- API 키 인증 (외부 서비스용)

### 6.2 데이터 보안
- 비밀번호 해싱 (bcrypt)
- HTTPS 적용
- CORS 설정
- Rate Limiting

### 6.3 파일 업로드 보안
- 파일 크기 제한
- 허용된 파일 형식 검증
- 악성코드 스캔

## 7. 배포 및 운영

### 7.1 환경 설정
```bash
# 필수 환경 변수
DATABASE_URL=mysql://user:pass@localhost/db
SECRET_KEY=your-secret-key
ADMIN_EMAIL=admin@example.com
```

### 7.2 배포 절차
1. 환경 변수 설정
2. 데이터베이스 마이그레이션
3. 정적 파일 수집
4. 서버 시작

### 7.3 모니터링
- API 응답 시간 모니터링
- 에러 로깅
- 리소스 사용량 추적

---

## 부록

### A. 개발 환경 설정
```bash
# 의존성 설치
poetry install

# 개발 서버 실행
poetry run uvicorn app.main:app --reload

# 테스트 실행
poetry run pytest

# 마이그레이션 생성
poetry run alembic revision --autogenerate
```

### B. 문제 해결 가이드
- 일반적인 오류 해결 방법
- 성능 최적화 팁
- 디버깅 가이드

### C. 참고 자료
- [FastAPI 공식 문서](https://fastapi.tiangolo.com/)
- [SQLAlchemy 문서](https://docs.sqlalchemy.org/)
- [Alembic 문서](https://alembic.sqlalchemy.org/) 