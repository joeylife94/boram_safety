import React from 'react';
import { Container, Typography, Box, Grid, useTheme, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';

const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '60vh',
  minHeight: 400,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#f8f8f8',
  [theme.breakpoints.down('md')]: {
    height: '40vh',
    minHeight: 300,
  },
}));

const Section = styled(Box)(({ theme }) => ({
  padding: theme.spacing(10, 0),
  backgroundColor: '#fff',
  '&:nth-of-type(even)': {
    backgroundColor: '#f8f8f8',
  },
}));

const ValueCard = styled(Box)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(4),
  backgroundColor: '#fff',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-8px)',
  },
}));

const AboutPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const values = [
    {
      title: '품질 제일',
      description: '최고 품질의 안전용품만을 제공하여 작업자의 안전을 책임집니다.',
    },
    {
      title: '전문성',
      description: '풍부한 경험과 전문 지식을 바탕으로 최적의 솔루션을 제안합니다.',
    },
    {
      title: '신뢰성',
      description: '정직과 신뢰를 바탕으로 고객과의 관계를 소중히 합니다.',
    },
    {
      title: '혁신',
      description: '끊임없는 연구와 혁신으로 더 나은 안전 솔루션을 개발합니다.',
    },
  ];

  return (
    <>
      <HeroSection>
        <Container maxWidth="lg">
          <Typography 
            variant="h1" 
            sx={{ 
              fontSize: isMobile ? '2rem' : '3.5rem',
              fontWeight: 700,
              color: '#333',
              mb: 3,
            }}
          >
            About Us
          </Typography>
          <Typography 
            variant="h2" 
            sx={{ 
              fontSize: isMobile ? '1.2rem' : '1.5rem',
              fontWeight: 400,
              color: '#666',
              maxWidth: 600,
              lineHeight: 1.6,
            }}
          >
            보람안전은 작업자의 안전을 최우선으로 생각하며,
            최고 품질의 안전용품을 제공하는 전문 기업입니다.
          </Typography>
        </Container>
      </HeroSection>

      <Section>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontSize: isMobile ? '1.8rem' : '2.5rem',
                  fontWeight: 600,
                  color: '#333',
                  mb: 3,
                }}
              >
                우리의 미션
              </Typography>
              <Typography 
                sx={{ 
                  color: '#666',
                  fontSize: '1.1rem',
                  lineHeight: 1.8,
                }}
              >
                보람안전은 산업 현장의 안전을 책임지는 파트너로서,
                최고 품질의 안전용품과 전문적인 서비스를 제공하여
                모든 작업자가 안전하고 건강한 작업 환경에서 일할 수 있도록 합니다.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontSize: isMobile ? '1.8rem' : '2.5rem',
                  fontWeight: 600,
                  color: '#333',
                  mb: 3,
                }}
              >
                우리의 비전
              </Typography>
              <Typography 
                sx={{ 
                  color: '#666',
                  fontSize: '1.1rem',
                  lineHeight: 1.8,
                }}
              >
                산업 안전의 새로운 기준을 제시하고,
                혁신적인 안전 솔루션을 통해 
                더 안전한 작업 환경을 만들어가는 
                글로벌 리더가 되는 것을 목표로 합니다.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Section>

      <Section>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            align="center"
            sx={{ 
              fontSize: isMobile ? '1.8rem' : '2.5rem',
              fontWeight: 600,
              color: '#333',
              mb: 6,
            }}
          >
            핵심 가치
          </Typography>
          <Grid container spacing={4}>
            {values.map((value, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <ValueCard>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontSize: '1.5rem',
                      fontWeight: 600,
                      color: '#333',
                      mb: 2,
                    }}
                  >
                    {value.title}
                  </Typography>
                  <Typography 
                    sx={{ 
                      color: '#666',
                      lineHeight: 1.6,
                    }}
                  >
                    {value.description}
                  </Typography>
                </ValueCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Section>

      <Section>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            sx={{ 
              fontSize: isMobile ? '1.8rem' : '2.5rem',
              fontWeight: 600,
              color: '#333',
              mb: 4,
            }}
          >
            연락처
          </Typography>
          <Box sx={{ maxWidth: 600 }}>
            <Typography 
              sx={{ 
                color: '#666',
                fontSize: '1.1rem',
                mb: 2,
                lineHeight: 1.8,
              }}
            >
              문의사항이 있으시다면 언제든 연락주세요.
              전문 상담원이 친절하게 답변해드리겠습니다.
            </Typography>
            <Typography sx={{ color: '#333', fontSize: '1.1rem', fontWeight: 500 }}>
              전화: 031-000-0000
            </Typography>
            <Typography sx={{ color: '#333', fontSize: '1.1rem', fontWeight: 500 }}>
              이메일: info@boramsafety.com
            </Typography>
            <Typography sx={{ color: '#333', fontSize: '1.1rem', fontWeight: 500 }}>
              주소: 경기도 시흥시 공단1대로 000번길 00
            </Typography>
          </Box>
        </Container>
      </Section>
    </>
  );
};

export default AboutPage; 