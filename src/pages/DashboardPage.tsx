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
import { Shield, Users, GraduationCap, Building } from 'lucide-react';
import { useApiCall, ApiService } from 'lib/api';
import { useAuth } from 'features/auth/AuthContext';
import { useEffect, useState } from 'react';

export function DashboardPage(): JSX.Element {
  const { user } = useAuth();
  const [testResult, setTestResult] = useState<string>('');

  // Fetch dashboard statistics from backend
  const {
    data: stats,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useApiCall(() => ApiService.getDashboardStats(), [user]);

  // Test backend connection on component mount
  useEffect(() => {
    const testBackend = async () => {
      if (user) {
        try {
          const result = await ApiService.testConnection({
            userId: user.uid,
            page: 'dashboard',
            timestamp: new Date().toISOString(),
          });
          setTestResult(`✅ Backend connected: ${result.message}`);
          console.log('Backend test result:', result);
        } catch (error) {
          setTestResult(`❌ Backend connection failed: ${error}`);
          console.error('Backend test failed:', error);
        }
      }
    };

    testBackend();
  }, [user]);

  // Default values while loading or if there's an error
  const displayStats = stats || {
    totalAdmins: 0,
    totalTeachers: 0,
    totalStudents: 0,
    totalCourses: 0,
  };

  return (
    <DashboardLayout>
      {/* Backend Connection Status (Development) */}
      {process.env.NODE_ENV === 'development' && testResult && (
        <Box className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {testResult}
          </p>
        </Box>
      )}

      {/* Stats Cards */}
      <Grid columns="4" gap="6" className="mb-6">
        <StatsCard
          title="Admins"
          value={statsLoading ? '...' : displayStats.totalAdmins.toString()}
          icon={Shield}
          trend={{ value: 5, isPositive: true }}
          loading={statsLoading}
        />
        <StatsCard
          title="Teachers"
          value={statsLoading ? '...' : displayStats.totalTeachers.toString()}
          icon={Users}
          trend={{ value: 4, isPositive: true }}
          loading={statsLoading}
        />
        <StatsCard
          title="Students"
          value={statsLoading ? '...' : displayStats.totalStudents.toString()}
          icon={GraduationCap}
          trend={{ value: 10, isPositive: true }}
          loading={statsLoading}
        />
        <StatsCard
          title="Courses"
          value={statsLoading ? '...' : displayStats.totalCourses.toString()}
          icon={Building}
          trend={{ value: 3, isPositive: true }}
          loading={statsLoading}
        />
      </Grid>

      {/* Error Display */}
      {statsError && (
        <Box className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-400 text-sm">
            Error loading dashboard statistics: {statsError}
          </p>
          <button
            onClick={refetchStats}
            className="mt-2 text-red-600 dark:text-red-400 text-sm underline hover:no-underline"
          >
            Try again
          </button>
        </Box>
      )}

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
