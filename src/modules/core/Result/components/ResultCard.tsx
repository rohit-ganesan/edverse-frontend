import { Box, Flex, Text, Badge } from '@radix-ui/themes';
import { RadixCard } from 'components/ui/RadixCard';
import { StudentResult } from '../types';
import { useResultManagement } from '../hooks/useResultManagement';

interface ResultCardProps {
  result: StudentResult;
  onClick?: () => void;
}

export function ResultCard({ result, onClick }: ResultCardProps): JSX.Element {
  const { getGradeColor } = useResultManagement();

  return (
    <RadixCard
      className={
        onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
      }
    >
      <Box className="p-4" onClick={onClick}>
        <Flex justify="between" align="start" className="mb-3">
          <Box>
            <Text weight="medium" className="text-gray-900 dark:text-white">
              {result.studentName}
            </Text>
            <Text size="2" className="text-gray-600 dark:text-gray-400">
              {result.studentId}
            </Text>
          </Box>
          <Badge color={getGradeColor(result.grade)}>{result.grade}</Badge>
        </Flex>

        <Box className="mb-3">
          <Text size="2" className="text-gray-600 dark:text-gray-400">
            {result.course} • {result.semester} {result.year}
          </Text>
        </Box>

        <Flex justify="between" align="center">
          <Box>
            <Text size="2" className="text-gray-600 dark:text-gray-400">
              GPA: {result.gpa}
            </Text>
          </Box>
          <Box>
            <Text
              size="2"
              weight="medium"
              className="text-gray-900 dark:text-white"
            >
              {result.percentage.toFixed(1)}%
            </Text>
          </Box>
        </Flex>
      </Box>
    </RadixCard>
  );
}
