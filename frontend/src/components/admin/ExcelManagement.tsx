import { useState } from 'react'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface ExcelUploadResult {
  success: boolean
  message: string
  total: number
  success_count: number
  error_count: number
  errors?: Array<{
    row: number
    error: string
  }>
}

export default function ExcelManagement() {
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<ExcelUploadResult | null>(null)
  const [mode, setMode] = useState<'append' | 'replace'>('append')

  const handleDownloadTemplate = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/excel/template`, {
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `제품_업로드_템플릿_${new Date().toISOString().split('T')[0]}.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('템플릿 다운로드 실패:', error)
      alert('템플릿 다운로드에 실패했습니다')
    }
  }

  const handleExportProducts = async (categoryCode?: string) => {
    try {
      const url = categoryCode 
        ? `${API_URL}/api/admin/excel/export?category_code=${categoryCode}`
        : `${API_URL}/api/admin/excel/export`
      
      const response = await axios.get(url, {
        responseType: 'blob'
      })
      
      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = downloadUrl
      const filename = categoryCode 
        ? `제품_${categoryCode}_${new Date().toISOString().split('T')[0]}.xlsx`
        : `제품_전체_${new Date().toISOString().split('T')[0]}.xlsx`
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('제품 내보내기 실패:', error)
      alert('제품 내보내기에 실패했습니다')
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // 파일 확장자 확인
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      alert('Excel 파일만 업로드 가능합니다 (.xlsx, .xls)')
      return
    }

    // 파일 크기 확인 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('파일 크기가 너무 큽니다 (최대 10MB)')
      return
    }

    if (mode === 'replace' && !confirm('기존 제품 데이터를 모두 삭제하고 새로 업로드하시겠습니까?')) {
      return
    }

    setUploading(true)
    setUploadResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('mode', mode)

      const response = await axios.post<ExcelUploadResult>(
        `${API_URL}/api/admin/excel/import`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      setUploadResult(response.data)
      
      if (response.data.success) {
        alert(`업로드 완료!\n성공: ${response.data.success_count}개\n실패: ${response.data.error_count}개`)
      } else {
        alert(`업로드 실패: ${response.data.message}`)
      }
    } catch (error: any) {
      console.error('업로드 실패:', error)
      alert(error.response?.data?.detail || '파일 업로드에 실패했습니다')
    } finally {
      setUploading(false)
      // 파일 input 초기화
      event.target.value = ''
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">📊 Excel 일괄 관리</h2>

      {/* 템플릿 다운로드 섹션 */}
      <div className="mb-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-blue-900">📥 템플릿 다운로드</h3>
        <p className="text-sm text-gray-600 mb-4">
          제품 데이터를 입력할 수 있는 Excel 템플릿을 다운로드하세요.
        </p>
        <button
          onClick={handleDownloadTemplate}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          📄 템플릿 다운로드
        </button>
      </div>

      {/* 제품 내보내기 섹션 */}
      <div className="mb-8 p-4 bg-green-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-green-900">📤 제품 내보내기</h3>
        <p className="text-sm text-gray-600 mb-4">
          현재 등록된 제품 데이터를 Excel 파일로 다운로드하세요.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => handleExportProducts()}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            📊 전체 제품 내보내기
          </button>
          <button
            onClick={() => {
              const category = prompt('카테고리 코드를 입력하세요 (예: safety_helmet)')
              if (category) handleExportProducts(category)
            }}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            📂 카테고리별 내보내기
          </button>
        </div>
      </div>

      {/* 제품 가져오기 섹션 */}
      <div className="p-4 bg-orange-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-orange-900">📥 제품 가져오기</h3>
        <p className="text-sm text-gray-600 mb-4">
          Excel 파일에서 제품 데이터를 일괄 업로드하세요.
        </p>

        {/* 모드 선택 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            업로드 모드:
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="append"
                checked={mode === 'append'}
                onChange={(e) => setMode(e.target.value as 'append')}
                className="mr-2"
              />
              <span className="text-sm">추가 모드 (기존 데이터 유지)</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="replace"
                checked={mode === 'replace'}
                onChange={(e) => setMode(e.target.value as 'replace')}
                className="mr-2"
              />
              <span className="text-sm text-red-600 font-medium">교체 모드 (기존 데이터 삭제 ⚠️)</span>
            </label>
          </div>
        </div>

        {/* 파일 업로드 */}
        <div className="mb-4">
          <label className="block">
            <span className="sr-only">파일 선택</span>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              disabled={uploading}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-orange-600 file:text-white
                hover:file:bg-orange-700
                file:cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </label>
        </div>

        {uploading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
            <p className="mt-2 text-sm text-gray-600">업로드 중...</p>
          </div>
        )}

        {/* 업로드 결과 */}
        {uploadResult && (
          <div className={`mt-4 p-4 rounded-lg ${
            uploadResult.success ? 'bg-green-100 border border-green-400' : 'bg-red-100 border border-red-400'
          }`}>
            <h4 className={`font-semibold mb-2 ${
              uploadResult.success ? 'text-green-800' : 'text-red-800'
            }`}>
              {uploadResult.success ? '✅ 업로드 완료' : '❌ 업로드 실패'}
            </h4>
            <p className="text-sm mb-2">{uploadResult.message}</p>
            
            {uploadResult.success && (
              <div className="text-sm space-y-1">
                <p>• 전체: {uploadResult.total}개</p>
                <p className="text-green-700 font-medium">• 성공: {uploadResult.success_count}개</p>
                {uploadResult.error_count > 0 && (
                  <p className="text-red-700 font-medium">• 실패: {uploadResult.error_count}개</p>
                )}
              </div>
            )}

            {/* 에러 목록 */}
            {uploadResult.errors && uploadResult.errors.length > 0 && (
              <div className="mt-4 max-h-60 overflow-y-auto">
                <p className="text-sm font-semibold text-red-800 mb-2">에러 상세:</p>
                <div className="space-y-2">
                  {uploadResult.errors.map((error, idx) => (
                    <div key={idx} className="text-sm bg-white p-2 rounded border border-red-200">
                      <span className="font-medium">행 {error.row}:</span> {error.error}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 사용 안내 */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold mb-2 text-gray-700">💡 사용 안내</h4>
        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
          <li>먼저 템플릿을 다운로드하여 데이터를 입력하세요</li>
          <li>카테고리 코드는 정확히 입력해야 합니다 (예: safety_helmet, safety_gloves)</li>
          <li>추가 모드: 기존 제품을 유지하고 새로운 제품만 추가</li>
          <li>교체 모드: 모든 기존 제품을 삭제하고 업로드한 데이터로 교체</li>
          <li>최대 파일 크기: 10MB</li>
        </ul>
      </div>
    </div>
  )
}
