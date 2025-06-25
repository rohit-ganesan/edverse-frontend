import { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Heading,
  Grid,
  Select,
  TextField,
  Progress,
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
  Award,
  GraduationCap,
} from 'lucide-react';
import { useCoursesData } from '../hooks/useCoursesData';
import { SkeletonCard, SkeletonTableRow } from 'components/ui/Skeleton';

export function Analytics({
  isLoading = false,
}: {
  isLoading?: boolean;
}): JSX.Element {
  const [selectedPeriod, setSelectedPeriod] = useState('semester');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const { courses } = useCoursesData();

  const handleExportReport = () => {
    console.log('Exporting courses analytics report...');
  };

  return (
    <Box className="space-y-8">
      {/* Analytics Header with Filters */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
          <Flex justify="between" align="center" className="mb-6">
            <Box>
              <Heading size="5" className="text-gray-900 mb-1">
                Courses Analytics
              </Heading>
              <Text size="3" className="text-gray-600">
                Comprehensive insights into course performance and enrollment
                trends
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
                  <Select.Item value="computer-science">
                    Computer Science
                  </Select.Item>
                  <Select.Item value="mathematics">Mathematics</Select.Item>
                  <Select.Item value="physics">Physics</Select.Item>
                  <Select.Item value="chemistry">Chemistry</Select.Item>
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
        {/* Enrollment Trends Chart */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <Flex justify="between" align="center">
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Enrollment Trends
                </Heading>
                <Text size="2" className="text-gray-600">
                  Student enrollment over time
                </Text>
              </Box>
              <Flex align="center" gap="2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <Text size="2" className="text-green-600 font-medium">
                  +12.5% vs last semester
                </Text>
              </Flex>
            </Flex>
          </Box>

          <Box className="p-6">
            {isLoading ? (
              <SkeletonCard height={256} />
            ) : (
              <Box className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center border border-blue-100">
                <Box className="text-center">
                  <BarChart3 className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                  <Text size="3" className="text-gray-600 mb-1">
                    Enrollment Trend Chart
                  </Text>
                  <Text size="2" className="text-gray-500">
                    Chart visualization would appear here
                  </Text>
                </Box>
              </Box>
            )}
          </Box>
        </RadixCard>

        {/* Course Completion Rates */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-100">
            <Flex justify="between" align="center">
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Course Completion
                </Heading>
                <Text size="2" className="text-gray-600">
                  Completion rates by course
                </Text>
              </Box>
              <Flex align="center" gap="2">
                <TrendingDown className="w-4 h-4 text-red-600" />
                <Text size="2" className="text-red-600 font-medium">
                  -3.2% vs last semester
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
                {courses && courses.length > 0 ? (
                  courses.map((course, index) => {
                    const completionRate = Math.floor(Math.random() * 30) + 70; // Mock completion rate
                    return (
                      <Box
                        key={course.id}
                        className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Flex justify="between" align="center" className="mb-2">
                          <Box>
                            <Text
                              size="2"
                              weight="medium"
                              className="text-gray-900 block"
                            >
                              {course.name}
                            </Text>
                            <Text size="1" className="text-gray-600">
                              {course.code}
                            </Text>
                          </Box>
                          <Box className="text-right">
                            <Text size="2" className="text-gray-900 font-bold">
                              {completionRate}%
                            </Text>
                          </Box>
                        </Flex>
                        <Progress value={completionRate} className="h-2" />
                      </Box>
                    );
                  })
                ) : (
                  <Text size="2" className="text-gray-500">
                    No completion data
                  </Text>
                )}
              </Flex>
            )}
          </Box>
        </RadixCard>
      </Grid>

      {/* Detailed Analytics */}
      <Grid columns="4" gap="6">
        {/* Average Enrollment */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-green-50 to-teal-50 border-b border-green-100">
            <Flex align="center" gap="3">
              <Box className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </Box>
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Avg Enrollment
                </Heading>
                <Text size="2" className="text-gray-600">
                  Per course
                </Text>
              </Box>
            </Flex>
          </Box>

          <Box className="p-6">
            <Text size="6" weight="bold" className="text-green-600 block mb-2">
              {courses
                ? Math.round(
                    courses.reduce((sum, c) => sum + c.enrolledStudents, 0) /
                      courses.length
                  )
                : 0}
            </Text>
            <Text size="2" className="text-gray-600">
              students enrolled
            </Text>
          </Box>
        </RadixCard>

        {/* Popular Subjects */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
            <Flex align="center" gap="3">
              <Box className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </Box>
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Top Subject
                </Heading>
                <Text size="2" className="text-gray-600">
                  Most enrolled
                </Text>
              </Box>
            </Flex>
          </Box>

          <Box className="p-6">
            <Text size="6" weight="bold" className="text-blue-600 block mb-2">
              CS
            </Text>
            <Text size="2" className="text-gray-600">
              Computer Science
            </Text>
          </Box>
        </RadixCard>

        {/* Certification Rate */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
            <Flex align="center" gap="3">
              <Box className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-orange-600" />
              </Box>
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Certification
                </Heading>
                <Text size="2" className="text-gray-600">
                  Success rate
                </Text>
              </Box>
            </Flex>
          </Box>

          <Box className="p-6">
            <Text size="6" weight="bold" className="text-orange-600 block mb-2">
              84%
            </Text>
            <Text size="2" className="text-gray-600">
              pass certification
            </Text>
          </Box>
        </RadixCard>

        {/* Course Satisfaction */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
            <Flex align="center" gap="3">
              <Box className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-purple-600" />
              </Box>
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Satisfaction
                </Heading>
                <Text size="2" className="text-gray-600">
                  Student rating
                </Text>
              </Box>
            </Flex>
          </Box>

          <Box className="p-6">
            <Text size="6" weight="bold" className="text-purple-600 block mb-2">
              4.2
            </Text>
            <Text size="2" className="text-gray-600">
              out of 5 stars
            </Text>
          </Box>
        </RadixCard>
      </Grid>

      {/* Department Performance */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
          <Flex justify="between" align="center">
            <Box>
              <Heading size="4" className="text-gray-900 mb-1">
                Department Performance
              </Heading>
              <Text size="2" className="text-gray-600">
                Enrollment and completion rates by department
              </Text>
            </Box>
          </Flex>
        </Box>

        <Box className="p-6">
          <Grid columns="2" gap="6">
            {[
              {
                name: 'Computer Science',
                enrollment: 234,
                completion: 89,
                color: 'blue',
              },
              {
                name: 'Mathematics',
                enrollment: 189,
                completion: 92,
                color: 'green',
              },
              {
                name: 'Physics',
                enrollment: 156,
                completion: 85,
                color: 'purple',
              },
              {
                name: 'Chemistry',
                enrollment: 143,
                completion: 88,
                color: 'orange',
              },
            ].map((dept, index) => (
              <Box
                key={dept.name}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Flex justify="between" align="center" className="mb-3">
                  <Text size="2" weight="medium" className="text-gray-900">
                    {dept.name}
                  </Text>
                  <Text
                    size="2"
                    className={`text-${dept.color}-600 font-medium`}
                  >
                    {dept.completion}% completion
                  </Text>
                </Flex>
                <Flex justify="between" align="center" className="mb-2">
                  <Text size="1" className="text-gray-600">
                    Enrollment
                  </Text>
                  <Text size="1" className="text-gray-900 font-medium">
                    {dept.enrollment} students
                  </Text>
                </Flex>
                <Progress value={dept.completion} className="h-2" />
              </Box>
            ))}
          </Grid>
        </Box>
      </RadixCard>
    </Box>
  );
}
