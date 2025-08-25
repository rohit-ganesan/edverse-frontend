import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { PageHeader } from '../../../components/ui/PageHeader';
import {
  ModernStatsGridColored,
  ColoredStatItem,
} from '../../../components/ui/ModernStatsGridColored';
import { TabContainer } from '../../../components/ui/TabContainer';
import {
  UserCheck,
  TrendingUp,
  FileText,
  Clock,
  Plus,
  Download,
  ArrowUpRight,
} from 'lucide-react';
import { Overview } from './tabs/Overview';
import { Analytics } from './tabs/Analytics';
import { Applications } from './tabs/Applications';
import { Programs } from './tabs/Programs';
import { Settings } from './tabs/Settings';
import { useAdmissionData } from './hooks/useAdmissionData';
import { useTabRouting } from '../../../lib/useTabRouting';
import { SkeletonCard } from '../../../components/ui/Skeleton';

export function AdmissionPage(): JSX.Element {
  const { stats, isLoading } = useAdmissionData();

  // Use tab routing instead of local state
  const { activeTab, setActiveTab } = useTabRouting({
    defaultTab: 'overview',
    validTabs: [
      'overview',
      'applications',
      'programs',
      'analytics',
      'settings',
    ],
    basePath: '/admission',
  });

  const handleCreateApplication = () => {
    console.log('Create new application');
  };

  const handleExportData = () => {
    console.log('Export admission data');
  };

  // Convert stats to ModernStatsGridColored format
  const coloredStats: ColoredStatItem[] = [
    {
      title: 'Total Applications',
      value: stats.totalApplications.toString(),
      icon: FileText,
      gradient: {
        from: 'from-blue-50',
        to: 'to-indigo-50',
      },
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-100',
      trend: {
        icon: ArrowUpRight,
        value: '+12% this month',
        color: 'text-green-600',
      },
    },
    {
      title: 'Under Review',
      value: stats.pendingReview.toString(),
      icon: Clock,
      gradient: {
        from: 'from-orange-50',
        to: 'to-amber-50',
      },
      iconColor: 'text-orange-600',
      iconBgColor: 'bg-orange-100',
      subtitle: 'Pending review',
    },
    {
      title: 'Accepted',
      value: stats.acceptedApplications.toString(),
      icon: UserCheck,
      gradient: {
        from: 'from-green-50',
        to: 'to-emerald-50',
      },
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-100',
      trend: {
        icon: ArrowUpRight,
        value: '+8% acceptance rate',
        color: 'text-green-600',
      },
    },
    {
      title: 'Acceptance Rate',
      value: `${stats.acceptanceRate}%`,
      icon: TrendingUp,
      gradient: {
        from: 'from-purple-50',
        to: 'to-violet-50',
      },
      iconColor: 'text-purple-600',
      iconBgColor: 'bg-purple-100',
      trend: {
        icon: ArrowUpRight,
        value: '+2.5% improvement',
        color: 'text-green-600',
      },
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Admission Management"
        description="Manage student applications, programs, and admission processes"
        actions={[
          {
            label: 'Export Data',
            icon: Download,
            variant: 'outline',
            onClick: handleExportData,
          },
          {
            label: 'New Application',
            icon: Plus,
            isPrimary: true,
            onClick: handleCreateApplication,
          },
        ]}
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
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={[
          {
            value: 'overview',
            label: 'Overview',
            content: <Overview isLoading={isLoading} />,
          },
          {
            value: 'applications',
            label: 'Applications',
            content: <Applications isLoading={isLoading} />,
          },
          {
            value: 'programs',
            label: 'Programs',
            content: <Programs isLoading={isLoading} />,
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
