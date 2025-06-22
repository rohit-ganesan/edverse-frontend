import { useState } from 'react';
import { Tabs } from '@radix-ui/themes';
import { DashboardLayout } from 'components/layout/DashboardLayout';
import { PageHeader } from 'components/ui/PageHeader';
import { StatsGrid } from 'components/ui/StatsGrid';
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

      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List size="2" className="mb-8">
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="live-tracking">Live Tracking</Tabs.Trigger>
          <Tabs.Trigger value="records">Records</Tabs.Trigger>
          <Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
          <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="overview">
          <Overview />
        </Tabs.Content>

        <Tabs.Content value="live-tracking">
          <LiveTracking />
        </Tabs.Content>

        <Tabs.Content value="records">
          <Records />
        </Tabs.Content>

        <Tabs.Content value="analytics">
          <Analytics />
        </Tabs.Content>

        <Tabs.Content value="settings">
          <Settings />
        </Tabs.Content>
      </Tabs.Root>
    </DashboardLayout>
  );
}
