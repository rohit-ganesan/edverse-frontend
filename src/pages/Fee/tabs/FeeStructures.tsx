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
  DollarSign,
  Calendar,
  BookOpen,
  GraduationCap,
  Users,
  Plus,
  Settings,
  Copy,
} from 'lucide-react';
import { useFeeData } from '../hooks/useFeeData';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'green';
    case 'inactive':
      return 'gray';
    case 'draft':
      return 'orange';
    case 'archived':
      return 'red';
    default:
      return 'blue';
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'tuition':
      return 'blue';
    case 'hostel':
      return 'green';
    case 'transport':
      return 'orange';
    case 'library':
      return 'purple';
    case 'lab':
      return 'red';
    case 'exam':
      return 'yellow';
    default:
      return 'gray';
  }
};

export function FeeStructures(): JSX.Element {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedProgram, setSelectedProgram] = useState('all');

  const { feeStructure } = useFeeData();

  // Filter fee structures based on search and filters
  const filteredFeeStructures =
    feeStructure?.filter((structure) => {
      const matchesSearch =
        structure.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        structure.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' || structure.category === selectedCategory;
      const matchesStatus =
        selectedStatus === 'all' ||
        (structure.isActive ? 'active' : 'inactive') === selectedStatus;
      const matchesProgram = selectedProgram === 'all'; // Fee structures don't have program field in this data

      return (
        matchesSearch && matchesCategory && matchesStatus && matchesProgram
      );
    }) || [];

  const handleExportStructures = () => {
    console.log('Exporting fee structures...');
    // Implementation would export fee structures data
  };

  return (
    <Box className="space-y-8">
      {/* Fee Structures Table */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        {/* Header Section */}
        <Box className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <Flex justify="between" align="center" className="mb-6">
            <Box>
              <Heading size="5" className="text-gray-900 mb-1">
                Fee Structures
              </Heading>
              <Text size="3" className="text-gray-600">
                {filteredFeeStructures.length} fee structures found
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
                onClick={handleExportStructures}
              >
                <Download className="w-4 h-4 mr-1" />
                Export
              </RadixButton>
              <RadixButton
                variant="solid"
                size="2"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                New Structure
              </RadixButton>
            </Flex>
          </Flex>

          {/* Filters */}
          <Flex gap="4" wrap="wrap">
            {/* Search Input */}
            <Box className="flex-1 min-w-[250px]">
              <TextField.Root
                placeholder="Search by name, code, or program..."
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

            {/* Category Filter */}
            <Box className="min-w-[150px]">
              <Select.Root
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                size="2"
              >
                <Select.Trigger className="w-full" />
                <Select.Content>
                  <Select.Item value="all">All Categories</Select.Item>
                  <Select.Item value="tuition">Tuition</Select.Item>
                  <Select.Item value="hostel">Hostel</Select.Item>
                  <Select.Item value="transport">Transport</Select.Item>
                  <Select.Item value="library">Library</Select.Item>
                  <Select.Item value="lab">Laboratory</Select.Item>
                  <Select.Item value="exam">Examination</Select.Item>
                  <Select.Item value="other">Other</Select.Item>
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
                  <Select.Item value="draft">Draft</Select.Item>
                  <Select.Item value="archived">Archived</Select.Item>
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
                  <Select.Item value="Engineering">Engineering</Select.Item>
                  <Select.Item value="Business">Business</Select.Item>
                  <Select.Item value="Medicine">Medicine</Select.Item>
                  <Select.Item value="Arts">Arts</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>
          </Flex>
        </Box>

        {/* Fee Structures Table */}
        <Box className="overflow-x-auto">
          {filteredFeeStructures.length > 0 ? (
            <Table.Root variant="surface" className="w-full">
              <Table.Header>
                <Table.Row className="bg-gray-50/50">
                  <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                    <Flex align="center" gap="2">
                      <BookOpen className="w-4 h-4 text-gray-500" />
                      <Text size="2" weight="medium" className="text-gray-700">
                        Fee Structure
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
                      Amount
                    </Text>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                    <Text size="2" weight="medium" className="text-gray-700">
                      Applicability
                    </Text>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                    <Text size="2" weight="medium" className="text-gray-700">
                      Due Date
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
                {filteredFeeStructures.map((structure, index) => (
                  <Table.Row
                    key={structure.id}
                    className={`hover:bg-gray-50/50 transition-colors animate-in slide-in-from-bottom-1 duration-300 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Table.Cell className="py-4 px-6">
                      <Flex align="center" gap="3">
                        <Box
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            structure.isActive
                              ? 'bg-green-100 ring-2 ring-green-200'
                              : 'bg-gray-100 ring-2 ring-gray-200'
                          }`}
                        >
                          <BookOpen
                            className={`w-4 h-4 ${
                              structure.isActive
                                ? 'text-green-600'
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
                            {structure.name}
                          </Text>
                          <Text size="1" className="text-gray-600">
                            {structure.description}
                          </Text>
                        </Box>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Text size="2" weight="medium" className="text-gray-900">
                        {structure.id}
                      </Text>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Badge
                        color={getCategoryColor(structure.category)}
                        variant="soft"
                        size="1"
                      >
                        {structure.category}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Flex align="center" gap="2">
                        <GraduationCap className="w-3 h-3 text-gray-500" />
                        <Text size="2" className="text-gray-900">
                          {structure.frequency || 'All Programs'}
                        </Text>
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
                          ${structure.amount.toLocaleString()}
                        </Text>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Flex align="center" gap="2">
                        <Users className="w-3 h-3 text-gray-500" />
                        <Text size="2" className="text-gray-900">
                          {structure.applicableTo?.length || 0} Rules
                        </Text>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Flex align="center" gap="2">
                        <Calendar className="w-3 h-3 text-gray-500" />
                        <Text size="2" className="text-gray-900">
                          Due:{' '}
                          {new Date(structure.dueDate).toLocaleDateString()}
                        </Text>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Badge
                        color={getStatusColor(
                          structure.isActive ? 'active' : 'inactive'
                        )}
                        variant="soft"
                        size="1"
                      >
                        {structure.isActive ? 'active' : 'inactive'}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Flex gap="1">
                        <RadixButton
                          variant="ghost"
                          size="1"
                          className="hover:bg-blue-50"
                          title="View Structure"
                        >
                          <Eye className="w-3 h-3" />
                        </RadixButton>
                        <RadixButton
                          variant="ghost"
                          size="1"
                          className="hover:bg-orange-50"
                          title="Edit Structure"
                        >
                          <Edit className="w-3 h-3" />
                        </RadixButton>
                        <RadixButton
                          variant="ghost"
                          size="1"
                          className="hover:bg-green-50"
                          title="Duplicate Structure"
                        >
                          <Copy className="w-3 h-3" />
                        </RadixButton>
                        <RadixButton
                          variant="ghost"
                          size="1"
                          className="hover:bg-purple-50"
                          title="Structure Settings"
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
                <BookOpen className="w-8 h-8 text-gray-400" />
              </Box>
              <Text size="3" weight="medium" className="text-gray-900 mb-2">
                No fee structures found
              </Text>
              <Text size="2" className="text-gray-500 mb-4">
                {searchTerm ||
                selectedCategory !== 'all' ||
                selectedStatus !== 'all'
                  ? 'Try adjusting your search criteria'
                  : 'No fee structures have been created yet'}
              </Text>
              {searchTerm ||
              selectedCategory !== 'all' ||
              selectedStatus !== 'all' ? (
                <RadixButton
                  variant="soft"
                  size="3"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setSelectedStatus('all');
                    setSelectedProgram('all');
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
                  <Plus className="w-4 h-4 mr-2" />
                  Create Fee Structure
                </RadixButton>
              )}
            </Box>
          )}
        </Box>

        {/* Pagination */}
        {filteredFeeStructures.length > 10 && (
          <Box className="p-6 border-t border-gray-100 bg-gray-50/30">
            <Flex justify="between" align="center">
              <Text size="2" className="text-gray-600">
                Showing {filteredFeeStructures.length} of{' '}
                {filteredFeeStructures.length} fee structures
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
