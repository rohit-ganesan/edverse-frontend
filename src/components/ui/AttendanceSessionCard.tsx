import { Box, Flex, Text, Badge } from '@radix-ui/themes';
import { Eye } from 'lucide-react';
import { RadixButton } from './RadixButton';

interface AttendanceSession {
  id: string;
  className: string;
  courseCode?: string;
  instructor?: string;
  date: string;
  time: string;
  duration?: number;
  location: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  attendanceRate: number;
  status: 'active' | 'completed' | 'scheduled';
}

interface AttendanceSessionCardProps {
  session: AttendanceSession;
  onView?: (session: AttendanceSession) => void;
  className?: string;
}

const getStatusColor = (status: string): 'green' | 'gray' | 'blue' => {
  switch (status) {
    case 'active':
      return 'green';
    case 'completed':
      return 'gray';
    case 'scheduled':
      return 'blue';
    default:
      return 'gray';
  }
};

export function AttendanceSessionCard({
  session,
  onView,
  className = '',
}: AttendanceSessionCardProps): JSX.Element {
  // Data integrity checks
  if (!session?.id || !session?.className) {
    return (
      <Box
        className={`p-4 bg-gray-50 dark:bg-gray-800 rounded-lg ${className}`}
      >
        <Text size="2" className="text-gray-500 dark:text-gray-400">
          Invalid session data
        </Text>
      </Box>
    );
  }

  const handleViewClick = () => {
    if (onView && typeof onView === 'function') {
      try {
        onView(session);
      } catch (error) {
        console.error('Error handling view click:', error);
      }
    }
  };

  // Safe data access with fallbacks
  const safeSession = {
    id: session.id,
    className: session.className || 'Unknown Class',
    time: session.time || 'No time specified',
    location: session.location || 'No location specified',
    totalStudents: Math.max(0, session.totalStudents || 0),
    presentCount: Math.max(0, session.presentCount || 0),
    attendanceRate: Math.min(100, Math.max(0, session.attendanceRate || 0)),
    status: session.status || 'scheduled',
  };

  return (
    <Box className={`p-4 bg-gray-50 dark:bg-gray-800 rounded-lg ${className}`}>
      <Flex justify="between" align="start" className="mb-2">
        <Box>
          <Text
            size="3"
            weight="medium"
            className="text-gray-900 dark:text-gray-100"
          >
            {safeSession.className}
          </Text>
          <Text size="2" className="text-gray-600 dark:text-gray-400">
            {safeSession.time} • {safeSession.location}
          </Text>
        </Box>
        <Badge color={getStatusColor(safeSession.status)}>
          {safeSession.status}
        </Badge>
      </Flex>
      <Flex justify="between" align="center">
        <Text size="2" className="text-gray-600 dark:text-gray-400">
          {safeSession.presentCount}/{safeSession.totalStudents} present •{' '}
          {safeSession.attendanceRate}% rate
        </Text>
        <RadixButton
          variant="ghost"
          size="1"
          onClick={handleViewClick}
          disabled={!onView}
        >
          <Eye className="w-4 h-4" />
        </RadixButton>
      </Flex>
    </Box>
  );
}
