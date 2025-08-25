import React from 'react';
import { Box, Text } from '@radix-ui/themes';

const ParentPortalPage: React.FC = () => {
  return (
    <Box className="p-6">
      <Text className="text-2xl font-bold mb-4">Parent Portal</Text>
      <Text className="text-gray-600">
        Parent portal and communication features for Growth plan.
      </Text>
    </Box>
  );
};

export default ParentPortalPage;
