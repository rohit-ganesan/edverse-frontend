import React from 'react';
import { Grid } from '@radix-ui/themes';
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
  return (
    <Grid columns={columns} gap="4" className={`mb-6 ${className}`}>
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          iconColor={stat.iconColor}
          iconBgColor={stat.iconBgColor}
          trend={stat.trend}
        />
      ))}
    </Grid>
  );
}
