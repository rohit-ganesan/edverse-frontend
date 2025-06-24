import React from 'react';
import {
  Eye,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { Application } from '../types';

interface ApplicationCardProps {
  application: Application;
  onView?: (application: Application) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'accepted':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'rejected':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'under_review':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'interview_scheduled':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'waitlisted':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'submitted':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'draft':
      return 'bg-gray-100 text-gray-600 border-gray-200';
    case 'withdrawn':
      return 'bg-gray-100 text-gray-600 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'accepted':
      return <CheckCircle className="h-4 w-4" />;
    case 'rejected':
      return <XCircle className="h-4 w-4" />;
    case 'under_review':
      return <Clock className="h-4 w-4" />;
    case 'interview_scheduled':
      return <Calendar className="h-4 w-4" />;
    case 'waitlisted':
      return <AlertTriangle className="h-4 w-4" />;
    case 'submitted':
      return <FileText className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'border-l-red-500';
    case 'medium':
      return 'border-l-yellow-500';
    case 'low':
      return 'border-l-green-500';
    default:
      return 'border-l-gray-300';
  }
};

export function ApplicationCard({
  application,
  onView,
}: ApplicationCardProps): JSX.Element {
  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getDocumentStatus = () => {
    const totalDocs = application.documents.length;
    const verifiedDocs = application.documents.filter(
      (doc) => doc.status === 'verified'
    ).length;
    const pendingDocs = application.documents.filter(
      (doc) => doc.status === 'pending'
    ).length;

    return { totalDocs, verifiedDocs, pendingDocs };
  };

  const { totalDocs, verifiedDocs, pendingDocs } = getDocumentStatus();

  return (
    <div
      className={`bg-white border-l-4 ${getPriorityColor(application.priority)} border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 text-sm">
            {application.studentName}
          </h4>
          <p className="text-xs text-gray-500">
            {application.applicationNumber}
          </p>
        </div>
        <div
          className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}
        >
          {getStatusIcon(application.status)}
          <span>{formatStatus(application.status)}</span>
        </div>
      </div>

      {/* Program */}
      <div className="mb-3">
        <p className="text-sm font-medium text-gray-700 line-clamp-1">
          {application.program}
        </p>
        <p className="text-xs text-gray-500">{application.department}</p>
      </div>

      {/* Academic Info */}
      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
        <div>
          <span className="text-gray-500">GPA:</span>
          <span className="ml-1 font-medium text-gray-900">
            {application.academicRecords.gpa}/
            {application.academicRecords.maxGpa}
          </span>
        </div>
        <div>
          <span className="text-gray-500">Rank:</span>
          <span className="ml-1 font-medium text-gray-900">
            {application.academicRecords.rank
              ? `${application.academicRecords.rank}/${application.academicRecords.totalStudents}`
              : 'N/A'}
          </span>
        </div>
      </div>

      {/* Test Scores */}
      {application.testScores.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {application.testScores.map((score, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-50 text-blue-700 border border-blue-200"
              >
                {score.testType}: {score.score}/{score.maxScore}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Documents Status */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Documents:</span>
          <span className="text-gray-900">
            {verifiedDocs}/{totalDocs} verified
            {pendingDocs > 0 && (
              <span className="text-yellow-600 ml-1">
                ({pendingDocs} pending)
              </span>
            )}
          </span>
        </div>
        <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
            style={{
              width: `${totalDocs > 0 ? (verifiedDocs / totalDocs) * 100 : 0}%`,
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          Submitted: {new Date(application.submissionDate).toLocaleDateString()}
        </div>
        <div className="flex items-center space-x-2">
          {application.interviewDetails && (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-purple-50 text-purple-700 border border-purple-200">
              <Calendar className="h-3 w-3 mr-1" />
              Interview:{' '}
              {new Date(
                application.interviewDetails.scheduledDate
              ).toLocaleDateString()}
            </span>
          )}
          {onView && (
            <button
              onClick={() => onView(application)}
              className="inline-flex items-center px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
            >
              <Eye className="h-3 w-3 mr-1" />
              View
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
