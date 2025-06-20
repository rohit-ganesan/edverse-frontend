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
  return (
    <RadixCard className={`p-4 ${className}`}>
      <Flex align="center" gap="3">
        <Box
          className={`w-12 h-12 ${iconBgColor} dark:bg-opacity-20 rounded-lg flex items-center justify-center`}
        >
          <IconComponent className={`w-6 h-6 ${iconColor}`} />
        </Box>
        <Box className="flex-1">
          <Flex justify="between" align="center">
            <Text
              size="3"
              weight="bold"
              className="text-gray-900 dark:text-white"
            >
              {value}
            </Text>
            {trend && (
              <Text
                size="2"
                className={`${trend.isPositive ? 'text-green-600' : 'text-red-600'} font-medium`}
              >
                {trend.isPositive ? '↗' : '↘'} {trend.value}
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
