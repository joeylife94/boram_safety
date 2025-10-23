import React from 'react'
import { render, screen } from '@testing-library/react'
import { Header } from '../layout/Header'

describe('Header', () => {
  it('헤더가 정상적으로 렌더링된다', () => {
    render(<Header />)
    
    expect(screen.getByText('보람안전')).toBeInTheDocument()
  })

  it('로고 이미지가 표시된다', () => {
    render(<Header />)
    
    const logo = screen.getByAltText(/로고/)
    expect(logo).toBeInTheDocument()
  })

  it('네비게이션 링크가 표시된다', () => {
    render(<Header />)
    
    expect(screen.getByText('제품')).toBeInTheDocument()
    expect(screen.getByText('회사소개')).toBeInTheDocument()
  })
})
