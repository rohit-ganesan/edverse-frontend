import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  MapPin,
  Calendar,
  BookOpen,
  Activity,
  DollarSign,
} from 'lucide-react';
import { RadixButton } from 'components/ui/RadixButton';
import { StatusBadge } from 'components/ui/StatusBadge';
import type { Student } from '../types';

interface StudentCardProps {
  student: Student;
  onViewDetails: (studentId: number | string) => void;
  onEdit?: (studentId: number | string) => void;
  onContact?: (
    studentId: number | string,
    method: 'call' | 'email' | 'sms'
  ) => void;
}

export function StudentCard({
  student,
  onViewDetails,
  onEdit,
  onContact,
}: StudentCardProps): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't expand if clicking on buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    setIsExpanded(!isExpanded);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewDetails(student.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(student.id);
  };

  const handleContact = (
    e: React.MouseEvent,
    method: 'call' | 'email' | 'sms'
  ) => {
    e.stopPropagation();
    onContact?.(student.id, method);
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 95) return 'text-green-600';
    if (percentage >= 85) return 'text-blue-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600';
    if (grade.startsWith('B')) return 'text-blue-600';
    if (grade.startsWith('C')) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getFeeStatusColor = (pendingAmount: number) => {
    if (pendingAmount === 0) return 'text-green-600';
    if (pendingAmount < 1000) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-4 pl-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer relative"
      onClick={handleCardClick}
    >
      {/* Status indicator */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${
          student.status === 'Active'
            ? 'bg-green-500'
            : student.status === 'Inactive'
              ? 'bg-gray-400'
              : student.status === 'Transferred'
                ? 'bg-blue-500'
                : 'bg-red-500'
        }`}
      />

      {/* Header Section */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
            <span className="text-blue-600 font-semibold text-sm">
              {student.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </span>
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 line-clamp-1">
              {student.name}
            </h3>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-xs font-medium text-gray-600">
                Roll: {student.rollNumber}
              </span>
              <span className="text-xs text-gray-500">
                {student.class} - {student.section}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={student.status || 'Unknown'} />
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Quick Info Grid */}
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <span className="text-xs font-semibold text-gray-700">
            Attendance
          </span>
          <p
            className={`text-sm font-medium ${getAttendanceColor(student.attendance.percentage)}`}
          >
            {student.attendance.percentage}%
          </p>
        </div>
        <div>
          <span className="text-xs font-semibold text-gray-700">Grade</span>
          <p
            className={`text-sm font-medium ${getGradeColor(student.academicRecord.currentGrade)}`}
          >
            {student.academicRecord.currentGrade} (GPA:{' '}
            {student.academicRecord.gpa})
          </p>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="space-y-3 border-t border-gray-100 pt-3 animate-fade-in">
          {/* Personal Information */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-2">
              Personal Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">DOB:</span>
                <span className="text-gray-900">
                  {new Date(student.dateOfBirth).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Blood Group:</span>
                <span className="text-gray-900">{student.bloodGroup}</span>
              </div>
              <div className="flex items-center gap-2 md:col-span-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Address:</span>
                <span className="text-gray-900 line-clamp-1">
                  {student.address}
                </span>
              </div>
            </div>
          </div>

          {/* Parent Information */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-2">
              Parent Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Name:</span>
                <span className="text-gray-900 ml-2">{student.parentName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900">{student.parentPhone}</span>
              </div>
              <div className="flex items-center gap-2 md:col-span-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900">{student.parentEmail}</span>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-2">
              Academic Information
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Subjects:</span>
                <div className="flex flex-wrap gap-1">
                  {student.subjects.slice(0, 3).map((subject, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md"
                    >
                      {subject}
                    </span>
                  ))}
                  {student.subjects.length > 3 && (
                    <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-md">
                      +{student.subjects.length - 3} more
                    </span>
                  )}
                </div>
              </div>
              {student.extracurricularActivities.length > 0 && (
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Activities:</span>
                  <div className="flex flex-wrap gap-1">
                    {student.extracurricularActivities
                      .slice(0, 2)
                      .map((activity, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md"
                        >
                          {activity}
                        </span>
                      ))}
                    {student.extracurricularActivities.length > 2 && (
                      <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-md">
                        +{student.extracurricularActivities.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Fee Information */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-2">
              Fee Information
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Total:</span>
                <span className="text-gray-900 ml-2">
                  ${student.fees.totalAmount}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Paid:</span>
                <span className="text-green-600 ml-2">
                  ${student.fees.paidAmount}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Pending:</span>
                <span
                  className={`ml-2 ${getFeeStatusColor(student.fees.pendingAmount)}`}
                >
                  ${student.fees.pendingAmount}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-2">
            <RadixButton
              variant="solid"
              size="1"
              onClick={handleViewDetails}
              className="px-3 py-1.5"
            >
              View Details
            </RadixButton>
            {onEdit && (
              <RadixButton
                variant="outline"
                size="1"
                onClick={handleEdit}
                className="px-3 py-1.5"
              >
                Edit
              </RadixButton>
            )}
            {onContact && (
              <>
                <RadixButton
                  variant="ghost"
                  size="1"
                  onClick={(e) => handleContact(e, 'call')}
                  className="px-3 py-1.5"
                >
                  <Phone className="w-3 h-3" />
                  Call
                </RadixButton>
                <RadixButton
                  variant="ghost"
                  size="1"
                  onClick={(e) => handleContact(e, 'email')}
                  className="px-3 py-1.5"
                >
                  <Mail className="w-3 h-3" />
                  Email
                </RadixButton>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
