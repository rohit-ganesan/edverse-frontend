import { DataTable, DataTableColumn } from '../../../components/ui/DataTable';
import { useAdmissionData } from '../hooks/useAdmissionData';
import { Application } from '../types';
import {
  Calendar,
  FileText,
  AlertTriangle,
  Eye,
  MessageSquare,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';

export function Overview(): JSX.Element {
  const { applications, dashboardData } = useAdmissionData();

  // Use all applications for the DataTable (filtering will be handled by DataTable component)
  const filteredApplications = applications;

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

  // DataTable columns for applications
  const applicationColumns: DataTableColumn<Application>[] = [
    {
      key: 'applicationNumber',
      label: 'Application #',
      render: (app) => (
        <div className="font-medium text-blue-600">{app.applicationNumber}</div>
      ),
      sortable: true,
    },
    {
      key: 'studentName',
      label: 'Student Name',
      render: (app) => (
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
            {app.studentName.charAt(0)}
          </div>
          <div>
            <div className="font-medium text-gray-900">{app.studentName}</div>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'program',
      label: 'Program',
      render: (app) => (
        <div className="flex items-center">
          <GraduationCap className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-gray-900">{app.program}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'status',
      label: 'Status',
      render: (app) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}
        >
          {app.status
            .replace('_', ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase())}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'submissionDate',
      label: 'Submitted',
      render: (app) => (
        <div className="text-sm text-gray-600">
          {new Date(app.submissionDate).toLocaleDateString()}
        </div>
      ),
      sortable: true,
    },
    {
      key: 'lastUpdated',
      label: 'Last Updated',
      render: (app) => (
        <div className="text-sm text-gray-600">
          {new Date(app.lastUpdated).toLocaleDateString()}
        </div>
      ),
      sortable: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Side-by-side: Urgent Actions & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Urgent Actions Required */}
        <div className="rounded-lg shadow-lg overflow-hidden border-0 bg-white">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 text-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mr-4">
                  <AlertTriangle className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Urgent Actions Required
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {dashboardData.urgentActions.length} items need attention
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {dashboardData.urgentActions.slice(0, 3).map((action) => (
                <div
                  key={action.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
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
            {dashboardData.urgentActions.length > 3 && (
              <div className="mt-4 text-center">
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All {dashboardData.urgentActions.length} Actions
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="rounded-lg shadow-lg overflow-hidden border-0 bg-white">
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 text-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mr-4">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Upcoming Deadlines
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {dashboardData.upcomingDeadlines.length} deadlines
                    approaching
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {dashboardData.upcomingDeadlines.slice(0, 3).map((deadline) => (
                <div
                  key={deadline.id}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900">
                      {deadline.title}
                    </p>
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
                  <p className="text-sm text-gray-600">
                    {deadline.description}
                  </p>
                </div>
              ))}
            </div>
            {dashboardData.upcomingDeadlines.length > 3 && (
              <div className="mt-4 text-center">
                <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                  View All {dashboardData.upcomingDeadlines.length} Deadlines
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Applications - DataTable */}
      <DataTable
        data={filteredApplications}
        columns={applicationColumns}
        title="Recent Applications"
        subtitle={`${filteredApplications.length} applications found`}
        icon={<FileText className="h-5 w-5 text-purple-600" />}
        searchPlaceholder="Search by name, application number, or program..."
        searchFields={['studentName', 'applicationNumber', 'program']}
        filters={[
          {
            key: 'status',
            label: 'Status',
            options: [
              { value: 'all', label: 'All Status' },
              { value: 'submitted', label: 'Submitted' },
              { value: 'under_review', label: 'Under Review' },
              { value: 'interview_scheduled', label: 'Interview Scheduled' },
              { value: 'accepted', label: 'Accepted' },
              { value: 'rejected', label: 'Rejected' },
              { value: 'waitlisted', label: 'Waitlisted' },
            ],
          },
        ]}
        sortOptions={[
          { value: 'submissionDate', label: 'Sort by Submitted Date' },
          { value: 'lastUpdated', label: 'Sort by Last Updated' },
          { value: 'studentName', label: 'Sort by Student Name' },
          { value: 'status', label: 'Sort by Status' },
        ]}
        actions={[
          {
            icon: <Eye className="h-4 w-4" />,
            label: 'View Details',
            onClick: (app) => console.log('View application:', app),
            variant: 'ghost',
          },
          {
            icon: <MessageSquare className="h-4 w-4" />,
            label: 'Add Note',
            onClick: (app) => console.log('Add note to:', app),
            variant: 'ghost',
          },
        ]}
        headerActions={[
          {
            label: 'Export Applications',
            icon: <FileText className="h-4 w-4" />,
            onClick: () => console.log('Export applications'),
            variant: 'ghost',
          },
        ]}
        emptyStateIcon={<FileText className="h-12 w-12 text-gray-400" />}
        emptyStateTitle="No applications found"
        emptyStateSubtitle="Try adjusting your search or filter criteria."
        getRowKey={(app) => app.id}
      />
    </div>
  );
}
