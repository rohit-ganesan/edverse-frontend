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
  BarChart3,
  PieChart,
  Download,
  Calendar,
  Users,
  GraduationCap,
  Award,
} from 'lucide-react';
import { useAdmissionData } from '../hooks/useAdmissionData';
import { SkeletonCard } from '../../../components/ui/Skeleton';

export function Analytics({
  isLoading = false,
}: {
  isLoading?: boolean;
}): JSX.Element {
  const { programs, stats } = useAdmissionData();
  const [selectedPeriod, setSelectedPeriod] = useState('semester');
  const [selectedProgram, setSelectedProgram] = useState('all');

  return (
    <Box className="space-y-8">
      {/* Analytics Header with Filters */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-violet-50 to-purple-50 border-b border-violet-100">
          <Flex justify="between" align="center" className="mb-6">
            <Box>
              <Heading size="5" className="text-gray-900 mb-1">
                Admission Analytics
              </Heading>
              <Text size="3" className="text-gray-600">
                Comprehensive insights into application trends and performance
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
                Program Filter
              </Text>
              <Select.Root
                value={selectedProgram}
                onValueChange={setSelectedProgram}
                size="2"
              >
                <Select.Trigger className="w-full" />
                <Select.Content>
                  <Select.Item value="all">All Programs</Select.Item>
                  <Select.Item value="cs">Computer Science</Select.Item>
                  <Select.Item value="business">Business</Select.Item>
                  <Select.Item value="psychology">Psychology</Select.Item>
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
        {/* Application Trends */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <Flex justify="between" align="center">
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Application Trends
                </Heading>
                <Text size="2" className="text-gray-600">
                  Monthly application submissions
                </Text>
              </Box>
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </Flex>
          </Box>

          <Box className="p-6">
            {isLoading ? (
              <SkeletonCard height="256px" />
            ) : (
              <Box className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center border border-blue-100">
                <Box className="text-center">
                  <BarChart3 className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                  <Text size="3" className="text-gray-600 mb-1">
                    Application Trend Chart
                  </Text>
                  <Text size="2" className="text-gray-500">
                    Chart visualization would appear here
                  </Text>
                </Box>
              </Box>
            )}
          </Box>
        </RadixCard>

        {/* Program Distribution */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-100">
            <Flex justify="between" align="center">
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Program Distribution
                </Heading>
                <Text size="2" className="text-gray-600">
                  Applications by program
                </Text>
              </Box>
              <PieChart className="w-5 h-5 text-green-600" />
            </Flex>
          </Box>

          <Box className="p-6">
            <Flex direction="column" gap="4">
              {programs.map((program, index) => (
                <Box
                  key={program.id}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Flex justify="between" align="center">
                    <Box className="flex items-center gap-3">
                      <Box
                        className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-green-500' : index === 1 ? 'bg-blue-500' : 'bg-purple-500'}`}
                      />
                      <Text size="2" weight="medium" className="text-gray-900">
                        {program.name}
                      </Text>
                    </Box>
                    <Box className="flex items-center gap-2">
                      <Text size="2" className="text-gray-600">
                        {program.applicationsReceived} applications
                      </Text>
                      <Text size="1" className="text-gray-500">
                        (
                        {Math.round(
                          (program.applicationsReceived /
                            programs.reduce(
                              (sum, p) => sum + p.applicationsReceived,
                              0
                            )) *
                            100
                        )}
                        %)
                      </Text>
                    </Box>
                  </Flex>
                </Box>
              ))}
            </Flex>
          </Box>
        </RadixCard>
      </Grid>

      {/* Performance Metrics */}
      <Grid columns="3" gap="8">
        {/* Acceptance Rate */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
            <Flex justify="between" align="center">
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Acceptance Rate
                </Heading>
                <Text size="2" className="text-gray-600">
                  Overall acceptance statistics
                </Text>
              </Box>
              <Award className="w-5 h-5 text-orange-600" />
            </Flex>
          </Box>

          <Box className="p-6">
            {isLoading ? (
              <SkeletonCard height="128px" />
            ) : (
              <Box className="text-center">
                <Text size="8" weight="bold" className="text-orange-600 block">
                  {stats.acceptanceRate}%
                </Text>
                <Text size="2" className="text-gray-600 mt-2">
                  {stats.acceptedApplications} out of {stats.totalApplications}{' '}
                  applications
                </Text>
              </Box>
            )}
          </Box>
        </RadixCard>

        {/* Average GPA */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-teal-100">
            <Flex justify="between" align="center">
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Average GPA
                </Heading>
                <Text size="2" className="text-gray-600">
                  Accepted students
                </Text>
              </Box>
              <GraduationCap className="w-5 h-5 text-teal-600" />
            </Flex>
          </Box>

          <Box className="p-6">
            {isLoading ? (
              <SkeletonCard height="128px" />
            ) : (
              <Box className="text-center">
                <Text size="8" weight="bold" className="text-teal-600 block">
                  3.85
                </Text>
                <Text size="2" className="text-gray-600 mt-2">
                  Minimum required: 3.0
                </Text>
              </Box>
            )}
          </Box>
        </RadixCard>

        {/* Interview Success */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-100">
            <Flex justify="between" align="center">
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Interview Success
                </Heading>
                <Text size="2" className="text-gray-600">
                  Interview to acceptance rate
                </Text>
              </Box>
              <Users className="w-5 h-5 text-rose-600" />
            </Flex>
          </Box>

          <Box className="p-6">
            {isLoading ? (
              <SkeletonCard height="128px" />
            ) : (
              <Box className="text-center">
                <Text size="8" weight="bold" className="text-rose-600 block">
                  85%
                </Text>
                <Text size="2" className="text-gray-600 mt-2">
                  {stats.interviewsScheduled} interviews scheduled
                </Text>
              </Box>
            )}
          </Box>
        </RadixCard>
      </Grid>
    </Box>
  );
}
