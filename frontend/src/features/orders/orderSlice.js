import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderService from '../../services/orderService';

const initialState = {
  order: null,
  orders: [],
  loading: false,
  error: null,
  success: false,
  currentOrder: null,
  myOrders: [],
  allOrders: [],
  orderStats: null,
  monthlySales: [],
};

// Create Order
const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      if (!user?.token) {
        throw new Error('User not authenticated');
      }
      const response = await orderService.createOrder(orderData, user.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Error creating order'
      );
    }
  }
);

// Get Order by ID
const getOrderById = createAsyncThunk(
  'order/getOrderById',
  async (orderId, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      if (!user?.token) {
        throw new Error('User not authenticated');
      }
      const response = await orderService.getOrderById(orderId, user.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Error fetching order'
      );
    }
  }
);

// Pay Order
const payOrder = createAsyncThunk(
  'order/payOrder',
  async ({ orderId, paymentResult }, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      if (!user?.token) {
        throw new Error('User not authenticated');
      }
      const response = await orderService.payOrder(
        orderId,
        paymentResult,
        user.token
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Error paying order'
      );
    }
  }
);

// Get User Orders
const getMyOrders = createAsyncThunk(
  'order/getMyOrders',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      if (!user?.token) {
        throw new Error('User not authenticated');
      }
      const response = await orderService.getMyOrders(user.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Error fetching user orders'
      );
    }
  }
);

// Get All Orders (Admin)
const getAllOrders = createAsyncThunk(
  'order/getAllOrders',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      if (!user?.token) {
        throw new Error('User not authenticated');
      }
      const response = await orderService.getOrders(user.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Error fetching all orders'
      );
    }
  }
);

// Update Order to Delivered (Admin)
const updateOrderToDelivered = createAsyncThunk(
  'order/updateOrderToDelivered',
  async (orderId, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      if (!user?.token) {
        throw new Error('User not authenticated');
      }
      const response = await orderService.updateOrderToDelivered(
        orderId,
        user.token
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Error updating order status'
      );
    }
  }
);

// Get Order Analytics (Admin)
const getOrderAnalytics = createAsyncThunk(
  'order/getOrderAnalytics',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      if (!user?.token) {
        throw new Error('User not authenticated');
      }
      const response = await orderService.getOrderAnalytics(user.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Error fetching order analytics'
      );
    }
  }
);

// Get Monthly Sales (Admin)
const getMonthlySales = createAsyncThunk(
  'order/getMonthlySales',
  async (year, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      if (!user?.token) {
        throw new Error('User not authenticated');
      }
      const response = await orderService.getMonthlySales(year, user.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Error fetching monthly sales'
      );
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    // Create Order
    builder.addCase(createOrder.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(createOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.order = action.payload;
      state.currentOrder = action.payload;
    });
    builder.addCase(createOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    });

    // Get Order by ID
    builder.addCase(getOrderById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getOrderById.fulfilled, (state, action) => {
      state.loading = false;
      state.order = action.payload;
    });
    builder.addCase(getOrderById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Pay Order
    builder.addCase(payOrder.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(payOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.order = action.payload;
      state.currentOrder = action.payload;
    });
    builder.addCase(payOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Get User Orders
    builder.addCase(getMyOrders.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getMyOrders.fulfilled, (state, action) => {
      state.loading = false;
      state.myOrders = action.payload;
    });
    builder.addCase(getMyOrders.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Get All Orders (Admin)
    builder.addCase(getAllOrders.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllOrders.fulfilled, (state, action) => {
      state.loading = false;
      state.allOrders = action.payload;
    });
    builder.addCase(getAllOrders.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Update Order to Delivered (Admin)
    builder.addCase(updateOrderToDelivered.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateOrderToDelivered.fulfilled, (state, action) => {
      state.loading = false;
      state.order = action.payload;
      state.allOrders = state.allOrders.map((order) =>
        order._id === action.payload._id ? action.payload : order
      );
    });
    builder.addCase(updateOrderToDelivered.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Get Order Analytics (Admin)
    builder.addCase(getOrderAnalytics.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getOrderAnalytics.fulfilled, (state, action) => {
      state.loading = false;
      state.orderStats = action.payload;
    });
    builder.addCase(getOrderAnalytics.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Get Monthly Sales (Admin)
    builder.addCase(getMonthlySales.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getMonthlySales.fulfilled, (state, action) => {
      state.loading = false;
      state.monthlySales = action.payload;
    });
    builder.addCase(getMonthlySales.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { resetOrder, clearCurrentOrder } = orderSlice.actions;

export {
  createOrder,
  getOrderById,
  payOrder,
  getMyOrders,
  getAllOrders,
  updateOrderToDelivered,
  getOrderAnalytics,
  getMonthlySales,
};

export default orderSlice.reducer;
