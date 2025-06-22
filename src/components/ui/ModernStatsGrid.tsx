import { ReactNode } from 'react';
import { Grid, Box, Flex, Heading, Text } from '@radix-ui/themes';
import { ModernStatsCard } from './ModernStatsCard';

interface StatItem {
  icon: ReactNode;
  value: string | number;
  label: string;
  iconColor: 'green' | 'red' | 'orange' | 'blue' | 'purple' | 'gray';
  labelColor?: string;
}

interface ModernStatsGridProps {
  title?: string;
  subtitle?: string;
  stats: StatItem[];
  headerActions?: ReactNode;
  columns?: 2 | 3 | 4 | 5;
  variant?: 'default' | 'glass' | 'solid';
  size?: 'sm' | 'md' | 'lg';
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

const gapClasses = {
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
};

export function ModernStatsGrid({
  title,
  subtitle,
  stats,
  headerActions,
  columns = 4,
  variant = 'default',
  size = 'md',
  gap = 'md',
  className = '',
}: ModernStatsGridProps): JSX.Element {
  return (
    <Box className={`mb-8 ${className}`}>
      {/* Header */}
      {(title || subtitle || headerActions) && (
        <Box className="mb-6">
          <Flex justify="between" align="center" gap="4">
            <Box className="min-w-0 flex-1">
              {title && (
                <Heading size="5" className="text-gray-900 mb-1 truncate">
                  {title}
                </Heading>
              )}
              {subtitle && (
                <Text size="3" className="text-gray-600 line-clamp-2">
                  {subtitle}
                </Text>
              )}
            </Box>
            {headerActions && (
              <Box className="flex gap-2 flex-shrink-0">{headerActions}</Box>
            )}
          </Flex>
        </Box>
      )}

      {/* Stats Grid */}
      <Grid
        columns={{
          initial: '1',
          xs: '2',
          sm: columns >= 3 ? '3' : '2',
          md: columns.toString(),
        }}
        className={`${gapClasses[gap]} w-full animate-in fade-in-0 slide-in-from-bottom-4 duration-500`}
      >
        {stats.map((stat, index) => (
          <Box
            key={index}
            className="animate-in fade-in-0 slide-in-from-bottom-2 duration-700"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <ModernStatsCard
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              iconColor={stat.iconColor}
              labelColor={stat.labelColor}
              variant={variant}
              size={size}
              className="min-w-0 h-full"
            />
          </Box>
        ))}
      </Grid>
    </Box>
  );
}
