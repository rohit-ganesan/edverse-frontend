import { BasePerson } from 'components/ui/PersonTable';

export interface Instructor extends BasePerson {
  employeeId: string;
  subjects: string[];
  classes: string[];
  email: string;
  phone: string;
  address: string;
  dateOfJoining: string;
  qualification: string;
  experience: {
    years: number;
    previousInstitutions?: string[];
  };
  department: string;
  designation: string;
  salary: {
    basic: number;
    allowances: number;
    total: number;
  };
  schedule: {
    workingDays: string[];
    workingHours: {
      start: string;
      end: string;
    };
  };
  performance: {
    rating: number;
    studentFeedback: number;
    classesTaught: number;
    attendanceRate: number;
  };
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  documents: {
    resume?: string;
    certificates?: string[];
    idProof?: string;
  };
}

export interface InstructorFilters {
  search: string;
  department: string;
  subject: string;
  status: string;
  experience: string;
  qualification: string;
}

export interface InstructorStats {
  totalInstructors: number;
  activeInstructors: number;
  onLeaveInstructors: number;
  averageExperience: number;
  departmentDistribution: {
    department: string;
    count: number;
    percentage: number;
  }[];
  subjectDistribution: {
    subject: string;
    count: number;
    percentage: number;
  }[];
  performanceDistribution: {
    range: string;
    count: number;
    percentage: number;
  }[];
}

export interface Department {
  id: string;
  name: string;
  code: string;
  head: string;
  instructorCount: number;
  totalStudents: number;
  activeCourses: number;
  avgPerformance: number;
  subjects: string[];
  classes: string[];
  description?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  department: string;
  instructors: string[];
  classes: string[];
  creditHours: number;
}
