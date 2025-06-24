import { useState } from 'react';
import { Tabs } from '@radix-ui/themes';
import { DashboardLayout } from 'components/layout/DashboardLayout';
import { PageHeader } from 'components/ui/PageHeader';
import { StatsGrid } from 'components/ui/StatsGrid';
import { ActionCardGrid } from 'components/ui/ActionCardGrid';
import {
  UserPlus,
  CheckCircle,
  Clock,
  TrendingUp,
  Download,
  Plus,
  Calendar,
  Eye,
  Send,
} from 'lucide-react';
import { useAdmissionData } from './hooks/useAdmissionData';
import { Overview } from './tabs/Overview';
import { Analytics } from './tabs/Analytics';

export function AdmissionPage(): JSX.Element {
  const [activeTab, setActiveTab] = useState('overview');
  const { stats } = useAdmissionData();

  return (
    <DashboardLayout>
      <PageHeader
        title="Admission"
        description="Streamline application processing and student enrollment"
        actions={[
          {
            label: 'Export Applications',
            icon: Download,
            variant: 'outline',
            onClick: () => console.log('Export applications clicked'),
          },
          {
            label: 'New Application',
            icon: Plus,
            isPrimary: true,
            onClick: () => console.log('New application clicked'),
          },
        ]}
      />

      <StatsGrid
        stats={[
          {
            title: 'Total Applications',
            value: stats.totalApplications.toString(),
            icon: UserPlus,
            iconColor: 'text-blue-600',
            iconBgColor: 'bg-blue-100',
          },
          {
            title: 'Accepted',
            value: stats.acceptedApplications.toString(),
            icon: CheckCircle,
            iconColor: 'text-green-600',
            iconBgColor: 'bg-green-100',
          },
          {
            title: 'Under Review',
            value: stats.pendingReview.toString(),
            icon: Clock,
            iconColor: 'text-orange-600',
            iconBgColor: 'bg-orange-100',
          },
          {
            title: 'Acceptance Rate',
            value: `${stats.acceptanceRate}%`,
            icon: TrendingUp,
            iconColor: 'text-purple-600',
            iconBgColor: 'bg-purple-100',
          },
        ]}
      />

      <ActionCardGrid
        cards={[
          {
            title: 'Application Deadline Approaching',
            description: 'Spring 2024 applications due in 5 days',
            variant: 'error',
            action: {
              label: 'Review',
              icon: Calendar,
              onClick: () => console.log('Review deadline clicked'),
            },
          },
          {
            title: 'Interviews Scheduled',
            description: `${stats.interviewsScheduled} interviews this week`,
            variant: 'info',
            action: {
              label: 'View',
              icon: Eye,
              onClick: () => console.log('View interviews clicked'),
            },
          },
          {
            title: 'Admission Letters Ready',
            description: `${stats.acceptedApplications} acceptance letters to send`,
            variant: 'success',
            action: {
              label: 'Send',
              icon: Send,
              onClick: () => console.log('Send letters clicked'),
            },
          },
        ]}
      />

      {/* Tabs Navigation */}
      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List className="mb-6">
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="applications">Applications</Tabs.Trigger>
          <Tabs.Trigger value="programs">Programs</Tabs.Trigger>
          <Tabs.Trigger value="interviews">Interviews</Tabs.Trigger>
          <Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="overview">
          <Overview />
        </Tabs.Content>

        <Tabs.Content value="applications">
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Applications Tab
            </h3>
            <p className="text-gray-500">
              Application management functionality coming soon
            </p>
          </div>
        </Tabs.Content>

        <Tabs.Content value="programs">
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Programs Tab
            </h3>
            <p className="text-gray-500">
              Program management functionality coming soon
            </p>
          </div>
        </Tabs.Content>

        <Tabs.Content value="interviews">
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Interviews Tab
            </h3>
            <p className="text-gray-500">
              Interview scheduling functionality coming soon
            </p>
          </div>
        </Tabs.Content>

        <Tabs.Content value="analytics">
          <Analytics />
        </Tabs.Content>
      </Tabs.Root>
    </DashboardLayout>
  );
}
