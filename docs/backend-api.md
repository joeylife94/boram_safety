# 백엔드 API 명세

## 1. 인증 API
### 1.1 로그인
```http
POST /api/auth/login
Content-Type: application/json

{
    "email": "string",
    "password": "string"
}
```

### 1.2 회원가입
```http
POST /api/auth/register
Content-Type: application/json

{
    "email": "string",
    "password": "string",
    "name": "string",
    "company_id": "string (optional)"
}
```

## 2. 리뷰 API
### 2.1 리뷰 목록 조회
```http
GET /api/reviews?company_id={company_id}
```

### 2.2 리뷰 작성
```http
POST /api/reviews
Content-Type: application/json

{
    "company_id": "string",
    "content": "string",
    "rating": number
}
```

## 3. 대시보드 API
### 3.1 회사 통계 조회
```http
GET /api/dashboard/stats?company_id={company_id}
```

## 보안
- 모든 API는 JWT 토큰 기반 인증을 사용합니다.
- 토큰은 Authorization 헤더에 Bearer 스키마로 전달됩니다.
- 토큰 만료 시간은 24시간입니다. 