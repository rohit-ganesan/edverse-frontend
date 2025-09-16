import { DashboardLayout } from 'components/layout/DashboardLayout';
import { PageHeader } from 'components/ui/PageHeader';
import {
  ModernStatsGridColored,
  ColoredStatItem,
} from 'components/ui/ModernStatsGridColored';
import { TabContainer } from 'components/ui/TabContainer';
import { Plus, Users, CheckCircle, Star, Trophy, Lock } from 'lucide-react';
import { useResultData } from './hooks/useResultData';
// import { useResultManagement } from './hooks/useResultManagement';
import { Overview } from './tabs/Overview';
import { StudentResults } from './tabs/StudentResults';
import { Analytics } from './tabs/Analytics';
import { PublishResults } from './tabs/PublishResults';
import { useTabRouting } from 'lib/useTabRouting';
import { SkeletonCard } from 'components/ui/Skeleton';
import { FeatureGate } from 'components/guards/FeatureGate';
import { useAccess } from 'context/AccessContext';
import { Plan } from 'types/access';

export function ResultPage(): JSX.Element {
  const { analytics, isLoading } = useResultData();
  // exportResults available inside tabs when needed
  const { features } = useAccess();
  const hasAnalytics = features.includes('analytics.view');

  // Use tab routing instead of local state
  const { activeTab, setActiveTab } = useTabRouting({
    defaultTab: 'overview',
    validTabs: ['overview', 'student-results', 'analytics', 'publish-results'],
    basePath: '/results',
  });

  const headerActions = [
    {
      label: 'Add Result',
      icon: Plus,
      isPrimary: true,
      onClick: () => console.log('Add result'),
      gate: { cap: 'results.enter', neededPlan: 'starter' as Plan },
    },
  ];

  // Convert stats to ModernStatsGridColored format
  const coloredStats: ColoredStatItem[] = [
    {
      title: 'Total Students',
      value: analytics.totalStudents,
      icon: Users,
      gradient: {
        from: 'from-blue-50',
        to: 'to-indigo-50',
      },
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-100',
      subtitle: 'Enrolled students',
    },
    {
      title: 'Pass Rate',
      value: `${analytics.passPercentage}%`,
      icon: CheckCircle,
      gradient: {
        from: 'from-green-50',
        to: 'to-emerald-50',
      },
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-100',
      subtitle: 'Success rate',
    },
    {
      title: 'Average GPA',
      value: analytics.averageGPA,
      icon: Star,
      gradient: {
        from: 'from-purple-50',
        to: 'to-violet-50',
      },
      iconColor: 'text-purple-600',
      iconBgColor: 'bg-purple-100',
      subtitle: 'Overall performance',
    },
    {
      title: 'Top Performers',
      value: analytics.topPerformers.length,
      icon: Trophy,
      gradient: {
        from: 'from-orange-50',
        to: 'to-amber-50',
      },
      iconColor: 'text-orange-600',
      iconBgColor: 'bg-orange-100',
      subtitle: 'Excellence awards',
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Results"
        description="Manage student results, grades, and academic performance"
        actions={headerActions}
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
            value: 'student-results',
            label: 'Student Results',
            content: <StudentResults isLoading={isLoading} />,
          },
          {
            value: 'analytics',
            label: (
              <span className="inline-flex items-center gap-1">
                Analytics
                {!hasAnalytics && <Lock className="w-3 h-3 text-amber-500" />}
              </span>
            ),
            content: (
              <FeatureGate
                feature="analytics.view"
                neededPlan="growth"
                showUpgradeHint
                modalLock
                backHref="/results/overview"
              >
                <Analytics isLoading={isLoading} />
              </FeatureGate>
            ),
          },
          {
            value: 'publish-results',
            label: 'Publish Results',
            content: <PublishResults isLoading={isLoading} />,
          },
        ]}
      />
    </DashboardLayout>
  );
}
