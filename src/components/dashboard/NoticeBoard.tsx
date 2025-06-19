import { Box, Flex, Text, Heading } from '@radix-ui/themes';
import { RadixCard } from 'components/ui/RadixCard';
import {
  FileText,
  Calendar,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { useApiCall, ApiService } from 'lib/api';
import { useAuth } from 'features/auth/AuthContext';

interface NoticeBoardProps {
  className?: string;
}

// Fallback notifications for development/demo purposes
const FALLBACK_NOTIFICATIONS = [
  {
    id: '1',
    title: 'Welcome to EdVerse!',
    message: 'Your educational management system is ready to use.',
    type: 'success' as const,
    createdAt: new Date(),
    targetRole: 'all',
    createdBy: 'system',
    isActive: true,
  },
  {
    id: '2',
    title: 'System Maintenance',
    message: 'Scheduled maintenance will occur this weekend.',
    type: 'info' as const,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    targetRole: 'all',
    createdBy: 'admin',
    isActive: true,
  },
  {
    id: '3',
    title: 'New Features Available',
    message: 'Check out the latest updates to your dashboard.',
    type: 'info' as const,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    targetRole: 'all',
    createdBy: 'admin',
    isActive: true,
  },
];

export function NoticeBoard({ className = '' }: NoticeBoardProps): JSX.Element {
  const { user } = useAuth();

  // Fetch notifications from backend
  const {
    data: notifications,
    loading,
    error,
    refetch,
  } = useApiCall(() => ApiService.getUserNotifications(), [user]);

  // Use fallback data if there's an error or no data
  const displayNotifications =
    notifications && notifications.length > 0
      ? notifications
      : error
        ? FALLBACK_NOTIFICATIONS
        : [];

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

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'error':
        return 'text-red-600 dark:text-red-400';
      case 'warning':
        return 'text-orange-600 dark:text-orange-400';
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'info':
      default:
        return 'text-blue-600 dark:text-blue-400';
    }
  };

  const getTypeBadgeColor = (type: string): string => {
    switch (type) {
      case 'error':
        return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300';
      case 'warning':
        return 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300';
      case 'success':
        return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300';
      case 'info':
      default:
        return 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300';
    }
  };

  const formatDate = (timestamp: any): string => {
    if (!timestamp) return '';

    let date: Date;
    if (timestamp.toDate) {
      // Firestore Timestamp
      date = timestamp.toDate();
    } else if (timestamp.seconds) {
      // Firestore Timestamp object
      date = new Date(timestamp.seconds * 1000);
    } else {
      // Regular Date or string
      date = new Date(timestamp);
    }

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTimeAgo = (timestamp: any): string => {
    if (!timestamp) return '';

    let date: Date;
    if (timestamp.toDate) {
      date = timestamp.toDate();
    } else if (timestamp.seconds) {
      date = new Date(timestamp.seconds * 1000);
    } else {
      date = new Date(timestamp);
    }

    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return formatDate(timestamp);
  };

  return (
    <RadixCard size="2" className={`p-6 ${className}`}>
      <Flex justify="between" align="center" className="mb-4">
        <Heading size="4" className="text-gray-900 dark:text-gray-100">
          Notice Board
        </Heading>
        <Flex align="center" gap="2">
          {error && (
            <Text size="1" className="text-orange-600 dark:text-orange-400">
              Using demo data
            </Text>
          )}
          <button
            onClick={refetch}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Retry'}
          </button>
        </Flex>
      </Flex>

      {loading && !displayNotifications.length ? (
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
      ) : displayNotifications.length === 0 ? (
        <Box className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <Text size="2" className="text-gray-500 dark:text-gray-400">
            No notices at the moment
          </Text>
        </Box>
      ) : (
        <Flex direction="column" gap="4">
          {displayNotifications.map((notification) => {
            const IconComponent = getTypeIcon(notification.type);
            return (
              <Flex
                key={notification.id}
                align="start"
                gap="3"
                className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              >
                <Box className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <IconComponent
                    className={`w-5 h-5 ${getTypeColor(notification.type)}`}
                  />
                </Box>
                <Box className="flex-1 min-w-0">
                  <Text
                    size="2"
                    weight="medium"
                    className="text-gray-900 dark:text-gray-100 mb-1"
                  >
                    {notification.title}
                  </Text>
                  {notification.message && (
                    <Text
                      size="1"
                      className="text-gray-600 dark:text-gray-400 mb-2 line-clamp-2"
                    >
                      {notification.message}
                    </Text>
                  )}
                  <Flex align="center" gap="2">
                    <Calendar className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                    <Text size="1" className="text-gray-600 dark:text-gray-400">
                      {formatTimeAgo(notification.createdAt)}
                    </Text>
                    <Box
                      className={`px-2 py-1 rounded text-xs font-medium capitalize ${getTypeBadgeColor(notification.type)}`}
                    >
                      {notification.type}
                    </Box>
                  </Flex>
                </Box>
              </Flex>
            );
          })}
        </Flex>
      )}

      {/* Development Debug Info */}
      {process.env.NODE_ENV === 'development' && error && (
        <Box className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <Text size="1" className="text-gray-600 dark:text-gray-400 font-mono">
            Debug: {error}
          </Text>
        </Box>
      )}
    </RadixCard>
  );
}
