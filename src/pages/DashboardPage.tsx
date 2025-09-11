import { Heading, Text } from '@radix-ui/themes';
import { DashboardLayout } from 'components/layout/DashboardLayout';
import { PageHeader } from 'components/ui/PageHeader';
import {
  ModernStatsGridColored,
  ColoredStatItem,
} from 'components/ui/ModernStatsGridColored';
import { RadixCard } from 'components/ui/RadixCard';
import { QuickActions } from 'components/dashboard/QuickActions';
import { AccessDebugger } from 'components/debug/AccessDebugger';
import { AccessDebuggerDetailed } from 'components/debug/AccessDebuggerDetailed';
import { Users, GraduationCap, Building, CheckCircle } from 'lucide-react';
import { useAuth } from 'features/auth/AuthContext';
import { UserStatusCard } from 'components/dashboard/UserStatusCard';

export function DashboardPage(): JSX.Element {
  const { user, userProfile } = useAuth();

  // Mock stats for demonstration (you can replace with real Supabase queries later)
  const mockStats: ColoredStatItem[] = [
    {
      title: 'Total Students',
      value: '0',
      icon: Users,
      gradient: {
        from: 'from-blue-50',
        to: 'to-blue-100',
      },
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-100',
      subtitle: 'No data yet',
    },
    {
      title: 'Total Teachers',
      value: '0',
      icon: GraduationCap,
      gradient: {
        from: 'from-green-50',
        to: 'to-green-100',
      },
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-100',
      subtitle: 'No data yet',
    },
    {
      title: 'Total Courses',
      value: '0',
      icon: Building,
      gradient: {
        from: 'from-purple-50',
        to: 'to-purple-100',
      },
      iconColor: 'text-purple-600',
      iconBgColor: 'bg-purple-100',
      subtitle: 'No data yet',
    },
    {
      title: 'System Status',
      value: 'Active',
      icon: CheckCircle,
      gradient: {
        from: 'from-orange-50',
        to: 'to-orange-100',
      },
      iconColor: 'text-orange-600',
      iconBgColor: 'bg-orange-100',
      subtitle: 'Using Supabase',
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Dashboard"
          description="Welcome to your EdVerse learning management system"
        />
        {/* <UserStatusCard /> */}
        {/* User Info */}
        {user && (
          <RadixCard className="p-4">
            <Heading size="4" className="mb-3">
              Welcome back!
            </Heading>
            <div className="space-y-2">
              <Text>
                <strong>Email:</strong> {user.email}
              </Text>
              <Text>
                <strong>User ID:</strong> {user.id}
              </Text>
              {userProfile && (
                <>
                  <Text>
                    <strong>Name:</strong> {userProfile.first_name}{' '}
                    {userProfile.last_name}
                  </Text>
                  <Text>
                    <strong>Role:</strong> {userProfile.role}
                  </Text>
                  {userProfile.address && (
                    <Text>
                      <strong>Address:</strong> {userProfile.address}
                    </Text>
                  )}
                </>
              )}
              <Text>
                <strong>Email Verified:</strong>{' '}
                {user.email_confirmed_at ? 'Yes' : 'No'}
              </Text>
            </div>
          </RadixCard>
        )}

        {/* Stats Grid */}
        <ModernStatsGridColored stats={mockStats} />

        {/* Access Debugger */}
        <AccessDebugger />

        {/* Detailed Access Debugger */}
        <AccessDebuggerDetailed />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <QuickActions />
          </div>

          {/* Announcements */}
          {/* <div className="lg:col-span-2">
            <NoticeBoard />
          </div> */}
        </div>
      </div>
    </DashboardLayout>
  );
}
