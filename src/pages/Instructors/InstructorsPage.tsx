import { useState } from 'react';
import { DashboardLayout } from 'components/layout/DashboardLayout';
import { PageHeader } from 'components/ui/PageHeader';
import { StatsGrid } from 'components/ui/StatsGrid';
import { TabContainer } from 'components/ui/TabContainer';
import { Users, Calendar, Award } from 'lucide-react';
import { useInstructorData } from './hooks/useInstructorData';
// Removed useInstructorManagement import since it's no longer needed
import { AllInstructors } from './tabs/AllInstructors';
import { Departments } from './tabs/Departments';
import { Analytics } from './tabs/Analytics';
import { Reports } from './tabs/Reports';

export function InstructorsPage(): JSX.Element {
  const { stats } = useInstructorData();
  // Removed handleAddInstructor since it's now handled in AllInstructors tab

  const headerActions: Array<{
    label: string;
    icon: any;
    isPrimary: boolean;
    onClick: () => void;
  }> = [];

  const statsData = [
    {
      title: 'Total Instructors',
      value: stats.totalInstructors.toString(),
      icon: Users,
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-100',
      trend: { value: '4%', isPositive: true },
    },
    {
      title: 'Active Instructors',
      value: stats.activeInstructors.toString(),
      icon: Users,
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-100',
    },
    {
      title: 'On Leave',
      value: stats.onLeaveInstructors.toString(),
      icon: Calendar,
      iconColor: 'text-yellow-600',
      iconBgColor: 'bg-yellow-100',
    },
    {
      title: 'Avg Experience',
      value: `${stats.averageExperience.toFixed(1)} years`,
      icon: Award,
      iconColor: 'text-purple-600',
      iconBgColor: 'bg-purple-100',
    },
  ];

  const tabItems = [
    {
      value: 'all-instructors',
      label: 'All Instructors',
      content: <AllInstructors />,
    },
    {
      value: 'departments',
      label: 'Departments',
      content: <Departments />,
    },
    {
      value: 'analytics',
      label: 'Analytics',
      content: <Analytics />,
    },
    {
      value: 'reports',
      label: 'Reports',
      content: <Reports />,
    },
  ];

  const [activeTab, setActiveTab] = useState('all-instructors');

  return (
    <DashboardLayout>
      <PageHeader
        title="Instructors"
        description="Manage faculty members, departments, and performance"
        actions={headerActions}
      />

      <StatsGrid stats={statsData} />

      <TabContainer
        tabs={tabItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mt-6"
      />
    </DashboardLayout>
  );
}
