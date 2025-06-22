import { Box, Text, Flex } from '@radix-ui/themes';

interface AttendanceIndicatorProps {
  percentage: string | number;
  showPercentage?: boolean;
  size?: 'small' | 'medium';
  className?: string;
}

export function AttendanceIndicator({
  percentage,
  showPercentage = true,
  size = 'medium',
  className = '',
}: AttendanceIndicatorProps): JSX.Element {
  // Safe percentage processing
  const getNumericPercentage = (value: string | number): number => {
    if (typeof value === 'number') {
      return Math.max(0, Math.min(100, value));
    }

    if (typeof value !== 'string') {
      console.warn('AttendanceIndicator: Invalid percentage value:', value);
      return 0;
    }

    try {
      // Remove % symbol and parse
      const cleanValue = value.toString().replace('%', '').trim();
      const numValue = parseFloat(cleanValue);

      if (isNaN(numValue)) {
        console.warn('AttendanceIndicator: Could not parse percentage:', value);
        return 0;
      }

      return Math.max(0, Math.min(100, numValue));
    } catch (error) {
      console.error(
        'AttendanceIndicator: Error parsing percentage:',
        error,
        value
      );
      return 0;
    }
  };

  const numericPercentage = getNumericPercentage(percentage);
  const displayPercentage =
    typeof percentage === 'string' && percentage.includes('%')
      ? percentage
      : `${numericPercentage}%`;

  // Color logic based on attendance percentage
  const getAttendanceColor = (percent: number): string => {
    if (percent >= 90) return '#10b981'; // Green - Excellent
    if (percent >= 80) return '#f59e0b'; // Yellow - Good
    if (percent >= 70) return '#f97316'; // Orange - Fair
    return '#ef4444'; // Red - Poor
  };

  // Size configurations
  const sizeConfig = {
    small: {
      dot: 'w-1.5 h-1.5',
      text: '1',
      gap: 'gap-1.5',
    },
    medium: {
      dot: 'w-2 h-2',
      text: '2',
      gap: 'gap-2',
    },
  };

  const currentSize = sizeConfig[size];
  const attendanceColor = getAttendanceColor(numericPercentage);

  return (
    <Flex align="center" className={`${currentSize.gap} ${className}`}>
      <Box
        className={`${currentSize.dot} rounded-full flex-shrink-0`}
        style={{ backgroundColor: attendanceColor }}
      />
      {showPercentage && (
        <Text
          size={currentSize.text as any}
          className="text-gray-700 dark:text-gray-300"
        >
          {displayPercentage}
        </Text>
      )}
    </Flex>
  );
}
