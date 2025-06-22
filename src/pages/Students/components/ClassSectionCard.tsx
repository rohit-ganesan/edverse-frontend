import { Users, BookOpen, User } from 'lucide-react';
import { RadixButton } from 'components/ui/RadixButton';
import type { ClassSection } from '../types';

interface ClassSectionCardProps {
  classSection: ClassSection;
  onViewStudents?: (classId: string, section: string) => void;
  onMarkAttendance?: (classId: string, section: string) => void;
  onManageClass?: (classId: string) => void;
}

export function ClassSectionCard({
  classSection,
  onViewStudents,
  onMarkAttendance,
  onManageClass,
}: ClassSectionCardProps): JSX.Element {
  const handleViewStudents = () => {
    onViewStudents?.(classSection.id, classSection.section);
  };

  const handleMarkAttendance = () => {
    onMarkAttendance?.(classSection.id, classSection.section);
  };

  const handleManageClass = () => {
    onManageClass?.(classSection.id);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {classSection.className} - Section {classSection.section}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Class Teacher: {classSection.classTeacher}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-sm text-gray-600">Students</p>
            <p className="text-lg font-semibold text-gray-900">
              {classSection.strength}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-sm text-gray-600">Subjects</p>
            <p className="text-lg font-semibold text-gray-900">
              {classSection.subjects.length}
            </p>
          </div>
        </div>
      </div>

      {/* Subjects */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Subjects:</p>
        <div className="flex flex-wrap gap-1">
          {classSection.subjects.slice(0, 4).map((subject, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md"
            >
              {subject}
            </span>
          ))}
          {classSection.subjects.length > 4 && (
            <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-md">
              +{classSection.subjects.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {onViewStudents && (
          <RadixButton
            variant="solid"
            size="1"
            onClick={handleViewStudents}
            className="flex items-center gap-1"
          >
            <Users className="w-3 h-3" />
            View Students
          </RadixButton>
        )}
        {onMarkAttendance && (
          <RadixButton
            variant="outline"
            size="1"
            onClick={handleMarkAttendance}
            className="flex items-center gap-1"
          >
            <User className="w-3 h-3" />
            Mark Attendance
          </RadixButton>
        )}
        {onManageClass && (
          <RadixButton
            variant="ghost"
            size="1"
            onClick={handleManageClass}
            className="flex items-center gap-1"
          >
            Manage Class
          </RadixButton>
        )}
      </div>
    </div>
  );
}
