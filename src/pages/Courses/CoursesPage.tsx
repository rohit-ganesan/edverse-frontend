import { DashboardLayout } from 'components/layout/DashboardLayout';
import { PageHeader } from 'components/ui/PageHeader';
import {
  ModernStatsGridColored,
  ColoredStatItem,
} from 'components/ui/ModernStatsGridColored';
import { TabContainer } from 'components/ui/TabContainer';
import { GraduationCap, BookOpen, Users, Award } from 'lucide-react';
import { Overview } from './tabs/Overview';
import { Analytics } from './tabs/Analytics';
import { Settings } from './tabs/Settings';
import { useCoursesData } from './hooks/useCoursesData';
import { useTabRouting } from 'lib/useTabRouting';
import { SkeletonCard } from 'components/ui/Skeleton';

export function CoursesPage(): JSX.Element {
  const { stats, isLoading } = useCoursesData();

  // Use tab routing instead of local state
  const { activeTab, setActiveTab } = useTabRouting({
    defaultTab: 'overview',
    validTabs: ['overview', 'analytics', 'settings'],
    basePath: '/courses',
  });

  // Convert stats to ModernStatsGridColored format
  const coloredStats: ColoredStatItem[] = [
    {
      title: 'Active Courses',
      value: stats.activeCourses.toString(),
      icon: GraduationCap,
      gradient: {
        from: 'from-green-50',
        to: 'to-emerald-50',
      },
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-100',
      subtitle: 'Currently running',
    },
    {
      title: 'Total Subjects',
      value: stats.totalSubjects.toString(),
      icon: BookOpen,
      gradient: {
        from: 'from-blue-50',
        to: 'to-indigo-50',
      },
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-100',
      subtitle: 'Available subjects',
    },
    {
      title: 'Enrolled Students',
      value: stats.enrolledStudents.toLocaleString(),
      icon: Users,
      gradient: {
        from: 'from-purple-50',
        to: 'to-violet-50',
      },
      iconColor: 'text-purple-600',
      iconBgColor: 'bg-purple-100',
      subtitle: 'Total enrollment',
    },
    {
      title: 'Certifications',
      value: stats.certifications.toString(),
      icon: Award,
      gradient: {
        from: 'from-orange-50',
        to: 'to-amber-50',
      },
      iconColor: 'text-orange-600',
      iconBgColor: 'bg-orange-100',
      subtitle: 'Available certs',
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Courses Management"
        description="Manage course curriculum, enrollment, and academic programs with comprehensive tracking"
      />

      {/* Stats Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} height="120px" />
          ))}
        </div>
      ) : (
        <ModernStatsGridColored stats={coloredStats} columns="4" gap="6" />
      )}

      <TabContainer
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={[
          {
            value: 'overview',
            label: 'Overview',
            content: <Overview isLoading={isLoading} />,
          },
          {
            value: 'analytics',
            label: 'Analytics',
            content: <Analytics isLoading={isLoading} />,
          },
          {
            value: 'settings',
            label: 'Settings',
            content: <Settings isLoading={isLoading} />,
          },
        ]}
      />
    </DashboardLayout>
  );
}
