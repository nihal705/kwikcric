// frontend/src/components/auth/SocialLogin.tsx
import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import toast from 'react-hot-toast';

export const SocialLogin: React.FC = () => {
  const handleGoogleLogin = () => {
    toast.error('Google login coming soon!');
  };

  const handleGithubLogin = () => {
    toast.error('GitHub login coming soon!');
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={handleGoogleLogin}
        className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
      >
        <FcGoogle size={20} />
        <span className="text-sm">Google</span>
      </button>
      <button
        onClick={handleGithubLogin}
        className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
      >
        <FaGithub size={20} />
        <span className="text-sm">GitHub</span>
      </button>
    </div>
  );
};