# 개발 가이드 - Boram Safety

## 🚀 프로젝트 설정

### 필수 요구사항

- **Node.js**: 18.0 이상
- **Python**: 3.9 이상
- **Git**: 최신 버전
- **IDE**: VS Code 권장

### 1. 프로젝트 클론

```bash
git clone https://github.com/joeylife94/boram_safety.git
cd boram-safety
```

### 2. 브랜치 구조 이해

```
main (프로덕션)
├── dev (개발 통합)
    ├── features/search-functionality (완료)
    └── features/add_admin_function (준비중)
```

### 3. 개발 환경 설정

#### Frontend 설정
```bash
cd frontend
npm install
```

#### Backend 설정
```bash
cd backend
pip install -r requirements.txt
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
```

## 🖥️ 개발 서버 실행

### Frontend (Next.js)
```bash
cd frontend
npm run dev
# → http://localhost:3000
```

### Backend (FastAPI)
```bash
cd backend
uvicorn app.main:app --reload
# → http://localhost:8000
# API 문서: http://localhost:8000/docs
```

## 🗂️ 프로젝트 구조 상세

### Frontend 구조
```
frontend/src/
├── pages/                    # Next.js 페이지
│   ├── index.tsx            # 메인 페이지
│   ├── products.tsx         # 제품 카테고리 목록
│   ├── about.tsx            # 회사 소개
│   ├── contact.tsx          # 문의하기
│   └── products/
│       ├── [category]/
│       │   ├── index.tsx    # 카테고리별 제품 목록 + 검색
│       │   └── [slug].tsx   # 제품 상세 페이지
├── components/              # 재사용 컴포넌트
│   ├── layout/
│   │   ├── Layout.tsx       # 전체 레이아웃 wrapper
│   │   ├── Header.tsx       # 헤더 + 검색 기능
│   │   └── Navbar.tsx       # 네비게이션 바
│   └── product/
│       ├── ProductCard.tsx  # 제품 카드
│       └── ProductDetail.tsx # 제품 상세 정보
├── api/                     # API 호출 함수
│   └── product.ts           # 제품 관련 API
├── types/                   # TypeScript 타입 정의
│   ├── product.ts           # 제품 타입
│   └── safety.ts            # 안전용품 타입
├── utils/                   # 유틸리티 함수
│   └── image.ts             # 이미지 처리 도구
└── styles/                  # 스타일
    └── globals.css          # 전역 CSS
```

### Backend 구조
```
backend/
├── app/
│   └── api/
│       └── products.py      # 제품 관련 API 엔드포인트
├── models/
│   └── safety.py            # 데이터베이스 모델
├── schemas/
│   └── safety.py            # Pydantic 스키마
├── routers/                 # 라우터 관리
├── database/                # 데이터베이스 설정
├── main.py                  # FastAPI 앱 진입점
└── requirements.txt         # Python 의존성
```

## 🔧 주요 개발 도구

### Frontend
- **Next.js 13+**: React 프레임워크
- **TypeScript**: 타입 안전성
- **Tailwind CSS**: 스타일링
- **ESLint + Prettier**: 코드 품질

### Backend
- **FastAPI**: Python 웹 프레임워크
- **SQLAlchemy**: ORM
- **Pydantic**: 데이터 검증
- **SQLite**: 개발용 데이터베이스

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
    db: Session = Depends(get_db)
) -> List[SafetyProduct]:
    """카테고리별 제품 목록 조회"""
    return crud.get_products_by_category(db, category_code)
```

## 🐛 디버깅 가이드

### Frontend 디버깅
```bash
# 개발자 도구 콘솔 확인
# React DevTools 사용
# Network 탭에서 API 호출 확인
```

### Backend 디버깅
```bash
# FastAPI 자동 문서 활용
http://localhost:8000/docs

# 로그 확인
uvicorn app.main:app --reload --log-level debug

# 데이터베이스 직접 확인
sqlite3 backend/safety.db
.tables
SELECT * FROM safety_products LIMIT 5;
```

## 🔍 주요 기능 구현 방법

### 1. 새 페이지 추가
```bash
# 1. pages 폴더에 새 파일 생성
frontend/src/pages/new-page.tsx

# 2. 기본 구조 작성
import Layout from '@/components/layout/Layout';

export default function NewPage() {
  return (
    <Layout>
      <div>새 페이지 내용</div>
    </Layout>
  );
}

# 3. 네비게이션에 링크 추가 (Header.tsx)
```

### 2. 새 API 엔드포인트 추가
```python
# 1. backend/app/api/products.py에 추가
@router.get("/new-endpoint")
async def new_endpoint(db: Session = Depends(get_db)):
    return {"message": "새 엔드포인트"}

# 2. frontend/src/api/product.ts에 호출 함수 추가
export const callNewEndpoint = async () => {
  const response = await fetch(`${API_BASE_URL}/new-endpoint`);
  return response.json();
};
```

### 3. 새 컴포넌트 작성
```typescript
// frontend/src/components/common/NewComponent.tsx
interface NewComponentProps {
  title: string;
  onAction: () => void;
}

const NewComponent: React.FC<NewComponentProps> = ({ title, onAction }) => {
  return (
    <div className="p-4 bg-gray-100 rounded">
      <h3 className="text-lg font-semibold">{title}</h3>
      <button onClick={onAction} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
        액션
      </button>
    </div>
  );
};

export default NewComponent;
```

## 🚧 현재 개발 중인 기능

### Admin 기능 (다음 단계)
- 관리자 인증 시스템
- 제품 CRUD 관리
- 주문 관리 시스템
- 대시보드 통계

### 개발 우선순위
1. **Admin 로그인** (JWT 토큰 기반)
2. **제품 관리** (추가/수정/삭제)
3. **주문 시스템**
4. **통계 대시보드**

## 🔗 유용한 링크

- **GitHub**: https://github.com/joeylife94/boram_safety.git
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API 문서**: http://localhost:8000/docs
- **Next.js 문서**: https://nextjs.org/docs
- **FastAPI 문서**: https://fastapi.tiangolo.com/
- **Tailwind CSS**: https://tailwindcss.com/docs

## ❓ 자주 묻는 질문

### Q1: 새 의존성 패키지를 추가하려면?
```bash
# Frontend
cd frontend
npm install 패키지명

# Backend
cd backend
pip install 패키지명
pip freeze > requirements.txt
```

### Q2: 데이터베이스 스키마를 수정하려면?
```bash
# 1. models/safety.py 수정
# 2. create_tables.py 실행
cd backend
python create_tables.py
```

### Q3: 새 브랜치에서 작업할 때 주의사항?
- 항상 dev에서 분기
- 기능별로 브랜치 분리
- 정기적으로 dev와 동기화
- Pull Request 전 충돌 해결

---

> 🎯 **다음 작업**: Admin 기능 개발을 위해 `features/admin-auth` 브랜치에서 시작해주세요! 