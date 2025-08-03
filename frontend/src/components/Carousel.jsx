import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Box, Button, Typography } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const CarouselContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '500px',
  overflow: 'hidden',
  borderRadius: '8px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  marginBottom: '3rem',
  '@media (max-width: 900px)': {
    height: '400px',
  },
  '@media (max-width: 600px)': {
    height: '300px',
  },
});

const Slide = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'backgroundImage',
})(({ active, backgroundImage, theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  opacity: active ? 1 : 0,
  transition: 'opacity 0.5s ease-in-out',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  padding: '0 10%',
  color: '#fff',
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 1,
  },
}));

const SlideContent = styled(Box)({
  position: 'relative',
  zIndex: 2,
  maxWidth: '600px',
  textAlign: 'left',
});

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: '10px 30px',
  fontSize: '1rem',
  fontWeight: 'bold',
  textTransform: 'none',
  borderRadius: '30px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
  },
}));

const NavigationButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  color: '#fff',
  borderRadius: '50%',
  width: '50px',
  height: '50px',
  minWidth: 'auto',
  zIndex: 10,
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
}));

const slides = [
  {
    title: 'Summer Collection 2023',
    subtitle: 'Discover our new arrivals',
    description: 'Get up to 30% off on selected items',
    buttonText: 'Shop Now',
    buttonLink: '/shop?category=summer',
    backgroundImage: 'https://images.unsplash.com/photo-1445205170230-053b83016042?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80',
  },
  {
    title: 'Limited Time Offer',
    subtitle: 'Special Discount',
    description: 'Hurry up! Limited stock available',
    buttonText: 'View Deals',
    buttonLink: '/deals',
    backgroundImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
  },
  {
    title: 'New Arrivals',
    subtitle: 'Fresh from the runway',
    description: 'Explore the latest trends in fashion',
    buttonText: 'Explore',
    buttonLink: '/new-arrivals',
    backgroundImage: 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
  },
];

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const theme = useTheme();

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <CarouselContainer>
      {slides.map((slide, index) => (
        <Slide
          key={index}
          active={currentSlide === index}
          backgroundImage={slide.backgroundImage}
        >
          <SlideContent>
            <Typography 
              variant="h2" 
              component="h1" 
              sx={{ 
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                fontWeight: 'bold',
                mb: 1,
              }}
            >
              {slide.title}
            </Typography>
            <Typography 
              variant="h5" 
              component="h2"
              sx={{ 
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                mb: 2,
              }}
            >
              {slide.subtitle}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 3,
                fontSize: { xs: '1rem', sm: '1.1rem' },
              }}
            >
              {slide.description}
            </Typography>
            <StyledButton 
              variant="contained" 
              color="primary" 
              component={Link} 
              to={slide.buttonLink}
            >
              {slide.buttonText}
            </StyledButton>
          </SlideContent>
        </Slide>
      ))}

      <NavigationButton 
        onClick={prevSlide} 
        sx={{ left: '20px' }}
        aria-label="previous slide"
      >
        <KeyboardArrowLeft fontSize="large" />
      </NavigationButton>
      
      <NavigationButton 
        onClick={nextSlide} 
        sx={{ right: '20px' }}
        aria-label="next slide"
      >
        <KeyboardArrowRight fontSize="large" />
      </NavigationButton>

      <Box sx={{ 
        position: 'absolute', 
        bottom: '20px', 
        left: '50%', 
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '10px',
        zIndex: 10,
      }}>
        {slides.map((_, index) => (
          <Box
            key={index}
            onClick={() => setCurrentSlide(index)}
            sx={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: currentSlide === index ? theme.palette.primary.main : 'rgba(255, 255, 255, 0.5)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: theme.palette.primary.main,
                transform: 'scale(1.2)',
              },
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </Box>
    </CarouselContainer>
  );
};

export default Carousel;
