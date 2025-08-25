import React from 'react';
import { Box, Text } from '@radix-ui/themes';

const NoticeBoardAdvancedPage: React.FC = () => {
  return (
    <Box className="p-6">
      <Text className="text-2xl font-bold mb-4">Advanced Announcements</Text>
      <Text className="text-gray-600">
        Advanced announcements with targeting and analytics for Growth plan.
      </Text>
    </Box>
  );
};

export default NoticeBoardAdvancedPage;
