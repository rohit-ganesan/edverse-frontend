import { useState, useMemo } from 'react';
import type {
  Student,
  StudentFilters,
  StudentStats,
  ClassSection,
} from '../types';

// Mock data - replace with actual API calls
const mockStudents: Student[] = [
  {
    id: 1,
    name: 'Alex Thompson',
    rollNumber: 'S001',
    class: 'Grade 10',
    section: 'A',
    dateOfBirth: '2008-05-15',
    parentName: 'Robert Thompson',
    parentPhone: '+1 (555) 123-4567',
    parentEmail: 'robert.thompson@email.com',
    address: '123 Main St, Springfield, IL 62701',
    admissionDate: '2022-08-15',
    bloodGroup: 'O+',
    status: 'Active',
    attendance: {
      percentage: 95,
      totalDays: 180,
      presentDays: 171,
      absentDays: 9,
    },
    academicRecord: {
      currentGrade: 'A',
      gpa: 3.8,
    },
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'English', 'History'],
    extracurricularActivities: ['Basketball', 'Debate Club'],
    emergencyContact: {
      name: 'Sarah Thompson',
      relation: 'Mother',
      phone: '+1 (555) 123-4568',
    },
    fees: {
      totalAmount: 5000,
      paidAmount: 5000,
      pendingAmount: 0,
      lastPaymentDate: '2024-01-15',
    },
  },
  {
    id: 2,
    name: 'Emma Rodriguez',
    rollNumber: 'S002',
    class: 'Grade 10',
    section: 'A',
    dateOfBirth: '2008-03-22',
    parentName: 'Maria Rodriguez',
    parentPhone: '+1 (555) 234-5678',
    parentEmail: 'maria.rodriguez@email.com',
    address: '456 Oak Ave, Springfield, IL 62702',
    admissionDate: '2022-08-15',
    bloodGroup: 'A+',
    status: 'Active',
    attendance: {
      percentage: 92,
      totalDays: 180,
      presentDays: 166,
      absentDays: 14,
    },
    academicRecord: {
      currentGrade: 'A-',
      gpa: 3.6,
    },
    subjects: ['Mathematics', 'Biology', 'Chemistry', 'English', 'Spanish'],
    extracurricularActivities: ['Science Club', 'Art Club'],
    emergencyContact: {
      name: 'Carlos Rodriguez',
      relation: 'Father',
      phone: '+1 (555) 234-5679',
    },
    fees: {
      totalAmount: 5000,
      paidAmount: 4500,
      pendingAmount: 500,
      lastPaymentDate: '2023-12-15',
    },
  },
  {
    id: 3,
    name: 'Michael Park',
    rollNumber: 'S003',
    class: 'Grade 10',
    section: 'B',
    dateOfBirth: '2008-07-10',
    parentName: 'Jennifer Park',
    parentPhone: '+1 (555) 345-6789',
    parentEmail: 'jennifer.park@email.com',
    address: '789 Pine St, Springfield, IL 62703',
    admissionDate: '2022-08-15',
    bloodGroup: 'B+',
    status: 'Active',
    attendance: {
      percentage: 88,
      totalDays: 180,
      presentDays: 158,
      absentDays: 22,
    },
    academicRecord: {
      currentGrade: 'B+',
      gpa: 3.4,
    },
    subjects: [
      'Mathematics',
      'Physics',
      'Computer Science',
      'English',
      'Geography',
    ],
    extracurricularActivities: ['Soccer', 'Chess Club'],
    emergencyContact: {
      name: 'David Park',
      relation: 'Father',
      phone: '+1 (555) 345-6790',
    },
    fees: {
      totalAmount: 5000,
      paidAmount: 5000,
      pendingAmount: 0,
      lastPaymentDate: '2024-01-15',
    },
  },
];

const mockClassSections: ClassSection[] = [
  {
    id: '1',
    className: 'Grade 10',
    section: 'A',
    strength: 35,
    classTeacher: 'Dr. Sarah Johnson',
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'English', 'History'],
  },
  {
    id: '2',
    className: 'Grade 10',
    section: 'B',
    strength: 32,
    classTeacher: 'Prof. Michael Chen',
    subjects: [
      'Mathematics',
      'Physics',
      'Computer Science',
      'English',
      'Geography',
    ],
  },
];

export function useStudentData() {
  const [filters, setFilters] = useState<StudentFilters>({
    search: '',
    class: 'all',
    section: 'all',
    status: 'all',
    attendanceRange: 'all',
    gradeRange: 'all',
  });

  // Filter students based on current filters
  const filteredStudents = useMemo(() => {
    return mockStudents.filter((student) => {
      const matchesSearch =
        filters.search === '' ||
        student.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        student.rollNumber
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        student.parentName.toLowerCase().includes(filters.search.toLowerCase());

      const matchesClass =
        filters.class === 'all' || student.class === filters.class;
      const matchesSection =
        filters.section === 'all' || student.section === filters.section;
      const matchesStatus =
        filters.status === 'all' || student.status === filters.status;

      const matchesAttendance =
        filters.attendanceRange === 'all' ||
        (() => {
          const attendance = student.attendance.percentage;
          switch (filters.attendanceRange) {
            case 'excellent':
              return attendance >= 95;
            case 'good':
              return attendance >= 85 && attendance < 95;
            case 'average':
              return attendance >= 75 && attendance < 85;
            case 'poor':
              return attendance < 75;
            default:
              return true;
          }
        })();

      const matchesGrade =
        filters.gradeRange === 'all' ||
        (() => {
          const grade = student.academicRecord.currentGrade;
          switch (filters.gradeRange) {
            case 'A':
              return grade.startsWith('A');
            case 'B':
              return grade.startsWith('B');
            case 'C':
              return grade.startsWith('C');
            case 'D':
              return grade.startsWith('D');
            default:
              return true;
          }
        })();

      return (
        matchesSearch &&
        matchesClass &&
        matchesSection &&
        matchesStatus &&
        matchesAttendance &&
        matchesGrade
      );
    });
  }, [filters]);

  // Calculate statistics
  const stats = useMemo((): StudentStats => {
    const totalStudents = mockStudents.length;
    const activeStudents = mockStudents.filter(
      (s) => s.status === 'Active'
    ).length;
    const averageAttendance =
      mockStudents.reduce((sum, s) => sum + s.attendance.percentage, 0) /
      totalStudents;

    const gradeDistribution = [
      'A+',
      'A',
      'A-',
      'B+',
      'B',
      'B-',
      'C+',
      'C',
      'C-',
      'D',
      'F',
    ]
      .map((grade) => {
        const count = mockStudents.filter(
          (s) => s.academicRecord.currentGrade === grade
        ).length;
        return {
          grade,
          count,
          percentage: (count / totalStudents) * 100,
        };
      })
      .filter((item) => item.count > 0);

    const attendanceDistribution = [
      { range: '95-100%', min: 95, max: 100 },
      { range: '85-94%', min: 85, max: 94 },
      { range: '75-84%', min: 75, max: 84 },
      { range: 'Below 75%', min: 0, max: 74 },
    ].map((range) => {
      const count = mockStudents.filter(
        (s) =>
          s.attendance.percentage >= range.min &&
          s.attendance.percentage <= range.max
      ).length;
      return {
        range: range.range,
        count,
        percentage: (count / totalStudents) * 100,
      };
    });

    return {
      totalStudents,
      activeStudents,
      averageAttendance,
      totalClasses: mockClassSections.length,
      gradeDistribution,
      attendanceDistribution,
    };
  }, []);

  const updateFilter = (key: keyof StudentFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      class: 'all',
      section: 'all',
      status: 'all',
      attendanceRange: 'all',
      gradeRange: 'all',
    });
  };

  return {
    students: filteredStudents,
    allStudents: mockStudents,
    classSections: mockClassSections,
    stats,
    filters,
    updateFilter,
    resetFilters,
  };
}
