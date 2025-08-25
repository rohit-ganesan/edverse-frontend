export interface StudentResult {
  id: string;
  studentId: string;
  studentName: string;
  course: string;
  semester: string;
  year: string;
  subjects: Subject[];
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  grade: string;
  gpa: number;
  cgpa: number;
  status: 'pass' | 'fail' | 'pending' | 'published';
  publishedDate?: string;
  remarks?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  fullMarks: number;
  obtainedMarks: number;
  grade: string;
  gradePoints: number;
  status: 'pass' | 'fail';
  examType: 'theory' | 'practical' | 'both';
}

export interface ResultAnalytics {
  totalStudents: number;
  passedStudents: number;
  failedStudents: number;
  passPercentage: number;
  averageGPA: number;
  topPerformers: StudentResult[];
  subjectWiseAnalysis: SubjectAnalysis[];
}

export interface SubjectAnalysis {
  subjectName: string;
  subjectCode: string;
  averageMarks: number;
  passRate: number;
  highestMarks: number;
  lowestMarks: number;
}

export interface ResultFilters {
  searchTerm: string;
  selectedSemester: string;
  selectedStatus: string;
}
