import { ReactNode } from 'react';
import { Box, Flex, Text, Heading } from '@radix-ui/themes';
import { RadixCard } from './RadixCard';

interface ModernStatsCardProps {
  icon: ReactNode;
  value: string | number;
  label: string;
  iconColor: 'green' | 'red' | 'orange' | 'blue' | 'purple' | 'gray';
  labelColor?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  variant?: 'default' | 'glass' | 'solid';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  title?: string;
  subtitle?: string;
  headerActions?: ReactNode;
  headerGradient?: string;
  hasHeader?: boolean;
}

const iconColorClasses = {
  green: { bg: 'bg-green-100', text: 'text-green-600', ring: 'ring-green-200' },
  red: { bg: 'bg-red-100', text: 'text-red-600', ring: 'ring-red-200' },
  orange: {
    bg: 'bg-orange-100',
    text: 'text-orange-600',
    ring: 'ring-orange-200',
  },
  blue: { bg: 'bg-blue-100', text: 'text-blue-600', ring: 'ring-blue-200' },
  purple: {
    bg: 'bg-purple-100',
    text: 'text-purple-600',
    ring: 'ring-purple-200',
  },
  gray: { bg: 'bg-gray-100', text: 'text-gray-600', ring: 'ring-gray-200' },
};

const sizeClasses = {
  sm: {
    container: 'p-4',
    icon: 'w-10 h-10',
    iconSize: 'w-5 h-5',
    value: 'text-lg',
    label: 'text-xs',
    gap: 'gap-3',
  },
  md: {
    container: 'p-5',
    icon: 'w-12 h-12',
    iconSize: 'w-6 h-6',
    value: 'text-xl',
    label: 'text-xs',
    gap: 'gap-4',
  },
  lg: {
    container: 'p-6',
    icon: 'w-14 h-14',
    iconSize: 'w-7 h-7',
    value: 'text-2xl',
    label: 'text-sm',
    gap: 'gap-4',
  },
};

export function ModernStatsCard({
  icon,
  value,
  label,
  iconColor,
  labelColor,
  trend,
  variant = 'default',
  size = 'md',
  className = '',
  title,
  subtitle,
  headerActions,
  headerGradient,
  hasHeader = true,
}: ModernStatsCardProps): JSX.Element {
  const sizeConfig = sizeClasses[size];
  const colorConfig = iconColorClasses[iconColor];
  const finalLabelColor = labelColor || 'text-gray-600';

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
      className={`
        p-0 
        shadow-lg 
        hover:shadow-xl 
        border-0 
        bg-white dark:bg-gray-800
        overflow-hidden 
        transition-all 
        duration-300 
        hover:scale-[1.02] 
        ${className}
      `}
    >
      <Box className={sizeConfig.container}>
        <Flex align="center" className={sizeConfig.gap}>
          {/* Icon container with proper sizing */}
          <Box
            className={`
              ${sizeConfig.icon} 
              ${colorConfig.bg} 
              dark:bg-gray-700
              rounded-xl 
              flex 
              items-center 
              justify-center
              flex-shrink-0
              shadow-sm
              ring-1
              ring-gray-100
              ${colorConfig.ring}
            `}
          >
            <Box
              className={`${sizeConfig.iconSize} ${colorConfig.text} dark:text-gray-200`}
            >
              {icon}
            </Box>
          </Box>

          {/* Content container */}
          <Box className="flex-1 min-w-0">
            {/* Value and trend section */}
            <Flex justify="between" align="start" className="mb-2">
              <Text
                className={`${sizeConfig.value} font-bold text-gray-900 dark:text-gray-100 leading-none`}
              >
                {safeValue()}
              </Text>
              {safeTrend && (
                <Box
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    getTrendDirection()
                      ? 'bg-green-50 text-green-700 ring-1 ring-green-200 dark:bg-green-900 dark:text-green-200 dark:ring-green-800'
                      : 'bg-red-50 text-red-700 ring-1 ring-red-200 dark:bg-red-900 dark:text-red-200 dark:ring-red-800'
                  }`}
                >
                  <Flex align="center" gap="1">
                    <span>{getTrendDirection() ? '\u2197' : '\u2198'}</span>
                    <span>{getTrendValue()}</span>
                  </Flex>
                </Box>
              )}
            </Flex>

            {/* Label section with proper typography */}
            <Text
              className={`${sizeConfig.label} ${finalLabelColor} dark:text-gray-400 font-medium leading-tight block`}
            >
              {label}
            </Text>
          </Box>
        </Flex>
      </Box>
      {hasHeader && (
        <Box
          className={`p-6 ${headerGradient} dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 dark:border-b dark:border-gray-800`}
        >
          <Flex justify="between" align="center" gap="4">
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
            {headerActions && (
              <Box className="flex-shrink-0">{headerActions}</Box>
            )}
          </Flex>
        </Box>
      )}
    </RadixCard>
  );
}
