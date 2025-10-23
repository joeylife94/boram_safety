import { FC } from 'react';
import { Product } from '@/types/product';
import SafeImage from '@/components/common/SafeImage';
import { getImageUrl } from '@/utils/image';

interface ProductDetailProps {
  product: Product;
}

export const ProductDetail: FC<ProductDetailProps> = ({ product }) => {
  const imageUrl = getImageUrl(product.image || '');
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="relative w-full h-96">
          <SafeImage
            src={imageUrl}
            alt={product.name}
            fill
            className="object-contain"
          />
        </div>
        
        {/* Content Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {product.name}
          </h1>
          <p className="text-2xl font-semibold text-blue-600 mb-4">
            ₩{product.price?.toLocaleString() || 'N/A'}
          </p>
          <p className="text-base text-gray-700 mb-6">
            {product.description}
          </p>
          
          {/* Features */}
          {product.features && product.features.length > 0 && (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                주요 특징
              </h2>
              <ul className="space-y-2 mb-6">
                {product.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
          
          <hr className="my-6 border-gray-200" />
          
          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                상세 사양
              </h2>
              <dl className="space-y-3">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <dt className="text-sm font-medium text-gray-900">{key}</dt>
                    <dd className="text-sm text-gray-600 mt-1">{value as string}</dd>
                  </div>
                ))}
              </dl>
            </>
          )}
        </div>
      </div>
    </div>
  );
}; 