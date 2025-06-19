import { Box, Flex, Text, Heading, Select } from '@radix-ui/themes';
import { RadixCard } from 'components/ui/RadixCard';
import { MoreHorizontal } from 'lucide-react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  showSelector?: boolean;
  selectorOptions?: Array<{ value: string; label: string }>;
  className?: string;
  children: React.ReactNode;
}

export function ChartCard({
  title,
  subtitle,
  showSelector = false,
  selectorOptions = [],
  className = '',
  children,
}: ChartCardProps): JSX.Element {
  return (
    <RadixCard size="2" className={`p-6 ${className}`}>
      <Flex justify="between" align="center" className="mb-6">
        <Box>
          <Heading size="4" className="text-gray-900 dark:text-gray-100 mb-1">
            {title}
          </Heading>
          {subtitle && (
            <Text size="2" className="text-gray-600 dark:text-gray-400">
              {subtitle}
            </Text>
          )}
        </Box>
        <Flex align="center" gap="3">
          {showSelector && selectorOptions.length > 0 && (
            <Select.Root defaultValue={selectorOptions[0]?.value}>
              <Select.Trigger />
              <Select.Content>
                {selectorOptions.map((option) => (
                  <Select.Item key={option.value} value={option.value}>
                    {option.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          )}
          <MoreHorizontal className="w-5 h-5 text-gray-400 dark:text-gray-500 cursor-pointer" />
        </Flex>
      </Flex>
      {children}
    </RadixCard>
  );
}

// Mock Area Chart Component
export function MockAreaChart(): JSX.Element {
  return (
    <Box className="h-64 bg-gradient-to-b from-blue-50 to-orange-50 dark:from-blue-900/20 dark:to-orange-900/20 rounded-lg relative">
      {/* Legend - moved to top */}
      <Box className="absolute top-4 left-4 z-10">
        <Flex gap="4">
          <Flex align="center" gap="2">
            <Box className="w-3 h-3 bg-blue-500 rounded-full"></Box>
            <Text size="1" className="text-gray-600 dark:text-gray-400">
              Present
            </Text>
          </Flex>
          <Flex align="center" gap="2">
            <Box className="w-3 h-3 bg-orange-500 rounded-full"></Box>
            <Text size="1" className="text-gray-600 dark:text-gray-400">
              Absent
            </Text>
          </Flex>
        </Flex>
      </Box>

      {/* Chart area with proper spacing */}
      <Box className="h-full pt-12 pb-8">
        <svg
          className="w-full h-full"
          viewBox="0 0 400 160"
          preserveAspectRatio="none"
        >
          {/* Area chart paths */}
          <path
            d="M0,120 Q50,90 100,100 T200,80 T300,90 T400,70 L400,160 L0,160 Z"
            fill="rgba(59, 130, 246, 0.3)"
            stroke="rgba(59, 130, 246, 0.8)"
            strokeWidth="2"
          />
          <path
            d="M0,140 Q50,130 100,135 T200,125 T300,130 T400,120 L400,160 L0,160 Z"
            fill="rgba(249, 115, 22, 0.3)"
            stroke="rgba(249, 115, 22, 0.8)"
            strokeWidth="2"
          />
        </svg>
      </Box>

      {/* X-axis labels - better positioned */}
      <Box className="absolute bottom-2 left-0 right-0 flex justify-between px-6">
        {[
          'Jun 24',
          'Jun 25',
          'Jun 26',
          'Jun 27',
          'Jun 28',
          'Jun 29',
          'Jun 30',
        ].map((date) => (
          <Text
            key={date}
            size="1"
            className="text-gray-500 dark:text-gray-400"
          >
            {date}
          </Text>
        ))}
      </Box>
    </Box>
  );
}

// Mock Bar Chart Component
export function MockBarChart(): JSX.Element {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const incomeData = [60, 80, 40, 100, 70, 90, 85, 65, 95, 75, 55, 80];
  const expenseData = [45, 65, 35, 80, 55, 70, 60, 50, 75, 60, 45, 65];

  return (
    <Box className="h-80 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
      {/* Legend at top-left */}
      <Box className="mb-4">
        <Flex gap="4">
          <Flex align="center" gap="2">
            <Box className="w-3 h-3 bg-green-500 rounded-full"></Box>
            <Text size="1" className="text-gray-600 dark:text-gray-400">
              Income
            </Text>
          </Flex>
          <Flex align="center" gap="2">
            <Box className="w-3 h-3 bg-orange-500 rounded-full"></Box>
            <Text size="1" className="text-gray-600 dark:text-gray-400">
              Expense
            </Text>
          </Flex>
        </Flex>
      </Box>

      {/* Chart area with proper height */}
      <Box className="h-56">
        <Flex className="h-full" align="end" gap="2" justify="center">
          {months.map((month, index) => (
            <Flex
              key={month}
              direction="column"
              align="center"
              gap="2"
              className="flex-1"
            >
              <Flex direction="column" gap="1" className="w-full">
                <Box
                  className="bg-green-500 rounded-t w-full"
                  style={{
                    height: `${Math.max(incomeData[index] * 0.8, 10)}px`,
                  }}
                />
                <Box
                  className="bg-orange-500 rounded-b w-full"
                  style={{
                    height: `${Math.max(expenseData[index] * 0.8, 10)}px`,
                  }}
                />
              </Flex>
              <Text size="1" className="text-gray-500 dark:text-gray-400 mt-1">
                {month}
              </Text>
            </Flex>
          ))}
        </Flex>
      </Box>
    </Box>
  );
}

// Mock Donut Chart Component
export function MockDonutChart({
  value = 475,
}: {
  value?: number;
}): JSX.Element {
  const percentage = 65; // Mock percentage
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Box className="h-48 flex items-center justify-center">
      <Box className="relative">
        <svg width="120" height="120" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200 dark:text-gray-700"
          />
          {/* Progress circle */}
          <circle
            cx="60"
            cy="60"
            r="45"
            stroke="#10b981"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <Box className="absolute inset-0 flex items-center justify-center">
          <Box className="text-center">
            <Heading size="5" className="text-gray-900 dark:text-gray-100">
              {value}
            </Heading>
            <Text size="1" className="text-gray-600 dark:text-gray-400">
              USD
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
