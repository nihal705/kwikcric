import { axiosInstance } from './axiosInstance';

export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
  countryCode: string | null;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

export const authAPI = {
  register: async (data: {
    email: string;
    username: string;
    password: string;
    fullName?: string;
    countryCode?: string;
  }) => {
    const response = await axiosInstance.post('/auth/register', data);
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await axiosInstance.post('/auth/login', { email, password });
    return response.data;
  },

  googleLogin: async (token: string) => {
    const response = await axiosInstance.post('/auth/google', { token });
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
  },

  getProfile: async () => {
    const response = await axiosInstance.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (data: { fullName?: string; countryCode?: string; avatarUrl?: string }) => {
    const response = await axiosInstance.put('/auth/profile', data);
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await axiosInstance.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await axiosInstance.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token: string, newPassword: string) => {
    const response = await axiosInstance.post('/auth/reset-password', {
      token,
      newPassword,
    });
    return response.data;
  },

  verifyEmail: async (token: string) => {
    const response = await axiosInstance.get(`/auth/verify-email?token=${token}`);
    return response.data;
  },

  resendVerification: async (email: string) => {
    const response = await axiosInstance.post('/auth/resend-verification', { email });
    return response.data;
  },
};