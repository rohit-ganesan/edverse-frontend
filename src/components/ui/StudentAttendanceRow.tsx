import { Box, Flex, Text, Badge } from '@radix-ui/themes';
import { CheckCircle, XCircle, AlertCircle, User } from 'lucide-react';
import { RadixButton } from './RadixButton';

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
  id?: string;
  studentId?: string;
  student?: Student;
  classId?: string;
  className?: string;
  date?: string;
  time?: string;
  status?: 'present' | 'absent' | 'late' | 'excused';
  checkInTime?: string;
  checkOutTime?: string;
  method?: 'manual' | 'qr' | 'biometric' | 'geofence';
  location?: string;
  notes?: string;
}

interface StudentAttendanceRowProps {
  student: Student;
  record?: AttendanceRecord;
  onMarkAttendance?: (
    studentId: string,
    status: 'present' | 'absent' | 'late'
  ) => void;
  className?: string;
}

const getStatusColor = (
  status: string
): 'green' | 'red' | 'yellow' | 'blue' | 'gray' => {
  switch (status) {
    case 'present':
      return 'green';
    case 'absent':
      return 'red';
    case 'late':
      return 'yellow';
    case 'excused':
      return 'blue';
    default:
      return 'gray';
  }
};

export function StudentAttendanceRow({
  student,
  record,
  onMarkAttendance,
  className = '',
}: StudentAttendanceRowProps): JSX.Element {
  // Data integrity checks
  if (!student?.id || !student?.name) {
    return (
      <Flex
        justify="between"
        align="center"
        className={`p-4 border border-gray-200 rounded-lg ${className}`}
      >
        <Text size="2" className="text-gray-500">
          Invalid student data
        </Text>
      </Flex>
    );
  }

  // Safe data access with fallbacks
  const safeStudent = {
    id: student.id,
    name: student.name || 'Unknown Student',
    studentId: student.studentId || 'N/A',
    course: student.course || 'Unknown Course',
  };

  const status = record?.status || 'absent';
  const checkInTime = record?.checkInTime;

  const handleMarkAttendance = (newStatus: 'present' | 'absent' | 'late') => {
    if (onMarkAttendance && typeof onMarkAttendance === 'function') {
      try {
        onMarkAttendance(safeStudent.id, newStatus);
      } catch (error) {
        console.error('Error marking attendance:', error);
      }
    }
  };

  return (
    <Flex
      justify="between"
      align="center"
      className={`p-4 border border-gray-200 rounded-lg ${className}`}
    >
      <Flex align="center" gap="4">
        <Box className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-gray-600" />
        </Box>
        <Box>
          <Text size="3" weight="medium" className="text-gray-900">
            {safeStudent.name}
          </Text>
          <Text size="2" className="text-gray-600">
            {safeStudent.studentId} • {safeStudent.course}
          </Text>
          {checkInTime && (
            <Text size="2" className="text-blue-600">
              Checked in at {checkInTime}
            </Text>
          )}
        </Box>
      </Flex>

      <Flex align="center" gap="3">
        <Badge color={getStatusColor(status)}>{status}</Badge>
        {onMarkAttendance && (
          <Flex gap="1">
            <RadixButton
              variant={status === 'present' ? 'solid' : 'outline'}
              size="2"
              onClick={() => handleMarkAttendance('present')}
              className={
                status === 'present' ? 'bg-green-600 hover:bg-green-700' : ''
              }
            >
              <CheckCircle className="w-4 h-4" />
            </RadixButton>
            <RadixButton
              variant={status === 'late' ? 'solid' : 'outline'}
              size="2"
              onClick={() => handleMarkAttendance('late')}
              className={
                status === 'late' ? 'bg-yellow-600 hover:bg-yellow-700' : ''
              }
            >
              <AlertCircle className="w-4 h-4" />
            </RadixButton>
            <RadixButton
              variant={status === 'absent' ? 'solid' : 'outline'}
              size="2"
              onClick={() => handleMarkAttendance('absent')}
              className={
                status === 'absent' ? 'bg-red-600 hover:bg-red-700' : ''
              }
            >
              <XCircle className="w-4 h-4" />
            </RadixButton>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}
