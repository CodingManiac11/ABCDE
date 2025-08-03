import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../../services/userService';

const initialState = {
  user: null,
  users: [],
  loading: false,
  error: null,
  success: false,
  userProfile: null,
  userOrders: [],
  userFavorites: [],
  userAddresses: [],
  userPaymentMethods: [],
};

// Get user profile
const getUserProfile = createAsyncThunk(
  'user/getUserProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      if (!user?.token) {
        throw new Error('User not authenticated');
      }
      const response = await userService.getUserProfile(user.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Error fetching user profile'
      );
    }
  }
);

// Update user profile
const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (userData, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      if (!user?.token) {
        throw new Error('User not authenticated');
      }
      const response = await userService.updateUserProfile(
        userData,
        user.token
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Error updating user profile'
      );
    }
  }
);

// Update user password
const updateUserPassword = createAsyncThunk(
  'user/updateUserPassword',
  async (passwords, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      if (!user?.token) {
        throw new Error('User not authenticated');
      }
      const response = await userService.updateUserPassword(
        passwords,
        user.token
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Error updating password'
      );
    }
  }
);

// Get all users (Admin)
const getAllUsers = createAsyncThunk(
  'user/getAllUsers',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      if (!user?.token) {
        throw new Error('User not authenticated');
      }
      const response = await userService.getAllUsers(user.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Error fetching users'
      );
    }
  }
);

// Get user by ID (Admin)
const getUserById = createAsyncThunk(
  'user/getUserById',
  async (userId, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      if (!user?.token) {
        throw new Error('User not authenticated');
      }
      const response = await userService.getUserById(userId, user.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Error fetching user'
      );
    }
  }
);

// Update user (Admin)
const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ userId, userData }, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      if (!user?.token) {
        throw new Error('User not authenticated');
      }
      const response = await userService.updateUser(
        userId,
        userData,
        user.token
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Error updating user'
      );
    }
  }
);

// Delete user (Admin)
const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (userId, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      if (!user?.token) {
        throw new Error('User not authenticated');
      }
      await userService.deleteUser(userId, user.token);
      return userId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Error deleting user'
      );
    }
  }
);

// Get user addresses
const getUserAddresses = createAsyncThunk(
  'user/getUserAddresses',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      if (!user?.token) {
        throw new Error('User not authenticated');
      }
      const response = await userService.getUserAddresses(user.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Error fetching addresses'
      );
    }
  }
);

// Add user address
const addUserAddress = createAsyncThunk(
  'user/addUserAddress',
  async (addressData, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      if (!user?.token) {
        throw new Error('User not authenticated');
      }
      const response = await userService.addUserAddress(
        addressData,
        user.token
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Error adding address'
      );
    }
  }
);

// Update user address
const updateUserAddress = createAsyncThunk(
  'user/updateUserAddress',
  async ({ addressId, addressData }, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      if (!user?.token) {
        throw new Error('User not authenticated');
      }
      const response = await userService.updateUserAddress(
        addressId,
        addressData,
        user.token
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Error updating address'
      );
    }
  }
);

// Delete user address
const deleteUserAddress = createAsyncThunk(
  'user/deleteUserAddress',
  async (addressId, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      if (!user?.token) {
        throw new Error('User not authenticated');
      }
      await userService.deleteUserAddress(addressId, user.token);
      return addressId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Error deleting address'
      );
    }
  }
);

// Get user payment methods
const getUserPaymentMethods = createAsyncThunk(
  'user/getUserPaymentMethods',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      if (!user?.token) {
        throw new Error('User not authenticated');
      }
      const response = await userService.getUserPaymentMethods(user.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Error fetching payment methods'
      );
    }
  }
);

// Add user payment method
const addUserPaymentMethod = createAsyncThunk(
  'user/addUserPaymentMethod',
  async (paymentMethodData, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      if (!user?.token) {
        throw new Error('User not authenticated');
      }
      const response = await userService.addUserPaymentMethod(
        paymentMethodData,
        user.token
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Error adding payment method'
      );
    }
  }
);

// Delete user payment method
const deleteUserPaymentMethod = createAsyncThunk(
  'user/deleteUserPaymentMethod',
  async (paymentMethodId, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      if (!user?.token) {
        throw new Error('User not authenticated');
      }
      await userService.deleteUserPaymentMethod(paymentMethodId, user.token);
      return paymentMethodId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Error deleting payment method'
      );
    }
  }
);

// Get user favorites
const getUserFavorites = createAsyncThunk(
  'user/getUserFavorites',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      if (!user?.token) {
        throw new Error('User not authenticated');
      }
      const response = await userService.getUserFavorites(user.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Error fetching favorites'
      );
    }
  }
);

// Add to favorites
const addToFavorites = createAsyncThunk(
  'user/addToFavorites',
  async (productId, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      if (!user?.token) {
        throw new Error('User not authenticated');
      }
      const response = await userService.addToFavorites(
        productId,
        user.token
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Error adding to favorites'
      );
    }
  }
);

// Remove from favorites
const removeFromFavorites = createAsyncThunk(
  'user/removeFromFavorites',
  async (productId, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      if (!user?.token) {
        throw new Error('User not authenticated');
      }
      await userService.removeFromFavorites(productId, user.token);
      return productId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Error removing from favorites'
      );
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUserState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearUserProfile: (state) => {
      state.userProfile = null;
    },
  },
  extraReducers: (builder) => {
    // Get User Profile
    builder.addCase(getUserProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getUserProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.userProfile = action.payload;
    });
    builder.addCase(getUserProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Update User Profile
    builder.addCase(updateUserProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(updateUserProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.userProfile = action.payload;
    });
    builder.addCase(updateUserProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    });

    // Update User Password
    builder.addCase(updateUserPassword.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(updateUserPassword.fulfilled, (state) => {
      state.loading = false;
      state.success = true;
    });
    builder.addCase(updateUserPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    });

    // Get All Users (Admin)
    builder.addCase(getAllUsers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload;
    });
    builder.addCase(getAllUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Get User by ID (Admin)
    builder.addCase(getUserById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getUserById.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(getUserById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Update User (Admin)
    builder.addCase(updateUser.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.user = action.payload;
      state.users = state.users.map((user) =>
        user._id === action.payload._id ? action.payload : user
      );
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    });

    // Delete User (Admin)
    builder.addCase(deleteUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.loading = false;
      state.users = state.users.filter((user) => user._id !== action.payload);
    });
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Get User Addresses
    builder.addCase(getUserAddresses.fulfilled, (state, action) => {
      state.userAddresses = action.payload;
    });

    // Add User Address
    builder.addCase(addUserAddress.fulfilled, (state, action) => {
      state.userAddresses.push(action.payload);
    });

    // Update User Address
    builder.addCase(updateUserAddress.fulfilled, (state, action) => {
      state.userAddresses = state.userAddresses.map((address) =>
        address._id === action.payload._id ? action.payload : address
      );
    });

    // Delete User Address
    builder.addCase(deleteUserAddress.fulfilled, (state, action) => {
      state.userAddresses = state.userAddresses.filter(
        (address) => address._id !== action.payload
      );
    });

    // Get User Payment Methods
    builder.addCase(getUserPaymentMethods.fulfilled, (state, action) => {
      state.userPaymentMethods = action.payload;
    });

    // Add User Payment Method
    builder.addCase(addUserPaymentMethod.fulfilled, (state, action) => {
      state.userPaymentMethods.push(action.payload);
    });

    // Delete User Payment Method
    builder.addCase(deleteUserPaymentMethod.fulfilled, (state, action) => {
      state.userPaymentMethods = state.userPaymentMethods.filter(
        (method) => method._id !== action.payload
      );
    });

    // Get User Favorites
    builder.addCase(getUserFavorites.fulfilled, (state, action) => {
      state.userFavorites = action.payload;
    });

    // Add to Favorites
    builder.addCase(addToFavorites.fulfilled, (state, action) => {
      state.userFavorites = action.payload;
    });

    // Remove from Favorites
    builder.addCase(removeFromFavorites.fulfilled, (state, action) => {
      state.userFavorites = state.userFavorites.filter(
        (item) => item.product._id !== action.payload
      );
    });
  },
});

export const { resetUserState, clearUserProfile } = userSlice.actions;

export {
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserAddresses,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  getUserPaymentMethods,
  addUserPaymentMethod,
  deleteUserPaymentMethod,
  getUserFavorites,
  addToFavorites,
  removeFromFavorites,
};

export default userSlice.reducer;
