import { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  BarChart3,
  Users,
  TrendingUp,
} from 'lucide-react';
import { RadixButton } from 'components/ui/RadixButton';
import { useStudentData } from '../hooks/useStudentData';
import { useStudentManagement } from '../hooks/useStudentManagement';

interface ReportType {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'academic' | 'attendance' | 'demographic' | 'financial';
  lastGenerated?: string;
}

const reportTypes: ReportType[] = [
  {
    id: 'student-list',
    title: 'Student Directory',
    description: 'Complete list of all students with contact information',
    icon: Users,
    category: 'demographic',
    lastGenerated: '2024-01-15',
  },
  {
    id: 'attendance-summary',
    title: 'Attendance Summary',
    description: 'Monthly attendance report for all students',
    icon: Calendar,
    category: 'attendance',
    lastGenerated: '2024-01-10',
  },
  {
    id: 'academic-performance',
    title: 'Academic Performance',
    description: 'Grade reports and academic standings',
    icon: BarChart3,
    category: 'academic',
    lastGenerated: '2024-01-08',
  },
  {
    id: 'class-wise-analysis',
    title: 'Class-wise Analysis',
    description: 'Performance analysis by class and section',
    icon: TrendingUp,
    category: 'academic',
  },
  {
    id: 'fee-collection',
    title: 'Fee Collection Report',
    description: 'Fee payment status and pending amounts',
    icon: FileText,
    category: 'financial',
  },
  {
    id: 'student-demographics',
    title: 'Student Demographics',
    description: 'Age, gender, and geographic distribution',
    icon: Users,
    category: 'demographic',
  },
];

export function Reports(): JSX.Element {
  const { students } = useStudentData();
  const { handleExportStudents } = useStudentManagement();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  const filteredReports =
    selectedCategory === 'all'
      ? reportTypes
      : reportTypes.filter((report) => report.category === selectedCategory);

  const handleGenerateReport = async (reportId: string) => {
    setIsGenerating(reportId);

    // Simulate report generation
    setTimeout(() => {
      console.log('Generating report:', reportId);

      // For demo purposes, export students data for any report
      if (reportId === 'student-list') {
        handleExportStudents(students);
      }

      setIsGenerating(null);
    }, 2000);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'academic':
        return 'bg-blue-100 text-blue-800';
      case 'attendance':
        return 'bg-green-100 text-green-800';
      case 'demographic':
        return 'bg-purple-100 text-purple-800';
      case 'financial':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Student Reports
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Generate and download various student reports
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="academic">Academic</option>
            <option value="attendance">Attendance</option>
            <option value="demographic">Demographic</option>
            <option value="financial">Financial</option>
          </select>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Reports</p>
              <p className="text-lg font-semibold text-gray-900">
                {reportTypes.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Generated This Month</p>
              <p className="text-lg font-semibold text-gray-900">12</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Students Covered</p>
              <p className="text-lg font-semibold text-gray-900">
                {students.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Last Updated</p>
              <p className="text-lg font-semibold text-gray-900">Today</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report) => {
          const IconComponent = report.icon;
          const isGeneratingThis = isGenerating === report.id;

          return (
            <div
              key={report.id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {report.title}
                    </h3>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${getCategoryColor(report.category)}`}
                    >
                      {report.category.charAt(0).toUpperCase() +
                        report.category.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{report.description}</p>

              {report.lastGenerated && (
                <p className="text-xs text-gray-500 mb-4">
                  Last generated:{' '}
                  {new Date(report.lastGenerated).toLocaleDateString()}
                </p>
              )}

              <div className="flex items-center gap-2">
                <RadixButton
                  variant="solid"
                  size="2"
                  onClick={() => handleGenerateReport(report.id)}
                  disabled={isGeneratingThis}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  {isGeneratingThis ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Generate
                    </>
                  )}
                </RadixButton>
                <RadixButton
                  variant="outline"
                  size="2"
                  onClick={() => console.log('Preview report:', report.id)}
                  className="flex items-center gap-2"
                >
                  Preview
                </RadixButton>
              </div>
            </div>
          );
        })}
      </div>

      {filteredReports.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No reports found
          </h3>
          <p className="text-center">
            No reports match the selected category filter.
          </p>
        </div>
      )}

      {/* Scheduled Reports */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Scheduled Reports
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-white rounded-lg p-3">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">
                  Monthly Attendance Report
                </p>
                <p className="text-sm text-gray-600">
                  Generated on the 1st of each month
                </p>
              </div>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              Active
            </span>
          </div>
          <div className="flex items-center justify-between bg-white rounded-lg p-3">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-medium text-gray-900">
                  Weekly Performance Summary
                </p>
                <p className="text-sm text-gray-600">Generated every Friday</p>
              </div>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
