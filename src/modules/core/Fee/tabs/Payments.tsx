import { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Heading,
  TextField,
  Select,
  Badge,
  Table,
} from '@radix-ui/themes';
import { RadixCard } from 'components/ui/RadixCard';
import { RadixButton } from 'components/ui/RadixButton';
import { FeatureGate } from '../../../../components/guards/FeatureGate';
import { UpgradeHint } from '../../../../components/upsell/UpgradeHint';
import { InlineUpgradeHint } from '../../../../components/upsell/InlineUpgradeHint';
import { CapabilityGate } from '../../../../components/guards/CapabilityGate';
import {
  Search,
  Download,
  Filter,
  Eye,
  Edit,
  MoreHorizontal,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  User,
  DollarSign,
  CreditCard,
  Receipt,
  Calendar,
  Plus,
} from 'lucide-react';
import { useFeeData } from '../hooks/useFeeData';
import {
  SkeletonCard,
  SkeletonTableRow,
} from '../../../../components/ui/Skeleton';

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
    case 'paid':
      return <CheckCircle className="w-4 h-4" />;
    case 'pending':
    case 'processing':
      return <Clock className="w-4 h-4" />;
    case 'failed':
    case 'declined':
      return <XCircle className="w-4 h-4" />;
    case 'refunded':
      return <AlertTriangle className="w-4 h-4" />;
    default:
      return <DollarSign className="w-4 h-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
    case 'paid':
      return 'green';
    case 'pending':
    case 'processing':
      return 'blue';
    case 'failed':
    case 'declined':
      return 'red';
    case 'refunded':
      return 'orange';
    case 'partial':
      return 'purple';
    default:
      return 'gray';
  }
};

const getMethodIcon = (method: string) => {
  switch (method) {
    case 'credit_card':
    case 'debit_card':
      return <CreditCard className="w-3 h-3" />;
    case 'bank_transfer':
      return <Receipt className="w-3 h-3" />;
    case 'cash':
      return <DollarSign className="w-3 h-3" />;
    default:
      return <DollarSign className="w-3 h-3" />;
  }
};

export function Payments({
  isLoading = false,
}: {
  isLoading?: boolean;
}): JSX.Element {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedMethod, setSelectedMethod] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('all');

  const { payments } = useFeeData();

  // Filter payments based on search and filters
  const filteredPayments =
    payments?.filter((payment) => {
      const matchesSearch =
        payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (payment.transactionId &&
          payment.transactionId
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        payment.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === 'all' || payment.status === selectedStatus;
      const matchesMethod =
        selectedMethod === 'all' || payment.paymentMethod === selectedMethod;
      // Date range filtering would be implemented based on selectedDateRange

      return matchesSearch && matchesStatus && matchesMethod;
    }) || [];

  const handleExportPayments = () => {
    console.log('Exporting payments...');
    // Implementation would export payments data
  };

  return (
    <Box className="space-y-8">
      {/* Payments Table */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        {/* Header Section */}
        <Box className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
          <Flex justify="between" align="center" className="mb-6">
            <Box>
              <Heading size="5" className="text-gray-900 mb-1">
                Payment Records
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
                Advanced Filter
              </RadixButton>
              <RadixButton
                variant="soft"
                size="2"
                className="bg-white/70 hover:bg-white"
                onClick={handleExportPayments}
              >
                <Download className="w-4 h-4 mr-1" />
                Export
              </RadixButton>
              <FeatureGate
                feature="fees.record_manual"
                fallback={
                  <InlineUpgradeHint
                    neededPlan="starter"
                    message="Manual fee recording requires the Starter plan."
                    context="fees.record_manual"
                  />
                }
              >
                <CapabilityGate
                  cap="fees.record_manual"
                  fallback={
                    <InlineUpgradeHint
                      neededPlan="starter"
                      message="Manual fee recording requires the Starter plan."
                      context="fees.record_manual"
                    />
                  }
                >
                  <RadixButton
                    variant="solid"
                    size="2"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Record Payment
                  </RadixButton>
                </CapabilityGate>
              </FeatureGate>
            </Flex>
          </Flex>

          {/* Filters */}
          <Flex gap="4" wrap="wrap">
            {/* Search Input */}
            <Box className="flex-1 min-w-[250px]">
              <TextField.Root
                placeholder="Search by student name, ID, or transaction..."
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

            {/* Status Filter */}
            <Box className="min-w-[150px]">
              <Select.Root
                value={selectedStatus}
                onValueChange={setSelectedStatus}
                size="2"
              >
                <Select.Trigger className="w-full" />
                <Select.Content>
                  <Select.Item value="all">All Status</Select.Item>
                  <Select.Item value="completed">Completed</Select.Item>
                  <Select.Item value="pending">Pending</Select.Item>
                  <Select.Item value="processing">Processing</Select.Item>
                  <Select.Item value="failed">Failed</Select.Item>
                  <Select.Item value="refunded">Refunded</Select.Item>
                  <Select.Item value="partial">Partial</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>

            {/* Method Filter */}
            <Box className="min-w-[150px]">
              <Select.Root
                value={selectedMethod}
                onValueChange={setSelectedMethod}
                size="2"
              >
                <Select.Trigger className="w-full" />
                <Select.Content>
                  <Select.Item value="all">All Methods</Select.Item>
                  <Select.Item value="credit_card">Credit Card</Select.Item>
                  <Select.Item value="debit_card">Debit Card</Select.Item>
                  <Select.Item value="bank_transfer">Bank Transfer</Select.Item>
                  <Select.Item value="cash">Cash</Select.Item>
                  <Select.Item value="check">Check</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>

            {/* Date Range Filter */}
            <Box className="min-w-[150px]">
              <Select.Root
                value={selectedDateRange}
                onValueChange={setSelectedDateRange}
                size="2"
              >
                <Select.Trigger className="w-full" />
                <Select.Content>
                  <Select.Item value="all">All Time</Select.Item>
                  <Select.Item value="today">Today</Select.Item>
                  <Select.Item value="week">This Week</Select.Item>
                  <Select.Item value="month">This Month</Select.Item>
                  <Select.Item value="quarter">This Quarter</Select.Item>
                  <Select.Item value="year">This Year</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>
          </Flex>
        </Box>

        {/* Payments Table */}
        <Box className="overflow-x-auto">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonTableRow key={i} columns={6} className="mb-2" />
              ))}
            </div>
          ) : filteredPayments.length > 0 ? (
            <Table.Root variant="surface" className="w-full">
              <Table.Header>
                <Table.Row className="bg-gray-50/50">
                  <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                    <Flex align="center" gap="2">
                      <User className="w-4 h-4 text-gray-500" />
                      <Text size="2" weight="medium" className="text-gray-700">
                        Student
                      </Text>
                    </Flex>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                    <Text size="2" weight="medium" className="text-gray-700">
                      Transaction ID
                    </Text>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                    <Text size="2" weight="medium" className="text-gray-700">
                      Amount
                    </Text>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                    <Text size="2" weight="medium" className="text-gray-700">
                      Fee Type
                    </Text>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                    <Text size="2" weight="medium" className="text-gray-700">
                      Method
                    </Text>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                    <Text size="2" weight="medium" className="text-gray-700">
                      Status
                    </Text>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                    <Text size="2" weight="medium" className="text-gray-700">
                      Date
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
                {filteredPayments.map((payment, index) => (
                  <Table.Row
                    key={payment.id}
                    className={`hover:bg-gray-50/50 transition-colors animate-in slide-in-from-bottom-1 duration-300 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Table.Cell className="py-4 px-6">
                      <Flex align="center" gap="3">
                        <Box
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            payment.status === 'completed'
                              ? 'bg-green-100 ring-2 ring-green-200'
                              : payment.status === 'pending'
                                ? 'bg-blue-100 ring-2 ring-blue-200'
                                : payment.status === 'failed'
                                  ? 'bg-red-100 ring-2 ring-red-200'
                                  : 'bg-orange-100 ring-2 ring-orange-200'
                          }`}
                        >
                          <User
                            className={`w-4 h-4 ${
                              payment.status === 'completed'
                                ? 'text-green-600'
                                : payment.status === 'pending'
                                  ? 'text-blue-600'
                                  : payment.status === 'failed'
                                    ? 'text-red-600'
                                    : 'text-orange-600'
                            }`}
                          />
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
                            {payment.studentId}
                          </Text>
                        </Box>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Text size="2" weight="medium" className="text-gray-900">
                        {payment.transactionId || payment.receiptNumber}
                      </Text>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Flex align="center" gap="2">
                        <DollarSign className="w-3 h-3 text-gray-500" />
                        <Text
                          size="2"
                          weight="medium"
                          className="text-gray-900"
                        >
                          ${payment.paidAmount.toLocaleString()}
                        </Text>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Text size="2" className="text-gray-900">
                        Fee Payment
                      </Text>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Flex align="center" gap="2">
                        {getMethodIcon(payment.paymentMethod)}
                        <Badge
                          color={
                            payment.paymentMethod === 'card' ||
                            payment.paymentMethod === 'online'
                              ? 'blue'
                              : payment.paymentMethod === 'bank_transfer'
                                ? 'green'
                                : payment.paymentMethod === 'cash'
                                  ? 'orange'
                                  : 'gray'
                          }
                          variant="outline"
                          size="1"
                        >
                          {payment.paymentMethod.replace('_', ' ')}
                        </Badge>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Flex align="center" gap="2">
                        {getStatusIcon(payment.status)}
                        <Badge
                          color={getStatusColor(payment.status)}
                          variant="soft"
                          size="1"
                        >
                          {payment.status}
                        </Badge>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Flex align="center" gap="2">
                        <Calendar className="w-3 h-3 text-gray-500" />
                        <Text size="2" className="text-gray-900">
                          {new Date(payment.paymentDate).toLocaleDateString()}
                        </Text>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Flex gap="1">
                        <RadixButton
                          variant="ghost"
                          size="1"
                          className="hover:bg-blue-50"
                          title="View Receipt"
                        >
                          <Eye className="w-3 h-3" />
                        </RadixButton>
                        <RadixButton
                          variant="ghost"
                          size="1"
                          className="hover:bg-orange-50"
                          title="Edit Payment"
                        >
                          <Edit className="w-3 h-3" />
                        </RadixButton>
                        <RadixButton
                          variant="ghost"
                          size="1"
                          className="hover:bg-green-50"
                          title="Download Receipt"
                        >
                          <Download className="w-3 h-3" />
                        </RadixButton>
                        <RadixButton
                          variant="ghost"
                          size="1"
                          className="hover:bg-gray-50"
                          title="More Actions"
                        >
                          <MoreHorizontal className="w-3 h-3" />
                        </RadixButton>
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          ) : (
            <Box className="text-center py-16">
              <Box className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-gray-400" />
              </Box>
              <Text size="3" weight="medium" className="text-gray-900 mb-2">
                No payments found
              </Text>
              <Text size="2" className="text-gray-500 mb-4">
                {searchTerm ||
                selectedStatus !== 'all' ||
                selectedMethod !== 'all'
                  ? 'Try adjusting your search criteria'
                  : 'No payments have been recorded yet'}
              </Text>
              {searchTerm ||
              selectedStatus !== 'all' ||
              selectedMethod !== 'all' ? (
                <RadixButton
                  variant="soft"
                  size="3"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedStatus('all');
                    setSelectedMethod('all');
                    setSelectedDateRange('all');
                  }}
                >
                  Clear Filters
                </RadixButton>
              ) : (
                <FeatureGate
                  feature="fees.record_manual"
                  fallback={
                    <InlineUpgradeHint
                      neededPlan="starter"
                      message="Manual fee recording requires the Starter plan."
                      context="fees.record_manual"
                    />
                  }
                >
                  <CapabilityGate
                    cap="fees.record_manual"
                    fallback={
                      <InlineUpgradeHint
                        neededPlan="starter"
                        message="Manual fee recording requires the Starter plan."
                        context="fees.record_manual"
                      />
                    }
                  >
                    <RadixButton
                      variant="solid"
                      size="3"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Record Payment
                    </RadixButton>
                  </CapabilityGate>
                </FeatureGate>
              )}
            </Box>
          )}
        </Box>

        {/* Pagination */}
        {filteredPayments.length > 10 && (
          <Box className="p-6 border-t border-gray-100 bg-gray-50/30">
            <Flex justify="between" align="center">
              <Text size="2" className="text-gray-600">
                Showing {filteredPayments.length} of {filteredPayments.length}{' '}
                payments
              </Text>
              <Flex gap="2">
                <RadixButton variant="soft" size="2" disabled>
                  Previous
                </RadixButton>
                <RadixButton variant="soft" size="2" disabled>
                  Next
                </RadixButton>
              </Flex>
            </Flex>
          </Box>
        )}
      </RadixCard>
    </Box>
  );
}
