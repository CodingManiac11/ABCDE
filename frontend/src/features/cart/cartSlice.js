import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartService from '../../services/cartService';
import { STORAGE_KEYS } from '../../config';

// Get cart from localStorage if exists
const getCartFromStorage = () => {
  if (typeof window !== 'undefined') {
    const cart = localStorage.getItem(STORAGE_KEYS.CART);
    return cart ? JSON.parse(cart) : null;
  }
  return null;
};

const initialState = {
  cart: getCartFromStorage(),
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
  shippingAddress: {},
  paymentMethod: 'paypal', // Default payment method
};

// Get cart from backend
const getCart = createAsyncThunk('cart/getCart', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user?.token;
    if (!token) {
      return thunkAPI.rejectWithValue('No authentication token found');
    }
    return await cartService.getCart(token);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Add to cart
const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, qty }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      if (!token) {
        // Handle guest cart in localStorage
        const item = { productId, quantity: qty };
        const existingCart = getCartFromStorage() || { items: [] };
        const existingItemIndex = existingCart.items.findIndex(
          (item) => item.productId === productId
        );

        if (existingItemIndex >= 0) {
          existingCart.items[existingItemIndex].quantity += qty;
        } else {
          existingCart.items.push(item);
        }

        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(existingCart));
        return existingCart;
      }
      
      // For authenticated users
      return await cartService.addToCart(productId, qty, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update cart item quantity
const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, qty }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      if (!token) {
        // Handle guest cart in localStorage
        const existingCart = getCartFromStorage();
        if (existingCart) {
          const itemIndex = existingCart.items.findIndex(
            (item) => item._id === itemId
          );
          if (itemIndex >= 0) {
            existingCart.items[itemIndex].quantity = qty;
            localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(existingCart));
            return existingCart;
          }
        }
        return thunkAPI.rejectWithValue('Cart item not found');
      }
      
      // For authenticated users
      return await cartService.updateCartItem(itemId, qty, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Remove from cart
const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      if (!token) {
        // Handle guest cart in localStorage
        const existingCart = getCartFromStorage();
        if (existingCart) {
          existingCart.items = existingCart.items.filter(
            (item) => item._id !== itemId
          );
          localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(existingCart));
          return existingCart;
        }
        return thunkAPI.rejectWithValue('Cart not found');
      }
      
      // For authenticated users
      return await cartService.removeFromCart(itemId, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Clear cart
const clearCart = createAsyncThunk('cart/clearCart', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user?.token;
    if (!token) {
      // Clear guest cart from localStorage
      localStorage.removeItem(STORAGE_KEYS.CART);
      return { items: [] };
    }
    
    // For authenticated users
    return await cartService.clearCart(token);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Save shipping address
const saveShippingAddress = createAsyncThunk(
  'cart/saveShippingAddress',
  (address) => {
    localStorage.setItem('shippingAddress', JSON.stringify(address));
    return address;
  }
);

// Save payment method
const savePaymentMethod = createAsyncThunk('cart/savePaymentMethod', (method) => {
  localStorage.setItem('paymentMethod', method);
  return method;
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    ...initialState,
    shippingAddress: JSON.parse(localStorage.getItem('shippingAddress')) || {},
    paymentMethod: localStorage.getItem('paymentMethod') || 'paypal',
  },
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Cart
      .addCase(getCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cart = action.payload;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cart = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Update Cart Item
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      
      // Remove from Cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      
      // Clear Cart
      .addCase(clearCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      
      // Save Shipping Address
      .addCase(saveShippingAddress.fulfilled, (state, action) => {
        state.shippingAddress = action.payload;
      })
      
      // Save Payment Method
      .addCase(savePaymentMethod.fulfilled, (state, action) => {
        state.paymentMethod = action.payload;
      });
  },
});

export const { reset } = cartSlice.actions;

export const cartActions = {
  ...cartSlice.actions,
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  saveShippingAddress,
  savePaymentMethod,
};

export default cartSlice.reducer;
