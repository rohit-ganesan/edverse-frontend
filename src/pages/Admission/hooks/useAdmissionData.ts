import { useMemo } from 'react';
import {
  Application,
  AdmissionProgram,
  AdmissionStats,
  AdmissionDashboardData,
  UrgentAction,
  Deadline,
  PerformanceMetric,
} from '../types';

const mockApplications: Application[] = [
  {
    id: '1',
    applicationNumber: 'ADM2024001',
    studentName: 'Sarah Chen',
    email: 'sarah.chen@email.com',
    phone: '+1-555-0123',
    dateOfBirth: '2000-05-15',
    address: '123 Oak Street, Springfield, IL 62701',
    emergencyContact: {
      name: 'David Chen',
      relationship: 'Father',
      phone: '+1-555-0124',
    },
    program: 'Bachelor of Science in Computer Science',
    department: 'Computer Science',
    academicYear: '2024-2025',
    submissionDate: '2024-01-15T10:30:00Z',
    lastUpdated: '2024-01-20T14:15:00Z',
    status: 'under_review',
    priority: 'high',
    documents: [
      {
        id: 'd1',
        name: 'High School Transcript',
        type: 'transcript',
        status: 'verified',
        uploadDate: '2024-01-15T10:30:00Z',
        verificationDate: '2024-01-18T09:00:00Z',
        fileSize: '2.3 MB',
        url: '/documents/transcript_001.pdf',
        isRequired: true,
      },
      {
        id: 'd2',
        name: 'Personal Statement',
        type: 'personal_statement',
        status: 'verified',
        uploadDate: '2024-01-15T10:35:00Z',
        verificationDate: '2024-01-18T09:05:00Z',
        fileSize: '1.1 MB',
        url: '/documents/statement_001.pdf',
        isRequired: true,
      },
      {
        id: 'd3',
        name: 'Recommendation Letter - Math Teacher',
        type: 'recommendation_letter',
        status: 'pending',
        uploadDate: '2024-01-16T14:20:00Z',
        fileSize: '0.8 MB',
        url: '/documents/rec_001.pdf',
        isRequired: true,
      },
    ],
    academicRecords: {
      previousInstitution: 'Springfield High School',
      graduationYear: 2024,
      gpa: 3.85,
      maxGpa: 4.0,
      rank: 15,
      totalStudents: 245,
      subjects: [
        { subject: 'Mathematics', grade: 'A', credits: 4 },
        { subject: 'Physics', grade: 'A-', credits: 4 },
        { subject: 'Chemistry', grade: 'B+', credits: 4 },
        { subject: 'English', grade: 'A', credits: 3 },
      ],
    },
    testScores: [
      {
        testType: 'SAT',
        score: 1450,
        maxScore: 1600,
        testDate: '2023-12-02',
        validUntil: '2026-12-02',
      },
    ],
    personalStatement:
      'I am passionate about computer science and artificial intelligence...',
    reviewNotes: [
      {
        id: 'r1',
        reviewerId: 'rev001',
        reviewerName: 'Dr. Sarah Johnson',
        date: '2024-01-20T14:15:00Z',
        note: 'Strong academic background in STEM subjects. Excellent extracurricular activities in robotics club.',
        rating: 8,
        category: 'academic',
      },
    ],
    admissionOfficer: 'Dr. Sarah Johnson',
  },
  {
    id: '2',
    applicationNumber: 'ADM2024002',
    studentName: 'Michael Rodriguez',
    email: 'michael.rodriguez@email.com',
    phone: '+1-555-0125',
    dateOfBirth: '1999-12-03',
    address: '456 Pine Avenue, Chicago, IL 60601',
    emergencyContact: {
      name: 'Maria Rodriguez',
      relationship: 'Mother',
      phone: '+1-555-0126',
    },
    program: 'Master of Business Administration',
    department: 'Business Administration',
    academicYear: '2024-2025',
    submissionDate: '2024-01-10T16:45:00Z',
    lastUpdated: '2024-01-22T11:30:00Z',
    status: 'interview_scheduled',
    priority: 'medium',
    documents: [
      {
        id: 'd4',
        name: 'Bachelor Degree Transcript',
        type: 'transcript',
        status: 'verified',
        uploadDate: '2024-01-10T16:45:00Z',
        verificationDate: '2024-01-12T10:00:00Z',
        fileSize: '1.8 MB',
        url: '/documents/transcript_002.pdf',
        isRequired: true,
      },
      {
        id: 'd5',
        name: 'Work Experience Certificate',
        type: 'other',
        status: 'verified',
        uploadDate: '2024-01-11T09:15:00Z',
        verificationDate: '2024-01-13T14:30:00Z',
        fileSize: '0.9 MB',
        url: '/documents/work_exp_002.pdf',
        isRequired: true,
      },
    ],
    academicRecords: {
      previousInstitution: 'University of Illinois',
      graduationYear: 2022,
      gpa: 3.7,
      maxGpa: 4.0,
      subjects: [
        { subject: 'Business Administration', grade: 'A-', credits: 3 },
        { subject: 'Economics', grade: 'B+', credits: 3 },
        { subject: 'Statistics', grade: 'A', credits: 3 },
      ],
    },
    testScores: [
      {
        testType: 'GMAT',
        score: 680,
        maxScore: 800,
        testDate: '2023-11-15',
        validUntil: '2028-11-15',
      },
    ],
    personalStatement:
      'With 2 years of experience in finance, I aim to enhance my leadership skills...',
    interviewDetails: {
      scheduledDate: '2024-01-25',
      scheduledTime: '14:00',
      interviewer: 'Prof. David Wilson',
      mode: 'video',
      meetingLink: 'https://zoom.us/j/123456789',
      status: 'scheduled',
    },
    reviewNotes: [
      {
        id: 'r2',
        reviewerId: 'rev002',
        reviewerName: 'Prof. David Wilson',
        date: '2024-01-22T11:30:00Z',
        note: 'Good work experience in finance sector. Strong motivation for MBA.',
        rating: 7,
        category: 'general',
      },
    ],
    admissionOfficer: 'Prof. David Wilson',
  },
  {
    id: '3',
    applicationNumber: 'ADM2024003',
    studentName: 'Emily Johnson',
    email: 'emily.johnson@email.com',
    phone: '+1-555-0127',
    dateOfBirth: '2001-03-22',
    address: '789 Maple Drive, Boston, MA 02101',
    emergencyContact: {
      name: 'Robert Johnson',
      relationship: 'Father',
      phone: '+1-555-0128',
    },
    program: 'Bachelor of Arts in Psychology',
    department: 'Psychology',
    academicYear: '2024-2025',
    submissionDate: '2024-01-12T08:20:00Z',
    lastUpdated: '2024-01-23T16:45:00Z',
    status: 'accepted',
    priority: 'high',
    documents: [
      {
        id: 'd6',
        name: 'High School Transcript',
        type: 'transcript',
        status: 'verified',
        uploadDate: '2024-01-12T08:20:00Z',
        verificationDate: '2024-01-15T11:00:00Z',
        fileSize: '2.1 MB',
        url: '/documents/transcript_003.pdf',
        isRequired: true,
      },
    ],
    academicRecords: {
      previousInstitution: 'Boston Latin School',
      graduationYear: 2024,
      gpa: 3.95,
      maxGpa: 4.0,
      rank: 5,
      totalStudents: 180,
      subjects: [
        { subject: 'Psychology', grade: 'A', credits: 3 },
        { subject: 'Biology', grade: 'A', credits: 4 },
        { subject: 'English Literature', grade: 'A', credits: 3 },
      ],
    },
    testScores: [
      {
        testType: 'SAT',
        score: 1520,
        maxScore: 1600,
        testDate: '2023-10-07',
        validUntil: '2026-10-07',
      },
    ],
    personalStatement:
      'My interest in human behavior and mental health drives my passion for psychology...',
    reviewNotes: [
      {
        id: 'r3',
        reviewerId: 'rev003',
        reviewerName: 'Dr. Lisa Thompson',
        date: '2024-01-23T16:45:00Z',
        note: 'Outstanding academic performance and leadership qualities. Strong fit for our psychology program.',
        rating: 9,
        category: 'academic',
      },
    ],
    admissionOfficer: 'Dr. Lisa Thompson',
    decisionDate: '2024-01-23T16:45:00Z',
    enrollmentDeadline: '2024-05-01T23:59:59Z',
  },
];

const mockPrograms: AdmissionProgram[] = [
  {
    id: '1',
    name: 'Bachelor of Science in Computer Science',
    department: 'Computer Science',
    degree: 'undergraduate',
    duration: '4 years',
    totalSeats: 100,
    availableSeats: 15,
    applicationsReceived: 245,
    acceptedCount: 85,
    waitlistedCount: 25,
    requirements: [
      {
        type: 'test_score',
        description: 'SAT score minimum 1200 or ACT score minimum 26',
        isRequired: true,
        minimumScore: 1200,
      },
      {
        type: 'academic',
        description: 'High school GPA minimum 3.5',
        isRequired: true,
      },
      {
        type: 'document',
        description: 'Personal statement (500-1000 words)',
        isRequired: true,
      },
      {
        type: 'document',
        description: 'Two letters of recommendation',
        isRequired: true,
      },
    ],
    applicationDeadline: '2024-03-01T23:59:59Z',
    enrollmentDeadline: '2024-05-01T23:59:59Z',
    tuitionFee: 25000,
    scholarshipAvailable: true,
    description:
      'Comprehensive computer science program covering software development, algorithms, data structures, and emerging technologies including AI and machine learning.',
    eligibilityCriteria: [
      'High school diploma or equivalent',
      'Strong mathematics background',
      'English proficiency (for international students)',
    ],
    careerProspects: [
      'Software Engineer',
      'Data Scientist',
      'Cybersecurity Specialist',
      'AI/ML Engineer',
      'Product Manager',
    ],
    isActive: true,
  },
  {
    id: '2',
    name: 'Master of Business Administration',
    department: 'Business Administration',
    degree: 'graduate',
    duration: '2 years',
    totalSeats: 50,
    availableSeats: 8,
    applicationsReceived: 156,
    acceptedCount: 42,
    waitlistedCount: 12,
    requirements: [
      {
        type: 'test_score',
        description: 'GMAT score minimum 650 or GRE equivalent',
        isRequired: true,
        minimumScore: 650,
      },
      {
        type: 'academic',
        description: 'Bachelor degree with minimum 3.0 GPA',
        isRequired: true,
      },
      {
        type: 'other',
        description: 'Minimum 2 years work experience',
        isRequired: true,
      },
      {
        type: 'document',
        description: 'Statement of purpose',
        isRequired: true,
      },
    ],
    applicationDeadline: '2024-02-15T23:59:59Z',
    enrollmentDeadline: '2024-06-01T23:59:59Z',
    tuitionFee: 45000,
    scholarshipAvailable: true,
    description:
      'Advanced business education focusing on leadership, strategy, entrepreneurship, and global business practices.',
    eligibilityCriteria: [
      'Bachelor degree from accredited institution',
      'Professional work experience',
      'Leadership potential demonstration',
    ],
    careerProspects: [
      'Management Consultant',
      'Investment Banking',
      'Product Manager',
      'Entrepreneur',
      'Corporate Strategy',
    ],
    isActive: true,
  },
];

const mockUrgentActions: UrgentAction[] = [
  {
    id: 'ua1',
    type: 'document_verification',
    applicationId: '1',
    studentName: 'Sarah Chen',
    description: 'Recommendation letter pending verification',
    dueDate: '2024-01-25T17:00:00Z',
    priority: 'high',
  },
  {
    id: 'ua2',
    type: 'interview_scheduling',
    applicationId: '4',
    studentName: 'Alex Kim',
    description: 'Interview needs to be scheduled within 3 days',
    dueDate: '2024-01-26T23:59:59Z',
    priority: 'medium',
  },
  {
    id: 'ua3',
    type: 'decision_pending',
    applicationId: '5',
    studentName: 'Maria Garcia',
    description: 'Application review completed, decision pending',
    dueDate: '2024-01-24T17:00:00Z',
    priority: 'high',
  },
];

const mockDeadlines: Deadline[] = [
  {
    id: 'dl1',
    title: 'MBA Application Deadline',
    date: '2024-02-15T23:59:59Z',
    type: 'application',
    programId: '2',
    description: 'Final deadline for MBA program applications',
    daysRemaining: 22,
  },
  {
    id: 'dl2',
    title: 'Computer Science Enrollment Deadline',
    date: '2024-05-01T23:59:59Z',
    type: 'enrollment',
    programId: '1',
    description: 'Accepted students must confirm enrollment',
    daysRemaining: 97,
  },
  {
    id: 'dl3',
    title: 'Document Submission Deadline',
    date: '2024-01-30T23:59:59Z',
    type: 'document',
    description: 'All supporting documents must be submitted',
    daysRemaining: 7,
  },
];

const mockPerformanceMetrics: PerformanceMetric[] = [
  {
    label: 'Average Review Time',
    value: 5.2,
    unit: 'days',
    trend: 'down',
    trendPercentage: 12,
  },
  {
    label: 'Document Verification Rate',
    value: 94,
    unit: '%',
    trend: 'up',
    trendPercentage: 3,
  },
  {
    label: 'Interview Completion Rate',
    value: 87,
    unit: '%',
    trend: 'stable',
    trendPercentage: 0,
  },
];

export function useAdmissionData() {
  const stats = useMemo((): AdmissionStats => {
    const totalApplications = mockApplications.length;
    const acceptedApplications = mockApplications.filter(
      (a) => a.status === 'accepted'
    ).length;
    const rejectedApplications = mockApplications.filter(
      (a) => a.status === 'rejected'
    ).length;
    const waitlistedApplications = mockApplications.filter(
      (a) => a.status === 'waitlisted'
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
      newApplicationsToday: 5,
      pendingReview,
      interviewsScheduled,
      acceptedApplications,
      rejectedApplications,
      waitlistedApplications,
      acceptanceRate,
      averageProcessingTime: 5.2,
      documentsVerificationPending: 12,
      upcomingInterviews: 8,
    };
  }, []);

  const dashboardData = useMemo(
    (): AdmissionDashboardData => ({
      recentApplications: mockApplications.slice(0, 5),
      urgentActions: mockUrgentActions,
      upcomingDeadlines: mockDeadlines,
      performanceMetrics: mockPerformanceMetrics,
    }),
    []
  );

  return {
    applications: mockApplications,
    programs: mockPrograms,
    stats,
    dashboardData,
    isLoading: false,
    error: null,
  };
}
