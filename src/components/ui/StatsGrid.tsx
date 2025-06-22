import React from 'react';
import { Grid, Box } from '@radix-ui/themes';
import { StatsCard } from './StatsCard';
import { LucideIcon } from 'lucide-react';

interface StatItem {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
}

interface StatsGridProps {
  stats: StatItem[];
  columns?: '2' | '3' | '4';
  className?: string;
}

export function StatsGrid({
  stats,
  columns = '4',
  className = '',
}: StatsGridProps): JSX.Element {
  // Validate stats array
  if (!Array.isArray(stats) || stats.length === 0) {
    return (
      <Box className={`mb-8 ${className}`}>
        <Grid columns={columns} gap="6">
          {/* Empty placeholder cards */}
          {Array.from({ length: parseInt(columns) }).map((_, index) => (
            <Box
              key={index}
              className="h-24 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center"
            >
              <span className="text-gray-400 text-sm">No data</span>
            </Box>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box className={`mb-8 ${className}`}>
      <Grid
        columns={columns}
        gap="6"
        className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
      >
        {stats.map((stat, index) => (
          <Box
            key={index}
            className="animate-in fade-in-0 slide-in-from-bottom-2 duration-700"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <StatsCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              iconColor={stat.iconColor}
              iconBgColor={stat.iconBgColor}
              trend={stat.trend}
            />
          </Box>
        ))}
      </Grid>
    </Box>
  );
}
