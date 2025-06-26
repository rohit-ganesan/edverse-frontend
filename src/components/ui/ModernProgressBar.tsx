import { ReactNode } from 'react';
import { Box, Flex, Text, Heading } from '@radix-ui/themes';
import { RadixCard } from './RadixCard';

interface ProgressSegment {
  value: number;
  color: 'green' | 'red' | 'orange' | 'blue' | 'purple' | 'gray';
  label: string;
}

interface ModernProgressBarProps {
  segments: ProgressSegment[];
  total: number;
  title?: string;
  subtitle?: string;
  showStats?: boolean;
  showPercentage?: boolean;
  height?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'rounded' | 'pill';
  animated?: boolean;
  gradient?: boolean;
  className?: string;
}

const colorClasses = {
  green: 'bg-green-500',
  red: 'bg-red-500',
  orange: 'bg-orange-400',
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  gray: 'bg-gray-300',
};

const gradientClasses = {
  green: 'bg-gradient-to-r from-green-400 to-green-600',
  red: 'bg-gradient-to-r from-red-400 to-red-600',
  orange: 'bg-gradient-to-r from-orange-400 to-orange-600',
  blue: 'bg-gradient-to-r from-blue-400 to-blue-600',
  purple: 'bg-gradient-to-r from-purple-400 to-purple-600',
  gray: 'bg-gradient-to-r from-gray-300 to-gray-500',
};

const heightClasses = {
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3',
};

const variantClasses = {
  default: 'rounded-sm',
  rounded: 'rounded-md',
  pill: 'rounded-full',
};

export function ModernProgressBar({
  segments,
  total,
  title,
  subtitle,
  showStats = true,
  showPercentage = true,
  height = 'md',
  variant = 'pill',
  animated = true,
  gradient = false,
  className = '',
}: ModernProgressBarProps): JSX.Element {
  const totalValue = segments.reduce((sum, segment) => sum + segment.value, 0);
  const percentage = Math.round((totalValue / total) * 100);

  let currentPosition = 0;

  return (
    <RadixCard
      className={`
        p-0 
        shadow-xl 
        border-0 
        bg-white dark:bg-gray-800
        overflow-hidden 
        transition-all 
        duration-300 
        hover:shadow-2xl 
        ${className}
      `}
    >
      {/* Header */}
      {(title || subtitle) && (
        <Box className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 dark:bg-gray-900 dark:border-gray-800">
          <Flex justify="between" align="center" className="mb-3" gap="4">
            <Box className="min-w-0 flex-1">
              {title && (
                <Heading
                  size="5"
                  className="text-gray-900 dark:text-gray-100 mb-1 truncate"
                >
                  {title}
                </Heading>
              )}
              {subtitle && (
                <Text
                  size="3"
                  className="text-gray-600 dark:text-gray-400 line-clamp-2"
                >
                  {subtitle}
                </Text>
              )}
            </Box>
            {showPercentage && (
              <Box className="flex-shrink-0">
                <Text
                  size="3"
                  weight="bold"
                  className="text-green-600 dark:text-green-300"
                >
                  {percentage}% Attended
                </Text>
              </Box>
            )}
          </Flex>
        </Box>
      )}

      {/* Content */}
      <Box className="p-6">
        {/* Progress Bar */}
        <Box
          className={`relative w-full bg-gray-200 dark:bg-gray-700 ${variantClasses[variant]} ${heightClasses[height]} mb-4 overflow-hidden`}
        >
          {segments.map((segment, index) => {
            const segmentPercentage = (segment.value / total) * 100;
            const leftPosition = currentPosition;
            currentPosition += segmentPercentage;

            const colorClass = gradient
              ? gradientClasses[segment.color]
              : colorClasses[segment.color];

            return (
              <Box
                key={index}
                className={`
                  absolute top-0 h-full 
                  ${colorClass}
                  ${animated ? 'transition-all duration-700 ease-out' : ''}
                `}
                style={{
                  left: `${leftPosition}%`,
                  width: `${segmentPercentage}%`,
                }}
              />
            );
          })}
        </Box>

        {/* Statistics */}
        {showStats && (
          <Flex justify="between" align="center" className="flex-wrap gap-2">
            <Flex gap="4" className="flex-wrap">
              {segments.map((segment, index) => (
                <Flex
                  key={index}
                  align="center"
                  gap="2"
                  className="flex-shrink-0"
                >
                  <Box
                    className={`w-3 h-3 ${colorClasses[segment.color]} rounded-full flex-shrink-0`}
                  />
                  <Text size="2" className="text-gray-600 truncate font-medium">
                    {segment.value} {segment.label}
                  </Text>
                </Flex>
              ))}
            </Flex>
          </Flex>
        )}
      </Box>
    </RadixCard>
  );
}
