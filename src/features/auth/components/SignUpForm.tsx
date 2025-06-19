import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heading, Text, Flex, Box } from '@radix-ui/themes';
import { Button } from 'components/ui/RadixButton';
import { RadixTextField } from 'components/ui/RadixTextField';
import { RadixCard } from 'components/ui/RadixCard';
import { RadixSeparator } from 'components/ui/RadixSeparator';
import { useAuth } from 'features/auth/AuthContext';
import { AuthFormData } from 'types/auth';

export function SignUpForm(): JSX.Element {
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signUp, signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard when user is authenticated
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): string | null => {
    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters long.';
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match.';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      await signUp(formData.email, formData.password);
    } catch (err: any) {
      console.error('SignUp error:', err);
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (): Promise<void> => {
    setLoading(true);
    setError('');

    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error('Google SignUp error:', err);
      setError(err.message || 'Failed to sign up with Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="max-w-md mx-auto">
      <RadixCard size="3" className="p-6">
        <Flex direction="column" gap="6">
          <Box className="text-center">
            <Heading size="6" className="mb-2">
              Create your account
            </Heading>
          </Box>

          {error && (
            <Box className="p-4 rounded-md bg-red-50 border border-red-200">
              <Text size="2" color="red">
                {error}
              </Text>
            </Box>
          )}

          <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="4">
              <RadixTextField
                name="email"
                type="email"
                label="Email address"
                value={formData.email}
                onChange={handleChange}
                required
                size="3"
                placeholder="Enter your email"
              />

              <RadixTextField
                name="password"
                type="password"
                label="Password"
                value={formData.password}
                onChange={handleChange}
                required
                size="3"
                placeholder="Create a password"
                helperText="Must be at least 6 characters long"
              />

              <RadixTextField
                name="confirmPassword"
                type="password"
                label="Confirm Password"
                value={formData.confirmPassword || ''}
                onChange={handleChange}
                required
                size="3"
                placeholder="Confirm your password"
              />

              <Button
                type="submit"
                size="3"
                className="w-full"
                loading={loading}
                disabled={loading}
              >
                Sign up
              </Button>
            </Flex>
          </form>

          <Box>
            <Flex align="center" gap="3" className="mb-4">
              <RadixSeparator className="flex-1" />
              <Text size="2" color="gray">
                Or continue with
              </Text>
              <RadixSeparator className="flex-1" />
            </Flex>

            <Button
              onClick={handleGoogleSignIn}
              variant="outline"
              size="3"
              className="w-full"
              disabled={loading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign up with Google
            </Button>
          </Box>

          <Box className="text-center">
            <Text size="2" color="gray">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in
              </Link>
            </Text>
          </Box>
        </Flex>
      </RadixCard>
    </Box>
  );
}
