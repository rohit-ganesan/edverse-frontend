import { Box, Flex, Text, Badge } from '@radix-ui/themes';
import { RadixCard } from 'components/ui/RadixCard';
import { Users, Clock, User } from 'lucide-react';

interface ClassCardProps {
  classData: {
    id: string;
    name: string;
    subject: string;
    grade: string;
    section: string;
    instructor: string;
    schedule: string;
    students: number;
    isActive: boolean;
  };
}

export function ClassCard({ classData }: ClassCardProps): JSX.Element {
  return (
    <RadixCard className="p-4 hover:shadow-lg transition-shadow">
      <Flex justify="between" align="start" className="mb-3">
        <Box>
          <Text size="3" weight="bold" className="text-gray-900">
            {classData.name}
          </Text>
          <Text size="2" className="text-gray-600">
            Grade {classData.grade} - Section {classData.section}
          </Text>
        </Box>
        <Badge color={classData.isActive ? 'green' : 'gray'} variant="soft">
          {classData.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </Flex>

      <Box className="space-y-2">
        <Flex align="center" gap="2">
          <User className="w-4 h-4 text-gray-500" />
          <Text size="2" className="text-gray-700">
            {classData.instructor}
          </Text>
        </Flex>

        <Flex align="center" gap="2">
          <Clock className="w-4 h-4 text-gray-500" />
          <Text size="2" className="text-gray-700">
            {classData.schedule}
          </Text>
        </Flex>

        <Flex align="center" gap="2">
          <Users className="w-4 h-4 text-gray-500" />
          <Text size="2" className="text-gray-700">
            {classData.students} students
          </Text>
        </Flex>
      </Box>
    </RadixCard>
  );
}
