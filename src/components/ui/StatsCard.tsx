import React from 'react';
import { Box, Flex, Text } from '@radix-ui/themes';
import { RadixCard } from './RadixCard';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon: IconComponent,
  iconColor = 'text-blue-600',
  iconBgColor = 'bg-blue-100',
  trend,
  className = '',
}: StatsCardProps): JSX.Element {
  // Validate required props
  if (!title || typeof title !== 'string') {
    console.error('StatsCard: title is required and must be a string');
    return (
      <RadixCard className={`p-4 ${className || ''}`}>
        <Box>Error: Invalid title</Box>
      </RadixCard>
    );
  }

  if (value === null || value === undefined) {
    console.error('StatsCard: value is required');
    return (
      <RadixCard className={`p-4 ${className || ''}`}>
        <Box>Error: Invalid value</Box>
      </RadixCard>
    );
  }

  // Fix icon validation - Lucide icons are React components, not regular functions
  if (!IconComponent) {
    console.error('StatsCard: icon is required');
    return (
      <RadixCard className={`p-4 ${className || ''}`}>
        <Box>Error: Missing icon</Box>
      </RadixCard>
    );
  }

  // Safe value conversion
  const safeValue = (): string => {
    if (typeof value === 'string') {
      return value;
    }
    if (typeof value === 'number') {
      return value.toString();
    }
    return '0';
  };

  // Safe trend validation
  const safeTrend =
    trend && typeof trend === 'object' && trend.value ? trend : null;

  // Safe trend value
  const getTrendValue = (): string => {
    if (!safeTrend?.value) return '';
    return typeof safeTrend.value === 'string'
      ? safeTrend.value
      : String(safeTrend.value);
  };

  // Safe trend direction
  const getTrendDirection = (): boolean => {
    return safeTrend?.isPositive === true;
  };

  return (
    <RadixCard className={`p-4 ${className || ''}`}>
      <Flex align="center" gap="3">
        <Box
          className={`w-12 h-12 ${iconBgColor || 'bg-blue-100'} dark:bg-opacity-20 rounded-lg flex items-center justify-center`}
        >
          <IconComponent
            className={`w-6 h-6 ${iconColor || 'text-blue-600'}`}
          />
        </Box>
        <Box className="flex-1">
          <Flex justify="between" align="center">
            <Text
              size="3"
              weight="bold"
              className="text-gray-900 dark:text-white"
            >
              {safeValue()}
            </Text>
            {safeTrend && (
              <Text
                size="2"
                className={`${getTrendDirection() ? 'text-green-600' : 'text-red-600'} font-medium`}
              >
                {getTrendDirection() ? '↗' : '↘'} {getTrendValue()}
              </Text>
            )}
          </Flex>
          <Text size="2" className="text-gray-600 dark:text-gray-400">
            {title}
          </Text>
        </Box>
      </Flex>
    </RadixCard>
  );
}
