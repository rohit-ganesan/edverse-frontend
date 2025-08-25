import React from 'react';
import { Box, Text } from '@radix-ui/themes';

const IntegrationsPage: React.FC = () => {
  return (
    <Box className="p-6">
      <Text className="text-2xl font-bold mb-4">Integrations</Text>
      <Text className="text-gray-600">
        Third-party integrations and API management for Enterprise plan.
      </Text>
    </Box>
  );
};

export default IntegrationsPage;
