import { DashboardLayout } from 'components/layout/DashboardLayout';
import { Box, Heading, Text } from '@radix-ui/themes';

export function StudentAcademicsPage(): JSX.Element {
  return (
    <DashboardLayout>
      <Box className="p-6 space-y-2">
        <Heading size="6">Student Academics</Heading>
        <Text size="2" color="gray">
          View a student's academic overview. (Placeholder)
        </Text>
      </Box>
    </DashboardLayout>
  );
}
