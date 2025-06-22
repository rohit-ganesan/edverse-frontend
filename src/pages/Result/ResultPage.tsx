import { useState } from 'react';
import { DashboardLayout } from 'components/layout/DashboardLayout';
import { PageHeader } from 'components/ui/PageHeader';
import { StatsGrid } from 'components/ui/StatsGrid';
import { TabContainer } from 'components/ui/TabContainer';
import { Download, Plus, Users, CheckCircle, Star, Trophy } from 'lucide-react';
import { useResultData } from './hooks/useResultData';
import { useResultManagement } from './hooks/useResultManagement';
import { Overview } from './tabs/Overview';
import { StudentResults } from './tabs/StudentResults';
import { Analytics } from './tabs/Analytics';
import { PublishResults } from './tabs/PublishResults';

export function ResultPage(): JSX.Element {
  const [selectedTab, setSelectedTab] = useState('overview');
  const { analytics } = useResultData();
  const { exportResults } = useResultManagement();

  const headerActions = [
    {
      label: 'Export Results',
      icon: Download,
      variant: 'outline' as const,
      onClick: () => exportResults([]),
    },
    {
      label: 'Add Result',
      icon: Plus,
      isPrimary: true,
      onClick: () => console.log('Add result'),
    },
  ];

  const stats = [
    {
      title: 'Total Students',
      value: analytics.totalStudents,
      icon: Users,
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-100',
    },
    {
      title: 'Pass Rate',
      value: `${analytics.passPercentage}%`,
      icon: CheckCircle,
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-100',
    },
    {
      title: 'Average GPA',
      value: analytics.averageGPA,
      icon: Star,
      iconColor: 'text-purple-600',
      iconBgColor: 'bg-purple-100',
    },
    {
      title: 'Top Performers',
      value: analytics.topPerformers.length,
      icon: Trophy,
      iconColor: 'text-orange-600',
      iconBgColor: 'bg-orange-100',
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Results"
        description="Manage student results, grades, and academic performance"
        actions={headerActions}
      />

      <StatsGrid stats={stats} />

      <TabContainer
        activeTab={selectedTab}
        onTabChange={setSelectedTab}
        tabs={[
          {
            value: 'overview',
            label: 'Overview',
            content: <Overview />,
          },
          {
            value: 'results',
            label: 'Student Results',
            content: <StudentResults />,
          },
          {
            value: 'analytics',
            label: 'Analytics',
            content: <Analytics />,
          },
          {
            value: 'publish',
            label: 'Publish Results',
            content: <PublishResults />,
          },
        ]}
      />
    </DashboardLayout>
  );
}
