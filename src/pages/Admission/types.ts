export interface Application {
  id: string;
  applicationNumber: string;
  studentName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  program: string;
  department: string;
  academicYear: string;
  submissionDate: string;
  status:
    | 'submitted'
    | 'under_review'
    | 'interview_scheduled'
    | 'accepted'
    | 'rejected'
    | 'waitlisted';
  priority: 'high' | 'medium' | 'low';
  documents: Document[];
  scores: AcademicScore;
  interviewDate?: string;
  interviewScore?: number;
  notes?: string;
  reviewedBy?: string;
  decisionDate?: string;
}

export interface Document {
  id: string;
  name: string;
  type:
    | 'transcript'
    | 'essay'
    | 'recommendation'
    | 'certificate'
    | 'id_proof'
    | 'other';
  status: 'pending' | 'submitted' | 'verified' | 'rejected';
  uploadDate: string;
  fileSize: string;
  url: string;
}

export interface AcademicScore {
  gpa: number;
  satScore?: number;
  actScore?: number;
  toeflScore?: number;
  ieltsScore?: number;
  gmatScore?: number;
  greScore?: number;
}

export interface AdmissionProgram {
  id: string;
  name: string;
  department: string;
  degree: 'undergraduate' | 'graduate' | 'doctorate';
  duration: string;
  capacity: number;
  applicants: number;
  accepted: number;
  requirements: string[];
  deadline: string;
  tuitionFee: number;
  description: string;
}

export interface AdmissionStats {
  totalApplications: number;
  acceptedApplications: number;
  pendingReview: number;
  interviewsScheduled: number;
  acceptanceRate: number;
}
