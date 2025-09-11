import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from 'lib/supabase';

export default function AuthCallbackPage(): JSX.Element {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔄 Processing auth callback...');
        console.log('Current URL:', window.location.href);

        // Get the next parameter from URL
        const urlParams = new URLSearchParams(window.location.search);
        const nextPath = urlParams.get('next') || '/dashboard';
        console.log('Next path:', nextPath);

        // Parse the URL hash for auth tokens (email verification, password reset, etc.)
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1)
        );
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');
        const tokenHash = hashParams.get('token_hash');

        const errorDescription = hashParams.get('error_description');

        console.log('🔍 Auth callback details:', {
          type,
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          hasTokenHash: !!tokenHash,
          hasErrorDescription: !!errorDescription,
        });

        // Function to show success and notify other tabs
        // Early branch for error handling
        if (errorDescription) {
          console.log('❌ Auth callback error:', errorDescription);
          setError(`Authentication failed: ${errorDescription}`);
          setLoading(false);
          return;
        }

        // Early branch for empty hash (common email confirmation case)
        if (!accessToken && !refreshToken && !tokenHash) {
          console.log(
            '✅ Email verification completed (empty hash), redirecting to login'
          );
          setSuccess(
            'Email verified successfully! Please sign in to continue.'
          );
          setTimeout(() => {
            navigate('/login?verified=1', { replace: true });
          }, 2000);
          return;
        }

        if (accessToken && refreshToken) {
          console.log('✅ Found auth tokens, setting session...');

          // Set the session from the tokens
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error('❌ Auth callback error:', error);
            setError('Authentication failed. Please try again.');
            return;
          }

          if (data.session) {
            console.log(
              '✅ Authentication successful:',
              data.session.user.email
            );
            console.log(
              '📧 Email confirmed:',
              data.session.user.email_confirmed_at ? 'Yes' : 'No'
            );

            // Check if this is email verification
            if (type === 'signup' || type === 'email_confirmation') {
              console.log(
                '✅ Email verification successful, redirecting to onboarding'
              );
              // Auto-redirect to onboarding for new signups
              setTimeout(() => {
                console.log('🚀 Redirecting to onboarding');
                navigate('/onboarding', { replace: true });
              }, 1000);
              return;
            }

            // For other auth types, redirect to next path
            setTimeout(() => {
              console.log('🚀 Redirecting to:', nextPath);
              navigate(nextPath, { replace: true });
            }, 1000);
          } else {
            console.log('❌ No session created, redirecting to login');
            navigate('/login', { replace: true });
          }
        } else if (tokenHash) {
          // Handle token_hash based verification (newer Supabase format)
          console.log('🔍 Found token_hash, verifying...');

          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: (type as any) || 'signup',
          });

          if (error) {
            console.error('❌ Token verification error:', error);
            setError('Email verification failed. Please try again.');
            return;
          }

          if (data.session) {
            console.log(
              '✅ Token verification successful:',
              data.session.user.email
            );
            console.log(
              '📧 Email confirmed:',
              data.session.user.email_confirmed_at ? 'Yes' : 'No'
            );

            console.log(
              '✅ Token verification successful, redirecting to onboarding'
            );
            // Auto-redirect to onboarding for new signups
            setTimeout(() => {
              console.log('🚀 Redirecting to onboarding');
              navigate('/onboarding', { replace: true });
            }, 1000);
            return;
          } else {
            console.log('❌ No session from token verification');
            setError(
              'Email verification completed, but session creation failed. Please try logging in.'
            );
            setTimeout(() => navigate('/login', { replace: true }), 2000);
          }
        } else {
          // No tokens in URL, check for existing session
          console.log('🔍 No tokens found, checking existing session...');

          const { data, error } = await supabase.auth.getSession();

          if (error) {
            console.error('❌ Session check error:', error);
            setError('Authentication failed. Please try again.');
            return;
          }

          if (data.session) {
            console.log('✅ Existing session found:', data.session.user.email);
            navigate(nextPath, { replace: true });
          } else {
            console.log('❌ No session found, redirecting to login');
            navigate('/login', { replace: true });
          }
        }
      } catch (err) {
        console.error('❌ Unexpected error during auth callback:', err);
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Verifying Email...
          </h2>
          <p className="text-gray-600 mb-4">
            Please wait while we complete your email verification.
          </p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md bg-white rounded-lg shadow-lg p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Email Verified!
          </h2>
          <p className="text-gray-600 mb-6">{success}</p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/onboarding')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Continue Setup
            </button>
            <button
              onClick={() => window.close()}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Close Tab
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong className="font-bold">Authentication Error</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return <></>;
}
