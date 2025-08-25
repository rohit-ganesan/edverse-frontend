import { Users, BookOpen, Award, TrendingUp } from 'lucide-react';
import { ModernCard } from 'components/ui/ModernCard';
import type { Department } from '../types';

interface DepartmentCardProps {
  department: Department;
  onClick?: (departmentId: string) => void;
}

export function DepartmentCard({
  department,
  onClick,
}: DepartmentCardProps): JSX.Element {
  const handleClick = () => {
    onClick?.(department.id);
  };

  const getPerformanceColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <ModernCard
      className="p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {department.name}
            </h3>
            <p className="text-sm text-gray-600">{department.code}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {department.instructorCount}
          </div>
          <div className="text-xs text-gray-500">Instructors</div>
        </div>
      </div>

      <div className="space-y-3">
        {/* Department Head */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Department Head</span>
          <span className="text-sm font-medium text-gray-900">
            {department.head}
          </span>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500">Total Students</span>
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {department.totalStudents}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <BookOpen className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500">Active Courses</span>
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {department.activeCourses}
            </div>
          </div>
        </div>

        {/* Performance Rating */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">Avg. Performance</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span
              className={`text-sm font-medium ${getPerformanceColor(department.avgPerformance)}`}
            >
              {department.avgPerformance.toFixed(1)}/5.0
            </span>
          </div>
        </div>

        {/* Subjects */}
        <div className="pt-2">
          <div className="text-xs text-gray-500 mb-2">Key Subjects</div>
          <div className="flex flex-wrap gap-1">
            {department.subjects.slice(0, 3).map((subject, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-md"
              >
                {subject}
              </span>
            ))}
            {department.subjects.length > 3 && (
              <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-md">
                +{department.subjects.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>
    </ModernCard>
  );
}
