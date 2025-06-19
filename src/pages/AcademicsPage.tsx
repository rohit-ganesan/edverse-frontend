import { Box, Flex, Text, Heading, Grid } from '@radix-ui/themes';
import { DashboardLayout } from 'components/layout/DashboardLayout';
import { RadixCard } from 'components/ui/RadixCard';
import { BookOpen, Users, FileText } from 'lucide-react';

export function AcademicsPage(): JSX.Element {
  return (
    <DashboardLayout>
      <Box className="mb-6">
        <Heading size="6" className="text-gray-900 mb-2">
          Academics
        </Heading>
        <Text size="3" className="text-gray-600">
          Manage subjects, classes, and academic content
        </Text>
      </Box>

      <Grid columns="3" gap="6">
        <RadixCard
          size="2"
          className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <Flex direction="column" gap="4">
            <Box className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </Box>
            <Box>
              <Heading size="4" className="text-gray-900 mb-2">
                Subjects
              </Heading>
              <Text size="2" className="text-gray-600 mb-3">
                Manage academic subjects and curriculum
              </Text>
              <Text size="2" weight="medium" className="text-blue-600">
                12 Active Subjects
              </Text>
            </Box>
          </Flex>
        </RadixCard>

        <RadixCard
          size="2"
          className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <Flex direction="column" gap="4">
            <Box className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </Box>
            <Box>
              <Heading size="4" className="text-gray-900 mb-2">
                Classes
              </Heading>
              <Text size="2" className="text-gray-600 mb-3">
                View and manage class schedules
              </Text>
              <Text size="2" weight="medium" className="text-green-600">
                24 Active Classes
              </Text>
            </Box>
          </Flex>
        </RadixCard>

        <RadixCard
          size="2"
          className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <Flex direction="column" gap="4">
            <Box className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-600" />
            </Box>
            <Box>
              <Heading size="4" className="text-gray-900 mb-2">
                Syllabus
              </Heading>
              <Text size="2" className="text-gray-600 mb-3">
                Academic syllabus and course outlines
              </Text>
              <Text size="2" weight="medium" className="text-purple-600">
                Updated Recently
              </Text>
            </Box>
          </Flex>
        </RadixCard>
      </Grid>
    </DashboardLayout>
  );
}
