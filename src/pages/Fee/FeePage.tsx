import { useState } from 'react';
import { Tabs } from '@radix-ui/themes';
import { DashboardLayout } from 'components/layout/DashboardLayout';
import { PageHeader } from 'components/ui/PageHeader';
import { StatsGrid } from 'components/ui/StatsGrid';
import { ActionCardGrid } from 'components/ui/ActionCardGrid';
import {
  DollarSign,
  AlertTriangle,
  TrendingUp,
  XCircle,
  Download,
  Plus,
  Send,
  Upload,
} from 'lucide-react';
import { useFeeData } from './hooks/useFeeData';
import { Overview } from './tabs/Overview';
import { Analytics } from './tabs/Analytics';

export function FeePage(): JSX.Element {
  const [activeTab, setActiveTab] = useState('overview');
  const { stats } = useFeeData();

  return (
    <DashboardLayout>
      <PageHeader
        title="Fee"
        description="Comprehensive fee collection, tracking, and communication system"
        actions={[
          {
            label: 'Export Report',
            icon: Download,
            variant: 'outline',
            onClick: () => console.log('Export report clicked'),
          },
          {
            label: 'Add Fee Structure',
            icon: Plus,
            isPrimary: true,
            onClick: () => console.log('Add fee structure clicked'),
          },
        ]}
      />

      <StatsGrid
        stats={[
          {
            title: 'Total Collected',
            value: `$${stats.totalCollected.toLocaleString()}`,
            icon: DollarSign,
            iconColor: 'text-green-600',
            iconBgColor: 'bg-green-100',
          },
          {
            title: 'Pending Amount',
            value: `$${stats.totalPending.toLocaleString()}`,
            icon: AlertTriangle,
            iconColor: 'text-orange-600',
            iconBgColor: 'bg-orange-100',
          },
          {
            title: 'Collection Rate',
            value: `${stats.collectionRate}%`,
            icon: TrendingUp,
            iconColor: 'text-blue-600',
            iconBgColor: 'bg-blue-100',
          },
          {
            title: 'Overdue Payments',
            value: stats.overduePayments.toString(),
            icon: XCircle,
            iconColor: 'text-red-600',
            iconBgColor: 'bg-red-100',
          },
        ]}
      />

      <ActionCardGrid
        cards={[
          {
            title: 'Send Payment Reminders',
            description: 'Notify students about upcoming due dates',
            variant: 'info',
            action: {
              label: 'Send',
              icon: Send,
              onClick: () => console.log('Send reminders clicked'),
            },
          },
          {
            title: 'Generate Fee Reports',
            description: 'Download detailed payment analytics',
            variant: 'success',
            action: {
              label: 'Generate',
              icon: Download,
              onClick: () => console.log('Generate reports clicked'),
            },
          },
          {
            title: 'Bulk Payment Processing',
            description: 'Process multiple payments at once',
            variant: 'primary',
            action: {
              label: 'Process',
              icon: Upload,
              onClick: () => console.log('Process payments clicked'),
            },
          },
        ]}
      />

      {/* Tabs Navigation */}
      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List className="mb-6">
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="payments">Payments</Tabs.Trigger>
          <Tabs.Trigger value="structure">Fee Structure</Tabs.Trigger>
          <Tabs.Trigger value="reminders">Reminders</Tabs.Trigger>
          <Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="overview">
          <Overview />
        </Tabs.Content>

        <Tabs.Content value="payments">
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Payments Tab
            </h3>
            <p className="text-gray-500">
              Payment management functionality coming soon
            </p>
          </div>
        </Tabs.Content>

        <Tabs.Content value="structure">
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Fee Structure Tab
            </h3>
            <p className="text-gray-500">
              Fee structure management functionality coming soon
            </p>
          </div>
        </Tabs.Content>

        <Tabs.Content value="reminders">
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Reminders Tab
            </h3>
            <p className="text-gray-500">
              Reminder management functionality coming soon
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
