# 테스트 가이드

> **프로젝트**: 보람안전물산(주) 웹사이트  
> **최종 업데이트**: 2025년 11월 11일

---

## 📋 개요

이 문서는 프로젝트의 테스트 구조와 실행 방법을 설명합니다.

---

## 🧪 테스트 구조

### Backend 테스트 (pytest)

```
backend/tests/
├── __init__.py
├── conftest.py              # pytest 설정 및 fixture
├── test_public_api.py       # Public API 테스트
└── test_admin_api.py        # Admin API 테스트
```

**커버리지:**
- Public API: 카테고리, 제품 조회 (GET)
- Admin API: CRUD 작업 (GET, POST, PUT, DELETE)
- 테스트 데이터베이스: 인메모리 SQLite

### Frontend 테스트 (Jest)

```
frontend/src/__tests__/
└── utils.test.ts            # 유틸리티 함수 테스트
```

**커버리지:**
- 이미지 URL 변환 함수
- 기본 이미지 처리

---

## 🚀 테스트 실행 방법

### Backend 테스트

#### 1. 의존성 설치

```bash
cd backend

# Python 가상 환경 활성화 (선택사항)
python -m venv venv
.\venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# 의존성 설치
pip install -r requirements.txt
```

#### 2. 테스트 실행

```bash
# 모든 테스트 실행
pytest tests/ -v

# 특정 파일만 테스트
pytest tests/test_public_api.py -v

# 커버리지와 함께 실행
pytest tests/ -v --cov=. --cov-report=html

# 실패 시 상세 정보
pytest tests/ -v --tb=long

# 특정 테스트만 실행
pytest tests/test_public_api.py::test_get_categories_with_data -v
```

#### 3. 커버리지 확인

```bash
# HTML 리포트 생성
pytest tests/ --cov=. --cov-report=html

# 브라우저에서 열기
# htmlcov/index.html
```

---

### Frontend 테스트

#### 1. 의존성 설치

```bash
cd frontend
npm install
```

#### 2. 테스트 실행

```bash
# 모든 테스트 실행
npm test

# Watch 모드
npm test -- --watch

# 커버리지와 함께 실행
npm test -- --coverage

# 특정 파일만 테스트
npm test -- utils.test.ts
```

---

## 📊 현재 테스트 현황

### Backend 테스트

**파일: test_public_api.py**
- ✅ `test_get_root()` - 루트 엔드포인트
- ✅ `test_get_categories_empty()` - 빈 카테고리 리스트
- ✅ `test_get_categories_with_data()` - 카테고리 리스트 (데이터 있음)
- ✅ `test_get_category_by_id()` - ID로 카테고리 조회
- ✅ `test_get_category_not_found()` - 존재하지 않는 카테고리
- ✅ `test_get_products_empty()` - 빈 제품 리스트
- ✅ `test_get_products_with_data()` - 제품 리스트 (데이터 있음)
- ✅ `test_get_product_by_id()` - ID로 제품 조회
- ✅ `test_search_products()` - 제품 검색

**파일: test_admin_api.py**
- ✅ Admin API 기본 기능 테스트
- ✅ CRUD 작업 테스트
- ✅ 이미지 업로드 테스트

### Frontend 테스트

**파일: utils.test.ts**
- ✅ `getImageUrl()` - 상대 경로 변환
- ✅ `getImageUrl()` - 빈 경로 처리
- ✅ `getImageUrl()` - null 처리
- ✅ `getImageUrl()` - undefined 처리

---

## ✅ 테스트 작성 가이드

### Backend 테스트 작성

```python
# tests/test_example.py
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

def test_example_endpoint(client: TestClient, test_db: Session):
    """
    엔드포인트 테스트 예시
    """
    # Given: 테스트 데이터 준비
    # (sample_category, sample_product fixture 사용 가능)
    
    # When: API 호출
    response = client.get("/api/example")
    
    # Then: 결과 검증
    assert response.status_code == 200
    data = response.json()
    assert "expected_field" in data
```

### Frontend 테스트 작성

```typescript
// src/__tests__/example.test.ts
import { exampleFunction } from '../utils/example'

describe('Example Function', () => {
  it('should return expected result', () => {
    // Given
    const input = 'test'
    
    // When
    const result = exampleFunction(input)
    
    // Then
    expect(result).toBe('expected')
  })
})
```

---

## 🔧 트러블슈팅

### 문제: "No module named pytest"

**해결:**
```bash
pip install pytest pytest-asyncio pytest-cov httpx
```

### 문제: "ImportError: cannot import name 'get_db'"

**해결:**
```bash
# backend 디렉토리에서 실행하는지 확인
cd backend
pytest tests/
```

### 문제: 테스트 데이터베이스 연결 실패

**해결:**
- `conftest.py`에서 인메모리 SQLite를 사용하므로 별도 DB 설정 불필요
- 테스트는 격리된 환경에서 실행됨

### 문제: Frontend 테스트 실패

**해결:**
```bash
# Jest 설정 확인
cat jest.config.js

# 의존성 재설치
rm -rf node_modules package-lock.json
npm install
```

---

## 📈 테스트 커버리지 목표

### 현재 상태
- **Backend**: 기본 API 테스트 완료
- **Frontend**: 유틸리티 함수 테스트 완료

### 추가 필요 테스트

#### Backend (우선순위: 중간)
- [ ] 검색 필터링 고급 기능
- [ ] 이미지 업로드 검증
- [ ] 에러 처리 케이스
- [ ] 데이터베이스 트랜잭션
- [ ] 권한 관리 (JWT 구현 후)

#### Frontend (우선순위: 중간)
- [ ] 컴포넌트 테스트
  - [ ] `ProductCard` 컴포넌트
  - [ ] `Header` 컴포넌트
  - [ ] `SafeImage` 컴포넌트
- [ ] API 호출 테스트
- [ ] 페이지 라우팅 테스트

---

## 🎯 CI/CD 통합 (향후 계획)

### GitHub Actions 예시

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
      - name: Run tests
        run: |
          cd backend
          pytest tests/ -v --cov
  
  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
      - name: Run tests
        run: |
          cd frontend
          npm test -- --coverage
```

---

## 📝 테스트 베스트 프랙티스

### ✅ 권장사항

1. **격리된 테스트**
   - 각 테스트는 독립적으로 실행 가능해야 함
   - 테스트 간 의존성 제거

2. **명확한 네이밍**
   - `test_get_category_by_id()` ✅
   - `test1()` ❌

3. **Given-When-Then 패턴**
   ```python
   # Given: 테스트 데이터 준비
   # When: 기능 실행
   # Then: 결과 검증
   ```

4. **의미있는 Assert**
   - 구체적인 검증
   - 명확한 에러 메시지

5. **테스트 데이터 관리**
   - Fixture 활용
   - 재사용 가능한 테스트 데이터

### ❌ 피해야 할 것

1. ~~실제 데이터베이스 사용~~
2. ~~외부 API 의존성~~
3. ~~테스트 간 상태 공유~~
4. ~~불필요한 테스트 중복~~

---

## 📚 참고 자료

- [pytest 공식 문서](https://docs.pytest.org/)
- [FastAPI Testing](https://fastapi.tiangolo.com/tutorial/testing/)
- [Jest 공식 문서](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)

---

## 📞 문의

테스트 관련 문제가 있으면 프로젝트 관리자에게 문의하세요.
