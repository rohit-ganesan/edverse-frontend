import { useState } from 'react';
import { Box, Flex, Text, Heading, Grid, Badge, Tabs } from '@radix-ui/themes';
import { DashboardLayout } from 'components/layout/DashboardLayout';
import { RadixCard } from 'components/ui/RadixCard';
import { RadixButton } from 'components/ui/RadixButton';
import { PageHeader } from 'components/ui/PageHeader';
import { StatsGrid } from 'components/ui/StatsGrid';
import { ActionCard } from 'components/ui/ActionCard';
import { AttendanceSessionCard } from 'components/ui/AttendanceSessionCard';
import { AttendanceActivityCard } from 'components/ui/AttendanceActivityCard';
import { StudentAttendanceRow } from 'components/ui/StudentAttendanceRow';
import { EmptySessionState } from 'components/ui/EmptySessionState';
import {
  Clock,
  UserCheck,
  UserX,
  Search,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  TrendingUp,
  Eye,
  Edit,
  MoreHorizontal,
  Camera,
  MapPin,
  User,
  Wifi,
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
      <PageHeader
        title="Attendance"
        description="Track, monitor, and analyze student attendance patterns"
        actions={[
          {
            label: 'Export Report',
            icon: Download,
            variant: 'outline',
            onClick: () => console.log('Export report clicked'),
          },
          {
            label: 'Start Session',
            icon: Camera,
            isPrimary: true,
            onClick: () => console.log('Start session clicked'),
          },
        ]}
      />

      <StatsGrid
        stats={[
          {
            title: 'Present Today',
            value: totalPresent.toString(),
            icon: UserCheck,
            iconColor: 'text-green-600',
            iconBgColor: 'bg-green-100',
          },
          {
            title: 'Absent Today',
            value: totalAbsent.toString(),
            icon: UserX,
            iconColor: 'text-red-600',
            iconBgColor: 'bg-red-100',
          },
          {
            title: 'Late Arrivals',
            value: totalLate.toString(),
            icon: AlertCircle,
            iconColor: 'text-orange-600',
            iconBgColor: 'bg-orange-100',
          },
          {
            title: 'Attendance Rate',
            value: `${attendanceRate}%`,
            icon: TrendingUp,
            iconColor: 'text-blue-600',
            iconBgColor: 'bg-blue-100',
          },
        ]}
      />

      {/* Active Session Alert */}
      {activeSession && (
        <ActionCard
          title={`Active Session: ${activeSession.className}`}
          description={`${activeSession.presentCount}/${activeSession.totalStudents} students checked in • ${activeSession.location}`}
          variant="success"
          icon={Wifi}
          actions={[
            {
              label: 'Monitor',
              icon: Eye,
              variant: 'outline',
              onClick: () => console.log('Monitor session clicked'),
            },
            {
              label: 'End Session',
              onClick: () => console.log('End session clicked'),
            },
          ]}
          className="mb-6"
        />
      )}

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
          <Grid columns="3" gap="8">
            {/* Today's Sessions - Larger Column */}
            <Box className="col-span-2">
              <RadixCard className="p-8 shadow-lg border-0 bg-white">
                <Flex justify="between" align="center" className="mb-8">
                  <Box>
                    <Heading size="5" className="text-gray-900 mb-2">
                      Today's Sessions
                    </Heading>
                    <Text size="3" className="text-gray-600">
                      {mockAttendanceSessions?.length || 0} sessions scheduled
                    </Text>
                  </Box>
                  <RadixButton variant="outline" size="2">
                    <Eye className="w-4 h-4 mr-2" />
                    View All
                  </RadixButton>
                </Flex>

                <Flex direction="column" gap="4">
                  {mockAttendanceSessions &&
                  mockAttendanceSessions.length > 0 ? (
                    mockAttendanceSessions.map((session) => (
                      <Box key={session.id} className="group">
                        <Box className="p-5 bg-white rounded-lg border border-gray-200 hover:shadow-sm hover:border-gray-300 transition-all duration-200">
                          <Flex justify="between" align="start">
                            <Box className="flex-1">
                              <Text
                                size="4"
                                weight="bold"
                                className="text-gray-900 mb-3"
                              >
                                {session.className}
                              </Text>
                              <Flex align="center" gap="6" className="mb-3">
                                <Flex align="center" gap="2">
                                  <Clock className="w-4 h-4 text-gray-500" />
                                  <Text size="2" className="text-gray-600">
                                    {session.time}
                                  </Text>
                                </Flex>
                                <Flex align="center" gap="2">
                                  <MapPin className="w-4 h-4 text-gray-500" />
                                  <Text size="2" className="text-gray-600">
                                    {session.location}
                                  </Text>
                                </Flex>
                              </Flex>
                              <Flex align="center" gap="4">
                                <Text size="2" className="text-gray-700">
                                  <Text
                                    weight="medium"
                                    className="text-gray-900"
                                  >
                                    {session.presentCount}/
                                    {session.totalStudents}
                                  </Text>{' '}
                                  present
                                </Text>
                                <Text size="2" className="text-gray-700">
                                  <Text
                                    weight="medium"
                                    className="text-gray-900"
                                  >
                                    {session.attendanceRate}%
                                  </Text>{' '}
                                  rate
                                </Text>
                              </Flex>
                            </Box>
                            <Flex align="center" gap="3">
                              <Badge
                                color={
                                  session.status === 'active'
                                    ? 'green'
                                    : session.status === 'completed'
                                      ? 'gray'
                                      : 'blue'
                                }
                                size="2"
                              >
                                {session.status}
                              </Badge>
                              <RadixButton variant="ghost" size="2">
                                <Eye className="w-4 h-4" />
                              </RadixButton>
                            </Flex>
                          </Flex>
                        </Box>
                      </Box>
                    ))
                  ) : (
                    <Box className="text-center py-16">
                      <Box className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Camera className="w-8 h-8 text-gray-400" />
                      </Box>
                      <Text
                        size="3"
                        weight="medium"
                        className="text-gray-900 mb-2"
                      >
                        No sessions scheduled
                      </Text>
                      <Text size="2" className="text-gray-500 mb-4">
                        Create your first attendance session to get started
                      </Text>
                      <RadixButton variant="solid" size="3">
                        <Camera className="w-4 h-4 mr-2" />
                        Create Session
                      </RadixButton>
                    </Box>
                  )}
                </Flex>
              </RadixCard>
            </Box>

            {/* Recent Activity - Sidebar */}
            <Box>
              <RadixCard className="p-6 shadow-lg border-0 bg-white h-fit">
                <Flex justify="between" align="center" className="mb-6">
                  <Box>
                    <Heading size="4" className="text-gray-900 mb-1">
                      Recent Activity
                    </Heading>
                    <Text size="2" className="text-gray-600">
                      Latest check-ins
                    </Text>
                  </Box>
                </Flex>

                <Flex direction="column" gap="3">
                  {mockAttendanceRecords && mockAttendanceRecords.length > 0 ? (
                    mockAttendanceRecords.slice(0, 6).map((record) => (
                      <Box key={record.id} className="group">
                        <Flex
                          align="center"
                          gap="3"
                          className="p-4 rounded-lg hover:bg-gray-50 transition-colors duration-150 border border-transparent hover:border-gray-200"
                        >
                          <Box className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-gray-600" />
                          </Box>
                          <Box className="flex-1 min-w-0">
                            <Text
                              size="2"
                              weight="medium"
                              className="text-gray-900 mb-1 block"
                            >
                              {record.student.name}
                            </Text>
                            <Text size="1" className="text-gray-500 block">
                              {record.className} •{' '}
                              {record.checkInTime || 'No check-in'}
                            </Text>
                          </Box>
                          <Box className="flex-shrink-0">
                            <Badge
                              color={
                                record.status === 'present'
                                  ? 'green'
                                  : record.status === 'absent'
                                    ? 'red'
                                    : record.status === 'late'
                                      ? 'orange'
                                      : 'blue'
                              }
                              size="1"
                              variant="soft"
                            >
                              {record.status}
                            </Badge>
                          </Box>
                        </Flex>
                      </Box>
                    ))
                  ) : (
                    <Box className="text-center py-8">
                      <Box className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <User className="w-6 h-6 text-gray-400" />
                      </Box>
                      <Text size="2" className="text-gray-500">
                        No recent activity
                      </Text>
                    </Box>
                  )}
                </Flex>

                {mockAttendanceRecords && mockAttendanceRecords.length > 6 && (
                  <Box className="mt-6 pt-4 border-t border-gray-100">
                    <RadixButton variant="ghost" size="2" className="w-full">
                      <Eye className="w-4 h-4 mr-2" />
                      View All Activity
                    </RadixButton>
                  </Box>
                )}
              </RadixCard>
            </Box>
          </Grid>
        </Tabs.Content>

        {/* Live Tracking Tab */}
        <Tabs.Content value="live">
          {activeSession ? (
            <Box className="space-y-8">
              {/* Compact Live Tracking Header */}
              <Box className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white shadow-xl">
                <Flex justify="between" align="center" className="mb-4">
                  <Box>
                    <Flex align="center" gap="2" className="mb-2">
                      <Box className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></Box>
                      <Text
                        size="1"
                        className="text-blue-100 font-medium uppercase tracking-wide"
                      >
                        LIVE SESSION
                      </Text>
                    </Flex>
                    <Heading size="5" className="text-white mb-1">
                      {activeSession.className}
                    </Heading>
                    <Text size="2" className="text-blue-100">
                      {activeSession.location} • Started at {activeSession.time}
                    </Text>
                  </Box>
                  <Flex gap="2">
                    <RadixButton
                      variant="outline"
                      size="2"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <Camera className="w-4 h-4 mr-1" />
                      QR Code
                    </RadixButton>
                    <RadixButton
                      variant="outline"
                      size="2"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </RadixButton>
                    <RadixButton
                      variant="solid"
                      size="2"
                      className="bg-red-500 hover:bg-red-600 border-red-500"
                    >
                      End Session
                    </RadixButton>
                  </Flex>
                </Flex>

                {/* Compact Real-time Stats */}
                <Grid columns="4" gap="4">
                  <Box className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <Flex align="center" gap="3">
                      <Box className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </Box>
                      <Box>
                        <Text
                          size="4"
                          weight="bold"
                          className="text-white block"
                        >
                          {activeSession.presentCount}
                        </Text>
                        <Text size="1" className="text-green-200 block">
                          Present
                        </Text>
                      </Box>
                    </Flex>
                  </Box>

                  <Box className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <Flex align="center" gap="3">
                      <Box className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                        <XCircle className="w-5 h-5 text-white" />
                      </Box>
                      <Box>
                        <Text
                          size="4"
                          weight="bold"
                          className="text-white block"
                        >
                          {activeSession.absentCount}
                        </Text>
                        <Text size="1" className="text-red-200 block">
                          Absent
                        </Text>
                      </Box>
                    </Flex>
                  </Box>

                  <Box className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <Flex align="center" gap="3">
                      <Box className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-white" />
                      </Box>
                      <Box>
                        <Text
                          size="4"
                          weight="bold"
                          className="text-white block"
                        >
                          {activeSession.lateCount}
                        </Text>
                        <Text size="1" className="text-orange-200 block">
                          Late
                        </Text>
                      </Box>
                    </Flex>
                  </Box>

                  <Box className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <Flex align="center" gap="3">
                      <Box className="w-10 h-10 bg-blue-400 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </Box>
                      <Box>
                        <Text
                          size="4"
                          weight="bold"
                          className="text-white block"
                        >
                          {activeSession.attendanceRate}%
                        </Text>
                        <Text size="1" className="text-blue-200 block">
                          Rate
                        </Text>
                      </Box>
                    </Flex>
                  </Box>
                </Grid>
              </Box>

              {/* Elegant Student Check-in Status */}
              <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
                {/* Header Section */}
                <Box className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                  <Flex justify="between" align="center">
                    <Box>
                      <Heading size="5" className="text-gray-900 mb-1">
                        Student Check-in Status
                      </Heading>
                      <Text size="3" className="text-gray-600">
                        {mockStudents?.length || 0} students enrolled •{' '}
                        <span className="text-green-600 font-medium">
                          Real-time updates
                        </span>
                      </Text>
                    </Box>
                    <Flex gap="2">
                      <RadixButton
                        variant="soft"
                        size="2"
                        className="bg-white/70 hover:bg-white"
                      >
                        <Search className="w-4 h-4 mr-1" />
                        Search
                      </RadixButton>
                      <RadixButton
                        variant="soft"
                        size="2"
                        className="bg-white/70 hover:bg-white"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Export
                      </RadixButton>
                    </Flex>
                  </Flex>
                </Box>

                {/* Student List */}
                <Box className="p-6">
                  <Grid columns="1" gap="3">
                    {mockStudents && mockStudents.length > 0 ? (
                      mockStudents.map((student, index) => {
                        const record = mockAttendanceRecords.find(
                          (r) => r.studentId === student.id
                        );
                        const status = record?.status || 'absent';
                        const checkInTime = record?.checkInTime;

                        return (
                          <Box
                            key={student.id}
                            className="group animate-in slide-in-from-bottom-1 duration-300"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <Box className="relative p-4 bg-gray-50/50 hover:bg-white border border-gray-200/50 hover:border-gray-300 hover:shadow-lg rounded-xl transition-all duration-300 group-hover:scale-[1.01]">
                              {/* Status Indicator Line */}
                              <Box
                                className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${
                                  status === 'present'
                                    ? 'bg-green-500'
                                    : status === 'late'
                                      ? 'bg-orange-500'
                                      : status === 'absent'
                                        ? 'bg-red-500'
                                        : 'bg-gray-300'
                                }`}
                              />

                              <Flex justify="between" align="center">
                                <Flex align="center" gap="3" className="flex-1">
                                  {/* Avatar with Status Ring */}
                                  <Box className="relative">
                                    <Box
                                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                        status === 'present'
                                          ? 'bg-green-100 ring-2 ring-green-200'
                                          : status === 'late'
                                            ? 'bg-orange-100 ring-2 ring-orange-200'
                                            : status === 'absent'
                                              ? 'bg-red-100 ring-2 ring-red-200'
                                              : 'bg-gray-100'
                                      }`}
                                    >
                                      <User
                                        className={`w-5 h-5 ${
                                          status === 'present'
                                            ? 'text-green-600'
                                            : status === 'late'
                                              ? 'text-orange-600'
                                              : status === 'absent'
                                                ? 'text-red-600'
                                                : 'text-gray-500'
                                        }`}
                                      />
                                    </Box>
                                    {/* Live Status Dot */}
                                    {status === 'present' && (
                                      <Box className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                        <Box className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                      </Box>
                                    )}
                                  </Box>

                                  {/* Student Info */}
                                  <Box className="flex-1">
                                    <Flex
                                      align="center"
                                      gap="2"
                                      className="mb-1"
                                    >
                                      <Text
                                        size="2"
                                        weight="bold"
                                        className="text-gray-900"
                                      >
                                        {student.name}
                                      </Text>
                                      <Badge
                                        color={
                                          status === 'present'
                                            ? 'green'
                                            : status === 'late'
                                              ? 'orange'
                                              : status === 'absent'
                                                ? 'red'
                                                : 'gray'
                                        }
                                        variant="soft"
                                        size="1"
                                      >
                                        {status}
                                      </Badge>
                                      {checkInTime && (
                                        <Text
                                          size="1"
                                          className="text-blue-600 font-medium bg-blue-50 px-1.5 py-0.5 rounded text-xs"
                                        >
                                          ✓ {checkInTime}
                                        </Text>
                                      )}
                                    </Flex>
                                    <Text size="1" className="text-gray-600">
                                      {student.studentId} • {student.course}
                                    </Text>
                                  </Box>
                                </Flex>

                                {/* Action Buttons */}
                                <Flex
                                  gap="2"
                                  className="opacity-80 group-hover:opacity-100 transition-opacity"
                                >
                                  <RadixButton
                                    variant={
                                      status === 'present' ? 'solid' : 'soft'
                                    }
                                    size="2"
                                    onClick={() =>
                                      handleMarkAttendance &&
                                      handleMarkAttendance(
                                        student.id,
                                        'present'
                                      )
                                    }
                                    className={`${status === 'present' ? 'bg-green-600 hover:bg-green-700 text-white' : 'hover:bg-green-50 text-green-600'}`}
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </RadixButton>
                                  <RadixButton
                                    variant={
                                      status === 'late' ? 'solid' : 'soft'
                                    }
                                    size="2"
                                    onClick={() =>
                                      handleMarkAttendance &&
                                      handleMarkAttendance(student.id, 'late')
                                    }
                                    className={`${status === 'late' ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'hover:bg-orange-50 text-orange-600'}`}
                                  >
                                    <AlertCircle className="w-4 h-4" />
                                  </RadixButton>
                                  <RadixButton
                                    variant={
                                      status === 'absent' ? 'solid' : 'soft'
                                    }
                                    size="2"
                                    onClick={() =>
                                      handleMarkAttendance &&
                                      handleMarkAttendance(student.id, 'absent')
                                    }
                                    className={`${status === 'absent' ? 'bg-red-600 hover:bg-red-700 text-white' : 'hover:bg-red-50 text-red-600'}`}
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </RadixButton>
                                </Flex>
                              </Flex>
                            </Box>
                          </Box>
                        );
                      })
                    ) : (
                      <Box className="text-center py-16">
                        <Box className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                          <User className="w-10 h-10 text-gray-400" />
                        </Box>
                        <Text
                          size="4"
                          weight="medium"
                          className="text-gray-900 mb-2"
                        >
                          No students enrolled
                        </Text>
                        <Text size="3" className="text-gray-500 mb-6">
                          Add students to this session to start tracking
                          attendance
                        </Text>
                        <RadixButton
                          variant="solid"
                          size="3"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <User className="w-4 h-4 mr-2" />
                          Add Students
                        </RadixButton>
                      </Box>
                    )}
                  </Grid>
                </Box>

                {/* Enhanced Progress Section */}
                {mockStudents && mockStudents.length > 0 && (
                  <Box className="px-6 pb-6">
                    <Box className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-100">
                      <Flex justify="between" align="center" className="mb-3">
                        <Text size="3" weight="bold" className="text-gray-800">
                          Check-in Progress
                        </Text>
                        <Text size="2" className="text-gray-600 font-medium">
                          {activeSession.presentCount + activeSession.lateCount}{' '}
                          of {activeSession.totalStudents} students
                        </Text>
                      </Flex>

                      {/* Multi-segment Progress Bar */}
                      <Box className="relative w-full bg-gray-200 rounded-full h-2 mb-3 overflow-hidden">
                        <Box
                          className="absolute left-0 top-0 h-full bg-green-500 transition-all duration-700 ease-out"
                          style={{
                            width: `${(activeSession.presentCount / activeSession.totalStudents) * 100}%`,
                          }}
                        />
                        <Box
                          className="absolute top-0 h-full bg-orange-400 transition-all duration-700 ease-out"
                          style={{
                            left: `${(activeSession.presentCount / activeSession.totalStudents) * 100}%`,
                            width: `${(activeSession.lateCount / activeSession.totalStudents) * 100}%`,
                          }}
                        />
                      </Box>

                      {/* Progress Stats */}
                      <Flex justify="between" align="center">
                        <Flex gap="4">
                          <Flex align="center" gap="2">
                            <Box className="w-3 h-3 bg-green-500 rounded-full" />
                            <Text size="1" className="text-gray-600">
                              {activeSession.presentCount} Present
                            </Text>
                          </Flex>
                          <Flex align="center" gap="2">
                            <Box className="w-3 h-3 bg-orange-400 rounded-full" />
                            <Text size="1" className="text-gray-600">
                              {activeSession.lateCount} Late
                            </Text>
                          </Flex>
                          <Flex align="center" gap="2">
                            <Box className="w-3 h-3 bg-gray-300 rounded-full" />
                            <Text size="1" className="text-gray-600">
                              {activeSession.absentCount} Absent
                            </Text>
                          </Flex>
                        </Flex>
                        <Text size="2" weight="bold" className="text-green-600">
                          {Math.round(
                            ((activeSession.presentCount +
                              activeSession.lateCount) /
                              activeSession.totalStudents) *
                              100
                          )}
                          % Attended
                        </Text>
                      </Flex>
                    </Box>
                  </Box>
                )}
              </RadixCard>
            </Box>
          ) : (
            <Box className="min-h-[60vh] flex items-center justify-center">
              <EmptySessionState
                onStartSession={() => console.log('Start new session clicked')}
                title="Ready to Track Attendance?"
                description="Start a new session to monitor student check-ins in real-time with advanced tracking features"
              />
            </Box>
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
