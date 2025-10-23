import React, { useState } from 'react';
import Image from 'next/image';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackText?: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  onClick?: () => void;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  quality?: number;
}

/**
 * 안전한 이미지 컴포넌트 (Next.js Image 최적화 적용)
 * 이미지 로드 실패 시 자동으로 SVG placeholder를 표시합니다.
 * Next.js Image를 사용하여 자동 최적화, lazy loading, WebP 변환 등을 지원합니다.
 */
const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  fallbackText = '이미지 없음',
  width,
  height,
  style,
  onClick,
  priority = false,
  fill = false,
  sizes,
  quality = 75,
}) => {
  const [error, setError] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);

  // SVG placeholder 생성
  const generatePlaceholder = () => {
    const svgWidth = width || 400;
    const svgHeight = height || 300;
    const svg = `
      <svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f5f5f5"/>
        <text 
          x="50%" 
          y="50%" 
          text-anchor="middle" 
          dy=".3em" 
          fill="#666666" 
          font-family="Arial, sans-serif" 
          font-size="16"
        >${fallbackText}</text>
      </svg>
    `;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  };

  const handleError = () => {
    setError(true);
    setImgSrc(generatePlaceholder());
  };

  // fill 모드인 경우
  if (fill) {
    return (
      <div style={style} className={className} onClick={onClick}>
        <Image
          src={error ? imgSrc : src}
          alt={alt}
          fill
          sizes={sizes}
          quality={quality}
          priority={priority}
          onError={handleError}
          style={{ objectFit: 'contain' }}
        />
      </div>
    );
  }

  // 일반 모드 (width, height 지정)
  if (!width || !height) {
    // width/height가 없으면 일반 img 태그 사용
    return (
      <img
        src={error ? imgSrc : src}
        alt={alt}
        className={className}
        style={style}
        onError={handleError}
        onClick={onClick}
      />
    );
  }

  return (
    <Image
      src={error ? imgSrc : src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      quality={quality}
      priority={priority}
      sizes={sizes}
      onError={handleError}
      onClick={onClick}
    />
  );
};

export default SafeImage;
