import React from 'react';
import { Box, Flex, Text, Spinner } from '@radix-ui/themes';

interface ProfileCreationLoaderProps {
  message?: string;
}

export const ProfileCreationLoader: React.FC<ProfileCreationLoaderProps> = ({
  message = 'Setting up your profile...',
}) => {
  return (
    <Box
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          minWidth: '300px',
        }}
      >
        <Flex direction="column" align="center" gap="3">
          <Spinner size="3" />
          <Text size="4" weight="medium">
            {message}
          </Text>
          <Text size="2" color="gray">
            This may take a few seconds...
          </Text>
        </Flex>
      </Box>
    </Box>
  );
};

export default ProfileCreationLoader;
