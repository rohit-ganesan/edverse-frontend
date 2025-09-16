import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Users,
  Calendar,
  BookOpen,
  TrendingUp,
  UserCheck,
} from 'lucide-react';
import type { Student } from '../types';

export function useStudentManagement() {
  const navigate = useNavigate();

  // Navigation handlers
  const handleViewStudent = (student: Student) => {
    // Convert Student type to the format expected by ViewStudentPage
    const studentData = {
      id: student.id,
      name: student.name,
      email: student.email,
      phone: student.phone,
      class: student.class,
      status: student.status,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
      address: student.address,
      dateOfBirth: student.dateOfBirth,
      admissionDate: student.admissionDate,
      rollNumber: student.rollNumber,
    };

    navigate('/students/view-student', {
      state: { studentData },
    });
  };

  const handleAddStudent = () => {
    navigate('/students/add-student');
  };

  const handleDeleteStudent = (studentId: number | string) => {
    // TODO: Implement delete functionality with confirmation
    console.log('Delete student:', studentId);
  };

  // Export functionality
  const handleExportStudents = (
    students: Student[],
    format: 'csv' | 'pdf' = 'csv'
  ) => {
    try {
      if (format === 'csv') {
        const headers = [
          'Roll Number',
          'Name',
          'Class',
          'Section',
          'Attendance %',
          'Grade',
          'Parent Name',
          'Parent Phone',
          'Status',
        ];

        const csvContent = [
          headers.join(','),
          ...students.map((student) =>
            [
              `"${student.rollNumber}"`,
              `"${student.name}"`,
              `"${student.class}"`,
              `"${student.section}"`,
              `"${student.attendance.percentage}%"`,
              `"${student.academicRecord.currentGrade}"`,
              `"${student.parentName}"`,
              `"${student.parentPhone}"`,
              `"${student.status}"`,
            ].join(',')
          ),
        ].join('\n');

        const blob = new Blob([csvContent], {
          type: 'text/csv;charset=utf-8;',
        });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute(
          'download',
          `students-${new Date().toISOString().split('T')[0]}.csv`
        );
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      console.log(`Students exported as ${format}`);
    } catch (error) {
      console.error('Error exporting students:', error);
    }
  };

  // Bulk operations
  const handleBulkOperation = (
    studentIds: (number | string)[],
    operation: string
  ) => {
    switch (operation) {
      case 'activate':
        console.log('Activating students:', studentIds);
        break;
      case 'deactivate':
        console.log('Deactivating students:', studentIds);
        break;
      case 'promote':
        console.log('Promoting students:', studentIds);
        break;
      case 'transfer':
        console.log('Transferring students:', studentIds);
        break;
      default:
        console.log('Unknown operation:', operation);
    }
  };

  // Attendance operations
  const handleMarkAttendance = (classId: string, sectionId: string) => {
    navigate(`/attendance/mark?class=${classId}&section=${sectionId}`);
  };

  const handleViewAttendanceReport = (studentId: number | string) => {
    navigate(`/students/${studentId}/attendance`);
  };

  // Academic operations
  const handleViewAcademicReport = (studentId: number | string) => {
    navigate(`/students/${studentId}/academics`);
  };

  const handleUpdateGrades = (studentId: number | string) => {
    navigate(`/students/${studentId}/grades`);
  };

  // Fee operations
  const handleViewFeeDetails = (studentId: number | string) => {
    navigate(`/students/${studentId}/fees`);
  };

  const handleCollectFee = (studentId: number | string) => {
    navigate(`/students/${studentId}/fees/collect`);
  };

  // Communication
  const handleSendNotification = (
    studentIds: (number | string)[],
    type: 'sms' | 'email' | 'app'
  ) => {
    console.log(`Sending ${type} notification to students:`, studentIds);
  };

  const handleContactParent = (
    studentId: number | string,
    method: 'call' | 'email' | 'sms'
  ) => {
    console.log(`Contacting parent of student ${studentId} via ${method}`);
  };

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'text-green-600';
      case 'inactive':
        return 'text-gray-600';
      case 'transferred':
        return 'text-blue-600';
      case 'graduated':
        return 'text-purple-600';
      case 'suspended':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 95) return 'text-green-600';
    if (percentage >= 85) return 'text-blue-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600';
    if (grade.startsWith('B')) return 'text-blue-600';
    if (grade.startsWith('C')) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatAttendancePercentage = (attendance: {
    percentage: number;
    presentDays: number;
    totalDays: number;
  }) => {
    return `${attendance.percentage.toFixed(1)}% (${attendance.presentDays}/${attendance.totalDays})`;
  };

  const formatPhoneNumber = (phone: string) => {
    // Format phone number for display
    return phone.replace(/(\+\d{1})(\d{3})(\d{3})(\d{4})/, '$1 ($2) $3-$4');
  };

  // Stats icons
  const getStatsIcon = (type: string) => {
    switch (type) {
      case 'total':
        return GraduationCap;
      case 'active':
        return UserCheck;
      case 'attendance':
        return Calendar;
      case 'classes':
        return BookOpen;
      case 'performance':
        return TrendingUp;
      default:
        return Users;
    }
  };

  return {
    // Navigation
    handleViewStudent,
    handleAddStudent,
    handleDeleteStudent,

    // Export & Bulk operations
    handleExportStudents,
    handleBulkOperation,

    // Attendance
    handleMarkAttendance,
    handleViewAttendanceReport,

    // Academic
    handleViewAcademicReport,
    handleUpdateGrades,

    // Fees
    handleViewFeeDetails,
    handleCollectFee,

    // Communication
    handleSendNotification,
    handleContactParent,

    // Utilities
    getStatusColor,
    getAttendanceColor,
    getGradeColor,
    formatAttendancePercentage,
    formatPhoneNumber,
    getStatsIcon,
  };
}
