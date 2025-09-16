import { DashboardLayout } from 'components/layout/DashboardLayout';
import { PageHeader } from 'components/ui/PageHeader';
import en from 'i18n/en.json';
import {
  ModernStatsGridColored,
  ColoredStatItem,
} from 'components/ui/ModernStatsGridColored';
import { TabContainer } from 'components/ui/TabContainer';
import { FeatureGate } from 'components/guards/FeatureGate';
import {
  Users,
  Calendar,
  Award,
  ArrowUpRight,
  UserPlus,
  Lock,
} from 'lucide-react';
import { useInstructorData } from './hooks/useInstructorData';
import { AllInstructors } from './tabs/AllInstructors';
import { Departments } from './tabs/Departments';
import { Analytics } from './tabs/Analytics';
import { Reports } from './tabs/Reports';
import { useTabRouting } from 'lib/useTabRouting';
import { SkeletonCard } from 'components/ui/Skeleton';
import { useAccess } from 'context/AccessContext';
import { useAccessCheck } from 'hooks/useAccessCheck';
import { useInstructorManagement } from './hooks/useInstructorManagement';

export function InstructorsPage(): JSX.Element {
  const { stats, isLoading } = useInstructorData();
  const { features } = useAccess();
  const hasAnalytics = features.includes('analytics.view');
  const { handleAddInstructor } = useInstructorManagement();
  const { allowed: canAddTeacher } = useAccessCheck({
    cap: 'staff.invite',
    neededPlan: 'starter' as any,
  });

  // Use tab routing instead of local state
  const { activeTab, setActiveTab } = useTabRouting({
    defaultTab: 'all-teachers',
    validTabs: ['all-teachers', 'departments', 'analytics', 'reports'],
    basePath: '/teachers',
  });

  const headerActions: Array<{
    label: string;
    icon: any;
    isPrimary: boolean;
    onClick: () => void;
    gate?: {
      cap?: string;
      feature?: string;
      neededPlan?: any;
      tooltip?: string;
    };
  }> = canAddTeacher
    ? [
        {
          label: `Add ${en.labels.instructor}`,
          icon: UserPlus,
          isPrimary: true,
          onClick: handleAddInstructor,
          gate: { cap: 'staff.invite', neededPlan: 'starter' as any },
        },
      ]
    : [];

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
      value: 'all-teachers',
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
      label: (
        <span className="inline-flex items-center gap-1">
          {en.tabs.analytics}
          {!hasAnalytics && <Lock className="w-3 h-3 text-amber-500" />}
        </span>
      ),
      content: (
        <FeatureGate
          feature="analytics.view"
          neededPlan="growth"
          showUpgradeHint
          modalLock
          backHref="/teachers/overview"
        >
          <Analytics isLoading={isLoading} />
        </FeatureGate>
      ),
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

      <FeatureGate
        feature="analytics.view"
        neededPlan="growth"
        showUpgradeHint={false}
      >
        {isLoading ? (
          <div className="grid grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} height="120px" />
            ))}
          </div>
        ) : (
          <ModernStatsGridColored stats={coloredStats} columns="4" gap="6" />
        )}
      </FeatureGate>

      <TabContainer
        tabs={tabItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mt-6"
      />
    </DashboardLayout>
  );
}
