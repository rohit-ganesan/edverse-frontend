import { Box, Text } from '@radix-ui/themes';

interface PersonAvatarProps {
  name: string;
  size?: 'small' | 'medium' | 'large';
  colorScheme?: 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'gray';
  className?: string;
}

export function PersonAvatar({
  name,
  size = 'medium',
  colorScheme = 'blue',
  className = '',
}: PersonAvatarProps): JSX.Element {
  // Safe name processing with null checks
  const getInitials = (fullName: string): string => {
    if (!fullName || typeof fullName !== 'string') {
      return '??';
    }

    try {
      const nameParts = fullName
        .trim()
        .split(' ')
        .filter((part) => part.length > 0);
      if (nameParts.length === 0) return '??';

      if (nameParts.length === 1) {
        return nameParts[0].charAt(0).toUpperCase();
      }

      return nameParts
        .slice(0, 2) // Take first two parts (first name, last name)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');
    } catch (error) {
      console.warn('PersonAvatar: Error processing name:', error, fullName);
      return '??';
    }
  };

  // Size configurations
  const sizeConfig = {
    small: {
      container: 'w-8 h-8',
      text: '1',
    },
    medium: {
      container: 'w-10 h-10',
      text: '2',
    },
    large: {
      container: 'w-12 h-12',
      text: '3',
    },
  };

  // Color scheme configurations
  const colorConfig = {
    blue: {
      bg: 'bg-blue-100 dark:bg-blue-900',
      text: 'text-blue-600 dark:text-blue-300',
    },
    purple: {
      bg: 'bg-purple-100 dark:bg-purple-900',
      text: 'text-purple-600 dark:text-purple-300',
    },
    green: {
      bg: 'bg-green-100 dark:bg-green-900',
      text: 'text-green-600 dark:text-green-300',
    },
    orange: {
      bg: 'bg-orange-100 dark:bg-orange-900',
      text: 'text-orange-600 dark:text-orange-300',
    },
    red: {
      bg: 'bg-red-100 dark:bg-red-900',
      text: 'text-red-600 dark:text-red-300',
    },
    gray: {
      bg: 'bg-gray-100 dark:bg-gray-700',
      text: 'text-gray-600 dark:text-gray-300',
    },
  };

  const currentSize = sizeConfig[size];
  const currentColor = colorConfig[colorScheme];
  const initials = getInitials(name);

  return (
    <Box
      className={`
        ${currentSize.container} 
        ${currentColor.bg} 
        rounded-full 
        flex 
        items-center 
        justify-center 
        flex-shrink-0
        ${className}
      `}
    >
      <Text
        size={currentSize.text as any}
        weight="medium"
        className={currentColor.text}
      >
        {initials}
      </Text>
    </Box>
  );
}
