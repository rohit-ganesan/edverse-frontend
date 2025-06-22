import { BarChart3, PieChart, TrendingUp, Users } from 'lucide-react';
import { ModernStatsCard } from 'components/ui/ModernStatsCard';
import { useStudentData } from '../hooks/useStudentData';

export function Analytics(): JSX.Element {
  const { stats } = useStudentData();

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ModernStatsCard
          label="Total Students"
          value={stats.totalStudents.toString()}
          icon={<Users />}
          iconColor="blue"
        />
        <ModernStatsCard
          label="Active Students"
          value={stats.activeStudents.toString()}
          icon={<Users />}
          iconColor="green"
        />
        <ModernStatsCard
          label="Avg Attendance"
          value={`${stats.averageAttendance.toFixed(1)}%`}
          icon={<TrendingUp />}
          iconColor="purple"
        />
        <ModernStatsCard
          label="Total Classes"
          value={stats.totalClasses.toString()}
          icon={<BarChart3 />}
          iconColor="orange"
        />
      </div> */}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Distribution */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Grade Distribution
            </h3>
          </div>
          <div className="space-y-3">
            {stats.gradeDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      item.grade.startsWith('A')
                        ? 'bg-green-500'
                        : item.grade.startsWith('B')
                          ? 'bg-blue-500'
                          : item.grade.startsWith('C')
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                    }`}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Grade {item.grade}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {item.count} students
                  </span>
                  <span className="text-xs text-gray-500">
                    ({item.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Distribution */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Attendance Distribution
            </h3>
          </div>
          <div className="space-y-4">
            {stats.attendanceDistribution.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {item.range}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {item.count} students
                    </span>
                    <span className="text-xs text-gray-500">
                      ({item.percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      item.range.includes('95-100')
                        ? 'bg-green-500'
                        : item.range.includes('85-94')
                          ? 'bg-blue-500'
                          : item.range.includes('75-84')
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Performance Insights
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-green-800 mb-2">
              High Performers
            </h4>
            <p className="text-2xl font-bold text-green-600">
              {stats.gradeDistribution
                .filter((g) => g.grade.startsWith('A'))
                .reduce((sum, g) => sum + g.count, 0)}
            </p>
            <p className="text-xs text-green-600 mt-1">
              Students with A grades
            </p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-yellow-800 mb-2">
              At Risk
            </h4>
            <p className="text-2xl font-bold text-yellow-600">
              {stats.attendanceDistribution.find((a) =>
                a.range.includes('Below')
              )?.count || 0}
            </p>
            <p className="text-xs text-yellow-600 mt-1">
              Students with low attendance
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">
              Average Performance
            </h4>
            <p className="text-2xl font-bold text-blue-600">
              {stats.gradeDistribution
                .filter((g) => g.grade.startsWith('B'))
                .reduce((sum, g) => sum + g.count, 0)}
            </p>
            <p className="text-xs text-blue-600 mt-1">Students with B grades</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-white border border-gray-200 rounded-lg p-4 text-left hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Generate Report</h4>
                <p className="text-sm text-gray-600">
                  Create detailed analytics report
                </p>
              </div>
            </div>
          </button>
          <button className="bg-white border border-gray-200 rounded-lg p-4 text-left hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Track Progress</h4>
                <p className="text-sm text-gray-600">
                  Monitor student performance
                </p>
              </div>
            </div>
          </button>
          <button className="bg-white border border-gray-200 rounded-lg p-4 text-left hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Export Data</h4>
                <p className="text-sm text-gray-600">Download analytics data</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
