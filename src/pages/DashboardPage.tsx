import { Box, Flex, Heading, Text, Select } from '@radix-ui/themes';
import { DashboardLayout } from 'components/layout/DashboardLayout';
import { PageHeader } from 'components/ui/PageHeader';
import {
  ModernStatsGridColored,
  ColoredStatItem,
} from 'components/ui/ModernStatsGridColored';
import { RadixCard } from 'components/ui/RadixCard';
import { RadixButton } from 'components/ui/RadixButton';
import { QuickActions } from 'components/dashboard/QuickActions';
import {
  MockAreaChart,
  MockBarChart,
  MockDonutChart,
} from 'components/dashboard/ChartCard';
import { NoticeBoard } from 'components/dashboard/NoticeBoard';
import {
  Shield,
  Users,
  GraduationCap,
  Building,
  Plus,
  Download,
  TrendingUp,
  Eye,
  BarChart3,
  PieChart,
} from 'lucide-react';
import { useApiCall, ApiService } from 'lib/api';
import { useAuth } from 'features/auth/AuthContext';
import { useEffect, useState } from 'react';

export function DashboardPage(): JSX.Element {
  const authContext = useAuth();
  const [testResult, setTestResult] = useState<string>('');

  // Get user safely
  const user = authContext?.user;

  // Fetch dashboard statistics from backend - must be called before any conditional returns
  const {
    data: stats,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useApiCall(() => ApiService.getDashboardStats(), [user]);

  // Test backend connection on component mount - must be called before any conditional returns
  useEffect(() => {
    const testBackend = async () => {
      if (!user?.uid) {
        console.warn('DashboardPage: No user available for backend test');
        return;
      }

      try {
        const result = await ApiService.testConnection({
          userId: user.uid,
          page: 'dashboard',
          timestamp: new Date().toISOString(),
        });

        if (result?.message) {
          setTestResult(`✅ Backend connected: ${result.message}`);
          console.log('Backend test result:', result);
        } else {
          setTestResult('✅ Backend connected: No message returned');
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        setTestResult(`❌ Backend connection failed: ${errorMessage}`);
        console.error('Backend test failed:', error);
      }
    };

    testBackend();
  }, [user]);

  // Defensive check for auth context - after hooks
  if (!authContext) {
    console.error('DashboardPage: Auth context is not available');
    return (
      <DashboardLayout>
        <Box className="p-6">
          <div className="text-center">
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Authentication Error
            </h1>
            <p className="text-gray-600">
              Unable to load authentication context. Please refresh the page.
            </p>
          </div>
        </Box>
      </DashboardLayout>
    );
  }

  // Default values while loading or if there's an error
  const displayStats = stats || {
    totalAdmins: 0,
    totalInstructors: 0,
    totalStudents: 0,
    totalCourses: 0,
  };

  const handleExportData = (): void => {
    try {
      console.log('Export data clicked');
      // TODO: Implement export functionality
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const handleAddNew = (): void => {
    try {
      console.log('Add new clicked');
      // TODO: Implement add new functionality
    } catch (error) {
      console.error('Error adding new item:', error);
    }
  };

  const handleRefetchStats = (): void => {
    try {
      if (refetchStats) {
        refetchStats();
      } else {
        console.warn('Refetch function is not available');
      }
    } catch (error) {
      console.error('Error refetching stats:', error);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Dashboard"
        description="Welcome to your EdVerse dashboard. Monitor key metrics and manage your student management system."
        actions={[
          {
            label: 'Export Data',
            icon: Download,
            onClick: handleExportData,
          },
          {
            label: 'Add New',
            icon: Plus,
            onClick: handleAddNew,
            isPrimary: true,
          },
        ]}
      />

      {/* Backend Connection Status (Development) */}
      {process.env.NODE_ENV === 'development' && testResult && (
        <Box className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {testResult}
          </p>
        </Box>
      )}

      <ModernStatsGridColored
        stats={
          [
            {
              title: 'Admins',
              value: displayStats?.totalAdmins,
              icon: Shield,
              gradient: {
                from: 'from-blue-50',
                to: 'to-indigo-50',
              },
              iconColor: 'text-blue-600',
              iconBgColor: 'bg-blue-100',
              trend: {
                icon: TrendingUp,
                value: '+5% vs last month',
                color: 'text-green-600',
              },
            },
            {
              title: 'Instructors',
              value: displayStats?.totalInstructors,
              icon: Users,
              gradient: {
                from: 'from-green-50',
                to: 'to-emerald-50',
              },
              iconColor: 'text-green-600',
              iconBgColor: 'bg-green-100',
              trend: {
                icon: TrendingUp,
                value: '+4% vs last month',
                color: 'text-green-600',
              },
            },
            {
              title: 'Students',
              value: displayStats?.totalStudents,
              icon: GraduationCap,
              gradient: {
                from: 'from-purple-50',
                to: 'to-violet-50',
              },
              iconColor: 'text-purple-600',
              iconBgColor: 'bg-purple-100',
              trend: {
                icon: TrendingUp,
                value: '+10% vs last month',
                color: 'text-green-600',
              },
            },
            {
              title: 'Courses',
              value: displayStats?.totalCourses,
              icon: Building,
              gradient: {
                from: 'from-orange-50',
                to: 'to-amber-50',
              },
              iconColor: 'text-orange-600',
              iconBgColor: 'bg-orange-100',
              trend: {
                icon: TrendingUp,
                value: '+3% vs last month',
                color: 'text-green-600',
              },
            },
          ] as ColoredStatItem[]
        }
        columns="4"
        gap="6"
        isLoading={statsLoading}
      />

      {/* Error Display */}
      {statsError && (
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden mb-8">
          <Box className="p-5 bg-gradient-to-r from-red-50 to-rose-50 border-b border-red-100">
            <Flex justify="between" align="center">
              <Box>
                <Heading size="4" className="text-red-900 mb-1">
                  Error Loading Statistics
                </Heading>
                <Text size="2" className="text-red-700">
                  {typeof statsError === 'string'
                    ? statsError
                    : 'Unknown error occurred'}
                </Text>
              </Box>
              <RadixButton
                variant="soft"
                size="2"
                className="bg-white/70 hover:bg-white"
                onClick={handleRefetchStats}
              >
                Try Again
              </RadixButton>
            </Flex>
          </Box>
        </RadixCard>
      )}

      {/* Main Dashboard Grid - Consistent 12-column layout */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        {/* Row 1: Attendance Analytics (8 cols) + Quick Actions (4 cols) */}
        <div className="col-span-8">
          <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden h-full">
            {/* Header Section */}
            <Box className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
              <Flex justify="between" align="center">
                <Box>
                  <Heading size="5" className="text-gray-900 mb-1">
                    Attendance Analytics
                  </Heading>
                  <Text size="3" className="text-gray-600">
                    Showing attendance trends for the last 7 days
                  </Text>
                </Box>
                <Flex align="center" gap="3">
                  <Select.Root defaultValue="last-7-days">
                    <Select.Trigger className="bg-white/70 hover:bg-white" />
                    <Select.Content>
                      <Select.Item value="last-7-days">Last 7 days</Select.Item>
                      <Select.Item value="last-30-days">
                        Last 30 days
                      </Select.Item>
                      <Select.Item value="last-3-months">
                        Last 3 months
                      </Select.Item>
                    </Select.Content>
                  </Select.Root>
                  <RadixButton
                    variant="soft"
                    size="2"
                    className="bg-white/70 hover:bg-white"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </RadixButton>
                </Flex>
              </Flex>
            </Box>

            {/* Chart Content */}
            <Box className="p-6">
              <MockAreaChart />
            </Box>
          </RadixCard>
        </div>

        <div className="col-span-4">
          <QuickActions className="h-full" />
        </div>
      </div>

      {/* Row 2: Financial Overview (8 cols) + Revenue Summary (4 cols) */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        <div className="col-span-8">
          <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden h-full">
            {/* Header Section */}
            <Box className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
              <Flex justify="between" align="center">
                <Box>
                  <Heading size="5" className="text-gray-900 mb-1">
                    Financial Overview
                  </Heading>
                  <Text size="3" className="text-gray-600">
                    Income vs expenses for this academic session
                  </Text>
                </Box>
                <Flex align="center" gap="3">
                  <Select.Root defaultValue="current-session">
                    <Select.Trigger className="bg-white/70 hover:bg-white" />
                    <Select.Content>
                      <Select.Item value="current-session">
                        Current Session
                      </Select.Item>
                      <Select.Item value="previous-session">
                        Previous Session
                      </Select.Item>
                      <Select.Item value="all-time">All Time</Select.Item>
                    </Select.Content>
                  </Select.Root>
                  <RadixButton
                    variant="soft"
                    size="2"
                    className="bg-white/70 hover:bg-white"
                  >
                    <BarChart3 className="w-4 h-4 mr-1" />
                    Export Report
                  </RadixButton>
                </Flex>
              </Flex>
            </Box>

            {/* Chart Content */}
            <Box className="p-6">
              <MockBarChart />
            </Box>
          </RadixCard>
        </div>

        <div className="col-span-4">
          <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden h-full">
            {/* Header */}
            <Box className="p-6 bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-100">
              <Flex justify="between" align="center">
                <Box>
                  <Heading size="4" className="text-gray-900 mb-1">
                    Revenue Summary
                  </Heading>
                  <Text size="2" className="text-gray-600">
                    Monthly breakdown
                  </Text>
                </Box>
                <PieChart className="w-5 h-5 text-purple-600" />
              </Flex>
            </Box>

            {/* Chart Content */}
            <Box className="p-6 flex items-center justify-center">
              <MockDonutChart value={475} />
            </Box>
          </RadixCard>
        </div>
      </div>

      {/* Row 3: Recent Updates - Full Width */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
            {/* Header */}
            <Box className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
              <Flex justify="between" align="center">
                <Box>
                  <Heading size="4" className="text-gray-900 mb-1">
                    Recent Updates
                  </Heading>
                  <Text size="2" className="text-gray-600">
                    Latest announcements
                  </Text>
                </Box>
                <RadixButton
                  variant="soft"
                  size="2"
                  className="bg-white/70 hover:bg-white"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View All
                </RadixButton>
              </Flex>
            </Box>

            {/* Notice Content */}
            <Box className="p-6">
              <NoticeBoard />
            </Box>
          </RadixCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
