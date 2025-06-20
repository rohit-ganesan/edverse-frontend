import { useState } from 'react';
import { Box, Flex, Text, Heading, Grid, Badge, Tabs } from '@radix-ui/themes';
import { DashboardLayout } from 'components/layout/DashboardLayout';
import { RadixCard } from 'components/ui/RadixCard';
import { RadixButton } from 'components/ui/RadixButton';
import { PageHeader } from 'components/ui/PageHeader';
import { StatsGrid } from 'components/ui/StatsGrid';
import { ActionCardGrid } from 'components/ui/ActionCardGrid';
import {
  CreditCard,
  DollarSign,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Bell,
  Mail,
  MessageSquare,
  Download,
  Upload,
  Plus,
  Search,
  Receipt,
  FileText,
  Send,
  User,
  Users,
  TrendingUp,
  BarChart3,
  PieChart,
  Wallet,
  Building,
  Phone,
  Eye,
  Edit,
  MoreHorizontal,
} from 'lucide-react';

interface FeeStructure {
  id: string;
  name: string;
  category: 'tuition' | 'hostel' | 'library' | 'lab' | 'exam' | 'miscellaneous';
  amount: number;
  dueDate: string;
  description: string;
  isRecurring: boolean;
  frequency?: 'monthly' | 'quarterly' | 'semester' | 'annual';
  applicableTo: 'all' | 'undergraduate' | 'graduate' | 'specific';
  department?: string;
}

interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  feeType: string;
  amount: number;
  paidAmount: number;
  remainingAmount: number;
  status: 'paid' | 'partial' | 'pending' | 'overdue';
  paymentDate?: string;
  dueDate: string;
  paymentMethod?: 'card' | 'bank_transfer' | 'cash' | 'check' | 'online';
  transactionId?: string;
  receiptNumber?: string;
  semester: string;
  year: string;
}

interface Reminder {
  id: string;
  type: 'email' | 'sms' | 'push' | 'call';
  recipients: string[];
  subject: string;
  message: string;
  scheduledDate: string;
  status: 'scheduled' | 'sent' | 'failed';
  feeCategory: string;
  priority: 'low' | 'medium' | 'high';
}

const mockFeeStructure: FeeStructure[] = [
  {
    id: '1',
    name: 'Tuition Fee - Fall 2024',
    category: 'tuition',
    amount: 15000,
    dueDate: '2024-01-30',
    description: 'Semester tuition fee for Fall 2024',
    isRecurring: true,
    frequency: 'semester',
    applicableTo: 'all',
  },
  {
    id: '2',
    name: 'Hostel Fee',
    category: 'hostel',
    amount: 3000,
    dueDate: '2024-01-15',
    description: 'Accommodation charges for hostel residents',
    isRecurring: true,
    frequency: 'semester',
    applicableTo: 'specific',
  },
  {
    id: '3',
    name: 'Library Fee',
    category: 'library',
    amount: 500,
    dueDate: '2024-01-20',
    description: 'Annual library membership and access fee',
    isRecurring: true,
    frequency: 'annual',
    applicableTo: 'all',
  },
  {
    id: '4',
    name: 'Computer Lab Fee',
    category: 'lab',
    amount: 1200,
    dueDate: '2024-02-01',
    description: 'Computer lab usage and maintenance fee',
    isRecurring: true,
    frequency: 'semester',
    applicableTo: 'specific',
    department: 'Computer Science',
  },
];

const mockPayments: Payment[] = [
  {
    id: '1',
    studentId: 'STU001',
    studentName: 'Alice Johnson',
    feeType: 'Tuition Fee - Fall 2024',
    amount: 15000,
    paidAmount: 15000,
    remainingAmount: 0,
    status: 'paid',
    paymentDate: '2024-01-15',
    dueDate: '2024-01-30',
    paymentMethod: 'online',
    transactionId: 'TXN123456789',
    receiptNumber: 'RCP001',
    semester: 'Fall',
    year: '2024',
  },
  {
    id: '2',
    studentId: 'STU002',
    studentName: 'Bob Smith',
    feeType: 'Tuition Fee - Fall 2024',
    amount: 15000,
    paidAmount: 7500,
    remainingAmount: 7500,
    status: 'partial',
    paymentDate: '2024-01-10',
    dueDate: '2024-01-30',
    paymentMethod: 'bank_transfer',
    transactionId: 'TXN123456790',
    receiptNumber: 'RCP002',
    semester: 'Fall',
    year: '2024',
  },
  {
    id: '3',
    studentId: 'STU003',
    studentName: 'Carol Davis',
    feeType: 'Tuition Fee - Fall 2024',
    amount: 15000,
    paidAmount: 0,
    remainingAmount: 15000,
    status: 'overdue',
    dueDate: '2024-01-30',
    semester: 'Fall',
    year: '2024',
  },
  {
    id: '4',
    studentId: 'STU004',
    studentName: 'David Wilson',
    feeType: 'Hostel Fee',
    amount: 3000,
    paidAmount: 0,
    remainingAmount: 3000,
    status: 'pending',
    dueDate: '2024-02-15',
    semester: 'Fall',
    year: '2024',
  },
];

const mockReminders: Reminder[] = [
  {
    id: '1',
    type: 'email',
    recipients: ['alice.johnson@student.edu', 'bob.smith@student.edu'],
    subject: 'Tuition Fee Payment Reminder',
    message:
      'This is a friendly reminder that your tuition fee payment is due in 3 days.',
    scheduledDate: '2024-01-27',
    status: 'scheduled',
    feeCategory: 'tuition',
    priority: 'high',
  },
  {
    id: '2',
    type: 'sms',
    recipients: ['+1234567890', '+1234567891'],
    subject: 'Fee Payment Due',
    message:
      'Your hostel fee payment is due tomorrow. Please make the payment to avoid late fees.',
    scheduledDate: '2024-01-14',
    status: 'sent',
    feeCategory: 'hostel',
    priority: 'medium',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'paid':
      return 'green';
    case 'partial':
      return 'yellow';
    case 'pending':
      return 'blue';
    case 'overdue':
      return 'red';
    default:
      return 'gray';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'paid':
      return CheckCircle;
    case 'partial':
      return Clock;
    case 'pending':
      return AlertTriangle;
    case 'overdue':
      return XCircle;
    default:
      return AlertTriangle;
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'tuition':
      return FileText;
    case 'hostel':
      return Building;
    case 'library':
      return FileText;
    case 'lab':
      return Users;
    case 'exam':
      return Receipt;
    case 'miscellaneous':
      return DollarSign;
    default:
      return DollarSign;
  }
};

const getReminderIcon = (type: string) => {
  switch (type) {
    case 'email':
      return Mail;
    case 'sms':
      return MessageSquare;
    case 'push':
      return Bell;
    case 'call':
      return Phone;
    default:
      return Bell;
  }
};

export function FeePage(): JSX.Element {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredPayments = mockPayments.filter((payment) => {
    const matchesSearch =
      payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.feeType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === 'all' || payment.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalFees = mockPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalCollected = mockPayments.reduce((sum, p) => sum + p.paidAmount, 0);
  const totalPending = mockPayments.reduce(
    (sum, p) => sum + p.remainingAmount,
    0
  );
  const overduePayments = mockPayments.filter(
    (p) => p.status === 'overdue'
  ).length;
  const collectionRate =
    totalFees > 0 ? Math.round((totalCollected / totalFees) * 100) : 0;

  return (
    <DashboardLayout>
      <PageHeader
        title="Fee Management"
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
            value: `$${totalCollected.toLocaleString()}`,
            icon: DollarSign,
            iconColor: 'text-green-600',
            iconBgColor: 'bg-green-100',
          },
          {
            title: 'Pending Amount',
            value: `$${totalPending.toLocaleString()}`,
            icon: AlertTriangle,
            iconColor: 'text-orange-600',
            iconBgColor: 'bg-orange-100',
          },
          {
            title: 'Collection Rate',
            value: `${collectionRate}%`,
            icon: TrendingUp,
            iconColor: 'text-blue-600',
            iconBgColor: 'bg-blue-100',
          },
          {
            title: 'Overdue Payments',
            value: overduePayments.toString(),
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

        {/* Overview Tab */}
        <Tabs.Content value="overview">
          <Grid columns="2" gap="6">
            {/* Recent Payments */}
            <RadixCard className="p-6">
              <Heading size="4" className="mb-4">
                Recent Payments
              </Heading>
              <Flex direction="column" gap="4">
                {mockPayments.slice(0, 5).map((payment) => {
                  const StatusIcon = getStatusIcon(payment.status);
                  return (
                    <Box key={payment.id} className="p-4 bg-gray-50 rounded-lg">
                      <Flex justify="between" align="start" className="mb-2">
                        <Box>
                          <Text
                            size="3"
                            weight="medium"
                            className="text-gray-900"
                          >
                            {payment.studentName}
                          </Text>
                          <Text size="2" className="text-gray-600">
                            {payment.feeType}
                          </Text>
                        </Box>
                        <Badge color={getStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                      </Flex>
                      <Flex justify="between" align="center">
                        <Text size="2" className="text-gray-600">
                          ${payment.paidAmount.toLocaleString()} / $
                          {payment.amount.toLocaleString()}
                        </Text>
                        <Text size="2" className="text-gray-500">
                          {payment.paymentDate
                            ? new Date(payment.paymentDate).toLocaleDateString()
                            : 'Not paid'}
                        </Text>
                      </Flex>
                    </Box>
                  );
                })}
              </Flex>
            </RadixCard>

            {/* Overdue Payments */}
            <RadixCard className="p-6">
              <Heading size="4" className="mb-4">
                Overdue Payments
              </Heading>
              <Flex direction="column" gap="4">
                {mockPayments
                  .filter((p) => p.status === 'overdue')
                  .map((payment) => (
                    <Box
                      key={payment.id}
                      className="p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg"
                    >
                      <Flex justify="between" align="start" className="mb-2">
                        <Box>
                          <Text
                            size="3"
                            weight="medium"
                            className="text-red-800"
                          >
                            {payment.studentName}
                          </Text>
                          <Text size="2" className="text-red-600">
                            {payment.feeType} • Due:{' '}
                            {new Date(payment.dueDate).toLocaleDateString()}
                          </Text>
                        </Box>
                        <Text size="3" weight="bold" className="text-red-600">
                          ${payment.remainingAmount.toLocaleString()}
                        </Text>
                      </Flex>
                      <Flex gap="2">
                        <RadixButton
                          variant="solid"
                          size="1"
                          className="bg-red-600"
                        >
                          <Send className="w-3 h-3 mr-1" />
                          Send Reminder
                        </RadixButton>
                        <RadixButton variant="outline" size="1">
                          <Phone className="w-3 h-3 mr-1" />
                          Call
                        </RadixButton>
                      </Flex>
                    </Box>
                  ))}
              </Flex>
            </RadixCard>

            {/* Payment Methods Distribution */}
            <RadixCard className="p-6">
              <Heading size="4" className="mb-4">
                Payment Methods
              </Heading>
              <Flex direction="column" gap="3">
                <Flex justify="between" align="center">
                  <Flex align="center" gap="2">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <Text size="2" className="text-gray-600">
                      Online Payment
                    </Text>
                  </Flex>
                  <Text size="2" weight="medium">
                    45%
                  </Text>
                </Flex>
                <Flex justify="between" align="center">
                  <Flex align="center" gap="2">
                    <Building className="w-4 h-4 text-green-600" />
                    <Text size="2" className="text-gray-600">
                      Bank Transfer
                    </Text>
                  </Flex>
                  <Text size="2" weight="medium">
                    30%
                  </Text>
                </Flex>
                <Flex justify="between" align="center">
                  <Flex align="center" gap="2">
                    <Wallet className="w-4 h-4 text-purple-600" />
                    <Text size="2" className="text-gray-600">
                      Cash
                    </Text>
                  </Flex>
                  <Text size="2" weight="medium">
                    20%
                  </Text>
                </Flex>
                <Flex justify="between" align="center">
                  <Flex align="center" gap="2">
                    <Receipt className="w-4 h-4 text-orange-600" />
                    <Text size="2" className="text-gray-600">
                      Check
                    </Text>
                  </Flex>
                  <Text size="2" weight="medium">
                    5%
                  </Text>
                </Flex>
              </Flex>
            </RadixCard>

            {/* Upcoming Due Dates */}
            <RadixCard className="p-6">
              <Heading size="4" className="mb-4">
                Upcoming Due Dates
              </Heading>
              <Flex direction="column" gap="3">
                {mockFeeStructure.map((fee) => (
                  <Flex
                    key={fee.id}
                    justify="between"
                    align="center"
                    className="p-3 bg-yellow-50 rounded-lg"
                  >
                    <Box>
                      <Text
                        size="2"
                        weight="medium"
                        className="text-yellow-800"
                      >
                        {fee.name}
                      </Text>
                      <Text size="1" className="text-yellow-600">
                        Due: {new Date(fee.dueDate).toLocaleDateString()}
                      </Text>
                    </Box>
                    <Text size="2" weight="bold" className="text-yellow-600">
                      ${fee.amount.toLocaleString()}
                    </Text>
                  </Flex>
                ))}
              </Flex>
            </RadixCard>
          </Grid>
        </Tabs.Content>

        {/* Payments Tab */}
        <Tabs.Content value="payments">
          {/* Search and Filter */}
          <Flex justify="between" align="center" className="mb-6">
            <Flex gap="3" align="center">
              <Box className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </Box>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </select>
            </Flex>
          </Flex>

          {/* Payments Table */}
          <RadixCard className="p-6">
            <Heading size="4" className="mb-4">
              Payment Records
            </Heading>
            <Grid columns="1" gap="3">
              {filteredPayments.map((payment) => {
                const StatusIcon = getStatusIcon(payment.status);
                return (
                  <Box
                    key={payment.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <Flex justify="between" align="start">
                      <Flex gap="4" align="start" className="flex-1">
                        <Box className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <User className="w-6 h-6 text-blue-600" />
                        </Box>
                        <Box className="flex-1">
                          <Flex align="center" gap="3" className="mb-2">
                            <Text
                              size="3"
                              weight="medium"
                              className="text-gray-900"
                            >
                              {payment.studentName}
                            </Text>
                            <Badge color={getStatusColor(payment.status)}>
                              {payment.status}
                            </Badge>
                          </Flex>

                          <Text size="2" className="text-gray-600 mb-2">
                            {payment.studentId} • {payment.feeType}
                          </Text>

                          <Grid columns="4" gap="4" className="mb-2">
                            <Text size="2" className="text-gray-600">
                              <DollarSign className="w-4 h-4 inline mr-1" />
                              Amount: ${payment.amount.toLocaleString()}
                            </Text>
                            <Text size="2" className="text-gray-600">
                              <CheckCircle className="w-4 h-4 inline mr-1" />
                              Paid: ${payment.paidAmount.toLocaleString()}
                            </Text>
                            <Text size="2" className="text-gray-600">
                              <Clock className="w-4 h-4 inline mr-1" />
                              Remaining: $
                              {payment.remainingAmount.toLocaleString()}
                            </Text>
                            <Text size="2" className="text-gray-600">
                              <Calendar className="w-4 h-4 inline mr-1" />
                              Due:{' '}
                              {new Date(payment.dueDate).toLocaleDateString()}
                            </Text>
                          </Grid>

                          {payment.paymentDate && (
                            <Flex gap="4">
                              <Text size="2" className="text-gray-600">
                                Payment Date:{' '}
                                {new Date(
                                  payment.paymentDate
                                ).toLocaleDateString()}
                              </Text>
                              {payment.paymentMethod && (
                                <Text size="2" className="text-gray-600">
                                  Method:{' '}
                                  {payment.paymentMethod.replace('_', ' ')}
                                </Text>
                              )}
                              {payment.transactionId && (
                                <Text size="2" className="text-gray-600">
                                  Transaction: {payment.transactionId}
                                </Text>
                              )}
                            </Flex>
                          )}
                        </Box>
                      </Flex>

                      <Flex gap="2">
                        {payment.status !== 'paid' && (
                          <RadixButton variant="solid" size="2">
                            <CreditCard className="w-4 h-4 mr-2" />
                            Pay Now
                          </RadixButton>
                        )}
                        <RadixButton variant="outline" size="2">
                          <Eye className="w-4 h-4" />
                        </RadixButton>
                        {payment.receiptNumber && (
                          <RadixButton variant="outline" size="2">
                            <Download className="w-4 h-4" />
                          </RadixButton>
                        )}
                        <RadixButton variant="ghost" size="2">
                          <MoreHorizontal className="w-4 h-4" />
                        </RadixButton>
                      </Flex>
                    </Flex>
                  </Box>
                );
              })}
            </Grid>
          </RadixCard>
        </Tabs.Content>

        {/* Fee Structure Tab */}
        <Tabs.Content value="structure">
          <Grid columns="2" gap="6">
            {mockFeeStructure.map((fee) => {
              const CategoryIcon = getCategoryIcon(fee.category);
              return (
                <RadixCard
                  key={fee.id}
                  className="p-6 hover:shadow-lg transition-shadow"
                >
                  <Flex direction="column" gap="4">
                    <Flex justify="between" align="start">
                      <Box className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <CategoryIcon className="w-6 h-6 text-purple-600" />
                      </Box>
                      <Badge color="purple">{fee.category}</Badge>
                    </Flex>

                    <Box>
                      <Heading size="4" className="text-gray-900 mb-2">
                        {fee.name}
                      </Heading>
                      <Text size="2" className="text-gray-600 mb-3">
                        {fee.description}
                      </Text>
                      <Text
                        size="4"
                        weight="bold"
                        className="text-green-600 mb-2"
                      >
                        ${fee.amount.toLocaleString()}
                      </Text>
                    </Box>

                    <Flex direction="column" gap="2">
                      <Text size="2" className="text-gray-600">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Due Date: {new Date(fee.dueDate).toLocaleDateString()}
                      </Text>
                      <Text size="2" className="text-gray-600">
                        <Users className="w-4 h-4 inline mr-1" />
                        Applicable To: {fee.applicableTo}
                      </Text>
                      {fee.isRecurring && (
                        <Text size="2" className="text-gray-600">
                          <Clock className="w-4 h-4 inline mr-1" />
                          Frequency: {fee.frequency}
                        </Text>
                      )}
                      {fee.department && (
                        <Text size="2" className="text-gray-600">
                          <Building className="w-4 h-4 inline mr-1" />
                          Department: {fee.department}
                        </Text>
                      )}
                    </Flex>

                    <Flex gap="2">
                      <RadixButton
                        variant="outline"
                        size="2"
                        className="flex-1"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </RadixButton>
                      <RadixButton variant="outline" size="2">
                        <Eye className="w-4 h-4" />
                      </RadixButton>
                    </Flex>
                  </Flex>
                </RadixCard>
              );
            })}
          </Grid>
        </Tabs.Content>

        {/* Reminders Tab */}
        <Tabs.Content value="reminders">
          <Box className="mb-6">
            <Flex justify="between" align="center" className="mb-4">
              <Heading size="5" className="text-gray-900">
                Payment Reminders & Notifications
              </Heading>
              <RadixButton variant="solid" size="3">
                <Plus className="w-4 h-4 mr-2" />
                Create Reminder
              </RadixButton>
            </Flex>

            {/* Reminder Templates */}
            <Grid columns="3" gap="4" className="mb-6">
              <RadixCard className="p-4 bg-blue-50 border border-blue-200">
                <Flex direction="column" gap="3">
                  <Flex align="center" gap="2">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <Text size="3" weight="medium" className="text-blue-800">
                      Email Reminder
                    </Text>
                  </Flex>
                  <Text size="2" className="text-blue-600">
                    Send automated email reminders to students about upcoming
                    payments
                  </Text>
                  <RadixButton variant="solid" size="2" className="bg-blue-600">
                    Configure
                  </RadixButton>
                </Flex>
              </RadixCard>

              <RadixCard className="p-4 bg-green-50 border border-green-200">
                <Flex direction="column" gap="3">
                  <Flex align="center" gap="2">
                    <MessageSquare className="w-5 h-5 text-green-600" />
                    <Text size="3" weight="medium" className="text-green-800">
                      SMS Alerts
                    </Text>
                  </Flex>
                  <Text size="2" className="text-green-600">
                    Send SMS notifications for urgent payment reminders
                  </Text>
                  <RadixButton
                    variant="solid"
                    size="2"
                    className="bg-green-600"
                  >
                    Configure
                  </RadixButton>
                </Flex>
              </RadixCard>

              <RadixCard className="p-4 bg-purple-50 border border-purple-200">
                <Flex direction="column" gap="3">
                  <Flex align="center" gap="2">
                    <Phone className="w-5 h-5 text-purple-600" />
                    <Text size="3" weight="medium" className="text-purple-800">
                      Phone Calls
                    </Text>
                  </Flex>
                  <Text size="2" className="text-purple-600">
                    Schedule follow-up calls for overdue payments
                  </Text>
                  <RadixButton
                    variant="solid"
                    size="2"
                    className="bg-purple-600"
                  >
                    Configure
                  </RadixButton>
                </Flex>
              </RadixCard>
            </Grid>
          </Box>

          {/* Active Reminders */}
          <RadixCard className="p-6">
            <Heading size="4" className="mb-4">
              Active Reminders
            </Heading>
            <Grid columns="1" gap="4">
              {mockReminders.map((reminder) => {
                const ReminderIcon = getReminderIcon(reminder.type);
                return (
                  <Box
                    key={reminder.id}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <Flex justify="between" align="start">
                      <Flex gap="4" align="start" className="flex-1">
                        <Box className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <ReminderIcon className="w-5 h-5 text-blue-600" />
                        </Box>
                        <Box className="flex-1">
                          <Flex align="center" gap="3" className="mb-2">
                            <Text
                              size="3"
                              weight="medium"
                              className="text-gray-900"
                            >
                              {reminder.subject}
                            </Text>
                            <Badge
                              color={
                                reminder.status === 'sent'
                                  ? 'green'
                                  : reminder.status === 'scheduled'
                                    ? 'blue'
                                    : 'red'
                              }
                            >
                              {reminder.status}
                            </Badge>
                            <Badge color="gray">{reminder.type}</Badge>
                          </Flex>

                          <Text size="2" className="text-gray-600 mb-2">
                            {reminder.message}
                          </Text>

                          <Flex gap="4">
                            <Text size="2" className="text-gray-600">
                              <Calendar className="w-4 h-4 inline mr-1" />
                              Scheduled:{' '}
                              {new Date(
                                reminder.scheduledDate
                              ).toLocaleDateString()}
                            </Text>
                            <Text size="2" className="text-gray-600">
                              <Users className="w-4 h-4 inline mr-1" />
                              Recipients: {reminder.recipients.length}
                            </Text>
                            <Text size="2" className="text-gray-600">
                              <FileText className="w-4 h-4 inline mr-1" />
                              Category: {reminder.feeCategory}
                            </Text>
                          </Flex>
                        </Box>
                      </Flex>

                      <Flex gap="2">
                        <RadixButton variant="outline" size="2">
                          <Eye className="w-4 h-4" />
                        </RadixButton>
                        <RadixButton variant="outline" size="2">
                          <Edit className="w-4 h-4" />
                        </RadixButton>
                        {reminder.status === 'scheduled' && (
                          <RadixButton variant="solid" size="2">
                            <Send className="w-4 h-4" />
                          </RadixButton>
                        )}
                      </Flex>
                    </Flex>
                  </Box>
                );
              })}
            </Grid>
          </RadixCard>
        </Tabs.Content>

        {/* Analytics Tab */}
        <Tabs.Content value="analytics">
          <Grid columns="2" gap="6">
            <RadixCard className="p-6">
              <Heading size="4" className="mb-4">
                Revenue Trends
              </Heading>
              <Box className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <Flex direction="column" align="center" gap="2">
                  <BarChart3 className="w-12 h-12 text-gray-400" />
                  <Text size="2" className="text-gray-600">
                    Revenue analytics chart
                  </Text>
                </Flex>
              </Box>
            </RadixCard>

            <RadixCard className="p-6">
              <Heading size="4" className="mb-4">
                Collection Performance
              </Heading>
              <Flex direction="column" gap="4">
                <Flex justify="between" align="center">
                  <Text size="2" className="text-gray-600">
                    Collection Rate
                  </Text>
                  <Text size="2" weight="bold" className="text-green-600">
                    {collectionRate}%
                  </Text>
                </Flex>
                <Flex justify="between" align="center">
                  <Text size="2" className="text-gray-600">
                    Average Payment Time
                  </Text>
                  <Text size="2" weight="bold" className="text-blue-600">
                    5.2 days
                  </Text>
                </Flex>
                <Flex justify="between" align="center">
                  <Text size="2" className="text-gray-600">
                    Late Payment Rate
                  </Text>
                  <Text size="2" weight="bold" className="text-orange-600">
                    12%
                  </Text>
                </Flex>
                <Flex justify="between" align="center">
                  <Text size="2" className="text-gray-600">
                    Default Rate
                  </Text>
                  <Text size="2" weight="bold" className="text-red-600">
                    3%
                  </Text>
                </Flex>
              </Flex>
            </RadixCard>

            <RadixCard className="p-6">
              <Heading size="4" className="mb-4">
                Fee Category Breakdown
              </Heading>
              <Box className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <Flex direction="column" align="center" gap="2">
                  <PieChart className="w-12 h-12 text-gray-400" />
                  <Text size="2" className="text-gray-600">
                    Fee distribution chart
                  </Text>
                </Flex>
              </Box>
            </RadixCard>

            <RadixCard className="p-6">
              <Heading size="4" className="mb-4">
                Monthly Collections
              </Heading>
              <Flex direction="column" gap="3">
                <Flex justify="between" align="center">
                  <Text size="2" className="text-gray-600">
                    January 2024
                  </Text>
                  <Text size="2" weight="medium">
                    $125,000
                  </Text>
                </Flex>
                <Flex justify="between" align="center">
                  <Text size="2" className="text-gray-600">
                    December 2023
                  </Text>
                  <Text size="2" weight="medium">
                    $118,500
                  </Text>
                </Flex>
                <Flex justify="between" align="center">
                  <Text size="2" className="text-gray-600">
                    November 2023
                  </Text>
                  <Text size="2" weight="medium">
                    $132,000
                  </Text>
                </Flex>
                <Flex justify="between" align="center">
                  <Text size="2" className="text-gray-600">
                    October 2023
                  </Text>
                  <Text size="2" weight="medium">
                    $145,200
                  </Text>
                </Flex>
              </Flex>
            </RadixCard>
          </Grid>
        </Tabs.Content>
      </Tabs.Root>
    </DashboardLayout>
  );
}
