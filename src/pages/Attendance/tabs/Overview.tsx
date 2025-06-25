import { Box, Grid, Flex, Heading, Text } from '@radix-ui/themes';
import { RadixCard } from 'components/ui/RadixCard';
import { RadixButton } from 'components/ui/RadixButton';
import { Eye, Camera, User } from 'lucide-react';
import { SessionCard } from '../components/SessionCard';
import { ActivityItem } from '../components/ActivityItem';
import { useAttendanceData } from '../hooks/useAttendanceData';
import { useSessionManagement } from '../hooks/useSessionManagement';
import { SkeletonCard } from 'components/ui/Skeleton';

export function Overview({
  isLoading = false,
}: {
  isLoading?: boolean;
}): JSX.Element {
  const { attendanceSessions, attendanceRecords } = useAttendanceData();
  const { handleViewSession } = useSessionManagement();

  return (
    <Grid columns="3" gap="8">
      {/* Today's Sessions - Enhanced with Live Tracking Style */}
      <Box className="col-span-2">
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          {/* Header Section */}
          <Box className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <Flex justify="between" align="center">
              <Box>
                <Heading size="5" className="text-gray-900 mb-1">
                  Today's Sessions
                </Heading>
                <Text size="3" className="text-gray-600">
                  {isLoading ? (
                    <span className="inline-block w-24 h-4 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    `${attendanceSessions?.length || 0} sessions scheduled`
                  )}
                </Text>
              </Box>
              <RadixButton
                variant="soft"
                size="2"
                className="bg-white/70 hover:bg-white"
              >
                <Eye className="w-4 h-4 mr-1" />
                View All
              </RadixButton>
            </Flex>
          </Box>

          {/* Sessions List */}
          <Box className="p-6">
            <Flex direction="column" gap="4">
              {isLoading ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <SkeletonCard key={i} height={56} className="mb-2" />
                ))
              ) : attendanceSessions && attendanceSessions.length > 0 ? (
                attendanceSessions.map((session, index) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    index={index}
                    onViewClick={handleViewSession}
                  />
                ))
              ) : (
                <Box className="text-center py-12">
                  <Box className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-8 h-8 text-gray-400" />
                  </Box>
                  <Text size="3" weight="medium" className="text-gray-900 mb-2">
                    No sessions scheduled
                  </Text>
                  <Text size="2" className="text-gray-500 mb-4">
                    Create your first attendance session to get started
                  </Text>
                  <RadixButton
                    variant="solid"
                    size="3"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Create Session
                  </RadixButton>
                </Box>
              )}
            </Flex>
          </Box>
        </RadixCard>
      </Box>

      {/* Recent Activity - Enhanced with Live Tracking Style */}
      <Box>
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden h-fit">
          {/* Header */}
          <Box className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
            <Flex justify="between" align="center">
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Recent Activity
                </Heading>
                <Text size="2" className="text-gray-600">
                  Latest check-ins
                </Text>
              </Box>
            </Flex>
          </Box>

          {/* Activity List */}
          <Box className="p-5">
            <Flex direction="column" gap="3">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonCard key={i} height={32} className="mb-2" />
                ))
              ) : attendanceRecords && attendanceRecords.length > 0 ? (
                attendanceRecords
                  .slice(0, 6)
                  .map((record, index) => (
                    <ActivityItem
                      key={record.id}
                      record={record}
                      index={index}
                    />
                  ))
              ) : (
                <Box className="text-center py-8">
                  <Box className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="w-6 h-6 text-gray-400" />
                  </Box>
                  <Text size="2" className="text-gray-500">
                    No recent activity
                  </Text>
                </Box>
              )}
            </Flex>

            {isLoading
              ? null
              : attendanceRecords &&
                attendanceRecords.length > 6 && (
                  <Box className="mt-5 pt-4 border-t border-gray-100">
                    <RadixButton variant="ghost" size="2" className="w-full">
                      <Eye className="w-4 h-4 mr-2" />
                      View All Activity
                    </RadixButton>
                  </Box>
                )}
          </Box>
        </RadixCard>
      </Box>
    </Grid>
  );
}
