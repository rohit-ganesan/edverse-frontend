import { useState } from 'react';
import { DashboardLayout } from 'components/layout/DashboardLayout';
import { PageHeader } from 'components/ui/PageHeader';
import {
  ModernStatsGridColored,
  ColoredStatItem,
} from 'components/ui/ModernStatsGridColored';
import { TabContainer } from 'components/ui/TabContainer';
import { Users, Calendar, BookOpen, Clock } from 'lucide-react';
import { Overview } from './tabs/Overview';
import { Analytics } from './tabs/Analytics';
import { Settings } from './tabs/Settings';
import { useClassesData } from './hooks/useClassesData';

export function ClassesPage(): JSX.Element {
  const [activeTab, setActiveTab] = useState('overview');
  const { stats } = useClassesData();

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
      />

      <ModernStatsGridColored stats={coloredStats} columns="4" gap="6" />

      <TabContainer
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={[
          {
            value: 'overview',
            label: 'Overview',
            content: <Overview />,
          },
          {
            value: 'analytics',
            label: 'Analytics',
            content: <Analytics />,
          },
          {
            value: 'settings',
            label: 'Settings',
            content: <Settings />,
          },
        ]}
      />
    </DashboardLayout>
  );
}
