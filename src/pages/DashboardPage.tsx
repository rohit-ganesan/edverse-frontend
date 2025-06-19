import { Box, Flex, Grid } from '@radix-ui/themes';
import { DashboardLayout } from 'components/layout/DashboardLayout';
import { StatsCard } from 'components/dashboard/StatsCard';
import { QuickActions } from 'components/dashboard/QuickActions';
import {
  ChartCard,
  MockAreaChart,
  MockBarChart,
  MockDonutChart,
} from 'components/dashboard/ChartCard';
import { NoticeBoard } from 'components/dashboard/NoticeBoard';
import { Shield, Users, GraduationCap } from 'lucide-react';

export function DashboardPage(): JSX.Element {
  return (
    <DashboardLayout>
      {/* Stats Cards */}
      <Grid columns="3" gap="6" className="mb-6">
        <StatsCard
          title="Admins"
          value="10"
          icon={Shield}
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Teachers"
          value="51"
          icon={Users}
          trend={{ value: 4, isPositive: true }}
        />
        <StatsCard
          title="Students"
          value="946"
          icon={GraduationCap}
          trend={{ value: 10, isPositive: true }}
        />
      </Grid>

      {/* Main Content Grid */}
      <Grid columns="3" gap="6" className="mb-6">
        {/* Attendance Chart - Spans 2 columns */}
        <Box className="col-span-2">
          <ChartCard
            title="Attendance Stats - Interactive"
            subtitle="Showing total attendances for the last 7 days"
            showSelector
            selectorOptions={[
              { value: 'last-7-days', label: 'Last 7 days' },
              { value: 'last-30-days', label: 'Last 30 days' },
              { value: 'last-3-months', label: 'Last 3 months' },
            ]}
          >
            <MockAreaChart />
          </ChartCard>
        </Box>

        {/* Quick Actions */}
        <QuickActions />
      </Grid>

      {/* Bottom Row */}
      <Grid columns="3" gap="6">
        {/* Ledger Chart - Spans 2 columns */}
        <Box className="col-span-2">
          <ChartCard
            title="Ledger"
            subtitle="This session"
            showSelector
            selectorOptions={[
              { value: 'current-session', label: 'Select Session' },
              { value: 'previous-session', label: 'Previous Session' },
            ]}
          >
            <MockBarChart />
          </ChartCard>
        </Box>

        {/* Right Column - Donut Chart and Notice Board */}
        <Flex direction="column" gap="6">
          {/* Donut Chart */}
          <ChartCard title="Financial Overview">
            <MockDonutChart value={475} />
          </ChartCard>

          {/* Notice Board */}
          <NoticeBoard />
        </Flex>
      </Grid>
    </DashboardLayout>
  );
}
