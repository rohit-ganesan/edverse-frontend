import { Box, Flex, Text, Heading, Grid, Badge } from '@radix-ui/themes';
import { RadixCard } from 'components/ui/RadixCard';
import { RadixButton } from 'components/ui/RadixButton';
import { EmptySessionState } from 'components/ui/EmptySessionState';
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Camera,
  Download,
  User,
} from 'lucide-react';
import { useAttendanceData } from '../hooks/useAttendanceData';
import { useSessionManagement } from '../hooks/useSessionManagement';

export function LiveTracking(): JSX.Element {
  const { activeSession, students, attendanceRecords } = useAttendanceData();
  const { handleMarkAttendance, handleStartSession, handleEndSession } =
    useSessionManagement();

  if (!activeSession) {
    return (
      <Box className="min-h-[60vh] flex items-center justify-center">
        <EmptySessionState
          onStartSession={handleStartSession}
          title="Ready to Track Attendance?"
          description="Start a new session to monitor student check-ins in real-time with advanced tracking features"
        />
      </Box>
    );
  }

  return (
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
              onClick={() => handleEndSession(activeSession.id)}
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
                <Text size="4" weight="bold" className="text-white block">
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
                <Text size="4" weight="bold" className="text-white block">
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
                <Text size="4" weight="bold" className="text-white block">
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
                <Text size="4" weight="bold" className="text-white block">
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

      {/* Student Check-in Status */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        {/* Header Section */}
        <Box className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
          <Flex justify="between" align="center">
            <Box>
              <Heading size="5" className="text-gray-900 mb-1">
                Student Check-in Status
              </Heading>
              <Text size="3" className="text-gray-600">
                {students?.length || 0} students enrolled •{' '}
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
                <Download className="w-4 h-4 mr-1" />
                Export
              </RadixButton>
            </Flex>
          </Flex>
        </Box>

        {/* Enhanced Progress Section */}
        {students && students.length > 0 && (
          <Box className="pl-6 pr-6 pt-4">
            <Box className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-100">
              <Flex justify="between" align="center" className="mb-3">
                <Text size="3" weight="bold" className="text-gray-800">
                  Check-in Progress
                </Text>
                <Text size="2" className="text-gray-600 font-medium">
                  {activeSession.presentCount + activeSession.lateCount} of{' '}
                  {activeSession.totalStudents} students
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
                    ((activeSession.presentCount + activeSession.lateCount) /
                      activeSession.totalStudents) *
                      100
                  )}
                  % Attended
                </Text>
              </Flex>
            </Box>
          </Box>
        )}

        {/* Student List */}
        <Box className="p-6">
          <Grid columns="1" gap="3">
            {students && students.length > 0 ? (
              students.map((student, index) => {
                const record = attendanceRecords.find(
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
                            <Flex align="center" gap="2" className="mb-1">
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
                            variant={status === 'present' ? 'solid' : 'soft'}
                            size="2"
                            onClick={() =>
                              handleMarkAttendance &&
                              handleMarkAttendance(student.id, 'present')
                            }
                            className={`${status === 'present' ? 'bg-green-600 hover:bg-green-700 text-white' : 'hover:bg-green-50 text-green-600'}`}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </RadixButton>
                          <RadixButton
                            variant={status === 'late' ? 'solid' : 'soft'}
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
                            variant={status === 'absent' ? 'solid' : 'soft'}
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
                <Text size="4" weight="medium" className="text-gray-900 mb-2">
                  No students enrolled
                </Text>
                <Text size="3" className="text-gray-500 mb-6">
                  Add students to this session to start tracking attendance
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
      </RadixCard>
    </Box>
  );
}
