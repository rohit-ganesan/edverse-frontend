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
  FileText,
  BookOpen,
  Target,
  CheckCircle,
} from 'lucide-react';
import { useSyllabusData } from '../hooks/useSyllabusData';
import { SkeletonCard, SkeletonTableRow } from 'components/ui/Skeleton';

export function Analytics({
  isLoading = false,
}: {
  isLoading?: boolean;
}): JSX.Element {
  const [selectedPeriod, setSelectedPeriod] = useState('semester');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const { syllabi } = useSyllabusData();

  const handleExportReport = () => {
    console.log('Exporting syllabus analytics report...');
  };

  return (
    <Box className="space-y-8">
      {/* Analytics Header with Filters */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-100">
          <Flex justify="between" align="center" className="mb-6">
            <Box>
              <Heading size="5" className="text-gray-900 mb-1">
                Syllabus Analytics
              </Heading>
              <Text size="3" className="text-gray-600">
                Comprehensive insights into curriculum progress and learning
                objectives
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
                Subject Filter
              </Text>
              <Select.Root
                value={selectedSubject}
                onValueChange={setSelectedSubject}
                size="2"
              >
                <Select.Trigger className="w-full" />
                <Select.Content>
                  <Select.Item value="all">All Subjects</Select.Item>
                  <Select.Item value="mathematics">Mathematics</Select.Item>
                  <Select.Item value="science">Science</Select.Item>
                  <Select.Item value="english">English</Select.Item>
                  <Select.Item value="history">History</Select.Item>
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
        {/* Completion Progress Chart */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
            <Flex justify="between" align="center">
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Completion Progress
                </Heading>
                <Text size="2" className="text-gray-600">
                  Syllabus completion rates over time
                </Text>
              </Box>
              <Flex align="center" gap="2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <Text size="2" className="text-green-600 font-medium">
                  +8.3% vs last month
                </Text>
              </Flex>
            </Flex>
          </Box>

          <Box className="p-6">
            {isLoading ? (
              <SkeletonCard height="256px" />
            ) : (
              <Box className="h-64 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg flex items-center justify-center border border-green-100">
                <Box className="text-center">
                  <BarChart3 className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <Text size="3" className="text-gray-600 mb-1">
                    Progress Trend Chart
                  </Text>
                  <Text size="2" className="text-gray-500">
                    Chart visualization would appear here
                  </Text>
                </Box>
              </Box>
            )}
          </Box>
        </RadixCard>

        {/* Learning Objectives Achievement */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <Flex justify="between" align="center">
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Learning Objectives
                </Heading>
                <Text size="2" className="text-gray-600">
                  Achievement rates by syllabus
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
                {syllabi && syllabi.length > 0 ? (
                  syllabi.map((syllabus, index) => {
                    const achievementRate = Math.floor(Math.random() * 25) + 75; // Mock achievement rate
                    return (
                      <Box
                        key={syllabus.id}
                        className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Flex justify="between" align="center" className="mb-2">
                          <Box>
                            <Text
                              size="2"
                              weight="medium"
                              className="text-gray-900 block"
                            >
                              {syllabus.title}
                            </Text>
                            <Text size="1" className="text-gray-600">
                              {syllabus.subject} - {syllabus.objectives}{' '}
                            </Text>
                          </Box>
                          <Box className="text-right">
                            <Text size="2" className="text-gray-900 font-bold">
                              {achievementRate}%
                            </Text>
                          </Box>
                        </Flex>
                        <Progress value={achievementRate} className="h-2" />
                      </Box>
                    );
                  })
                ) : (
                  <Text size="2" className="text-gray-500">
                    No achievement data
                  </Text>
                )}
              </Flex>
            )}
          </Box>
        </RadixCard>
      </Grid>

      {/* Detailed Analytics */}
      <Grid columns="4" gap="6">
        {/* Total Topics */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
            <Flex align="center" gap="3">
              <Box className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </Box>
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Total Topics
                </Heading>
                <Text size="2" className="text-gray-600">
                  Across all syllabi
                </Text>
              </Box>
            </Flex>
          </Box>

          <Box className="p-6">
            <Text size="6" weight="bold" className="text-blue-600 block mb-2">
              {syllabi ? syllabi.reduce((sum, s) => sum + s.topics, 0) : 0}
            </Text>
            <Text size="2" className="text-gray-600">
              topics covered
            </Text>
          </Box>
        </RadixCard>

        {/* Learning Objectives */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-green-50 to-teal-50 border-b border-green-100">
            <Flex align="center" gap="3">
              <Box className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-green-600" />
              </Box>
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Objectives
                </Heading>
                <Text size="2" className="text-gray-600">
                  Learning goals
                </Text>
              </Box>
            </Flex>
          </Box>

          <Box className="p-6">
            <Text size="6" weight="bold" className="text-green-600 block mb-2">
              {syllabi ? syllabi.reduce((sum, s) => sum + s.objectives, 0) : 0}
            </Text>
            <Text size="2" className="text-gray-600">
              defined objectives
            </Text>
          </Box>
        </RadixCard>

        {/* Completion Rate */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
            <Flex align="center" gap="3">
              <Box className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-orange-600" />
              </Box>
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Avg Completion
                </Heading>
                <Text size="2" className="text-gray-600">
                  Overall progress
                </Text>
              </Box>
            </Flex>
          </Box>

          <Box className="p-6">
            <Text size="6" weight="bold" className="text-orange-600 block mb-2">
              {syllabi
                ? Math.round(
                    syllabi.reduce((sum, s) => sum + s.completionRate, 0) /
                      syllabi.length
                  )
                : 0}
              %
            </Text>
            <Text size="2" className="text-gray-600">
              completed on average
            </Text>
          </Box>
        </RadixCard>

        {/* Active Syllabi */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
            <Flex align="center" gap="3">
              <Box className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-600" />
              </Box>
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Active Syllabi
                </Heading>
                <Text size="2" className="text-gray-600">
                  Currently in use
                </Text>
              </Box>
            </Flex>
          </Box>

          <Box className="p-6">
            <Text size="6" weight="bold" className="text-purple-600 block mb-2">
              {syllabi ? syllabi.filter((s) => s.isActive).length : 0}
            </Text>
            <Text size="2" className="text-gray-600">
              active syllabi
            </Text>
          </Box>
        </RadixCard>
      </Grid>

      {/* Subject Performance */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
          <Flex justify="between" align="center">
            <Box>
              <Heading size="4" className="text-gray-900 mb-1">
                Subject Performance
              </Heading>
              <Text size="2" className="text-gray-600">
                Completion rates and progress by subject area
              </Text>
            </Box>
          </Flex>
        </Box>

        <Box className="p-6">
          <Grid columns="2" gap="6">
            {[
              {
                name: 'Mathematics',
                topics: 45,
                completion: 87,
                color: 'blue',
              },
              { name: 'Science', topics: 38, completion: 92, color: 'green' },
              { name: 'English', topics: 32, completion: 89, color: 'purple' },
              { name: 'History', topics: 28, completion: 84, color: 'orange' },
            ].map((subject, index) => (
              <Box
                key={subject.name}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Flex justify="between" align="center" className="mb-3">
                  <Text size="2" weight="medium" className="text-gray-900">
                    {subject.name}
                  </Text>
                  <Text
                    size="2"
                    className={`text-${subject.color}-600 font-medium`}
                  >
                    {subject.completion}% complete
                  </Text>
                </Flex>
                <Flex justify="between" align="center" className="mb-2">
                  <Text size="1" className="text-gray-600">
                    Topics covered
                  </Text>
                  <Text size="1" className="text-gray-900 font-medium">
                    {subject.topics} topics
                  </Text>
                </Flex>
                <Progress value={subject.completion} className="h-2" />
              </Box>
            ))}
          </Grid>
        </Box>
      </RadixCard>
    </Box>
  );
}
