# API 사용 가이드

> **프로젝트**: 보람안전물산(주) 웹사이트  
> **최종 업데이트**: 2025년 11월 11일

---

## 📋 개요

이 문서는 프론트엔드에서 Backend API를 호출하는 방법을 설명합니다.

---

## 📁 API 파일 구조

```
frontend/src/api/
├── admin.ts       # 관리자 API (CRUD)
├── public.ts      # 공개 API (읽기 전용)
└── product.ts     # 제품 관련 API
```

**중요:** 
- `frontend/admin/` 및 `frontend/public/` 디렉토리는 삭제되었습니다
- 모든 API 호출은 `src/api/` 디렉토리의 파일을 사용하세요

---

## 🔐 API 구분

### Public API (`/api/*`)
- **목적**: 사용자가 제품을 조회하는 읽기 전용 API
- **권한**: 인증 불필요
- **메소드**: GET만 허용
- **파일**: `src/api/public.ts`

### Admin API (`/api/admin/*`)
- **목적**: 관리자가 제품/카테고리를 관리하는 API
- **권한**: 관리자 인증 필요 (향후 구현)
- **메소드**: GET, POST, PUT, DELETE
- **파일**: `src/api/admin.ts`

---

## 🚀 사용 방법

### 1. Public API 사용 예시

#### 카테고리 목록 조회

```typescript
import { getCategories } from '@/api/public'

// 컴포넌트 내부
const fetchCategories = async () => {
  try {
    const categories = await getCategories()
    console.log(categories)
  } catch (error) {
    console.error('카테고리 조회 실패:', error)
  }
}
```

#### 제품 목록 조회

```typescript
import { getProductsByCategory } from '@/api/public'

// 특정 카테고리의 제품 조회
const fetchProducts = async (categoryCode: string) => {
  try {
    const products = await getProductsByCategory(categoryCode)
    console.log(products)
  } catch (error) {
    console.error('제품 조회 실패:', error)
  }
}
```

#### 제품 검색

```typescript
import { searchProducts } from '@/api/public'

// 검색어로 제품 검색
const search = async (query: string) => {
  try {
    const results = await searchProducts(query)
    console.log(results)
  } catch (error) {
    console.error('검색 실패:', error)
  }
}
```

#### 실시간 검색 제안

```typescript
import { getSearchSuggestions } from '@/api/public'

// 검색 제안 (자동완성)
const getSuggestions = async (query: string) => {
  try {
    const suggestions = await getSearchSuggestions(query, 5)
    console.log(suggestions)
  } catch (error) {
    console.error('제안 조회 실패:', error)
  }
}
```

---

### 2. Admin API 사용 예시

#### 제품 생성

```typescript
import { createProduct, ProductCreateData } from '@/api/admin'

const handleCreateProduct = async () => {
  const productData: ProductCreateData = {
    category_id: 1,
    name: '새 제품',
    model_number: 'NEW-001',
    price: 50000,
    description: '제품 설명',
    display_order: 1,
    is_featured: false
  }

  try {
    const newProduct = await createProduct(productData)
    console.log('제품 생성 완료:', newProduct)
  } catch (error) {
    console.error('제품 생성 실패:', error)
  }
}
```

#### 제품 수정

```typescript
import { updateProduct, ProductUpdateData } from '@/api/admin'

const handleUpdateProduct = async (productId: number) => {
  const updateData: ProductUpdateData = {
    name: '수정된 제품명',
    price: 55000
  }

  try {
    const updatedProduct = await updateProduct(productId, updateData)
    console.log('제품 수정 완료:', updatedProduct)
  } catch (error) {
    console.error('제품 수정 실패:', error)
  }
}
```

#### 이미지 업로드와 함께 제품 생성

```typescript
import { createProduct } from '@/api/admin'

const handleCreateWithImage = async (files: FileList) => {
  const productData = {
    category_id: 1,
    name: '이미지가 있는 제품',
    price: 60000,
    display_order: 1,
    is_featured: false
  }

  try {
    const product = await createProduct(productData, files)
    console.log('제품 및 이미지 업로드 완료:', product)
  } catch (error) {
    console.error('업로드 실패:', error)
  }
}
```

#### 제품 삭제

```typescript
import { deleteProduct } from '@/api/admin'

const handleDeleteProduct = async (productId: number) => {
  if (confirm('정말 삭제하시겠습니까?')) {
    try {
      await deleteProduct(productId)
      console.log('제품 삭제 완료')
    } catch (error) {
      console.error('제품 삭제 실패:', error)
    }
  }
}
```

---

### 3. React 컴포넌트에서 사용

#### useState와 useEffect 활용

```typescript
import { useState, useEffect } from 'react'
import { getCategories, PublicCategory } from '@/api/public'

const CategoryList = () => {
  const [categories, setCategories] = useState<PublicCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await getCategories()
        setCategories(data)
      } catch (err) {
        setError('카테고리를 불러오는데 실패했습니다')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div>로딩 중...</div>
  if (error) return <div>{error}</div>

  return (
    <div>
      {categories.map(category => (
        <div key={category.id}>{category.name}</div>
      ))}
    </div>
  )
}
```

#### 이벤트 핸들러에서 사용

```typescript
import { useState } from 'react'
import { searchProducts } from '@/api/public'

const SearchBar = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const products = await searchProducts(query)
      setResults(products)
    } catch (error) {
      console.error('검색 실패:', error)
    }
  }

  return (
    <form onSubmit={handleSearch}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="제품 검색..."
      />
      <button type="submit">검색</button>
    </form>
  )
}
```

---

## 🎨 타입 정의

### Public API 타입

```typescript
// src/api/public.ts

interface PublicCategory {
  id: number
  name: string
  code: string
  slug: string
  description?: string
  image?: string
  image_path?: string
  display_order: number
  image_count?: number
  created_at: string
  updated_at: string
}

interface PublicProduct {
  id: number
  category_id: number
  category_code?: string
  name: string
  model_number?: string
  price?: number
  description?: string
  specifications?: string
  stock_status?: string
  file_name?: string
  file_path?: string
  display_order: number
  is_featured: boolean
  created_at: string
  updated_at: string
}
```

### Admin API 타입

```typescript
// src/api/admin.ts

interface ProductCreateData {
  category_id: number
  name: string
  model_number?: string
  price?: number
  description?: string
  specifications?: string
  stock_status?: string
  file_path?: string
  display_order: number
  is_featured: boolean
}

interface ProductUpdateData {
  category_id?: number
  name?: string
  model_number?: string
  price?: number
  description?: string
  specifications?: string
  stock_status?: string
  file_path?: string
  display_order?: number
  is_featured?: boolean
}
```

---

## ⚙️ 환경 설정

### API URL 설정

API URL은 환경 변수로 설정됩니다:

```bash
# .env.local (개발 환경)
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

```bash
# .env.production (프로덕션)
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

### API 클라이언트 설정

```typescript
// src/api/public.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

const publicApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})
```

---

## 🔧 에러 처리

### 에러 핸들링 패턴

```typescript
import { handleApiError } from '@/utils/errorHandler'

const fetchData = async () => {
  try {
    const data = await getCategories()
    // 성공 처리
  } catch (error) {
    const message = handleApiError(error, '카테고리 조회')
    // 에러 메시지 표시
    alert(message)
  }
}
```

### 공통 에러 타입

```typescript
// 404 Not Found
{
  "error": {
    "type": "NotFoundException",
    "message": "제품을 찾을 수 없습니다",
    "status_code": 404
  }
}

// 400 Bad Request
{
  "error": {
    "type": "BadRequestException",
    "message": "잘못된 요청입니다",
    "status_code": 400
  }
}

// 500 Internal Server Error
{
  "error": {
    "type": "ServerException",
    "message": "서버 오류가 발생했습니다",
    "status_code": 500
  }
}
```

---

## 📊 API 엔드포인트 요약

### Public API

| 메소드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| GET | `/api/categories` | 카테고리 목록 |
| GET | `/api/categories/{code}` | 카테고리 상세 |
| GET | `/api/products` | 제품 목록 |
| GET | `/api/products/by-category/{code}` | 카테고리별 제품 |
| GET | `/api/products/{id}` | 제품 상세 |
| GET | `/api/products/search?q={query}` | 제품 검색 |
| GET | `/api/search/suggestions?q={query}` | 검색 제안 |

### Admin API

| 메소드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| GET | `/api/admin/dashboard` | 대시보드 통계 |
| GET | `/api/admin/categories` | 카테고리 관리 목록 |
| POST | `/api/admin/categories` | 카테고리 생성 |
| PUT | `/api/admin/categories/{id}` | 카테고리 수정 |
| DELETE | `/api/admin/categories/{id}` | 카테고리 삭제 |
| GET | `/api/admin/products` | 제품 관리 목록 |
| POST | `/api/admin/products` | 제품 생성 |
| PUT | `/api/admin/products/{id}` | 제품 수정 |
| DELETE | `/api/admin/products/{id}` | 제품 삭제 |

---

## 🔍 디버깅

### API 호출 로그 확인

```typescript
// 개발 환경에서 API 응답 로깅
publicApi.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.data)
    return response
  },
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)
```

### Network 탭 확인

1. 브라우저 개발자 도구 열기 (F12)
2. Network 탭 선택
3. XHR 또는 Fetch 필터 적용
4. API 요청/응답 확인

---

## 📚 참고 문서

- [API 레퍼런스](./API-REFERENCE.md)
- [Backend API 문서](./backend-api.md)
- [에러 처리 가이드](./DEVELOPMENT-GUIDE.md#에러-처리)

---

## 🔄 마이그레이션 가이드

### 기존 코드에서 변경사항

**이전 (삭제됨):**
```typescript
// ❌ 더 이상 사용하지 않음
import { getCategories } from '../../admin/api'
import { getProducts } from '../../public/api'
```

**현재 (권장):**
```typescript
// ✅ 이렇게 사용하세요
import { getCategories } from '@/api/public'
import { getProducts } from '@/api/admin'
```

---

**모든 API 호출은 `src/api/` 디렉토리의 파일을 사용하세요!**
