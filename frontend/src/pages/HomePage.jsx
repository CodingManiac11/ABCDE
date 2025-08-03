import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme, useMediaQuery } from '@mui/material';
import { Carousel, Product, Loader, Message } from '../components';
import { listTopProducts } from '../features/products/productSlice';

const HomePage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const productTopRated = useSelector((state) => state.productTopRated);
  const { loading, error, products } = productTopRated;

  useEffect(() => {
    dispatch(listTopProducts());
  }, [dispatch]);

  return (
    <>
      <Carousel />
      
      <h1 style={{ margin: '2rem 0' }}>Featured Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message severity="error">{error}</Message>
      ) : (
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem'
          }}
        >
          {products.map((product) => (
            <div key={product._id} style={{ height: '100%' }}>
              <Product product={product} />
            </div>
          ))}
        </div>
      )}

      <div style={{ textAlign: 'center', margin: '3rem 0' }}>
        <Link 
          to="/shop" 
          style={{
            display: 'inline-block',
            padding: '0.8rem 2rem',
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '1.1rem',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
              transform: 'translateY(-2px)',
              boxShadow: theme.shadows[4]
            }
          }}
        >
          Shop Now
        </Link>
      </div>

      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '3rem 1rem',
        margin: '3rem 0',
        textAlign: 'center'
      }}>
        <h2>Why Choose Us?</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '2rem auto 0',
          padding: '0 1rem'
        }}>
          <div>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚚</div>
            <h3>Free Shipping</h3>
            <p>Free shipping on all orders over $100</p>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💳</div>
            <h3>Secure Payment</h3>
            <p>100% secure payment</p>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔒</div>
            <h3>24/7 Support</h3>
            <p>Dedicated support</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
