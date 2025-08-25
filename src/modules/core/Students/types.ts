import { BasePerson } from 'components/ui/PersonTable';

export interface Student extends BasePerson {
  rollNumber: string;
  class: string;
  section: string;
  dateOfBirth: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  address: string;
  admissionDate: string;
  bloodGroup: string;
  attendance: {
    percentage: number;
    totalDays: number;
    presentDays: number;
    absentDays: number;
  };
  academicRecord: {
    currentGrade: string;
    previousGrade?: string;
    gpa: number;
  };
  subjects: string[];
  extracurricularActivities: string[];
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  medicalInfo?: {
    allergies?: string[];
    medications?: string[];
    conditions?: string[];
  };
  fees: {
    totalAmount: number;
    paidAmount: number;
    pendingAmount: number;
    lastPaymentDate?: string;
  };
}

export interface StudentFilters {
  search: string;
  class: string;
  section: string;
  status: string;
  attendanceRange: string;
  gradeRange: string;
}

export interface StudentStats {
  totalStudents: number;
  activeStudents: number;
  averageAttendance: number;
  totalClasses: number;
  gradeDistribution: {
    grade: string;
    count: number;
    percentage: number;
  }[];
  attendanceDistribution: {
    range: string;
    count: number;
    percentage: number;
  }[];
}

export interface ClassSection {
  id: string;
  className: string;
  section: string;
  strength: number;
  classTeacher: string;
  subjects: string[];
}
