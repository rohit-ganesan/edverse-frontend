import { Box, Flex, Text, Heading } from '@radix-ui/themes';
import { RadixCard } from 'components/ui/RadixCard';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  loading?: boolean;
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  loading = false,
  className = '',
}: StatsCardProps): JSX.Element {
  return (
    <RadixCard size="2" className={`p-6 ${className}`}>
      <Flex justify="between" align="start">
        <Box>
          <Text size="2" className="text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </Text>
          <Heading size="6" className="text-gray-900 dark:text-gray-100 mb-2">
            {loading ? (
              <Box className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            ) : (
              value
            )}
          </Heading>
          {trend && !loading && (
            <Flex align="center" gap="1">
              {trend.isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <Text
                size="1"
                className={trend.isPositive ? 'text-green-600' : 'text-red-600'}
              >
                {Math.abs(trend.value)}%
              </Text>
            </Flex>
          )}
          {loading && (
            <Box className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-1" />
          )}
        </Box>
        <Box
          className={`
            w-12 h-12 rounded-full flex items-center justify-center
            ${
              loading
                ? 'bg-gray-200 dark:bg-gray-700 animate-pulse'
                : trend?.isPositive
                  ? 'bg-green-100 dark:bg-green-900'
                  : trend?.isPositive === false
                    ? 'bg-red-100 dark:bg-red-900'
                    : 'bg-blue-100 dark:bg-blue-900'
            }
          `}
        >
          {loading ? (
            <Box className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
          ) : (
            <Icon
              className={`
                w-6 h-6
                ${
                  trend?.isPositive
                    ? 'text-green-600 dark:text-green-400'
                    : trend?.isPositive === false
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-blue-600 dark:text-blue-400'
                }
              `}
            />
          )}
        </Box>
      </Flex>
    </RadixCard>
  );
}
