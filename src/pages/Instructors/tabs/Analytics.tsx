import { useMemo, useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Heading,
  Select,
  TextField,
  Grid,
} from '@radix-ui/themes';
import { RadixCard } from 'components/ui/RadixCard';
import { RadixButton } from 'components/ui/RadixButton';
import {
  Users,
  Award,
  Download,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  TrendingUp,
} from 'lucide-react';
import { useInstructorData } from '../hooks/useInstructorData';

export function Analytics(): JSX.Element {
  const { instructors, isLoading, error } = useInstructorData();
  const [selectedPeriod, setSelectedPeriod] = useState('semester');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Calculate analytics data
  const analytics = useMemo(() => {
    if (instructors.length === 0) return null;

    // Performance distribution
    const performanceRanges = {
      excellent: instructors.filter((i) => i.performance.rating >= 4.5).length,
      good: instructors.filter(
        (i) => i.performance.rating >= 4.0 && i.performance.rating < 4.5
      ).length,
      average: instructors.filter(
        (i) => i.performance.rating >= 3.0 && i.performance.rating < 4.0
      ).length,
      poor: instructors.filter((i) => i.performance.rating < 3.0).length,
    };

    // Experience distribution
    const experienceRanges = {
      junior: instructors.filter((i) => i.experience.years < 5).length,
      midLevel: instructors.filter(
        (i) => i.experience.years >= 5 && i.experience.years < 10
      ).length,
      senior: instructors.filter((i) => i.experience.years >= 10).length,
    };

    // Department distribution
    const departmentStats = instructors.reduce(
      (acc, instructor) => {
        acc[instructor.department] = (acc[instructor.department] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Status distribution
    const statusStats = instructors.reduce(
      (acc, instructor) => {
        const status = instructor.status || 'Unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Average metrics
    const avgPerformance =
      instructors.reduce((sum, i) => sum + i.performance.rating, 0) /
      instructors.length;
    const avgExperience =
      instructors.reduce((sum, i) => sum + i.experience.years, 0) /
      instructors.length;
    const avgAttendance =
      instructors.reduce((sum, i) => sum + i.performance.attendanceRate, 0) /
      instructors.length;
    const avgSalary =
      instructors.reduce((sum, i) => sum + i.salary.total, 0) /
      instructors.length;

    // Top performers
    const topPerformers = [...instructors]
      .sort((a, b) => b.performance.rating - a.performance.rating)
      .slice(0, 5);

    // Recent hires (last 2 years)
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
    const recentHires = instructors.filter(
      (i) => new Date(i.dateOfJoining) >= twoYearsAgo
    );

    return {
      performanceRanges,
      experienceRanges,
      departmentStats,
      statusStats,
      avgPerformance,
      avgExperience,
      avgAttendance,
      avgSalary,
      topPerformers,
      recentHires,
    };
  }, [instructors]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error loading analytics: {error}</div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">No data available</div>
      </div>
    );
  }

  return (
    <Box className="space-y-8">
      {/* Analytics Header with Filters */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-violet-50 to-purple-50 border-b border-violet-100">
          <Flex justify="between" align="center" className="mb-6">
            <Box>
              <Heading size="5" className="text-gray-900 mb-1">
                Instructor Analytics
              </Heading>
              <Text size="3" className="text-gray-600">
                Comprehensive insights into instructor performance and
                department trends
              </Text>
            </Box>
            <Flex gap="2">
              <RadixButton
                variant="soft"
                size="2"
                onClick={() => console.log('Export Report')}
                className="bg-white/70 hover:bg-white"
              >
                <Download className="w-4 h-4 mr-1" />
                Export Report
              </RadixButton>
            </Flex>
          </Flex>

          {/* Filter Controls */}
          <Flex gap="4" wrap="wrap">
            <Box className="min-w-[150px]">
              <Text size="2" className="text-gray-700 mb-2 block">
                Time Period
              </Text>
              <Select.Root
                value={selectedPeriod}
                onValueChange={setSelectedPeriod}
                size="2"
              >
                <Select.Trigger className="w-full" />
                <Select.Content>
                  <Select.Item value="month">This Month</Select.Item>
                  <Select.Item value="semester">This Semester</Select.Item>
                  <Select.Item value="year">This Year</Select.Item>
                  <Select.Item value="all">All Time</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>

            <Box className="min-w-[150px]">
              <Text size="2" className="text-gray-700 mb-2 block">
                Department Filter
              </Text>
              <Select.Root
                value={selectedDepartment}
                onValueChange={setSelectedDepartment}
                size="2"
              >
                <Select.Trigger className="w-full" />
                <Select.Content>
                  <Select.Item value="all">All Departments</Select.Item>
                  <Select.Item value="cs">Computer Science</Select.Item>
                  <Select.Item value="math">Mathematics</Select.Item>
                  <Select.Item value="eng">Engineering</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>

            <Box className="min-w-[150px]">
              <Text size="2" className="text-gray-700 mb-2 block">
                Date Range
              </Text>
              <TextField.Root type="date" size="2" className="w-full">
                <TextField.Slot>
                  <Calendar className="w-4 h-4 text-gray-400" />
                </TextField.Slot>
              </TextField.Root>
            </Box>
          </Flex>
        </Box>
      </RadixCard>

      {/* Analytics Grid */}
      <Grid columns="2" gap="8">
        {/* Performance Distribution */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <Flex justify="between" align="center">
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Performance Distribution
                </Heading>
                <Text size="2" className="text-gray-600">
                  Instructor ratings breakdown
                </Text>
              </Box>
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </Flex>
          </Box>

          <Box className="p-6">
            <Flex direction="column" gap="4">
              {[
                {
                  label: 'Excellent (4.5+)',
                  count: analytics.performanceRanges.excellent,
                  color: 'bg-green-500',
                },
                {
                  label: 'Good (4.0-4.4)',
                  count: analytics.performanceRanges.good,
                  color: 'bg-blue-500',
                },
                {
                  label: 'Average (3.0-3.9)',
                  count: analytics.performanceRanges.average,
                  color: 'bg-yellow-500',
                },
                {
                  label: 'Poor (<3.0)',
                  count: analytics.performanceRanges.poor,
                  color: 'bg-red-500',
                },
              ].map((item, index) => (
                <Box
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Flex justify="between" align="center">
                    <Box className="flex items-center gap-3">
                      <Box className={`w-3 h-3 rounded-full ${item.color}`} />
                      <Text size="2" weight="medium" className="text-gray-700">
                        {item.label}
                      </Text>
                    </Box>
                    <Box className="flex items-center gap-2">
                      <Text size="2" className="text-gray-600">
                        {item.count} instructors
                      </Text>
                      <Text size="1" className="text-gray-500">
                        ({((item.count / instructors.length) * 100).toFixed(1)}
                        %)
                      </Text>
                    </Box>
                  </Flex>
                </Box>
              ))}
            </Flex>
          </Box>
        </RadixCard>

        {/* Experience Distribution */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-100">
            <Flex justify="between" align="center">
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Experience Distribution
                </Heading>
                <Text size="2" className="text-gray-600">
                  Years of experience breakdown
                </Text>
              </Box>
              <Activity className="w-5 h-5 text-green-600" />
            </Flex>
          </Box>

          <Box className="p-6">
            <Flex direction="column" gap="4">
              {[
                {
                  label: 'Junior (<5 years)',
                  count: analytics.experienceRanges.junior,
                  color: 'bg-blue-500',
                },
                {
                  label: 'Mid-level (5-9 years)',
                  count: analytics.experienceRanges.midLevel,
                  color: 'bg-purple-500',
                },
                {
                  label: 'Senior (10+ years)',
                  count: analytics.experienceRanges.senior,
                  color: 'bg-green-500',
                },
              ].map((item, index) => (
                <Box
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Flex justify="between" align="center">
                    <Box className="flex items-center gap-3">
                      <Box className={`w-3 h-3 rounded-full ${item.color}`} />
                      <Text size="2" weight="medium" className="text-gray-700">
                        {item.label}
                      </Text>
                    </Box>
                    <Box className="flex items-center gap-2">
                      <Text size="2" className="text-gray-600">
                        {item.count} instructors
                      </Text>
                      <Text size="1" className="text-gray-500">
                        ({((item.count / instructors.length) * 100).toFixed(1)}
                        %)
                      </Text>
                    </Box>
                  </Flex>
                </Box>
              ))}
            </Flex>
          </Box>
        </RadixCard>

        {/* Department Breakdown */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
            <Flex justify="between" align="center">
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Department Breakdown
                </Heading>
                <Text size="2" className="text-gray-600">
                  Instructors by department
                </Text>
              </Box>
              <PieChart className="w-5 h-5 text-orange-600" />
            </Flex>
          </Box>

          <Box className="p-6">
            <Flex direction="column" gap="3">
              {Object.entries(analytics.departmentStats).map(
                ([dept, count], index) => (
                  <Box
                    key={dept}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Flex justify="between" align="center">
                      <Box className="flex items-center gap-3">
                        <Box className="w-3 h-3 rounded-full bg-indigo-500" />
                        <Text
                          size="2"
                          weight="medium"
                          className="text-gray-700"
                        >
                          {dept}
                        </Text>
                      </Box>
                      <Box className="flex items-center gap-2">
                        <Text size="2" className="text-gray-600">
                          {count} instructors
                        </Text>
                        <Text size="1" className="text-gray-500">
                          ({((count / instructors.length) * 100).toFixed(1)}%)
                        </Text>
                      </Box>
                    </Flex>
                  </Box>
                )
              )}
            </Flex>
          </Box>
        </RadixCard>

        {/* Status Visualization */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-teal-100">
            <Flex justify="between" align="center">
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Status Overview
                </Heading>
                <Text size="2" className="text-gray-600">
                  Current instructor status
                </Text>
              </Box>
              <TrendingUp className="w-5 h-5 text-teal-600" />
            </Flex>
          </Box>

          <Box className="p-6">
            <Flex direction="column" gap="3">
              {Object.entries(analytics.statusStats).map(
                ([status, count], index) => (
                  <Box
                    key={status}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Flex justify="between" align="center">
                      <Box className="flex items-center gap-3">
                        <Box
                          className={`w-3 h-3 rounded-full ${
                            status === 'Active'
                              ? 'bg-green-500'
                              : status === 'On Leave'
                                ? 'bg-yellow-500'
                                : 'bg-gray-500'
                          }`}
                        />
                        <Text
                          size="2"
                          weight="medium"
                          className="text-gray-700"
                        >
                          {status}
                        </Text>
                      </Box>
                      <Box className="flex items-center gap-2">
                        <Text size="2" className="text-gray-600">
                          {count} instructors
                        </Text>
                        <Text size="1" className="text-gray-500">
                          ({((count / instructors.length) * 100).toFixed(1)}%)
                        </Text>
                      </Box>
                    </Flex>
                  </Box>
                )
              )}
            </Flex>
          </Box>
        </RadixCard>
      </Grid>

      {/* Top Performers Section */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
          <Flex justify="between" align="center">
            <Box>
              <Heading size="4" className="text-gray-900 mb-1">
                Top Performers
              </Heading>
              <Text size="2" className="text-gray-600">
                Highest rated instructors
              </Text>
            </Box>
            <Award className="w-5 h-5 text-purple-600" />
          </Flex>
        </Box>

        <Box className="p-6">
          <Grid columns="3" gap="4">
            {analytics.topPerformers.map((instructor) => (
              <Box
                key={instructor.id}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4"
              >
                <Flex align="center" gap="3">
                  <Box className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </Box>
                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 block"
                    >
                      {instructor.name}
                    </Text>
                    <Text size="1" className="text-gray-600">
                      {instructor.department}
                    </Text>
                    <Flex align="center" gap="1" className="mt-1">
                      <Award className="w-3 h-3 text-yellow-500" />
                      <Text size="1" className="text-gray-600">
                        {instructor.performance.rating.toFixed(1)} rating
                      </Text>
                    </Flex>
                  </Box>
                </Flex>
              </Box>
            ))}
          </Grid>
        </Box>
      </RadixCard>

      {/* Recent Hires */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-100">
          <Flex justify="between" align="center">
            <Box>
              <Heading size="4" className="text-gray-900 mb-1">
                Recent Hires (Last 2 Years)
              </Heading>
              <Text size="2" className="text-gray-600">
                Newly joined instructors
              </Text>
            </Box>
            <Users className="w-5 h-5 text-rose-600" />
          </Flex>
        </Box>

        <Box className="p-6">
          <Grid columns="3" gap="4">
            {analytics.recentHires.map((instructor) => (
              <Box
                key={instructor.id}
                className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4"
              >
                <Flex align="center" gap="3">
                  <Box className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-600" />
                  </Box>
                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 block"
                    >
                      {instructor.name}
                    </Text>
                    <Text size="1" className="text-gray-600">
                      {instructor.department}
                    </Text>
                    <Text size="1" className="text-gray-500 mt-1">
                      Joined:{' '}
                      {new Date(instructor.dateOfJoining).toLocaleDateString()}
                    </Text>
                  </Box>
                </Flex>
              </Box>
            ))}
          </Grid>
        </Box>
      </RadixCard>
    </Box>
  );
}
