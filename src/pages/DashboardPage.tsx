import { Heading, Text } from '@radix-ui/themes';
import { DashboardLayout } from 'components/layout/DashboardLayout';
import { PageHeader } from 'components/ui/PageHeader';
import {
  ModernStatsGridColored,
  ColoredStatItem,
} from 'components/ui/ModernStatsGridColored';
import { RadixCard } from 'components/ui/RadixCard';
import { QuickActions } from 'components/dashboard/QuickActions';
import { NoticeBoard } from 'components/dashboard/NoticeBoard';
import { AccessDebugger } from 'components/debug/AccessDebugger';
import {
  Shield,
  Users,
  GraduationCap,
  Building,
  Database,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from 'features/auth/AuthContext';

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

  const currentTime = new Date().toLocaleString();

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Dashboard"
          description="Welcome to your EdVerse learning management system"
        />

        {/* Auth System Status */}
        <RadixCard className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center space-x-3">
            <Database className="h-5 w-5 text-blue-600" />
            <div>
              <Text className="font-semibold text-blue-900">
                Authentication System: Supabase
              </Text>
              <Text className="text-sm text-blue-700">
                Successfully authenticated • Last updated: {currentTime}
              </Text>
            </div>
          </div>
        </RadixCard>

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

        {/* Migration Status */}
        <RadixCard className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-start space-x-3">
            <Shield className="h-6 w-6 text-yellow-600 mt-1" />
            <div>
              <Heading size="4" className="text-yellow-900 mb-2">
                Migration Status
              </Heading>
              <Text className="text-yellow-800 mb-3">
                You're currently using the <strong>Supabase</strong>{' '}
                authentication system.
              </Text>
              <div className="space-y-2 text-sm text-yellow-700">
                <div>✅ Phase 1: Database schema created</div>
                <div>✅ Phase 2: Authentication migration completed</div>
                <div>🔄 Phase 3: Data migration (in progress)</div>
                <div>⏳ Phase 4: Backend functions migration</div>
              </div>
              <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
                <Text className="text-sm text-yellow-800">
                  <strong>Note:</strong> You're using Supabase with an empty
                  database. Dashboard data will appear once you add data through
                  the Supabase system.
                </Text>
              </div>
            </div>
          </div>
        </RadixCard>
      </div>
    </DashboardLayout>
  );
}
