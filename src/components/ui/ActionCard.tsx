import React from 'react';
import { Box, Flex, Text } from '@radix-ui/themes';
import { RadixCard } from './RadixCard';
import { RadixButton } from './RadixButton';
import { LucideIcon } from 'lucide-react';

interface ActionButton {
  label: string;
  icon?: LucideIcon;
  variant?: 'solid' | 'outline' | 'ghost';
  onClick?: () => void;
  className?: string;
}

interface ActionCardProps {
  title: string;
  description: string;
  variant: 'info' | 'success' | 'warning' | 'error' | 'primary' | 'secondary';
  action?: ActionButton;
  actions?: ActionButton[];
  icon?: LucideIcon;
  className?: string;
}

const variantStyles = {
  info: {
    cardClass: 'bg-blue-50 border-l-4 border-blue-500 shadow-sm',
    titleClass: 'text-blue-900',
    descClass: 'text-blue-700',
    buttonClass: 'bg-blue-600 hover:bg-blue-700 text-white',
  },
  success: {
    cardClass: 'bg-green-50 border-l-4 border-green-500 shadow-sm',
    titleClass: 'text-green-900',
    descClass: 'text-green-700',
    buttonClass: 'bg-green-600 hover:bg-green-700 text-white',
  },
  warning: {
    cardClass: 'bg-orange-50 border-l-4 border-orange-500 shadow-sm',
    titleClass: 'text-orange-900',
    descClass: 'text-orange-700',
    buttonClass: 'bg-orange-600 hover:bg-orange-700 text-white',
  },
  error: {
    cardClass: 'bg-red-50 border-l-4 border-red-500 shadow-sm',
    titleClass: 'text-red-900',
    descClass: 'text-red-700',
    buttonClass: 'bg-red-600 hover:bg-red-700 text-white',
  },
  primary: {
    cardClass: 'bg-purple-50 border-l-4 border-purple-500 shadow-sm',
    titleClass: 'text-purple-900',
    descClass: 'text-purple-700',
    buttonClass: 'bg-purple-600 hover:bg-purple-700 text-white',
  },
  secondary: {
    cardClass: 'bg-gray-50 border-l-4 border-gray-500 shadow-sm',
    titleClass: 'text-gray-900',
    descClass: 'text-gray-700',
    buttonClass: 'bg-gray-600 hover:bg-gray-700 text-white',
  },
};

export function ActionCard({
  title,
  description,
  variant,
  action,
  actions,
  icon: IconComponent,
  className = '',
}: ActionCardProps): JSX.Element {
  const styles = variantStyles[variant];
  const buttonsToRender = actions || (action ? [action] : []);

  return (
    <RadixCard className={`p-6 ${styles.cardClass} ${className}`}>
      <Flex justify="between" align="start" gap="4">
        <Flex align="start" gap="3" className="flex-1 min-w-0">
          {IconComponent && (
            <Box className="w-12 h-12 bg-white bg-opacity-60 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <IconComponent className={`w-6 h-6 ${styles.titleClass}`} />
            </Box>
          )}
          <Box className="flex-1 min-w-0">
            <Text
              size="3"
              weight="bold"
              className={`${styles.titleClass} mb-1 block`}
            >
              {title}
            </Text>
            <Text size="2" className={`${styles.descClass} leading-relaxed`}>
              {description}
            </Text>
          </Box>
        </Flex>
        {buttonsToRender.length > 0 && (
          <Flex gap="2" className="flex-shrink-0">
            {buttonsToRender.map((btn, index) => (
              <RadixButton
                key={index}
                variant={btn.variant || 'solid'}
                size="2"
                onClick={btn.onClick}
                className={btn.className || styles.buttonClass}
              >
                {btn.icon && <btn.icon className="w-4 h-4 mr-2" />}
                {btn.label}
              </RadixButton>
            ))}
          </Flex>
        )}
      </Flex>
    </RadixCard>
  );
}
