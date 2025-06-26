import React from 'react';
import { Box, Flex, Text, Badge } from '@radix-ui/themes';
import {
  DataTable,
  DataTableColumn,
  DataTableAction,
} from 'components/ui/DataTable';
import { GraduationCap, Users, BookOpen, Eye, User } from 'lucide-react';
import { useStudentData } from '../hooks/useStudentData';
import { useStudentManagement } from '../hooks/useStudentManagement';
import type { ClassSection } from '../types';
import { SkeletonCard } from 'components/ui/Skeleton';

export function Classes({
  isLoading = false,
}: {
  isLoading?: boolean;
}): JSX.Element {
  const { classSections } = useStudentData();
  const { handleMarkAttendance } = useStudentManagement();

  const getStrengthColor = (strength: number) => {
    if (strength >= 40) return 'red';
    if (strength >= 30) return 'yellow';
    if (strength >= 20) return 'blue';
    return 'green';
  };

  const handleViewStudents = (classSection: ClassSection) => {
    console.log(
      'View students for class:',
      classSection.id,
      'section:',
      classSection.section
    );
    // Navigate to filtered student view
  };

  const handleManageClass = (classSection: ClassSection) => {
    console.log('Manage class:', classSection.id);
    // Navigate to class management page
  };

  const handleAttendance = (classSection: ClassSection) => {
    handleMarkAttendance(classSection.id, classSection.section);
  };

  const handleAddClass = () => {
    console.log('Add new class');
  };

  const columns: DataTableColumn<ClassSection>[] = [
    {
      key: 'class',
      label: 'Class & Section',
      icon: <GraduationCap className="w-4 h-4 text-gray-500" />,
      render: (classSection) => (
        <Flex align="center" gap="3">
          <Box className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Text size="1" weight="bold" className="text-blue-600">
              {classSection.className.charAt(0)}
              {classSection.section}
            </Text>
          </Box>
          <Box>
            <Text
              size="2"
              weight="medium"
              className="text-gray-900 dark:text-gray-100 block"
            >
              {classSection.className} - Section {classSection.section}
            </Text>
            <Text size="1" className="text-gray-500 dark:text-gray-400 block">
              Class ID: {classSection.id}
            </Text>
          </Box>
        </Flex>
      ),
    },
    {
      key: 'teacher',
      label: 'Class Teacher',
      render: (classSection) => (
        <Flex align="center" gap="2">
          <User className="w-4 h-4 text-gray-400" />
          <Text size="2" className="text-gray-700 dark:text-gray-100 block">
            {classSection.classTeacher}
          </Text>
        </Flex>
      ),
    },
    {
      key: 'students',
      label: 'Students',
      render: (classSection) => (
        <Badge
          color={getStrengthColor(classSection.strength)}
          variant="soft"
          size="1"
        >
          <Users className="w-3 h-3 mr-1" />
          {classSection.strength}
        </Badge>
      ),
    },
    {
      key: 'subjects',
      label: 'Subjects',
      render: (classSection) => (
        <Flex align="center" gap="2">
          <BookOpen className="w-4 h-4 text-gray-400" />
          <Text size="2" className="text-gray-700 font-medium">
            {classSection.subjects.length}
          </Text>
        </Flex>
      ),
    },
    {
      key: 'subjectList',
      label: 'Subject List',
      render: (classSection) => (
        <Box>
          <div className="flex flex-wrap gap-1">
            {classSection.subjects.slice(0, 3).map((subject, idx) => (
              <Badge key={idx} variant="soft" size="1" color="blue">
                {subject}
              </Badge>
            ))}
            {classSection.subjects.length > 3 && (
              <Badge variant="soft" size="1" color="gray">
                +{classSection.subjects.length - 3} more
              </Badge>
            )}
          </div>
        </Box>
      ),
    },
  ];

  const actions: DataTableAction<ClassSection>[] = [
    {
      icon: <Eye className="w-4 h-4" />,
      label: 'View Students',
      onClick: handleViewStudents,
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: 'Mark Attendance',
      onClick: handleAttendance,
    },
    {
      icon: <BookOpen className="w-4 h-4" />,
      label: 'Manage Class',
      onClick: handleManageClass,
    },
  ];

  const handleSort = (sortBy: string, data: ClassSection[]) => {
    return [...data].sort((a, b) => {
      switch (sortBy) {
        case 'students':
          return b.strength - a.strength;
        case 'subjects':
          return b.subjects.length - a.subjects.length;
        case 'teacher':
          return a.classTeacher.localeCompare(b.classTeacher);
        default:
          return (
            a.className.localeCompare(b.className) ||
            a.section.localeCompare(b.section)
          );
      }
    });
  };

  return (
    <Box>
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <SkeletonCard key={i} height={80} />
          ))}
        </div>
      ) : (
        <DataTable
          data={classSections}
          columns={columns}
          actions={actions}
          title="Class Sections"
          icon={<GraduationCap className="w-5 h-5 text-purple-600" />}
          searchPlaceholder="Search by class, section, teacher, or subjects..."
          searchFields={['className', 'section', 'classTeacher', 'subjects']}
          sortOptions={[
            { value: 'name', label: 'Sort by Name' },
            { value: 'students', label: 'Sort by Students' },
            { value: 'subjects', label: 'Sort by Subjects' },
            { value: 'teacher', label: 'Sort by Teacher' },
          ]}
          headerActions={[
            {
              label: 'Add Class',
              icon: <GraduationCap className="w-4 h-4 mr-1" />,
              onClick: handleAddClass,
            },
          ]}
          onSort={handleSort}
          getRowKey={(classSection, index) => classSection.id.toString()}
          emptyStateIcon={<GraduationCap className="w-12 h-12" />}
          emptyStateTitle="No classes found"
          emptyStateSubtitle="Try adjusting your search terms or add a new class"
        />
      )}
    </Box>
  );
}
