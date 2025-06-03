import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { SafetyCategory, SafetyItemsImage } from '@/types/safety';
import { GetServerSideProps } from 'next';
import ImageGrid from '@/components/safety/ImageGrid';
import ImageUpload from '@/components/safety/ImageUpload';

const StyledGrid = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(1)
}));

interface AdminSafetyPageProps {
  categories: SafetyCategory[];
  images: { [key: string]: SafetyItemsImage[] };
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // Fetch categories
    const categoryRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/safety/categories`
    );
    const categories = await categoryRes.json();

    // Fetch images for each category
    const images: { [key: string]: SafetyItemsImage[] } = {};
    for (const category of categories) {
      const imagesRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/safety/images?category_id=${category.id}`
      );
      images[category.code] = await imagesRes.json();
    }

    return {
      props: {
        categories,
        images,
      },
    };
  } catch (error) {
    console.error('Failed to fetch data:', error);
    return {
      props: {
        categories: [],
        images: {},
      },
    };
  }
};

const AdminSafetyPage: React.FC<AdminSafetyPageProps> = ({ categories: initialCategories, images: initialImages }) => {
  const [categories, setCategories] = useState(initialCategories);
  const [images, setImages] = useState(initialImages);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', code: '', description: '' });

  const handleAddCategory = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/safety/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
      });

      if (res.ok) {
        const category = await res.json();
        setCategories([...categories, category]);
        setImages({ ...images, [category.code]: [] });
        setIsAddDialogOpen(false);
        setNewCategory({ name: '', code: '', description: '' });
      }
    } catch (error) {
      console.error('Failed to add category:', error);
    }
  };

  const handleDeleteImage = async (categoryCode: string, imageId: number) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/safety/images/${imageId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setImages({
          ...images,
          [categoryCode]: images[categoryCode].filter(img => img.id !== imageId),
        });
      }
    } catch (error) {
      console.error('Failed to delete image:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            안전 장비 관리
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsAddDialogOpen(true)}
          >
            카테고리 추가
          </Button>
        </Box>

        {categories.map((category) => (
          <Paper key={category.id} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              {category.name}
            </Typography>
            {category.description && (
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {category.description}
              </Typography>
            )}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1">
                코드: {category.code}
              </Typography>
              <Typography variant="subtitle1">
                등록된 이미지: {category.image_count}개
              </Typography>
            </Box>
            <ImageUpload categoryId={category.id} onUploadComplete={() => {}} />
            <Box sx={{ mt: 2 }}>
              <ImageGrid
                images={images[category.code]}
                onDelete={(imageId) => handleDeleteImage(category.code, imageId)}
                isAdmin
              />
            </Box>
          </Paper>
        ))}
      </Box>

      <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)}>
        <DialogTitle>새 카테고리 추가</DialogTitle>
        <DialogContent>
          <StyledGrid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="카테고리 이름"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="카테고리 코드"
                value={newCategory.code}
                onChange={(e) => setNewCategory({ ...newCategory, code: e.target.value })}
                helperText="영문 소문자와 언더스코어만 사용 가능"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="설명"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                multiline
                rows={3}
              />
            </Grid>
          </StyledGrid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddDialogOpen(false)}>취소</Button>
          <Button onClick={handleAddCategory} variant="contained" color="primary">
            추가
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminSafetyPage; 