import { ReactNode } from 'react';
import { Box, Flex, Heading, Text } from '@radix-ui/themes';
import { RadixCard } from './RadixCard';

interface ModernCardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  headerActions?: ReactNode;
  headerGradient?: 'blue' | 'green' | 'gray' | 'purple' | 'orange' | 'none';
  statusIndicator?: {
    position: 'left' | 'top' | 'none';
    color: 'green' | 'red' | 'orange' | 'blue' | 'purple' | 'gray';
  };
  variant?: 'default' | 'elevated' | 'glass' | 'minimal';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  animation?: 'none' | 'slide-up' | 'slide-right' | 'fade' | 'scale';
  animationDelay?: number;
  className?: string;
  onClick?: () => void;
}

const headerGradientClasses = {
  blue: 'bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100',
  green:
    'bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100',
  gray: 'bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200',
  purple:
    'bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-100',
  orange:
    'bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100',
  none: 'border-b border-gray-200',
};

const statusIndicatorClasses = {
  green: 'bg-green-500',
  red: 'bg-red-500',
  orange: 'bg-orange-500',
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  gray: 'bg-gray-400',
};

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

const animationClasses = {
  none: '',
  'slide-up': 'animate-in slide-in-from-bottom-1 duration-300',
  'slide-right': 'animate-in slide-in-from-right-1 duration-300',
  fade: 'animate-in fade-in duration-300',
  scale: 'animate-in zoom-in-95 duration-300',
};

export function ModernCard({
  children,
  title,
  subtitle,
  headerActions,
  headerGradient = 'none',
  statusIndicator,
  variant = 'default',
  padding = 'md',
  animation = 'none',
  animationDelay = 0,
  className = '',
  onClick,
}: ModernCardProps): JSX.Element {
  const hasHeader = title || subtitle || headerActions;
  const isClickable = !!onClick;

  return (
    <RadixCard
      className={`
        p-0
        shadow-xl
        border-0
        bg-white
        overflow-hidden
        transition-all
        duration-300
        relative
        group
        min-w-0
        word-break-break-word
        ${animationClasses[animation]}
        ${isClickable ? 'cursor-pointer hover:scale-[1.01] hover:shadow-2xl' : 'hover:shadow-2xl'}
        ${className}
      `}
      style={{ animationDelay: `${animationDelay}ms` }}
      onClick={onClick}
    >
      {/* Status Indicator */}
      {statusIndicator && statusIndicator.position === 'left' && (
        <Box
          className={`
            absolute left-0 top-0 bottom-0 w-1 rounded-l-xl
            ${statusIndicatorClasses[statusIndicator.color]}
          `}
        />
      )}

      {statusIndicator && statusIndicator.position === 'top' && (
        <Box
          className={`
            absolute top-0 left-0 right-0 h-1 rounded-t-xl
            ${statusIndicatorClasses[statusIndicator.color]}
          `}
        />
      )}

      {/* Header */}
      {hasHeader && (
        <Box className={`p-6 ${headerGradientClasses[headerGradient]}`}>
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
              <Box className="flex-shrink-0">{headerActions}</Box>
            )}
          </Flex>
        </Box>
      )}

      {/* Content */}
      <Box
        className={`
          ${
            hasHeader
              ? padding === 'none'
                ? ''
                : paddingClasses[padding]
              : paddingClasses[padding]
          }
          min-w-0
          overflow-hidden
        `}
      >
        {children}
      </Box>
    </RadixCard>
  );
}
