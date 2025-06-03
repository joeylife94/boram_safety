import React from 'react';
import { Container, Typography, Box, Grid, Button, useTheme, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import Image from 'next/image';

const ProductImage = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '500px',
  position: 'relative',
  backgroundColor: '#f8f8f8',
  [theme.breakpoints.down('md')]: {
    height: '400px',
  },
  [theme.breakpoints.down('sm')]: {
    height: '300px',
  },
}));

interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  image_url: string;
  price: number;
  stock: number;
  specifications: string;
}

interface Props {
  product: Product;
}

export async function getServerSideProps({ params }: { params: { id: string } }) {
  try {
    const res = await fetch(`http://localhost:8000/api/v1/products/${params.id}`);
    if (!res.ok) throw new Error('Failed to fetch product');
    
    const product = await res.json();
    return { props: { product } };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}

const ProductDetailPage = ({ product }: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const specifications = product.specifications ? JSON.parse(product.specifications) : {};

  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <ProductImage>
              <Image
                src={product.image_url}
                alt={product.name}
                layout="fill"
                objectFit="cover"
              />
            </ProductImage>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography 
              variant="h1" 
              sx={{ 
                fontSize: isMobile ? '1.8rem' : '2.5rem',
                fontWeight: 600,
                mb: 2,
                color: '#333',
              }}
            >
              {product.name}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                fontSize: '1.1rem',
                color: '#666',
                mb: 4,
                lineHeight: 1.8,
              }}
            >
              {product.description}
            </Typography>

            {Object.entries(specifications).length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography 
                  variant="h2" 
                  sx={{ 
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    mb: 2,
                    color: '#333',
                  }}
                >
                  제품 스펙
                </Typography>
                {Object.entries(specifications).map(([key, value]) => (
                  <Box key={key} sx={{ display: 'flex', mb: 1 }}>
                    <Typography sx={{ minWidth: 120, color: '#666' }}>
                      {key}
                    </Typography>
                    <Typography sx={{ color: '#333' }}>
                      {value as string}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}

            <Button 
              variant="contained"
              size="large"
              fullWidth
              sx={{ 
                backgroundColor: '#333',
                '&:hover': { backgroundColor: '#000' },
                borderRadius: 0,
                py: 2,
              }}
              onClick={() => window.location.href = 'tel:031-000-0000'}
            >
              문의하기
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProductDetailPage; 