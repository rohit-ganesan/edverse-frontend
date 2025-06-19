import { Box, Flex, Text, Heading, Grid, Table } from '@radix-ui/themes';
import { DashboardLayout } from 'components/layout/DashboardLayout';
import { RadixCard } from 'components/ui/RadixCard';
import { Button } from 'components/ui/RadixButton';
import { StatsCard } from 'components/dashboard/StatsCard';
import { Users, UserPlus, Mail, Phone, Award } from 'lucide-react';

export function TeachersPage(): JSX.Element {
  const teachers = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      subject: 'Mathematics',
      email: 'sarah.johnson@school.edu',
      phone: '+1 (555) 123-4567',
      experience: '8 years',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Prof. Michael Chen',
      subject: 'Physics',
      email: 'michael.chen@school.edu',
      phone: '+1 (555) 234-5678',
      experience: '12 years',
      status: 'Active',
    },
    {
      id: 3,
      name: 'Ms. Emily Davis',
      subject: 'English Literature',
      email: 'emily.davis@school.edu',
      phone: '+1 (555) 345-6789',
      experience: '5 years',
      status: 'Active',
    },
    {
      id: 4,
      name: 'Dr. James Wilson',
      subject: 'Chemistry',
      email: 'james.wilson@school.edu',
      phone: '+1 (555) 456-7890',
      experience: '15 years',
      status: 'On Leave',
    },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <Flex justify="between" align="center" className="mb-6">
        <Box>
          <Heading size="6" className="text-gray-900 mb-2">
            Teachers Management
          </Heading>
          <Text size="3" className="text-gray-600">
            Manage faculty members and their information
          </Text>
        </Box>
        <Button size="3">
          <UserPlus className="w-4 h-4 mr-2" />
          Add New Teacher
        </Button>
      </Flex>

      {/* Stats Cards */}
      <Grid columns="4" gap="6" className="mb-6">
        <StatsCard
          title="Total Teachers"
          value="51"
          icon={Users}
          trend={{ value: 4, isPositive: true }}
        />
        <StatsCard title="Active Teachers" value="48" icon={Users} />
        <StatsCard title="On Leave" value="3" icon={Users} />
        <StatsCard title="Avg Experience" value="8.5 years" icon={Award} />
      </Grid>

      {/* Teachers Table */}
      <RadixCard size="2" className="p-6">
        <Box className="mb-4">
          <Heading size="4" className="text-gray-900">
            Faculty Directory
          </Heading>
        </Box>

        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Subject</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Contact</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Experience</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {teachers.map((teacher) => (
              <Table.Row key={teacher.id}>
                <Table.Cell>
                  <Flex align="center" gap="3">
                    <Box className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Text size="2" weight="medium" className="text-blue-600">
                        {teacher.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </Text>
                    </Box>
                    <Box>
                      <Text size="2" weight="medium" className="text-gray-900">
                        {teacher.name}
                      </Text>
                    </Box>
                  </Flex>
                </Table.Cell>
                <Table.Cell>
                  <Text size="2" className="text-gray-700">
                    {teacher.subject}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Box>
                    <Flex align="center" gap="2" className="mb-1">
                      <Mail className="w-3 h-3 text-gray-400" />
                      <Text size="1" className="text-gray-600">
                        {teacher.email}
                      </Text>
                    </Flex>
                    <Flex align="center" gap="2">
                      <Phone className="w-3 h-3 text-gray-400" />
                      <Text size="1" className="text-gray-600">
                        {teacher.phone}
                      </Text>
                    </Flex>
                  </Box>
                </Table.Cell>
                <Table.Cell>
                  <Text size="2" className="text-gray-700">
                    {teacher.experience}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Box
                    className={`
                      inline-flex px-2 py-1 rounded-full text-xs font-medium
                      ${
                        teacher.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }
                    `}
                  >
                    {teacher.status}
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
