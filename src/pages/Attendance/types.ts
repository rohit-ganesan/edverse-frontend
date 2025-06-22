export interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  avatar?: string;
  course: string;
  year: string;
}

export interface AttendanceRecord {
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

export interface AttendanceSession {
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

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';
export type SessionStatus = 'active' | 'completed' | 'scheduled';
export type AttendanceMethod = 'manual' | 'qr' | 'biometric' | 'geofence';
