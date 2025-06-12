# 개발 가이드 - Boram Safety (v1.2)

## 🚀 프로젝트 설정

### 필수 요구사항

- **Node.js**: 18.0 이상
- **Python**: 3.9 이상
- **PostgreSQL**: 14.0 이상
- **Git**: 최신 버전
- **IDE**: VS Code 권장

### 1. 프로젝트 클론

```bash
git clone https://github.com/joeylife94/boram_safety.git
cd boram-safety
```

### 2. 브랜치 구조 이해

```
main (프로덕션 - v1.2 Admin 완료)
├── dev (개발 통합)
    └── features/* (기능별 브랜치)
```

### 3. 개발 환경 설정

#### PostgreSQL 설정
```bash
# PostgreSQL 설치 및 데이터베이스 생성
createdb boram_safety

# 연결 정보 확인
Host: localhost
Port: 5432
Database: boram_safety
User: postgres
Password: ava1142
```

#### Backend 설정
```bash
cd backend
pip install -r requirements.txt

# 데이터베이스 마이그레이션 (필요시)
python create_tables.py
```

#### Frontend 설정
```bash
cd frontend
npm install
```

## 📋 개발 워크플로우

### 새 기능 개발 시작

```bash
# 1. dev 브랜치로 이동 및 최신화
git checkout dev
git pull origin dev

# 2. 새 feature 브랜치 생성
git checkout -b features/기능명

# 3. 개발 진행...

# 4. 커밋 및 푸시
git add .
git commit -m "feat: 기능 설명"
git push origin features/기능명

# 5. GitHub에서 dev로 Pull Request 생성
# 6. 코드 리뷰 후 merge
# 7. main으로 최종 merge
```

### 커밋 메시지 컨벤션

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 추가/수정
chore: 빌드 설정 변경
admin: Admin 기능 관련
api: API 엔드포인트 관련
db: 데이터베이스 관련
```

## 🖥️ 개발 서버 실행

### Backend (FastAPI)
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
# → http://localhost:8000
# API 문서: http://localhost:8000/docs
```

### Frontend (Next.js)
```bash
cd frontend
npm run dev
# → http://localhost:3000
# → Admin: http://localhost:3000/admin
```

## 🗂️ 프로젝트 구조 상세 (v1.2)

### Frontend 구조
```
frontend/src/
├── pages/                    # Next.js 페이지
│   ├── index.tsx            # 메인 페이지
│   ├── products.tsx         # 제품 카테고리 목록
│   ├── about.tsx            # 회사 소개
│   ├── admin.tsx            # 관리자 메인 대시보드
│   ├── products/
│   │   ├── [category]/
│   │   │   ├── index.tsx    # 카테고리별 제품 목록
│   │   │   └── [slug].tsx   # 제품 상세 페이지
│   └── admin/               # 관리자 페이지들
│       ├── products/
│       │   ├── index.tsx    # 제품 관리 목록
│       │   ├── new.tsx      # 새 제품 추가
│       │   └── [id]/edit.tsx # 제품 수정
│       └── categories/
│           └── index.tsx    # 카테고리 관리
├── components/              # 재사용 컴포넌트
│   ├── layout/
│   │   ├── Layout.tsx       # 전체 레이아웃 wrapper
│   │   ├── Header.tsx       # 헤더 + 검색 기능
│   │   └── Navbar.tsx       # 네비게이션 바
│   └── product/
│       ├── ProductCard.tsx  # 제품 카드
│       └── ProductDetail.tsx # 제품 상세 정보
├── api/                     # API 호출 함수
│   ├── admin.ts             # 관리자 API
│   ├── public.ts            # 공개 API
│   └── product.ts           # 제품 관련 API (레거시)
├── types/                   # TypeScript 타입 정의
├── utils/                   # 유틸리티 함수
│   └── image.ts             # 이미지 처리 (경로 변환 포함)
└── styles/                  # 스타일
    └── globals.css          # 전역 CSS
```

### Backend 구조
```
backend/
├── main.py                  # FastAPI 앱 진입점
├── database/
│   └── __init__.py          # PostgreSQL 연결 설정
├── models/
│   └── safety.py            # SafetyProduct, SafetyCategory 모델
├── schemas/                 # Pydantic 스키마
│   ├── product.py           # 제품 스키마
│   └── category.py          # 카테고리 스키마
├── crud/                    # 데이터베이스 CRUD 함수
│   ├── product.py           # 제품 CRUD (JOIN 쿼리 포함)
│   └── category.py          # 카테고리 CRUD
├── admin/                   # Admin API 라우터
│   └── router.py            # /api/admin/* 엔드포인트
├── public/                  # Public API 라우터
│   └── router.py            # /api/* 엔드포인트
├── routers/                 # 기타 라우터 (레거시)
└── requirements.txt         # Python 의존성
```

## 🔧 주요 개발 도구

### Frontend
- **Next.js 13+**: React 프레임워크
- **TypeScript**: 타입 안전성
- **Tailwind CSS**: 스타일링
- **Axios**: HTTP 클라이언트
- **ESLint + Prettier**: 코드 품질

### Backend
- **FastAPI**: Python 웹 프레임워크
- **SQLAlchemy**: ORM
- **Pydantic**: 데이터 검증
- **PostgreSQL**: 프로덕션 데이터베이스
- **Uvicorn**: ASGI 서버

### 데이터베이스
- **PostgreSQL**: 메인 데이터베이스
- **pgAdmin** (선택): GUI 관리 도구

## 📝 코딩 스타일 가이드

### TypeScript/React
```typescript
// 컴포넌트 명명: PascalCase
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // useState 훅 사용
  const [isLoading, setIsLoading] = useState(false);
  
  // 이벤트 핸들러: handle로 시작
  const handleProductClick = () => {
    // 로직
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* JSX */}
    </div>
  );
};
```

### Python/FastAPI
```python
# 함수 명명: snake_case
@router.get("/products/{category_code}")
async def get_products_by_category(
    category_code: str,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
) -> List[ProductResponse]:
    """카테고리별 제품 목록 조회 (카테고리 정보 포함)"""
    return crud.get_products_by_category(db, category_code, skip, limit)
```

## 🔌 API 개발 가이드

### Public API 개발
```python
# backend/public/router.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from crud import product, category

router = APIRouter(prefix="/api", tags=["public"])

@router.get("/products")
async def get_products(db: Session = Depends(get_db)):
    return product.get_products(db)
```

### Admin API 개발
```python
# backend/admin/router.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from crud import product
from schemas.product import ProductCreate, ProductResponse

router = APIRouter(prefix="/api/admin", tags=["admin"])

@router.post("/products", response_model=ProductResponse)
async def create_product(
    product_data: ProductCreate,
    db: Session = Depends(get_db)
):
    return product.create_product(db, product_data)
```

## 🗄️ 데이터베이스 개발 가이드

### CRUD 함수 예시
```python
# backend/crud/product.py
from sqlalchemy.orm import Session, joinedload
from models.safety import SafetyProduct, SafetyCategory

def get_products(db: Session, skip: int = 0, limit: int = 20):
    """제품 목록 조회 (카테고리 정보 포함)"""
    return db.query(SafetyProduct)\
        .join(SafetyCategory)\
        .add_columns(
            SafetyCategory.code.label('category_code'),
            SafetyCategory.name.label('category_name')
        )\
        .offset(skip)\
        .limit(limit)\
        .all()
```

### 이미지 경로 처리
```python
# utils/image.py
def convert_image_path(file_path: str) -> str:
    """이미지 경로 변환: /static/images/ → /images/"""
    if file_path and file_path.startswith('/static/'):
        return file_path.replace('/static/', '/')
    return file_path
```

## 🐛 디버깅 가이드

### Frontend 디버깅
```bash
# 개발자 도구 콘솔 확인
# React DevTools 사용
# Network 탭에서 API 호출 확인

# Next.js 빌드 확인
npm run build
npm run start
```

### Backend 디버깅
```bash
# FastAPI 자동 문서 확인
http://localhost:8000/docs

# 로그 확인
uvicorn main:app --reload --log-level debug

# PostgreSQL 연결 확인
python -c "from database import get_db; print('DB 연결 성공')"
```

### 데이터베이스 디버깅
```sql
-- PostgreSQL 연결 확인
\l  -- 데이터베이스 목록
\c boram_safety  -- 데이터베이스 연결
\dt  -- 테이블 목록

-- 데이터 확인
SELECT * FROM safety_categories LIMIT 5;
SELECT * FROM safety_products LIMIT 5;

-- JOIN 쿼리 테스트
SELECT p.name, c.name as category_name 
FROM safety_products p 
JOIN safety_categories c ON p.category_id = c.id 
LIMIT 5;
```

## 🚀 배포 준비

### 프로덕션 빌드
```bash
# Frontend 빌드
cd frontend
npm run build
npm run start  # 프로덕션 서버 테스트

# Backend 프로덕션 실행
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 환경 변수 설정
```bash
# .env 파일 (backend/)
DATABASE_URL=postgresql://user:password@localhost:5432/boram_safety
DEBUG=False
```

## 📊 성능 최적화

### Frontend 최적화
- **이미지 최적화**: Next.js Image 컴포넌트 사용
- **API 호출 최적화**: SWR 또는 React Query 사용 고려
- **번들 사이즈**: 불필요한 라이브러리 제거

### Backend 최적화
- **쿼리 최적화**: JOIN 쿼리 활용
- **인덱스**: 자주 검색되는 필드에 인덱스 추가
- **페이지네이션**: 대용량 데이터 처리

### 데이터베이스 최적화
```sql
-- 인덱스 추가 예시
CREATE INDEX idx_products_category_id ON safety_products(category_id);
CREATE INDEX idx_products_featured ON safety_products(is_featured);
CREATE INDEX idx_products_name ON safety_products(name);
```

## 🔐 보안 가이드

### API 보안
- **CORS 설정**: 프론트엔드 도메인만 허용
- **입력 검증**: Pydantic 스키마 활용
- **SQL 인젝션 방지**: SQLAlchemy ORM 사용

### 추후 인증 시스템
```python
# JWT 토큰 기반 인증 (v1.3 예정)
from fastapi_users import FastAPIUsers
from fastapi_users.authentication import JWTAuthentication
```

## 🧪 테스트 가이드

### Backend 테스트
```python
# pytest 설치 및 실행
pip install pytest pytest-asyncio httpx
pytest tests/
```

### Frontend 테스트
```bash
# Jest + React Testing Library
npm install --save-dev jest @testing-library/react
npm test
```

---

> **참고**: 이 가이드는 v1.2 기준으로 작성되었습니다. Admin 기능이 완전히 구현되어 있으며, PostgreSQL을 사용합니다. 