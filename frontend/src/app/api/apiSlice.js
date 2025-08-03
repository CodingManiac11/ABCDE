import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '../../config';

// Helper function to add auth token to headers
const addAuthHeader = (headers, { getState }) => {
  const token = getState().auth.user?.token;
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return headers;
};

// Create base query with base URL and auth headers
const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.user?.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
  credentials: 'include', // For cookies if using httpOnly cookies
});

// Create API slice
const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);
    
    // Handle 401 Unauthorized responses
    if (result.error?.status === 401) {
      // You can dispatch logout action here if needed
      // api.dispatch(logout());
      // Optionally clear the local storage
      // localStorage.removeItem('userInfo');
    }
    
    return result;
  },
  tagTypes: [
    'User',
    'Product',
    'Order',
    'Category',
    'Brand',
    'Review',
    'Cart',
    'Wishlist',
  ],
  endpoints: (builder) => ({
    // Auth Endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: '/api/users/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/api/users',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/api/users/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
    
    // User Endpoints
    getProfile: builder.query({
      query: () => '/api/users/profile',
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation({
      query: (userData) => ({
        url: '/api/users/profile',
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    
    // Product Endpoints
    getProducts: builder.query({
      query: ({ keyword = '', pageNumber = 1, category = '', minPrice = 0, maxPrice = 100000, rating = 0, sort = '' }) => ({
        url: '/api/products',
        params: { keyword, pageNumber, category, minPrice, maxPrice, rating, sort },
      }),
      providesTags: (result = [], error, arg) =>
        result.products
          ? [
              ...result.products.map(({ _id }) => ({ type: 'Product', id: _id })),
              'Product',
            ]
          : ['Product'],
    }),
    getProductDetails: builder.query({
      query: (id) => `/api/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    createProduct: builder.mutation({
      query: (productData) => ({
        url: '/api/products',
        method: 'POST',
        body: productData,
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...productData }) => ({
        url: `/api/products/${id}`,
        method: 'PUT',
        body: productData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/api/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
    createProductReview: builder.mutation({
      query: ({ productId, ...reviewData }) => ({
        url: `/api/products/${productId}/reviews`,
        method: 'POST',
        body: reviewData,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Product', id: productId },
        'Review',
      ],
    }),
    getTopProducts: builder.query({
      query: () => '/api/products/top',
      providesTags: ['Product'],
    }),
    
    // Order Endpoints
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: '/api/orders',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Order'],
    }),
    getOrderDetails: builder.query({
      query: (id) => `/api/orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    payOrder: builder.mutation({
      query: ({ orderId, paymentResult }) => ({
        url: `/api/orders/${orderId}/pay`,
        method: 'PUT',
        body: paymentResult,
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'Order', id: orderId },
      ],
    }),
    getMyOrders: builder.query({
      query: () => '/api/orders/myorders',
      providesTags: ['Order'],
    }),
    getOrders: builder.query({
      query: () => '/api/orders',
      providesTags: ['Order'],
    }),
    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `/api/orders/${orderId}/deliver`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, orderId) => [
        { type: 'Order', id: orderId },
      ],
    }),
    
    // Cart Endpoints
    getCart: builder.query({
      query: () => '/api/cart',
      providesTags: ['Cart'],
    }),
    addToCart: builder.mutation({
      query: ({ productId, qty }) => ({
        url: '/api/cart',
        method: 'POST',
        body: { productId, qty },
      }),
      invalidatesTags: ['Cart'],
    }),
    removeFromCart: builder.mutation({
      query: (productId) => ({
        url: `/api/cart/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
    updateCartItem: builder.mutation({
      query: ({ productId, qty }) => ({
        url: `/api/cart/${productId}`,
        method: 'PUT',
        body: { qty },
      }),
      invalidatesTags: ['Cart'],
    }),
    clearCart: builder.mutation({
      query: () => ({
        url: '/api/cart',
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
    
    // Wishlist Endpoints
    getWishlist: builder.query({
      query: () => '/api/wishlist',
      providesTags: ['Wishlist'],
    }),
    addToWishlist: builder.mutation({
      query: (productId) => ({
        url: '/api/wishlist',
        method: 'POST',
        body: { productId },
      }),
      invalidatesTags: ['Wishlist'],
    }),
    removeFromWishlist: builder.mutation({
      query: (productId) => ({
        url: `/api/wishlist/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Wishlist'],
    }),
    
    // Category Endpoints
    getCategories: builder.query({
      query: () => '/api/categories',
      providesTags: ['Category'],
    }),
    
    // Brand Endpoints
    getBrands: builder.query({
      query: () => '/api/brands',
      providesTags: ['Brand'],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  // Auth
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  
  // User
  useGetProfileQuery,
  useUpdateProfileMutation,
  
  // Products
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateProductReviewMutation,
  useGetTopProductsQuery,
  
  // Orders
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetMyOrdersQuery,
  useGetOrdersQuery,
  useDeliverOrderMutation,
  
  // Cart
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useUpdateCartItemMutation,
  useClearCartMutation,
  
  // Wishlist
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  
  // Categories & Brands
  useGetCategoriesQuery,
  useGetBrandsQuery,
} = apiSlice;

export default apiSlice;
