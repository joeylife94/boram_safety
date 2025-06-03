import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import ImageGrid from '@/components/safety/ImageGrid';
import { SafetyCategory, SafetyItemsImage } from '@/types/safety';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

interface CategoryPageProps {
  category: SafetyCategory;
  images: SafetyItemsImage[];
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const categoryRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/safety/categories`
    );
    const categories = await categoryRes.json();
    const category = categories.find((c: SafetyCategory) => c.code === params?.code);

    if (!category) {
      return {
        notFound: true,
      };
    }

    const imagesRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/safety/images?category_id=${category.id}`
    );
    const images = await imagesRes.json();

    return {
      props: {
        category,
        images,
      },
    };
  } catch (error) {
    console.error('Failed to fetch category data:', error);
    return {
      notFound: true,
    };
  }
};

const CategoryPage: React.FC<CategoryPageProps> = ({ category, images }) => {
  const router = useRouter();

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Button 
          onClick={() => router.back()} 
          sx={{ mb: 2 }}
          variant="text"
        >
          ← 뒤로 가기
        </Button>
        
        <Typography variant="h4" component="h1" gutterBottom>
          {category.name}
        </Typography>
        
        {category.description && (
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
            {category.description}
          </Typography>
        )}

        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            등록된 이미지 ({category.image_count}개)
          </Typography>
        </Box>

        <ImageGrid images={images} />
      </Box>
    </Container>
  );
};

export default CategoryPage; 