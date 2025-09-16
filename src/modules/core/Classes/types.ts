export interface ClassSection {
  id: string;
  className: string;
  section: string;
  strength: number;
  classTeacher: string;
  subjects: string[];
}

export interface Class {
  id: string;
  name: string;
  subject: string;
  grade: string;
  section: string;
  instructor: string;
  schedule: string;
  students: number;
  isActive: boolean;
}

export interface ClassFilters {
  search: string;
  grade: string;
  section: string;
  subject: string;
  status: string;
}

export interface ClassStats {
  totalClasses: number;
  todayClasses: number;
  totalSubjects: number;
  avgDuration: number;
  totalStudents: number;
}
