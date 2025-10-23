import { FC } from 'react';
import { useRouter } from 'next/router';
import { Product } from '@/types/product';
import SafeImage from '@/components/common/SafeImage';
import { getImageUrl } from '@/utils/image';

interface ProductCardProps {
  product: Product;
  href: string;
}

export const ProductCard: FC<ProductCardProps> = ({ product, href }) => {
  const router = useRouter();
  const imageUrl = getImageUrl(product.image || '');

  return (
    <div 
      className="h-full flex flex-col cursor-pointer bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
      onClick={() => router.push(href)}
    >
      <div className="relative w-full h-48 p-4">
        <SafeImage
          src={imageUrl}
          alt={product.name}
          fill
          className="object-contain"
        />
      </div>
      <div className="flex-grow p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-2 truncate">
          {product.name}
        </h2>
        <p className="text-sm text-gray-600 mb-3 overflow-hidden line-clamp-2">
          {product.description}
        </p>
        <div className="mt-4">
          <p className="text-xl font-bold text-blue-600">
            ₩{product.price?.toLocaleString() || 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
}; 