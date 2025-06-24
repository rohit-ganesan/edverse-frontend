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
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  CreditCard,
  TrendingDown,
} from 'lucide-react';
import { useFeeData } from '../hooks/useFeeData';

export function Analytics(): JSX.Element {
  const { payments, stats } = useFeeData();
  const [selectedPeriod, setSelectedPeriod] = useState('semester');
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <Box className="space-y-8">
      {/* Analytics Header with Filters */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-violet-50 to-purple-50 border-b border-violet-100">
          <Flex justify="between" align="center" className="mb-6">
            <Box>
              <Heading size="5" className="text-gray-900 mb-1">
                Fee Analytics
              </Heading>
              <Text size="3" className="text-gray-600">
                Comprehensive insights into fee collection and payment trends
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
                Fee Category
              </Text>
              <Select.Root
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                size="2"
              >
                <Select.Trigger className="w-full" />
                <Select.Content>
                  <Select.Item value="all">All Categories</Select.Item>
                  <Select.Item value="tuition">Tuition</Select.Item>
                  <Select.Item value="hostel">Hostel</Select.Item>
                  <Select.Item value="library">Library</Select.Item>
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
        {/* Collection Trends */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <Flex justify="between" align="center">
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Collection Trends
                </Heading>
                <Text size="2" className="text-gray-600">
                  Monthly fee collection rates
                </Text>
              </Box>
              <Flex align="center" gap="2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <Text size="2" className="text-green-600 font-medium">
                  +8.5% vs last month
                </Text>
              </Flex>
            </Flex>
          </Box>

          <Box className="p-6">
            <Box className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center border border-blue-100">
              <Box className="text-center">
                <BarChart3 className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                <Text size="3" className="text-gray-600 mb-1">
                  Collection Trend Chart
                </Text>
                <Text size="2" className="text-gray-500">
                  Chart visualization would appear here
                </Text>
              </Box>
            </Box>
          </Box>
        </RadixCard>

        {/* Payment Status Distribution */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-100">
            <Flex justify="between" align="center">
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Payment Status
                </Heading>
                <Text size="2" className="text-gray-600">
                  Current payment breakdown
                </Text>
              </Box>
              <Flex align="center" gap="2">
                <TrendingDown className="w-4 h-4 text-red-600" />
                <Text size="2" className="text-red-600 font-medium">
                  -2.1% overdue rate
                </Text>
              </Flex>
            </Flex>
          </Box>

          <Box className="p-6">
            <Flex direction="column" gap="4">
              {[
                {
                  status: 'Completed',
                  count: payments.filter((p) => p.status === 'completed')
                    .length,
                  color: 'bg-green-500',
                },
                {
                  status: 'Pending',
                  count: payments.filter((p) => p.status === 'pending').length,
                  color: 'bg-yellow-500',
                },
                {
                  status: 'Failed',
                  count: payments.filter((p) => p.status === 'failed').length,
                  color: 'bg-red-500',
                },
                {
                  status: 'Refunded',
                  count: payments.filter((p) => p.status === 'refunded').length,
                  color: 'bg-blue-500',
                },
              ].map((item, index) => (
                <Box
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Flex justify="between" align="center">
                    <Box className="flex items-center gap-3">
                      <Box className={`w-3 h-3 rounded-full ${item.color}`} />
                      <Text size="2" weight="medium" className="text-gray-900">
                        {item.status}
                      </Text>
                    </Box>
                    <Box className="flex items-center gap-2">
                      <Text size="2" className="text-gray-600">
                        {item.count} payments
                      </Text>
                      <Text size="1" className="text-gray-500">
                        ({Math.round((item.count / payments.length) * 100)}%)
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
        {/* Collection Rate */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
            <Flex justify="between" align="center">
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Collection Rate
                </Heading>
                <Text size="2" className="text-gray-600">
                  Overall collection efficiency
                </Text>
              </Box>
              <DollarSign className="w-5 h-5 text-orange-600" />
            </Flex>
          </Box>

          <Box className="p-6">
            <Box className="text-center">
              <Text size="8" weight="bold" className="text-orange-600 block">
                {stats.collectionRate}%
              </Text>
              <Text size="2" className="text-gray-600 mt-2">
                ${stats.totalFeesCollected.toLocaleString()} collected
              </Text>
            </Box>
          </Box>
        </RadixCard>

        {/* Average Payment Time */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-teal-100">
            <Flex justify="between" align="center">
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Avg Payment Time
                </Heading>
                <Text size="2" className="text-gray-600">
                  Days to payment completion
                </Text>
              </Box>
              <Calendar className="w-5 h-5 text-teal-600" />
            </Flex>
          </Box>

          <Box className="p-6">
            <Box className="text-center">
              <Text size="8" weight="bold" className="text-teal-600 block">
                12
              </Text>
              <Text size="2" className="text-gray-600 mt-2">
                days average
              </Text>
            </Box>
          </Box>
        </RadixCard>

        {/* Payment Methods */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-100">
            <Flex justify="between" align="center">
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Popular Method
                </Heading>
                <Text size="2" className="text-gray-600">
                  Most used payment method
                </Text>
              </Box>
              <CreditCard className="w-5 h-5 text-rose-600" />
            </Flex>
          </Box>

          <Box className="p-6">
            <Box className="text-center">
              <Text size="6" weight="bold" className="text-rose-600 block">
                Online
              </Text>
              <Text size="2" className="text-gray-600 mt-2">
                45% of all payments
              </Text>
            </Box>
          </Box>
        </RadixCard>
      </Grid>
    </Box>
  );
}
