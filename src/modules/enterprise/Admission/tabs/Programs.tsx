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
  GraduationCap,
  Users,
  Calendar,
  DollarSign,
  BookOpen,
  Plus,
  Settings,
} from 'lucide-react';
import { useAdmissionData } from '../hooks/useAdmissionData';
import { SkeletonCard } from '../../../../components/ui/Skeleton';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'green';
    case 'inactive':
      return 'gray';
    case 'full':
      return 'red';
    case 'limited':
      return 'orange';
    default:
      return 'blue';
  }
};

const getCapacityColor = (current: number, max: number) => {
  const percentage = (current / max) * 100;
  if (percentage >= 90) return 'red';
  if (percentage >= 70) return 'orange';
  return 'green';
};

export function Programs({
  isLoading = false,
}: {
  isLoading?: boolean;
}): JSX.Element {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDegree, setSelectedDegree] = useState('all');

  const { programs } = useAdmissionData();

  // Filter programs based on search and filters
  const filteredPrograms =
    programs?.filter((program) => {
      const matchesSearch =
        program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.department.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment =
        selectedDepartment === 'all' ||
        program.department === selectedDepartment;
      const matchesStatus =
        selectedStatus === 'all' ||
        (program.isActive ? 'active' : 'inactive') === selectedStatus;
      const matchesDegree =
        selectedDegree === 'all' || program.degree === selectedDegree;

      return (
        matchesSearch && matchesDepartment && matchesStatus && matchesDegree
      );
    }) || [];

  const handleExportPrograms = () => {
    console.log('Exporting programs...');
    // Implementation would export programs data
  };

  return (
    <Box className="space-y-8">
      {/* Programs Table */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        {/* Header Section */}
        <Box className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100">
          <Flex justify="between" align="center" className="mb-6">
            <Box>
              <Heading size="5" className="text-gray-900 mb-1">
                Academic Programs
              </Heading>
              <Text size="3" className="text-gray-600">
                {filteredPrograms.length} programs found
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
                onClick={handleExportPrograms}
              >
                <Download className="w-4 h-4 mr-1" />
                Export
              </RadixButton>
              <RadixButton
                variant="solid"
                size="2"
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                New Program
              </RadixButton>
            </Flex>
          </Flex>

          {/* Filters */}
          <Flex gap="4" wrap="wrap">
            {/* Search Input */}
            <Box className="flex-1 min-w-[250px]">
              <TextField.Root
                placeholder="Search by program name, code, or department..."
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

            {/* Department Filter */}
            <Box className="min-w-[150px]">
              <Select.Root
                value={selectedDepartment}
                onValueChange={setSelectedDepartment}
                size="2"
              >
                <Select.Trigger className="w-full" />
                <Select.Content>
                  <Select.Item value="all">All Departments</Select.Item>
                  <Select.Item value="Computer Science">
                    Computer Science
                  </Select.Item>
                  <Select.Item value="Engineering">Engineering</Select.Item>
                  <Select.Item value="Business">Business</Select.Item>
                  <Select.Item value="Medicine">Medicine</Select.Item>
                  <Select.Item value="Arts">Arts</Select.Item>
                  <Select.Item value="Sciences">Sciences</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>

            {/* Status Filter */}
            <Box className="min-w-[120px]">
              <Select.Root
                value={selectedStatus}
                onValueChange={setSelectedStatus}
                size="2"
              >
                <Select.Trigger className="w-full" />
                <Select.Content>
                  <Select.Item value="all">All Status</Select.Item>
                  <Select.Item value="active">Active</Select.Item>
                  <Select.Item value="inactive">Inactive</Select.Item>
                  <Select.Item value="full">Full</Select.Item>
                  <Select.Item value="limited">Limited</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>

            {/* Degree Filter */}
            <Box className="min-w-[120px]">
              <Select.Root
                value={selectedDegree}
                onValueChange={setSelectedDegree}
                size="2"
              >
                <Select.Trigger className="w-full" />
                <Select.Content>
                  <Select.Item value="all">All Degrees</Select.Item>
                  <Select.Item value="undergraduate">Undergraduate</Select.Item>
                  <Select.Item value="graduate">Graduate</Select.Item>
                  <Select.Item value="doctorate">Doctorate</Select.Item>
                  <Select.Item value="certificate">Certificate</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>
          </Flex>
        </Box>

        {/* Programs Table */}
        <Box className="overflow-x-auto">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <SkeletonCard key={i} height="80px" />
              ))}
            </div>
          ) : filteredPrograms.length > 0 ? (
            <Table.Root variant="surface" className="w-full">
              <Table.Header>
                <Table.Row className="bg-gray-50/50">
                  <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                    <Flex align="center" gap="2">
                      <GraduationCap className="w-4 h-4 text-gray-500" />
                      <Text size="2" weight="medium" className="text-gray-700">
                        Program
                      </Text>
                    </Flex>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                    <Text size="2" weight="medium" className="text-gray-700">
                      Code
                    </Text>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                    <Text size="2" weight="medium" className="text-gray-700">
                      Department
                    </Text>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                    <Text size="2" weight="medium" className="text-gray-700">
                      Degree
                    </Text>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                    <Text size="2" weight="medium" className="text-gray-700">
                      Duration
                    </Text>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                    <Text size="2" weight="medium" className="text-gray-700">
                      Capacity
                    </Text>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                    <Text size="2" weight="medium" className="text-gray-700">
                      Fee
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
                {filteredPrograms.map((program, index) => (
                  <Table.Row
                    key={program.id}
                    className={`hover:bg-gray-50/50 transition-colors animate-in slide-in-from-bottom-1 duration-300 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Table.Cell className="py-4 px-6">
                      <Flex align="center" gap="3">
                        <Box
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            program.isActive
                              ? 'bg-green-100 ring-2 ring-green-200'
                              : program.availableSeats === 0
                                ? 'bg-red-100 ring-2 ring-red-200'
                                : program.availableSeats < 10
                                  ? 'bg-orange-100 ring-2 ring-orange-200'
                                  : 'bg-gray-100 ring-2 ring-gray-200'
                          }`}
                        >
                          <GraduationCap
                            className={`w-4 h-4 ${
                              program.isActive
                                ? 'text-green-600'
                                : program.availableSeats === 0
                                  ? 'text-red-600'
                                  : program.availableSeats < 10
                                    ? 'text-orange-600'
                                    : 'text-gray-600'
                            }`}
                          />
                        </Box>
                        <Box>
                          <Text
                            size="2"
                            weight="medium"
                            className="text-gray-900 block"
                          >
                            {program.name}
                          </Text>
                          <Text size="1" className="text-gray-600">
                            {program.degree} • {program.duration}
                          </Text>
                        </Box>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Text size="2" weight="medium" className="text-gray-900">
                        {program.id}
                      </Text>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Text size="2" className="text-gray-900">
                        {program.department}
                      </Text>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Badge
                        color={
                          program.degree === 'doctorate'
                            ? 'purple'
                            : program.degree === 'graduate'
                              ? 'blue'
                              : program.degree === 'undergraduate'
                                ? 'green'
                                : 'orange'
                        }
                        variant="soft"
                        size="1"
                      >
                        {program.degree}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Flex align="center" gap="2">
                        <Calendar className="w-3 h-3 text-gray-500" />
                        <Text size="2" className="text-gray-900">
                          {program.duration}
                        </Text>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Flex align="center" gap="2">
                        <Users className="w-3 h-3 text-gray-500" />
                        <Text size="2" className="text-gray-900">
                          {program.totalSeats - program.availableSeats}/
                          {program.totalSeats}
                        </Text>
                        <Badge
                          color={getCapacityColor(
                            program.totalSeats - program.availableSeats,
                            program.totalSeats
                          )}
                          variant="outline"
                          size="1"
                        >
                          {Math.round(
                            ((program.totalSeats - program.availableSeats) /
                              program.totalSeats) *
                              100
                          )}
                          %
                        </Badge>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Flex align="center" gap="2">
                        <DollarSign className="w-3 h-3 text-gray-500" />
                        <Text
                          size="2"
                          weight="medium"
                          className="text-gray-900"
                        >
                          ${program.tuitionFee.toLocaleString()}
                        </Text>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Badge
                        color={getStatusColor(
                          program.isActive ? 'active' : 'inactive'
                        )}
                        variant="soft"
                        size="1"
                      >
                        {program.isActive ? 'active' : 'inactive'}
                      </Badge>
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
                          title="Edit Program"
                        >
                          <Edit className="w-3 h-3" />
                        </RadixButton>
                        <RadixButton
                          variant="ghost"
                          size="1"
                          className="hover:bg-purple-50"
                          title="Program Settings"
                        >
                          <Settings className="w-3 h-3" />
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
                <GraduationCap className="w-8 h-8 text-gray-400" />
              </Box>
              <Text size="3" weight="medium" className="text-gray-900 mb-2">
                No programs found
              </Text>
              <Text size="2" className="text-gray-500 mb-4">
                {searchTerm ||
                selectedDepartment !== 'all' ||
                selectedStatus !== 'all'
                  ? 'Try adjusting your search criteria'
                  : 'No academic programs have been created yet'}
              </Text>
              {searchTerm ||
              selectedDepartment !== 'all' ||
              selectedStatus !== 'all' ? (
                <RadixButton
                  variant="soft"
                  size="3"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedDepartment('all');
                    setSelectedStatus('all');
                    setSelectedDegree('all');
                  }}
                >
                  Clear Filters
                </RadixButton>
              ) : (
                <RadixButton
                  variant="solid"
                  size="3"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Program
                </RadixButton>
              )}
            </Box>
          )}
        </Box>

        {/* Pagination */}
        {filteredPrograms.length > 10 && (
          <Box className="p-6 border-t border-gray-100 bg-gray-50/30">
            <Flex justify="between" align="center">
              <Text size="2" className="text-gray-600">
                Showing {filteredPrograms.length} of {filteredPrograms.length}{' '}
                programs
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
