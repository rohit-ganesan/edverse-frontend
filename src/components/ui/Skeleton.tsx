import React from 'react';
import { cn } from '../../lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  animate?: boolean;
}

/**
 * Generic Skeleton loader component
 */
export function Skeleton({
  width = '100%',
  height = '1rem',
  borderRadius = '0.375rem',
  className = '',
  animate = true,
  ...props
}: SkeletonProps): JSX.Element {
  return (
    <div
      className={cn(
        'bg-gray-200 dark:bg-gray-700',
        animate ? 'animate-pulse' : '',
        className
      )}
      style={{
        width,
        height,
        borderRadius,
      }}
      {...props}
    />
  );
}

// Skeleton variants for common UI patterns
export function SkeletonText({
  lines = 1,
  ...rest
}: { lines?: number } & SkeletonProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} height="1em" width="100%" {...rest} />
      ))}
    </div>
  );
}

export function SkeletonCircle({
  size = 40,
  ...rest
}: { size?: number } & SkeletonProps) {
  return <Skeleton width={size} height={size} borderRadius={9999} {...rest} />;
}

export function SkeletonCard({ height = 120, ...rest }: SkeletonProps) {
  return <Skeleton width="100%" height={height} borderRadius={16} {...rest} />;
}

export function SkeletonTableRow({
  columns = 4,
  ...rest
}: { columns?: number } & SkeletonProps) {
  return (
    <div className="flex w-full">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton
          key={i}
          height="1.5em"
          width="100%"
          className="mx-2 flex-1"
          {...rest}
        />
      ))}
    </div>
  );
}
