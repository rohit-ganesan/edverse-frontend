import { useState } from 'react';
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
  BarChart3,
  PieChart,
  TrendingUp,
  Download,
  Calendar,
} from 'lucide-react';
import { useStudentData } from '../hooks/useStudentData';
import { SkeletonCard, SkeletonTableRow } from 'components/ui/Skeleton';

export function Analytics({
  isLoading = false,
}: {
  isLoading?: boolean;
}): JSX.Element {
  const { stats } = useStudentData();
  const [selectedPeriod, setSelectedPeriod] = useState('semester');
  const [selectedCourse, setSelectedCourse] = useState('all');

  return (
    <Box className="space-y-8">
      {/* Analytics Header with Filters */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-violet-50 to-purple-50 border-b border-violet-100">
          <Flex justify="between" align="center" className="mb-6">
            <Box>
              <Heading size="5" className="text-gray-900 mb-1">
                Student Analytics
              </Heading>
              <Text size="3" className="text-gray-600">
                Comprehensive insights into student performance and academic
                trends
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
                Course Filter
              </Text>
              <Select.Root
                value={selectedCourse}
                onValueChange={setSelectedCourse}
                size="2"
              >
                <Select.Trigger className="w-full" />
                <Select.Content>
                  <Select.Item value="all">All Courses</Select.Item>
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

      {/* Charts Section */}
      <Grid columns="2" gap="8">
        {/* Grade Distribution */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <Flex justify="between" align="center">
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Grade Distribution
                </Heading>
                <Text size="2" className="text-gray-600">
                  Student performance by grade level
                </Text>
              </Box>
              <PieChart className="w-5 h-5 text-blue-600" />
            </Flex>
          </Box>

          <Box className="p-6">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <SkeletonTableRow key={i} columns={2} className="mb-2" />
              ))
            ) : (
              <Flex direction="column" gap="4">
                {stats.gradeDistribution.map((item, index) => (
                  <Box
                    key={index}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Flex justify="between" align="center">
                      <Box className="flex items-center gap-3">
                        <Box
                          className={`w-3 h-3 rounded-full ${
                            item.grade.startsWith('A')
                              ? 'bg-green-500'
                              : item.grade.startsWith('B')
                                ? 'bg-blue-500'
                                : item.grade.startsWith('C')
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                          }`}
                        />
                        <Text
                          size="2"
                          weight="medium"
                          className="text-gray-900"
                        >
                          Grade {item.grade}
                        </Text>
                      </Box>
                      <Box className="flex items-center gap-2">
                        <Text size="2" className="text-gray-600">
                          {item.count} students
                        </Text>
                        <Text size="1" className="text-gray-500">
                          ({item.percentage.toFixed(1)}%)
                        </Text>
                      </Box>
                    </Flex>
                  </Box>
                ))}
              </Flex>
            )}
          </Box>
        </RadixCard>

        {/* Attendance Distribution */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-100">
            <Flex justify="between" align="center">
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Attendance Distribution
                </Heading>
                <Text size="2" className="text-gray-600">
                  Student attendance rate ranges
                </Text>
              </Box>
              <BarChart3 className="w-5 h-5 text-green-600" />
            </Flex>
          </Box>

          <Box className="p-6">
            {isLoading ? (
              <SkeletonCard height={256} />
            ) : (
              <Flex direction="column" gap="4">
                {stats.attendanceDistribution.map((item, index) => (
                  <Box key={index}>
                    <Flex justify="between" align="center" className="mb-2">
                      <Text size="2" weight="medium" className="text-gray-700">
                        {item.range}
                      </Text>
                      <Box className="flex items-center gap-2">
                        <Text size="2" className="text-gray-600">
                          {item.count} students
                        </Text>
                        <Text size="1" className="text-gray-500">
                          ({item.percentage.toFixed(1)}%)
                        </Text>
                      </Box>
                    </Flex>
                    <Box className="w-full bg-gray-200 rounded-full h-2">
                      <Box
                        className={`h-2 rounded-full ${
                          item.range.includes('95-100')
                            ? 'bg-green-500'
                            : item.range.includes('85-94')
                              ? 'bg-blue-500'
                              : item.range.includes('75-84')
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                        }`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </Box>
                  </Box>
                ))}
              </Flex>
            )}
          </Box>
        </RadixCard>
      </Grid>

      {/* Performance Insights */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
          <Flex justify="between" align="center">
            <Box>
              <Heading size="4" className="text-gray-900 mb-1">
                Performance Insights
              </Heading>
              <Text size="2" className="text-gray-600">
                Key performance indicators and trends
              </Text>
            </Box>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </Flex>
        </Box>

        <Box className="p-6">
          <Grid columns="3" gap="4">
            <Box className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
              <Heading size="3" className="text-green-800 mb-2">
                High Performers
              </Heading>
              <Text size="6" weight="bold" className="text-green-600 block">
                {stats.gradeDistribution
                  .filter((g) => g.grade.startsWith('A'))
                  .reduce((sum, g) => sum + g.count, 0)}
              </Text>
              <Text size="1" className="text-green-600 mt-1">
                Students with A grades
              </Text>
            </Box>
            <Box className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-4">
              <Heading size="3" className="text-yellow-800 mb-2">
                At Risk
              </Heading>
              <Text size="6" weight="bold" className="text-yellow-600 block">
                {stats.attendanceDistribution.find((a) =>
                  a.range.includes('Below')
                )?.count || 0}
              </Text>
              <Text size="1" className="text-yellow-600 mt-1">
                Students with low attendance
              </Text>
            </Box>
            <Box className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
              <Heading size="3" className="text-blue-800 mb-2">
                Average Performance
              </Heading>
              <Text size="6" weight="bold" className="text-blue-600 block">
                {stats.gradeDistribution
                  .filter((g) => g.grade.startsWith('B'))
                  .reduce((sum, g) => sum + g.count, 0)}
              </Text>
              <Text size="1" className="text-blue-600 mt-1">
                Students with B grades
              </Text>
            </Box>
          </Grid>
        </Box>
      </RadixCard>
    </Box>
  );
}
