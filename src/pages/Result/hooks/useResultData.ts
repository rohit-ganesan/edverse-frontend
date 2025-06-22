import { useState, useMemo } from 'react';
import { StudentResult, ResultAnalytics, ResultFilters } from '../types';

// Mock data
const mockResults: StudentResult[] = [
  {
    id: '1',
    studentId: 'STU001',
    studentName: 'Alice Johnson',
    course: 'Computer Science',
    semester: 'Fall',
    year: '2024',
    subjects: [
      {
        id: '1',
        name: 'Data Structures',
        code: 'CS201',
        credits: 3,
        fullMarks: 100,
        obtainedMarks: 85,
        grade: 'A',
        gradePoints: 4.0,
        status: 'pass',
        examType: 'both',
      },
      {
        id: '2',
        name: 'Database Systems',
        code: 'CS202',
        credits: 3,
        fullMarks: 100,
        obtainedMarks: 78,
        grade: 'B+',
        gradePoints: 3.5,
        status: 'pass',
        examType: 'both',
      },
    ],
    totalMarks: 600,
    obtainedMarks: 485,
    percentage: 80.83,
    grade: 'A-',
    gpa: 3.75,
    cgpa: 3.68,
    status: 'published',
    publishedDate: '2024-01-15',
  },
  {
    id: '2',
    studentId: 'STU002',
    studentName: 'Bob Smith',
    course: 'Computer Science',
    semester: 'Fall',
    year: '2024',
    subjects: [
      {
        id: '3',
        name: 'Data Structures',
        code: 'CS201',
        credits: 3,
        fullMarks: 100,
        obtainedMarks: 65,
        grade: 'B',
        gradePoints: 3.0,
        status: 'pass',
        examType: 'both',
      },
      {
        id: '4',
        name: 'Database Systems',
        code: 'CS202',
        credits: 3,
        fullMarks: 100,
        obtainedMarks: 72,
        grade: 'B+',
        gradePoints: 3.5,
        status: 'pass',
        examType: 'both',
      },
    ],
    totalMarks: 600,
    obtainedMarks: 411,
    percentage: 68.5,
    grade: 'B',
    gpa: 3.25,
    cgpa: 3.42,
    status: 'published',
    publishedDate: '2024-01-15',
  },
  {
    id: '3',
    studentId: 'STU003',
    studentName: 'Carol Williams',
    course: 'Computer Science',
    semester: 'Spring',
    year: '2024',
    subjects: [
      {
        id: '5',
        name: 'Data Structures',
        code: 'CS201',
        credits: 3,
        fullMarks: 100,
        obtainedMarks: 92,
        grade: 'A+',
        gradePoints: 4.0,
        status: 'pass',
        examType: 'both',
      },
    ],
    totalMarks: 600,
    obtainedMarks: 552,
    percentage: 92.0,
    grade: 'A+',
    gpa: 4.0,
    cgpa: 3.85,
    status: 'pending',
  },
];

const mockAnalytics: ResultAnalytics = {
  totalStudents: 120,
  passedStudents: 105,
  failedStudents: 15,
  passPercentage: 87.5,
  averageGPA: 3.42,
  topPerformers: mockResults.slice(0, 3),
  subjectWiseAnalysis: [
    {
      subjectName: 'Data Structures',
      subjectCode: 'CS201',
      averageMarks: 75.2,
      passRate: 92.5,
      highestMarks: 98,
      lowestMarks: 45,
    },
    {
      subjectName: 'Database Systems',
      subjectCode: 'CS202',
      averageMarks: 78.8,
      passRate: 95.0,
      highestMarks: 96,
      lowestMarks: 52,
    },
  ],
};

export function useResultData() {
  const [filters, setFilters] = useState<ResultFilters>({
    searchTerm: '',
    selectedSemester: 'all',
    selectedStatus: 'all',
  });

  const filteredResults = useMemo(() => {
    return mockResults.filter((result) => {
      const matchesSearch =
        result.studentName
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase()) ||
        result.studentId
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase()) ||
        result.course.toLowerCase().includes(filters.searchTerm.toLowerCase());
      const matchesSemester =
        filters.selectedSemester === 'all' ||
        result.semester === filters.selectedSemester;
      const matchesStatus =
        filters.selectedStatus === 'all' ||
        result.status === filters.selectedStatus;

      return matchesSearch && matchesSemester && matchesStatus;
    });
  }, [filters]);

  const updateFilters = (newFilters: Partial<ResultFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      selectedSemester: 'all',
      selectedStatus: 'all',
    });
  };

  return {
    results: mockResults,
    filteredResults,
    analytics: mockAnalytics,
    filters,
    updateFilters,
    resetFilters,
  };
}
