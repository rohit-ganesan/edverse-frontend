import React from 'react';
import { Navigate } from 'react-router-dom';
import { Box, Container, Flex, Heading, Text } from '@radix-ui/themes';
import { useAuth } from '../features/auth/AuthContext';
import { LoginForm } from '../features/auth/components/LoginForm';

export const LoginPage: React.FC = () => {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <Container size="1" className="min-h-screen">
        <Flex
          direction="column"
          align="center"
          justify="center"
          className="min-h-screen"
        >
          <Box className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <Text size="3" className="text-gray-600">
              Checking authentication...
            </Text>
          </Box>
        </Flex>
      </Container>
    );
  }

  // If already authenticated, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Container size="1" className="min-h-screen">
      <Flex
        direction="column"
        align="center"
        justify="center"
        className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
      >
        <Box className="max-w-md w-full space-y-8">
          <Box className="text-center">
            <Heading size="8" className="text-gray-900 mb-2">
              Welcome to EdVerse
            </Heading>
            <Text size="3" className="text-gray-600">
              Your comprehensive learning management system
            </Text>
          </Box>

          <LoginForm />
        </Box>
      </Flex>
    </Container>
  );
};

export default LoginPage;
