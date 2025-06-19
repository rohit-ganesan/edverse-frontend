// No React import needed with new JSX transform
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Flex, Box, Heading, Text } from '@radix-ui/themes';
import { SignUpForm } from 'features/auth/components/SignUpForm';
import { useAuth } from 'features/auth/AuthContext';

export function SignUpPage(): JSX.Element {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination from location state, default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  // Redirect to intended destination if already authenticated
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  return (
    <Container className="min-h-screen bg-gray-50">
      <Flex
        direction="column"
        align="center"
        justify="center"
        className="min-h-screen py-12"
        gap="8"
      >
        <Box className="text-center">
          <Heading size="8" className="text-blue-600 mb-2">
            EdVerse
          </Heading>
          <Text size="4" color="gray">
            Start your learning journey today
          </Text>
        </Box>
        <SignUpForm />
      </Flex>
    </Container>
  );
}
