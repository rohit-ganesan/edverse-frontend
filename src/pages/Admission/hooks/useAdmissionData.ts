import { useMemo } from 'react';
import { Application, AdmissionProgram, AdmissionStats } from '../types';

const mockApplications: Application[] = [
  {
    id: '1',
    applicationNumber: 'APP2024001',
    studentName: 'Emily Chen',
    email: 'emily.chen@email.com',
    phone: '+1-555-0123',
    address: '123 Main St, City, State 12345',
    dateOfBirth: '2000-05-15',
    program: 'Bachelor of Science in Computer Science',
    department: 'Computer Science',
    academicYear: '2024-2025',
    submissionDate: '2024-01-10',
    status: 'under_review',
    priority: 'high',
    documents: [
      {
        id: '1',
        name: 'High School Transcript',
        type: 'transcript',
        status: 'verified',
        uploadDate: '2024-01-10',
        fileSize: '2.3 MB',
        url: '/documents/transcript.pdf',
      },
      {
        id: '2',
        name: 'Personal Statement',
        type: 'essay',
        status: 'submitted',
        uploadDate: '2024-01-10',
        fileSize: '1.1 MB',
        url: '/documents/essay.pdf',
      },
    ],
    scores: {
      gpa: 3.85,
      satScore: 1450,
      toeflScore: 105,
    },
    notes:
      'Strong academic background in STEM subjects. Excellent extracurricular activities.',
    reviewedBy: 'Dr. Sarah Johnson',
  },
  {
    id: '2',
    applicationNumber: 'APP2024002',
    studentName: 'Michael Rodriguez',
    email: 'michael.rodriguez@email.com',
    phone: '+1-555-0124',
    address: '456 Oak Ave, City, State 12345',
    dateOfBirth: '1999-12-03',
    program: 'Master of Business Administration',
    department: 'Business',
    academicYear: '2024-2025',
    submissionDate: '2024-01-08',
    status: 'interview_scheduled',
    priority: 'medium',
    documents: [
      {
        id: '3',
        name: 'Bachelor Degree Transcript',
        type: 'transcript',
        status: 'verified',
        uploadDate: '2024-01-08',
        fileSize: '1.8 MB',
        url: '/documents/transcript2.pdf',
      },
    ],
    scores: {
      gpa: 3.7,
      gmatScore: 680,
    },
    interviewDate: '2024-01-20',
    notes: 'Good work experience in finance sector.',
    reviewedBy: 'Prof. David Wilson',
  },
  {
    id: '3',
    applicationNumber: 'APP2024003',
    studentName: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1-555-0125',
    address: '789 Pine St, City, State 12345',
    dateOfBirth: '2001-03-22',
    program: 'Bachelor of Arts in Psychology',
    department: 'Psychology',
    academicYear: '2024-2025',
    submissionDate: '2024-01-12',
    status: 'accepted',
    priority: 'high',
    documents: [
      {
        id: '4',
        name: 'High School Transcript',
        type: 'transcript',
        status: 'verified',
        uploadDate: '2024-01-12',
        fileSize: '2.1 MB',
        url: '/documents/transcript3.pdf',
      },
    ],
    scores: {
      gpa: 3.95,
      satScore: 1520,
    },
    decisionDate: '2024-01-15',
    notes: 'Outstanding academic performance and leadership qualities.',
    reviewedBy: 'Dr. Lisa Thompson',
  },
];

const mockPrograms: AdmissionProgram[] = [
  {
    id: '1',
    name: 'Bachelor of Science in Computer Science',
    department: 'Computer Science',
    degree: 'undergraduate',
    duration: '4 years',
    capacity: 100,
    applicants: 245,
    accepted: 85,
    requirements: [
      'High School Diploma',
      'SAT/ACT Scores',
      'Personal Statement',
      'Letters of Recommendation',
    ],
    deadline: '2024-03-01',
    tuitionFee: 25000,
    description:
      'Comprehensive computer science program covering software development, algorithms, and emerging technologies.',
  },
  {
    id: '2',
    name: 'Master of Business Administration',
    department: 'Business',
    degree: 'graduate',
    duration: '2 years',
    capacity: 50,
    applicants: 156,
    accepted: 42,
    requirements: [
      'Bachelor Degree',
      'GMAT/GRE Scores',
      'Work Experience',
      'Essays',
      'Interview',
    ],
    deadline: '2024-02-15',
    tuitionFee: 45000,
    description:
      'Advanced business education focusing on leadership, strategy, and entrepreneurship.',
  },
];

export function useAdmissionData() {
  const stats = useMemo((): AdmissionStats => {
    const totalApplications = mockApplications.length;
    const acceptedApplications = mockApplications.filter(
      (a) => a.status === 'accepted'
    ).length;
    const pendingReview = mockApplications.filter(
      (a) => a.status === 'under_review'
    ).length;
    const interviewsScheduled = mockApplications.filter(
      (a) => a.status === 'interview_scheduled'
    ).length;
    const acceptanceRate =
      totalApplications > 0
        ? Math.round((acceptedApplications / totalApplications) * 100)
        : 0;

    return {
      totalApplications,
      acceptedApplications,
      pendingReview,
      interviewsScheduled,
      acceptanceRate,
    };
  }, []);

  return {
    applications: mockApplications,
    programs: mockPrograms,
    stats,
    isLoading: false,
    error: null,
  };
}
