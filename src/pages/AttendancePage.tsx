import { useState } from 'react';
import { Box, Flex, Text, Heading, Grid, Badge, Tabs } from '@radix-ui/themes';
import { DashboardLayout } from 'components/layout/DashboardLayout';
import { RadixCard } from 'components/ui/RadixCard';
import { RadixButton } from 'components/ui/RadixButton';
import {
  Clock,
  UserCheck,
  UserX,
  Search,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  TrendingUp,
  Eye,
  Edit,
  MoreHorizontal,
  Camera,
  Smartphone,
  Wifi,
  MapPin,
  User,
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  avatar?: string;
  course: string;
  year: string;
}

interface AttendanceRecord {
  id: string;
  studentId: string;
  student: Student;
  classId: string;
  className: string;
  date: string;
  time: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  checkInTime?: string;
  checkOutTime?: string;
  method: 'manual' | 'qr' | 'biometric' | 'geofence';
  location?: string;
  notes?: string;
}

interface AttendanceSession {
  id: string;
  className: string;
  courseCode: string;
  instructor: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  attendanceRate: number;
  status: 'active' | 'completed' | 'scheduled';
}

const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice.johnson@student.edu',
    studentId: 'STU001',
    course: 'Computer Science',
    year: '3rd Year',
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob.smith@student.edu',
    studentId: 'STU002',
    course: 'Computer Science',
    year: '3rd Year',
  },
  {
    id: '3',
    name: 'Carol Davis',
    email: 'carol.davis@student.edu',
    studentId: 'STU003',
    course: 'Computer Science',
    year: '3rd Year',
  },
  {
    id: '4',
    name: 'David Wilson',
    email: 'david.wilson@student.edu',
    studentId: 'STU004',
    course: 'Computer Science',
    year: '3rd Year',
  },
];

const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: '1',
    studentId: '1',
    student: mockStudents[0],
    classId: 'class1',
    className: 'Advanced JavaScript Programming',
    date: '2024-01-15',
    time: '10:00',
    status: 'present',
    checkInTime: '09:58',
    checkOutTime: '11:28',
    method: 'qr',
    location: 'Room 301, CS Building',
  },
  {
    id: '2',
    studentId: '2',
    student: mockStudents[1],
    classId: 'class1',
    className: 'Advanced JavaScript Programming',
    date: '2024-01-15',
    time: '10:00',
    status: 'late',
    checkInTime: '10:15',
    checkOutTime: '11:30',
    method: 'manual',
    location: 'Room 301, CS Building',
    notes: 'Traffic delay',
  },
  {
    id: '3',
    studentId: '3',
    student: mockStudents[2],
    classId: 'class1',
    className: 'Advanced JavaScript Programming',
    date: '2024-01-15',
    time: '10:00',
    status: 'absent',
    method: 'manual',
    notes: 'Sick leave submitted',
  },
  {
    id: '4',
    studentId: '4',
    student: mockStudents[3],
    classId: 'class1',
    className: 'Advanced JavaScript Programming',
    date: '2024-01-15',
    time: '10:00',
    status: 'present',
    checkInTime: '09:55',
    checkOutTime: '11:30',
    method: 'biometric',
    location: 'Room 301, CS Building',
  },
];

const mockAttendanceSessions: AttendanceSession[] = [
  {
    id: '1',
    className: 'Advanced JavaScript Programming',
    courseCode: 'CS301',
    instructor: 'Dr. Sarah Johnson',
    date: '2024-01-15',
    time: '10:00',
    duration: 90,
    location: 'Room 301, CS Building',
    totalStudents: 4,
    presentCount: 2,
    absentCount: 1,
    lateCount: 1,
    attendanceRate: 75,
    status: 'completed',
  },
  {
    id: '2',
    className: 'Data Structures Lab',
    courseCode: 'CS201',
    instructor: 'Prof. Michael Chen',
    date: '2024-01-15',
    time: '14:00',
    duration: 120,
    location: 'Computer Lab 2',
    totalStudents: 35,
    presentCount: 32,
    absentCount: 2,
    lateCount: 1,
    attendanceRate: 94,
    status: 'active',
  },
];

const getStatusColor = (status: string) => {
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

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'present':
      return CheckCircle;
    case 'absent':
      return XCircle;
    case 'late':
      return AlertCircle;
    case 'excused':
      return Clock;
    default:
      return AlertCircle;
  }
};

const getMethodIcon = (method: string) => {
  switch (method) {
    case 'qr':
      return Camera;
    case 'biometric':
      return User;
    case 'geofence':
      return MapPin;
    case 'manual':
      return Edit;
    default:
      return Edit;
  }
};

export function AttendancePage(): JSX.Element {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('2024-01-15');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeSession, _setActiveSession] = useState<AttendanceSession | null>(
    mockAttendanceSessions.find((s) => s.status === 'active') || null
  );

  const filteredRecords = mockAttendanceRecords.filter((record) => {
    const matchesSearch =
      record.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.student.studentId
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      record.className.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === 'all' || record.status === selectedStatus;
    const matchesDate = record.date === selectedDate;
    return matchesSearch && matchesStatus && matchesDate;
  });

  const todayRecords = mockAttendanceRecords.filter(
    (record) => record.date === selectedDate
  );
  const totalPresent = todayRecords.filter(
    (r) => r.status === 'present'
  ).length;
  const totalAbsent = todayRecords.filter((r) => r.status === 'absent').length;
  const totalLate = todayRecords.filter((r) => r.status === 'late').length;
  const attendanceRate =
    todayRecords.length > 0
      ? Math.round((totalPresent / todayRecords.length) * 100)
      : 0;

  const handleMarkAttendance = (
    studentId: string,
    status: 'present' | 'absent' | 'late'
  ) => {
    // Implementation would update the attendance record
    console.log(`Marking ${studentId} as ${status}`);
  };

  return (
    <DashboardLayout>
      {/* Header Section */}
      <Box className="mb-8">
        <Flex justify="between" align="center" className="mb-4">
          <Box>
            <Heading size="7" className="text-gray-900 mb-2">
              Attendance Management
            </Heading>
            <Text size="4" className="text-gray-600">
              Track, monitor, and analyze student attendance patterns
            </Text>
          </Box>
          <Flex gap="3">
            <RadixButton variant="outline" size="3">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </RadixButton>
            <RadixButton variant="outline" size="3">
              <Upload className="w-4 h-4 mr-2" />
              Import Data
            </RadixButton>
            <RadixButton variant="solid" size="3">
              <Camera className="w-4 h-4 mr-2" />
              Start Session
            </RadixButton>
          </Flex>
        </Flex>

        {/* Quick Stats */}
        <Grid columns="4" gap="4" className="mb-6">
          <RadixCard className="p-4">
            <Flex align="center" gap="3">
              <Box className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-600" />
              </Box>
              <Box>
                <Text size="3" weight="bold" className="text-gray-900">
                  {totalPresent}
                </Text>
                <Text size="2" className="text-gray-600">
                  Present Today
                </Text>
              </Box>
            </Flex>
          </RadixCard>

          <RadixCard className="p-4">
            <Flex align="center" gap="3">
              <Box className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <UserX className="w-6 h-6 text-red-600" />
              </Box>
              <Box>
                <Text size="3" weight="bold" className="text-gray-900">
                  {totalAbsent}
                </Text>
                <Text size="2" className="text-gray-600">
                  Absent Today
                </Text>
              </Box>
            </Flex>
          </RadixCard>

          <RadixCard className="p-4">
            <Flex align="center" gap="3">
              <Box className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </Box>
              <Box>
                <Text size="3" weight="bold" className="text-gray-900">
                  {totalLate}
                </Text>
                <Text size="2" className="text-gray-600">
                  Late Arrivals
                </Text>
              </Box>
            </Flex>
          </RadixCard>

          <RadixCard className="p-4">
            <Flex align="center" gap="3">
              <Box className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </Box>
              <Box>
                <Text size="3" weight="bold" className="text-gray-900">
                  {attendanceRate}%
                </Text>
                <Text size="2" className="text-gray-600">
                  Attendance Rate
                </Text>
              </Box>
            </Flex>
          </RadixCard>
        </Grid>

        {/* Active Session Alert */}
        {activeSession && (
          <RadixCard className="p-4 bg-green-50 border-l-4 border-green-400 mb-6">
            <Flex justify="between" align="center">
              <Flex align="center" gap="3">
                <Box className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Wifi className="w-5 h-5 text-green-600" />
                </Box>
                <Box>
                  <Text size="3" weight="bold" className="text-green-800">
                    Active Session: {activeSession.className}
                  </Text>
                  <Text size="2" className="text-green-600">
                    {activeSession.presentCount}/{activeSession.totalStudents}{' '}
                    students checked in • {activeSession.location}
                  </Text>
                </Box>
              </Flex>
              <Flex gap="2">
                <RadixButton variant="outline" size="2">
                  <Eye className="w-4 h-4 mr-2" />
                  Monitor
                </RadixButton>
                <RadixButton variant="solid" size="2" className="bg-green-600">
                  End Session
                </RadixButton>
              </Flex>
            </Flex>
          </RadixCard>
        )}
      </Box>

      {/* Tabs Navigation */}
      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List className="mb-6">
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="live">Live Tracking</Tabs.Trigger>
          <Tabs.Trigger value="records">Records</Tabs.Trigger>
          <Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
          <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
        </Tabs.List>

        {/* Overview Tab */}
        <Tabs.Content value="overview">
          <Grid columns="2" gap="6">
            {/* Today's Sessions */}
            <RadixCard className="p-6">
              <Heading size="4" className="mb-4">
                Today's Sessions
              </Heading>
              <Flex direction="column" gap="4">
                {mockAttendanceSessions.map((session) => (
                  <Box key={session.id} className="p-4 bg-gray-50 rounded-lg">
                    <Flex justify="between" align="start" className="mb-2">
                      <Box>
                        <Text
                          size="3"
                          weight="medium"
                          className="text-gray-900"
                        >
                          {session.className}
                        </Text>
                        <Text size="2" className="text-gray-600">
                          {session.time} • {session.location}
                        </Text>
                      </Box>
                      <Badge
                        color={
                          session.status === 'active'
                            ? 'green'
                            : session.status === 'completed'
                              ? 'gray'
                              : 'blue'
                        }
                      >
                        {session.status}
                      </Badge>
                    </Flex>
                    <Flex justify="between" align="center">
                      <Text size="2" className="text-gray-600">
                        {session.presentCount}/{session.totalStudents} present •{' '}
                        {session.attendanceRate}% rate
                      </Text>
                      <RadixButton variant="ghost" size="1">
                        <Eye className="w-4 h-4" />
                      </RadixButton>
                    </Flex>
                  </Box>
                ))}
              </Flex>
            </RadixCard>

            {/* Recent Activity */}
            <RadixCard className="p-6">
              <Heading size="4" className="mb-4">
                Recent Activity
              </Heading>
              <Flex direction="column" gap="3">
                {mockAttendanceRecords.slice(0, 5).map((record) => {
                  const StatusIcon = getStatusIcon(record.status);
                  const MethodIcon = getMethodIcon(record.method);
                  return (
                    <Flex
                      key={record.id}
                      justify="between"
                      align="center"
                      className="p-3 bg-gray-50 rounded-lg"
                    >
                      <Flex align="center" gap="3">
                        <Box className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </Box>
                        <Box>
                          <Text size="2" weight="medium">
                            {record.student.name}
                          </Text>
                          <Text size="1" className="text-gray-600">
                            {record.className} •{' '}
                            {record.checkInTime || 'No check-in'}
                          </Text>
                        </Box>
                      </Flex>
                      <Flex align="center" gap="2">
                        <MethodIcon className="w-4 h-4 text-gray-400" />
                        <StatusIcon
                          className={`w-4 h-4 ${
                            record.status === 'present'
                              ? 'text-green-600'
                              : record.status === 'absent'
                                ? 'text-red-600'
                                : record.status === 'late'
                                  ? 'text-yellow-600'
                                  : 'text-blue-600'
                          }`}
                        />
                      </Flex>
                    </Flex>
                  );
                })}
              </Flex>
            </RadixCard>
          </Grid>
        </Tabs.Content>

        {/* Live Tracking Tab */}
        <Tabs.Content value="live">
          {activeSession ? (
            <Box>
              <RadixCard className="p-6 mb-6">
                <Flex justify="between" align="center" className="mb-4">
                  <Box>
                    <Heading size="5" className="text-gray-900">
                      {activeSession.className}
                    </Heading>
                    <Text size="3" className="text-gray-600">
                      Live attendance tracking • {activeSession.location}
                    </Text>
                  </Box>
                  <Flex gap="3">
                    <RadixButton variant="outline" size="3">
                      <Camera className="w-4 h-4 mr-2" />
                      QR Code
                    </RadixButton>
                    <RadixButton variant="outline" size="3">
                      <Smartphone className="w-4 h-4 mr-2" />
                      Mobile Check-in
                    </RadixButton>
                    <RadixButton
                      variant="solid"
                      size="3"
                      className="bg-red-600"
                    >
                      End Session
                    </RadixButton>
                  </Flex>
                </Flex>

                {/* Real-time Stats */}
                <Grid columns="4" gap="4" className="mb-6">
                  <Box className="text-center p-4 bg-green-50 rounded-lg">
                    <Text size="4" weight="bold" className="text-green-600">
                      {activeSession.presentCount}
                    </Text>
                    <Text size="2" className="text-green-600">
                      Present
                    </Text>
                  </Box>
                  <Box className="text-center p-4 bg-red-50 rounded-lg">
                    <Text size="4" weight="bold" className="text-red-600">
                      {activeSession.absentCount}
                    </Text>
                    <Text size="2" className="text-red-600">
                      Absent
                    </Text>
                  </Box>
                  <Box className="text-center p-4 bg-yellow-50 rounded-lg">
                    <Text size="4" weight="bold" className="text-yellow-600">
                      {activeSession.lateCount}
                    </Text>
                    <Text size="2" className="text-yellow-600">
                      Late
                    </Text>
                  </Box>
                  <Box className="text-center p-4 bg-blue-50 rounded-lg">
                    <Text size="4" weight="bold" className="text-blue-600">
                      {activeSession.attendanceRate}%
                    </Text>
                    <Text size="2" className="text-blue-600">
                      Rate
                    </Text>
                  </Box>
                </Grid>
              </RadixCard>

              {/* Student List for Live Tracking */}
              <RadixCard className="p-6">
                <Heading size="4" className="mb-4">
                  Student Check-in Status
                </Heading>
                <Grid columns="1" gap="3">
                  {mockStudents.map((student) => {
                    const record = mockAttendanceRecords.find(
                      (r) => r.studentId === student.id
                    );
                    const status = record?.status || 'absent';

                    return (
                      <Flex
                        key={student.id}
                        justify="between"
                        align="center"
                        className="p-4 border border-gray-200 rounded-lg"
                      >
                        <Flex align="center" gap="4">
                          <Box className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-gray-600" />
                          </Box>
                          <Box>
                            <Text
                              size="3"
                              weight="medium"
                              className="text-gray-900"
                            >
                              {student.name}
                            </Text>
                            <Text size="2" className="text-gray-600">
                              {student.studentId} • {student.course}
                            </Text>
                            {record?.checkInTime && (
                              <Text size="2" className="text-blue-600">
                                Checked in at {record.checkInTime}
                              </Text>
                            )}
                          </Box>
                        </Flex>

                        <Flex align="center" gap="3">
                          <Badge color={getStatusColor(status)}>{status}</Badge>
                          <Flex gap="1">
                            <RadixButton
                              variant={
                                status === 'present' ? 'solid' : 'outline'
                              }
                              size="2"
                              onClick={() =>
                                handleMarkAttendance(student.id, 'present')
                              }
                              className={
                                status === 'present' ? 'bg-green-600' : ''
                              }
                            >
                              <CheckCircle className="w-4 h-4" />
                            </RadixButton>
                            <RadixButton
                              variant={status === 'late' ? 'solid' : 'outline'}
                              size="2"
                              onClick={() =>
                                handleMarkAttendance(student.id, 'late')
                              }
                              className={
                                status === 'late' ? 'bg-yellow-600' : ''
                              }
                            >
                              <AlertCircle className="w-4 h-4" />
                            </RadixButton>
                            <RadixButton
                              variant={
                                status === 'absent' ? 'solid' : 'outline'
                              }
                              size="2"
                              onClick={() =>
                                handleMarkAttendance(student.id, 'absent')
                              }
                              className={
                                status === 'absent' ? 'bg-red-600' : ''
                              }
                            >
                              <XCircle className="w-4 h-4" />
                            </RadixButton>
                          </Flex>
                        </Flex>
                      </Flex>
                    );
                  })}
                </Grid>
              </RadixCard>
            </Box>
          ) : (
            <RadixCard className="p-12 text-center">
              <Flex direction="column" align="center" gap="4">
                <Box className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Camera className="w-8 h-8 text-gray-400" />
                </Box>
                <Box>
                  <Heading size="4" className="text-gray-900 mb-2">
                    No Active Session
                  </Heading>
                  <Text size="3" className="text-gray-600 mb-4">
                    Start an attendance session to track student check-ins in
                    real-time
                  </Text>
                  <RadixButton variant="solid" size="3">
                    <Camera className="w-4 h-4 mr-2" />
                    Start New Session
                  </RadixButton>
                </Box>
              </Flex>
            </RadixCard>
          )}
        </Tabs.Content>

        {/* Records Tab */}
        <Tabs.Content value="records">
          {/* Filters */}
          <Flex justify="between" align="center" className="mb-6">
            <Flex gap="3" align="center">
              <Box className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </Box>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
                <option value="excused">Excused</option>
              </select>
            </Flex>
          </Flex>

          {/* Records Table */}
          <RadixCard className="p-6">
            <Heading size="4" className="mb-4">
              Attendance Records for{' '}
              {new Date(selectedDate).toLocaleDateString()}
            </Heading>
            <Grid columns="1" gap="3">
              {filteredRecords.map((record) => {
                const MethodIcon = getMethodIcon(record.method);

                return (
                  <Box
                    key={record.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <Flex justify="between" align="start">
                      <Flex gap="4" align="start">
                        <Box className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-600" />
                        </Box>
                        <Box className="flex-1">
                          <Flex align="center" gap="3" className="mb-2">
                            <Text
                              size="3"
                              weight="medium"
                              className="text-gray-900"
                            >
                              {record.student.name}
                            </Text>
                            <Badge color={getStatusColor(record.status)}>
                              {record.status}
                            </Badge>
                          </Flex>
                          <Text size="2" className="text-gray-600 mb-1">
                            {record.student.studentId} • {record.student.email}
                          </Text>
                          <Text size="2" className="text-gray-600 mb-2">
                            {record.className} • {record.time}
                          </Text>

                          <Flex gap="4" className="mb-2">
                            {record.checkInTime && (
                              <Text size="2" className="text-gray-600">
                                <Clock className="w-4 h-4 inline mr-1" />
                                Check-in: {record.checkInTime}
                              </Text>
                            )}
                            {record.checkOutTime && (
                              <Text size="2" className="text-gray-600">
                                <Clock className="w-4 h-4 inline mr-1" />
                                Check-out: {record.checkOutTime}
                              </Text>
                            )}
                            <Text size="2" className="text-gray-600">
                              <MethodIcon className="w-4 h-4 inline mr-1" />
                              {record.method}
                            </Text>
                          </Flex>

                          {record.notes && (
                            <Text size="2" className="text-gray-600 italic">
                              Note: {record.notes}
                            </Text>
                          )}
                        </Box>
                      </Flex>

                      <Flex gap="2">
                        <RadixButton variant="ghost" size="2">
                          <Edit className="w-4 h-4" />
                        </RadixButton>
                        <RadixButton variant="ghost" size="2">
                          <MoreHorizontal className="w-4 h-4" />
                        </RadixButton>
                      </Flex>
                    </Flex>
                  </Box>
                );
              })}
            </Grid>
          </RadixCard>
        </Tabs.Content>

        {/* Analytics Tab */}
        <Tabs.Content value="analytics">
          <Grid columns="2" gap="6">
            <RadixCard className="p-6">
              <Heading size="4" className="mb-4">
                Attendance Trends
              </Heading>
              <Box className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <Flex direction="column" align="center" gap="2">
                  <BarChart3 className="w-12 h-12 text-gray-400" />
                  <Text size="2" className="text-gray-600">
                    Attendance trend chart would go here
                  </Text>
                </Flex>
              </Box>
            </RadixCard>

            <RadixCard className="p-6">
              <Heading size="4" className="mb-4">
                Performance Metrics
              </Heading>
              <Flex direction="column" gap="4">
                <Flex justify="between" align="center">
                  <Text size="2" className="text-gray-600">
                    Overall Attendance Rate
                  </Text>
                  <Text size="2" weight="bold" className="text-green-600">
                    87%
                  </Text>
                </Flex>
                <Flex justify="between" align="center">
                  <Text size="2" className="text-gray-600">
                    Average Daily Attendance
                  </Text>
                  <Text size="2" weight="bold" className="text-blue-600">
                    92%
                  </Text>
                </Flex>
                <Flex justify="between" align="center">
                  <Text size="2" className="text-gray-600">
                    Late Arrival Rate
                  </Text>
                  <Text size="2" weight="bold" className="text-yellow-600">
                    8%
                  </Text>
                </Flex>
                <Flex justify="between" align="center">
                  <Text size="2" className="text-gray-600">
                    Chronic Absenteeism
                  </Text>
                  <Text size="2" weight="bold" className="text-red-600">
                    3%
                  </Text>
                </Flex>
              </Flex>
            </RadixCard>

            <RadixCard className="p-6">
              <Heading size="4" className="mb-4">
                Top Performing Classes
              </Heading>
              <Flex direction="column" gap="3">
                {mockAttendanceSessions.map((session) => (
                  <Flex
                    key={session.id}
                    justify="between"
                    align="center"
                    className="p-3 bg-gray-50 rounded-lg"
                  >
                    <Box>
                      <Text size="2" weight="medium">
                        {session.className}
                      </Text>
                      <Text size="1" className="text-gray-600">
                        {session.courseCode}
                      </Text>
                    </Box>
                    <Badge
                      color={
                        session.attendanceRate >= 90
                          ? 'green'
                          : session.attendanceRate >= 80
                            ? 'yellow'
                            : 'red'
                      }
                    >
                      {session.attendanceRate}%
                    </Badge>
                  </Flex>
                ))}
              </Flex>
            </RadixCard>

            <RadixCard className="p-6">
              <Heading size="4" className="mb-4">
                Method Usage
              </Heading>
              <Flex direction="column" gap="3">
                <Flex justify="between" align="center">
                  <Flex align="center" gap="2">
                    <Camera className="w-4 h-4 text-blue-600" />
                    <Text size="2" className="text-gray-600">
                      QR Code
                    </Text>
                  </Flex>
                  <Text size="2" weight="medium">
                    45%
                  </Text>
                </Flex>
                <Flex justify="between" align="center">
                  <Flex align="center" gap="2">
                    <User className="w-4 h-4 text-green-600" />
                    <Text size="2" className="text-gray-600">
                      Biometric
                    </Text>
                  </Flex>
                  <Text size="2" weight="medium">
                    30%
                  </Text>
                </Flex>
                <Flex justify="between" align="center">
                  <Flex align="center" gap="2">
                    <Edit className="w-4 h-4 text-purple-600" />
                    <Text size="2" className="text-gray-600">
                      Manual
                    </Text>
                  </Flex>
                  <Text size="2" weight="medium">
                    20%
                  </Text>
                </Flex>
                <Flex justify="between" align="center">
                  <Flex align="center" gap="2">
                    <MapPin className="w-4 h-4 text-orange-600" />
                    <Text size="2" className="text-gray-600">
                      Geofence
                    </Text>
                  </Flex>
                  <Text size="2" weight="medium">
                    5%
                  </Text>
                </Flex>
              </Flex>
            </RadixCard>
          </Grid>
        </Tabs.Content>

        {/* Settings Tab */}
        <Tabs.Content value="settings">
          <Grid columns="2" gap="6">
            <RadixCard className="p-6">
              <Heading size="4" className="mb-4">
                Attendance Methods
              </Heading>
              <Flex direction="column" gap="4">
                <Flex
                  justify="between"
                  align="center"
                  className="p-3 border border-gray-200 rounded-lg"
                >
                  <Flex align="center" gap="3">
                    <Camera className="w-5 h-5 text-blue-600" />
                    <Box>
                      <Text size="2" weight="medium">
                        QR Code Check-in
                      </Text>
                      <Text size="1" className="text-gray-600">
                        Students scan QR code to mark attendance
                      </Text>
                    </Box>
                  </Flex>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </Flex>

                <Flex
                  justify="between"
                  align="center"
                  className="p-3 border border-gray-200 rounded-lg"
                >
                  <Flex align="center" gap="3">
                    <User className="w-5 h-5 text-green-600" />
                    <Box>
                      <Text size="2" weight="medium">
                        Biometric Authentication
                      </Text>
                      <Text size="1" className="text-gray-600">
                        Fingerprint or facial recognition
                      </Text>
                    </Box>
                  </Flex>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </Flex>

                <Flex
                  justify="between"
                  align="center"
                  className="p-3 border border-gray-200 rounded-lg"
                >
                  <Flex align="center" gap="3">
                    <MapPin className="w-5 h-5 text-orange-600" />
                    <Box>
                      <Text size="2" weight="medium">
                        Geofence Tracking
                      </Text>
                      <Text size="1" className="text-gray-600">
                        Location-based automatic check-in
                      </Text>
                    </Box>
                  </Flex>
                  <input type="checkbox" className="w-4 h-4" />
                </Flex>
              </Flex>
            </RadixCard>

            <RadixCard className="p-6">
              <Heading size="4" className="mb-4">
                Notification Settings
              </Heading>
              <Flex direction="column" gap="4">
                <Box className="p-3 border border-gray-200 rounded-lg">
                  <Text size="2" weight="medium" className="mb-2">
                    Late Arrival Threshold
                  </Text>
                  <input
                    type="number"
                    defaultValue={15}
                    className="w-20 px-2 py-1 border border-gray-300 rounded"
                  />
                  <Text size="1" className="text-gray-600 ml-2">
                    minutes after class start
                  </Text>
                </Box>

                <Box className="p-3 border border-gray-200 rounded-lg">
                  <Text size="2" weight="medium" className="mb-2">
                    Auto-mark Absent After
                  </Text>
                  <input
                    type="number"
                    defaultValue={30}
                    className="w-20 px-2 py-1 border border-gray-300 rounded"
                  />
                  <Text size="1" className="text-gray-600 ml-2">
                    minutes
                  </Text>
                </Box>

                <Flex
                  justify="between"
                  align="center"
                  className="p-3 border border-gray-200 rounded-lg"
                >
                  <Text size="2" weight="medium">
                    Send absence notifications to parents
                  </Text>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </Flex>
              </Flex>
            </RadixCard>
          </Grid>
        </Tabs.Content>
      </Tabs.Root>
    </DashboardLayout>
  );
}
