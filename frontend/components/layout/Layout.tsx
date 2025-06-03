import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box, Button, useTheme, useMediaQuery } from '@mui/material';
import Link from 'next/link';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'white',
  boxShadow: 'none',
  borderBottom: '1px solid #eaeaea',
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 4),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0, 2),
  },
}));

const NavLinks = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(2),
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  color: '#333',
  fontSize: '0.9rem',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
  },
}));

const Footer = styled(Box)(({ theme }) => ({
  backgroundColor: '#f8f8f8',
  color: '#666',
  padding: theme.spacing(8, 0),
  marginTop: 'auto',
}));

const FooterContent = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const CompanyInfo = styled(Typography)(({ theme }) => ({
  fontSize: '0.9rem',
  lineHeight: 1.8,
}));

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <StyledAppBar position="sticky">
        <StyledToolbar>
          <Link href="/" passHref>
            <Typography
              variant="h6"
              component="div"
              sx={{
                cursor: 'pointer',
                color: '#333',
                fontWeight: 600,
                fontSize: isMobile ? '1.2rem' : '1.5rem',
              }}
            >
              보람안전
            </Typography>
          </Link>
          <NavLinks>
            <Link href="/about" passHref>
              <StyledButton>회사소개</StyledButton>
            </Link>
            <Link href="/products" passHref>
              <StyledButton>제품정보</StyledButton>
            </Link>
            <Link href="/inquiry" passHref>
              <StyledButton>문의하기</StyledButton>
            </Link>
          </NavLinks>
        </StyledToolbar>
      </StyledAppBar>

      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>

      <Footer>
        <FooterContent maxWidth="lg">
          <Typography variant="h6" sx={{ color: '#333', fontWeight: 600, mb: 2 }}>
            보람안전
          </Typography>
          <CompanyInfo>
            사업자등록번호: 000-00-00000
          </CompanyInfo>
          <CompanyInfo>
            주소: 경기도 시흥시 공단1대로 000번길 00
          </CompanyInfo>
          <CompanyInfo>
            전화: 031-000-0000 | 이메일: info@boramsafety.com
          </CompanyInfo>
          <CompanyInfo sx={{ mt: 2, color: '#999' }}>
            © {new Date().getFullYear()} 보람안전. All rights reserved.
          </CompanyInfo>
        </FooterContent>
      </Footer>
    </Box>
  );
};

export default Layout; 