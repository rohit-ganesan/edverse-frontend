import { useAuth } from 'features/auth/AuthContext';
import { LoginForm } from 'features/auth/components/LoginForm';
import { Navigate } from 'react-router-dom';

export function LoginPage(): JSX.Element {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If already authenticated, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to EdVerse
            </h1>
            <p className="text-gray-600">
              Your comprehensive learning management system
            </p>
          </div>
        </div>

        <LoginForm />

        {process.env.NODE_ENV === 'development' && (
          <div className="text-center mt-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">
                Development Mode
              </h3>
              <p className="text-xs text-blue-700">
                Using Supabase authentication system
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
