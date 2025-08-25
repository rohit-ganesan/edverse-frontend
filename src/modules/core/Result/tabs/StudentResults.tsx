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
  GraduationCap,
} from 'lucide-react';
import { useResultData } from '../hooks/useResultData';
import { useResultManagement } from '../hooks/useResultManagement';
import { SkeletonTableRow } from 'components/ui/Skeleton';

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pass':
    case 'published':
      return <CheckCircle className="w-4 h-4" />;
    case 'pending':
      return <Clock className="w-4 h-4" />;
    case 'fail':
      return <XCircle className="w-4 h-4" />;
    default:
      return <AlertTriangle className="w-4 h-4" />;
  }
};

export function StudentResults({
  isLoading = false,
}: {
  isLoading?: boolean;
}): JSX.Element {
  const { filteredResults, filters, updateFilters } = useResultData();
  const { getGradeColor, getStatusColor, exportResults } =
    useResultManagement();

  return (
    <Box className="space-y-8">
      {/* Student Results */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        {/* Header Section */}
        <Box className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-100">
          <Flex justify="between" align="center" className="mb-6">
            <Box>
              <Heading size="5" className="text-gray-900 mb-1">
                Student Results
              </Heading>
              <Text size="3" className="text-gray-600">
                {filteredResults?.length || 0} results found
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
                onClick={() => exportResults(filteredResults)}
              >
                <Download className="w-4 h-4 mr-1" />
                Export
              </RadixButton>
            </Flex>
          </Flex>

          {/* Filters */}
          <Flex gap="4" wrap="wrap">
            {/* Search Input */}
            <Box className="flex-1 min-w-[250px]">
              <TextField.Root
                placeholder="Search students..."
                value={filters.searchTerm}
                onChange={(e) => updateFilters({ searchTerm: e.target.value })}
                size="2"
                className="w-full"
              >
                <TextField.Slot>
                  <Search className="w-4 h-4 text-gray-400" />
                </TextField.Slot>
              </TextField.Root>
            </Box>

            {/* Semester Filter */}
            <Box className="min-w-[150px]">
              <Select.Root
                value={filters.selectedSemester}
                onValueChange={(value) =>
                  updateFilters({ selectedSemester: value })
                }
                size="2"
              >
                <Select.Trigger className="w-full" />
                <Select.Content>
                  <Select.Item value="all">All Semesters</Select.Item>
                  <Select.Item value="Fall">Fall</Select.Item>
                  <Select.Item value="Spring">Spring</Select.Item>
                  <Select.Item value="Summer">Summer</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>

            {/* Status Filter */}
            <Box className="min-w-[150px]">
              <Select.Root
                value={filters.selectedStatus}
                onValueChange={(value) =>
                  updateFilters({ selectedStatus: value })
                }
                size="2"
              >
                <Select.Trigger className="w-full" />
                <Select.Content>
                  <Select.Item value="all">All Status</Select.Item>
                  <Select.Item value="published">Published</Select.Item>
                  <Select.Item value="pending">Pending</Select.Item>
                  <Select.Item value="pass">Pass</Select.Item>
                  <Select.Item value="fail">Fail</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>
          </Flex>
        </Box>

        {/* Results Table */}
        <Box className="overflow-x-auto">
          {isLoading ? (
            <>
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonTableRow key={i} columns={8} className="mb-2" />
              ))}
            </>
          ) : filteredResults && filteredResults.length > 0 ? (
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
                      Course
                    </Text>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                    <Text size="2" weight="medium" className="text-gray-700">
                      Semester
                    </Text>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                    <Text size="2" weight="medium" className="text-gray-700">
                      GPA
                    </Text>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                    <Text size="2" weight="medium" className="text-gray-700">
                      Percentage
                    </Text>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                    <Text size="2" weight="medium" className="text-gray-700">
                      Grade
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
                {filteredResults.map((result, index) => (
                  <Table.Row
                    key={result.id}
                    className={`hover:bg-gray-50/50 transition-colors animate-in slide-in-from-bottom-1 duration-300 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Table.Cell className="py-4 px-6">
                      <Flex align="center" gap="3">
                        <Box
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            result.grade === 'A+' || result.grade === 'A'
                              ? 'bg-green-100 ring-2 ring-green-200'
                              : result.grade === 'A-' || result.grade === 'B+'
                                ? 'bg-blue-100 ring-2 ring-blue-200'
                                : result.grade === 'B' || result.grade === 'B-'
                                  ? 'bg-orange-100 ring-2 ring-orange-200'
                                  : 'bg-red-100 ring-2 ring-red-200'
                          }`}
                        >
                          <GraduationCap
                            className={`w-4 h-4 ${
                              result.grade === 'A+' || result.grade === 'A'
                                ? 'text-green-600'
                                : result.grade === 'A-' || result.grade === 'B+'
                                  ? 'text-blue-600'
                                  : result.grade === 'B' ||
                                      result.grade === 'B-'
                                    ? 'text-orange-600'
                                    : 'text-red-600'
                            }`}
                          />
                        </Box>
                        <Box>
                          <Text
                            size="2"
                            weight="medium"
                            className="text-gray-900 block"
                          >
                            {result.studentName}
                          </Text>
                          <Text size="1" className="text-gray-600">
                            {result.studentId}
                          </Text>
                        </Box>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Text size="2" className="text-gray-900">
                        {result.course}
                      </Text>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Text size="2" className="text-gray-900">
                        {result.semester} {result.year}
                      </Text>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Text size="2" weight="medium" className="text-gray-900">
                        {result.gpa}
                      </Text>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Text size="2" className="text-gray-900">
                        {result.percentage.toFixed(1)}%
                      </Text>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Badge
                        color={getGradeColor(result.grade)}
                        variant="soft"
                        size="1"
                      >
                        {result.grade}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Flex align="center" gap="2">
                        {getStatusIcon(result.status)}
                        <Badge
                          color={getStatusColor(result.status)}
                          variant="soft"
                          size="1"
                        >
                          {result.status}
                        </Badge>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Flex gap="1">
                        <RadixButton
                          variant="ghost"
                          size="1"
                          className="hover:bg-blue-50"
                        >
                          <Eye className="w-3 h-3" />
                        </RadixButton>
                        <RadixButton
                          variant="ghost"
                          size="1"
                          className="hover:bg-orange-50"
                        >
                          <Edit className="w-3 h-3" />
                        </RadixButton>
                        <RadixButton
                          variant="ghost"
                          size="1"
                          className="hover:bg-gray-50"
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
                No results found
              </Text>
              <Text size="2" className="text-gray-500 mb-4">
                Try adjusting your search criteria or add new results
              </Text>
              <RadixButton
                variant="solid"
                size="3"
                className="bg-green-600 hover:bg-green-700"
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                Add Results
              </RadixButton>
            </Box>
          )}
        </Box>
      </RadixCard>
    </Box>
  );
}
