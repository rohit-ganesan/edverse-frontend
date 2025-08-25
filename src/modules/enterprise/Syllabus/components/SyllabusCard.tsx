import { Box, Flex, Text, Badge, Progress } from '@radix-ui/themes';
import { RadixCard } from 'components/ui/RadixCard';
import { BookOpen, Target, Calendar, CheckCircle } from 'lucide-react';

interface SyllabusCardProps {
  syllabusData: {
    id: string;
    title: string;
    subject: string;
    grade: string;
    topics: number;
    objectives: number;
    completionRate: number;
    lastUpdated: string;
    isActive: boolean;
  };
}

export function SyllabusCard({ syllabusData }: SyllabusCardProps): JSX.Element {
  return (
    <RadixCard className="p-4 hover:shadow-lg transition-shadow">
      <Flex justify="between" align="start" className="mb-3">
        <Box>
          <Text size="3" weight="bold" className="text-gray-900">
            {syllabusData.title}
          </Text>
          <Text size="2" className="text-gray-600">
            {syllabusData.subject} - Grade {syllabusData.grade}
          </Text>
        </Box>
        <Badge color={syllabusData.isActive ? 'green' : 'gray'} variant="soft">
          {syllabusData.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </Flex>

      <Box className="space-y-2">
        <Flex align="center" gap="2">
          <BookOpen className="w-4 h-4 text-gray-500" />
          <Text size="2" className="text-gray-700">
            {syllabusData.topics} topics
          </Text>
        </Flex>

        <Flex align="center" gap="2">
          <Target className="w-4 h-4 text-gray-500" />
          <Text size="2" className="text-gray-700">
            {syllabusData.objectives} objectives
          </Text>
        </Flex>

        <Flex align="center" gap="2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <Text size="2" className="text-gray-700">
            Updated: {new Date(syllabusData.lastUpdated).toLocaleDateString()}
          </Text>
        </Flex>

        <Box>
          <Flex justify="between" align="center" className="mb-1">
            <Flex align="center" gap="2">
              <CheckCircle className="w-4 h-4 text-gray-500" />
              <Text size="2" className="text-gray-700">
                Completion
              </Text>
            </Flex>
            <Text size="2" className="text-gray-600">
              {syllabusData.completionRate}%
            </Text>
          </Flex>
          <Progress value={syllabusData.completionRate} className="h-2" />
        </Box>
      </Box>
    </RadixCard>
  );
}
