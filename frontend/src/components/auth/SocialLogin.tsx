import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../app/hooks/useAuth';
import toast from 'react-hot-toast';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const GoogleLoginButton: React.FC = () => {
  const { googleLogin, isLoading } = useAuth();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        await googleLogin(tokenResponse.access_token);
        toast.success('Logged in with Google!');
      } catch (error) {
        toast.error('Google login failed');
      }
    },
    onError: () => {
      toast.error('Google login failed');
    },
  });

  return (
    <button
      onClick={() => login()}
      disabled={isLoading}
      className="w-full flex items-center justify-center space-x-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
    >
      <FcGoogle size={20} />
      <span className="text-gray-700 dark:text-gray-300">Continue with Google</span>
    </button>
  );
};

export const SocialLogin: React.FC = () => {
  if (!GOOGLE_CLIENT_ID) {
    return null;
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <GoogleLoginButton />
    </GoogleOAuthProvider>
  );
};