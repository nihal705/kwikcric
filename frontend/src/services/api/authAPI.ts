import axios from 'axios';
import { API_BASE_URL } from './config';

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
    const response = await axios.post(`${API_BASE_URL}/auth/register`, data);
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
    return response.data;
  },

  googleLogin: async (token: string) => {
    const response = await axios.post(`${API_BASE_URL}/auth/google`, { token });
    return response.data;
  },

  logout: async () => {
    const response = await axios.post(`${API_BASE_URL}/auth/logout`);
    return response.data;
  },

  getProfile: async () => {
    const response = await axios.get(`${API_BASE_URL}/auth/profile`);
    return response.data;
  },

  updateProfile: async (data: { fullName?: string; countryCode?: string; avatarUrl?: string }) => {
    const response = await axios.put(`${API_BASE_URL}/auth/profile`, data);
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await axios.post(`${API_BASE_URL}/auth/change-password`, {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
    return response.data;
  },

  resetPassword: async (token: string, newPassword: string) => {
    const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, {
      token,
      newPassword,
    });
    return response.data;
  },

  verifyEmail: async (token: string) => {
    const response = await axios.get(`${API_BASE_URL}/auth/verify-email?token=${token}`);
    return response.data;
  },

  resendVerification: async (email: string) => {
    const response = await axios.post(`${API_BASE_URL}/auth/resend-verification`, { email });
    return response.data;
  },
};