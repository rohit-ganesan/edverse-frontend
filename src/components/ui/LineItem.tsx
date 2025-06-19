import { ReactNode } from 'react';
import { Box, Flex, Text } from '@radix-ui/themes';

interface LineItemProps {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  value: ReactNode;
  className?: string;
  variant?: 'default' | 'bordered' | 'highlighted';
}

export function LineItem({
  icon: Icon,
  label,
  value,
  className = '',
  variant = 'default',
}: LineItemProps): JSX.Element {
  const getVariantStyles = (): string => {
    switch (variant) {
      case 'bordered':
        return 'p-3 rounded-lg border border-gray-100 dark:border-gray-700';
      case 'highlighted':
        return 'p-3 rounded-lg bg-gray-50 dark:bg-gray-800';
      default:
        return 'py-2';
    }
  };

  return (
    <Flex
      align="start"
      gap="4"
      className={`${getVariantStyles()} ${className}`}
    >
      {Icon && (
        <Icon className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-1 flex-shrink-0" />
      )}
      <Box className="flex-1 min-w-0">
        <Text
          size="2"
          weight="medium"
          className="text-gray-700 dark:text-gray-300 block mb-1"
        >
          {label}
        </Text>
        <Box className="text-gray-900 dark:text-gray-100">
          {typeof value === 'string' ? (
            <Text size="2" className="block">
              {value}
            </Text>
          ) : (
            value
          )}
        </Box>
      </Box>
    </Flex>
  );
}
