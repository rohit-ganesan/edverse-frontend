import { Box, Flex, Text, Heading } from '@radix-ui/themes';
import { Camera } from 'lucide-react';
import { RadixCard } from './RadixCard';
import { RadixButton } from './RadixButton';

interface EmptySessionStateProps {
  onStartSession?: () => void;
  title?: string;
  description?: string;
  className?: string;
}

export function EmptySessionState({
  onStartSession,
  title = 'No Active Session',
  description = 'Start an attendance session to track student check-ins in real-time',
  className = '',
}: EmptySessionStateProps): JSX.Element {
  const handleStartSession = () => {
    if (onStartSession && typeof onStartSession === 'function') {
      try {
        onStartSession();
      } catch (error) {
        console.error('Error starting session:', error);
      }
    }
  };

  // Data integrity checks
  const safeTitle = title || 'No Active Session';
  const safeDescription =
    description ||
    'Start an attendance session to track student check-ins in real-time';

  return (
    <RadixCard className={`p-12 text-center ${className}`}>
      <Flex direction="column" align="center" gap="4">
        <Box className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
          <Camera className="w-8 h-8 text-gray-400" />
        </Box>
        <Box>
          <Heading size="4" className="text-gray-900 mb-2">
            {safeTitle}
          </Heading>
          <Text size="3" className="text-gray-600 mb-4">
            {safeDescription}
          </Text>
          {onStartSession && (
            <RadixButton variant="solid" size="3" onClick={handleStartSession}>
              <Camera className="w-4 h-4 mr-2" />
              Start New Session
            </RadixButton>
          )}
        </Box>
      </Flex>
    </RadixCard>
  );
}
