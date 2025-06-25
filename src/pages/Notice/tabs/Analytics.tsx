import { Box, Flex, Text, Heading, Grid, Select } from '@radix-ui/themes';
import { RadixCard } from 'components/ui/RadixCard';
import { RadixButton } from 'components/ui/RadixButton';
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Star,
  MessageSquare,
  Calendar,
  Filter,
  Download,
} from 'lucide-react';
import { CategoryAnalysisCard } from '../components/CategoryAnalysisCard';
import { TopNoticeItem } from '../components/TopNoticeItem';
import { useNoticeData } from '../hooks/useNoticeData';
import { useNoticeManagement } from '../hooks/useNoticeManagement';
import { useState } from 'react';
import { SkeletonCard, SkeletonTableRow } from 'components/ui/Skeleton';

export function Analytics({
  isLoading = false,
}: {
  isLoading?: boolean;
}): JSX.Element {
  const { notices, analytics } = useNoticeData();
  const { handleExportNotices } = useNoticeManagement();

  const [timePeriod, setTimePeriod] = useState('last30days');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Get top performing notices
  const topNotices = notices
    .sort(
      (a, b) =>
        b.views +
        b.likes * 2 +
        b.comments * 3 -
        (a.views + a.likes * 2 + a.comments * 3)
    )
    .slice(0, 5);

  return (
    <Box className="space-y-8">
      {/* Analytics Header */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-violet-50 to-purple-50 border-b border-violet-100">
          <Flex justify="between" align="center">
            <Flex align="center" gap="3">
              <Box className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-violet-600" />
              </Box>
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Notice Analytics
                </Heading>
                <Text size="2" className="text-gray-600">
                  Performance insights and engagement metrics
                </Text>
              </Box>
            </Flex>
            <Flex gap="2">
              <Select.Root
                value={timePeriod}
                onValueChange={setTimePeriod}
                size="2"
              >
                <Select.Trigger className="min-w-[140px]" />
                <Select.Content>
                  <Select.Item value="last7days">Last 7 Days</Select.Item>
                  <Select.Item value="last30days">Last 30 Days</Select.Item>
                  <Select.Item value="last90days">Last 90 Days</Select.Item>
                  <Select.Item value="lastyear">Last Year</Select.Item>
                </Select.Content>
              </Select.Root>
              <RadixButton
                variant="outline"
                size="2"
                onClick={handleExportNotices}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </RadixButton>
            </Flex>
          </Flex>
        </Box>

        {/* Key Metrics */}
        <Box className="p-6">
          <Grid columns="4" gap="4">
            <Box className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
              <Box className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Eye className="w-6 h-6 text-blue-600" />
              </Box>
              <Text size="3" weight="bold" className="text-gray-900 block">
                {analytics.totalViews.toLocaleString()}
              </Text>
              <Text size="1" className="text-gray-600">
                Total Views
              </Text>
            </Box>

            <Box className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
              <Box className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Star className="w-6 h-6 text-green-600" />
              </Box>
              <Text size="3" weight="bold" className="text-gray-900 block">
                {analytics.totalLikes}
              </Text>
              <Text size="1" className="text-gray-600">
                Total Likes
              </Text>
            </Box>

            <Box className="text-center p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg">
              <Box className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <MessageSquare className="w-6 h-6 text-orange-600" />
              </Box>
              <Text size="3" weight="bold" className="text-gray-900 block">
                {analytics.totalComments}
              </Text>
              <Text size="1" className="text-gray-600">
                Total Comments
              </Text>
            </Box>

            <Box className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg">
              <Box className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </Box>
              <Text size="3" weight="bold" className="text-gray-900 block">
                {Math.round(analytics.averageEngagement)}
              </Text>
              <Text size="1" className="text-gray-600">
                Avg Engagement
              </Text>
            </Box>
          </Grid>
        </Box>
      </RadixCard>

      <Grid columns="3" gap="6">
        {/* Category Performance */}
        <Box className="col-span-2">
          <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
            <Box className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
              <Flex justify="between" align="center">
                <Box>
                  <Heading size="4" className="text-gray-900 mb-1">
                    Category Performance
                  </Heading>
                  <Text size="2" className="text-gray-600">
                    Engagement metrics by notice category
                  </Text>
                </Box>
                <Select.Root
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                  size="2"
                >
                  <Select.Trigger className="min-w-[120px]" />
                  <Select.Content>
                    <Select.Item value="all">All Categories</Select.Item>
                    <Select.Item value="academic">Academic</Select.Item>
                    <Select.Item value="administrative">
                      Administrative
                    </Select.Item>
                    <Select.Item value="event">Event</Select.Item>
                    <Select.Item value="emergency">Emergency</Select.Item>
                    <Select.Item value="general">General</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Flex>
            </Box>

            <Box className="p-6">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonTableRow key={i} columns={2} className="mb-2" />
                ))
              ) : (
                <Grid columns="2" gap="4">
                  {analytics.topCategories.map((category, index) => (
                    <CategoryAnalysisCard
                      key={category.category}
                      category={category}
                      rank={index + 1}
                      className={`animate-slide-in-left`}
                      style={{ animationDelay: `${index * 150}ms` } as any}
                    />
                  ))}
                </Grid>
              )}
            </Box>
          </RadixCard>
        </Box>

        {/* Top Performing Notices */}
        <Box>
          <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
            <Box className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
              <Flex align="center" gap="3">
                <Box className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </Box>
                <Box>
                  <Heading size="3" className="text-gray-900 mb-1">
                    Top Performers
                  </Heading>
                  <Text size="1" className="text-gray-600">
                    Highest engagement notices
                  </Text>
                </Box>
              </Flex>
            </Box>

            <Box className="p-6">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <SkeletonCard key={index} height={40} />
                ))
              ) : (
                <Flex direction="column" gap="3">
                  {topNotices.map((notice, index) => (
                    <TopNoticeItem
                      key={notice.id}
                      notice={notice}
                      rank={index + 1}
                      className={`animate-slide-in-right`}
                      style={{ animationDelay: `${index * 100}ms` } as any}
                    />
                  ))}
                </Flex>
              )}
            </Box>
          </RadixCard>
        </Box>
      </Grid>

      {/* Engagement Trends */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
          <Flex justify="between" align="center">
            <Box>
              <Heading size="4" className="text-gray-900 mb-1">
                Engagement Trends
              </Heading>
              <Text size="2" className="text-gray-600">
                Notice performance over time
              </Text>
            </Box>
            <Flex gap="2">
              <RadixButton variant="outline" size="2">
                <Calendar className="w-4 h-4 mr-2" />
                Date Range
              </RadixButton>
              <RadixButton variant="outline" size="2">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </RadixButton>
            </Flex>
          </Flex>
        </Box>

        <Box className="p-6">
          <Grid columns="2" gap="8">
            {/* Engagement Chart Placeholder */}
            <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
              <Box className="p-6">
                {isLoading ? (
                  <SkeletonCard height={256} />
                ) : (
                  <Flex direction="column" align="center" gap="3">
                    <BarChart3 className="w-12 h-12 text-gray-400" />
                    <Text size="2" className="text-gray-600 text-center">
                      Engagement trends chart
                      <br />
                      <Text size="1" className="text-gray-500">
                        Views, likes, and comments over time
                      </Text>
                    </Text>
                  </Flex>
                )}
              </Box>
            </RadixCard>

            {/* Audience Reach */}
            <Box>
              <Heading size="3" className="text-gray-900 mb-4">
                Audience Reach
              </Heading>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <SkeletonTableRow key={index} columns={2} className="mb-2" />
                ))
              ) : (
                <Flex direction="column" gap="3">
                  {analytics.audienceReach.map((audience, index) => (
                    <Box
                      key={audience.audience}
                      className={`p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg animate-fade-in`}
                      style={{ animationDelay: `${index * 100}ms` } as any}
                    >
                      <Flex justify="between" align="center" className="mb-2">
                        <Text
                          size="2"
                          weight="medium"
                          className="text-gray-900 capitalize"
                        >
                          {audience.audience}
                        </Text>
                        <Text size="2" weight="bold" className="text-gray-900">
                          {audience.count}
                        </Text>
                      </Flex>
                      <Box className="w-full bg-gray-200 rounded-full h-2">
                        <Box
                          className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                          style={{ width: `${audience.percentage}%` }}
                        />
                      </Box>
                      <Text size="1" className="text-gray-600 mt-1">
                        {Math.round(audience.percentage)}% of total notices
                      </Text>
                    </Box>
                  ))}
                </Flex>
              )}
            </Box>
          </Grid>
        </Box>
      </RadixCard>

      {/* Performance Summary */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100">
          <Flex align="center" gap="3">
            <Box className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-indigo-600" />
            </Box>
            <Box>
              <Heading size="4" className="text-gray-900 mb-1">
                Performance Summary
              </Heading>
              <Text size="2" className="text-gray-600">
                Key insights and recommendations
              </Text>
            </Box>
          </Flex>
        </Box>

        <Box className="p-6">
          <Grid columns="3" gap="6">
            <Box className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
              <Text
                size="4"
                weight="bold"
                className="text-green-600 block mb-2"
              >
                📈 Growing
              </Text>
              <Text size="2" className="text-gray-900 font-medium block mb-1">
                Academic Notices
              </Text>
              <Text size="1" className="text-gray-600">
                +23% engagement this month
              </Text>
            </Box>

            <Box className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
              <Text size="4" weight="bold" className="text-blue-600 block mb-2">
                🎯 Best Time
              </Text>
              <Text size="2" className="text-gray-900 font-medium block mb-1">
                Tuesday 10 AM
              </Text>
              <Text size="1" className="text-gray-600">
                Highest engagement window
              </Text>
            </Box>

            <Box className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg">
              <Text
                size="4"
                weight="bold"
                className="text-purple-600 block mb-2"
              >
                👥 Top Audience
              </Text>
              <Text size="2" className="text-gray-900 font-medium block mb-1">
                Students
              </Text>
              <Text size="1" className="text-gray-600">
                Most active user group
              </Text>
            </Box>
          </Grid>
        </Box>
      </RadixCard>
    </Box>
  );
}
