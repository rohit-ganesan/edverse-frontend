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
} from 'lucide-react';
import { useSessionManagement } from '../hooks/useSessionManagement';

export function Analytics(): JSX.Element {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedClass, setSelectedClass] = useState('all');
  const { handleExportReport } = useSessionManagement();

  return (
    <Box className="space-y-8">
      {/* Analytics Header with Filters */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-violet-50 to-purple-50 border-b border-violet-100">
          <Flex justify="between" align="center" className="mb-6">
            <Box>
              <Heading size="5" className="text-gray-900 mb-1">
                Attendance Analytics
              </Heading>
              <Text size="3" className="text-gray-600">
                Comprehensive insights into attendance patterns and trends
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
                Class Filter
              </Text>
              <Select.Root
                value={selectedClass}
                onValueChange={setSelectedClass}
                size="2"
              >
                <Select.Trigger className="w-full" />
                <Select.Content>
                  <Select.Item value="all">All Classes</Select.Item>
                  <Select.Item value="cs301">
                    Advanced JavaScript Programming
                  </Select.Item>
                  <Select.Item value="cs201">Data Structures Lab</Select.Item>
                  <Select.Item value="cs101">
                    Introduction to Programming
                  </Select.Item>
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
        {/* Attendance Trends Chart */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <Flex justify="between" align="center">
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Attendance Trends
                </Heading>
                <Text size="2" className="text-gray-600">
                  Daily attendance rates over time
                </Text>
              </Box>
              <Flex align="center" gap="2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <Text size="2" className="text-green-600 font-medium">
                  +2.3% vs last week
                </Text>
              </Flex>
            </Flex>
          </Box>

          <Box className="p-6">
            {/* Placeholder for chart */}
            <Box className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center border border-blue-100">
              <Box className="text-center">
                <BarChart3 className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                <Text size="3" className="text-gray-600 mb-1">
                  Attendance Trend Chart
                </Text>
                <Text size="2" className="text-gray-500">
                  Chart visualization would appear here
                </Text>
              </Box>
            </Box>
          </Box>
        </RadixCard>

        {/* Class Performance */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-100">
            <Flex justify="between" align="center">
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Class Performance
                </Heading>
                <Text size="2" className="text-gray-600">
                  Attendance rates by class
                </Text>
              </Box>
              <Flex align="center" gap="2">
                <TrendingDown className="w-4 h-4 text-red-600" />
                <Text size="2" className="text-red-600 font-medium">
                  -1.2% vs last week
                </Text>
              </Flex>
            </Flex>
          </Box>

          <Box className="p-6">
            {/* Class Performance List */}
            <Flex direction="column" gap="4">
              {[
                {
                  name: 'Advanced JavaScript Programming',
                  rate: 94,
                  trend: 'up',
                },
                { name: 'Data Structures Lab', rate: 89, trend: 'down' },
                { name: 'Introduction to Programming', rate: 92, trend: 'up' },
                { name: 'Database Management', rate: 87, trend: 'down' },
              ].map((classItem, index) => (
                <Box
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Flex justify="between" align="center">
                    <Box>
                      <Text
                        size="2"
                        weight="medium"
                        className="text-gray-900 block"
                      >
                        {classItem.name}
                      </Text>
                      <Text size="1" className="text-gray-600">
                        Class attendance rate
                      </Text>
                    </Box>
                    <Flex align="center" gap="2">
                      <Text size="2" weight="bold" className="text-gray-900">
                        {classItem.rate}%
                      </Text>
                      {classItem.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                    </Flex>
                  </Flex>
                </Box>
              ))}
            </Flex>
          </Box>
        </RadixCard>
      </Grid>

      {/* Detailed Analytics */}
      <Grid columns="3" gap="8">
        {/* Peak Hours */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
            <Heading size="4" className="text-gray-900">
              Peak Attendance Hours
            </Heading>
          </Box>
          <Box className="p-6">
            <Flex direction="column" gap="3">
              {[
                { time: '9:00 AM', percentage: 95 },
                { time: '10:00 AM', percentage: 92 },
                { time: '2:00 PM', percentage: 88 },
                { time: '3:00 PM', percentage: 85 },
              ].map((hour, index) => (
                <Flex key={index} justify="between" align="center">
                  <Text size="2" className="text-gray-700">
                    {hour.time}
                  </Text>
                  <Box className="flex items-center gap-2">
                    <Box className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <Box
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${hour.percentage}%` }}
                      />
                    </Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 w-10"
                    >
                      {hour.percentage}%
                    </Text>
                  </Box>
                </Flex>
              ))}
            </Flex>
          </Box>
        </RadixCard>

        {/* Weekly Patterns */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-teal-100">
            <Heading size="4" className="text-gray-900">
              Weekly Patterns
            </Heading>
          </Box>
          <Box className="p-6">
            <Flex direction="column" gap="3">
              {[
                { day: 'Monday', percentage: 89 },
                { day: 'Tuesday', percentage: 94 },
                { day: 'Wednesday', percentage: 91 },
                { day: 'Thursday', percentage: 88 },
                { day: 'Friday', percentage: 85 },
              ].map((day, index) => (
                <Flex key={index} justify="between" align="center">
                  <Text size="2" className="text-gray-700">
                    {day.day}
                  </Text>
                  <Box className="flex items-center gap-2">
                    <Box className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <Box
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${day.percentage}%` }}
                      />
                    </Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 w-10"
                    >
                      {day.percentage}%
                    </Text>
                  </Box>
                </Flex>
              ))}
            </Flex>
          </Box>
        </RadixCard>

        {/* Top Performers */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-100">
            <Heading size="4" className="text-gray-900">
              Top Performers
            </Heading>
          </Box>
          <Box className="p-6">
            <Flex direction="column" gap="3">
              {[
                { name: 'Alice Johnson', percentage: 100 },
                { name: 'David Wilson', percentage: 98 },
                { name: 'Bob Smith', percentage: 95 },
                { name: 'Carol Davis', percentage: 92 },
              ].map((student, index) => (
                <Flex key={index} justify="between" align="center">
                  <Text size="2" className="text-gray-700">
                    {student.name}
                  </Text>
                  <Box className="flex items-center gap-2">
                    <Box className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <Box
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${student.percentage}%` }}
                      />
                    </Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 w-10"
                    >
                      {student.percentage}%
                    </Text>
                  </Box>
                </Flex>
              ))}
            </Flex>
          </Box>
        </RadixCard>
      </Grid>
    </Box>
  );
}
