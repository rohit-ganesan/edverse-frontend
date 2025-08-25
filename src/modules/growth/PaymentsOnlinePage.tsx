import React from 'react';
import { Box, Text } from '@radix-ui/themes';

const PaymentsOnlinePage: React.FC = () => {
  return (
    <Box className="p-6">
      <Text className="text-2xl font-bold mb-4">Online Payments</Text>
      <Text className="text-gray-600">
        Online payment processing and management for Growth plan.
      </Text>
    </Box>
  );
};

export default PaymentsOnlinePage;
