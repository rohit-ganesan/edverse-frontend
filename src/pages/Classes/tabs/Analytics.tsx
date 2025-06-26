import { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Heading,
  Grid,
  Select,
  TextField,
} from '@radix-ui/themes';
import { RadixCard } from 'components/ui/RadixCard';
import { RadixButton } from 'components/ui/RadixButton';
import {
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Users,
  BookOpen,
  Clock,
} from 'lucide-react';
import { useClassesData } from '../hooks/useClassesData';
import {
  SkeletonCard,
  SkeletonText,
  SkeletonTableRow,
} from 'components/ui/Skeleton';

export function Analytics({
  isLoading = false,
}: {
  isLoading?: boolean;
}): JSX.Element {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const { classes } = useClassesData();

  const handleExportReport = () => {
    console.log('Exporting classes analytics report...');
  };

  return (
    <Box className="space-y-8">
      {/* Analytics Header with Filters */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 border-b border-blue-100 dark:border-gray-700">
          <Flex justify="between" align="center" className="mb-6">
            <Box>
              <Heading
                size="5"
                className="text-gray-900 dark:text-gray-100 mb-1"
              >
                Classes Analytics
              </Heading>
              <Text size="3" className="text-gray-600 dark:text-gray-400">
                Comprehensive insights into class performance and engagement
              </Text>
            </Box>
            <Flex gap="2">
              <RadixButton
                variant="soft"
                size="2"
                onClick={handleExportReport}
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
                  <Select.Item value="day">Today</Select.Item>
                  <Select.Item value="week">This Week</Select.Item>
                  <Select.Item value="month">This Month</Select.Item>
                  <Select.Item value="semester">This Semester</Select.Item>
                  <Select.Item value="year">This Year</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>

            <Box className="min-w-[150px]">
              <Text size="2" className="text-gray-700 mb-2 block">
                Grade Filter
              </Text>
              <Select.Root
                value={selectedGrade}
                onValueChange={setSelectedGrade}
                size="2"
              >
                <Select.Trigger className="w-full" />
                <Select.Content>
                  <Select.Item value="all">All Grades</Select.Item>
                  <Select.Item value="9">Grade 9</Select.Item>
                  <Select.Item value="10">Grade 10</Select.Item>
                  <Select.Item value="11">Grade 11</Select.Item>
                  <Select.Item value="12">Grade 12</Select.Item>
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

      {/* Analytics Charts */}
      <Grid columns="2" gap="8">
        {/* Class Performance Chart */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-emerald-900 dark:to-green-900 border-b border-green-100 dark:border-gray-700">
            <Flex justify="between" align="center">
              <Box>
                <Heading
                  size="4"
                  className="text-gray-900 dark:text-gray-100 mb-1"
                >
                  Class Performance
                </Heading>
                <Text size="2" className="text-gray-600 dark:text-gray-400">
                  Average student performance across classes
                </Text>
              </Box>
              <Flex align="center" gap="2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <Text size="2" className="text-green-600 font-medium">
                  +5.2% vs last month
                </Text>
              </Flex>
            </Flex>
          </Box>

          <Box className="p-6">
            {isLoading ? (
              <SkeletonCard height={256} />
            ) : (
              <Box className="h-64 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg flex items-center justify-center border border-green-100">
                <Box className="text-center">
                  <BarChart3 className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <Text size="3" className="text-gray-600 mb-1">
                    Performance Trend Chart
                  </Text>
                  <Text size="2" className="text-gray-500">
                    Chart visualization would appear here
                  </Text>
                </Box>
              </Box>
            )}
          </Box>
        </RadixCard>

        {/* Enrollment Trends */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900 dark:to-violet-900 border-b border-purple-100 dark:border-gray-700">
            <Flex justify="between" align="center">
              <Box>
                <Heading
                  size="4"
                  className="text-gray-900 dark:text-gray-100 mb-1"
                >
                  Enrollment Trends
                </Heading>
                <Text size="2" className="text-gray-600 dark:text-gray-400">
                  Student enrollment by class
                </Text>
              </Box>
              <Flex align="center" gap="2">
                <TrendingDown className="w-4 h-4 text-red-600" />
                <Text size="2" className="text-red-600 font-medium">
                  -2.1% vs last month
                </Text>
              </Flex>
            </Flex>
          </Box>

          <Box className="p-6">
            {isLoading ? (
              <>
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonTableRow key={i} columns={2} className="mb-3" />
                ))}
              </>
            ) : (
              <Flex direction="column" gap="4">
                {classes && classes.length > 0 ? (
                  classes.map((classItem, index) => (
                    <Box
                      key={classItem.id}
                      className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Flex justify="between" align="center">
                        <Box>
                          <Text
                            size="2"
                            weight="medium"
                            className="text-gray-900 dark:text-gray-100 block"
                          >
                            {classItem.name}
                          </Text>
                          <Text
                            size="1"
                            className="text-gray-600 dark:text-gray-400"
                          >
                            Grade {classItem.grade} - {classItem.section}
                          </Text>
                        </Box>
                        <Box className="text-right">
                          <Text
                            size="2"
                            className="text-gray-900 dark:text-gray-100 font-bold"
                          >
                            {classItem.students} students
                          </Text>
                        </Box>
                      </Flex>
                    </Box>
                  ))
                ) : (
                  <Text size="2" className="text-gray-500">
                    No enrollment data
                  </Text>
                )}
              </Flex>
            )}
          </Box>
        </RadixCard>
      </Grid>

      {/* Detailed Analytics */}
      <Grid columns="3" gap="6">
        {/* Average Class Size */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-cyan-900 dark:to-blue-900 border-b border-blue-100 dark:border-gray-700">
            <Flex align="center" gap="3">
              <Box className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </Box>
              <Box>
                <Heading
                  size="4"
                  className="text-gray-900 dark:text-gray-100 mb-1"
                >
                  Average Class Size
                </Heading>
                <Text size="2" className="text-gray-600 dark:text-gray-400">
                  Students per class
                </Text>
              </Box>
            </Flex>
          </Box>

          <Box className="p-6">
            <Text size="6" weight="bold" className="text-blue-600 block mb-2">
              {classes
                ? Math.round(
                    classes.reduce((sum, c) => sum + c.students, 0) /
                      classes.length
                  )
                : 0}
            </Text>
            <Text size="2" className="text-gray-600 dark:text-gray-400">
              students on average
            </Text>
          </Box>
        </RadixCard>

        {/* Subject Distribution */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900 dark:to-amber-900 border-b border-orange-100 dark:border-gray-700">
            <Flex align="center" gap="3">
              <Box className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-orange-600" />
              </Box>
              <Box>
                <Heading
                  size="4"
                  className="text-gray-900 dark:text-gray-100 mb-1"
                >
                  Subject Distribution
                </Heading>
                <Text size="2" className="text-gray-600 dark:text-gray-400">
                  Most popular subjects
                </Text>
              </Box>
            </Flex>
          </Box>

          <Box className="p-6">
            <Flex direction="column" gap="3">
              {['Mathematics', 'Science', 'English', 'History'].map(
                (subject, index) => (
                  <Flex key={subject} justify="between" align="center">
                    <Text size="2" className="text-gray-900 dark:text-gray-100">
                      {subject}
                    </Text>
                    <Text
                      size="2"
                      className="text-orange-600 dark:text-orange-400 font-medium"
                    >
                      {Math.floor(Math.random() * 5) + 3} classes
                    </Text>
                  </Flex>
                )
              )}
            </Flex>
          </Box>
        </RadixCard>

        {/* Schedule Efficiency */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900 dark:to-teal-900 border-b border-green-100 dark:border-gray-700">
            <Flex align="center" gap="3">
              <Box className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-600" />
              </Box>
              <Box>
                <Heading
                  size="4"
                  className="text-gray-900 dark:text-gray-100 mb-1"
                >
                  Schedule Efficiency
                </Heading>
                <Text size="2" className="text-gray-600 dark:text-gray-400">
                  Time utilization
                </Text>
              </Box>
            </Flex>
          </Box>

          <Box className="p-6">
            <Text size="6" weight="bold" className="text-green-600 block mb-2">
              87%
            </Text>
            <Text size="2" className="text-gray-600 dark:text-gray-400">
              classroom utilization
            </Text>
            <Box className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
              <Box
                className="h-full bg-green-500 rounded-full"
                style={{ width: '87%' }}
              />
            </Box>
          </Box>
        </RadixCard>
      </Grid>
    </Box>
  );
}
