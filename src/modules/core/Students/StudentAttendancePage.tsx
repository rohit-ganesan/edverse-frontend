import { DashboardLayout } from 'components/layout/DashboardLayout';
import { Box, Heading, Text } from '@radix-ui/themes';

export function StudentAttendancePage(): JSX.Element {
  return (
    <DashboardLayout>
      <Box className="p-6 space-y-2">
        <Heading size="6">Student Attendance</Heading>
        <Text size="2" color="gray">
          View a student's attendance records. (Placeholder)
        </Text>
      </Box>
    </DashboardLayout>
  );
}
