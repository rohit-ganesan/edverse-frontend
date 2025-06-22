import { useState } from 'react';
import { DashboardLayout } from 'components/layout/DashboardLayout';
import { PageHeader } from 'components/ui/PageHeader';
import { StatsGrid } from 'components/ui/StatsGrid';
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

      <StatsGrid
        stats={[
          {
            title: 'Total Notices',
            value: analytics.totalNotices.toString(),
            icon: Bell,
            iconColor: 'text-blue-600',
            iconBgColor: 'bg-blue-100',
          },
          {
            title: 'Published',
            value: analytics.publishedNotices.toString(),
            icon: CheckCircle,
            iconColor: 'text-green-600',
            iconBgColor: 'bg-green-100',
          },
          {
            title: 'Urgent',
            value: analytics.urgentNotices.toString(),
            icon: AlertTriangle,
            iconColor: 'text-red-600',
            iconBgColor: 'bg-red-100',
          },
          {
            title: 'Total Views',
            value: analytics.totalViews.toLocaleString(),
            icon: TrendingUp,
            iconColor: 'text-purple-600',
            iconBgColor: 'bg-purple-100',
          },
        ]}
      />

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
