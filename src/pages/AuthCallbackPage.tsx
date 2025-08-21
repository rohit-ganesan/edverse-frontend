import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from 'lib/supabase';

export default function AuthCallbackPage(): JSX.Element {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Parse the URL hash for auth tokens (email verification, password reset, etc.)
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1)
        );
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');

        console.log('Auth callback type:', type);

        if (accessToken && refreshToken) {
          // Set the session from the tokens
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error('Auth callback error:', error);
            setError('Authentication failed. Please try again.');
            return;
          }

          if (data.session) {
            console.log('Authentication successful:', data.session.user.email);

            // Check if this is email verification
            if (type === 'signup' || type === 'email_confirmation') {
              console.log('Email verification successful');
              // Clean up the URL
              window.history.replaceState({}, document.title, '/dashboard');
            }

            // Redirect to dashboard on successful auth
            navigate('/dashboard', { replace: true });
          } else {
            console.log('No session created, redirecting to login');
            navigate('/login', { replace: true });
          }
        } else {
          // No tokens in URL, check for existing session
          const { data, error } = await supabase.auth.getSession();

          if (error) {
            console.error('Session check error:', error);
            setError('Authentication failed. Please try again.');
            return;
          }

          if (data.session) {
            console.log('Existing session found:', data.session.user.email);
            navigate('/dashboard', { replace: true });
          } else {
            console.log('No session found, redirecting to login');
            navigate('/login', { replace: true });
          }
        }
      } catch (err) {
        console.error('Unexpected error during auth callback:', err);
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Completing Authentication...
          </h2>
          <p className="text-gray-600">Please wait while we sign you in.</p>
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
