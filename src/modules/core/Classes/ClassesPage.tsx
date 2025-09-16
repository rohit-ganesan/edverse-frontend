import { DashboardLayout } from 'components/layout/DashboardLayout';
import { PageHeader } from 'components/ui/PageHeader';
import {
  ModernStatsGridColored,
  ColoredStatItem,
} from 'components/ui/ModernStatsGridColored';
import { TabContainer } from 'components/ui/TabContainer';
import { Users, Calendar, BookOpen, Clock, Plus } from 'lucide-react';
import { Overview } from './tabs/Overview';
import { AllClasses } from './tabs/AllClasses';
import { Analytics } from './tabs/Analytics';
import { Settings } from './tabs/Settings';
import { useClassesData } from './hooks/useClassesData';
import { useTabRouting } from 'lib/useTabRouting';
import { SkeletonCard } from 'components/ui/Skeleton';
import { FeatureGate } from 'components/guards/FeatureGate';
import { useAccess } from 'context/AccessContext';
import { useAccessCheck } from 'hooks/useAccessCheck';
import { useNavigate } from 'react-router-dom';

export function ClassesPage(): JSX.Element {
  const { stats, isLoading } = useClassesData();
  const { features } = useAccess();
  const hasAnalytics = features.includes('analytics.view');
  const navigate = useNavigate();
  const { allowed: canAddClass } = useAccessCheck({
    cap: 'classes.create',
    neededPlan: 'starter' as any,
  });

  // Use tab routing instead of local state
  const { activeTab, setActiveTab } = useTabRouting({
    defaultTab: 'overview',
    validTabs: [
      'overview',
      'all-classes',
      ...(hasAnalytics ? ['analytics'] : []),
      'settings',
    ],
    basePath: '/classes',
  });

  // Convert stats to ModernStatsGridColored format
  const coloredStats: ColoredStatItem[] = [
    {
      title: 'Active Classes',
      value: stats.totalClasses.toString(),
      icon: Users,
      gradient: {
        from: 'from-blue-50',
        to: 'to-indigo-50',
      },
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-100',
      subtitle: 'Currently running',
    },
    {
      title: "Today's Classes",
      value: stats.todayClasses.toString(),
      icon: Calendar,
      gradient: {
        from: 'from-green-50',
        to: 'to-emerald-50',
      },
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-100',
      subtitle: 'Scheduled today',
    },
    {
      title: 'Total Subjects',
      value: stats.totalSubjects.toString(),
      icon: BookOpen,
      gradient: {
        from: 'from-purple-50',
        to: 'to-violet-50',
      },
      iconColor: 'text-purple-600',
      iconBgColor: 'bg-purple-100',
      subtitle: 'Different subjects',
    },
    {
      title: 'Avg Duration',
      value: `${stats.avgDuration}m`,
      icon: Clock,
      gradient: {
        from: 'from-orange-50',
        to: 'to-amber-50',
      },
      iconColor: 'text-orange-600',
      iconBgColor: 'bg-orange-100',
      subtitle: 'Per class',
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Classes Management"
        description="Manage class schedules, assignments, and student enrollment with comprehensive tracking"
        actions={[
          {
            label: 'Add Class',
            icon: Plus,
            isPrimary: true,
            onClick: () => navigate('/classes/overview?add=1'),
            gate: { cap: 'classes.create', neededPlan: 'starter' as any },
          },
        ]}
      />

      {/* Stats Skeleton */}
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
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={[
          {
            value: 'overview',
            label: 'Overview',
            content: <Overview isLoading={isLoading} />,
          },
          {
            value: 'all-classes',
            label: 'All Classes',
            content: <AllClasses isLoading={isLoading} />,
          },
          {
            value: 'analytics',
            label: 'Analytics',
            content: hasAnalytics ? <Analytics isLoading={isLoading} /> : null,
            disabled: !hasAnalytics,
            tooltip: 'Requires GROWTH plan',
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
