import React from 'react';
import { Box, Text } from '@radix-ui/themes';

const AdmissionsPage: React.FC = () => {
  return (
    <Box className="p-6">
      <Text className="text-2xl font-bold mb-4">Admissions</Text>
      <Text className="text-gray-600">
        Student admissions and enrollment management for Enterprise plan.
      </Text>
    </Box>
  );
};

export default AdmissionsPage;
