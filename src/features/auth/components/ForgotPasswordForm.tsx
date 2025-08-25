import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { RadixButton } from '../../../components/ui/RadixButton';
import { RadixTextField } from '../../../components/ui/RadixTextField';
import { Toast } from '../../../components/ui/Toast';

export const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email.trim()) {
      setError('Please enter your email address');
      setShowToast(true);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setShowToast(true);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      setSuccess(
        'Password reset link sent! Please check your email and follow the instructions to reset your password.'
      );
      setShowToast(true);
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.message || 'An error occurred while sending the reset link');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <>
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Forgot Password
            </h2>
            <p className="text-gray-600 mt-2">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <RadixTextField
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null); // Clear error when user starts typing
                }}
                placeholder="Enter your email address"
                required
                disabled={loading}
                className="w-full"
              />
            </div>

            <RadixButton type="submit" disabled={loading} className="w-full">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </RadixButton>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <button
                type="button"
                onClick={handleBackToLogin}
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Back to sign in
              </button>
            </p>
          </div>
        </div>
      </div>

      {showToast && (error || success) && (
        <Toast
          description={error || success || ''}
          variant={error ? 'error' : 'success'}
          open={showToast}
          onOpenChange={(open) => {
            setShowToast(open);
            if (!open) {
              setError(null);
              setSuccess(null);
            }
          }}
        />
      )}
    </>
  );
};

export default ForgotPasswordForm;
