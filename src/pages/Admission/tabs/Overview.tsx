import React, { useState } from 'react';
import { RadixCard } from '../../../components/ui/RadixCard';
import { ApplicationCard } from '../components/ApplicationCard';
import { useAdmissionData } from '../hooks/useAdmissionData';
import {
  Calendar,
  Clock,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  Filter,
  Search,
  ChevronRight,
} from 'lucide-react';

export function Overview(): JSX.Element {
  const { applications, dashboardData } = useAdmissionData();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter applications based on status and search
  const filteredApplications = applications.filter((app) => {
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesSearch =
      searchTerm === '' ||
      app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.program.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const recentApplications = filteredApplications.slice(0, 6);

  const statusOptions = [
    { value: 'all', label: 'All Applications', count: applications.length },
    {
      value: 'submitted',
      label: 'Submitted',
      count: applications.filter((a) => a.status === 'submitted').length,
    },
    {
      value: 'under_review',
      label: 'Under Review',
      count: applications.filter((a) => a.status === 'under_review').length,
    },
    {
      value: 'interview_scheduled',
      label: 'Interview Scheduled',
      count: applications.filter((a) => a.status === 'interview_scheduled')
        .length,
    },
    {
      value: 'accepted',
      label: 'Accepted',
      count: applications.filter((a) => a.status === 'accepted').length,
    },
    {
      value: 'rejected',
      label: 'Rejected',
      count: applications.filter((a) => a.status === 'rejected').length,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'interview_scheduled':
        return 'bg-purple-100 text-purple-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'waitlisted':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Urgent Actions */}
      {dashboardData.urgentActions.length > 0 && (
        <RadixCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              Urgent Actions Required
            </h3>
            <span className="text-sm text-gray-500">
              {dashboardData.urgentActions.length} items
            </span>
          </div>
          <div className="space-y-3">
            {dashboardData.urgentActions.slice(0, 5).map((action) => (
              <div
                key={action.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full ${getPriorityColor(action.priority)}`}
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      {action.studentName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {action.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">
                    Due: {new Date(action.dueDate).toLocaleDateString()}
                  </span>
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </RadixCard>
      )}

      {/* Upcoming Deadlines */}
      {dashboardData.upcomingDeadlines.length > 0 && (
        <RadixCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="h-5 w-5 text-blue-600 mr-2" />
              Upcoming Deadlines
            </h3>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {dashboardData.upcomingDeadlines.slice(0, 4).map((deadline) => (
              <div
                key={deadline.id}
                className="p-3 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900">{deadline.title}</p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      deadline.daysRemaining <= 3
                        ? 'bg-red-100 text-red-800'
                        : deadline.daysRemaining <= 7
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {deadline.daysRemaining} days
                  </span>
                </div>
                <p className="text-sm text-gray-600">{deadline.description}</p>
              </div>
            ))}
          </div>
        </RadixCard>
      )}

      {/* Applications Section */}
      <RadixCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Applications
          </h3>
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} ({option.count})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Applications Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recentApplications.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No applications found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}

        {filteredApplications.length > 6 && (
          <div className="mt-6 text-center">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              View All Applications
              <ChevronRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        )}
      </RadixCard>

      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        {dashboardData.performanceMetrics.map((metric, index) => (
          <RadixCard key={index} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {metric.label}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {metric.value} {metric.unit}
                </p>
              </div>
              <div
                className={`flex items-center text-sm ${
                  metric.trend === 'up'
                    ? 'text-green-600'
                    : metric.trend === 'down'
                      ? 'text-red-600'
                      : 'text-gray-600'
                }`}
              >
                {metric.trend === 'up' && '↗'}
                {metric.trend === 'down' && '↘'}
                {metric.trend === 'stable' && '→'}
                {metric.trendPercentage > 0 && `${metric.trendPercentage}%`}
              </div>
            </div>
          </RadixCard>
        ))}
      </div>
    </div>
  );
}
