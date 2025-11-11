"""
Excel 파일 처리 유틸리티
제품 데이터 일괄 업로드/다운로드 기능
"""
import pandas as pd
from typing import List, Dict, Any, Optional
from io import BytesIO
from datetime import datetime
from sqlalchemy.orm import Session
from models.safety import SafetyProduct, SafetyCategory
from fastapi import UploadFile

class ExcelHandler:
    """Excel 파일 처리 클래스"""
    
    # Excel 템플릿 컬럼 정의
    COLUMNS = [
        '카테고리코드',
        '제품명',
        '모델번호',
        '가격',
        '설명',
        '사양',
        '재고상태',
        '이미지경로',
        '표시순서',
        '추천제품'
    ]
    
    @staticmethod
    def create_template() -> BytesIO:
        """
        Excel 템플릿 파일 생성
        
        Returns:
            BytesIO: Excel 파일 바이너리
        """
        # 빈 템플릿 생성
        df = pd.DataFrame(columns=ExcelHandler.COLUMNS)
        
        # 예시 데이터 추가 (1행)
        example_data = {
            '카테고리코드': 'safety_helmet',
            '제품명': '안전모 예시',
            '모델번호': 'SH-001',
            '가격': 25000,
            '설명': '머리 보호를 위한 안전모',
            '사양': 'ABS 재질, KCS 인증',
            '재고상태': 'in_stock',
            '이미지경로': '/images/safety_helmet/example.jpg',
            '표시순서': 1,
            '추천제품': '예'
        }
        df = pd.concat([df, pd.DataFrame([example_data])], ignore_index=True)
        
        # Excel 파일로 변환
        output = BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='제품목록')
            
            # 시트 설명 추가
            worksheet = writer.sheets['제품목록']
            worksheet.column_dimensions['A'].width = 15
            worksheet.column_dimensions['B'].width = 30
            worksheet.column_dimensions['C'].width = 15
            worksheet.column_dimensions['D'].width = 12
            worksheet.column_dimensions['E'].width = 40
            worksheet.column_dimensions['F'].width = 40
            worksheet.column_dimensions['G'].width = 12
            worksheet.column_dimensions['H'].width = 40
            worksheet.column_dimensions['I'].width = 12
            worksheet.column_dimensions['J'].width = 12
        
        output.seek(0)
        return output
    
    @staticmethod
    async def export_products(db: Session, category_code: Optional[str] = None) -> BytesIO:
        """
        제품 데이터를 Excel로 내보내기
        
        Args:
            db: 데이터베이스 세션
            category_code: 카테고리 코드 (선택사항)
        
        Returns:
            BytesIO: Excel 파일 바이너리
        """
        # 제품 조회
        query = db.query(
            SafetyProduct.id,
            SafetyCategory.code.label('category_code'),
            SafetyCategory.name.label('category_name'),
            SafetyProduct.name,
            SafetyProduct.model_number,
            SafetyProduct.price,
            SafetyProduct.description,
            SafetyProduct.specifications,
            SafetyProduct.stock_status,
            SafetyProduct.file_path,
            SafetyProduct.display_order,
            SafetyProduct.is_featured,
            SafetyProduct.created_at,
            SafetyProduct.updated_at
        ).join(SafetyCategory, SafetyProduct.category_id == SafetyCategory.id)
        
        if category_code:
            query = query.filter(SafetyCategory.code == category_code)
        
        products = query.all()
        
        # DataFrame 생성
        data = []
        for p in products:
            data.append({
                'ID': p.id,
                '카테고리코드': p.category_code,
                '카테고리명': p.category_name,
                '제품명': p.name,
                '모델번호': p.model_number or '',
                '가격': p.price or 0,
                '설명': p.description or '',
                '사양': p.specifications or '',
                '재고상태': p.stock_status or 'in_stock',
                '이미지경로': p.file_path or '',
                '표시순서': p.display_order,
                '추천제품': '예' if p.is_featured else '아니오',
                '등록일': p.created_at.strftime('%Y-%m-%d %H:%M:%S') if p.created_at else '',
                '수정일': p.updated_at.strftime('%Y-%m-%d %H:%M:%S') if p.updated_at else ''
            })
        
        df = pd.DataFrame(data)
        
        # Excel 파일로 변환
        output = BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='제품목록')
            
            # 컬럼 너비 자동 조정
            worksheet = writer.sheets['제품목록']
            for column in worksheet.columns:
                max_length = 0
                column_letter = column[0].column_letter
                for cell in column:
                    try:
                        if len(str(cell.value)) > max_length:
                            max_length = len(str(cell.value))
                    except:
                        pass
                adjusted_width = min(max_length + 2, 50)
                worksheet.column_dimensions[column_letter].width = adjusted_width
        
        output.seek(0)
        return output
    
    @staticmethod
    async def import_products(
        file: UploadFile,
        db: Session,
        mode: str = 'append'
    ) -> Dict[str, Any]:
        """
        Excel 파일에서 제품 데이터 가져오기
        
        Args:
            file: 업로드된 Excel 파일
            db: 데이터베이스 세션
            mode: 'append' (추가) 또는 'replace' (전체 교체)
        
        Returns:
            Dict: 처리 결과 (성공/실패 개수, 에러 목록)
        """
        try:
            # Excel 파일 읽기
            content = await file.read()
            df = pd.read_excel(BytesIO(content))
            
            # 필수 컬럼 확인
            required_columns = ['카테고리코드', '제품명']
            missing_columns = [col for col in required_columns if col not in df.columns]
            if missing_columns:
                return {
                    'success': False,
                    'message': f'필수 컬럼이 없습니다: {", ".join(missing_columns)}',
                    'total': 0,
                    'success_count': 0,
                    'error_count': 0
                }
            
            # 카테고리 맵 생성 (코드 -> ID)
            categories = db.query(SafetyCategory).all()
            category_map = {cat.code: cat.id for cat in categories}
            
            # 'replace' 모드인 경우 기존 제품 전체 삭제
            if mode == 'replace':
                db.query(SafetyProduct).delete()
                db.commit()
            
            results = {
                'total': len(df),
                'success_count': 0,
                'error_count': 0,
                'errors': []
            }
            
            # 각 행 처리
            for idx, row in df.iterrows():
                try:
                    # 카테고리 확인
                    category_code = str(row.get('카테고리코드', '')).strip()
                    if not category_code or category_code not in category_map:
                        results['errors'].append({
                            'row': idx + 2,  # Excel 행 번호 (헤더 포함)
                            'error': f'유효하지 않은 카테고리 코드: {category_code}'
                        })
                        results['error_count'] += 1
                        continue
                    
                    # 제품명 확인
                    product_name = str(row.get('제품명', '')).strip()
                    if not product_name:
                        results['errors'].append({
                            'row': idx + 2,
                            'error': '제품명이 비어있습니다'
                        })
                        results['error_count'] += 1
                        continue
                    
                    # 추천제품 변환
                    is_featured = row.get('추천제품', '아니오')
                    if isinstance(is_featured, str):
                        is_featured = is_featured.strip() == '예'
                    else:
                        is_featured = bool(is_featured)
                    
                    # 제품 데이터 생성
                    product_data = {
                        'category_id': category_map[category_code],
                        'name': product_name,
                        'model_number': str(row.get('모델번호', '')).strip() or None,
                        'price': float(row.get('가격', 0)) if pd.notna(row.get('가격')) else None,
                        'description': str(row.get('설명', '')).strip() or None,
                        'specifications': str(row.get('사양', '')).strip() or None,
                        'stock_status': str(row.get('재고상태', 'in_stock')).strip(),
                        'file_path': str(row.get('이미지경로', '')).strip() or None,
                        'display_order': int(row.get('표시순서', 0)) if pd.notna(row.get('표시순서')) else 0,
                        'is_featured': is_featured
                    }
                    
                    # 제품 생성
                    product = SafetyProduct(**product_data)
                    db.add(product)
                    results['success_count'] += 1
                    
                except Exception as e:
                    results['errors'].append({
                        'row': idx + 2,
                        'error': str(e)
                    })
                    results['error_count'] += 1
            
            # 커밋
            db.commit()
            
            results['success'] = True
            results['message'] = f'총 {results["total"]}개 중 {results["success_count"]}개 성공, {results["error_count"]}개 실패'
            
            return results
            
        except Exception as e:
            db.rollback()
            return {
                'success': False,
                'message': f'파일 처리 중 오류: {str(e)}',
                'total': 0,
                'success_count': 0,
                'error_count': 0
            }
    
    @staticmethod
    def validate_excel_file(file: UploadFile) -> tuple[bool, str]:
        """
        Excel 파일 유효성 검사
        
        Args:
            file: 업로드된 파일
        
        Returns:
            tuple: (유효 여부, 메시지)
        """
        # 파일 확장자 확인
        allowed_extensions = ['.xlsx', '.xls']
        if not any(file.filename.endswith(ext) for ext in allowed_extensions):
            return False, '엑셀 파일만 업로드 가능합니다 (.xlsx, .xls)'
        
        # 파일 크기 확인 (10MB 제한)
        max_size = 10 * 1024 * 1024  # 10MB
        if file.size and file.size > max_size:
            return False, f'파일 크기가 너무 큽니다 (최대 10MB)'
        
        return True, 'OK'
