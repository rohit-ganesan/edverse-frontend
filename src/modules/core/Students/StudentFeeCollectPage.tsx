import { DashboardLayout } from 'components/layout/DashboardLayout';
import { Box, Heading, Text } from '@radix-ui/themes';

export function StudentFeeCollectPage(): JSX.Element {
  return (
    <DashboardLayout>
      <Box className="p-6 space-y-2">
        <Heading size="6">Collect Fees</Heading>
        <Text size="2" color="gray">
          Record manual fee collection. (Starter+). (Placeholder)
        </Text>
      </Box>
    </DashboardLayout>
  );
}
