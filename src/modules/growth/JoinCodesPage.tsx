import React from 'react';
import { Box, Text } from '@radix-ui/themes';

const JoinCodesPage: React.FC = () => {
  return (
    <Box className="p-6">
      <Text className="text-2xl font-bold mb-4">Join Codes</Text>
      <Text className="text-gray-600">
        Manage join codes and invitations for Growth plan.
      </Text>
    </Box>
  );
};

export default JoinCodesPage;
