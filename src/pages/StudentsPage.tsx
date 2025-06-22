import { Flex } from '@radix-ui/themes';
import { DashboardLayout } from 'components/layout/DashboardLayout';
import { RadixButton } from 'components/ui/RadixButton';
import { PageHeader } from 'components/ui/PageHeader';
import { StatsGrid } from 'components/ui/StatsGrid';
import {
  PersonTable,
  TableColumn,
  TableAction,
  BasePerson,
} from 'components/ui/PersonTable';
import {
  GraduationCap,
  UserPlus,
  Calendar,
  BookOpen,
  Eye,
  Download,
  Filter,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Define student interface extending BasePerson
interface Student extends BasePerson {
  class: string;
  rollNumber: string;
  attendance: string;
  grade: string;
}

export function StudentsPage(): JSX.Element {
  const navigate = useNavigate();

  // Handler functions for export and filter
  const handleExport = () => {
    try {
      // Convert students data to CSV format
      const headers = ['Name', 'Class', 'Attendance', 'Grade', 'Status'];
      const csvContent = [
        headers.join(','),
        ...students.map((student) =>
          [
            `"${student.name}"`,
            `"${student.class}"`,
            `"${student.attendance}"`,
            `"${student.grade}"`,
            `"${student.status}"`,
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
        `student-directory-${new Date().toISOString().split('T')[0]}.csv`
      );
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log('Student directory exported successfully');
    } catch (error) {
      console.error('Error exporting student directory:', error);
    }
  };

  const handleFilter = () => {
    // TODO: Implement filter functionality
    // This could open a filter modal or sidebar
    console.log('Filter student directory');
  };

  const students: Student[] = [
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

  // Column configuration for students table
  const columns: TableColumn<Student>[] = [
    { key: 'name', label: 'Student' },
    { key: 'class', label: 'Class' },
    { key: 'attendance', label: 'Attendance' },
    { key: 'grade', label: 'Grade' },
    { key: 'status', label: 'Status' },
  ];

  // Action buttons configuration
  const actions: TableAction<Student>[] = [
    {
      label: 'View Profile',
      icon: Eye,
      variant: 'ghost',
      onClick: (student) =>
        navigate('/students/view', {
          state: { studentData: student },
        }),
    },
  ];

  const headerActions = [
    {
      label: 'Add New Student',
      icon: UserPlus,
      isPrimary: true,
      onClick: () => navigate('/students/add'),
    },
  ];

  const stats = [
    {
      title: 'Total Students',
      value: '946',
      icon: GraduationCap,
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-100',
      trend: { value: '10%', isPositive: true },
    },
    {
      title: 'Active Students',
      value: '932',
      icon: GraduationCap,
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-100',
    },
    {
      title: 'Avg Attendance',
      value: '91.2%',
      icon: Calendar,
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-100',
      trend: { value: '2.5%', isPositive: true },
    },
    {
      title: 'Classes',
      value: '24',
      icon: BookOpen,
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-100',
    },
  ];

  // Header actions for the table
  const tableHeaderActions = (
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
  );

  return (
    <DashboardLayout>
      <PageHeader
        title="Students"
        description="Manage student records and academic progress"
        actions={headerActions}
      />

      <StatsGrid stats={stats} />

      {/* Students Table using standardized PersonTable */}
      <PersonTable
        title="Student Directory"
        data={students}
        columns={columns}
        actions={actions}
        avatarColorScheme="purple"
        headerActions={tableHeaderActions}
        emptyMessage="No students found"
      />
    </DashboardLayout>
  );
}
