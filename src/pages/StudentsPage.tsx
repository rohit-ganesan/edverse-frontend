import { Box, Flex, Text, Heading, Grid, Table } from '@radix-ui/themes';
import { DashboardLayout } from 'components/layout/DashboardLayout';
import { RadixCard } from 'components/ui/RadixCard';
import { Button } from 'components/ui/RadixButton';
import { StatsCard } from 'components/dashboard/StatsCard';
import { GraduationCap, UserPlus, Calendar, BookOpen } from 'lucide-react';

export function StudentsPage(): JSX.Element {
  const students = [
    {
      id: 1,
      name: 'Alex Thompson',
      class: 'Grade 10-A',
      rollNumber: 'S001',
      attendance: '95%',
      grade: 'A',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Emma Rodriguez',
      class: 'Grade 10-A',
      rollNumber: 'S002',
      attendance: '92%',
      grade: 'A-',
      status: 'Active',
    },
    {
      id: 3,
      name: 'Michael Park',
      class: 'Grade 10-B',
      rollNumber: 'S003',
      attendance: '88%',
      grade: 'B+',
      status: 'Active',
    },
    {
      id: 4,
      name: 'Sophia Chen',
      class: 'Grade 10-A',
      rollNumber: 'S004',
      attendance: '97%',
      grade: 'A+',
      status: 'Active',
    },
    {
      id: 5,
      name: 'David Johnson',
      class: 'Grade 10-B',
      rollNumber: 'S005',
      attendance: '85%',
      grade: 'B',
      status: 'Active',
    },
  ];

  const getGradeColor = (grade: string): string => {
    if (grade.startsWith('A')) return 'bg-green-100 text-green-700';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-700';
    if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <Flex justify="between" align="center" className="mb-6">
        <Box>
          <Heading size="6" className="text-gray-900 mb-2">
            Students Management
          </Heading>
          <Text size="3" className="text-gray-600">
            Manage student records and academic progress
          </Text>
        </Box>
        <Button size="3">
          <UserPlus className="w-4 h-4 mr-2" />
          Add New Student
        </Button>
      </Flex>

      {/* Stats Cards */}
      <Grid columns="4" gap="6" className="mb-6">
        <StatsCard
          title="Total Students"
          value="946"
          icon={GraduationCap}
          trend={{ value: 10, isPositive: true }}
        />
        <StatsCard title="Active Students" value="932" icon={GraduationCap} />
        <StatsCard
          title="Avg Attendance"
          value="91.2%"
          icon={Calendar}
          trend={{ value: 2.5, isPositive: true }}
        />
        <StatsCard title="Classes" value="24" icon={BookOpen} />
      </Grid>

      {/* Students Table */}
      <RadixCard size="2" className="p-6">
        <Flex justify="between" align="center" className="mb-4">
          <Heading size="4" className="text-gray-900">
            Student Directory
          </Heading>
          <Flex gap="2">
            <Button variant="outline" size="2">
              Export
            </Button>
            <Button variant="outline" size="2">
              Filter
            </Button>
          </Flex>
        </Flex>

        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Student</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Class</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Roll Number</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Attendance</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Grade</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {students.map((student) => (
              <Table.Row key={student.id}>
                <Table.Cell>
                  <Flex align="center" gap="3">
                    <Box className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Text
                        size="2"
                        weight="medium"
                        className="text-purple-600"
                      >
                        {student.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </Text>
                    </Box>
                    <Box>
                      <Text size="2" weight="medium" className="text-gray-900">
                        {student.name}
                      </Text>
                    </Box>
                  </Flex>
                </Table.Cell>
                <Table.Cell>
                  <Text size="2" className="text-gray-700">
                    {student.class}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Text size="2" weight="medium" className="text-gray-900">
                    {student.rollNumber}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Box className="flex items-center gap-2">
                    <Box
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor:
                          parseInt(student.attendance) >= 90
                            ? '#10b981'
                            : parseInt(student.attendance) >= 80
                              ? '#f59e0b'
                              : '#ef4444',
                      }}
                    />
                    <Text size="2" className="text-gray-700">
                      {student.attendance}
                    </Text>
                  </Box>
                </Table.Cell>
                <Table.Cell>
                  <Box
                    className={`
                      inline-flex px-2 py-1 rounded-full text-xs font-medium
                      ${getGradeColor(student.grade)}
                    `}
                  >
                    {student.grade}
                  </Box>
                </Table.Cell>
                <Table.Cell>
                  <Box className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    {student.status}
                  </Box>
                </Table.Cell>
                <Table.Cell>
                  <Flex gap="2">
                    <Button variant="ghost" size="1">
                      View
                    </Button>
                    <Button variant="ghost" size="1">
                      Edit
                    </Button>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </RadixCard>
    </DashboardLayout>
  );
}
