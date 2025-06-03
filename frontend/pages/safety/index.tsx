import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import CategoryGrid from '@/components/safety/CategoryGrid';
import { SafetyCategory } from '@/types/safety';
import { GetServerSideProps } from 'next';

interface SafetyPageProps {
  categories: SafetyCategory[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/safety/categories`);
    const categories = await res.json();
    
    return {
      props: {
        categories,
      },
    };
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return {
      props: {
        categories: [],
      },
    };
  }
};

const SafetyPage: React.FC<SafetyPageProps> = ({ categories }) => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          안전 장비 카테고리
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mb: 4 }}>
          다양한 안전 장비들을 카테고리별로 확인해보세요
        </Typography>
        <CategoryGrid categories={categories} />
      </Box>
    </Container>
  );
};

export default SafetyPage; 