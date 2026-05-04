import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authAPI } from '../../../services/api/authAPI';
import toast from 'react-hot-toast';

export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
  countryCode: string | null;
  role: 'user' | 'admin';
  isVerified: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const response = await authAPI.login(email, password);
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    return response.data.user;
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (data: {
    email: string;
    username: string;
    password: string;
    fullName?: string;
    countryCode?: string;
  }) => {
    const response = await authAPI.register(data);
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    return response.data.user;
  }
);

export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (token: string) => {
    const response = await authAPI.googleLogin(token);
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    return response.data.user;
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await authAPI.logout();
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
});

export const checkAuth = createAsyncThunk('auth/checkAuth', async () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No token');
  }
  const response = await authAPI.getProfile();
  return response.data;
});

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (data: { fullName?: string; countryCode?: string; avatarUrl?: string }) => {
    const response = await authAPI.updateProfile(data);
    return response.data;
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) => {
    await authAPI.changePassword(currentPassword, newPassword);
    toast.success('Password changed successfully');
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        toast.success('Welcome back!');
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
        toast.error(state.error);
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        toast.success('Account created! Please verify your email.');
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Registration failed';
        toast.error(state.error);
      })
      // Google Login
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        toast.success('Logged in with Google');
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        toast.success('Logged out');
      })
      // Check Auth
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      })
      // Update Profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        if (state.user) {
          state.user = { ...state.user, ...action.payload };
        }
        toast.success('Profile updated');
      });
  },
});

export const { clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;