import { useMemo } from 'react';
import { Student, AttendanceRecord, AttendanceSession } from '../types';

// Mock data - in real app this would come from API
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

interface UseAttendanceDataProps {
  selectedDate?: string;
  searchTerm?: string;
  selectedStatus?: string;
}

export function useAttendanceData({
  selectedDate = '2024-01-15',
  searchTerm = '',
  selectedStatus = 'all',
}: UseAttendanceDataProps = {}) {
  const filteredRecords = useMemo(() => {
    return mockAttendanceRecords.filter((record) => {
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
  }, [searchTerm, selectedStatus, selectedDate]);

  const stats = useMemo(() => {
    const todayRecords = mockAttendanceRecords.filter(
      (record) => record.date === selectedDate
    );
    const totalPresent = todayRecords.filter(
      (r) => r.status === 'present'
    ).length;
    const totalAbsent = todayRecords.filter(
      (r) => r.status === 'absent'
    ).length;
    const totalLate = todayRecords.filter((r) => r.status === 'late').length;
    const attendanceRate =
      todayRecords.length > 0
        ? Math.round((totalPresent / todayRecords.length) * 100)
        : 0;

    return {
      totalPresent,
      totalAbsent,
      totalLate,
      attendanceRate,
    };
  }, [selectedDate]);

  const activeSession = useMemo(() => {
    return mockAttendanceSessions.find((s) => s.status === 'active') || null;
  }, []);

  return {
    students: mockStudents,
    attendanceRecords: mockAttendanceRecords,
    attendanceSessions: mockAttendanceSessions,
    filteredRecords,
    stats,
    activeSession,
  };
}
