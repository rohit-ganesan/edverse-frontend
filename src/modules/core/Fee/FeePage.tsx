import React from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { PageHeader } from '../../../components/ui/PageHeader';
import {
  ModernStatsGridColored,
  ColoredStatItem,
} from '../../../components/ui/ModernStatsGridColored';
import { TabContainer } from '../../../components/ui/TabContainer';
import {
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Users,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Overview } from './tabs/Overview';
import { Analytics } from './tabs/Analytics';
import { Payments } from './tabs/Payments';
import { FeeStructures } from './tabs/FeeStructures';
import { Reports } from './tabs/Reports';
import { Settings } from './tabs/Settings';
import { useFeeData } from './hooks/useFeeData';
import { useTabRouting } from '../../../lib/useTabRouting';
import { SkeletonCard } from '../../../components/ui/Skeleton';
import { FeatureGate } from '../../../components/guards/FeatureGate';
import { useAccess } from '../../../context/AccessContext';
import { Plan } from 'types/access';

export function FeePage(): JSX.Element {
  const { stats, isLoading } = useFeeData();
  const { features } = useAccess();
  const hasAnalytics = features.includes('analytics.view');

  // Use tab routing instead of local state
  const { activeTab, setActiveTab } = useTabRouting({
    defaultTab: 'overview',
    validTabs: [
      'overview',
      'payments',
      'fee-structures',
      'reports',
      ...(hasAnalytics ? ['analytics'] : []),
      'settings',
    ],
    basePath: '/fee',
  });

  const handleCreateFeeStructure = () => {
    console.log('Create new fee structure');
  };

  // Export and record actions handled within respective tabs

  // Convert stats to ModernStatsGridColored format
  const coloredStats: ColoredStatItem[] = [
    {
      title: 'Total Collected',
      value: `$${stats.totalFeesCollected.toLocaleString()}`,
      icon: DollarSign,
      gradient: {
        from: 'from-green-50',
        to: 'to-emerald-50',
      },
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-100',
      trend: {
        icon: ArrowUpRight,
        value: '+8.2% this month',
        color: 'text-green-600',
      },
    },
    {
      title: 'Outstanding',
      value: `$${stats.totalOutstanding.toLocaleString()}`,
      icon: AlertTriangle,
      gradient: {
        from: 'from-red-50',
        to: 'to-rose-50',
      },
      iconColor: 'text-red-600',
      iconBgColor: 'bg-red-100',
      trend: {
        icon: ArrowDownRight,
        value: '-3.1% decrease',
        color: 'text-red-600',
      },
    },
    {
      title: 'Collection Rate',
      value: `${stats.collectionRate}%`,
      icon: TrendingUp,
      gradient: {
        from: 'from-blue-50',
        to: 'to-indigo-50',
      },
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-100',
      trend: {
        icon: ArrowUpRight,
        value: '+2.5% improvement',
        color: 'text-green-600',
      },
    },
    {
      title: 'Defaulters',
      value: stats.defaulterCount.toString(),
      icon: Users,
      gradient: {
        from: 'from-purple-50',
        to: 'to-violet-50',
      },
      iconColor: 'text-purple-600',
      iconBgColor: 'bg-purple-100',
      subtitle: 'Students with overdue fees',
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Fee Management"
        description="Manage fee structures, payments, and financial reporting"
        actions={[
          {
            label: 'New Fee',
            icon: Plus,
            isPrimary: true,
            onClick: handleCreateFeeStructure,
            gate: { cap: 'fees.record_manual', neededPlan: 'starter' as Plan },
          },
        ]}
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
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={[
          {
            value: 'overview',
            label: 'Overview',
            content: <Overview isLoading={isLoading} />,
          },
          {
            value: 'payments',
            label: 'Payments',
            content: <Payments isLoading={isLoading} />,
          },
          {
            value: 'fee-structures',
            label: 'Fee Structures',
            content: <FeeStructures isLoading={isLoading} />,
          },
          {
            value: 'reports',
            label: 'Reports',
            content: <Reports isLoading={isLoading} />,
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
