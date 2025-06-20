import React from 'react';
import { Box, Flex, Text } from '@radix-ui/themes';
import { Clock, LucideIcon } from 'lucide-react';

interface NoticeItemProps {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'info' | 'warning' | 'error';
  createdAt: Date | any;
  icon: LucideIcon;
  onClick?: () => void;
  className?: string;
}

export function NoticeItem({
  id,
  title,
  message,
  type,
  createdAt,
  icon: IconComponent,
  onClick,
  className = '',
}: NoticeItemProps): JSX.Element {
  // Validate required props
  if (!title || typeof title !== 'string') {
    console.error('NoticeItem: title is required and must be a string');
    return (
      <Box className={`p-4 ${className}`}>
        <Text size="2" className="text-red-600">
          Error: Invalid notice title
        </Text>
      </Box>
    );
  }

  if (!IconComponent) {
    console.error('NoticeItem: icon is required');
    return (
      <Box className={`p-4 ${className}`}>
        <Text size="2" className="text-red-600">
          Error: Missing notice icon
        </Text>
      </Box>
    );
  }

  // Safe type color mapping for icon background
  const getIconBgColor = (noticeType: string): string => {
    switch (noticeType) {
      case 'error':
        return 'bg-red-100 dark:bg-red-900/20';
      case 'warning':
        return 'bg-orange-100 dark:bg-orange-900/20';
      case 'success':
        return 'bg-green-100 dark:bg-green-900/20';
      case 'info':
      default:
        return 'bg-blue-100 dark:bg-blue-900/20';
    }
  };

  // Safe type color mapping for icon
  const getIconColor = (noticeType: string): string => {
    switch (noticeType) {
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

  // Improved date formatting with better error handling
  const formatTimeAgo = (timestamp: any): string => {
    if (!timestamp) {
      return 'No date';
    }

    try {
      let date: Date;

      // Handle different timestamp formats
      if (timestamp instanceof Date) {
        date = timestamp;
      } else if (
        timestamp &&
        typeof timestamp === 'object' &&
        timestamp.toDate &&
        typeof timestamp.toDate === 'function'
      ) {
        // Firestore Timestamp
        date = timestamp.toDate();
      } else if (
        timestamp &&
        typeof timestamp === 'object' &&
        timestamp.seconds &&
        typeof timestamp.seconds === 'number'
      ) {
        // Firestore Timestamp object
        date = new Date(timestamp.seconds * 1000);
      } else if (
        typeof timestamp === 'string' ||
        typeof timestamp === 'number'
      ) {
        // Regular Date string or number
        date = new Date(timestamp);
      } else {
        console.warn('NoticeItem: Unknown timestamp format:', timestamp);
        return 'Just now';
      }

      // Validate the date - use a more robust check
      if (!date || !date.getTime || isNaN(date.getTime())) {
        console.warn(
          'NoticeItem: Invalid date created from timestamp:',
          timestamp
        );
        return 'Just now';
      }

      const now = new Date();
      const diffInMilliseconds = now.getTime() - date.getTime();

      // Handle future dates
      if (diffInMilliseconds < 0) {
        return 'Just now';
      }

      const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
      const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

      // More granular time formatting
      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInHours < 24) return `${diffInHours}h ago`;
      if (diffInDays < 7) return `${diffInDays}d ago`;

      // For older dates, show formatted date
      try {
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year:
            date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
        });
      } catch (formatError) {
        console.warn(
          'NoticeItem: Error formatting date to locale string:',
          formatError
        );
        return `${date.getMonth() + 1}/${date.getDate()}`;
      }
    } catch (error) {
      console.error('NoticeItem: Error formatting date:', error, timestamp);
      return 'Just now';
    }
  };

  // Safe click handler
  const handleClick = (): void => {
    try {
      if (onClick && typeof onClick === 'function') {
        onClick();
      }
    } catch (error) {
      console.error('NoticeItem: Error in onClick handler:', error);
    }
  };

  const safeType = type || 'info';
  const safeMessage = message && typeof message === 'string' ? message : '';

  return (
    <Flex
      align="start"
      gap="4"
      className={`p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-all duration-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 ${className}`}
      onClick={handleClick}
    >
      {/* Icon */}
      <Box
        className={`w-10 h-10 ${getIconBgColor(safeType)} rounded-lg flex items-center justify-center flex-shrink-0`}
      >
        <IconComponent className={`w-5 h-5 ${getIconColor(safeType)}`} />
      </Box>

      {/* Content */}
      <Box className="flex-1 min-w-0">
        {/* Title */}
        <Text
          size="3"
          weight="medium"
          className="text-gray-900 dark:text-gray-100 mb-1 leading-tight"
        >
          {title}
        </Text>

        {/* Message */}
        {safeMessage && (
          <Text
            size="2"
            className="text-gray-600 dark:text-gray-400 mb-3 leading-relaxed line-clamp-2"
          >
            {safeMessage}
          </Text>
        )}

        {/* Time */}
        <Flex align="center" gap="1">
          <Clock className="w-3 h-3 text-gray-400 dark:text-gray-500" />
          <Text size="1" className="text-gray-500 dark:text-gray-500">
            {formatTimeAgo(createdAt)}
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
}
