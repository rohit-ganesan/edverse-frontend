import { useMemo } from 'react';

// Mock data for now - will be replaced with actual API calls
const mockClasses = [
  {
    id: '1',
    name: 'Mathematics Grade 10',
    subject: 'Mathematics',
    grade: '10',
    section: 'A',
    instructor: 'Dr. Smith',
    schedule: 'Mon, Wed, Fri - 9:00 AM',
    students: 25,
    isActive: true,
  },
  {
    id: '2',
    name: 'Physics Grade 11',
    subject: 'Physics',
    grade: '11',
    section: 'B',
    instructor: 'Prof. Johnson',
    schedule: 'Tue, Thu - 10:30 AM',
    students: 22,
    isActive: true,
  },
  {
    id: '3',
    name: 'Chemistry Grade 12',
    subject: 'Chemistry',
    grade: '12',
    section: 'A',
    instructor: 'Dr. Williams',
    schedule: 'Mon, Wed, Fri - 11:00 AM',
    students: 28,
    isActive: true,
  },
  {
    id: '4',
    name: 'English Literature Grade 9',
    subject: 'English',
    grade: '9',
    section: 'B',
    instructor: 'Ms. Brown',
    schedule: 'Tue, Thu - 2:00 PM',
    students: 30,
    isActive: true,
  },
];

export function useClassesData() {
  const stats = useMemo(() => {
    const activeClasses = mockClasses.filter((c) => c.isActive);
    const totalStudents = mockClasses.reduce((sum, c) => sum + c.students, 0);
    const uniqueSubjects = new Set(mockClasses.map((c) => c.subject)).size;

    return {
      totalClasses: activeClasses.length,
      todayClasses: 8,
      totalSubjects: uniqueSubjects,
      avgDuration: 45,
      totalStudents,
    };
  }, []);

  return {
    classes: mockClasses,
    stats,
    isLoading: false,
    error: null,
  };
}
