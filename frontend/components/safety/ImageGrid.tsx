import React from 'react';
import { Grid, Card, CardContent, Typography, CardMedia, IconButton, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { SafetyItemsImage } from '@/types/safety';

interface ImageGridProps {
  images: SafetyItemsImage[];
  onDelete?: (imageId: number) => void;
  isAdmin?: boolean;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, onDelete, isAdmin = false }) => {
  return (
    <Grid container spacing={2}>
      {images.map((image) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={image.id}>
          <Card 
            sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}
          >
            <CardMedia
              component="img"
              sx={{
                height: 200,
                objectFit: 'cover'
              }}
              image={`/api/static/${image.file_path}`}
              alt={image.description || '안전장비 이미지'}
            />
            {isAdmin && onDelete && (
              <IconButton
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  }
                }}
                onClick={() => onDelete(image.id)}
              >
                <DeleteIcon />
              </IconButton>
            )}
            {image.description && (
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {image.description}
                </Typography>
              </CardContent>
            )}
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ImageGrid; 