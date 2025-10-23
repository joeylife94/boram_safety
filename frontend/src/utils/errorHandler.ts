/**
 * API 에러 처리 유틸리티
 * 백엔드에서 반환하는 표준화된 에러 응답을 처리합니다.
 */

export interface ApiError {
  type: string;
  message: string;
  status_code: number;
  details?: any;
}

export interface ApiErrorResponse {
  error: ApiError;
}

/**
 * API 에러인지 확인
 */
export function isApiError(error: any): error is ApiErrorResponse {
  return error && error.error && typeof error.error.message === 'string';
}

/**
 * 에러에서 사용자 친화적인 메시지 추출
 */
export function getErrorMessage(error: any): string {
  // API 에러 응답 형식
  if (isApiError(error)) {
    return error.error.message;
  }
  
  // Axios 에러
  if (error.response && error.response.data) {
    if (isApiError(error.response.data)) {
      return error.response.data.error.message;
    }
    if (typeof error.response.data === 'string') {
      return error.response.data;
    }
    if (error.response.data.detail) {
      return error.response.data.detail;
    }
  }
  
  // 일반 에러 객체
  if (error.message) {
    return error.message;
  }
  
  // 기본 메시지
  return '알 수 없는 오류가 발생했습니다';
}

/**
 * HTTP 상태 코드에 따른 기본 메시지
 */
export function getStatusMessage(statusCode: number): string {
  const messages: Record<number, string> = {
    400: '잘못된 요청입니다',
    401: '인증이 필요합니다',
    403: '접근 권한이 없습니다',
    404: '요청한 리소스를 찾을 수 없습니다',
    422: '입력 데이터가 올바르지 않습니다',
    500: '서버 오류가 발생했습니다',
    502: '서버에 연결할 수 없습니다',
    503: '서비스를 일시적으로 사용할 수 없습니다',
  };
  
  return messages[statusCode] || `오류가 발생했습니다 (${statusCode})`;
}

/**
 * 에러를 콘솔에 로깅 (개발 환경에서만)
 */
export function logError(error: any, context?: string) {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[Error${context ? ` - ${context}` : ''}]:`, error);
    
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

/**
 * API 에러를 처리하고 사용자에게 표시할 메시지 반환
 */
export function handleApiError(error: any, context?: string): string {
  logError(error, context);
  
  // 네트워크 에러
  if (!error.response) {
    return '네트워크 연결을 확인해주세요';
  }
  
  // 상태 코드별 처리
  const statusCode = error.response.status;
  
  // 커스텀 에러 메시지 우선
  const customMessage = getErrorMessage(error);
  if (customMessage !== '알 수 없는 오류가 발생했습니다') {
    return customMessage;
  }
  
  // 상태 코드 기본 메시지
  return getStatusMessage(statusCode);
}

/**
 * 에러 상세 정보 추출
 */
export function getErrorDetails(error: any): any {
  if (isApiError(error)) {
    return error.error.details;
  }
  
  if (error.response && error.response.data && isApiError(error.response.data)) {
    return error.response.data.error.details;
  }
  
  return null;
}

/**
 * Validation 에러 메시지 포매팅
 */
export function formatValidationErrors(details: any): string[] {
  if (!details || !details.validation_errors) {
    return [];
  }
  
  return details.validation_errors.map((err: any) => {
    return `${err.field}: ${err.message}`;
  });
}
