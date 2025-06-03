import React from 'react';
import { Grid, Card, CardContent, Typography, CardMedia, Box } from '@mui/material';
import { SafetyCategory } from '@/types/safety';
import Link from 'next/link';

interface CategoryGridProps {
  categories: SafetyCategory[];
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
  return (
    <Grid container spacing={3}>
      {categories.map((category) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
          <Link href={`/safety/${category.code}`} passHref style={{ textDecoration: 'none' }}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: 3
                }
              }}
            >
              <CardMedia
                component="div"
                sx={{
                  pt: '75%',
                  position: 'relative',
                  backgroundColor: 'grey.200'
                }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2">
                  {category.name}
                </Typography>
                {category.description && (
                  <Typography variant="body2" color="text.secondary">
                    {category.description}
                  </Typography>
                )}
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" color="primary">
                    등록된 이미지: {category.image_count}개
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
};

export default CategoryGrid; 