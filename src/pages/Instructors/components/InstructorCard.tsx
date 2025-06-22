import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  MapPin,
  Calendar,
  BookOpen,
  Award,
  Star,
  Users,
} from 'lucide-react';
import { RadixButton } from 'components/ui/RadixButton';
import { StatusBadge } from 'components/ui/StatusBadge';
import type { Instructor } from '../types';

interface InstructorCardProps {
  instructor: Instructor;
  onViewDetails: (instructorId: number | string) => void;
  onEdit?: (instructorId: number | string) => void;
  onContact?: (instructorId: number | string, method: 'call' | 'email') => void;
  onScheduleReview?: (instructorId: number | string) => void;
}

export function InstructorCard({
  instructor,
  onViewDetails,
  onEdit,
  onContact,
  onScheduleReview,
}: InstructorCardProps): JSX.Element {
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
    onViewDetails(instructor.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(instructor.id);
  };

  const handleContact = (e: React.MouseEvent, method: 'call' | 'email') => {
    e.stopPropagation();
    onContact?.(instructor.id, method);
  };

  const handleScheduleReview = (e: React.MouseEvent) => {
    e.stopPropagation();
    onScheduleReview?.(instructor.id);
  };

  const getPerformanceColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getExperienceLevel = (years: number) => {
    if (years < 5) return { level: 'Junior', color: 'text-blue-600' };
    if (years < 10) return { level: 'Mid-level', color: 'text-purple-600' };
    return { level: 'Senior', color: 'text-green-600' };
  };

  const experienceInfo = getExperienceLevel(instructor.experience.years);

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-4 pl-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer relative"
      onClick={handleCardClick}
    >
      {/* Status indicator */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${
          instructor.status === 'Active'
            ? 'bg-green-500'
            : instructor.status === 'On Leave'
              ? 'bg-yellow-500'
              : instructor.status === 'Inactive'
                ? 'bg-gray-400'
                : 'bg-red-500'
        }`}
      />

      {/* Header Section */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center">
            <span className="text-purple-600 font-semibold text-sm">
              {instructor.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </span>
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 line-clamp-1">
              {instructor.name}
            </h3>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-xs font-medium text-gray-600">
                ID: {instructor.employeeId}
              </span>
              <span className="text-xs text-gray-500">
                {instructor.designation}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={instructor.status || 'Unknown'} />
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
            Department
          </span>
          <p className="text-sm font-medium text-gray-900">
            {instructor.department}
          </p>
        </div>
        <div>
          <span className="text-xs font-semibold text-gray-700">
            Experience
          </span>
          <p className={`text-sm font-medium ${experienceInfo.color}`}>
            {instructor.experience.years} years ({experienceInfo.level})
          </p>
        </div>
      </div>

      {/* Performance Rating */}
      <div className="mb-3">
        <span className="text-xs font-semibold text-gray-700">
          Performance Rating
        </span>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3 h-3 ${
                  star <= instructor.performance.rating
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span
            className={`text-sm font-medium ${getPerformanceColor(instructor.performance.rating)}`}
          >
            {instructor.performance.rating.toFixed(1)}/5.0
          </span>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="space-y-3 border-t border-gray-100 pt-3 animate-fade-in">
          {/* Contact Information */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-2">
              Contact Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900 line-clamp-1">
                  {instructor.email}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900">{instructor.phone}</span>
              </div>
              <div className="flex items-center gap-2 md:col-span-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900 line-clamp-1">
                  {instructor.address}
                </span>
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
                <Award className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Qualification:</span>
                <span className="text-gray-900">
                  {instructor.qualification}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Subjects:</span>
                <div className="flex flex-wrap gap-1">
                  {instructor.subjects.slice(0, 3).map((subject, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-md"
                    >
                      {subject}
                    </span>
                  ))}
                  {instructor.subjects.length > 3 && (
                    <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-md">
                      +{instructor.subjects.length - 3} more
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Classes:</span>
                <div className="flex flex-wrap gap-1">
                  {instructor.classes.slice(0, 2).map((classItem, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md"
                    >
                      {classItem}
                    </span>
                  ))}
                  {instructor.classes.length > 2 && (
                    <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-md">
                      +{instructor.classes.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Employment Details */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-2">
              Employment Details
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Joined:</span>
                <span className="text-gray-900 ml-2">
                  {new Date(instructor.dateOfJoining).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Salary:</span>
                <span className="text-gray-900 ml-2">
                  ${instructor.salary.total.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Attendance:</span>
                <span className="text-green-600 ml-2">
                  {instructor.performance.attendanceRate}%
                </span>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-2">
              Performance Metrics
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Student Feedback:</span>
                <span
                  className={`ml-2 ${getPerformanceColor(instructor.performance.studentFeedback)}`}
                >
                  {instructor.performance.studentFeedback.toFixed(1)}/5.0
                </span>
              </div>
              <div>
                <span className="text-gray-600">Classes Taught:</span>
                <span className="text-gray-900 ml-2">
                  {instructor.performance.classesTaught}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Overall Rating:</span>
                <span
                  className={`ml-2 ${getPerformanceColor(instructor.performance.rating)}`}
                >
                  {instructor.performance.rating.toFixed(1)}/5.0
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
            {onScheduleReview && (
              <RadixButton
                variant="ghost"
                size="1"
                onClick={handleScheduleReview}
                className="px-3 py-1.5"
              >
                <Calendar className="w-3 h-3" />
                Schedule Review
              </RadixButton>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
