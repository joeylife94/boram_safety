import React, { useState, useCallback } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useDropzone } from 'react-dropzone';

interface ImageUploadProps {
  categoryId: number;
  onUploadComplete: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ categoryId, onUploadComplete }) => {
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setUploading(true);
    const file = acceptedFiles[0];

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category_id', categoryId.toString());
      if (description) {
        formData.append('description', description);
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/safety/images`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setDescription('');
        onUploadComplete();
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
    } finally {
      setUploading(false);
    }
  }, [categoryId, description, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1,
  });

  return (
    <Box sx={{ mt: 2 }}>
      <TextField
        fullWidth
        label="이미지 설명"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.300',
          borderRadius: 1,
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: isDragActive ? 'action.hover' : 'background.paper',
        }}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <Typography>업로드 중...</Typography>
        ) : isDragActive ? (
          <Typography>이미지를 여기에 놓아주세요</Typography>
        ) : (
          <Typography>
            이미지를 드래그하여 놓거나 클릭하여 선택해주세요
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ImageUpload; 