import { Box, Text } from '@radix-ui/themes';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'grade';
  size?: 'small' | 'medium';
  className?: string;
}

export function StatusBadge({
  status,
  variant = 'default',
  size = 'medium',
  className = '',
}: StatusBadgeProps): JSX.Element {
  // Safe status processing
  const safeStatus = status || 'Unknown';

  // Auto-detect variant based on common status values if not specified
  const getVariantFromStatus = (statusText: string): string => {
    const lowerStatus = statusText.toLowerCase();

    // Success statuses
    if (['active', 'completed', 'passed', 'approved'].includes(lowerStatus)) {
      return 'success';
    }

    // Warning statuses
    if (['pending', 'on leave', 'warning', 'late'].includes(lowerStatus)) {
      return 'warning';
    }

    // Error statuses
    if (['inactive', 'failed', 'rejected', 'error'].includes(lowerStatus)) {
      return 'error';
    }

    // Grade detection
    if (/^[A-F][+-]?$/.test(statusText)) {
      return 'grade';
    }

    return 'default';
  };

  // Use auto-detected variant if variant is 'default'
  const effectiveVariant =
    variant === 'default' ? getVariantFromStatus(safeStatus) : variant;

  // Size configurations
  const sizeConfig = {
    small: {
      padding: 'px-2 py-0.5',
      text: '1',
    },
    medium: {
      padding: 'px-2 py-1',
      text: '1',
    },
  };

  // Variant color configurations
  const variantConfig = {
    default: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    success:
      'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    warning:
      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    error: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    grade: getGradeColor(safeStatus),
  };

  // Grade-specific color logic
  function getGradeColor(grade: string): string {
    const upperGrade = grade.toUpperCase();
    if (upperGrade.startsWith('A')) {
      return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
    }
    if (upperGrade.startsWith('B')) {
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
    }
    if (upperGrade.startsWith('C')) {
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
    }
    if (upperGrade.startsWith('D')) {
      return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
    }
    if (upperGrade.startsWith('F')) {
      return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
    }
    return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
  }

  const currentSize = sizeConfig[size];
  const currentVariant =
    variantConfig[effectiveVariant as keyof typeof variantConfig] ||
    variantConfig.default;

  return (
    <Box
      className={`
        inline-flex 
        items-center 
        justify-center
        ${currentSize.padding}
        rounded-full 
        text-xs 
        font-medium
        ${currentVariant}
        ${className}
      `}
    >
      <Text size={currentSize.text as any} weight="medium">
        {safeStatus}
      </Text>
    </Box>
  );
}
