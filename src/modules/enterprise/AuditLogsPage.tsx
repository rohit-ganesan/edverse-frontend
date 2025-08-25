import React from 'react';
import { Box, Text } from '@radix-ui/themes';

const AuditLogsPage: React.FC = () => {
  return (
    <Box className="p-6">
      <Text className="text-2xl font-bold mb-4">Audit Logs</Text>
      <Text className="text-gray-600">
        Comprehensive audit logging and compliance for Enterprise plan.
      </Text>
    </Box>
  );
};

export default AuditLogsPage;
