import { useState } from 'react';
import {
  Download,
  FileText,
  Calendar,
  Filter,
  Users,
  Award,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { RadixButton } from 'components/ui/RadixButton';
import { ModernCard } from 'components/ui/ModernCard';
import { useInstructorData } from '../hooks/useInstructorData';
import { useInstructorManagement } from '../hooks/useInstructorManagement';

interface ReportConfig {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'performance' | 'attendance' | 'payroll' | 'department';
  fields: string[];
  filters: string[];
}

const reportConfigs: ReportConfig[] = [
  {
    id: 'performance-summary',
    title: 'Performance Summary',
    description: 'Comprehensive performance report with ratings and feedback',
    icon: <Award className="w-5 h-5" />,
    category: 'performance',
    fields: [
      'Name',
      'Department',
      'Performance Rating',
      'Student Feedback',
      'Classes Taught',
    ],
    filters: ['Department', 'Performance Range', 'Date Range'],
  },
  {
    id: 'attendance-report',
    title: 'Attendance Report',
    description: 'Detailed attendance tracking and patterns',
    icon: <Clock className="w-5 h-5" />,
    category: 'attendance',
    fields: [
      'Name',
      'Department',
      'Attendance Rate',
      'Days Present',
      'Days Absent',
    ],
    filters: ['Department', 'Attendance Range', 'Date Range'],
  },
  {
    id: 'payroll-report',
    title: 'Payroll Report',
    description: 'Salary and compensation details',
    icon: <TrendingUp className="w-5 h-5" />,
    category: 'payroll',
    fields: [
      'Name',
      'Employee ID',
      'Basic Salary',
      'Allowances',
      'Total Salary',
    ],
    filters: ['Department', 'Salary Range', 'Employment Type'],
  },
  {
    id: 'department-analysis',
    title: 'Department Analysis',
    description: 'Department-wise instructor distribution and metrics',
    icon: <Users className="w-5 h-5" />,
    category: 'department',
    fields: [
      'Department',
      'Total Instructors',
      'Avg Performance',
      'Avg Experience',
    ],
    filters: ['Department', 'Performance Range'],
  },
  {
    id: 'experience-analysis',
    title: 'Experience Analysis',
    description: 'Experience levels and career progression tracking',
    icon: <FileText className="w-5 h-5" />,
    category: 'performance',
    fields: [
      'Name',
      'Experience Years',
      'Previous Roles',
      'Qualifications',
      'Specializations',
    ],
    filters: ['Experience Range', 'Department', 'Qualification Level'],
  },
  {
    id: 'subject-allocation',
    title: 'Subject Allocation',
    description: 'Subject and class assignments for instructors',
    icon: <Calendar className="w-5 h-5" />,
    category: 'department',
    fields: ['Name', 'Subjects', 'Classes', 'Total Hours', 'Workload'],
    filters: ['Department', 'Subject', 'Class Level'],
  },
];

export function Reports(): JSX.Element {
  const [selectedReport, setSelectedReport] = useState<ReportConfig | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [reportFilters, setReportFilters] = useState<Record<string, any>>({});
  const [isGenerating, setIsGenerating] = useState(false);

  const { instructors, isLoading, error } = useInstructorData();
  const { handleExportInstructors: handleExport } = useInstructorManagement();

  const filteredReports = reportConfigs.filter(
    (report) =>
      selectedCategory === 'all' || report.category === selectedCategory
  );

  const handleGenerateReport = async (report: ReportConfig) => {
    setIsGenerating(true);
    try {
      // Simulate report generation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Filter instructors based on report filters
      let filteredData = instructors;

      // Apply filters (simplified for demo)
      if (reportFilters.department && reportFilters.department !== 'all') {
        filteredData = filteredData.filter(
          (i) => i.department === reportFilters.department
        );
      }

      if (reportFilters.performanceMin !== undefined) {
        filteredData = filteredData.filter(
          (i) => i.performance.rating >= reportFilters.performanceMin
        );
      }

      if (reportFilters.performanceMax !== undefined) {
        filteredData = filteredData.filter(
          (i) => i.performance.rating <= reportFilters.performanceMax
        );
      }

      // Generate report data based on report type
      const reportData = generateReportData(report, filteredData);

      // Export the report
      await handleExport(filteredData, 'csv');
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateReportData = (report: ReportConfig, data: any[]) => {
    switch (report.id) {
      case 'performance-summary':
        return data.map((instructor) => ({
          Name: instructor.name,
          Department: instructor.department,
          'Performance Rating': `${instructor.performance.rating}/5.0`,
          'Student Feedback': `${instructor.performance.studentFeedback}/5.0`,
          'Classes Taught': instructor.performance.classesTaught,
        }));

      case 'attendance-report':
        return data.map((instructor) => ({
          Name: instructor.name,
          Department: instructor.department,
          'Attendance Rate': `${instructor.performance.attendanceRate}%`,
          'Days Present': Math.floor(
            instructor.performance.attendanceRate * 2.5
          ), // Mock calculation
          'Days Absent': Math.floor(
            (100 - instructor.performance.attendanceRate) * 2.5
          ),
        }));

      case 'payroll-report':
        return data.map((instructor) => ({
          Name: instructor.name,
          'Employee ID': instructor.employeeId,
          'Basic Salary': `$${instructor.salary.basic.toLocaleString()}`,
          Allowances: `$${instructor.salary.allowances.toLocaleString()}`,
          'Total Salary': `$${instructor.salary.total.toLocaleString()}`,
        }));

      case 'department-analysis':
        const deptStats = data.reduce(
          (acc, instructor) => {
            const dept = instructor.department;
            if (!acc[dept]) {
              acc[dept] = { count: 0, totalRating: 0, totalExperience: 0 };
            }
            acc[dept].count++;
            acc[dept].totalRating += instructor.performance.rating;
            acc[dept].totalExperience += instructor.experience.years;
            return acc;
          },
          {} as Record<string, any>
        );

        return Object.entries(deptStats).map(([dept, stats]) => {
          const deptStats = stats as {
            count: number;
            totalRating: number;
            totalExperience: number;
          };
          return {
            Department: dept,
            'Total Instructors': deptStats.count,
            'Avg Performance': `${(deptStats.totalRating / deptStats.count).toFixed(1)}/5.0`,
            'Avg Experience': `${(deptStats.totalExperience / deptStats.count).toFixed(1)} years`,
          };
        });

      default:
        return data;
    }
  };

  const handleFilterChange = (filterKey: string, value: any) => {
    setReportFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading reports...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error loading reports: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Instructor Reports
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Generate comprehensive reports for {instructors.length} instructors
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="performance">Performance</option>
            <option value="attendance">Attendance</option>
            <option value="payroll">Payroll</option>
            <option value="department">Department</option>
          </select>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report) => (
          <ModernCard
            key={report.id}
            className="p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            onClick={() => setSelectedReport(report)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  {report.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {report.title}
                  </h3>
                  <span className="text-xs text-gray-500 capitalize">
                    {report.category}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">{report.description}</p>

            <div className="space-y-2">
              <div className="text-xs text-gray-500">Includes:</div>
              <div className="flex flex-wrap gap-1">
                {report.fields.slice(0, 3).map((field, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                  >
                    {field}
                  </span>
                ))}
                {report.fields.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    +{report.fields.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </ModernCard>
        ))}
      </div>

      {/* Report Configuration Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  {selectedReport.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedReport.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedReport.description}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            {/* Report Fields */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Report Fields</h4>
              <div className="grid grid-cols-2 gap-2">
                {selectedReport.fields.map((field, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm text-gray-700">{field}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Filters</h4>
              <div className="space-y-4">
                {selectedReport.filters.includes('Department') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <select
                      value={reportFilters.department || 'all'}
                      onChange={(e) =>
                        handleFilterChange('department', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Departments</option>
                      {Array.from(
                        new Set(instructors.map((i) => i.department))
                      ).map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {selectedReport.filters.includes('Performance Range') && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Min Performance
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={reportFilters.performanceMin || ''}
                        onChange={(e) =>
                          handleFilterChange(
                            'performanceMin',
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Performance
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={reportFilters.performanceMax || ''}
                        onChange={(e) =>
                          handleFilterChange(
                            'performanceMax',
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="5.0"
                      />
                    </div>
                  </div>
                )}

                {selectedReport.filters.includes('Date Range') && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        From Date
                      </label>
                      <input
                        type="date"
                        value={reportFilters.fromDate || ''}
                        onChange={(e) =>
                          handleFilterChange('fromDate', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        To Date
                      </label>
                      <input
                        type="date"
                        value={reportFilters.toDate || ''}
                        onChange={(e) =>
                          handleFilterChange('toDate', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3">
              <RadixButton
                variant="outline"
                size="2"
                onClick={() => setSelectedReport(null)}
              >
                Cancel
              </RadixButton>
              <RadixButton
                variant="solid"
                size="2"
                onClick={() => handleGenerateReport(selectedReport)}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Generate Report
                  </>
                )}
              </RadixButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
