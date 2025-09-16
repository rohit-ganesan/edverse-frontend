import { useNavigate } from 'react-router-dom';
import { Users, Award, Calendar, BookOpen, Star } from 'lucide-react';
import type { Instructor } from '../types';

export function useInstructorManagement() {
  const navigate = useNavigate();

  // Navigation handlers
  const handleViewInstructor = (instructor: Instructor) => {
    // Convert Instructor type to the format expected by ViewInstructorPage
    const instructorData = {
      id: instructor.id,
      name: instructor.name,
      email: instructor.email,
      phone: instructor.phone,
      subject: instructor.subjects.join(', '), // Join multiple subjects
      experience: `${instructor.experience.years} years`,
      status: instructor.status,
      address: instructor.address,
      qualification: instructor.qualification,
      joiningDate: instructor.dateOfJoining,
      employeeId: instructor.employeeId,
    };

    navigate('/teachers/view-teacher', {
      state: { instructorData },
    });
  };

  const handleAddInstructor = () => {
    navigate('/teachers/add-teacher');
  };

  // Export functionality
  const handleExportInstructors = (
    instructors: Instructor[],
    format: 'csv' | 'pdf' = 'csv'
  ) => {
    try {
      if (format === 'csv') {
        const headers = [
          'Employee ID',
          'Name',
          'Department',
          'Subjects',
          'Experience',
          'Email',
          'Phone',
          'Status',
        ];

        const csvContent = [
          headers.join(','),
          ...instructors.map((instructor) =>
            [
              `"${instructor.employeeId}"`,
              `"${instructor.name}"`,
              `"${instructor.department}"`,
              `"${instructor.subjects.join('; ')}"`,
              `"${instructor.experience.years} years"`,
              `"${instructor.email}"`,
              `"${instructor.phone}"`,
              `"${instructor.status}"`,
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
          `instructors-${new Date().toISOString().split('T')[0]}.csv`
        );
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      console.log(`Instructors exported as ${format}`);
    } catch (error) {
      console.error('Error exporting instructors:', error);
    }
  };

  // Communication
  const handleContactInstructor = (
    instructorId: number | string,
    method: 'call' | 'email'
  ) => {
    console.log(`Contacting instructor ${instructorId} via ${method}`);
  };

  // Performance management
  const handleViewPerformance = (instructorId: number | string) => {
    navigate(`/instructors/${instructorId}/performance`);
  };

  const handleScheduleReview = (instructorId: number | string) => {
    console.log('Scheduling performance review for instructor:', instructorId);
  };

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'text-green-600';
      case 'on leave':
        return 'text-yellow-600';
      case 'inactive':
        return 'text-gray-600';
      case 'retired':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getPerformanceColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getExperienceLevel = (years: number) => {
    if (years < 5) return 'Junior';
    if (years < 10) return 'Mid-level';
    return 'Senior';
  };

  const formatExperience = (experience: {
    years: number;
    previousInstitutions?: string[];
  }) => {
    const level = getExperienceLevel(experience.years);
    return `${experience.years} years (${level})`;
  };

  const formatSalary = (salary: {
    basic: number;
    allowances: number;
    total: number;
  }) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(salary.total);
  };

  // Stats icons
  const getStatsIcon = (type: string) => {
    switch (type) {
      case 'total':
        return Users;
      case 'active':
        return Users;
      case 'leave':
        return Calendar;
      case 'experience':
        return Award;
      case 'performance':
        return Star;
      case 'subjects':
        return BookOpen;
      default:
        return Users;
    }
  };

  return {
    // Navigation
    handleViewInstructor,
    handleViewDetails: handleViewInstructor, // Alias for consistency
    handleAddInstructor,

    // Export & Operations
    handleExportInstructors,
    handleExport: handleExportInstructors, // Alias for consistency
    handleContactInstructor,

    // Performance
    handleViewPerformance,
    handleScheduleReview,

    // Utilities
    getStatusColor,
    getPerformanceColor,
    getExperienceLevel,
    formatExperience,
    formatSalary,
    getStatsIcon,
  };
}
