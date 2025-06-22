import { ReactNode } from 'react';
import { Box } from '@radix-ui/themes';

interface ModernGradientContainerProps {
  children: ReactNode;
  gradient?: 'blue' | 'green' | 'purple' | 'orange' | 'gray' | 'custom';
  customGradient?: string;
  variant?: 'soft' | 'vibrant' | 'subtle';
  borderRadius?: 'sm' | 'md' | 'lg' | 'xl';
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
}

const gradientClasses = {
  blue: {
    soft: 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100',
    vibrant: 'bg-gradient-to-r from-blue-600 to-purple-600',
    subtle: 'bg-gradient-to-r from-blue-25 to-blue-50 border border-blue-200',
  },
  green: {
    soft: 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100',
    vibrant: 'bg-gradient-to-r from-green-600 to-emerald-600',
    subtle:
      'bg-gradient-to-r from-green-25 to-green-50 border border-green-200',
  },
  purple: {
    soft: 'bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-100',
    vibrant: 'bg-gradient-to-r from-purple-600 to-violet-600',
    subtle:
      'bg-gradient-to-r from-purple-25 to-purple-50 border border-purple-200',
  },
  orange: {
    soft: 'bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100',
    vibrant: 'bg-gradient-to-r from-orange-600 to-amber-600',
    subtle:
      'bg-gradient-to-r from-orange-25 to-orange-50 border border-orange-200',
  },
  gray: {
    soft: 'bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200',
    vibrant: 'bg-gradient-to-r from-gray-600 to-gray-700',
    subtle: 'bg-gradient-to-r from-gray-25 to-gray-50 border border-gray-200',
  },
  custom: {
    soft: '',
    vibrant: '',
    subtle: '',
  },
};

const radiusClasses = {
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  xl: 'rounded-3xl',
};

const paddingClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function ModernGradientContainer({
  children,
  gradient = 'blue',
  customGradient,
  variant = 'soft',
  borderRadius = 'md',
  padding = 'md',
  className = '',
}: ModernGradientContainerProps): JSX.Element {
  const gradientClass =
    gradient === 'custom' && customGradient
      ? customGradient
      : gradientClasses[gradient][variant];

  return (
    <Box
      className={`
        ${gradientClass}
        ${radiusClasses[borderRadius]}
        ${paddingClasses[padding]}
        shadow-lg
        transition-all
        duration-300
        ${className}
      `}
    >
      {children}
    </Box>
  );
}
