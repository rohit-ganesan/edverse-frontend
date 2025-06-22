import { useState } from 'react';
import { DashboardLayout } from 'components/layout/DashboardLayout';
import { PageHeader } from 'components/ui/PageHeader';
import { StatsGrid } from 'components/ui/StatsGrid';
import { TabContainer } from 'components/ui/TabContainer';
import {
  GraduationCap,
  UserPlus,
  Calendar,
  BookOpen,
  UserCheck,
  TrendingUp,
} from 'lucide-react';
import { useStudentData } from './hooks/useStudentData';
import { useStudentManagement } from './hooks/useStudentManagement';
import { AllStudents } from './tabs/AllStudents';
import { Classes } from './tabs/Classes';
import { Analytics } from './tabs/Analytics';
import { Reports } from './tabs/Reports';

export function StudentsPage(): JSX.Element {
  const { stats } = useStudentData();
  const { handleAddStudent } = useStudentManagement();

  const headerActions = [
    {
      label: 'Add New Student',
      icon: UserPlus,
      isPrimary: true,
      onClick: handleAddStudent,
    },
  ];

  const statsData = [
    {
      title: 'Total Students',
      value: stats.totalStudents.toString(),
      icon: GraduationCap,
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-100',
      trend: { value: '8%', isPositive: true },
    },
    {
      title: 'Active Students',
      value: stats.activeStudents.toString(),
      icon: UserCheck,
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-100',
      trend: { value: '2%', isPositive: true },
    },
    {
      title: 'Avg Attendance',
      value: `${stats.averageAttendance.toFixed(1)}%`,
      icon: Calendar,
      iconColor: 'text-purple-600',
      iconBgColor: 'bg-purple-100',
      trend: { value: '1.5%', isPositive: true },
    },
    {
      title: 'Total Classes',
      value: stats.totalClasses.toString(),
      icon: BookOpen,
      iconColor: 'text-orange-600',
      iconBgColor: 'bg-orange-100',
    },
  ];

  const tabItems = [
    {
      value: 'all-students',
      label: 'All Students',
      content: <AllStudents />,
    },
    {
      value: 'classes',
      label: 'Classes',
      content: <Classes />,
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

  const [activeTab, setActiveTab] = useState('all-students');

  return (
    <DashboardLayout>
      <PageHeader
        title="Students"
        description="Manage student information, classes, and performance"
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
