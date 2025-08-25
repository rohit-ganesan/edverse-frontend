import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Heading,
  Badge,
  Grid,
  Switch,
  TextField,
} from '@radix-ui/themes';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { PageHeader } from '../../components/ui/PageHeader';
import { RadixCard } from '../../components/ui/RadixCard';
import { RadixButton } from '../../components/ui/RadixButton';
import { TabContainer } from '../../components/ui/TabContainer';
import {
  ModernStatsGridColored,
  ColoredStatItem,
} from '../../components/ui/ModernStatsGridColored';
import {
  Shield,
  Users,
  Settings,
  UserPlus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  MoreHorizontal,
  Key,
  Clock,
  CheckCircle,
  AlertCircle,
  Mail,
  Phone,
  Calendar,
  Activity,
  UserCheck,
  TrendingUp,
  Award,
  Target,
} from 'lucide-react';
import { useTabRouting } from '../../lib/useTabRouting';

interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'super-admin' | 'admin' | 'moderator';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  permissions: string[];
  department: string;
  phone: string;
  joinDate: string;
}

export function AdminsPage(): JSX.Element {
  // Use tab routing instead of local state
  const { activeTab, setActiveTab } = useTabRouting({
    defaultTab: 'overview',
    validTabs: ['overview', 'admins', 'permissions', 'settings'],
    basePath: '/admins',
  });

  const [searchTerm, setSearchTerm] = useState('');

  const admins: Admin[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@edverse.com',
      role: 'super-admin',
      status: 'active',
      lastLogin: '2024-01-15T14:30:00',
      permissions: ['all'],
      department: 'IT',
      phone: '+1-555-0123',
      joinDate: '2023-01-15',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@edverse.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-01-15T12:15:00',
      permissions: ['user_management', 'reports', 'settings'],
      department: 'Administration',
      phone: '+1-555-0124',
      joinDate: '2023-03-10',
    },
    {
      id: '3',
      name: 'Mike Davis',
      email: 'mike.davis@edverse.com',
      role: 'moderator',
      status: 'active',
      lastLogin: '2024-01-14T16:45:00',
      permissions: ['content_moderation', 'basic_reports'],
      department: 'Support',
      phone: '+1-555-0125',
      joinDate: '2023-06-20',
    },
    {
      id: '4',
      name: 'Lisa Wilson',
      email: 'lisa.wilson@edverse.com',
      role: 'admin',
      status: 'inactive',
      lastLogin: '2024-01-10T09:30:00',
      permissions: ['user_management', 'reports'],
      department: 'HR',
      phone: '+1-555-0126',
      joinDate: '2023-08-05',
    },
  ];

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const adminStats: ColoredStatItem[] = [
    {
      title: 'Total Admins',
      value: admins.length,
      icon: Users,
      gradient: {
        from: 'from-blue-50',
        to: 'to-indigo-50',
      },
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-100',
      trend: {
        icon: TrendingUp,
        value: '+2 this month',
        color: 'text-green-600',
      },
    },
    {
      title: 'Active Admins',
      value: admins.filter((a) => a.status === 'active').length,
      icon: UserCheck,
      gradient: {
        from: 'from-green-50',
        to: 'to-emerald-50',
      },
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-100',
      trend: {
        icon: Activity,
        value: `${Math.round((admins.filter((a) => a.status === 'active').length / admins.length) * 100)}% active`,
        color: 'text-blue-600',
      },
    },
    {
      title: 'Super Admins',
      value: admins.filter((a) => a.role === 'super-admin').length,
      icon: Shield,
      gradient: {
        from: 'from-red-50',
        to: 'to-pink-50',
      },
      iconColor: 'text-red-600',
      iconBgColor: 'bg-red-100',
      trend: {
        icon: Award,
        value: 'Highest access',
        color: 'text-red-600',
      },
    },
    {
      title: 'Recent Logins',
      value: admins.filter(
        (a) =>
          new Date(a.lastLogin) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      ).length,
      icon: Clock,
      gradient: {
        from: 'from-purple-50',
        to: 'to-violet-50',
      },
      iconColor: 'text-purple-600',
      iconBgColor: 'bg-purple-100',
      trend: {
        icon: Target,
        value: 'Last 24h',
        color: 'text-purple-600',
      },
    },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super-admin':
        return 'red';
      case 'admin':
        return 'blue';
      case 'moderator':
        return 'green';
      default:
        return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'inactive':
        return 'orange';
      case 'suspended':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'inactive':
        return <Clock className="w-4 h-4" />;
      case 'suspended':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const tabs = [
    {
      value: 'overview',
      label: 'Overview',
      content: (
        <Box className="space-y-6">
          {/* Quick Actions */}
          <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
            <Box className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
              <Heading size="4" className="text-gray-900 mb-1">
                Quick Actions
              </Heading>
              <Text size="2" className="text-gray-600">
                Common administrative tasks
              </Text>
            </Box>

            <Box className="p-6">
              <Grid columns="4" gap="4">
                <RadixButton
                  variant="outline"
                  size="3"
                  className="h-20 flex-col gap-2"
                >
                  <UserPlus className="w-6 h-6" />
                  <Text size="2">Add Admin</Text>
                </RadixButton>
                <RadixButton
                  variant="outline"
                  size="3"
                  className="h-20 flex-col gap-2"
                >
                  <Key className="w-6 h-6" />
                  <Text size="2">Manage Roles</Text>
                </RadixButton>
                <RadixButton
                  variant="outline"
                  size="3"
                  className="h-20 flex-col gap-2"
                >
                  <Activity className="w-6 h-6" />
                  <Text size="2">View Activity</Text>
                </RadixButton>
                <RadixButton
                  variant="outline"
                  size="3"
                  className="h-20 flex-col gap-2"
                >
                  <Settings className="w-6 h-6" />
                  <Text size="2">System Settings</Text>
                </RadixButton>
              </Grid>
            </Box>
          </RadixCard>

          {/* Recent Activity */}
          <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
            <Box className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
              <Heading size="4" className="text-gray-900 mb-1">
                Recent Admin Activity
              </Heading>
              <Text size="2" className="text-gray-600">
                Latest administrative actions and logins
              </Text>
            </Box>

            <Box className="p-6">
              <Box className="space-y-4">
                {admins.slice(0, 3).map((admin) => (
                  <Box key={admin.id} className="p-3 bg-gray-50 rounded-lg">
                    <Flex justify="between" align="center">
                      <Flex align="center" gap="3">
                        <Box className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <UserCheck className="w-4 h-4 text-green-600" />
                        </Box>
                        <Box>
                          <Text
                            size="2"
                            weight="medium"
                            className="text-gray-900"
                          >
                            {admin.name}
                          </Text>
                          <Text size="1" className="text-gray-600">
                            Last login:{' '}
                            {new Date(admin.lastLogin).toLocaleString()}
                          </Text>
                        </Box>
                      </Flex>
                      <Badge
                        color={getStatusColor(admin.status)}
                        variant="soft"
                        size="1"
                      >
                        {admin.status}
                      </Badge>
                    </Flex>
                  </Box>
                ))}
              </Box>
            </Box>
          </RadixCard>
        </Box>
      ),
    },
    {
      value: 'admins',
      label: 'All Admins',
      content: (
        <Box className="space-y-6">
          {/* Search and Filters */}
          <RadixCard className="p-6 shadow-xl border-0 bg-white">
            <Flex justify="between" align="center" gap="4">
              <Box className="flex-1 max-w-md">
                <TextField.Root
                  placeholder="Search admins..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                >
                  <TextField.Slot>
                    <Search className="w-4 h-4" />
                  </TextField.Slot>
                </TextField.Root>
              </Box>
              <Flex gap="2">
                <RadixButton variant="outline" size="2">
                  <Filter className="w-4 h-4 mr-1" />
                  Filter
                </RadixButton>
                <RadixButton variant="outline" size="2">
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </RadixButton>
              </Flex>
            </Flex>
          </RadixCard>

          {/* Admins List */}
          <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
            <Box className="p-6 bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-100">
              <Flex justify="between" align="center">
                <Box>
                  <Heading size="4" className="text-gray-900 mb-1">
                    System Administrators
                  </Heading>
                  <Text size="2" className="text-gray-600">
                    Manage admin accounts and permissions
                  </Text>
                </Box>
                <Badge color="purple" variant="soft" size="2">
                  {filteredAdmins.length} Admins
                </Badge>
              </Flex>
            </Box>

            <Box className="p-6">
              <Box className="space-y-4">
                {filteredAdmins.map((admin) => (
                  <Box
                    key={admin.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
                  >
                    <Flex justify="between" align="start">
                      <Flex align="start" gap="4">
                        <Box className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Shield className="w-6 h-6 text-purple-600" />
                        </Box>
                        <Box className="flex-1">
                          <Flex align="center" gap="2" className="mb-2">
                            <Heading size="3" className="text-gray-900">
                              {admin.name}
                            </Heading>
                            <Badge
                              color={getRoleColor(admin.role)}
                              variant="soft"
                              size="1"
                            >
                              {admin.role}
                            </Badge>
                            <Badge
                              color={getStatusColor(admin.status)}
                              variant="soft"
                              size="1"
                            >
                              <Box className="mr-1">
                                {getStatusIcon(admin.status)}
                              </Box>
                              {admin.status}
                            </Badge>
                          </Flex>
                          <Box className="space-y-1 mb-2">
                            <Flex align="center" gap="2">
                              <Mail className="w-4 h-4 text-gray-500" />
                              <Text size="2" className="text-gray-600">
                                {admin.email}
                              </Text>
                            </Flex>
                            <Flex align="center" gap="2">
                              <Phone className="w-4 h-4 text-gray-500" />
                              <Text size="2" className="text-gray-600">
                                {admin.phone}
                              </Text>
                            </Flex>
                          </Box>
                          <Flex align="center" gap="4">
                            <Flex align="center" gap="1">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              <Text size="2" className="text-gray-600">
                                Joined:{' '}
                                {new Date(admin.joinDate).toLocaleDateString()}
                              </Text>
                            </Flex>
                            <Flex align="center" gap="1">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <Text size="2" className="text-gray-600">
                                Last login:{' '}
                                {new Date(admin.lastLogin).toLocaleDateString()}
                              </Text>
                            </Flex>
                          </Flex>
                        </Box>
                      </Flex>
                      <Flex gap="2">
                        <RadixButton variant="ghost" size="1">
                          <Eye className="w-4 h-4" />
                        </RadixButton>
                        <RadixButton variant="ghost" size="1">
                          <Edit className="w-4 h-4" />
                        </RadixButton>
                        <RadixButton variant="ghost" size="1">
                          <MoreHorizontal className="w-4 h-4" />
                        </RadixButton>
                      </Flex>
                    </Flex>
                  </Box>
                ))}
              </Box>
            </Box>
          </RadixCard>
        </Box>
      ),
    },
    {
      value: 'permissions',
      label: 'Permissions',
      content: (
        <Box className="space-y-6">
          <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
            <Box className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
              <Heading size="4" className="text-gray-900 mb-1">
                Role Permissions
              </Heading>
              <Text size="2" className="text-gray-600">
                Configure permissions for different admin roles
              </Text>
            </Box>

            <Box className="p-6">
              <Grid columns="3" gap="6">
                {[
                  {
                    role: 'Super Admin',
                    permissions: [
                      'All System Access',
                      'User Management',
                      'System Settings',
                      'Security Controls',
                    ],
                    color: 'red' as const,
                  },
                  {
                    role: 'Admin',
                    permissions: [
                      'User Management',
                      'Reports',
                      'Content Management',
                      'Basic Settings',
                    ],
                    color: 'blue' as const,
                  },
                  {
                    role: 'Moderator',
                    permissions: [
                      'Content Moderation',
                      'Basic Reports',
                      'User Support',
                    ],
                    color: 'green' as const,
                  },
                ].map((roleInfo, index) => (
                  <Box
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <Flex align="center" gap="2" className="mb-4">
                      <Badge color={roleInfo.color} variant="soft" size="2">
                        {roleInfo.role}
                      </Badge>
                    </Flex>
                    <Box className="space-y-2">
                      {roleInfo.permissions.map((permission, permIndex) => (
                        <Flex key={permIndex} justify="between" align="center">
                          <Text size="2" className="text-gray-700">
                            {permission}
                          </Text>
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </Flex>
                      ))}
                    </Box>
                  </Box>
                ))}
              </Grid>
            </Box>
          </RadixCard>
        </Box>
      ),
    },
    {
      value: 'settings',
      label: 'Settings',
      content: (
        <Box className="space-y-6">
          <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
            <Box className="p-6 bg-gradient-to-r from-red-50 to-pink-50 border-b border-red-100">
              <Heading size="4" className="text-gray-900 mb-1">
                Admin Settings
              </Heading>
              <Text size="2" className="text-gray-600">
                Configure administrative system settings
              </Text>
            </Box>

            <Box className="p-6">
              <Grid columns="2" gap="6">
                <Box className="space-y-4">
                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 mb-3"
                    >
                      Security Settings
                    </Text>
                    <Box className="space-y-3">
                      <Flex justify="between" align="center">
                        <Text size="2" className="text-gray-700">
                          Require 2FA for Admins
                        </Text>
                        <Switch checked={true} size="2" />
                      </Flex>
                      <Flex justify="between" align="center">
                        <Text size="2" className="text-gray-700">
                          Session Timeout (30 min)
                        </Text>
                        <Switch checked={true} size="2" />
                      </Flex>
                      <Flex justify="between" align="center">
                        <Text size="2" className="text-gray-700">
                          Login Attempt Limits
                        </Text>
                        <Switch checked={true} size="2" />
                      </Flex>
                    </Box>
                  </Box>
                </Box>

                <Box className="space-y-4">
                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 mb-3"
                    >
                      Notification Settings
                    </Text>
                    <Box className="space-y-3">
                      <Flex justify="between" align="center">
                        <Text size="2" className="text-gray-700">
                          Email New Admin Alerts
                        </Text>
                        <Switch checked={true} size="2" />
                      </Flex>
                      <Flex justify="between" align="center">
                        <Text size="2" className="text-gray-700">
                          Security Breach Alerts
                        </Text>
                        <Switch checked={true} size="2" />
                      </Flex>
                      <Flex justify="between" align="center">
                        <Text size="2" className="text-gray-700">
                          System Maintenance Alerts
                        </Text>
                        <Switch checked={false} size="2" />
                      </Flex>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Box>
          </RadixCard>
        </Box>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Admin Management"
        description="Manage system administrators, roles, and permissions"
        actions={[
          {
            label: 'Export List',
            icon: Download,
            onClick: () => console.log('Export clicked'),
          },
          {
            label: 'Add Admin',
            icon: UserPlus,
            onClick: () => console.log('Add admin clicked'),
            isPrimary: true,
          },
        ]}
      />

      <ModernStatsGridColored
        stats={adminStats}
        columns="4"
        gap="6"
        isLoading={false}
      />

      <TabContainer
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </DashboardLayout>
  );
}
