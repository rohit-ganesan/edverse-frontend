import { DashboardLayout } from 'components/layout/DashboardLayout';
import { Box, Heading, Text } from '@radix-ui/themes';

export function AttendanceMarkPage(): JSX.Element {
  return (
    <DashboardLayout>
      <Box className="p-6 space-y-2">
        <Heading size="6">Mark Attendance</Heading>
        <Text size="2" color="gray">
          Mark attendance for a class/section. (Starter+). (Placeholder)
        </Text>
      </Box>
    </DashboardLayout>
  );
}
