import React from 'react';
import { Box, Text } from '@radix-ui/themes';

const BrandingPage: React.FC = () => {
  return (
    <Box className="p-6">
      <Text className="text-2xl font-bold mb-4">Branding</Text>
      <Text className="text-gray-600">
        Custom branding and white-labeling for Enterprise plan.
      </Text>
    </Box>
  );
};

export default BrandingPage;
