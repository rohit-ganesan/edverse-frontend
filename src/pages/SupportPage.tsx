import React from 'react';
import { Box, Container, Heading, Text } from '@radix-ui/themes';

export const SupportPage: React.FC = () => {
  return (
    <Container size="4" className="py-8">
      <Box className="space-y-6">
        <Heading size="8">❓ Support</Heading>
        <Text size="3" className="text-gray-600">
          Get help and support for using EdVerse effectively.
        </Text>
        <Box className="p-6 bg-purple-50 rounded-lg border border-purple-200">
          <Text size="2" className="text-purple-800">
            Support documentation and contact information will be available
            here.
          </Text>
        </Box>
      </Box>
    </Container>
  );
};

export default SupportPage;
