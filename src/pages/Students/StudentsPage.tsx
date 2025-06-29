import { DashboardLayout } from 'components/layout/DashboardLayout';
import { PageHeader } from 'components/ui/PageHeader';
import {
  ModernStatsGridColored,
  ColoredStatItem,
} from 'components/ui/ModernStatsGridColored';
import { TabContainer } from 'components/ui/TabContainer';
import {
  GraduationCap,
  Calendar,
  BookOpen,
  UserCheck,
  ArrowUpRight,
} from 'lucide-react';
import { useStudentData } from './hooks/useStudentData';
import { AllStudents } from './tabs/AllStudents';
import { Classes } from './tabs/Classes';
import { Analytics } from './tabs/Analytics';
import { Reports } from './tabs/Reports';
import { useTabRouting } from 'lib/useTabRouting';
import { SkeletonCard } from 'components/ui/Skeleton';

export function StudentsPage(): JSX.Element {
  const { stats, isLoading } = useStudentData();

  // Use tab routing instead of local state
  const { activeTab, setActiveTab } = useTabRouting({
    defaultTab: 'all-students',
    validTabs: ['all-students', 'classes', 'analytics', 'reports'],
    basePath: '/students',
  });

  const headerActions: Array<{
    label: string;
    icon: any;
    isPrimary: boolean;
    onClick: () => void;
  }> = [];

  // Convert stats to ModernStatsGridColored format
  const coloredStats: ColoredStatItem[] = [
    {
      title: 'Total Students',
      value: stats.totalStudents.toString(),
      icon: GraduationCap,
      gradient: {
        from: 'from-blue-50',
        to: 'to-indigo-50',
      },
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-100',
      trend: {
        icon: ArrowUpRight,
        value: '+8% growth',
        color: 'text-green-600',
      },
    },
    {
      title: 'Active Students',
      value: stats.activeStudents.toString(),
      icon: UserCheck,
      gradient: {
        from: 'from-green-50',
        to: 'to-emerald-50',
      },
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-100',
      trend: {
        icon: ArrowUpRight,
        value: '+2% increase',
        color: 'text-green-600',
      },
    },
    {
      title: 'Avg Attendance',
      value: `${stats.averageAttendance.toFixed(1)}%`,
      icon: Calendar,
      gradient: {
        from: 'from-purple-50',
        to: 'to-violet-50',
      },
      iconColor: 'text-purple-600',
      iconBgColor: 'bg-purple-100',
      trend: {
        icon: ArrowUpRight,
        value: '+1.5% improvement',
        color: 'text-green-600',
      },
    },
    {
      title: 'Total Classes',
      value: stats.totalClasses.toString(),
      icon: BookOpen,
      gradient: {
        from: 'from-orange-50',
        to: 'to-amber-50',
      },
      iconColor: 'text-orange-600',
      iconBgColor: 'bg-orange-100',
      subtitle: 'Active classes',
    },
  ];

  const tabItems = [
    {
      value: 'all-students',
      label: 'All Students',
      content: <AllStudents isLoading={isLoading} />,
    },
    {
      value: 'classes',
      label: 'Classes',
      content: <Classes isLoading={isLoading} />,
    },
    {
      value: 'analytics',
      label: 'Analytics',
      content: <Analytics isLoading={isLoading} />,
    },
    {
      value: 'reports',
      label: 'Reports',
      content: <Reports isLoading={isLoading} />,
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Students"
        description="Manage student information, classes, and performance"
        actions={headerActions}
      />

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
        tabs={tabItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mt-6"
      />
    </DashboardLayout>
  );
}
