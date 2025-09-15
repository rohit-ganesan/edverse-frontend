import { DashboardLayout } from 'components/layout/DashboardLayout';
import { PageHeader } from 'components/ui/PageHeader';
import en from 'i18n/en.json';
import {
  ModernStatsGridColored,
  ColoredStatItem,
} from 'components/ui/ModernStatsGridColored';
import { TabContainer } from 'components/ui/TabContainer';
import { Users, Calendar, Award, ArrowUpRight } from 'lucide-react';
import { useInstructorData } from './hooks/useInstructorData';
import { AllInstructors } from './tabs/AllInstructors';
import { Departments } from './tabs/Departments';
import { Analytics } from './tabs/Analytics';
import { Reports } from './tabs/Reports';
import { useTabRouting } from 'lib/useTabRouting';
import { SkeletonCard } from 'components/ui/Skeleton';

export function InstructorsPage(): JSX.Element {
  const { stats, isLoading } = useInstructorData();

  // Use tab routing instead of local state
  const { activeTab, setActiveTab } = useTabRouting({
    defaultTab: 'all-instructors',
    validTabs: ['all-instructors', 'departments', 'analytics', 'reports'],
    basePath: '/instructors',
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
      title: en.labels.instructors,
      value: stats.totalInstructors.toString(),
      icon: Users,
      gradient: {
        from: 'from-blue-50',
        to: 'to-indigo-50',
      },
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-100',
      trend: {
        icon: ArrowUpRight,
        value: '+4% growth',
        color: 'text-green-600',
      },
    },
    {
      title: `${en.labels.instructors} (Active)`,
      value: stats.activeInstructors.toString(),
      icon: Users,
      gradient: {
        from: 'from-green-50',
        to: 'to-emerald-50',
      },
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-100',
      subtitle: 'Currently teaching',
    },
    {
      title: 'On Leave',
      value: stats.onLeaveInstructors.toString(),
      icon: Calendar,
      gradient: {
        from: 'from-yellow-50',
        to: 'to-amber-50',
      },
      iconColor: 'text-yellow-600',
      iconBgColor: 'bg-yellow-100',
      subtitle: 'Temporary absence',
    },
    {
      title: 'Avg Experience',
      value: `${stats.averageExperience.toFixed(1)} years`,
      icon: Award,
      gradient: {
        from: 'from-purple-50',
        to: 'to-violet-50',
      },
      iconColor: 'text-purple-600',
      iconBgColor: 'bg-purple-100',
      subtitle: 'Teaching experience',
    },
  ];

  const tabItems = [
    {
      value: 'all-instructors',
      label: `All ${en.labels.instructors}`,
      content: <AllInstructors isLoading={isLoading} />,
    },
    {
      value: 'departments',
      label: en.tabs.departments,
      content: <Departments isLoading={isLoading} />,
    },
    {
      value: 'analytics',
      label: en.tabs.analytics,
      content: <Analytics isLoading={isLoading} />,
    },
    {
      value: 'reports',
      label: en.tabs.reports,
      content: <Reports isLoading={isLoading} />,
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title={en.nav.instructors}
        description={en.pages.instructors.description}
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
