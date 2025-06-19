// No React import needed with new JSX transform
import { SignUpForm } from 'features/auth/components/SignUpForm';

export function SignUpPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary-600 mb-2">EdVerse</h1>
          <p className="text-gray-600">Start your learning journey today</p>
        </div>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <SignUpForm />
      </div>
    </div>
  );
}
