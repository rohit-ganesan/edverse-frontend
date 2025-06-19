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
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  className = '',
}: StatsCardProps): JSX.Element {
  return (
    <RadixCard size="2" className={`p-6 ${className}`}>
      <Flex justify="between" align="start">
        <Box>
          <Text size="2" className="text-gray-600 mb-1">
            {title}
          </Text>
          <Heading size="6" className="text-gray-900 mb-2">
            {value}
          </Heading>
          {trend && (
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
        </Box>
        <Box
          className={`
            w-12 h-12 rounded-full flex items-center justify-center
            ${
              trend?.isPositive
                ? 'bg-green-100'
                : trend?.isPositive === false
                  ? 'bg-red-100'
                  : 'bg-blue-100'
            }
          `}
        >
          <Icon
            className={`
              w-6 h-6
              ${
                trend?.isPositive
                  ? 'text-green-600'
                  : trend?.isPositive === false
                    ? 'text-red-600'
                    : 'text-blue-600'
              }
            `}
          />
        </Box>
      </Flex>
    </RadixCard>
  );
}
