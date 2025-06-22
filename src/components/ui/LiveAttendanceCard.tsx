import { Box, Flex, Text, Grid } from '@radix-ui/themes';
import { Camera, Smartphone, Wifi } from 'lucide-react';
import { RadixButton } from './RadixButton';
import { RadixCard } from './RadixCard';

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

interface LiveAttendanceCardProps {
  session: AttendanceSession;
  onQRCode?: () => void;
  onMobileCheckIn?: () => void;
  onEndSession?: () => void;
  className?: string;
}

interface AttendanceStatProps {
  count: number;
  label: string;
  color: 'green' | 'red' | 'yellow' | 'blue';
  className?: string;
}

function AttendanceStat({
  count,
  label,
  color,
  className = '',
}: AttendanceStatProps): JSX.Element {
  const colorClasses = {
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    blue: 'bg-blue-50 text-blue-600',
  };

  // Data integrity check
  const safeCount = Math.max(0, count || 0);

  return (
    <Box
      className={`text-center p-4 rounded-lg ${colorClasses[color]} ${className}`}
    >
      <Text
        size="4"
        weight="bold"
        className={colorClasses[color].split(' ')[1]}
      >
        {safeCount}
      </Text>
      <Text size="2" className={colorClasses[color].split(' ')[1]}>
        {label || 'Unknown'}
      </Text>
    </Box>
  );
}

export function LiveAttendanceCard({
  session,
  onQRCode,
  onMobileCheckIn,
  onEndSession,
  className = '',
}: LiveAttendanceCardProps): JSX.Element {
  // Data integrity checks
  if (!session?.id || !session?.className) {
    return (
      <RadixCard className={`p-6 ${className}`}>
        <Text size="3" className="text-gray-500">
          Invalid session data
        </Text>
      </RadixCard>
    );
  }

  // Safe data access with fallbacks
  const safeSession = {
    id: session.id,
    className: session.className || 'Unknown Class',
    location: session.location || 'No location specified',
    totalStudents: Math.max(0, session.totalStudents || 0),
    presentCount: Math.max(0, session.presentCount || 0),
    absentCount: Math.max(0, session.absentCount || 0),
    lateCount: Math.max(0, session.lateCount || 0),
    attendanceRate: Math.min(100, Math.max(0, session.attendanceRate || 0)),
  };

  const handleQRCode = () => {
    if (onQRCode && typeof onQRCode === 'function') {
      try {
        onQRCode();
      } catch (error) {
        console.error('Error handling QR code click:', error);
      }
    }
  };

  const handleMobileCheckIn = () => {
    if (onMobileCheckIn && typeof onMobileCheckIn === 'function') {
      try {
        onMobileCheckIn();
      } catch (error) {
        console.error('Error handling mobile check-in click:', error);
      }
    }
  };

  const handleEndSession = () => {
    if (onEndSession && typeof onEndSession === 'function') {
      try {
        onEndSession();
      } catch (error) {
        console.error('Error handling end session click:', error);
      }
    }
  };

  return (
    <RadixCard className={`p-6 ${className}`}>
      <Flex justify="between" align="center" className="mb-4">
        <Box>
          <Text size="5" weight="bold" className="text-gray-900">
            {safeSession.className}
          </Text>
          <Text size="3" className="text-gray-600">
            <Wifi className="w-4 h-4 inline mr-1" />
            Live attendance tracking • {safeSession.location}
          </Text>
        </Box>
        <Flex gap="3">
          <RadixButton
            variant="outline"
            size="3"
            onClick={handleQRCode}
            disabled={!onQRCode}
          >
            <Camera className="w-4 h-4 mr-2" />
            QR Code
          </RadixButton>
          <RadixButton
            variant="outline"
            size="3"
            onClick={handleMobileCheckIn}
            disabled={!onMobileCheckIn}
          >
            <Smartphone className="w-4 h-4 mr-2" />
            Mobile Check-in
          </RadixButton>
          <RadixButton
            variant="solid"
            size="3"
            className="bg-red-600 hover:bg-red-700"
            onClick={handleEndSession}
            disabled={!onEndSession}
          >
            End Session
          </RadixButton>
        </Flex>
      </Flex>

      {/* Real-time Stats */}
      <Grid columns="4" gap="4" className="mb-6">
        <AttendanceStat
          count={safeSession.presentCount}
          label="Present"
          color="green"
        />
        <AttendanceStat
          count={safeSession.absentCount}
          label="Absent"
          color="red"
        />
        <AttendanceStat
          count={safeSession.lateCount}
          label="Late"
          color="yellow"
        />
        <AttendanceStat
          count={safeSession.attendanceRate}
          label="Rate"
          color="blue"
        />
      </Grid>
    </RadixCard>
  );
}
