export interface Application {
  id: string;
  applicationNumber: string;
  studentName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  program: string;
  department: string;
  academicYear: string;
  submissionDate: string;
  lastUpdated: string;
  status:
    | 'draft'
    | 'submitted'
    | 'under_review'
    | 'interview_scheduled'
    | 'accepted'
    | 'rejected'
    | 'waitlisted'
    | 'withdrawn';
  priority: 'high' | 'medium' | 'low';
  documents: ApplicationDocument[];
  academicRecords: AcademicRecord;
  testScores: TestScore[];
  personalStatement: string;
  interviewDetails?: InterviewDetails;
  reviewNotes: ReviewNote[];
  admissionOfficer?: string;
  decisionDate?: string;
  decisionReason?: string;
  enrollmentDeadline?: string;
}

export interface ApplicationDocument {
  id: string;
  name: string;
  type:
    | 'transcript'
    | 'diploma'
    | 'recommendation_letter'
    | 'personal_statement'
    | 'portfolio'
    | 'id_document'
    | 'passport'
    | 'other';
  status: 'pending' | 'submitted' | 'verified' | 'rejected' | 'missing';
  uploadDate?: string;
  verificationDate?: string;
  fileSize?: string;
  url?: string;
  notes?: string;
  isRequired: boolean;
}

export interface AcademicRecord {
  previousInstitution: string;
  graduationYear: number;
  gpa: number;
  maxGpa: number;
  rank?: number;
  totalStudents?: number;
  subjects: SubjectGrade[];
}

export interface SubjectGrade {
  subject: string;
  grade: string;
  credits: number;
}

export interface TestScore {
  testType: 'SAT' | 'ACT' | 'TOEFL' | 'IELTS' | 'GRE' | 'GMAT' | 'other';
  score: number;
  maxScore: number;
  testDate: string;
  validUntil: string;
}

export interface InterviewDetails {
  scheduledDate: string;
  scheduledTime: string;
  interviewer: string;
  mode: 'in_person' | 'video' | 'phone';
  location?: string;
  meetingLink?: string;
  status: 'scheduled' | 'completed' | 'rescheduled' | 'cancelled';
  score?: number;
  feedback?: string;
  duration?: number;
}

export interface ReviewNote {
  id: string;
  reviewerId: string;
  reviewerName: string;
  date: string;
  note: string;
  rating?: number;
  category: 'academic' | 'personal' | 'interview' | 'documents' | 'general';
}

export interface AdmissionProgram {
  id: string;
  name: string;
  department: string;
  degree: 'undergraduate' | 'graduate' | 'doctorate' | 'certificate';
  duration: string;
  totalSeats: number;
  availableSeats: number;
  applicationsReceived: number;
  acceptedCount: number;
  waitlistedCount: number;
  requirements: ProgramRequirement[];
  applicationDeadline: string;
  enrollmentDeadline: string;
  tuitionFee: number;
  scholarshipAvailable: boolean;
  description: string;
  eligibilityCriteria: string[];
  careerProspects: string[];
  isActive: boolean;
}

export interface ProgramRequirement {
  type: 'document' | 'test_score' | 'academic' | 'other';
  description: string;
  isRequired: boolean;
  minimumScore?: number;
}

export interface AdmissionStats {
  totalApplications: number;
  newApplicationsToday: number;
  pendingReview: number;
  interviewsScheduled: number;
  acceptedApplications: number;
  rejectedApplications: number;
  waitlistedApplications: number;
  acceptanceRate: number;
  averageProcessingTime: number; // in days
  documentsVerificationPending: number;
  upcomingInterviews: number;
}

export interface AdmissionDashboardData {
  recentApplications: Application[];
  urgentActions: UrgentAction[];
  upcomingDeadlines: Deadline[];
  performanceMetrics: PerformanceMetric[];
}

export interface UrgentAction {
  id: string;
  type:
    | 'document_verification'
    | 'interview_scheduling'
    | 'decision_pending'
    | 'deadline_approaching';
  applicationId: string;
  studentName: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
}

export interface Deadline {
  id: string;
  title: string;
  date: string;
  type: 'application' | 'document' | 'interview' | 'enrollment' | 'fee_payment';
  programId?: string;
  description: string;
  daysRemaining: number;
}

export interface PerformanceMetric {
  label: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
}
