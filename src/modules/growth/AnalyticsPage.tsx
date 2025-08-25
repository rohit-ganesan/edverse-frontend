import React from 'react';
import { Box, Text } from '@radix-ui/themes';

const AnalyticsPage: React.FC = () => {
  return (
    <Box className="p-6">
      <Text className="text-2xl font-bold mb-4">Analytics</Text>
      <Text className="text-gray-600">
        Advanced analytics and reporting for Growth plan.
      </Text>
    </Box>
  );
};

export default AnalyticsPage;
