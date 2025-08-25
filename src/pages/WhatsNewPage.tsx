import React from 'react';
import { Box, Container, Heading, Text } from '@radix-ui/themes';

export const WhatsNewPage: React.FC = () => {
  return (
    <Container size="4" className="py-8">
      <Box className="space-y-6">
        <Heading size="8">✨ What's New</Heading>
        <Text size="3" className="text-gray-600">
          Stay updated with the latest features and improvements in EdVerse.
        </Text>
        <Box className="p-6 bg-green-50 rounded-lg border border-green-200">
          <Text size="2" className="text-green-800">
            Latest updates and new features will be displayed here.
          </Text>
        </Box>
      </Box>
    </Container>
  );
};

export default WhatsNewPage;
