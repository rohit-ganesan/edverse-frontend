import { Box, Flex, Text, Badge, Progress } from '@radix-ui/themes';
import { RadixCard } from 'components/ui/RadixCard';
import { Clock, Award, User } from 'lucide-react';

interface CourseCardProps {
  courseData: {
    id: string;
    name: string;
    code: string;
    description: string;
    credits: number;
    duration: string;
    enrolledStudents: number;
    maxCapacity: number;
    instructor: string;
    isActive: boolean;
  };
}

export function CourseCard({ courseData }: CourseCardProps): JSX.Element {
  const enrollmentPercentage =
    (courseData.enrolledStudents / courseData.maxCapacity) * 100;

  return (
    <RadixCard className="p-4 hover:shadow-lg transition-shadow">
      <Flex justify="between" align="start" className="mb-3">
        <Box>
          <Text size="3" weight="bold" className="text-gray-900">
            {courseData.name}
          </Text>
          <Text size="2" className="text-gray-600">
            {courseData.code}
          </Text>
        </Box>
        <Badge color={courseData.isActive ? 'green' : 'gray'} variant="soft">
          {courseData.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </Flex>

      <Text size="2" className="text-gray-700 mb-3">
        {courseData.description}
      </Text>

      <Box className="space-y-2">
        <Flex align="center" gap="2">
          <User className="w-4 h-4 text-gray-500" />
          <Text size="2" className="text-gray-700">
            {courseData.instructor}
          </Text>
        </Flex>

        <Flex align="center" gap="2">
          <Award className="w-4 h-4 text-gray-500" />
          <Text size="2" className="text-gray-700">
            {courseData.credits} credits
          </Text>
        </Flex>

        <Flex align="center" gap="2">
          <Clock className="w-4 h-4 text-gray-500" />
          <Text size="2" className="text-gray-700">
            {courseData.duration}
          </Text>
        </Flex>

        <Box>
          <Flex justify="between" align="center" className="mb-1">
            <Text size="2" className="text-gray-700">
              Enrollment
            </Text>
            <Text size="2" className="text-gray-600">
              {courseData.enrolledStudents}/{courseData.maxCapacity}
            </Text>
          </Flex>
          <Progress value={enrollmentPercentage} className="h-2" />
        </Box>
      </Box>
    </RadixCard>
  );
}
