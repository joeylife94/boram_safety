import { FC } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import Image from 'next/image';
import { Product } from '@/types/product';

interface ProductDetailProps {
  product: Product;
}

export const ProductDetail: FC<ProductDetailProps> = ({ product }) => {
  return (
    <Paper elevation={0}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box position="relative" width="100%" height={400}>
            <Image
              src={product.image}
              alt={product.name}
              layout="fill"
              objectFit="contain"
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom>
            {product.name}
          </Typography>
          <Typography variant="h6" color="primary" gutterBottom>
            ₩{product.price.toLocaleString()}
          </Typography>
          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>
          
          <Typography variant="h6" gutterBottom>
            Features
          </Typography>
          <List>
            {product.features.map((feature, index) => (
              <ListItem key={index}>
                <ListItemText primary={feature} />
              </ListItem>
            ))}
          </List>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6" gutterBottom>
            Specifications
          </Typography>
          <List>
            {Object.entries(product.specifications).map(([key, value]) => (
              <ListItem key={key}>
                <ListItemText
                  primary={key}
                  secondary={value}
                />
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </Paper>
  );
}; 