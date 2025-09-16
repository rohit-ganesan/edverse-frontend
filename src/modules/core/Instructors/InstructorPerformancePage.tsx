import { DashboardLayout } from 'components/layout/DashboardLayout';
import { Box, Heading, Text } from '@radix-ui/themes';

export function InstructorPerformancePage(): JSX.Element {
  return (
    <DashboardLayout>
      <Box className="p-6 space-y-2">
        <Heading size="6">Instructor Performance</Heading>
        <Text size="2" color="gray">
          Performance analytics. (Growth+). (Placeholder)
        </Text>
      </Box>
    </DashboardLayout>
  );
}
