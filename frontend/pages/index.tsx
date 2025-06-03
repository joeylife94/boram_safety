import React from 'react';
import { Container, Typography, Box, Grid, Button, Card, CardContent, CardMedia, useTheme, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import Image from 'next/image';

const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '80vh',
  minHeight: 600,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#f8f8f8',
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    height: '60vh',
    minHeight: 400,
  },
}));

const CategoryCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s, box-shadow 0.2s',
  cursor: 'pointer',
  backgroundColor: '#f8f8f8',
  boxShadow: 'none',
  borderRadius: 0,
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[4],
  },
}));

const FeatureSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(10, 0),
  backgroundColor: '#fff',
}));

const categories = [
  { id: 'safety_helmet', name: '안전모', image: '/backend/static/images/safety_helmet/thumbnail.jpg' },
  { id: 'safety_gloves', name: '안전장갑', image: '/backend/static/images/safety_gloves/thumbnail.jpg' },
  { id: 'safety_boots', name: '안전화', image: '/backend/static/images/safety_boots/thumbnail.jpg' },
  { id: 'safety_belt', name: '안전벨트', image: '/backend/static/images/safety_belt/thumbnail.jpg' },
  { id: 'respiratory_protection', name: '호흡보호구', image: '/backend/static/images/respiratory_protection/thumbnail.jpg' },
  { id: 'protective_clothing', name: '보호복', image: '/backend/static/images/protective_clothing/thumbnail.jpg' },
  { id: 'musculoskeletal_protection', name: '근골격계보호구', image: '/backend/static/images/musculoskeletal_protection/thumbnail.jpg' },
  { id: 'leg_protection', name: '다리보호구', image: '/backend/static/images/leg_protection/thumbnail.jpg' },
  { id: 'hearing_protection', name: '청력보호구', image: '/backend/static/images/hearing_protection/thumbnail.jpg' },
  { id: 'face_protection', name: '안면보호구', image: '/backend/static/images/face_protection/thumbnail.jpg' },
  { id: 'others', name: '기타용품', image: '/backend/static/images/others/thumbnail.jpg' },
];

const features = [
  {
    title: '품질 보증',
    description: '모든 제품은 엄격한 품질 검사를 거쳐 제공됩니다.',
    image: '/backend/static/images/features/quality.jpg',
  },
  {
    title: '전문 상담',
    description: '전문가의 상세한 상담으로 최적의 제품을 추천해드립니다.',
    image: '/backend/static/images/features/consulting.jpg',
  },
  {
    title: '빠른 납품',
    description: '필요한 시점에 맞춰 신속하게 납품해드립니다.',
    image: '/backend/static/images/features/delivery.jpg',
  },
];

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <HeroSection>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ maxWidth: 600 }}>
            <Typography 
              variant="h1" 
              sx={{ 
                fontSize: isMobile ? '2.5rem' : '4rem',
                fontWeight: 700,
                mb: 3,
                color: '#333',
              }}
            >
              안전한 작업환경의 시작
            </Typography>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: isMobile ? '1.2rem' : '1.5rem',
                fontWeight: 400,
                mb: 4,
                color: '#666',
                lineHeight: 1.6,
              }}
            >
              보람안전은 최고의 품질과 서비스로 
              작업자의 안전을 책임지겠습니다.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Link href="/products" passHref>
                <Button 
                  variant="contained" 
                  size="large"
                  sx={{ 
                    backgroundColor: '#333',
                    '&:hover': { backgroundColor: '#000' },
                    borderRadius: 0,
                    px: 4,
                  }}
                >
                  제품 보기
                </Button>
              </Link>
              <Link href="/about" passHref>
                <Button 
                  variant="outlined" 
                  size="large"
                  sx={{ 
                    color: '#333',
                    borderColor: '#333',
                    '&:hover': { borderColor: '#000', backgroundColor: 'transparent' },
                    borderRadius: 0,
                    px: 4,
                  }}
                >
                  회사 소개
                </Button>
              </Link>
            </Box>
          </Box>
        </Container>
      </HeroSection>

      <Box sx={{ py: 10, backgroundColor: '#fff' }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h2" 
            align="center" 
            sx={{ 
              fontSize: isMobile ? '1.8rem' : '2.5rem',
              fontWeight: 600,
              mb: 6,
              color: '#333',
            }}
          >
            제품 카테고리
          </Typography>
          <Grid container spacing={3}>
            {categories.map((category) => (
              <Grid item xs={6} sm={4} md={3} key={category.id}>
                <Link href={`/products?category=${category.id}`} passHref>
                  <CategoryCard>
                    <CardMedia
                      component="img"
                      height="200"
                      image={category.image}
                      alt={category.name}
                      sx={{ backgroundColor: '#f8f8f8' }}
                    />
                    <CardContent sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ fontSize: '1.1rem', color: '#333' }}>
                        {category.name}
                      </Typography>
                    </CardContent>
                  </CategoryCard>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <FeatureSection>
        <Container maxWidth="lg">
          <Typography 
            variant="h2" 
            align="center" 
            sx={{ 
              fontSize: isMobile ? '1.8rem' : '2.5rem',
              fontWeight: 600,
              mb: 6,
              color: '#333',
            }}
          >
            보람안전의 특별함
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ 
                  height: '100%', 
                  boxShadow: 'none', 
                  backgroundColor: 'transparent'
                }}>
                  <CardMedia
                    component="img"
                    height="300"
                    image={feature.image}
                    alt={feature.title}
                    sx={{ backgroundColor: '#f8f8f8' }}
                  />
                  <CardContent sx={{ p: 3 }}>
                    <Typography 
                      gutterBottom 
                      variant="h5" 
                      sx={{ 
                        fontSize: '1.5rem',
                        fontWeight: 600,
                        color: '#333',
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography sx={{ color: '#666' }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </FeatureSection>
    </>
  );
};

export default HomePage; 