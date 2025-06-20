import React from 'react';
import { Box, Flex, Text, Heading } from '@radix-ui/themes';
import { RadixButton } from './RadixButton';
import { LucideIcon } from 'lucide-react';

interface ActionButton {
  label: string;
  icon?: LucideIcon;
  variant?: 'solid' | 'outline' | 'ghost';
  onClick?: () => void;
  isPrimary?: boolean;
}

interface PageHeaderProps {
  title: string;
  description: string;
  actions?: ActionButton[];
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions = [],
  className = '',
}: PageHeaderProps): JSX.Element {
  return (
    <Box className={`mb-8 ${className}`}>
      <Flex justify="between" align="center" className="mb-6">
        <Box>
          <Heading size="8" className="text-gray-900 dark:text-white mb-2">
            {title}
          </Heading>
          <Text size="4" className="text-gray-600 dark:text-gray-400">
            {description}
          </Text>
        </Box>
        {actions.length > 0 && (
          <Flex gap="3" align="center">
            {actions.map((action, index) => {
              const IconComponent = action.icon;
              const variant = action.isPrimary
                ? 'solid'
                : action.variant || 'outline';

              return (
                <RadixButton
                  key={index}
                  variant={variant}
                  size="3"
                  onClick={action.onClick}
                  className={
                    action.isPrimary ? 'bg-blue-600 hover:bg-blue-700' : ''
                  }
                >
                  {IconComponent && <IconComponent className="w-4 h-4 mr-2" />}
                  {action.label}
                </RadixButton>
              );
            })}
          </Flex>
        )}
      </Flex>
    </Box>
  );
}
