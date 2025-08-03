import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Pagination, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  TextField, 
  InputAdornment, 
  Button, 
  Chip,
  useTheme,
  useMediaQuery,
  Drawer,
  IconButton,
  Divider,
  Stack,
  Slider,
  FormControlLabel,
  Checkbox,
  Collapse
} from '@mui/material';
import { 
  FilterList as FilterListIcon, 
  Search as SearchIcon, 
  Close as CloseIcon,
  Tune as TuneIcon
} from '@mui/icons-material';
import { Product, Loader, Message, Meta } from '../components';
import { listProducts } from '../features/products/productSlice';

const categories = [
  'Electronics',
  'Clothing',
  'Home & Kitchen',
  'Books',
  'Toys',
  'Beauty',
  'Sports',
  'Automotive'
];

const ratings = [5, 4, 3, 2, 1];

const ProductListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Get query parameters
  const keyword = searchParams.get('keyword') || '';
  const pageNumber = searchParams.get('page') || 1;
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const rating = searchParams.get('rating') || '';
  const sort = searchParams.get('sort') || '';
  
  // State for mobile filters
  const [mobileOpen, setMobileOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState(category ? [category] : []);
  const [selectedRating, setSelectedRating] = useState(rating ? parseInt(rating) : null);
  const [searchKeyword, setSearchKeyword] = useState(keyword);
  
  // Get product list from Redux store
  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages, count } = productList;
  
  // Fetch products when component mounts or query params change
  useEffect(() => {
    const params = {
      page: pageNumber,
      keyword: keyword,
      category: category,
      minPrice: minPrice,
      maxPrice: maxPrice,
      rating: rating,
      sort: sort
    };
    
    dispatch(listProducts(params));
  }, [dispatch, pageNumber, keyword, category, minPrice, maxPrice, rating, sort]);
  
  // Update price range when min/max price changes
  useEffect(() => {
    setPriceRange([
      minPrice ? parseInt(minPrice) : 0,
      maxPrice ? parseInt(maxPrice) : 1000
    ]);
  }, [minPrice, maxPrice]);
  
  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateUrlParams({ keyword: searchKeyword, page: 1 });
  };
  
  // Handle page change
  const handlePageChange = (event, value) => {
    updateUrlParams({ page: value });
    window.scrollTo(0, 0);
  };
  
  // Handle sort change
  const handleSortChange = (e) => {
    updateUrlParams({ sort: e.target.value, page: 1 });
  };
  
  // Handle price range change
  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };
  
  // Apply price range filter
  const applyPriceFilter = () => {
    updateUrlParams({ 
      minPrice: priceRange[0] !== 0 ? priceRange[0] : '',
      maxPrice: priceRange[1] !== 1000 ? priceRange[1] : '',
      page: 1
    });
  };
  
  // Toggle category filter
  const toggleCategory = (category) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(newCategories);
    updateUrlParams({ 
      category: newCategories.length > 0 ? newCategories[0] : '',
      page: 1
    });
  };
  
  // Toggle rating filter
  const toggleRating = (rating) => {
    const newRating = selectedRating === rating ? null : rating;
    setSelectedRating(newRating);
    updateUrlParams({ 
      rating: newRating || '',
      page: 1
    });
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedRating(null);
    setPriceRange([0, 1000]);
    setSearchKeyword('');
    updateUrlParams({
      keyword: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      rating: '',
      sort: '',
      page: 1
    });
  };
  
  // Helper function to update URL parameters
  const updateUrlParams = (updates) => {
    const params = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    navigate(`/shop?${params.toString()}`, { replace: true });
  };
  
  // Filter sidebar content
  const filterSidebar = (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>Filters</Typography>
        <Button 
          onClick={clearFilters}
          size="small"
          sx={{ textTransform: 'none' }}
        >
          Clear all
        </Button>
      </Box>
      
      {/* Categories */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Categories</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {categories.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              onClick={() => toggleCategory(cat)}
              color={selectedCategories.includes(cat) ? 'primary' : 'default'}
              variant={selectedCategories.includes(cat) ? 'filled' : 'outlined'}
              size="small"
            />
          ))}
        </Box>
      </Box>
      
      {/* Price Range */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>Price Range</Typography>
        <Box sx={{ px: 1 }}>
          <Slider
            value={priceRange}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            aria-labelledby="range-slider"
            min={0}
            max={1000}
            step={10}
            valueLabelFormat={(value) => `$${value}`}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body2">${priceRange[0]}</Typography>
            <Typography variant="body2">${priceRange[1]}</Typography>
          </Box>
          <Button 
            fullWidth 
            variant="contained" 
            size="small"
            onClick={applyPriceFilter}
          >
            Apply Price
          </Button>
        </Box>
      </Box>
      
      {/* Ratings */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Customer Review</Typography>
        <Stack spacing={1}>
          {ratings.map((r) => (
            <Box 
              key={r}
              onClick={() => toggleRating(r)}
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                cursor: 'pointer',
                p: 0.5,
                borderRadius: 1,
                bgcolor: selectedRating === r ? 'action.selected' : 'transparent',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <Box sx={{ display: 'flex', mr: 1 }}>
                {[...Array(5)].map((_, i) => (
                  <Box 
                    key={i}
                    sx={{ 
                      color: i < r ? 'gold' : 'grey.400',
                      fontSize: '1.2rem',
                      lineHeight: 1,
                    }}
                  >
                    ★
                  </Box>
                ))}
              </Box>
              <Typography variant="body2" sx={{ ml: 1 }}>
                {r > 4 ? '5.0' : `${r} & Up`}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
  
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Meta title={category ? `${category} Products` : 'All Products'} />
      
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
          {category ? category : 'All Products'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {count} {count === 1 ? 'product' : 'products'} found
        </Typography>
      </Box>
      
      {/* Search and Filter Bar */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'stretch' : 'center',
          gap: 2,
          mb: 4,
        }}
      >
        {/* Search Input */}
        <Box 
          component="form" 
          onSubmit={handleSearchSubmit}
          sx={{ 
            flex: isMobile ? '0 0 auto' : 1,
            maxWidth: isMobile ? '100%' : '400px',
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search products..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchKeyword && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSearchKeyword('');
                      updateUrlParams({ keyword: '', page: 1 });
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        
        {/* Sort and Filter Buttons */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl 
            variant="outlined" 
            size="small" 
            sx={{ minWidth: 200 }}
          >
            <InputLabel id="sort-by-label">Sort By</InputLabel>
            <Select
              labelId="sort-by-label"
              id="sort-by"
              value={sort || 'featured'}
              onChange={handleSortChange}
              label="Sort By"
            >
              <MenuItem value="featured">Featured</MenuItem>
              <MenuItem value="price_asc">Price: Low to High</MenuItem>
              <MenuItem value="price_desc">Price: High to Low</MenuItem>
              <MenuItem value="rating_desc">Highest Rated</MenuItem>
              <MenuItem value="newest">Newest Arrivals</MenuItem>
            </Select>
          </FormControl>
          
          {isMobile && (
            <Button
              variant="outlined"
              startIcon={<TuneIcon />}
              onClick={() => setMobileOpen(true)}
              sx={{ minWidth: 'auto' }}
            >
              Filters
            </Button>
          )}
        </Box>
      </Box>
      
      <Grid container spacing={3}>
        {/* Filters Sidebar - Desktop */}
        {!isMobile && (
          <Grid item xs={12} md={3}>
            <Box 
              sx={{ 
                position: 'sticky',
                top: 20,
                borderRadius: 1,
                border: `1px solid ${theme.palette.divider}`,
                overflow: 'hidden',
              }}
            >
              {filterSidebar}
            </Box>
          </Grid>
        )}
        
        {/* Products Grid */}
        <Grid item xs={12} md={9}>
          {loading ? (
            <Loader />
          ) : error ? (
            <Message severity="error">{error}</Message>
          ) : (
            <>
              <Grid container spacing={3}>
                {products.map((product) => (
                  <Grid item xs={12} sm={6} lg={4} key={product._id}>
                    <Product product={product} />
                  </Grid>
                ))}
              </Grid>
              
              {/* Pagination */}
              {pages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 4 }}>
                  <Pagination
                    count={pages}
                    page={Number(page)}
                    onChange={handlePageChange}
                    color="primary"
                    size={isMobile ? 'small' : 'medium'}
                    showFirstButton
                    showLastButton
                    siblingCount={isMobile ? 0 : 1}
                  />
                </Box>
              )}
              
              {products.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No products found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try adjusting your search or filter to find what you're looking for.
                  </Typography>
                  <Button 
                    variant="outlined" 
                    sx={{ mt: 2 }}
                    onClick={clearFilters}
                  >
                    Clear all filters
                  </Button>
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>
      
      {/* Mobile Filters Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: '85%',
            maxWidth: 350,
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Filters</Typography>
          <IconButton onClick={() => setMobileOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        {filterSidebar}
      </Drawer>
    </Container>
  );
};

export default ProductListPage;
