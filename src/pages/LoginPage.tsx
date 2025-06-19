// No React import needed with new JSX transform
import { LoginForm } from 'features/auth/components/LoginForm';

export function LoginPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary-600 mb-2">EdVerse</h1>
          <p className="text-gray-600">Welcome back to your learning journey</p>
        </div>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
