import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { RadixButton } from '../../../components/ui/RadixButton';
import { RadixTextField } from '../../../components/ui/RadixTextField';
import { Toast } from '../../../components/ui/Toast';

export const ResetPasswordForm: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a valid session for password reset
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setIsValidSession(true);
      } else {
        setError(
          'Invalid or expired reset link. Please request a new password reset.'
        );
        setShowToast(true);
      }
    };

    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields');
      setShowToast(true);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setShowToast(true);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setShowToast(true);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        throw error;
      }

      setSuccess(
        'Password updated successfully! You can now sign in with your new password.'
      );
      setShowToast(true);

      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      console.error('Password update error:', err);
      setError(err.message || 'An error occurred while updating your password');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  if (!isValidSession) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Invalid Reset Link
            </h2>
            <p className="text-gray-600 mt-2">
              This password reset link is invalid or has expired.
            </p>
          </div>

          <div className="text-center">
            <RadixButton onClick={handleBackToLogin} className="w-full">
              Back to Sign In
            </RadixButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Set New Password
            </h2>
            <p className="text-gray-600 mt-2">Enter your new password below.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Password
              </label>
              <RadixTextField
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null); // Clear error when user starts typing
                }}
                placeholder="Enter your new password"
                required
                disabled={loading}
                className="w-full"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm New Password
              </label>
              <RadixTextField
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error) setError(null); // Clear error when user starts typing
                }}
                placeholder="Confirm your new password"
                required
                disabled={loading}
                className="w-full"
              />
            </div>

            <RadixButton type="submit" disabled={loading} className="w-full">
              {loading ? 'Updating...' : 'Update Password'}
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

export default ResetPasswordForm;
