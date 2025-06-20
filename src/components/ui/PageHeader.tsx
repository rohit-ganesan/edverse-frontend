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
  // Validate required props
  if (!title || typeof title !== 'string') {
    console.error('PageHeader: title is required and must be a string');
    return (
      <Box className={`mb-8 ${className || ''}`}>
        <Heading size="8" className="text-gray-900 dark:text-white mb-2">
          Error: Invalid Title
        </Heading>
        <Text size="4" className="text-gray-600 dark:text-gray-400">
          The page title is missing or invalid.
        </Text>
      </Box>
    );
  }

  if (!description || typeof description !== 'string') {
    console.error('PageHeader: description is required and must be a string');
    return (
      <Box className={`mb-8 ${className || ''}`}>
        <Heading size="8" className="text-gray-900 dark:text-white mb-2">
          {title}
        </Heading>
        <Text size="4" className="text-gray-600 dark:text-gray-400">
          Error: Invalid description
        </Text>
      </Box>
    );
  }

  // Ensure actions is an array
  const safeActions = Array.isArray(actions) ? actions : [];

  // Filter out invalid actions
  const validActions = safeActions.filter((action) => {
    if (!action || typeof action !== 'object') {
      console.warn('PageHeader: Invalid action object found');
      return false;
    }

    if (!action.label || typeof action.label !== 'string') {
      console.warn('PageHeader: Action must have a valid label');
      return false;
    }

    return true;
  });

  const handleActionClick = (action: ActionButton, index: number): void => {
    try {
      if (action.onClick && typeof action.onClick === 'function') {
        action.onClick();
      } else {
        console.warn(
          `PageHeader: Action "${action.label}" has no onClick handler`
        );
      }
    } catch (error) {
      console.error(
        `PageHeader: Error executing action "${action.label}":`,
        error
      );
    }
  };

  return (
    <Box className={`mb-8 ${className || ''}`}>
      <Flex justify="between" align="center" className="mb-6">
        <Box>
          <Heading size="8" className="text-gray-900 dark:text-white mb-2">
            {title}
          </Heading>
          <Text size="4" className="text-gray-600 dark:text-gray-400">
            {description}
          </Text>
        </Box>
        {validActions.length > 0 && (
          <Flex gap="3" align="center">
            {validActions.map((action, index) => {
              const IconComponent = action.icon;
              const variant = action.isPrimary
                ? 'solid'
                : action.variant || 'outline';

              return (
                <RadixButton
                  key={`action-${index}-${action.label}`}
                  variant={variant}
                  size="3"
                  onClick={() => handleActionClick(action, index)}
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
