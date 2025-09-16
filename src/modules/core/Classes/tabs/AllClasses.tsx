import React from 'react';
import { Box, Flex, Text, Badge } from '@radix-ui/themes';
import {
  DataTable,
  DataTableColumn,
  DataTableAction,
} from 'components/ui/DataTable';
import {
  GraduationCap,
  Users,
  BookOpen,
  Eye,
  User,
  Edit,
  Trash2,
} from 'lucide-react';
// import { useClassesData } from '../hooks/useClassesData'; // Will be used when integrating with real data
import type { ClassSection } from '../types';
import { SkeletonCard } from 'components/ui/Skeleton';
import type { Plan } from 'types/access';

// Mock class sections data - this should eventually come from the API
const mockClassSections: ClassSection[] = [
  {
    id: '1',
    className: 'Grade 10',
    section: 'A',
    strength: 25,
    classTeacher: 'Dr. Smith',
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'],
  },
  {
    id: '2',
    className: 'Grade 10',
    section: 'B',
    strength: 22,
    classTeacher: 'Prof. Johnson',
    subjects: ['Mathematics', 'Biology', 'Chemistry', 'English'],
  },
  {
    id: '3',
    className: 'Grade 11',
    section: 'A',
    strength: 28,
    classTeacher: 'Dr. Williams',
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'Computer Science'],
  },
  {
    id: '4',
    className: 'Grade 11',
    section: 'B',
    strength: 24,
    classTeacher: 'Ms. Brown',
    subjects: ['Mathematics', 'Biology', 'Chemistry', 'English'],
  },
  {
    id: '5',
    className: 'Grade 12',
    section: 'A',
    strength: 30,
    classTeacher: 'Dr. Davis',
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'English'],
  },
  {
    id: '6',
    className: 'Grade 12',
    section: 'B',
    strength: 26,
    classTeacher: 'Prof. Wilson',
    subjects: ['Mathematics', 'Biology', 'Chemistry', 'English'],
  },
];

export function AllClasses({
  isLoading = false,
}: {
  isLoading?: boolean;
}): JSX.Element {
  // const { classes } = useClassesData(); // Will be used when integrating with real data

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
    console.log('Mark attendance for:', classSection.id);
    // Navigate to attendance marking page
  };

  const handleAddClass = () => {
    console.log('Add new class');
  };

  const handleEditClass = (classSection: ClassSection) => {
    console.log('Edit class:', classSection.id);
    // Navigate to edit class page
  };

  const handleDeleteClass = (classSection: ClassSection) => {
    console.log('Delete class:', classSection.id);
    // Show confirmation dialog and delete
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
      label: 'View',
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
    {
      icon: <Edit className="w-4 h-4" />,
      label: 'Edit Class',
      onClick: handleEditClass,
      gate: { cap: 'classes.update', neededPlan: 'starter' as Plan },
    },
    {
      icon: <Trash2 className="w-4 h-4" />,
      label: 'Delete Class',
      onClick: handleDeleteClass,
      gate: { cap: 'classes.delete', neededPlan: 'starter' as Plan },
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
            <SkeletonCard key={i} height="80px" />
          ))}
        </div>
      ) : (
        <DataTable
          data={mockClassSections}
          columns={columns}
          actions={actions}
          title="All Classes"
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
              gate: { cap: 'classes.create', neededPlan: 'starter' as Plan },
            },
          ]}
          advancedFilterGate={{
            cap: 'classes.update',
            neededPlan: 'starter' as Plan,
          }}
          exportGate={{ cap: 'classes.update', neededPlan: 'starter' as Plan }}
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
