import { getImageUrl } from '../../utils/image'

describe('Image Utils', () => {
  it('상대 경로를 절대 경로로 변환한다', () => {
    const relativePath = '/images/test.jpg'
    const result = getImageUrl(relativePath)
    
    expect(result).toContain('test.jpg')
  })

  it('빈 경로는 기본 이미지를 반환한다', () => {
    const result = getImageUrl('')
    
    expect(result).toContain('default')
  })

  it('null 경로는 기본 이미지를 반환한다', () => {
    const result = getImageUrl(null)
    
    expect(result).toContain('default')
  })

  it('undefined 경로는 기본 이미지를 반환한다', () => {
    const result = getImageUrl(undefined)
    
    expect(result).toContain('default')
  })
})
