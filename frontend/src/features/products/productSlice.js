import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productService from '../../services/productService';

const initialState = {
  products: [],
  product: null,
  loading: false,
  error: null,
  success: false,
  topProducts: [],
  productsCount: 0,
  resultsPerPage: 0,
  filteredProductsCount: 0,
  categories: [],
  brands: [],
};

// Get All Products
const getProducts = createAsyncThunk(
  'products/getProducts',
  async (queryParams, { rejectWithValue }) => {
    try {
      const response = await productService.getProducts(queryParams);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Error fetching products'
      );
    }
  }
);

// Get Product Details
const getProductDetails = createAsyncThunk(
  'products/getProductDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await productService.getProductById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Error fetching product details'
      );
    }
  }
);

// Create Product (Admin)
const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      if (!user?.token) {
        throw new Error('User not authenticated');
      }
      const response = await productService.createProduct(productData, user.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Error creating product'
      );
    }
  }
);

// Update Product (Admin)
const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, productData }, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      if (!user?.token) {
        throw new Error('User not authenticated');
      }
      const response = await productService.updateProduct(
        id,
        productData,
        user.token
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Error updating product'
      );
    }
  }
);

// Delete Product (Admin)
const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      if (!user?.token) {
        throw new Error('User not authenticated');
      }
      await productService.deleteProduct(id, user.token);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Error deleting product'
      );
    }
  }
);

// Create Review
const createProductReview = createAsyncThunk(
  'products/createReview',
  async ({ productId, reviewData }, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      if (!user?.token) {
        throw new Error('User not authenticated');
      }
      const response = await productService.createProductReview(
        productId,
        reviewData,
        user.token
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Error creating review'
      );
    }
  }
);

// Get Top Products
const getTopProducts = createAsyncThunk(
  'products/getTopProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getTopProducts();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Error fetching top products'
      );
    }
  }
);

// Get Categories
const getCategories = createAsyncThunk(
  'products/getCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getCategories();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Error fetching categories'
      );
    }
  }
);

// Get Brands
const getBrands = createAsyncThunk(
  'products/getBrands',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getBrands();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Error fetching brands'
      );
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    resetProductState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearProductDetails: (state) => {
      state.product = null;
    },
  },
  extraReducers: (builder) => {
    // Get All Products
    builder.addCase(getProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload.products;
      state.productsCount = action.payload.productsCount;
      state.resultsPerPage = action.payload.resultsPerPage;
      state.filteredProductsCount = action.payload.filteredProductsCount;
    });
    builder.addCase(getProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Get Product Details
    builder.addCase(getProductDetails.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getProductDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.product = action.payload;
    });
    builder.addCase(getProductDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Create Product (Admin)
    builder.addCase(createProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(createProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.products = [action.payload, ...state.products];
    });
    builder.addCase(createProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    });

    // Update Product (Admin)
    builder.addCase(updateProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(updateProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.product = action.payload;
      state.products = state.products.map((product) =>
        product._id === action.payload._id ? action.payload : product
      );
    });
    builder.addCase(updateProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    });

    // Delete Product (Admin)
    builder.addCase(deleteProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.products = state.products.filter(
        (product) => product._id !== action.payload
      );
    });
    builder.addCase(deleteProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Create Review
    builder.addCase(createProductReview.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(createProductReview.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.product = action.payload;
      state.products = state.products.map((product) =>
        product._id === action.payload._id ? action.payload : product
      );
    });
    builder.addCase(createProductReview.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    });

    // Get Top Products
    builder.addCase(getTopProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getTopProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.topProducts = action.payload;
    });
    builder.addCase(getTopProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Get Categories
    builder.addCase(getCategories.fulfilled, (state, action) => {
      state.categories = action.payload;
    });

    // Get Brands
    builder.addCase(getBrands.fulfilled, (state, action) => {
      state.brands = action.payload;
    });
  },
});

export const { resetProductState, clearProductDetails } = productSlice.actions;

export {
  getProducts,
  getProductDetails,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  getCategories,
  getBrands,
};

export default productSlice.reducer;
