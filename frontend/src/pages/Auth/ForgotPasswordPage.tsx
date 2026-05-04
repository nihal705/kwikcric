// frontend/src/pages/Auth/ForgotPasswordPage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const forgotSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

// Mock API - will be replaced with real backend
const mockForgotPassword = async (email: string) => {
  console.log('Password reset requested for:', email);
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true };
};

export const ForgotPasswordPage: React.FC = () => {
  const [step, setStep] = useState<'request' | 'success'>('request');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormData) => {
    setIsLoading(true);
    try {
      await mockForgotPassword(data.email);
      setStep('success');
      toast.success('Reset link sent! Check your email.');
    } catch (error) {
      toast.error('Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔐</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {step === 'request' ? 'Forgot Password' : 'Check Your Email'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              {step === 'request' 
                ? 'Enter your email to receive a reset link' 
                : 'We\'ve sent a password reset link to your email'}
            </p>
          </div>

          {/* Step 1: Request Reset */}
          {step === 'request' && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-900"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}

          {/* Success Step */}
          {step === 'success' && (
            <div className="text-center">
              <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Please check your email inbox and follow the instructions to reset your password.
              </p>
              <Link
                to="/login"
                className="inline-block w-full py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold text-center hover:from-green-700 hover:to-green-800 transition-all"
              >
                Back to Login
              </Link>
            </div>
          )}

          {/* Back to Login Link */}
          {step === 'request' && (
            <Link
              to="/login"
              className="flex items-center justify-center mt-6 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <FiArrowLeft className="mr-2" size={14} />
              Back to Login
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  );
};