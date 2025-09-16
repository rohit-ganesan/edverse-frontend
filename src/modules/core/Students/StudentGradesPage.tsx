import { DashboardLayout } from 'components/layout/DashboardLayout';
import { Box, Heading, Text } from '@radix-ui/themes';

export function StudentGradesPage(): JSX.Element {
  return (
    <DashboardLayout>
      <Box className="p-6 space-y-2">
        <Heading size="6">Student Grades</Heading>
        <Text size="2" color="gray">
          View and manage student grades. (Placeholder)
        </Text>
      </Box>
    </DashboardLayout>
  );
}
