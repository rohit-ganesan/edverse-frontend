import { DashboardLayout } from 'components/layout/DashboardLayout';
import { PageHeader } from 'components/ui/PageHeader';
import { StatsGrid } from 'components/ui/StatsGrid';
import {
  PersonTable,
  TableColumn,
  TableAction,
  BasePerson,
} from 'components/ui/PersonTable';
import { Users, UserPlus, Award, Eye, Download, Filter } from 'lucide-react';
import { RadixButton } from 'components/ui/RadixButton';
import { Flex } from '@radix-ui/themes';
import { useNavigate } from 'react-router-dom';

// Define instructor interface extending BasePerson
interface Instructor extends BasePerson {
  subject: string;
  email: string;
  phone: string;
  experience: string;
}

export function InstructorsPage(): JSX.Element {
  const navigate = useNavigate();

  // Handler functions for export and filter
  const handleExport = () => {
    try {
      // Convert instructors data to CSV format
      const headers = [
        'Name',
        'Subject',
        'Email',
        'Phone',
        'Experience',
        'Status',
      ];
      const csvContent = [
        headers.join(','),
        ...instructors.map((instructor) =>
          [
            `"${instructor.name}"`,
            `"${instructor.subject}"`,
            `"${instructor.email}"`,
            `"${instructor.phone}"`,
            `"${instructor.experience}"`,
            `"${instructor.status}"`,
          ].join(',')
        ),
      ].join('\n');

      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `faculty-directory-${new Date().toISOString().split('T')[0]}.csv`
      );
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log('Faculty directory exported successfully');
    } catch (error) {
      console.error('Error exporting faculty directory:', error);
    }
  };

  const handleFilter = () => {
    // TODO: Implement filter functionality
    // This could open a filter modal or sidebar
    console.log('Filter faculty directory');
  };

  const instructors: Instructor[] = [
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

  // Column configuration for instructors table
  const columns: TableColumn<Instructor>[] = [
    { key: 'name', label: 'Name' },
    { key: 'subject', label: 'Subject' },
    { key: 'contact', label: 'Contact' },
    { key: 'experience', label: 'Experience' },
    { key: 'status', label: 'Status' },
  ];

  // Action buttons configuration
  const actions: TableAction<Instructor>[] = [
    {
      label: 'View Profile',
      icon: Eye,
      variant: 'ghost',
      onClick: (instructor) =>
        navigate('/instructors/view', {
          state: { instructorData: instructor },
        }),
    },
  ];

  const headerActions = [
    {
      label: 'Add New Instructor',
      icon: UserPlus,
      isPrimary: true,
      onClick: () => navigate('/instructors/add'),
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
        title="Instructors"
        description="Manage faculty members and their information"
        actions={headerActions}
      />

      <StatsGrid stats={stats} />

      {/* Instructors Table using standardized PersonTable */}
      <PersonTable
        title="Faculty Directory"
        data={instructors}
        columns={columns}
        actions={actions}
        avatarColorScheme="blue"
        emptyMessage="No instructors found"
        headerActions={
          <Flex gap="2" align="center">
            <RadixButton
              variant="outline"
              size="2"
              onClick={handleFilter}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filter
            </RadixButton>
            <RadixButton
              variant="outline"
              size="2"
              onClick={handleExport}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </RadixButton>
          </Flex>
        }
      />
    </DashboardLayout>
  );
}
