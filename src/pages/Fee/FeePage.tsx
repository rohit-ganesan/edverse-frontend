import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { PageHeader } from '../../components/ui/PageHeader';
import {
  ModernStatsGridColored,
  ColoredStatItem,
} from '../../components/ui/ModernStatsGridColored';
import { TabContainer } from '../../components/ui/TabContainer';
import {
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Users,
  Plus,
  Download,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Overview } from './tabs/Overview';
import { Analytics } from './tabs/Analytics';
import { Payments } from './tabs/Payments';
import { FeeStructures } from './tabs/FeeStructures';
import { Reports } from './tabs/Reports';
import { Settings } from './tabs/Settings';
import { useFeeData } from './hooks/useFeeData';

export function FeePage(): JSX.Element {
  const [activeTab, setActiveTab] = useState('overview');
  const { stats } = useFeeData();

  const handleCreateFeeStructure = () => {
    console.log('Create new fee structure');
  };

  const handleExportData = () => {
    console.log('Export fee data');
  };

  const handleRecordPayment = () => {
    console.log('Record new payment');
  };

  // Convert stats to ModernStatsGridColored format
  const coloredStats: ColoredStatItem[] = [
    {
      title: 'Total Collected',
      value: `$${stats.totalFeesCollected.toLocaleString()}`,
      icon: DollarSign,
      gradient: {
        from: 'from-green-50',
        to: 'to-emerald-50',
      },
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-100',
      trend: {
        icon: ArrowUpRight,
        value: '+8.2% this month',
        color: 'text-green-600',
      },
    },
    {
      title: 'Outstanding',
      value: `$${stats.totalOutstanding.toLocaleString()}`,
      icon: AlertTriangle,
      gradient: {
        from: 'from-red-50',
        to: 'to-rose-50',
      },
      iconColor: 'text-red-600',
      iconBgColor: 'bg-red-100',
      trend: {
        icon: ArrowDownRight,
        value: '-3.1% decrease',
        color: 'text-red-600',
      },
    },
    {
      title: 'Collection Rate',
      value: `${stats.collectionRate}%`,
      icon: TrendingUp,
      gradient: {
        from: 'from-blue-50',
        to: 'to-indigo-50',
      },
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-100',
      trend: {
        icon: ArrowUpRight,
        value: '+2.5% improvement',
        color: 'text-green-600',
      },
    },
    {
      title: 'Defaulters',
      value: stats.defaulterCount.toString(),
      icon: Users,
      gradient: {
        from: 'from-purple-50',
        to: 'to-violet-50',
      },
      iconColor: 'text-purple-600',
      iconBgColor: 'bg-purple-100',
      subtitle: 'Students with overdue fees',
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Fee Management"
        description="Manage fee structures, payments, and financial reporting"
        actions={[
          {
            label: 'Export Data',
            icon: Download,
            variant: 'outline',
            onClick: handleExportData,
          },
          {
            label: 'Record Payment',
            icon: CreditCard,
            variant: 'outline',
            onClick: handleRecordPayment,
          },
          {
            label: 'New Fee Structure',
            icon: Plus,
            isPrimary: true,
            onClick: handleCreateFeeStructure,
          },
        ]}
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
            value: 'payments',
            label: 'Payments',
            content: <Payments />,
          },
          {
            value: 'fee-structures',
            label: 'Fee Structures',
            content: <FeeStructures />,
          },
          {
            value: 'reports',
            label: 'Reports',
            content: <Reports />,
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
