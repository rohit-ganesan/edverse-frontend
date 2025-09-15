import { DashboardLayout } from 'components/layout/DashboardLayout';
import { PageHeader } from 'components/ui/PageHeader';
import en from 'i18n/en.json';
import {
  ModernStatsGridColored,
  ColoredStatItem,
} from 'components/ui/ModernStatsGridColored';
import { TabContainer } from 'components/ui/TabContainer';
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Plus,
  Download,
} from 'lucide-react';
import { AllNotices } from './tabs/AllNotices';
import { Recent } from './tabs/Recent';
import { Drafts } from './tabs/Drafts';
import { Analytics } from './tabs/Analytics';
import { useNoticeData } from './hooks/useNoticeData';
import { useNoticeManagement } from './hooks/useNoticeManagement';
import { useTabRouting } from 'lib/useTabRouting';
import { SkeletonCard } from 'components/ui/Skeleton';

export function NoticePage(): JSX.Element {
  const { analytics, isLoading } = useNoticeData();
  const { handleCreateNotice, handleExportNotices } = useNoticeManagement();

  // Use tab routing instead of local state
  const { activeTab, setActiveTab } = useTabRouting({
    defaultTab: 'all-notices',
    validTabs: ['all-notices', 'recent', 'drafts', 'analytics'],
    basePath: '/notices',
  });

  // Convert stats to ModernStatsGridColored format
  const coloredStats: ColoredStatItem[] = [
    {
      title: 'Total Notices',
      value: analytics.totalNotices.toString(),
      icon: Bell,
      gradient: {
        from: 'from-blue-50',
        to: 'to-indigo-50',
      },
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-100',
      subtitle: 'All announcements',
    },
    {
      title: 'Published',
      value: analytics.publishedNotices.toString(),
      icon: CheckCircle,
      gradient: {
        from: 'from-green-50',
        to: 'to-emerald-50',
      },
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-100',
      subtitle: 'Live notices',
    },
    {
      title: 'Urgent',
      value: analytics.urgentNotices.toString(),
      icon: AlertTriangle,
      gradient: {
        from: 'from-red-50',
        to: 'to-rose-50',
      },
      iconColor: 'text-red-600',
      iconBgColor: 'bg-red-100',
      subtitle: 'High priority',
    },
    {
      title: 'Total Views',
      value: analytics.totalViews.toLocaleString(),
      icon: TrendingUp,
      gradient: {
        from: 'from-purple-50',
        to: 'to-violet-50',
      },
      iconColor: 'text-purple-600',
      iconBgColor: 'bg-purple-100',
      subtitle: 'Engagement',
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title={en.nav.announcements}
        description={en.pages.announcements.description}
        actions={[
          {
            label: en.cta.export_notices,
            icon: Download,
            variant: 'outline',
            onClick: handleExportNotices,
          },
          {
            label: en.cta.create_notice,
            icon: Plus,
            isPrimary: true,
            onClick: handleCreateNotice,
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
            value: 'all-notices',
            label: en.pages.announcements.all_notices,
            content: <AllNotices isLoading={isLoading} />,
          },
          {
            value: 'recent',
            label: en.tabs.recent,
            content: <Recent isLoading={isLoading} />,
          },
          {
            value: 'drafts',
            label: en.tabs.drafts,
            content: <Drafts isLoading={isLoading} />,
          },
          {
            value: 'analytics',
            label: en.tabs.analytics,
            content: <Analytics isLoading={isLoading} />,
          },
        ]}
      />
    </DashboardLayout>
  );
}
