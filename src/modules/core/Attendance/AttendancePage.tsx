import { DashboardLayout } from 'components/layout/DashboardLayout';
import { PageHeader } from 'components/ui/PageHeader';
import {
  ModernStatsGridColored,
  ColoredStatItem,
} from 'components/ui/ModernStatsGridColored';
import { TabContainer } from 'components/ui/TabContainer';
import { UserCheck, UserX, AlertCircle, TrendingUp } from 'lucide-react';
import { Overview } from './tabs/Overview';
import { LiveTracking } from './tabs/LiveTracking';
import { Records } from './tabs/Records';
import { Analytics } from './tabs/Analytics';
import { Settings } from './tabs/Settings';
import { useAttendanceData } from './hooks/useAttendanceData';
import { useTabRouting } from 'lib/useTabRouting';
import { SkeletonCard } from 'components/ui/Skeleton';
import { FeatureGate } from 'components/guards/FeatureGate';
import { useAccess } from 'context/AccessContext';

export function AttendancePage(): JSX.Element {
  const { stats, isLoading } = useAttendanceData();
  const { features } = useAccess();
  const hasAnalytics = features.includes('analytics.view');

  // Use tab routing instead of local state
  const { activeTab, setActiveTab } = useTabRouting({
    defaultTab: 'overview',
    validTabs: [
      'overview',
      'live-tracking',
      'records',
      ...(hasAnalytics ? ['analytics'] : []),
      'settings',
    ],
    basePath: '/attendance',
  });

  // Convert stats to ModernStatsGridColored format
  const coloredStats: ColoredStatItem[] = [
    {
      title: 'Present Today',
      value: stats.totalPresent.toString(),
      icon: UserCheck,
      gradient: {
        from: 'from-green-50',
        to: 'to-emerald-50',
      },
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-100',
      subtitle: 'Students present',
    },
    {
      title: 'Absent Today',
      value: stats.totalAbsent.toString(),
      icon: UserX,
      gradient: {
        from: 'from-red-50',
        to: 'to-rose-50',
      },
      iconColor: 'text-red-600',
      iconBgColor: 'bg-red-100',
      subtitle: 'Students absent',
    },
    {
      title: 'Late Arrivals',
      value: stats.totalLate.toString(),
      icon: AlertCircle,
      gradient: {
        from: 'from-orange-50',
        to: 'to-amber-50',
      },
      iconColor: 'text-orange-600',
      iconBgColor: 'bg-orange-100',
      subtitle: 'Late students',
    },
    {
      title: 'Attendance Rate',
      value: `${stats.attendanceRate}%`,
      icon: TrendingUp,
      gradient: {
        from: 'from-blue-50',
        to: 'to-indigo-50',
      },
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-100',
      subtitle: 'Overall rate',
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Attendance Management"
        description="Monitor student attendance with real-time tracking and comprehensive reporting"
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
            value: 'live-tracking',
            label: 'Live Tracking',
            content: <LiveTracking isLoading={isLoading} />,
          },
          {
            value: 'records',
            label: 'Records',
            content: <Records isLoading={isLoading} />,
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
