import React from 'react';
import { Skeleton as RadixSkeleton } from '@radix-ui/themes';

interface SkeletonProps
  extends Omit<React.ComponentProps<typeof RadixSkeleton>, 'width' | 'height'> {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
  animate?: boolean;
}

/**
 * Generic Skeleton loader component (Radix UI)
 */
export function Skeleton({
  width = '100%',
  height = '1rem',
  borderRadius = '0.375rem',
  className = '',
  animate = true, // Radix always animates, so this is ignored
  ...props
}: SkeletonProps & {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
}): JSX.Element {
  return (
    <RadixSkeleton
      width={typeof width === 'number' ? `${width}px` : width}
      height={typeof height === 'number' ? `${height}px` : height}
      className={className}
      style={{
        borderRadius: borderRadius
          ? typeof borderRadius === 'number'
            ? `${borderRadius}px`
            : borderRadius
          : undefined,
        ...props.style,
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
  return (
    <Skeleton
      width={`${size}px`}
      height={`${size}px`}
      borderRadius="9999px"
      {...rest}
    />
  );
}

export function SkeletonCard({ height = '120px', ...rest }: SkeletonProps) {
  return (
    <Skeleton width="100%" height={height} borderRadius="16px" {...rest} />
  );
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
