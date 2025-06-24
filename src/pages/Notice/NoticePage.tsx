import { useState } from 'react';
import { DashboardLayout } from 'components/layout/DashboardLayout';
import { PageHeader } from 'components/ui/PageHeader';
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
import type { NoticeTab } from './types';

export function NoticePage(): JSX.Element {
  const [activeTab, setActiveTab] = useState<NoticeTab>('all');
  const { analytics } = useNoticeData();
  const { handleCreateNotice, handleExportNotices } = useNoticeManagement();

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
        title="Notice Board"
        description="Manage announcements, notifications, and important updates"
        actions={[
          {
            label: 'Export Notices',
            icon: Download,
            variant: 'outline',
            onClick: handleExportNotices,
          },
          {
            label: 'Create Notice',
            icon: Plus,
            isPrimary: true,
            onClick: handleCreateNotice,
          },
        ]}
      />

      <ModernStatsGridColored stats={coloredStats} columns="4" gap="6" />

      <TabContainer
        activeTab={activeTab}
        onTabChange={(value) => setActiveTab(value as NoticeTab)}
        tabs={[
          {
            value: 'all',
            label: 'All Notices',
            content: <AllNotices />,
          },
          {
            value: 'recent',
            label: 'Recent',
            content: <Recent />,
          },
          {
            value: 'drafts',
            label: 'Drafts',
            content: <Drafts />,
          },
          {
            value: 'analytics',
            label: 'Analytics',
            content: <Analytics />,
          },
        ]}
      />
    </DashboardLayout>
  );
}
