import { useMemo } from 'react';
import {
  TrendingUp,
  Users,
  Award,
  BookOpen,
  Calendar,
  Target,
} from 'lucide-react';
import { ModernStatsGrid } from 'components/ui/ModernStatsGrid';
import { ModernCard } from 'components/ui/ModernCard';
import { useInstructorData } from '../hooks/useInstructorData';

export function Analytics(): JSX.Element {
  const { instructors, isLoading, error } = useInstructorData();

  // Calculate analytics data
  const analytics = useMemo(() => {
    if (instructors.length === 0) return null;

    // Performance distribution
    const performanceRanges = {
      excellent: instructors.filter((i) => i.performance.rating >= 4.5).length,
      good: instructors.filter(
        (i) => i.performance.rating >= 4.0 && i.performance.rating < 4.5
      ).length,
      average: instructors.filter(
        (i) => i.performance.rating >= 3.0 && i.performance.rating < 4.0
      ).length,
      poor: instructors.filter((i) => i.performance.rating < 3.0).length,
    };

    // Experience distribution
    const experienceRanges = {
      junior: instructors.filter((i) => i.experience.years < 5).length,
      midLevel: instructors.filter(
        (i) => i.experience.years >= 5 && i.experience.years < 10
      ).length,
      senior: instructors.filter((i) => i.experience.years >= 10).length,
    };

    // Department distribution
    const departmentStats = instructors.reduce(
      (acc, instructor) => {
        acc[instructor.department] = (acc[instructor.department] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Status distribution
    const statusStats = instructors.reduce(
      (acc, instructor) => {
        const status = instructor.status || 'Unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Average metrics
    const avgPerformance =
      instructors.reduce((sum, i) => sum + i.performance.rating, 0) /
      instructors.length;
    const avgExperience =
      instructors.reduce((sum, i) => sum + i.experience.years, 0) /
      instructors.length;
    const avgAttendance =
      instructors.reduce((sum, i) => sum + i.performance.attendanceRate, 0) /
      instructors.length;
    const avgSalary =
      instructors.reduce((sum, i) => sum + i.salary.total, 0) /
      instructors.length;

    // Top performers
    const topPerformers = [...instructors]
      .sort((a, b) => b.performance.rating - a.performance.rating)
      .slice(0, 5);

    // Recent hires (last 2 years)
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
    const recentHires = instructors.filter(
      (i) => new Date(i.dateOfJoining) >= twoYearsAgo
    );

    return {
      performanceRanges,
      experienceRanges,
      departmentStats,
      statusStats,
      avgPerformance,
      avgExperience,
      avgAttendance,
      avgSalary,
      topPerformers,
      recentHires,
    };
  }, [instructors]);

  // Stats for the grid
  const stats = useMemo(() => {
    if (!analytics) return [];

    return [
      {
        icon: <Award />,
        label: 'Avg Performance',
        value: `${analytics.avgPerformance.toFixed(1)}/5.0`,
        iconColor: 'purple' as const,
      },
      {
        icon: <Calendar />,
        label: 'Avg Experience',
        value: `${analytics.avgExperience.toFixed(1)} years`,
        iconColor: 'blue' as const,
      },
      {
        icon: <Target />,
        label: 'Avg Attendance',
        value: `${analytics.avgAttendance.toFixed(1)}%`,
        iconColor: 'green' as const,
      },
      {
        icon: <TrendingUp />,
        label: 'Avg Salary',
        value: `$${Math.round(analytics.avgSalary).toLocaleString()}`,
        iconColor: 'orange' as const,
      },
    ];
  }, [analytics]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error loading analytics: {error}</div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">No data available</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Instructor Analytics
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Performance insights and statistics for {instructors.length}{' '}
          instructors
        </p>
      </div>

      {/* Key Metrics */}
      {/* <ModernStatsGrid stats={stats} /> */}

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Distribution */}
        <ModernCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Performance Distribution
          </h3>
          <div className="space-y-4">
            {[
              {
                label: 'Excellent (4.5+)',
                count: analytics.performanceRanges.excellent,
                color: 'bg-green-500',
              },
              {
                label: 'Good (4.0-4.4)',
                count: analytics.performanceRanges.good,
                color: 'bg-blue-500',
              },
              {
                label: 'Average (3.0-3.9)',
                count: analytics.performanceRanges.average,
                color: 'bg-yellow-500',
              },
              {
                label: 'Poor (<3.0)',
                count: analytics.performanceRanges.poor,
                color: 'bg-red-500',
              },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm text-gray-700">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">
                    {item.count}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({((item.count / instructors.length) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ModernCard>

        {/* Experience Distribution */}
        <ModernCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Experience Distribution
          </h3>
          <div className="space-y-4">
            {[
              {
                label: 'Junior (<5 years)',
                count: analytics.experienceRanges.junior,
                color: 'bg-blue-500',
              },
              {
                label: 'Mid-level (5-9 years)',
                count: analytics.experienceRanges.midLevel,
                color: 'bg-purple-500',
              },
              {
                label: 'Senior (10+ years)',
                count: analytics.experienceRanges.senior,
                color: 'bg-green-500',
              },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm text-gray-700">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">
                    {item.count}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({((item.count / instructors.length) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ModernCard>

        {/* Department Distribution */}
        <ModernCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Department Distribution
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {Object.entries(analytics.departmentStats)
              .sort(([, a], [, b]) => b - a)
              .map(([dept, count], index) => (
                <div key={dept} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-indigo-600" />
                    </div>
                    <span className="text-sm text-gray-700">{dept}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">
                      {count}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({((count / instructors.length) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </ModernCard>

        {/* Status Distribution */}
        <ModernCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Status Distribution
          </h3>
          <div className="space-y-4">
            {Object.entries(analytics.statusStats).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      status === 'Active'
                        ? 'bg-green-500'
                        : status === 'On Leave'
                          ? 'bg-yellow-500'
                          : status === 'Inactive'
                            ? 'bg-gray-400'
                            : 'bg-red-500'
                    }`}
                  />
                  <span className="text-sm text-gray-700">{status}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">
                    {count}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({((count / instructors.length) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ModernCard>
      </div>

      {/* Top Performers */}
      <ModernCard className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Top Performers
        </h3>
        <div className="space-y-3">
          {analytics.topPerformers.map((instructor, index) => (
            <div
              key={instructor.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 font-semibold text-sm">
                    {instructor.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {instructor.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {instructor.department} • {instructor.designation}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  {instructor.performance.rating.toFixed(1)}/5.0
                </div>
                <div className="text-sm text-gray-500">#{index + 1} Rank</div>
              </div>
            </div>
          ))}
        </div>
      </ModernCard>

      {/* Recent Hires */}
      {analytics.recentHires.length > 0 && (
        <ModernCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Hires ({analytics.recentHires.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {analytics.recentHires.map((instructor) => (
              <div
                key={instructor.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {instructor.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {instructor.department}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {new Date(instructor.dateOfJoining).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-500">Joined</div>
                </div>
              </div>
            ))}
          </div>
        </ModernCard>
      )}
    </div>
  );
}
