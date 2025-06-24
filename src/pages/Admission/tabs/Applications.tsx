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
  FileText,
  Mail,
  Phone,
} from 'lucide-react';
import { useAdmissionData } from '../hooks/useAdmissionData';

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'accepted':
      return <CheckCircle className="w-4 h-4" />;
    case 'under_review':
    case 'submitted':
      return <Clock className="w-4 h-4" />;
    case 'rejected':
      return <XCircle className="w-4 h-4" />;
    case 'interview_scheduled':
      return <FileText className="w-4 h-4" />;
    default:
      return <AlertTriangle className="w-4 h-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'accepted':
      return 'green';
    case 'under_review':
    case 'submitted':
      return 'blue';
    case 'rejected':
      return 'red';
    case 'draft':
      return 'orange';
    case 'interview_scheduled':
      return 'purple';
    case 'waitlisted':
      return 'yellow';
    case 'withdrawn':
      return 'gray';
    default:
      return 'gray';
  }
};

export function Applications(): JSX.Element {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedProgram, setSelectedProgram] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');

  const { applications } = useAdmissionData();

  // Filter applications based on search and filters
  const filteredApplications =
    applications?.filter((app) => {
      const matchesSearch =
        app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.applicationNumber
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === 'all' || app.status === selectedStatus;
      const matchesProgram =
        selectedProgram === 'all' || app.program === selectedProgram;
      const matchesPriority =
        selectedPriority === 'all' || app.priority === selectedPriority;

      return (
        matchesSearch && matchesStatus && matchesProgram && matchesPriority
      );
    }) || [];

  const handleExportApplications = () => {
    console.log('Exporting applications...');
    // Implementation would export applications data
  };

  return (
    <Box className="space-y-8">
      {/* Applications Table */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        {/* Header Section */}
        <Box className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <Flex justify="between" align="center" className="mb-6">
            <Box>
              <Heading size="5" className="text-gray-900 mb-1">
                Application Records
              </Heading>
              <Text size="3" className="text-gray-600">
                {filteredApplications.length} applications found
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
                onClick={handleExportApplications}
              >
                <Download className="w-4 h-4 mr-1" />
                Export
              </RadixButton>
              <RadixButton
                variant="solid"
                size="2"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <FileText className="w-4 h-4 mr-1" />
                New Application
              </RadixButton>
            </Flex>
          </Flex>

          {/* Filters */}
          <Flex gap="4" wrap="wrap">
            {/* Search Input */}
            <Box className="flex-1 min-w-[250px]">
              <TextField.Root
                placeholder="Search by name, ID, or email..."
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
                  <Select.Item value="draft">Draft</Select.Item>
                  <Select.Item value="submitted">Submitted</Select.Item>
                  <Select.Item value="under_review">Under Review</Select.Item>
                  <Select.Item value="interview_scheduled">
                    Interview Scheduled
                  </Select.Item>
                  <Select.Item value="accepted">Accepted</Select.Item>
                  <Select.Item value="rejected">Rejected</Select.Item>
                  <Select.Item value="waitlisted">Waitlisted</Select.Item>
                  <Select.Item value="withdrawn">Withdrawn</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>

            {/* Program Filter */}
            <Box className="min-w-[150px]">
              <Select.Root
                value={selectedProgram}
                onValueChange={setSelectedProgram}
                size="2"
              >
                <Select.Trigger className="w-full" />
                <Select.Content>
                  <Select.Item value="all">All Programs</Select.Item>
                  <Select.Item value="Computer Science">
                    Computer Science
                  </Select.Item>
                  <Select.Item value="Business Administration">
                    Business Administration
                  </Select.Item>
                  <Select.Item value="Engineering">Engineering</Select.Item>
                  <Select.Item value="Medicine">Medicine</Select.Item>
                  <Select.Item value="Arts">Arts</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>

            {/* Priority Filter */}
            <Box className="min-w-[120px]">
              <Select.Root
                value={selectedPriority}
                onValueChange={setSelectedPriority}
                size="2"
              >
                <Select.Trigger className="w-full" />
                <Select.Content>
                  <Select.Item value="all">All Priority</Select.Item>
                  <Select.Item value="high">High</Select.Item>
                  <Select.Item value="medium">Medium</Select.Item>
                  <Select.Item value="low">Low</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>
          </Flex>
        </Box>

        {/* Applications Table */}
        <Box className="overflow-x-auto">
          {filteredApplications.length > 0 ? (
            <Table.Root variant="surface" className="w-full">
              <Table.Header>
                <Table.Row className="bg-gray-50/50">
                  <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                    <Flex align="center" gap="2">
                      <User className="w-4 h-4 text-gray-500" />
                      <Text size="2" weight="medium" className="text-gray-700">
                        Applicant
                      </Text>
                    </Flex>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                    <Text size="2" weight="medium" className="text-gray-700">
                      Application ID
                    </Text>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                    <Text size="2" weight="medium" className="text-gray-700">
                      Program
                    </Text>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                    <Text size="2" weight="medium" className="text-gray-700">
                      Status
                    </Text>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                    <Text size="2" weight="medium" className="text-gray-700">
                      Priority
                    </Text>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                    <Text size="2" weight="medium" className="text-gray-700">
                      Applied Date
                    </Text>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                    <Text size="2" weight="medium" className="text-gray-700">
                      Score
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
                {filteredApplications.map((application, index) => (
                  <Table.Row
                    key={application.id}
                    className={`hover:bg-gray-50/50 transition-colors animate-in slide-in-from-bottom-1 duration-300 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Table.Cell className="py-4 px-6">
                      <Flex align="center" gap="3">
                        <Box
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            application.status === 'accepted'
                              ? 'bg-green-100 ring-2 ring-green-200'
                              : application.status === 'under_review' ||
                                  application.status === 'submitted'
                                ? 'bg-blue-100 ring-2 ring-blue-200'
                                : application.status === 'rejected'
                                  ? 'bg-red-100 ring-2 ring-red-200'
                                  : 'bg-orange-100 ring-2 ring-orange-200'
                          }`}
                        >
                          <User
                            className={`w-4 h-4 ${
                              application.status === 'accepted'
                                ? 'text-green-600'
                                : application.status === 'under_review' ||
                                    application.status === 'submitted'
                                  ? 'text-blue-600'
                                  : application.status === 'rejected'
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
                            {application.studentName}
                          </Text>
                          <Text size="1" className="text-gray-600">
                            {application.email}
                          </Text>
                        </Box>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Text size="2" weight="medium" className="text-gray-900">
                        {application.applicationNumber}
                      </Text>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Text size="2" className="text-gray-900">
                        {application.program}
                      </Text>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Flex align="center" gap="2">
                        {getStatusIcon(application.status)}
                        <Badge
                          color={getStatusColor(application.status)}
                          variant="soft"
                          size="1"
                        >
                          {application.status.replace('_', ' ')}
                        </Badge>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Badge
                        color={
                          application.priority === 'high'
                            ? 'red'
                            : application.priority === 'medium'
                              ? 'orange'
                              : 'blue'
                        }
                        variant="outline"
                        size="1"
                      >
                        {application.priority}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Text size="2" className="text-gray-900">
                        {application.submissionDate}
                      </Text>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Text size="2" weight="medium" className="text-gray-900">
                        {application.academicRecords?.gpa
                          ? `${application.academicRecords.gpa}/${application.academicRecords.maxGpa}`
                          : 'N/A'}
                      </Text>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Flex gap="1">
                        <RadixButton
                          variant="ghost"
                          size="1"
                          className="hover:bg-blue-50"
                          title="View Details"
                        >
                          <Eye className="w-3 h-3" />
                        </RadixButton>
                        <RadixButton
                          variant="ghost"
                          size="1"
                          className="hover:bg-orange-50"
                          title="Edit Application"
                        >
                          <Edit className="w-3 h-3" />
                        </RadixButton>
                        <RadixButton
                          variant="ghost"
                          size="1"
                          className="hover:bg-green-50"
                          title="Contact Applicant"
                        >
                          <Mail className="w-3 h-3" />
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
                <FileText className="w-8 h-8 text-gray-400" />
              </Box>
              <Text size="3" weight="medium" className="text-gray-900 mb-2">
                No applications found
              </Text>
              <Text size="2" className="text-gray-500 mb-4">
                {searchTerm ||
                selectedStatus !== 'all' ||
                selectedProgram !== 'all'
                  ? 'Try adjusting your search criteria'
                  : 'No applications have been submitted yet'}
              </Text>
              {searchTerm ||
              selectedStatus !== 'all' ||
              selectedProgram !== 'all' ? (
                <RadixButton
                  variant="soft"
                  size="3"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedStatus('all');
                    setSelectedProgram('all');
                    setSelectedPriority('all');
                  }}
                >
                  Clear Filters
                </RadixButton>
              ) : (
                <RadixButton
                  variant="solid"
                  size="3"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Create Application
                </RadixButton>
              )}
            </Box>
          )}
        </Box>

        {/* Pagination */}
        {filteredApplications.length > 10 && (
          <Box className="p-6 border-t border-gray-100 bg-gray-50/30">
            <Flex justify="between" align="center">
              <Text size="2" className="text-gray-600">
                Showing {filteredApplications.length} of{' '}
                {filteredApplications.length} applications
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
