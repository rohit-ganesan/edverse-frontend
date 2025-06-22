import { useState } from 'react';
import { DashboardLayout } from 'components/layout/DashboardLayout';
import { PageHeader } from 'components/ui/PageHeader';
import { StatsGrid } from 'components/ui/StatsGrid';
import { TabContainer } from 'components/ui/TabContainer';
import { UserCheck, UserX, AlertCircle, TrendingUp } from 'lucide-react';
import { Overview } from './tabs/Overview';
import { LiveTracking } from './tabs/LiveTracking';
import { Records } from './tabs/Records';
import { Analytics } from './tabs/Analytics';
import { Settings } from './tabs/Settings';
import { useAttendanceData } from './hooks/useAttendanceData';

export function AttendancePage(): JSX.Element {
  const [activeTab, setActiveTab] = useState('overview');
  const { stats } = useAttendanceData();

  return (
    <DashboardLayout>
      <PageHeader
        title="Attendance Management"
        description="Monitor student attendance with real-time tracking and comprehensive reporting"
      />

      <StatsGrid
        stats={[
          {
            title: 'Present Today',
            value: stats.totalPresent.toString(),
            icon: UserCheck,
            iconColor: 'text-green-600',
            iconBgColor: 'bg-green-100',
          },
          {
            title: 'Absent Today',
            value: stats.totalAbsent.toString(),
            icon: UserX,
            iconColor: 'text-red-600',
            iconBgColor: 'bg-red-100',
          },
          {
            title: 'Late Arrivals',
            value: stats.totalLate.toString(),
            icon: AlertCircle,
            iconColor: 'text-orange-600',
            iconBgColor: 'bg-orange-100',
          },
          {
            title: 'Attendance Rate',
            value: `${stats.attendanceRate}%`,
            icon: TrendingUp,
            iconColor: 'text-blue-600',
            iconBgColor: 'bg-blue-100',
          },
        ]}
      />

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
            value: 'live-tracking',
            label: 'Live Tracking',
            content: <LiveTracking />,
          },
          {
            value: 'records',
            label: 'Records',
            content: <Records />,
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
