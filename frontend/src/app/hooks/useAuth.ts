import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { login, register, logout, googleLogin, updateProfile, changePassword } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const handleLogin = (email: string, password: string) => {
    dispatch(login({ email, password }));
  };

  const handleRegister = (data: { email: string; username: string; password: string; fullName?: string; countryCode?: string }) => {
    dispatch(register(data));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleGoogleLogin = (token: string) => {
    dispatch(googleLogin(token));
  };

  const handleUpdateProfile = (data: { fullName?: string; countryCode?: string; avatarUrl?: string }) => {
    dispatch(updateProfile(data));
  };

  const handleChangePassword = (currentPassword: string, newPassword: string) => {
    dispatch(changePassword({ currentPassword, newPassword }));
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    googleLogin: handleGoogleLogin,
    updateProfile: handleUpdateProfile,
    changePassword: handleChangePassword,
  };
};