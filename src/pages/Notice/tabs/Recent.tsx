import { Box, Flex, Text, Heading, Grid } from '@radix-ui/themes';
import { RadixCard } from 'components/ui/RadixCard';
import { RadixButton } from 'components/ui/RadixButton';
import { Clock, TrendingUp, Eye, Calendar } from 'lucide-react';
import { NoticeCard } from '../components/NoticeCard';
import { TopNoticeItem } from '../components/TopNoticeItem';
import { useNoticeData } from '../hooks/useNoticeData';
import { useNoticeManagement } from '../hooks/useNoticeManagement';
import { SkeletonCard } from 'components/ui/Skeleton';

export function Recent({
  isLoading = false,
}: {
  isLoading?: boolean;
}): JSX.Element {
  const { recentNotices, notices } = useNoticeData();
  const { handleCreateNotice } = useNoticeManagement();

  // Get top performing notices from recent ones
  const topRecentNotices = recentNotices
    .sort(
      (a, b) =>
        b.views +
        b.likes * 2 +
        b.comments * 3 -
        (a.views + a.likes * 2 + a.comments * 3)
    )
    .slice(0, 5);

  // Get notices from last 24 hours
  const last24Hours = notices.filter((notice) => {
    const noticeDate = new Date(notice.publishDate);
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return noticeDate >= yesterday;
  });

  return (
    <Box className="space-y-6">
      {/* Quick Actions */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100">
          <Flex align="center" gap="3">
            <Box className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
            </Box>
            <Box>
              <Heading size="4" className="text-gray-900 mb-1">
                Quick Actions
              </Heading>
              <Text size="2" className="text-gray-600">
                Common tasks for notice management
              </Text>
            </Box>
          </Flex>
        </Box>

        <Box className="p-6">
          <Grid columns="4" gap="4">
            <RadixButton
              variant="outline"
              size="3"
              className="h-20 flex-col gap-2"
              onClick={handleCreateNotice}
            >
              <Calendar className="w-6 h-6" />
              <Text size="2">Create Notice</Text>
            </RadixButton>

            <RadixButton
              variant="outline"
              size="3"
              className="h-20 flex-col gap-2"
            >
              <Eye className="w-6 h-6" />
              <Text size="2">View Analytics</Text>
            </RadixButton>

            <RadixButton
              variant="outline"
              size="3"
              className="h-20 flex-col gap-2"
            >
              <TrendingUp className="w-6 h-6" />
              <Text size="2">Export Report</Text>
            </RadixButton>

            <RadixButton
              variant="outline"
              size="3"
              className="h-20 flex-col gap-2"
            >
              <Clock className="w-6 h-6" />
              <Text size="2">Schedule Notice</Text>
            </RadixButton>
          </Grid>
        </Box>
      </RadixCard>

      {/* Recent Activity Header */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
          <Flex align="center" gap="3">
            <Box className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-green-600" />
            </Box>
            <Box>
              <Heading size="4" className="text-gray-900 mb-1">
                Recent Activity
              </Heading>
              <Text size="2" className="text-gray-600">
                Latest notices and announcements from the past week
              </Text>
            </Box>
          </Flex>
        </Box>

        {/* Activity Stats */}
        <Box className="p-6">
          <Grid columns="3" gap="4">
            <Box className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
              <Box className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Calendar className="w-6 h-6 text-blue-600" />
              </Box>
              <Text size="3" weight="bold" className="text-gray-900 block">
                {last24Hours.length}
              </Text>
              <Text size="1" className="text-gray-600">
                Last 24 Hours
              </Text>
            </Box>

            <Box className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
              <Box className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="w-6 h-6 text-green-600" />
              </Box>
              <Text size="3" weight="bold" className="text-gray-900 block">
                {recentNotices.length}
              </Text>
              <Text size="1" className="text-gray-600">
                This Week
              </Text>
            </Box>

            <Box className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg">
              <Box className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </Box>
              <Text size="3" weight="bold" className="text-gray-900 block">
                {recentNotices.reduce((sum, notice) => sum + notice.views, 0)}
              </Text>
              <Text size="1" className="text-gray-600">
                Total Views
              </Text>
            </Box>
          </Grid>
        </Box>
      </RadixCard>

      <Grid columns="3" gap="6">
        {/* Recent Notices */}
        <Box className="col-span-2">
          <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
            <Box className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
              <Flex justify="between" align="center">
                <Box>
                  <Heading size="4" className="text-gray-900 mb-1">
                    Recent Notices
                  </Heading>
                  <Text size="2" className="text-gray-600">
                    Notices published in the last 7 days
                  </Text>
                </Box>
                <RadixButton
                  variant="outline"
                  size="2"
                  onClick={handleCreateNotice}
                >
                  Create Notice
                </RadixButton>
              </Flex>
            </Box>

            <Box className="p-6">
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <SkeletonCard key={i} height={80} />
                  ))}
                </div>
              ) : recentNotices.length > 0 ? (
                <Grid columns="1" gap="4">
                  {recentNotices.map((notice, index) => (
                    <NoticeCard
                      key={notice.id}
                      notice={notice}
                      compact
                      className={`transform transition-all duration-300 hover:scale-[1.01] animate-fade-in`}
                      style={{ animationDelay: `${index * 100}ms` } as any}
                    />
                  ))}
                </Grid>
              ) : (
                <Box className="text-center py-12">
                  <Box className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-gray-400" />
                  </Box>
                  <Box className="space-y-2">
                    <Text
                      size="3"
                      weight="medium"
                      className="text-gray-900 block"
                    >
                      No recent notices
                    </Text>
                    <Text size="2" className="text-gray-500 block">
                      No notices have been published in the last 7 days
                    </Text>
                  </Box>
                  <RadixButton
                    variant="outline"
                    size="3"
                    className="mt-4"
                    onClick={handleCreateNotice}
                  >
                    Create Notice
                  </RadixButton>
                </Box>
              )}
            </Box>
          </RadixCard>
        </Box>

        {/* Top Performing Recent */}
        <Box>
          <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
            <Box className="p-6 bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-100">
              <Flex align="center" gap="3">
                <Box className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                </Box>
                <Box>
                  <Heading size="3" className="text-gray-900 mb-1">
                    Top Performing
                  </Heading>
                  <Text size="1" className="text-gray-600">
                    Most engaged recent notices
                  </Text>
                </Box>
              </Flex>
            </Box>

            <Box className="p-6">
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <SkeletonCard key={i} height={80} />
                  ))}
                </div>
              ) : topRecentNotices.length > 0 ? (
                <Flex direction="column" gap="3">
                  {topRecentNotices.map((notice, index) => (
                    <TopNoticeItem
                      key={notice.id}
                      notice={notice}
                      rank={index + 1}
                      className={`animate-slide-in-right`}
                      style={{ animationDelay: `${index * 150}ms` } as any}
                    />
                  ))}
                </Flex>
              ) : (
                <Box className="text-center py-8">
                  <Box className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Eye className="w-6 h-6 text-gray-400" />
                  </Box>
                  <Box className="space-y-1">
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 block"
                    >
                      No data yet
                    </Text>
                    <Text size="1" className="text-gray-500 block">
                      Performance data will appear as notices gain engagement
                    </Text>
                  </Box>
                </Box>
              )}
            </Box>
          </RadixCard>
        </Box>
      </Grid>
    </Box>
  );
}
