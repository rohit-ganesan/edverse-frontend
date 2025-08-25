import React from 'react';
import { Box, Text } from '@radix-ui/themes';

const SSOSAMLPage: React.FC = () => {
  return (
    <Box className="p-6">
      <Text className="text-2xl font-bold mb-4">SSO/SAML</Text>
      <Text className="text-gray-600">
        Single Sign-On and SAML authentication for Enterprise plan.
      </Text>
    </Box>
  );
};

export default SSOSAMLPage;
