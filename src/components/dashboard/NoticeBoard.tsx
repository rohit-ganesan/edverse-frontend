import { Box, Flex, Text, Heading, Badge } from '@radix-ui/themes';
import { RadixCard } from 'components/ui/RadixCard';
import { NoticeItem } from 'components/ui/NoticeItem';
import {
  FileText,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
  RefreshCw,
} from 'lucide-react';
import { notificationAPI, useSupabaseQuery } from 'lib/supabase-api';
import { useAuth } from 'features/auth/AuthContext';
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';

interface NoticeBoardProps {
  className?: string;
}

export function NoticeBoard({ className = '' }: NoticeBoardProps): JSX.Element {
  const { user } = useAuth();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState({
    isScrolled: false,
    canScrollMore: false,
  });

  // Fetch notifications from backend
  const queryFn = useCallback(() => notificationAPI.getNotifications(), []);
  const {
    data: notifications,
    loading,
    error,
    refetch,
  } = useSupabaseQuery(queryFn, [user]);

  // Use fallback data if there's an error or no data - memoized to prevent re-renders
  const displayNotifications = useMemo(() => {
    return notifications && notifications.length > 0 ? notifications : [];
  }, [notifications]);

  // Get notification count
  const notificationCount = displayNotifications.length;

  // Check if we should show error state
  const shouldShowError = error && !loading && notificationCount === 0;

  // Handle scroll state
  const handleScroll = (): void => {
    if (!scrollContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;
    const isScrolled = scrollTop > 10;
    const canScrollMore = scrollTop + clientHeight < scrollHeight - 10;

    setScrollState({ isScrolled, canScrollMore });
  };

  // Update scroll state when notifications change
  useEffect(() => {
    if (scrollContainerRef.current) {
      const { scrollHeight, clientHeight } = scrollContainerRef.current;
      const canScrollMore = scrollHeight > clientHeight;
      setScrollState((prev) => ({ ...prev, canScrollMore }));
    }
  }, [notificationCount]); // Use notificationCount instead of displayNotifications

  // Safe icon mapping for notification types
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'error':
        return XCircle;
      case 'warning':
        return AlertCircle;
      case 'success':
        return CheckCircle;
      case 'info':
      default:
        return Info;
    }
  };

  // Safe refresh handler
  const handleRefresh = (): void => {
    try {
      if (refetch && typeof refetch === 'function') {
        refetch();
      } else {
        console.warn('NoticeBoard: Refetch function is not available');
      }
    } catch (error) {
      console.error('NoticeBoard: Error refreshing notifications:', error);
    }
  };

  // Safe notification click handler
  const handleNotificationClick = (notification: any): void => {
    try {
      console.log('Notification clicked:', notification.id, notification.title);
      // TODO: Implement notification detail view or action
    } catch (error) {
      console.error('NoticeBoard: Error handling notification click:', error);
    }
  };

  return (
    <RadixCard size="2" className={`p-6 h-[400px] flex flex-col ${className}`}>
      {/* Header */}
      <Flex justify="between" align="center" className="mb-4 flex-shrink-0">
        <Heading size="4" className="text-gray-900 dark:text-gray-100">
          Notice Board
        </Heading>
        <Flex align="center" gap="2">
          {notificationCount > 0 && (
            <Badge
              color="blue"
              variant="soft"
              size="1"
              className="px-2 py-1 text-xs font-medium"
            >
              {notificationCount}
            </Badge>
          )}
          <button
            onClick={handleRefresh}
            className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded transition-colors"
            disabled={loading}
            title={loading ? 'Loading...' : 'Refresh notifications'}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </Flex>
      </Flex>

      {/* Scrollable Content with scroll indicators */}
      <Box className="flex-1 overflow-hidden relative">
        {/* Top fade indicator when scrolled */}
        {scrollState.isScrolled && (
          <Box className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white via-white/90 dark:from-gray-900 dark:via-gray-900/90 to-transparent pointer-events-none z-10" />
        )}

        {loading && !displayNotifications.length ? (
          <Box className="h-full overflow-y-auto">
            <Flex direction="column" gap="4">
              {[1, 2, 3].map((i) => (
                <Flex key={i} align="start" gap="3" className="p-3">
                  <Box className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                  <Box className="flex-1">
                    <Box className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
                    <Box className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
                  </Box>
                </Flex>
              ))}
            </Flex>
          </Box>
        ) : shouldShowError ? (
          <Box className="h-full flex items-center justify-center">
            <Box className="text-center">
              <AlertCircle className="w-12 h-12 text-orange-400 mx-auto mb-3" />
              <Text size="2" className="text-gray-600 dark:text-gray-400 mb-2">
                Unable to get notifications at this time
              </Text>
              <button
                onClick={handleRefresh}
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                disabled={loading}
              >
                Try again
              </button>
            </Box>
          </Box>
        ) : displayNotifications.length === 0 ? (
          <Box className="h-full flex items-center justify-center">
            <Box className="text-center">
              <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <Text size="2" className="text-gray-500 dark:text-gray-400">
                No notices at the moment
              </Text>
            </Box>
          </Box>
        ) : (
          <>
            <Box
              ref={scrollContainerRef}
              className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500"
              onScroll={handleScroll}
            >
              <Flex direction="column" gap="3" className="pr-1">
                {displayNotifications.map((notification: any) => {
                  // Validate notification data
                  if (!notification || !notification.id) {
                    console.warn(
                      'NoticeBoard: Invalid notification data:',
                      notification
                    );
                    return null;
                  }

                  const safeNotification = {
                    id: notification.id,
                    title: notification.title || 'Untitled Notice',
                    message: notification.message || '',
                    type: notification.type || 'info',
                    createdAt: notification.createdAt,
                  };

                  return (
                    <NoticeItem
                      key={safeNotification.id}
                      id={safeNotification.id}
                      title={safeNotification.title}
                      message={safeNotification.message}
                      type={safeNotification.type}
                      createdAt={safeNotification.createdAt}
                      icon={getTypeIcon(safeNotification.type)}
                      onClick={() => handleNotificationClick(notification)}
                    />
                  );
                })}
              </Flex>
            </Box>

            {/* Bottom fade indicator for more content */}
            {scrollState.canScrollMore && (
              <Box className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white via-white/95 dark:from-gray-900 dark:via-gray-900/95 to-transparent pointer-events-none" />
            )}
          </>
        )}
      </Box>
    </RadixCard>
  );
}
