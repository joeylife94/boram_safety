import React, { useState } from 'react';
import { Container, Typography, Box, Grid, TextField, Button, useTheme, useMediaQuery, Snackbar, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';

const ContactForm = styled('form')(({ theme }) => ({
  width: '100%',
  maxWidth: 800,
  margin: '0 auto',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiOutlinedInput-root': {
    borderRadius: 0,
    '&.Mui-focused fieldset': {
      borderColor: '#000',
    },
  },
}));

interface InquiryForm {
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
}

const ContactPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<InquiryForm>({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to submit inquiry');

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box sx={{ py: 6, backgroundColor: '#f8f8f8' }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h1" 
            align="center"
            sx={{ 
              fontSize: isMobile ? '2rem' : '3rem',
              fontWeight: 700,
              mb: 2,
              color: '#333',
            }}
          >
            문의하기
          </Typography>
          <Typography 
            align="center"
            sx={{ 
              fontSize: '1.1rem',
              color: '#666',
              mb: 6,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            제품 문의나 견적 요청 등 궁금하신 사항이 있으시면 
            아래 양식을 작성해 주세요.
          </Typography>

          <ContactForm onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="이름"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="회사명"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="이메일"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="연락처"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="제목"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="문의내용"
                  name="message"
                  multiline
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                  sx={{ 
                    mt: 2,
                    backgroundColor: '#333',
                    '&:hover': { backgroundColor: '#000' },
                    borderRadius: 0,
                    py: 2,
                  }}
                >
                  {loading ? '전송 중...' : '문의하기'}
                </Button>
              </Grid>
            </Grid>
          </ContactForm>
        </Container>
      </Box>

      <Box sx={{ py: 8, backgroundColor: '#fff' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 2, color: '#333' }}>
                전화 문의
              </Typography>
              <Typography sx={{ color: '#666' }}>
                031-000-0000
              </Typography>
              <Typography sx={{ color: '#666' }}>
                평일 09:00 - 18:00
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 2, color: '#333' }}>
                이메일 문의
              </Typography>
              <Typography sx={{ color: '#666' }}>
                info@boramsafety.com
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 2, color: '#333' }}>
                주소
              </Typography>
              <Typography sx={{ color: '#666' }}>
                경기도 시흥시 공단1대로 000번길 00
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Snackbar 
        open={success} 
        autoHideDuration={6000} 
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          문의가 성공적으로 전송되었습니다.
        </Alert>
      </Snackbar>

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ContactPage; 