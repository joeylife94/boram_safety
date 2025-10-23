import React from 'react'
import { render, screen } from '@testing-library/react'
import ProductCard from '../product/ProductCard'

describe('ProductCard', () => {
  const mockProduct = {
    id: 1,
    name: '테스트 안전모',
    model_number: 'TEST-001',
    price: 25000,
    description: '테스트용 안전모입니다',
    file_path: '/images/safety_helmet/test.jpg',
    category_id: 1,
    stock_status: 'in_stock',
    is_featured: 1,
  }

  it('제품 카드가 정상적으로 렌더링된다', () => {
    render(<ProductCard product={mockProduct} />)
    
    expect(screen.getByText('테스트 안전모')).toBeInTheDocument()
    expect(screen.getByText('TEST-001')).toBeInTheDocument()
  })

  it('가격이 올바르게 표시된다', () => {
    render(<ProductCard product={mockProduct} />)
    
    expect(screen.getByText(/25,000원/)).toBeInTheDocument()
  })

  it('재고 상태가 표시된다', () => {
    render(<ProductCard product={mockProduct} />)
    
    const stockElement = screen.getByText(/재고/)
    expect(stockElement).toBeInTheDocument()
  })

  it('이미지가 올바른 경로로 렌더링된다', () => {
    render(<ProductCard product={mockProduct} />)
    
    const images = screen.getAllByRole('img')
    const productImage = images.find(img => 
      img.getAttribute('src')?.includes('test.jpg')
    )
    expect(productImage).toBeDefined()
  })

  it('재고 없음 상태일 때 표시된다', () => {
    const outOfStockProduct = {
      ...mockProduct,
      stock_status: 'out_of_stock',
    }
    
    render(<ProductCard product={outOfStockProduct} />)
    
    expect(screen.getByText(/품절/)).toBeInTheDocument()
  })
})
