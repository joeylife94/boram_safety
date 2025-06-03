import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Box, Grid, TextField, Card, CardContent, CardMedia, useTheme, useMediaQuery, CircularProgress, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import debounce from 'lodash/debounce';

const SearchContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4, 0),
  backgroundColor: '#fff',
  borderBottom: '1px solid #eaeaea',
}));

const SearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 0,
    backgroundColor: '#f8f8f8',
    '& fieldset': {
      borderColor: 'transparent',
    },
    '&:hover fieldset': {
      borderColor: '#000',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#000',
    },
  },
}));

const ProductCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s',
  cursor: 'pointer',
  boxShadow: 'none',
  borderRadius: 0,
  backgroundColor: 'transparent',
  '&:hover': {
    transform: 'translateY(-8px)',
  },
}));

const ProductImage = styled(CardMedia)(({ theme }) => ({
  height: 300,
  backgroundColor: '#f8f8f8',
  [theme.breakpoints.down('sm')]: {
    height: 200,
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

const categories = [
  { id: 'all', name: '전체' },
  { id: 'safety_helmet', name: '안전모' },
  { id: 'safety_gloves', name: '안전장갑' },
  { id: 'safety_boots', name: '안전화' },
  { id: 'safety_belt', name: '안전벨트' },
  { id: 'respiratory_protection', name: '호흡보호구' },
  { id: 'protective_clothing', name: '보호복' },
  { id: 'musculoskeletal_protection', name: '근골격계보호구' },
  { id: 'leg_protection', name: '다리보호구' },
  { id: 'hearing_protection', name: '청력보호구' },
  { id: 'face_protection', name: '안면보호구' },
  { id: 'others', name: '기타용품' },
];

const ProductsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const { category: categoryParam } = router.query;

  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam as string || 'all');

  // 디바운스된 검색 함수
  const debouncedSearch = useCallback(
    debounce((term: string, category: string) => {
      fetchProducts(term, category);
    }, 300),
    []
  );

  const fetchProducts = async (search: string, category: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams();
      if (category && category !== 'all') queryParams.append('category', category);
      if (search) queryParams.append('search', search);
      
      const response = await fetch(`/api/v1/products?${queryParams.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    debouncedSearch(searchTerm, selectedCategory);
    
    // URL 업데이트
    const params = new URLSearchParams(window.location.search);
    if (selectedCategory && selectedCategory !== 'all') {
      params.set('category', selectedCategory);
    } else {
      params.delete('category');
    }
    if (searchTerm) {
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }
    
    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.replaceState({}, '', newUrl);
  }, [searchTerm, selectedCategory]);

  return (
    <>
      <Box sx={{ py: 4, backgroundColor: '#f8f8f8' }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h1" 
              sx={{ 
                fontSize: isMobile ? '1.8rem' : '2.5rem',
                fontWeight: 600,
                mb: 3,
                color: '#333',
              }}
            >
              제품 목록
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="제품명을 입력하세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ 
                maxWidth: 600,
                backgroundColor: '#fff',
                '& .MuiOutlinedInput-root': {
                  borderRadius: 0,
                },
              }}
            />
          </Box>

          <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {categories.map((cat) => (
              <Chip
                key={cat.id}
                label={cat.name}
                onClick={() => setSelectedCategory(cat.id)}
                color={selectedCategory === cat.id ? 'primary' : 'default'}
                sx={{ 
                  borderRadius: 1,
                  backgroundColor: selectedCategory === cat.id ? '#333' : '#fff',
                  '&:hover': {
                    backgroundColor: selectedCategory === cat.id ? '#000' : '#f0f0f0',
                  },
                }}
              />
            ))}
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" align="center" sx={{ py: 8 }}>
              {error}
            </Typography>
          ) : products.length === 0 ? (
            <Typography align="center" sx={{ py: 8, color: '#666' }}>
              검색 결과가 없습니다.
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {products.map((product) => (
                <Grid item xs={6} sm={4} md={3} key={product.id}>
                  <ProductCard onClick={() => router.push(`/products/${product.id}`)}>
                    <ProductImage
                      image={product.image_url}
                      title={product.name}
                    />
                    <CardContent sx={{ p: 2, pt: 3 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontSize: '1rem',
                          fontWeight: 500,
                          color: '#333',
                        }}
                      >
                        {product.name}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mt: 1,
                          color: '#666',
                          fontSize: '0.9rem',
                        }}
                      >
                        {product.description}
                      </Typography>
                    </CardContent>
                  </ProductCard>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </>
  );
};

export default ProductsPage; 