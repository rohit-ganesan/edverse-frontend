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
  PieChart,
} from 'lucide-react';
import { useResultData } from '../hooks/useResultData';
import { useResultManagement } from '../hooks/useResultManagement';
import { SubjectAnalysisCard } from '../components/SubjectAnalysisCard';
import {
  SkeletonCard,
  SkeletonTableRow,
} from '../../../../components/ui/Skeleton';

export function Analytics({
  isLoading = false,
}: {
  isLoading?: boolean;
}): JSX.Element {
  const [selectedPeriod, setSelectedPeriod] = useState('semester');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const { results, analytics } = useResultData();
  const { getGradeColor, calculateGradeDistribution, exportResults } =
    useResultManagement();

  const gradeDistribution = calculateGradeDistribution(results);

  return (
    <Box className="space-y-8">
      {/* Analytics Header with Filters */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-violet-50 to-purple-50 border-b border-violet-100">
          <Flex justify="between" align="center" className="mb-6">
            <Box>
              <Heading size="5" className="text-gray-900 mb-1">
                Result Analytics
              </Heading>
              <Text size="3" className="text-gray-600">
                Comprehensive insights into academic performance and grade
                trends
              </Text>
            </Box>
            <Flex gap="2">
              <RadixButton
                variant="soft"
                size="2"
                onClick={() => exportResults(results)}
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

      {/* Analytics Charts */}
      <Grid columns="2" gap="8">
        {/* Subject-wise Analysis */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <Flex justify="between" align="center">
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Subject-wise Performance
                </Heading>
                <Text size="2" className="text-gray-600">
                  Average performance by subject
                </Text>
              </Box>
              <Flex align="center" gap="2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <Text size="2" className="text-green-600 font-medium">
                  +5.2% vs last semester
                </Text>
              </Flex>
            </Flex>
          </Box>

          <Box className="p-6">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={i} height="56px" className="mb-2" />
              ))
            ) : (
              <Flex direction="column" gap="4">
                {analytics.subjectWiseAnalysis &&
                analytics.subjectWiseAnalysis.length > 0 ? (
                  analytics.subjectWiseAnalysis.map((subject, index) => (
                    <Box
                      key={subject.subjectCode}
                      className={`animate-in slide-in-from-left-1 duration-300`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <SubjectAnalysisCard subject={subject} />
                    </Box>
                  ))
                ) : (
                  <Box className="h-48 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center border border-blue-100">
                    <Box className="text-center">
                      <BarChart3 className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                      <Text size="3" className="text-gray-600 mb-1">
                        Subject Analysis Chart
                      </Text>
                      <Text size="2" className="text-gray-500">
                        Performance data would appear here
                      </Text>
                    </Box>
                  </Box>
                )}
              </Flex>
            )}
          </Box>
        </RadixCard>

        {/* Grade Distribution */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-100">
            <Flex justify="between" align="center">
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Grade Distribution
                </Heading>
                <Text size="2" className="text-gray-600">
                  Overall grade patterns
                </Text>
              </Box>
              <Flex align="center" gap="2">
                <TrendingDown className="w-4 h-4 text-red-600" />
                <Text size="2" className="text-red-600 font-medium">
                  -1.8% vs last semester
                </Text>
              </Flex>
            </Flex>
          </Box>

          <Box className="p-6">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <SkeletonTableRow key={i} columns={3} className="mb-2" />
              ))
            ) : gradeDistribution && gradeDistribution.length > 0 ? (
              <Flex direction="column" gap="3">
                {gradeDistribution.map(
                  ({ grade, count, percentage }, index) => (
                    <Box
                      key={grade}
                      className={`animate-in slide-in-from-right-1 duration-300`}
                      style={{ animationDelay: `${index * 75}ms` }}
                    >
                      <Flex align="center" gap="3">
                        <Box className="w-8">
                          <Text
                            size="2"
                            weight="medium"
                            className="text-gray-900"
                          >
                            {grade}
                          </Text>
                        </Box>
                        <Box className="flex-1 bg-gray-200 rounded-full h-2">
                          <Box
                            className={`h-2 rounded-full transition-all duration-500 ${
                              getGradeColor(grade) === 'green'
                                ? 'bg-green-500'
                                : getGradeColor(grade) === 'blue'
                                  ? 'bg-blue-500'
                                  : getGradeColor(grade) === 'orange'
                                    ? 'bg-orange-500'
                                    : 'bg-red-500'
                            }`}
                            style={{
                              width: `${percentage}%`,
                              animationDelay: `${index * 100}ms`,
                            }}
                          />
                        </Box>
                        <Box className="w-12 text-right">
                          <Text size="2" className="text-gray-600">
                            {count}
                          </Text>
                        </Box>
                        <Box className="w-12 text-right">
                          <Text size="1" className="text-gray-500">
                            {percentage.toFixed(1)}%
                          </Text>
                        </Box>
                      </Flex>
                    </Box>
                  )
                )}
              </Flex>
            ) : (
              <Box className="h-48 bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg flex items-center justify-center border border-emerald-100">
                <Box className="text-center">
                  <PieChart className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                  <Text size="3" className="text-gray-600 mb-1">
                    Grade Distribution Chart
                  </Text>
                  <Text size="2" className="text-gray-500">
                    Distribution data would appear here
                  </Text>
                </Box>
              </Box>
            )}
          </Box>
        </RadixCard>
      </Grid>

      {/* Performance Metrics */}
      <Grid columns="3" gap="6">
        {/* Average Performance */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-5 bg-gradient-to-r from-cyan-50 to-blue-50 border-b border-cyan-100">
            <Flex align="center" gap="3">
              <Box className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-cyan-600" />
              </Box>
              <Box>
                <Heading size="3" className="text-gray-900 mb-1">
                  Average GPA
                </Heading>
                <Text size="1" className="text-gray-600">
                  Overall performance
                </Text>
              </Box>
            </Flex>
          </Box>
          <Box className="p-5">
            <Text size="6" weight="bold" className="text-gray-900 block">
              {analytics.averageGPA}
            </Text>
            <Text size="2" className="text-green-600">
              +0.3 from last semester
            </Text>
          </Box>
        </RadixCard>

        {/* Pass Rate */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
            <Flex align="center" gap="3">
              <Box className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-green-600" />
              </Box>
              <Box>
                <Heading size="3" className="text-gray-900 mb-1">
                  Pass Rate
                </Heading>
                <Text size="1" className="text-gray-600">
                  Success percentage
                </Text>
              </Box>
            </Flex>
          </Box>
          <Box className="p-5">
            <Text size="6" weight="bold" className="text-gray-900 block">
              {analytics.passPercentage}%
            </Text>
            <Text size="2" className="text-green-600">
              +2.1% improvement
            </Text>
          </Box>
        </RadixCard>

        {/* Top Performers */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-5 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
            <Flex align="center" gap="3">
              <Box className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </Box>
              <Box>
                <Heading size="3" className="text-gray-900 mb-1">
                  Excellence
                </Heading>
                <Text size="1" className="text-gray-600">
                  A+ and A grades
                </Text>
              </Box>
            </Flex>
          </Box>
          <Box className="p-5">
            <Text size="6" weight="bold" className="text-gray-900 block">
              {analytics.topPerformers.length}
            </Text>
            <Text size="2" className="text-orange-600">
              Top achievers
            </Text>
          </Box>
        </RadixCard>
      </Grid>
    </Box>
  );
}
