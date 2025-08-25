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
  FileText,
  Download,
  Calendar,
  Filter,
  BarChart3,
  Users,
  TrendingUp,
  GraduationCap,
  DollarSign,
  Clock,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  CheckCircle,
} from 'lucide-react';
import { useStudentData } from '../hooks/useStudentData';
import { useStudentManagement } from '../hooks/useStudentManagement';
import { SkeletonCard } from 'components/ui/Skeleton';

interface ReportType {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'academic' | 'attendance' | 'demographic' | 'financial';
  color: string;
}

const reportTypes: ReportType[] = [
  {
    id: 'student-list',
    title: 'Student Directory',
    description: 'Complete list of all students with contact information',
    icon: <Users className="w-4 h-4" />,
    category: 'demographic',
    color: 'bg-purple-500',
  },
  {
    id: 'attendance-summary',
    title: 'Attendance Summary',
    description: 'Monthly attendance report for all students',
    icon: <Calendar className="w-4 h-4" />,
    category: 'attendance',
    color: 'bg-green-500',
  },
  {
    id: 'academic-performance',
    title: 'Academic Performance',
    description: 'Grade reports and academic standings',
    icon: <BarChart3 className="w-4 h-4" />,
    category: 'academic',
    color: 'bg-blue-500',
  },
  {
    id: 'class-wise-analysis',
    title: 'Class-wise Analysis',
    description: 'Performance analysis by class and section',
    icon: <TrendingUp className="w-4 h-4" />,
    category: 'academic',
    color: 'bg-indigo-500',
  },
  {
    id: 'fee-collection',
    title: 'Fee Collection Report',
    description: 'Fee payment status and pending amounts',
    icon: <DollarSign className="w-4 h-4" />,
    category: 'financial',
    color: 'bg-orange-500',
  },
  {
    id: 'student-demographics',
    title: 'Student Demographics',
    description: 'Age, gender, and geographic distribution',
    icon: <GraduationCap className="w-4 h-4" />,
    category: 'demographic',
    color: 'bg-pink-500',
  },
];

export function Reports({
  isLoading = false,
}: {
  isLoading?: boolean;
}): JSX.Element {
  const { students } = useStudentData();
  const { handleExportStudents } = useStudentManagement();
  const [selectedReportType, setSelectedReportType] = useState('student-list');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dateRange, setDateRange] = useState('this_month');
  const [format, setFormat] = useState('pdf');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);

  const recentReports = [
    {
      id: 1,
      name: 'Student Directory - November 2024',
      type: 'Student Directory',
      date: '2024-11-15',
      format: 'PDF',
      size: '3.2 MB',
      status: 'completed',
      generatedBy: 'Admin User',
      category: 'demographic',
    },
    {
      id: 2,
      name: 'Monthly Attendance Summary',
      type: 'Attendance Summary',
      date: '2024-11-12',
      format: 'Excel',
      size: '2.1 MB',
      status: 'completed',
      generatedBy: 'Academic Team',
      category: 'attendance',
    },
    {
      id: 3,
      name: 'Academic Performance Q4 2024',
      type: 'Academic Performance',
      date: '2024-11-10',
      format: 'CSV',
      size: '1.8 MB',
      status: 'completed',
      generatedBy: 'Academic Team',
      category: 'academic',
    },
    {
      id: 4,
      name: 'Fee Collection Status Report',
      type: 'Fee Collection Report',
      date: '2024-11-08',
      format: 'PDF',
      size: '2.5 MB',
      status: 'completed',
      generatedBy: 'Finance Team',
      category: 'financial',
    },
  ];

  const scheduledReports = [
    {
      id: 1,
      name: 'Weekly Attendance Summary',
      frequency: 'Every Monday',
      format: 'PDF',
      recipients: 'academic@school.edu, principal@school.edu',
      status: 'active',
      nextRun: '2024-11-18',
      lastRun: '2024-11-11',
      category: 'attendance',
    },
    {
      id: 2,
      name: 'Monthly Academic Performance',
      frequency: 'First day of month',
      format: 'Excel',
      recipients: 'academic@school.edu',
      status: 'active',
      nextRun: '2024-12-01',
      lastRun: '2024-11-01',
      category: 'academic',
    },
  ];

  const filteredReportTypes =
    selectedCategory === 'all'
      ? reportTypes
      : reportTypes.filter((report) => report.category === selectedCategory);

  const filteredReports = recentReports.filter((report) => {
    const matchesSearch =
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      // Simulate report generation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (selectedReportType === 'student-list') {
        handleExportStudents(students);
      }

      console.log('Generated report:', {
        selectedReportType,
        dateRange,
        format,
      });
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format.toLowerCase()) {
      case 'pdf':
        return <FileText className="w-4 h-4" />;
      case 'excel':
        return <FileText className="w-4 h-4" />;
      case 'csv':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'academic':
        return 'blue';
      case 'attendance':
        return 'green';
      case 'demographic':
        return 'purple';
      case 'financial':
        return 'orange';
      default:
        return 'gray';
    }
  };

  return (
    <Box className="space-y-8">
      {/* Report Generator */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        {/* Header Section */}
        <Box className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-100">
          <Flex justify="between" align="center" className="mb-6">
            <Box>
              <Heading size="5" className="text-gray-900 mb-1">
                Generate Student Report
              </Heading>
              <Text size="3" className="text-gray-600">
                Create comprehensive reports for {students?.length || 0}{' '}
                students
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
              {filteredReportTypes.map((type) => (
                <Box
                  key={type.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm ${
                    selectedReportType === type.id
                      ? 'ring-2 ring-emerald-500 bg-emerald-50 border-emerald-200'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedReportType(type.id)}
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
                      {type.title}
                    </Text>
                  </Flex>
                </Box>
              ))}
            </div>
          </Box>

          {/* Configuration Section - Horizontal Layout */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Box>
              <Text size="2" className="text-gray-700 mb-2 block font-medium">
                Category
              </Text>
              <Select.Root
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                size="2"
              >
                <Select.Trigger className="w-full" />
                <Select.Content>
                  <Select.Item value="all">All Categories</Select.Item>
                  <Select.Item value="academic">Academic</Select.Item>
                  <Select.Item value="attendance">Attendance</Select.Item>
                  <Select.Item value="demographic">Demographic</Select.Item>
                  <Select.Item value="financial">Financial</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>

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
                      <FileText className="w-4 h-4" />
                      Excel
                    </Flex>
                  </Select.Item>
                  <Select.Item value="csv">
                    <Flex align="center" gap="2">
                      <FileText className="w-4 h-4" />
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
              <RadixButton
                onClick={handleGenerateReport}
                size="2"
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-1" />
                    Generate
                  </>
                )}
              </RadixButton>
            </Box>

            <Box>
              <Text size="2" className="text-gray-700 mb-2 block font-medium">
                Schedule
              </Text>
              <RadixButton variant="outline" size="2" className="w-full">
                <Calendar className="w-4 h-4 mr-1" />
                Schedule
              </RadixButton>
            </Box>
          </div>
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
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={i} height="80px" />
              ))}
            </div>
          ) : filteredReports.length > 0 ? (
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
                      Category
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
                      <Badge
                        color={getCategoryColor(report.category)}
                        variant="soft"
                        size="1"
                      >
                        {report.category}
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
        <Box className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
          <Flex justify="between" align="center">
            <Box>
              <Heading size="5" className="text-gray-900 mb-1">
                Scheduled Reports
              </Heading>
              <Text size="3" className="text-gray-600">
                {scheduledReports.length} active schedules
              </Text>
            </Box>
            <RadixButton size="2" className="bg-purple-600 hover:bg-purple-700">
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
                    Category
                  </Text>
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
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Calendar className="w-4 h-4 text-purple-600" />
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
                    <Badge
                      color={getCategoryColor(schedule.category)}
                      variant="soft"
                      size="1"
                    >
                      {schedule.category}
                    </Badge>
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
