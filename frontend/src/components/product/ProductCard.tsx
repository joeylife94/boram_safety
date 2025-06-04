import { FC } from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import { useRouter } from 'next/router';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  href: string;
}

export const ProductCard: FC<ProductCardProps> = ({ product, href }) => {
  const router = useRouter();

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 6
        }
      }}
      onClick={() => router.push(href)}
    >
      <CardMedia
        component="img"
        height="200"
        image={product.image}
        alt={product.name}
        sx={{ objectFit: 'contain', p: 2 }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="h2" noWrap>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}>
          {product.description}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" color="primary">
            ₩{product.price.toLocaleString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}; 