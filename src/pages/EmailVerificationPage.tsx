import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from 'lib/supabase';
import { RadixButton } from 'components/ui/RadixButton';
import { RadixCard } from 'components/ui/RadixCard';

export function EmailVerificationPage(): JSX.Element {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const token = searchParams.get('token');
  const type = searchParams.get('type');
  const email = searchParams.get('email');

  useEffect(() => {
    if (!token || !type) {
      setError('Invalid verification link. Please try signing up again.');
    }
  }, [token, type]);

  const handleVerification = async () => {
    if (!token || !type) return;

    setLoading(true);
    setError('');
    setMessage('');

    try {
      console.log('🔄 Manual email verification...', { token, type, email });

      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: type as any,
      });

      if (error) {
        console.error('❌ Verification error:', error);
        setError('Verification failed: ' + error.message);
        return;
      }

      if (data.session) {
        console.log('✅ Email verified successfully!');
        setMessage('Email verified successfully! Redirecting to dashboard...');

        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 2000);
      } else {
        setError(
          'Verification completed but no session was created. Please try logging in.'
        );
      }
    } catch (err: any) {
      console.error('❌ Verification error:', err);
      setError('An unexpected error occurred: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <RadixCard className="w-full max-w-md">
        <div className="p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Email Verification
          </h1>

          {email && (
            <p className="text-sm text-gray-600 mb-6">
              Verifying email: <strong>{email}</strong>
            </p>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {message}
            </div>
          )}

          {!error && !message && token && (
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Click the button below to verify your email address.
              </p>
              <RadixButton
                onClick={handleVerification}
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-700"
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </RadixButton>
            </div>
          )}

          <div className="mt-6">
            <RadixButton
              variant="outline"
              onClick={() => navigate('/login')}
              className="w-full"
            >
              Back to Login
            </RadixButton>
          </div>
        </div>
      </RadixCard>
    </div>
  );
}
