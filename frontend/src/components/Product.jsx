import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button, 
  Box, 
  Rating,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ShoppingCart, Favorite, FavoriteBorder } from '@mui/icons-material';
import { addToCart } from '../features/cart/cartSlice';
import { toggleWishlist } from '../features/wishlist/wishlistSlice';

const ProductCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
  position: 'relative',
  overflow: 'visible',
}));

const ProductMedia = styled(CardMedia)({
  height: 0,
  paddingTop: '100%', // 1:1 Aspect Ratio
  position: 'relative',
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  backgroundColor: '#f8f9fa',
  '&:hover .product-actions': {
    opacity: 1,
  },
});

const ProductActions = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '10px',
  right: '10px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  opacity: 0,
  transition: 'opacity 0.3s ease',
  zIndex: 2,
  [theme.breakpoints.down('sm')]: {
    opacity: 1, // Always show on mobile
  },
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'white',
  boxShadow: theme.shadows[2],
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
    transform: 'scale(1.1)',
  },
  transition: 'all 0.2s ease',
}));

const Product = ({ product }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { userInfo } = useSelector((state) => state.auth);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  
  const isInWishlist = wishlistItems.some((item) => item._id === product._id);
  
  const addToCartHandler = () => {
    if (!userInfo) {
      // Redirect to login or show login modal
      return;
    }
    dispatch(addToCart({ id: product._id, qty: 1 }));
  };
  
  const toggleWishlistHandler = () => {
    if (!userInfo) {
      // Redirect to login or show login modal
      return;
    }
    dispatch(toggleWishlist(product));
  };

  return (
    <ProductCard elevation={3}>
      <Box sx={{ position: 'relative' }}>
        <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <ProductMedia
            image={product.image || '/images/default-product.png'}
            title={product.name}
          />
        </Link>
        
        <ProductActions className="product-actions">
          <Tooltip title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'} arrow>
            <ActionButton 
              size="small" 
              onClick={toggleWishlistHandler}
              aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {isInWishlist ? (
                <Favorite color="error" fontSize={isMobile ? 'medium' : 'small'} />
              ) : (
                <FavoriteBorder fontSize={isMobile ? 'medium' : 'small'} />
              )}
            </ActionButton>
          </Tooltip>
        </ProductActions>
      </Box>
      
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}
          >
            {product.category}
          </Typography>
          <Rating 
            value={product.rating || 0} 
            precision={0.5} 
            readOnly 
            size={isMobile ? 'medium' : 'small'}
          />
        </Box>
        
        <Typography 
          gutterBottom 
          variant="h6" 
          component="h3" 
          sx={{
            fontWeight: 600,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '3rem',
            mb: 1,
          }}
        >
          {product.name}
        </Typography>
        
        <Box sx={{ mt: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
              ${product.price?.toFixed(2)}
            </Typography>
            {product.countInStock > 0 ? (
              <Typography variant="body2" color="success.main" sx={{ fontWeight: 500 }}>
                In Stock
              </Typography>
            ) : (
              <Typography variant="body2" color="error" sx={{ fontWeight: 500 }}>
                Out of Stock
              </Typography>
            )}
          </Box>
          
          <Button
            fullWidth
            variant="contained"
            startIcon={<ShoppingCart />}
            onClick={addToCartHandler}
            disabled={product.countInStock === 0}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              py: 1,
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: theme.shadows[4],
              },
              transition: 'all 0.2s ease',
            }}
          >
            {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </Box>
      </CardContent>
    </ProductCard>
  );
};

export default Product;
