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
} from '@radix-ui/themes';
import { RadixCard } from 'components/ui/RadixCard';
import { RadixButton } from 'components/ui/RadixButton';
import {
  Download,
  Calendar,
  FileText,
  TrendingUp,
  DollarSign,
  Users,
  Filter,
  BarChart3,
  PieChart,
  FileSpreadsheet,
  FileBarChart,
  Clock,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
  Search,
  FileIcon,
} from 'lucide-react';

export function Reports(): JSX.Element {
  const [reportType, setReportType] = useState('collection');
  const [dateRange, setDateRange] = useState('this_month');
  const [format, setFormat] = useState('pdf');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const reportTypes = [
    {
      value: 'collection',
      label: 'Collection Report',
      description: 'Fee collection summary and trends',
      icon: <TrendingUp className="w-4 h-4" />,
      color: 'bg-blue-500',
    },
    {
      value: 'outstanding',
      label: 'Outstanding Fees',
      description: 'Unpaid fees and overdue amounts',
      icon: <AlertCircle className="w-4 h-4" />,
      color: 'bg-red-500',
    },
    {
      value: 'refunds',
      label: 'Refunds Report',
      description: 'Refund requests and processed refunds',
      icon: <DollarSign className="w-4 h-4" />,
      color: 'bg-orange-500',
    },
    {
      value: 'student_wise',
      label: 'Student-wise Report',
      description: 'Individual student payment history',
      icon: <Users className="w-4 h-4" />,
      color: 'bg-purple-500',
    },
    {
      value: 'category_wise',
      label: 'Category-wise Report',
      description: 'Fee collection by category',
      icon: <PieChart className="w-4 h-4" />,
      color: 'bg-green-500',
    },
    {
      value: 'method_wise',
      label: 'Payment Method Report',
      description: 'Payment distribution by method',
      icon: <BarChart3 className="w-4 h-4" />,
      color: 'bg-indigo-500',
    },
  ];

  const recentReports = [
    {
      id: 1,
      name: 'Monthly Collection Report - November 2024',
      type: 'Collection Report',
      date: '2024-11-15',
      format: 'PDF',
      size: '2.4 MB',
      status: 'completed',
      generatedBy: 'Admin User',
    },
    {
      id: 2,
      name: 'Outstanding Fees Report - Q4 2024',
      type: 'Outstanding Fees',
      date: '2024-11-10',
      format: 'Excel',
      size: '1.8 MB',
      status: 'completed',
      generatedBy: 'Finance Team',
    },
    {
      id: 3,
      name: 'Student-wise Payment History',
      type: 'Student-wise Report',
      date: '2024-11-08',
      format: 'CSV',
      size: '892 KB',
      status: 'completed',
      generatedBy: 'Admin User',
    },
    {
      id: 4,
      name: 'Payment Method Analysis - October',
      type: 'Payment Method Report',
      date: '2024-11-01',
      format: 'PDF',
      size: '1.2 MB',
      status: 'completed',
      generatedBy: 'Finance Team',
    },
  ];

  const scheduledReports = [
    {
      id: 1,
      name: 'Weekly Collection Summary',
      frequency: 'Every Monday',
      format: 'PDF',
      recipients: 'admin@school.edu, finance@school.edu',
      status: 'active',
      nextRun: '2024-11-18',
      lastRun: '2024-11-11',
    },
    {
      id: 2,
      name: 'Monthly Outstanding Report',
      frequency: 'First day of month',
      format: 'Excel',
      recipients: 'principal@school.edu',
      status: 'active',
      nextRun: '2024-12-01',
      lastRun: '2024-11-01',
    },
  ];

  const handleGenerateReport = () => {
    console.log('Generating report:', { reportType, dateRange, format });
  };

  const handleScheduleReport = () => {
    console.log('Scheduling report:', { reportType, dateRange, format });
  };

  const getFormatIcon = (format: string) => {
    switch (format.toLowerCase()) {
      case 'pdf':
        return <FileText className="w-4 h-4" />;
      case 'excel':
        return <FileSpreadsheet className="w-4 h-4" />;
      case 'csv':
        return <FileBarChart className="w-4 h-4" />;
      default:
        return <FileIcon className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'green';
      case 'active':
        return 'blue';
      case 'pending':
        return 'orange';
      case 'failed':
        return 'red';
      default:
        return 'gray';
    }
  };

  const filteredReports = recentReports.filter((report) => {
    const matchesSearch =
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Box className="space-y-8">
      {/* Report Generator */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        {/* Header Section */}
        <Box className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
          <Flex justify="between" align="center" className="mb-6">
            <Box>
              <Heading size="5" className="text-gray-900 mb-1">
                Generate Report
              </Heading>
              <Text size="3" className="text-gray-600">
                Select report type and customize parameters
              </Text>
            </Box>
            <Flex gap="2">
              <RadixButton
                variant="soft"
                size="2"
                className="bg-white/70 hover:bg-white"
              >
                <Filter className="w-4 h-4 mr-1" />
                Advanced Options
              </RadixButton>
            </Flex>
          </Flex>

          {/* Report Type Selection - Compact Grid */}
          <Box className="mb-6">
            <Text size="2" className="text-gray-700 mb-3 block font-medium">
              Report Type
            </Text>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {reportTypes.map((type) => (
                <Box
                  key={type.value}
                  className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm ${
                    reportType === type.value
                      ? 'ring-2 ring-indigo-500 bg-indigo-50 border-indigo-200'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setReportType(type.value)}
                >
                  <Flex direction="column" align="center" gap="2">
                    <div className={`p-2 ${type.color} rounded-lg text-white`}>
                      {type.icon}
                    </div>
                    <Text
                      size="1"
                      weight="medium"
                      className="text-gray-900 text-center leading-tight"
                    >
                      {type.label}
                    </Text>
                  </Flex>
                </Box>
              ))}
            </div>
          </Box>

          {/* Configuration Section - Horizontal Layout */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Box>
              <Text size="2" className="text-gray-700 mb-2 block font-medium">
                Date Range
              </Text>
              <Select.Root
                value={dateRange}
                onValueChange={setDateRange}
                size="2"
              >
                <Select.Trigger className="w-full" />
                <Select.Content>
                  <Select.Item value="today">Today</Select.Item>
                  <Select.Item value="this_week">This Week</Select.Item>
                  <Select.Item value="this_month">This Month</Select.Item>
                  <Select.Item value="last_month">Last Month</Select.Item>
                  <Select.Item value="this_quarter">This Quarter</Select.Item>
                  <Select.Item value="this_year">This Year</Select.Item>
                  <Select.Item value="custom">Custom Range</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>

            <Box>
              <Text size="2" className="text-gray-700 mb-2 block font-medium">
                Format
              </Text>
              <Select.Root value={format} onValueChange={setFormat} size="2">
                <Select.Trigger className="w-full" />
                <Select.Content>
                  <Select.Item value="pdf">
                    <Flex align="center" gap="2">
                      <FileText className="w-4 h-4" />
                      PDF
                    </Flex>
                  </Select.Item>
                  <Select.Item value="excel">
                    <Flex align="center" gap="2">
                      <FileSpreadsheet className="w-4 h-4" />
                      Excel
                    </Flex>
                  </Select.Item>
                  <Select.Item value="csv">
                    <Flex align="center" gap="2">
                      <FileBarChart className="w-4 h-4" />
                      CSV
                    </Flex>
                  </Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>

            <Box>
              <Text size="2" className="text-gray-700 mb-2 block font-medium">
                Actions
              </Text>
              <Flex gap="2">
                <RadixButton
                  onClick={handleGenerateReport}
                  size="2"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Generate
                </RadixButton>
              </Flex>
            </Box>

            <Box>
              <Text size="2" className="text-gray-700 mb-2 block font-medium">
                Schedule
              </Text>
              <RadixButton
                variant="outline"
                onClick={handleScheduleReport}
                size="2"
                className="w-full"
              >
                <Calendar className="w-4 h-4 mr-1" />
                Schedule
              </RadixButton>
            </Box>
          </div>

          {dateRange === 'custom' && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Box>
                <Text size="2" className="text-gray-700 mb-2 block font-medium">
                  Start Date
                </Text>
                <TextField.Root type="date" size="2" className="w-full" />
              </Box>
              <Box>
                <Text size="2" className="text-gray-700 mb-2 block font-medium">
                  End Date
                </Text>
                <TextField.Root type="date" size="2" className="w-full" />
              </Box>
            </div>
          )}
        </Box>
      </RadixCard>

      {/* Recent Reports DataTable */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        {/* Header Section */}
        <Box className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <Flex justify="between" align="center" className="mb-6">
            <Box>
              <Heading size="5" className="text-gray-900 mb-1">
                Recent Reports
              </Heading>
              <Text size="3" className="text-gray-600">
                {filteredReports.length} reports found
              </Text>
            </Box>
            <Flex gap="2">
              <RadixButton
                variant="soft"
                size="2"
                className="bg-white/70 hover:bg-white"
              >
                <Filter className="w-4 h-4 mr-1" />
                Filter
              </RadixButton>
              <RadixButton
                variant="soft"
                size="2"
                className="bg-white/70 hover:bg-white"
              >
                <Download className="w-4 h-4 mr-1" />
                Export List
              </RadixButton>
            </Flex>
          </Flex>

          {/* Filters */}
          <Flex gap="4" wrap="wrap">
            <Box className="flex-1 min-w-[250px]">
              <TextField.Root
                placeholder="Search reports..."
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
                value={statusFilter}
                onValueChange={setStatusFilter}
                size="2"
              >
                <Select.Trigger className="w-full" />
                <Select.Content>
                  <Select.Item value="all">All Status</Select.Item>
                  <Select.Item value="completed">Completed</Select.Item>
                  <Select.Item value="pending">Pending</Select.Item>
                  <Select.Item value="failed">Failed</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>
          </Flex>
        </Box>

        {/* Reports Table */}
        <Box className="overflow-x-auto">
          {filteredReports.length > 0 ? (
            <Table.Root variant="surface" className="w-full">
              <Table.Header>
                <Table.Row className="bg-gray-50/50">
                  <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                    <Flex align="center" gap="2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <Text size="2" weight="medium" className="text-gray-700">
                        Report Name
                      </Text>
                    </Flex>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                    <Text size="2" weight="medium" className="text-gray-700">
                      Type
                    </Text>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                    <Text size="2" weight="medium" className="text-gray-700">
                      Format
                    </Text>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                    <Text size="2" weight="medium" className="text-gray-700">
                      Size
                    </Text>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                    <Text size="2" weight="medium" className="text-gray-700">
                      Generated
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
                {filteredReports.map((report, index) => (
                  <Table.Row
                    key={report.id}
                    className={`hover:bg-gray-50/50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                  >
                    <Table.Cell className="py-4 px-6">
                      <Flex align="center" gap="3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {getFormatIcon(report.format)}
                        </div>
                        <Box>
                          <Text
                            size="2"
                            weight="medium"
                            className="text-gray-900 block"
                          >
                            {report.name}
                          </Text>
                          <Text size="1" className="text-gray-600">
                            Generated by {report.generatedBy}
                          </Text>
                        </Box>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Badge variant="soft" size="1">
                        {report.type}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Flex align="center" gap="2">
                        {getFormatIcon(report.format)}
                        <Text size="2" className="text-gray-700">
                          {report.format}
                        </Text>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Text size="2" className="text-gray-700">
                        {report.size}
                      </Text>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Text size="2" className="text-gray-700">
                        {report.date}
                      </Text>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Badge
                        color={getStatusColor(report.status)}
                        variant="soft"
                        size="1"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Ready
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
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <Text size="3" className="text-gray-600 mb-2">
                No reports found
              </Text>
              <Text size="2" className="text-gray-500">
                Try adjusting your search or filters
              </Text>
            </Box>
          )}
        </Box>
      </RadixCard>

      {/* Scheduled Reports DataTable */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        {/* Header Section */}
        <Box className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
          <Flex justify="between" align="center">
            <Box>
              <Heading size="5" className="text-gray-900 mb-1">
                Scheduled Reports
              </Heading>
              <Text size="3" className="text-gray-600">
                {scheduledReports.length} active schedules
              </Text>
            </Box>
            <RadixButton size="2" className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-1" />
              New Schedule
            </RadixButton>
          </Flex>
        </Box>

        {/* Scheduled Reports Table */}
        <Box className="overflow-x-auto">
          <Table.Root variant="surface" className="w-full">
            <Table.Header>
              <Table.Row className="bg-gray-50/50">
                <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                  <Flex align="center" gap="2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <Text size="2" weight="medium" className="text-gray-700">
                      Schedule Name
                    </Text>
                  </Flex>
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                  <Text size="2" weight="medium" className="text-gray-700">
                    Frequency
                  </Text>
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                  <Text size="2" weight="medium" className="text-gray-700">
                    Format
                  </Text>
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                  <Text size="2" weight="medium" className="text-gray-700">
                    Next Run
                  </Text>
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                  <Text size="2" weight="medium" className="text-gray-700">
                    Recipients
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
              {scheduledReports.map((schedule, index) => (
                <Table.Row
                  key={schedule.id}
                  className={`hover:bg-gray-50/50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                  }`}
                >
                  <Table.Cell className="py-4 px-6">
                    <Flex align="center" gap="3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Calendar className="w-4 h-4 text-green-600" />
                      </div>
                      <Box>
                        <Text
                          size="2"
                          weight="medium"
                          className="text-gray-900 block"
                        >
                          {schedule.name}
                        </Text>
                        <Text size="1" className="text-gray-600">
                          Last run: {schedule.lastRun}
                        </Text>
                      </Box>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell className="py-4 px-6">
                    <Text size="2" className="text-gray-700">
                      {schedule.frequency}
                    </Text>
                  </Table.Cell>
                  <Table.Cell className="py-4 px-6">
                    <Flex align="center" gap="2">
                      {getFormatIcon(schedule.format)}
                      <Text size="2" className="text-gray-700">
                        {schedule.format}
                      </Text>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell className="py-4 px-6">
                    <Text size="2" className="text-gray-700">
                      {schedule.nextRun}
                    </Text>
                  </Table.Cell>
                  <Table.Cell className="py-4 px-6">
                    <Text size="2" className="text-gray-700">
                      {schedule.recipients.split(',').length} recipients
                    </Text>
                  </Table.Cell>
                  <Table.Cell className="py-4 px-6">
                    <Badge
                      color={getStatusColor(schedule.status)}
                      variant="soft"
                      size="1"
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      {schedule.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell className="py-4 px-6">
                    <Flex gap="1">
                      <RadixButton variant="ghost" size="1">
                        <Eye className="w-4 h-4" />
                      </RadixButton>
                      <RadixButton variant="ghost" size="1">
                        <Edit className="w-4 h-4" />
                      </RadixButton>
                      <RadixButton variant="ghost" size="1" color="red">
                        <Trash2 className="w-4 h-4" />
                      </RadixButton>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      </RadixCard>
    </Box>
  );
}
