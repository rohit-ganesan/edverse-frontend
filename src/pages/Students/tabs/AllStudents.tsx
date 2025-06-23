import { useMemo } from 'react';
import { Box, Flex, Text, Badge } from '@radix-ui/themes';
import {
  DataTable,
  DataTableColumn,
  DataTableAction,
} from 'components/ui/DataTable';
import { Users, User, Eye, UserPlus } from 'lucide-react';
import { useStudentData } from '../hooks/useStudentData';
import { useStudentManagement } from '../hooks/useStudentManagement';
import type { Student } from '../types';

export function AllStudents(): JSX.Element {
  const { students } = useStudentData();
  const { handleViewStudent, handleAddStudent } = useStudentManagement();

  // Get unique classes for filter
  const classes = useMemo(() => {
    const uniqueClasses = Array.from(new Set(students.map((s) => s.class)));
    return uniqueClasses.map((cls) => ({
      value: cls.toLowerCase().replace(' ', '-'),
      label: cls,
    }));
  }, [students]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'green';
      case 'inactive':
        return 'gray';
      case 'suspended':
        return 'red';
      case 'graduated':
        return 'blue';
      default:
        return 'gray';
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade?.startsWith('A')) return 'green';
    if (grade?.startsWith('B')) return 'blue';
    if (grade?.startsWith('C')) return 'yellow';
    return 'gray';
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 95) return 'text-green-600';
    if (percentage >= 85) return 'text-blue-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const columns: DataTableColumn<Student>[] = [
    {
      key: 'student',
      label: 'Student',
      icon: <User className="w-4 h-4 text-gray-500" />,
      render: (student) => (
        <Flex align="center" gap="3">
          <Box className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Text size="1" weight="bold" className="text-blue-600">
              {student.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </Text>
          </Box>
          <Box>
            <Text size="2" weight="medium" className="text-gray-900 block">
              {student.name}
            </Text>
            <Text size="1" className="text-gray-500 block">
              {student.rollNumber}
            </Text>
          </Box>
        </Flex>
      ),
    },
    {
      key: 'class',
      label: 'Class',
      render: (student) => (
        <Box>
          <Text size="2" className="text-gray-700 block">
            {student.class}
          </Text>
          <Text size="1" className="text-gray-500">
            Section {student.section}
          </Text>
        </Box>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (student) => (
        <Badge
          color={getStatusColor(student.status || 'active')}
          variant="soft"
          size="1"
        >
          {student.status || 'active'}
        </Badge>
      ),
    },
    {
      key: 'attendance',
      label: 'Attendance',
      render: (student) => (
        <Text
          size="2"
          className={`font-medium ${getAttendanceColor(student.attendance.percentage)}`}
        >
          {student.attendance.percentage}%
        </Text>
      ),
    },
    {
      key: 'grade',
      label: 'Grade',
      render: (student) => (
        <Badge
          color={getGradeColor(student.academicRecord.currentGrade)}
          variant="soft"
          size="1"
        >
          {student.academicRecord.currentGrade}
        </Badge>
      ),
    },
    {
      key: 'contact',
      label: 'Contact',
      render: (student) => (
        <Box>
          <Text size="1" className="text-gray-700 block">
            {student.parentEmail}
          </Text>
          <Text size="1" className="text-gray-500">
            {student.parentPhone}
          </Text>
        </Box>
      ),
    },
  ];

  const actions: DataTableAction<Student>[] = [
    {
      icon: <Eye className="w-5 h-5" />,
      label: 'View Details',
      onClick: handleViewStudent,
    },
  ];

  const handleSort = (sortBy: string, data: Student[]) => {
    return [...data].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'class':
          return (
            a.class.localeCompare(b.class) || a.section.localeCompare(b.section)
          );
        case 'attendance':
          return b.attendance.percentage - a.attendance.percentage;
        case 'grade':
          return a.academicRecord.currentGrade.localeCompare(
            b.academicRecord.currentGrade
          );
        default:
          return 0;
      }
    });
  };

  const handleFilter = (filters: Record<string, string>, data: Student[]) => {
    return data.filter((student) => {
      const classMatch =
        !filters.class ||
        filters.class === 'all' ||
        student.class.toLowerCase().replace(' ', '-') === filters.class;
      const statusMatch =
        !filters.status ||
        filters.status === 'all' ||
        (student.status || 'active').toLowerCase() === filters.status;
      return classMatch && statusMatch;
    });
  };

  return (
    <DataTable
      data={students}
      columns={columns}
      actions={actions}
      title="Student Records"
      icon={<Users className="w-5 h-5 text-purple-600" />}
      searchPlaceholder="Search by student name, roll number, or parent..."
      searchFields={['name', 'rollNumber', 'parentEmail', 'parentName']}
      filters={[
        {
          key: 'class',
          label: 'Classes',
          options: classes,
        },
        {
          key: 'status',
          label: 'Status',
          options: [
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
            { value: 'suspended', label: 'Suspended' },
            { value: 'graduated', label: 'Graduated' },
          ],
        },
      ]}
      sortOptions={[
        { value: 'name', label: 'Sort by Name' },
        { value: 'class', label: 'Sort by Class' },
        { value: 'attendance', label: 'Sort by Attendance' },
        { value: 'grade', label: 'Sort by Grade' },
      ]}
      headerActions={[
        {
          label: 'Add Student',
          icon: <UserPlus className="w-4 h-4 mr-1" />,
          onClick: handleAddStudent,
        },
      ]}
      onSort={handleSort}
      onFilter={handleFilter}
      getRowKey={(student, index) => student.id.toString()}
      emptyStateIcon={<User className="w-12 h-12" />}
      emptyStateTitle="No students found"
      emptyStateSubtitle="Try adjusting your search terms or add a new student"
    />
  );
}
