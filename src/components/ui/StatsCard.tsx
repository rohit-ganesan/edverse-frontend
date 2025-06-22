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
      <RadixCard
        className={`p-0 shadow-lg border-0 bg-white overflow-hidden ${className || ''}`}
      >
        <Box className="p-4">Error: Invalid title</Box>
      </RadixCard>
    );
  }

  if (value === null || value === undefined) {
    console.error('StatsCard: value is required');
    return (
      <RadixCard
        className={`p-0 shadow-lg border-0 bg-white overflow-hidden ${className || ''}`}
      >
        <Box className="p-4">Error: Invalid value</Box>
      </RadixCard>
    );
  }

  // Fix icon validation - Lucide icons are React components, not regular functions
  if (!IconComponent) {
    console.error('StatsCard: icon is required');
    return (
      <RadixCard
        className={`p-0 shadow-lg border-0 bg-white overflow-hidden ${className || ''}`}
      >
        <Box className="p-4">Error: Missing icon</Box>
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
    <RadixCard
      className={`p-0 shadow-lg hover:shadow-xl border-0 bg-white overflow-hidden transition-all duration-300 hover:scale-[1.02] ${className || ''}`}
    >
      <Box className="p-5">
        <Flex align="center" gap="4">
          {/* Enhanced icon container */}
          <Box
            className={`w-14 h-14 ${iconBgColor || 'bg-blue-100'} dark:bg-opacity-20 rounded-xl flex items-center justify-center shadow-sm ring-1 ring-gray-100`}
          >
            <IconComponent
              className={`w-7 h-7 ${iconColor || 'text-blue-600'}`}
            />
          </Box>

          <Box className="flex-1">
            {/* Value and trend section */}
            <Flex justify="between" align="start" className="mb-2">
              <Text
                size="5"
                weight="bold"
                className="text-gray-900 dark:text-white leading-none"
              >
                {safeValue()}
              </Text>
              {safeTrend && (
                <Box
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    getTrendDirection()
                      ? 'bg-green-50 text-green-700 ring-1 ring-green-200'
                      : 'bg-red-50 text-red-700 ring-1 ring-red-200'
                  }`}
                >
                  <Flex align="center" gap="1">
                    <span>{getTrendDirection() ? '↗' : '↘'}</span>
                    <span>{getTrendValue()}</span>
                  </Flex>
                </Box>
              )}
            </Flex>

            {/* Title section */}
            <Text
              size="2"
              className="text-gray-600 dark:text-gray-400 font-medium leading-tight"
            >
              {title}
            </Text>
          </Box>
        </Flex>
      </Box>
    </RadixCard>
  );
}
