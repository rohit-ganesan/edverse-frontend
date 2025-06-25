import { useMemo } from 'react';

// Mock data for now - will be replaced with actual API calls
const mockCourses = [
  {
    id: '1',
    name: 'Computer Science Fundamentals',
    code: 'CS101',
    description: 'Introduction to programming and computer science concepts',
    credits: 3,
    duration: '16 weeks',
    enrolledStudents: 145,
    maxCapacity: 150,
    instructor: 'Dr. Wilson',
    isActive: true,
  },
  {
    id: '2',
    name: 'Advanced Mathematics',
    code: 'MATH301',
    description: 'Calculus, linear algebra, and differential equations',
    credits: 4,
    duration: '16 weeks',
    enrolledStudents: 89,
    maxCapacity: 100,
    instructor: 'Prof. Davis',
    isActive: true,
  },
  {
    id: '3',
    name: 'Data Structures and Algorithms',
    code: 'CS201',
    description: 'Fundamental data structures and algorithmic techniques',
    credits: 4,
    duration: '16 weeks',
    enrolledStudents: 120,
    maxCapacity: 130,
    instructor: 'Dr. Anderson',
    isActive: true,
  },
  {
    id: '4',
    name: 'Digital Marketing Fundamentals',
    code: 'MKT101',
    description: 'Introduction to digital marketing strategies and tools',
    credits: 3,
    duration: '12 weeks',
    enrolledStudents: 95,
    maxCapacity: 100,
    instructor: 'Prof. Thompson',
    isActive: true,
  },
];

export function useCoursesData() {
  const stats = useMemo(() => {
    const activeCourses = mockCourses.filter((c) => c.isActive);
    const totalEnrolled = mockCourses.reduce(
      (sum, c) => sum + c.enrolledStudents,
      0
    );
    const totalCapacity = mockCourses.reduce(
      (sum, c) => sum + c.maxCapacity,
      0
    );
    const uniqueInstructors = new Set(mockCourses.map((c) => c.instructor))
      .size;

    return {
      activeCourses: activeCourses.length,
      totalSubjects: activeCourses.length,
      enrolledStudents: totalEnrolled,
      certifications: 12,
      totalCapacity,
      instructors: uniqueInstructors,
    };
  }, []);

  return {
    courses: mockCourses,
    stats,
    isLoading: false,
    error: null,
  };
}
