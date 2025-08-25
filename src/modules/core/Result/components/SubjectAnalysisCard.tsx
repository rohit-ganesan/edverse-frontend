import { Box, Flex, Text, Grid } from '@radix-ui/themes';
import { SubjectAnalysis } from '../types';

interface SubjectAnalysisCardProps {
  subject: SubjectAnalysis;
}

export function SubjectAnalysisCard({
  subject,
}: SubjectAnalysisCardProps): JSX.Element {
  return (
    <Box className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <Flex justify="between" align="center" className="mb-2">
        <Text weight="medium" className="text-gray-900 dark:text-white">
          {subject.subjectName}
        </Text>
        <Text size="2" className="text-gray-600 dark:text-gray-400">
          {subject.subjectCode}
        </Text>
      </Flex>
      <Grid columns="3" gap="4">
        <Box>
          <Text size="2" className="text-gray-600 dark:text-gray-400">
            Average Marks
          </Text>
          <Text weight="medium" className="text-gray-900 dark:text-white">
            {subject.averageMarks}
          </Text>
        </Box>
        <Box>
          <Text size="2" className="text-gray-600 dark:text-gray-400">
            Pass Rate
          </Text>
          <Text weight="medium" className="text-gray-900 dark:text-white">
            {subject.passRate}%
          </Text>
        </Box>
        <Box>
          <Text size="2" className="text-gray-600 dark:text-gray-400">
            Highest
          </Text>
          <Text weight="medium" className="text-gray-900 dark:text-white">
            {subject.highestMarks}
          </Text>
        </Box>
      </Grid>
    </Box>
  );
}
