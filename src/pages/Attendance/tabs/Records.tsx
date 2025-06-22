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
import { Search, Download, Filter, Calendar, User } from 'lucide-react';
import { useAttendanceData } from '../hooks/useAttendanceData';
import { useSessionManagement } from '../hooks/useSessionManagement';

export function Records(): JSX.Element {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState('2024-01-15');

  const { filteredRecords } = useAttendanceData({
    searchTerm,
    selectedStatus,
    selectedDate,
  });
  const { handleExportReport } = useSessionManagement();

  return (
    <Box className="space-y-8">
      {/* Attendance Records */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        {/* Header Section */}
        <Box className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
          <Flex justify="between" align="center" className="mb-6">
            <Box>
              <Heading size="5" className="text-gray-900 mb-1">
                Attendance Records
              </Heading>
              <Text size="3" className="text-gray-600">
                {filteredRecords?.length || 0} records found
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
                onClick={handleExportReport}
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
                placeholder="Search by student name, ID, or class..."
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
                  <Select.Item value="present">Present</Select.Item>
                  <Select.Item value="absent">Absent</Select.Item>
                  <Select.Item value="late">Late</Select.Item>
                  <Select.Item value="excused">Excused</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>

            {/* Date Filter */}
            <Box className="min-w-[150px]">
              <TextField.Root
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                size="2"
                className="w-full"
              >
                <TextField.Slot>
                  <Calendar className="w-4 h-4 text-gray-400" />
                </TextField.Slot>
              </TextField.Root>
            </Box>
          </Flex>
        </Box>

        {/* Records Table */}
        <Box className="overflow-x-auto">
          {filteredRecords && filteredRecords.length > 0 ? (
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
                      Class
                    </Text>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                    <Text size="2" weight="medium" className="text-gray-700">
                      Status
                    </Text>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                    <Text size="2" weight="medium" className="text-gray-700">
                      Check-in Time
                    </Text>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                    <Text size="2" weight="medium" className="text-gray-700">
                      Method
                    </Text>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                    <Text size="2" weight="medium" className="text-gray-700">
                      Location
                    </Text>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="py-4 px-6 text-left">
                    <Text size="2" weight="medium" className="text-gray-700">
                      Notes
                    </Text>
                  </Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filteredRecords.map((record, index) => (
                  <Table.Row
                    key={record.id}
                    className={`hover:bg-gray-50/50 transition-colors animate-in slide-in-from-bottom-1 duration-300 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Table.Cell className="py-4 px-6">
                      <Flex align="center" gap="3">
                        <Box
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            record.status === 'present'
                              ? 'bg-green-100 ring-2 ring-green-200'
                              : record.status === 'late'
                                ? 'bg-orange-100 ring-2 ring-orange-200'
                                : record.status === 'absent'
                                  ? 'bg-red-100 ring-2 ring-red-200'
                                  : 'bg-gray-100'
                          }`}
                        >
                          <User
                            className={`w-4 h-4 ${
                              record.status === 'present'
                                ? 'text-green-600'
                                : record.status === 'late'
                                  ? 'text-orange-600'
                                  : record.status === 'absent'
                                    ? 'text-red-600'
                                    : 'text-gray-500'
                            }`}
                          />
                        </Box>
                        <Box>
                          <Text
                            size="2"
                            weight="medium"
                            className="text-gray-900 block"
                          >
                            {record.student.name}
                          </Text>
                          <Text size="1" className="text-gray-500 block">
                            {record.student.studentId}
                          </Text>
                        </Box>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Text size="2" className="text-gray-700">
                        {record.className}
                      </Text>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Badge
                        color={
                          record.status === 'present'
                            ? 'green'
                            : record.status === 'absent'
                              ? 'red'
                              : record.status === 'late'
                                ? 'orange'
                                : 'blue'
                        }
                        variant="soft"
                        size="1"
                      >
                        {record.status}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Text size="2" className="text-gray-700">
                        {record.checkInTime || 'N/A'}
                      </Text>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Badge
                        color={
                          record.method === 'qr'
                            ? 'blue'
                            : record.method === 'biometric'
                              ? 'purple'
                              : record.method === 'geofence'
                                ? 'green'
                                : 'gray'
                        }
                        variant="outline"
                        size="1"
                      >
                        {record.method}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Text size="2" className="text-gray-700">
                        {record.location || 'N/A'}
                      </Text>
                    </Table.Cell>
                    <Table.Cell className="py-4 px-6">
                      <Text size="2" className="text-gray-600">
                        {record.notes || '-'}
                      </Text>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          ) : (
            <Box className="text-center py-16">
              <Box className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-gray-400" />
              </Box>
              <Text size="4" weight="medium" className="text-gray-900 mb-2">
                No records found
              </Text>
              <Text size="3" className="text-gray-500 mb-6">
                {searchTerm || selectedStatus !== 'all'
                  ? 'Try adjusting your search filters'
                  : 'No attendance records available for the selected date'}
              </Text>
              {searchTerm || selectedStatus !== 'all' ? (
                <RadixButton
                  variant="soft"
                  size="3"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedStatus('all');
                  }}
                >
                  Clear Filters
                </RadixButton>
              ) : null}
            </Box>
          )}
        </Box>

        {/* Pagination (if needed) */}
        {filteredRecords && filteredRecords.length > 10 && (
          <Box className="p-6 border-t border-gray-100 bg-gray-50/30">
            <Flex justify="between" align="center">
              <Text size="2" className="text-gray-600">
                Showing {filteredRecords.length} of {filteredRecords.length}{' '}
                records
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
