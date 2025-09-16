import { useMemo } from 'react';
import { Box, Flex, Text, Badge } from '@radix-ui/themes';
import {
  DataTable,
  DataTableColumn,
  DataTableAction,
} from 'components/ui/DataTable';
import { Building, Users, BookOpen, Eye } from 'lucide-react';
import { useInstructorData } from '../hooks/useInstructorData';
import type { Department } from '../types';
import { SkeletonCard } from 'components/ui/Skeleton';
import { Plan } from 'types/access';

export function Departments({
  isLoading = false,
}: {
  isLoading?: boolean;
}): JSX.Element {
  const {
    instructors,
    isLoading: instructorDataLoading,
    error,
  } = useInstructorData();

  // Generate department data from instructors
  const departments = useMemo(() => {
    const deptMap = new Map<string, Department>();

    instructors.forEach((instructor) => {
      const deptName = instructor.department;
      if (!deptMap.has(deptName)) {
        // Create department entry
        const deptInstructors = instructors.filter(
          (i) => i.department === deptName
        );
        const avgPerformance =
          deptInstructors.reduce((sum, i) => sum + i.performance.rating, 0) /
          deptInstructors.length;

        // Get unique subjects and classes
        const subjectsSet = new Set(deptInstructors.flatMap((i) => i.subjects));
        const subjects = Array.from(subjectsSet);
        const classesSet = new Set(deptInstructors.flatMap((i) => i.classes));
        const classes = Array.from(classesSet);

        // Find department head (highest rated instructor)
        const head = deptInstructors.reduce((best, current) =>
          current.performance.rating > best.performance.rating ? current : best
        );

        deptMap.set(deptName, {
          id: deptName.toLowerCase().replace(/\s+/g, '-'),
          name: deptName,
          code: deptName
            .split(' ')
            .map((word) => word[0])
            .join('')
            .toUpperCase(),
          head: head.name,
          instructorCount: deptInstructors.length,
          totalStudents: Math.floor(Math.random() * 500) + 100, // Mock data
          activeCourses: subjects.length,
          avgPerformance,
          subjects,
          classes,
        });
      }
    });

    return Array.from(deptMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [instructors]);

  const getPerformanceColor = (rating: number) => {
    if (rating >= 4.5) return 'green';
    if (rating >= 4.0) return 'blue';
    if (rating >= 3.5) return 'yellow';
    return 'red';
  };

  const handleAddDepartment = () => {
    console.log('Add new department');
  };

  const handleViewDepartment = (department: Department) => {
    console.log('View department:', department);
  };

  const columns: DataTableColumn<Department>[] = [
    {
      key: 'department',
      label: 'Department',
      icon: <Building className="w-4 h-4 text-gray-500" />,
      render: (department) => (
        <Flex align="center" gap="3">
          <Box className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Text size="1" weight="bold" className="text-blue-600">
              {department.code}
            </Text>
          </Box>
          <Box>
            <Text size="2" weight="medium" className="text-gray-900 block">
              {department.name}
            </Text>
            <Text size="1" className="text-gray-500 block">
              {department.subjects.slice(0, 2).join(', ')}
              {department.subjects.length > 2 &&
                ` +${department.subjects.length - 2} more`}
            </Text>
          </Box>
        </Flex>
      ),
    },
    {
      key: 'head',
      label: 'Head',
      render: (department) => (
        <Box>
          <Text size="2" className="text-gray-700 block">
            {department.head}
          </Text>
          <Text size="1" className="text-gray-500">
            Department Head
          </Text>
        </Box>
      ),
    },
    {
      key: 'instructors',
      label: 'Instructors',
      render: (department) => (
        <Flex align="center" gap="2">
          <Users className="w-4 h-4 text-gray-400" />
          <Text size="2" className="text-gray-700 font-medium">
            {department.instructorCount}
          </Text>
        </Flex>
      ),
    },
    {
      key: 'students',
      label: 'Students',
      render: (department) => (
        <Text size="2" className="text-gray-700 font-medium">
          {department.totalStudents.toLocaleString()}
        </Text>
      ),
    },
    {
      key: 'courses',
      label: 'Courses',
      render: (department) => (
        <Flex align="center" gap="2">
          <BookOpen className="w-4 h-4 text-gray-400" />
          <Text size="2" className="text-gray-700 font-medium">
            {department.activeCourses}
          </Text>
        </Flex>
      ),
    },
    {
      key: 'performance',
      label: 'Performance',
      render: (department) => (
        <Badge
          color={getPerformanceColor(department.avgPerformance)}
          variant="soft"
          size="1"
        >
          {department.avgPerformance.toFixed(1)}/5.0
        </Badge>
      ),
    },
  ];

  const actions: DataTableAction<Department>[] = [
    {
      icon: <Eye className="w-5 h-5" />,
      label: 'View Department',
      onClick: handleViewDepartment,
    },
  ];

  const handleSort = (sortBy: string, data: Department[]) => {
    return [...data].sort((a, b) => {
      switch (sortBy) {
        case 'instructors':
          return b.instructorCount - a.instructorCount;
        case 'students':
          return b.totalStudents - a.totalStudents;
        case 'performance':
          return b.avgPerformance - a.avgPerformance;
        default:
          return a.name.localeCompare(b.name);
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
          data={departments}
          columns={columns}
          actions={actions}
          title="Departments"
          icon={<Building className="w-5 h-5 text-purple-600" />}
          searchPlaceholder="Search by name, code, head, or subjects..."
          searchFields={['name', 'code', 'head', 'subjects']}
          sortOptions={[
            { value: 'name', label: 'Sort by Name' },
            { value: 'instructors', label: 'Sort by Instructors' },
            { value: 'students', label: 'Sort by Students' },
            { value: 'performance', label: 'Sort by Performance' },
          ]}
          headerActions={[
            {
              label: 'Add Department',
              icon: <Building className="w-4 h-4 mr-1" />,
              onClick: handleAddDepartment,
              gate: { cap: 'staff.invite', neededPlan: 'starter' as any },
            },
          ]}
          advancedFilterGate={{
            cap: 'staff.update',
            neededPlan: 'starter' as Plan,
          }}
          exportGate={{ cap: 'staff.update', neededPlan: 'starter' as Plan }}
          onSort={handleSort}
          getRowKey={(department, index) => department.id.toString()}
          error={error}
          emptyStateIcon={<Building className="w-12 h-12" />}
          emptyStateTitle="No departments found"
          emptyStateSubtitle="Try adjusting your search terms or add a new department"
        />
      )}
    </Box>
  );
}
