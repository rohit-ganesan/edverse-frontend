import { Box, Flex, Text } from '@radix-ui/themes';
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Camera,
  Smartphone,
  Fingerprint,
  MapPin,
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email?: string;
  studentId?: string;
  avatar?: string;
  course?: string;
  year?: string;
}

interface AttendanceRecord {
  id: string;
  studentId: string;
  student: Student;
  classId?: string;
  className: string;
  date: string;
  time?: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  checkInTime?: string;
  checkOutTime?: string;
  method: 'manual' | 'qr' | 'biometric' | 'geofence';
  location?: string;
  notes?: string;
}

interface AttendanceActivityCardProps {
  record: AttendanceRecord;
  className?: string;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'present':
      return CheckCircle;
    case 'absent':
      return XCircle;
    case 'late':
      return AlertCircle;
    case 'excused':
      return CheckCircle;
    default:
      return XCircle;
  }
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'present':
      return 'text-green-600';
    case 'absent':
      return 'text-red-600';
    case 'late':
      return 'text-yellow-600';
    case 'excused':
      return 'text-blue-600';
    default:
      return 'text-gray-600';
  }
};

const getMethodIcon = (method: string) => {
  switch (method) {
    case 'qr':
      return Camera;
    case 'biometric':
      return Fingerprint;
    case 'geofence':
      return MapPin;
    case 'manual':
    default:
      return Smartphone;
  }
};

export function AttendanceActivityCard({
  record,
  className = '',
}: AttendanceActivityCardProps): JSX.Element {
  // Data integrity checks
  if (!record?.id || !record?.student?.name || !record?.className) {
    return (
      <Flex
        justify="between"
        align="center"
        className={`p-3 bg-gray-50 rounded-lg ${className}`}
      >
        <Text size="2" className="text-gray-500">
          Invalid attendance record
        </Text>
      </Flex>
    );
  }

  // Safe data access with fallbacks
  const safeRecord = {
    id: record.id,
    student: {
      name: record.student.name || 'Unknown Student',
      studentId: record.student.studentId || 'N/A',
    },
    className: record.className || 'Unknown Class',
    checkInTime: record.checkInTime || 'No check-in',
    status: record.status || 'absent',
    method: record.method || 'manual',
  };

  const StatusIcon = getStatusIcon(safeRecord.status);
  const MethodIcon = getMethodIcon(safeRecord.method);
  const statusColor = getStatusColor(safeRecord.status);

  return (
    <Flex
      justify="between"
      align="center"
      className={`p-3 bg-gray-50 rounded-lg ${className}`}
    >
      <Flex align="center" gap="3">
        <Box className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-gray-600" />
        </Box>
        <Box>
          <Text size="2" weight="medium">
            {safeRecord.student.name}
          </Text>
          <Text size="1" className="text-gray-600">
            {safeRecord.className} • {safeRecord.checkInTime}
          </Text>
        </Box>
      </Flex>
      <Flex align="center" gap="2">
        <MethodIcon className="w-4 h-4 text-gray-400" />
        <StatusIcon className={`w-4 h-4 ${statusColor}`} />
      </Flex>
    </Flex>
  );
}
