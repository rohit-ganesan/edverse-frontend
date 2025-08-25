import React from 'react';
import { Box, Container, Flex, Heading, Text } from '@radix-ui/themes';
import { ForgotPasswordForm } from '../features/auth/components/ForgotPasswordForm';

export const ForgotPasswordPage: React.FC = () => {
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

          <ForgotPasswordForm />
        </Box>
      </Flex>
    </Container>
  );
};

export default ForgotPasswordPage;
