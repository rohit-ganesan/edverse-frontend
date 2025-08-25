import { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Heading,
  Select,
  TextField,
  Badge,
  Table,
  Grid,
} from '@radix-ui/themes';
import { RadixCard } from '../../../../components/ui/RadixCard';
import { RadixButton } from '../../../../components/ui/RadixButton';
import { useFeeData } from '../hooks/useFeeData';
import {
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Users,
  CreditCard,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  ChevronRight,
  Calendar,
  Bell,
  Globe,
  FileText,
  RefreshCw,
  Eye,
  MoreHorizontal,
  Download,
  Clock,
  Wallet,
  ArrowUpRight,
} from 'lucide-react';
import { SkeletonCard } from '../../../../components/ui/Skeleton';

export function Overview({
  isLoading = false,
}: {
  isLoading?: boolean;
}): JSX.Element {
  const { payments, stats, dashboardData } = useFeeData();
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter payments based on status and search
  const filteredPayments = payments.filter((payment) => {
    const matchesStatus =
      paymentFilter === 'all' || payment.status === paymentFilter;
    const matchesSearch =
      searchTerm === '' ||
      payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const recentPayments = filteredPayments.slice(0, 10);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'green';
      case 'pending':
        return 'orange';
      case 'failed':
        return 'red';
      case 'refunded':
        return 'blue';
      default:
        return 'gray';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'card':
        return <CreditCard className="w-4 h-4" />;
      case 'bank_transfer':
        return <DollarSign className="w-4 h-4" />;
      case 'online':
        return <Globe className="w-4 h-4" />;
      case 'cash':
        return <Wallet className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const overdueCount = dashboardData.overduePayments?.length || 0;

  return (
    <Box className="space-y-6">
      {isLoading ? (
        <div className="grid grid-cols-3 gap-6 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} height="120px" />
          ))}
        </div>
      ) : (
        <>
          {/* Alerts & Notifications and Overdue Payments Side by Side */}
          {(dashboardData.alertsAndNotifications?.length > 0 ||
            overdueCount > 0 ||
            dashboardData.overduePayments?.length > 0) && (
            <Grid columns="2" gap="6">
              {/* Alerts and Notifications */}
              {(dashboardData.alertsAndNotifications?.length > 0 ||
                overdueCount > 0) && (
                <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
                  <Box className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
                    <Flex justify="between" align="center">
                      <Box>
                        <Heading size="4" className="text-gray-900 mb-1">
                          <Flex align="center" gap="2">
                            <Bell className="w-5 h-5 text-amber-600" />
                            Alerts & Notifications
                          </Flex>
                        </Heading>
                        <Text size="2" className="text-gray-600">
                          {dashboardData.alertsAndNotifications?.filter(
                            (a) => !a.isRead
                          ).length || 0}{' '}
                          unread notifications
                        </Text>
                      </Box>
                      <RadixButton
                        variant="soft"
                        size="2"
                        className="bg-white/70 hover:bg-white"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View All
                      </RadixButton>
                    </Flex>
                  </Box>

                  <Box className="p-6">
                    <Flex direction="column" gap="4">
                      {dashboardData.alertsAndNotifications
                        ?.slice(0, 3)
                        .map((alert) => (
                          <Box
                            key={alert.id}
                            className={`p-4 rounded-lg border ${
                              alert.severity === 'critical'
                                ? 'bg-red-50 border-red-200'
                                : alert.severity === 'error'
                                  ? 'bg-red-50 border-red-200'
                                  : alert.severity === 'warning'
                                    ? 'bg-yellow-50 border-yellow-200'
                                    : 'bg-blue-50 border-blue-200'
                            }`}
                          >
                            <Flex align="start" gap="3">
                              <Box
                                className={`p-2 rounded-lg ${
                                  alert.severity === 'critical' ||
                                  alert.severity === 'error'
                                    ? 'bg-red-100'
                                    : alert.severity === 'warning'
                                      ? 'bg-yellow-100'
                                      : 'bg-blue-100'
                                }`}
                              >
                                <AlertTriangle
                                  className={`w-4 h-4 ${
                                    alert.severity === 'critical' ||
                                    alert.severity === 'error'
                                      ? 'text-red-600'
                                      : alert.severity === 'warning'
                                        ? 'text-yellow-600'
                                        : 'text-blue-600'
                                  }`}
                                />
                              </Box>
                              <Box className="flex-1">
                                <Text
                                  size="2"
                                  weight="medium"
                                  className="text-gray-900 block mb-1"
                                >
                                  {alert.title}
                                </Text>
                                <Text size="2" className="text-gray-600 mb-2">
                                  {alert.description}
                                </Text>
                                <Text size="1" className="text-gray-500">
                                  {new Date(
                                    alert.createdDate
                                  ).toLocaleDateString()}
                                </Text>
                              </Box>
                              {!alert.isRead && (
                                <Box className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                              )}
                            </Flex>
                          </Box>
                        ))}
                    </Flex>
                  </Box>
                </RadixCard>
              )}

              {/* Overdue Payments */}
              {dashboardData.overduePayments?.length > 0 && (
                <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
                  <Box className="p-6 bg-gradient-to-r from-red-50 to-pink-50 border-b border-red-100">
                    <Flex justify="between" align="center">
                      <Box>
                        <Heading size="4" className="text-gray-900 mb-1">
                          <Flex align="center" gap="2">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                            Overdue Payments
                          </Flex>
                        </Heading>
                        <Text size="2" className="text-red-600 font-medium">
                          {dashboardData.overduePayments.length} students •{' '}
                          {formatCurrency(stats.overdueAmount || 0)}
                        </Text>
                      </Box>
                      <RadixButton
                        size="2"
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Bell className="w-4 h-4 mr-1" />
                        Send Reminders
                      </RadixButton>
                    </Flex>
                  </Box>

                  <Box className="p-6">
                    <Flex direction="column" gap="3">
                      {dashboardData.overduePayments
                        .slice(0, 3)
                        .map((assignment) => (
                          <Box
                            key={assignment.id}
                            className="p-4 bg-red-50 border border-red-200 rounded-lg"
                          >
                            <Flex
                              justify="between"
                              align="center"
                              className="mb-2"
                            >
                              <Text
                                size="2"
                                weight="medium"
                                className="text-red-900"
                              >
                                Student ID: {assignment.studentId}
                              </Text>
                              <Badge color="red" variant="soft" size="1">
                                Overdue
                              </Badge>
                            </Flex>
                            <Flex
                              justify="between"
                              align="center"
                              className="mb-3"
                            >
                              <Text size="2" className="text-red-800">
                                Amount: {formatCurrency(assignment.finalAmount)}
                              </Text>
                              <Text size="1" className="text-red-700">
                                Due:{' '}
                                {new Date(
                                  assignment.dueDate
                                ).toLocaleDateString()}
                              </Text>
                            </Flex>
                            <Flex gap="2">
                              <RadixButton variant="soft" size="1" color="red">
                                Send Reminder
                              </RadixButton>
                              <RadixButton
                                variant="outline"
                                size="1"
                                color="red"
                              >
                                Call Student
                              </RadixButton>
                            </Flex>
                          </Box>
                        ))}
                    </Flex>
                  </Box>
                </RadixCard>
              )}
            </Grid>
          )}

          {/* Upcoming Due Dates - Now in its own section */}
          <Box>
            {/* Upcoming Due Dates */}
            {dashboardData.upcomingDueDates?.length > 0 && (
              <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
                <Box className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                  <Flex justify="between" align="center">
                    <Box>
                      <Heading size="4" className="text-gray-900 mb-1">
                        <Flex align="center" gap="2">
                          <Calendar className="w-5 h-5 text-blue-600" />
                          Upcoming Due Dates
                        </Flex>
                      </Heading>
                      <Text size="2" className="text-gray-600">
                        Next 7 days
                      </Text>
                    </Box>
                    <RadixButton
                      variant="soft"
                      size="2"
                      className="bg-white/70 hover:bg-white"
                    >
                      <Calendar className="w-4 h-4 mr-1" />
                      View Calendar
                    </RadixButton>
                  </Flex>
                </Box>

                <Box className="p-6">
                  <Grid columns="4" gap="3">
                    {dashboardData.upcomingDueDates
                      .slice(0, 8)
                      .map((assignment) => (
                        <Box
                          key={assignment.id}
                          className="p-3 bg-amber-50 border border-amber-200 rounded-lg"
                        >
                          <Text
                            size="2"
                            weight="medium"
                            className="text-amber-900 block mb-1"
                          >
                            Student ID: {assignment.studentId}
                          </Text>
                          <Text size="2" className="text-amber-800 mb-1">
                            {formatCurrency(assignment.finalAmount)}
                          </Text>
                          <Text size="1" className="text-amber-700">
                            Due:{' '}
                            {new Date(assignment.dueDate).toLocaleDateString()}
                          </Text>
                        </Box>
                      ))}
                  </Grid>
                </Box>
              </RadixCard>
            )}
          </Box>
        </>
      )}

      {/* Recent Payments DataTable */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        {/* Header Section */}
        <Box className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-100">
          <Flex justify="between" align="center" className="mb-6">
            <Box>
              <Heading size="5" className="text-gray-900 mb-1">
                Recent Payments
              </Heading>
              <Text size="3" className="text-gray-600">
                {filteredPayments.length} payments found
              </Text>
            </Box>
            <Flex gap="2">
              <RadixButton
                variant="soft"
                size="2"
                className="bg-white/70 hover:bg-white"
              >
                <Filter className="w-4 h-4 mr-1" />
                Advanced Filters
              </RadixButton>
              <RadixButton
                variant="soft"
                size="2"
                className="bg-white/70 hover:bg-white"
              >
                <Download className="w-4 h-4 mr-1" />
                Export
              </RadixButton>
            </Flex>
          </Flex>

          {/* Filters */}
          <Flex gap="4" wrap="wrap">
            <Box className="flex-1 min-w-[250px]">
              <TextField.Root
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="2"
                className="w-full"
              >
                <TextField.Slot>
                  <Search className="w-4 h-4 text-gray-400" />
                </TextField.Slot>
              </TextField.Root>
            </Box>

            <Box className="min-w-[150px]">
              <Select.Root
                value={paymentFilter}
                onValueChange={setPaymentFilter}
                size="2"
              >
                <Select.Trigger className="w-full" />
                <Select.Content>
                  <Select.Item value="all">All Status</Select.Item>
                  <Select.Item value="completed">Completed</Select.Item>
                  <Select.Item value="pending">Pending</Select.Item>
                  <Select.Item value="failed">Failed</Select.Item>
                  <Select.Item value="refunded">Refunded</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>
          </Flex>
        </Box>

        {/* Payments Table */}
        <Box className="overflow-x-auto">
          {isLoading ? (
            <div className="space-y-4 mt-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} height="64px" />
              ))}
            </div>
          ) : recentPayments.length > 0 ? (
            <Table.Root variant="surface" className="w-full">
              <Table.Header>
                <Table.Row className="bg-gray-50/50">
                  <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                    <Flex align="center" gap="2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <Text size="2" weight="medium" className="text-gray-700">
                        Student
                      </Text>
                    </Flex>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                    <Text size="2" weight="medium" className="text-gray-700">
                      Receipt No.
                    </Text>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                    <Text size="2" weight="medium" className="text-gray-700">
                      Amount
                    </Text>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                    <Text size="2" weight="medium" className="text-gray-700">
                      Method
                    </Text>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                    <Text size="2" weight="medium" className="text-gray-700">
                      Date
                    </Text>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                    <Text size="2" weight="medium" className="text-gray-700">
                      Status
                    </Text>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                    <Text size="2" weight="medium" className="text-gray-700">
                      Actions
                    </Text>
                  </Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {recentPayments.map((payment, index) => (
                  <Table.Row
                    key={payment.id}
                    className={`hover:bg-gray-50/50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                  >
                    <Table.Cell className="py-4 px-6">
                      <Flex align="center" gap="3">
                        <Box className="p-2 bg-blue-100 rounded-lg">
                          <Users className="w-4 h-4 text-blue-600" />
                        </Box>
                        <Box>
                          <Text
                            size="2"
                            weight="medium"
                            className="text-gray-900 block"
                          >
                            {payment.studentName}
                          </Text>
                          <Text size="1" className="text-gray-600">
                            ID: {payment.studentId}
                          </Text>
                        </Box>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Text size="2" className="text-gray-700 font-mono">
                        {payment.receiptNumber}
                      </Text>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Text size="2" weight="medium" className="text-gray-900">
                        {formatCurrency(payment.paidAmount)}
                      </Text>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Flex align="center" gap="2">
                        {getPaymentMethodIcon(payment.paymentMethod)}
                        <Text size="2" className="text-gray-700 capitalize">
                          {payment.paymentMethod.replace('_', ' ')}
                        </Text>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Text size="2" className="text-gray-700">
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </Text>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Badge
                        color={getStatusColor(payment.status)}
                        variant="soft"
                        size="1"
                      >
                        {payment.status === 'completed' && (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        )}
                        {payment.status === 'failed' && (
                          <XCircle className="w-3 h-3 mr-1" />
                        )}
                        {payment.status === 'pending' && (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {payment.status.charAt(0).toUpperCase() +
                          payment.status.slice(1)}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Flex gap="1">
                        <RadixButton variant="ghost" size="1">
                          <Eye className="w-4 h-4" />
                        </RadixButton>
                        <RadixButton variant="ghost" size="1">
                          <Download className="w-4 h-4" />
                        </RadixButton>
                        <RadixButton variant="ghost" size="1">
                          <MoreHorizontal className="w-4 h-4" />
                        </RadixButton>
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          ) : (
            <Box className="p-12 text-center">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <Text size="3" className="text-gray-600 mb-2">
                No payments found
              </Text>
              <Text size="2" className="text-gray-500">
                Try adjusting your search or filter criteria
              </Text>
            </Box>
          )}
        </Box>

        {/* Show All Button */}
        {filteredPayments.length > 10 && (
          <Box className="p-6 border-t border-gray-100">
            <Flex justify="center">
              <RadixButton variant="outline" size="2">
                View All {filteredPayments.length} Payments
                <ChevronRight className="w-4 h-4 ml-1" />
              </RadixButton>
            </Flex>
          </Box>
        )}
      </RadixCard>

      {/* Quick Actions and Collection Performance */}
      <Grid columns="2" gap="6">
        {/* Quick Actions */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
            <Heading size="4" className="text-gray-900 mb-1">
              Quick Actions
            </Heading>
            <Text size="2" className="text-gray-600">
              Common tasks and operations
            </Text>
          </Box>

          <Box className="p-6">
            <Flex direction="column" gap="3">
              {dashboardData.quickActions?.map((action) => (
                <Box
                  key={action.id}
                  className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                >
                  <Flex align="center" gap="3">
                    <Box
                      className={`p-2 rounded-lg ${
                        action.urgent ? 'bg-red-100' : 'bg-blue-100'
                      }`}
                    >
                      <Box
                        className={`w-5 h-5 ${
                          action.urgent ? 'text-red-600' : 'text-blue-600'
                        }`}
                      >
                        {action.icon === 'Mail' && <Bell />}
                        {action.icon === 'FileText' && <FileText />}
                        {action.icon === 'RefreshCw' && <RefreshCw />}
                      </Box>
                    </Box>
                    <Box className="flex-1">
                      <Text
                        size="2"
                        weight="medium"
                        className="text-gray-900 block mb-1"
                      >
                        {action.title}
                      </Text>
                      <Text size="1" className="text-gray-600">
                        {action.description}
                      </Text>
                      {action.count && (
                        <Badge
                          color={action.urgent ? 'red' : 'blue'}
                          variant="soft"
                          size="1"
                          className="mt-2"
                        >
                          {action.count} items
                        </Badge>
                      )}
                    </Box>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Flex>
                </Box>
              ))}
            </Flex>
          </Box>
        </RadixCard>

        {/* Collection Performance */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
            <Flex justify="between" align="center">
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  <Flex align="center" gap="2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Collection Performance
                  </Flex>
                </Heading>
                <Text size="2" className="text-gray-600">
                  Monthly collection trends
                </Text>
              </Box>
              <Flex align="center" gap="1">
                <ArrowUpRight className="w-4 h-4 text-green-600" />
                <Text size="2" className="text-green-600 font-medium">
                  +8.5%
                </Text>
              </Flex>
            </Flex>
          </Box>

          <Box className="p-6">
            <Grid columns="2" gap="4">
              {dashboardData.collectionTrends?.map((trend, index) => (
                <Box
                  key={index}
                  className="text-center p-4 bg-gray-50 rounded-lg"
                >
                  <Text size="1" className="text-gray-600 block mb-1">
                    {trend.period}
                  </Text>
                  <Text
                    size="4"
                    weight="bold"
                    className="text-gray-900 block mb-2"
                  >
                    {formatCurrency(trend.collected)}
                  </Text>
                  <Box className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <Box
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${Math.min((trend.collected / (trend.target || trend.collected)) * 100, 100)}%`,
                      }}
                    />
                  </Box>
                  <Text size="1" className="text-gray-500">
                    Target: {formatCurrency(trend.target || 0)}
                  </Text>
                </Box>
              ))}
            </Grid>
          </Box>
        </RadixCard>
      </Grid>
    </Box>
  );
}
