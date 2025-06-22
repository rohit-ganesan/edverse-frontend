import { Box, Flex, Text, Badge } from '@radix-ui/themes';
import { StudentResult } from '../types';
import { useResultManagement } from '../hooks/useResultManagement';

interface TopPerformerItemProps {
  student: StudentResult;
  rank: number;
}

export function TopPerformerItem({
  student,
  rank,
}: TopPerformerItemProps): JSX.Element {
  const { getGradeColor } = useResultManagement();

  return (
    <Flex
      align="center"
      gap="3"
      className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
    >
      <Box className="flex-shrink-0">
        <Box className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
          <Text size="2" weight="bold" className="text-white">
            {rank}
          </Text>
        </Box>
      </Box>
      <Box className="flex-1">
        <Text weight="medium" className="text-gray-900 dark:text-white">
          {student.studentName}
        </Text>
        <Text size="2" className="text-gray-600 dark:text-gray-400">
          GPA: {student.gpa} • {student.percentage.toFixed(1)}%
        </Text>
      </Box>
      <Badge color={getGradeColor(student.grade)}>{student.grade}</Badge>
    </Flex>
  );
}
