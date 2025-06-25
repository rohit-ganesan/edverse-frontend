import React from 'react';
import { Box, Flex, Text, Heading, Grid } from '@radix-ui/themes';
import { LucideIcon } from 'lucide-react';

/**
 * Configuration for a single colored stat item
 */
export interface ColoredStatItem {
  /** The title/label displayed above the value */
  title: string;
  /** The main value to display (can be string, number, null, or undefined - safely handled) */
  value: string | number | null | undefined;
  /** Optional subtitle text displayed below the value */
  subtitle?: string;
  /** Lucide icon component to display */
  icon: LucideIcon;
  /** Gradient configuration for the card background */
  gradient: {
    /** Tailwind gradient from class (e.g., 'from-emerald-50') */
    from: string;
    /** Tailwind gradient to class (e.g., 'to-green-50') */
    to: string;
  };
  /** Tailwind text color class for the icon (e.g., 'text-emerald-600') */
  iconColor: string;
  /** Tailwind background color class for the icon container (e.g., 'bg-emerald-100') */
  iconBgColor: string;
  /** Optional trend indicator */
  trend?: {
    /** Icon to display for the trend */
    icon: LucideIcon;
    /** Trend text/value */
    value: string;
    /** Tailwind text color class for the trend */
    color: string;
  };
}

interface ModernStatsGridColoredProps {
  /** Array of stat items to display */
  stats: ColoredStatItem[];
  /** Number of columns in the grid */
  columns?: '1' | '2' | '3' | '4' | '5' | '6';
  /** Gap size between grid items */
  gap?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
  /** Additional CSS classes */
  className?: string;
  /** Loading state for API calls - shows loading indicators when true */
  isLoading?: boolean;
}

/**
 * ModernStatsGridColored - A reusable component for displaying statistics in colorful gradient cards
 *
 * Features:
 * - Beautiful gradient backgrounds with customizable colors
 * - Support for icons, values, titles, and trend indicators
 * - Responsive grid layout with configurable columns
 * - Clean card styling with rounded corners and shadows (no unwanted borders)
 * - Built-in bottom margin (mb-8) for proper spacing from content below
 * - Safe stat value conversion with null/undefined handling
 * - Loading state support for API calls (shows '...' when loading)
 * - TypeScript support with comprehensive interfaces
 *
 * @example
 * ```tsx
 * import { ModernStatsGridColored, ColoredStatItem } from 'components/ui/ModernStatsGridColored';
 * import { DollarSign, TrendingUp, ArrowUpRight } from 'lucide-react';
 *
 * const stats: ColoredStatItem[] = [
 *   {
 *     title: 'Total Revenue',
 *     value: '$125,430',
 *     icon: DollarSign,
 *     gradient: {
 *       from: 'from-emerald-50',
 *       to: 'to-green-50',
 *     },
 *     iconColor: 'text-emerald-600',
 *     iconBgColor: 'bg-emerald-100',
 *     trend: {
 *       icon: ArrowUpRight,
 *       value: '+12.5% vs last month',
 *       color: 'text-green-600',
 *     },
 *   },
 * ];
 *
 * <ModernStatsGridColored
 *   stats={stats}
 *   columns="4"
 *   gap="6"
 *   isLoading={isLoadingStats}
 * />
 * ```
 */
export function ModernStatsGridColored({
  stats,
  columns = '4',
  gap = '6',
  className = '',
  isLoading = false,
}: ModernStatsGridColoredProps): JSX.Element {
  // Safe stat value conversion
  const getStatValue = (value: unknown, fallback: string = '0'): string => {
    if (isLoading) return '...';
    if (value === null || value === undefined) return fallback;
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'string') return value;
    return fallback;
  };

  if (!stats || stats.length === 0) {
    return <Box className={`mb-8 ${className}`} />;
  }

  return (
    <Box className={`mb-8 ${className}`}>
      <Grid columns={columns} gap={gap}>
        {stats.map((stat, index) => (
          <div
            key={index}
            className="rounded-lg shadow-lg overflow-hidden bg-white"
            style={{ border: 'none', outline: 'none' }}
          >
            <Box
              className={`p-6 bg-gradient-to-br ${stat.gradient.from} ${stat.gradient.to}`}
            >
              <Flex justify="between" align="start">
                <Box>
                  <Text size="2" className="text-gray-600 mb-1">
                    {stat.title}
                  </Text>
                  <Heading size="6" className="text-gray-900 mb-2">
                    {getStatValue(stat.value)}
                  </Heading>
                  {stat.trend ? (
                    <Flex align="center" gap="1">
                      <stat.trend.icon
                        className={`w-3 h-3 ${stat.trend.color}`}
                      />
                      <Text
                        size="1"
                        className={`${stat.trend.color} font-medium`}
                      >
                        {stat.trend.value}
                      </Text>
                    </Flex>
                  ) : stat.subtitle ? (
                    <Text size="1" className="text-gray-600 font-medium">
                      {stat.subtitle}
                    </Text>
                  ) : null}
                </Box>
                <Box className={`p-3 ${stat.iconBgColor} rounded-lg`}>
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </Box>
              </Flex>
            </Box>
          </div>
        ))}
      </Grid>
    </Box>
  );
}
