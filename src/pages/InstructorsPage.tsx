import { Box, Flex, Text, Heading, Table } from '@radix-ui/themes';
import { DashboardLayout } from 'components/layout/DashboardLayout';
import { RadixCard } from 'components/ui/RadixCard';
import { RadixButton } from 'components/ui/RadixButton';
import { PageHeader } from 'components/ui/PageHeader';
import { StatsGrid } from 'components/ui/StatsGrid';
import { Users, UserPlus, Mail, Phone, Award } from 'lucide-react';

export function InstructorsPage(): JSX.Element {
  const instructors = [
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

  const headerActions = [
    {
      label: 'Add New Instructor',
      icon: UserPlus,
      isPrimary: true,
      onClick: () => console.log('Add new instructor'),
    },
  ];

  const stats = [
    {
      title: 'Total Instructors',
      value: '51',
      icon: Users,
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-100',
      trend: { value: '4%', isPositive: true },
    },
    {
      title: 'Active Instructors',
      value: '48',
      icon: Users,
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-100',
    },
    {
      title: 'On Leave',
      value: '3',
      icon: Users,
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-100',
    },
    {
      title: 'Avg Experience',
      value: '8.5 years',
      icon: Award,
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-100',
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Instructors Management"
        description="Manage faculty members and their information"
        actions={headerActions}
      />

      <StatsGrid stats={stats} />

      {/* Instructors Table */}
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
            {instructors.map((instructor) => (
              <Table.Row key={instructor.id}>
                <Table.Cell>
                  <Flex align="center" gap="3">
                    <Box className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Text size="2" weight="medium" className="text-blue-600">
                        {instructor.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </Text>
                    </Box>
                    <Box>
                      <Text size="2" weight="medium" className="text-gray-900">
                        {instructor.name}
                      </Text>
                    </Box>
                  </Flex>
                </Table.Cell>
                <Table.Cell>
                  <Text size="2" className="text-gray-700">
                    {instructor.subject}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Box>
                    <Flex align="center" gap="2" className="mb-1">
                      <Mail className="w-3 h-3 text-gray-400" />
                      <Text size="1" className="text-gray-600">
                        {instructor.email}
                      </Text>
                    </Flex>
                    <Flex align="center" gap="2">
                      <Phone className="w-3 h-3 text-gray-400" />
                      <Text size="1" className="text-gray-600">
                        {instructor.phone}
                      </Text>
                    </Flex>
                  </Box>
                </Table.Cell>
                <Table.Cell>
                  <Text size="2" className="text-gray-700">
                    {instructor.experience}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Box
                    className={`
                      inline-flex px-2 py-1 rounded-full text-xs font-medium
                      ${
                        instructor.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }
                    `}
                  >
                    {instructor.status}
                  </Box>
                </Table.Cell>
                <Table.Cell>
                  <Flex gap="2">
                    <RadixButton variant="ghost" size="1">
                      View
                    </RadixButton>
                    <RadixButton variant="ghost" size="1">
                      Edit
                    </RadixButton>
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
