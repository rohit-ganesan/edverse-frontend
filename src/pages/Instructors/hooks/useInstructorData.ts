import { useState, useMemo } from 'react';
import type {
  Instructor,
  InstructorFilters,
  InstructorStats,
  Department,
} from '../types';

// Mock data
const mockInstructors: Instructor[] = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    employeeId: 'EMP001',
    subjects: ['Mathematics', 'Statistics'],
    classes: ['Grade 10-A', 'Grade 11-B'],
    email: 'sarah.johnson@school.edu',
    phone: '+1 (555) 123-4567',
    address: '123 Faculty St, Springfield, IL 62701',
    dateOfJoining: '2020-08-15',
    qualification: 'PhD in Mathematics',
    experience: {
      years: 8,
      previousInstitutions: ['Springfield University', 'Metro College'],
    },
    department: 'Mathematics',
    designation: 'Senior Lecturer',
    status: 'Active',
    salary: {
      basic: 65000,
      allowances: 15000,
      total: 80000,
    },
    schedule: {
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      workingHours: {
        start: '08:00',
        end: '16:00',
      },
    },
    performance: {
      rating: 4.8,
      studentFeedback: 4.7,
      classesTaught: 6,
      attendanceRate: 96,
    },
    emergencyContact: {
      name: 'Michael Johnson',
      relation: 'Spouse',
      phone: '+1 (555) 123-4568',
    },
    documents: {
      resume: 'sarah_johnson_resume.pdf',
      certificates: ['phd_certificate.pdf', 'teaching_license.pdf'],
      idProof: 'drivers_license.pdf',
    },
  },
  {
    id: 2,
    name: 'Prof. Michael Chen',
    employeeId: 'EMP002',
    subjects: ['Physics', 'Chemistry'],
    classes: ['Grade 11-A', 'Grade 12-A'],
    email: 'michael.chen@school.edu',
    phone: '+1 (555) 234-5678',
    address: '456 Academic Ave, Springfield, IL 62702',
    dateOfJoining: '2018-07-01',
    qualification: 'MSc in Physics',
    experience: {
      years: 12,
      previousInstitutions: ['Central High School', 'Tech Institute'],
    },
    department: 'Science',
    designation: 'Head of Department',
    status: 'Active',
    salary: {
      basic: 75000,
      allowances: 20000,
      total: 95000,
    },
    schedule: {
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      workingHours: {
        start: '07:30',
        end: '15:30',
      },
    },
    performance: {
      rating: 4.9,
      studentFeedback: 4.8,
      classesTaught: 8,
      attendanceRate: 98,
    },
    emergencyContact: {
      name: 'Lisa Chen',
      relation: 'Spouse',
      phone: '+1 (555) 234-5679',
    },
    documents: {
      resume: 'michael_chen_resume.pdf',
      certificates: ['msc_certificate.pdf', 'hod_appointment.pdf'],
      idProof: 'passport.pdf',
    },
  },
];

const mockDepartments: Department[] = [
  {
    id: '1',
    name: 'Mathematics',
    code: 'MATH',
    head: 'Dr. Sarah Johnson',
    instructorCount: 5,
    totalStudents: 250,
    activeCourses: 12,
    avgPerformance: 4.7,
    subjects: ['Mathematics', 'Statistics', 'Calculus'],
    classes: ['Grade 9-A', 'Grade 10-A', 'Grade 11-A', 'Grade 12-A'],
    description: 'Department of Mathematics and Statistics',
  },
  {
    id: '2',
    name: 'Science',
    code: 'SCI',
    head: 'Prof. Michael Chen',
    instructorCount: 8,
    totalStudents: 380,
    activeCourses: 18,
    avgPerformance: 4.8,
    subjects: ['Physics', 'Chemistry', 'Biology'],
    classes: ['Grade 9-B', 'Grade 10-B', 'Grade 11-B', 'Grade 12-B'],
    description: 'Department of Physical and Natural Sciences',
  },
];

export function useInstructorData() {
  const [filters, setFilters] = useState<InstructorFilters>({
    search: '',
    department: 'all',
    subject: 'all',
    status: 'all',
    experience: 'all',
    qualification: 'all',
  });

  const filteredInstructors = useMemo(() => {
    return mockInstructors.filter((instructor) => {
      const matchesSearch =
        filters.search === '' ||
        instructor.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        instructor.employeeId
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        instructor.email.toLowerCase().includes(filters.search.toLowerCase());

      const matchesDepartment =
        filters.department === 'all' ||
        instructor.department === filters.department;
      const matchesSubject =
        filters.subject === 'all' ||
        instructor.subjects.includes(filters.subject);
      const matchesStatus =
        filters.status === 'all' || instructor.status === filters.status;

      const matchesExperience =
        filters.experience === 'all' ||
        (() => {
          const years = instructor.experience.years;
          switch (filters.experience) {
            case 'junior':
              return years < 5;
            case 'mid':
              return years >= 5 && years < 10;
            case 'senior':
              return years >= 10;
            default:
              return true;
          }
        })();

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesSubject &&
        matchesStatus &&
        matchesExperience
      );
    });
  }, [filters]);

  const stats = useMemo((): InstructorStats => {
    const totalInstructors = mockInstructors.length;
    const activeInstructors = mockInstructors.filter(
      (i) => i.status === 'Active'
    ).length;
    const onLeaveInstructors = mockInstructors.filter(
      (i) => i.status === 'On Leave'
    ).length;
    const averageExperience =
      mockInstructors.reduce((sum, i) => sum + i.experience.years, 0) /
      totalInstructors;

    const departmentDistribution = mockDepartments.map((dept) => ({
      department: dept.name,
      count: dept.instructorCount,
      percentage: (dept.instructorCount / totalInstructors) * 100,
    }));

    const subjectDistribution = [
      'Mathematics',
      'Physics',
      'Chemistry',
      'Biology',
      'English',
    ]
      .map((subject) => {
        const count = mockInstructors.filter((i) =>
          i.subjects.includes(subject)
        ).length;
        return {
          subject,
          count,
          percentage: (count / totalInstructors) * 100,
        };
      })
      .filter((item) => item.count > 0);

    const performanceDistribution = [
      { range: '4.5-5.0', min: 4.5, max: 5.0 },
      { range: '4.0-4.4', min: 4.0, max: 4.4 },
      { range: '3.5-3.9', min: 3.5, max: 3.9 },
      { range: 'Below 3.5', min: 0, max: 3.4 },
    ].map((range) => {
      const count = mockInstructors.filter(
        (i) =>
          i.performance.rating >= range.min && i.performance.rating <= range.max
      ).length;
      return {
        range: range.range,
        count,
        percentage: (count / totalInstructors) * 100,
      };
    });

    return {
      totalInstructors,
      activeInstructors,
      onLeaveInstructors,
      averageExperience,
      departmentDistribution,
      subjectDistribution,
      performanceDistribution,
    };
  }, []);

  const updateFilter = (key: keyof InstructorFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      department: 'all',
      subject: 'all',
      status: 'all',
      experience: 'all',
      qualification: 'all',
    });
  };

  return {
    instructors: filteredInstructors,
    allInstructors: mockInstructors,
    departments: mockDepartments,
    stats,
    filters,
    updateFilter,
    resetFilters,
    isLoading: false,
    error: null,
  };
}
