import { useMemo } from 'react';
import { Box, Flex, Text, Badge } from '@radix-ui/themes';
import {
  DataTable,
  DataTableColumn,
  DataTableAction,
} from 'components/ui/DataTable';
import { Users, Eye } from 'lucide-react';
import { useInstructorData } from '../hooks/useInstructorData';
import { useInstructorManagement } from '../hooks/useInstructorManagement';
import type { Instructor } from '../types';
import { SkeletonCard } from 'components/ui/Skeleton';
import { Plan } from 'types/access';

export function AllInstructors({
  isLoading = false,
}: {
  isLoading?: boolean;
}): JSX.Element {
  const { instructors, isLoading: dataLoading, error } = useInstructorData();
  const { handleViewDetails } = useInstructorManagement();

  // Get unique departments for filter
  const departments = useMemo(() => {
    const uniqueDepts = Array.from(
      new Set(instructors.map((i) => i.department))
    );
    return uniqueDepts.map((dept) => ({
      value: dept.toLowerCase(),
      label: dept,
    }));
  }, [instructors]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'green';
      case 'on leave':
        return 'yellow';
      case 'inactive':
        return 'gray';
      case 'retired':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getPerformanceColor = (rating: number) => {
    if (rating >= 4.5) return 'green';
    if (rating >= 4.0) return 'blue';
    if (rating >= 3.5) return 'yellow';
    return 'red';
  };

  const getExperienceLevel = (years: number) => {
    if (years >= 15) return { level: 'Expert', color: 'purple' as const };
    if (years >= 10) return { level: 'Senior', color: 'blue' as const };
    if (years >= 5) return { level: 'Mid-level', color: 'green' as const };
    return { level: 'Junior', color: 'orange' as const };
  };

  const columns: DataTableColumn<Instructor>[] = [
    {
      key: 'instructor',
      label: 'Instructor',
      icon: <Users className="w-4 h-4 text-gray-500" />,
      render: (instructor) => (
        <Flex align="center" gap="3">
          <Box className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Text size="1" weight="bold" className="text-purple-600">
              {instructor.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </Text>
          </Box>
          <Box>
            <Text size="2" weight="medium" className="text-gray-900 block">
              {instructor.name}
            </Text>
            <Text size="1" className="text-gray-500 block">
              {instructor.employeeId}
            </Text>
          </Box>
        </Flex>
      ),
    },
    {
      key: 'department',
      label: 'Department',
      render: (instructor) => (
        <Box>
          <Text size="2" className="text-gray-700 block">
            {instructor.department}
          </Text>
          <Text size="1" className="text-gray-500">
            {instructor.designation}
          </Text>
        </Box>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (instructor) => (
        <Badge
          color={getStatusColor(instructor.status || 'active')}
          variant="soft"
          size="1"
        >
          {instructor.status || 'active'}
        </Badge>
      ),
    },
    {
      key: 'experience',
      label: 'Experience',
      render: (instructor) => {
        const experienceInfo = getExperienceLevel(instructor.experience.years);
        return (
          <Box>
            <Text size="2" className="text-gray-700 block font-medium">
              {instructor.experience.years}y
            </Text>
            <Badge color={experienceInfo.color} variant="soft" size="1">
              {experienceInfo.level}
            </Badge>
          </Box>
        );
      },
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (instructor) => (
        <Badge
          color={getPerformanceColor(instructor.performance.rating)}
          variant="soft"
          size="1"
        >
          {instructor.performance.rating.toFixed(1)}/5.0
        </Badge>
      ),
    },
    {
      key: 'contact',
      label: 'Contact',
      render: (instructor) => (
        <Box>
          <Text size="1" className="text-gray-700 block">
            {instructor.email}
          </Text>
          <Text size="1" className="text-gray-500">
            {instructor.phone}
          </Text>
        </Box>
      ),
    },
  ];

  const actions: DataTableAction<Instructor>[] = [
    {
      icon: <Eye className="w-5 h-5" />,
      label: 'View Details',
      onClick: handleViewDetails,
    },
  ];

  const handleSort = (sortBy: string, data: Instructor[]) => {
    return [...data].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'department':
          return a.department.localeCompare(b.department);
        case 'experience':
          return b.experience.years - a.experience.years;
        case 'rating':
          return b.performance.rating - a.performance.rating;
        default:
          return 0;
      }
    });
  };

  const handleFilter = (
    filters: Record<string, string>,
    data: Instructor[]
  ) => {
    return data.filter((instructor) => {
      const departmentMatch =
        !filters.department ||
        filters.department === 'all' ||
        instructor.department.toLowerCase() === filters.department;
      const statusMatch =
        !filters.status ||
        filters.status === 'all' ||
        (instructor.status || 'active').toLowerCase() === filters.status;
      return departmentMatch && statusMatch;
    });
  };

  return (
    <Box>
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} height="96px" />
          ))}
        </div>
      ) : (
        <DataTable
          data={instructors}
          columns={columns}
          actions={actions}
          title="Teacher Records"
          icon={<Users className="w-5 h-5 text-purple-600" />}
          searchPlaceholder="Search by name, ID, email, or subjects..."
          searchFields={['name', 'employeeId', 'email', 'subjects']}
          filters={[
            {
              key: 'department',
              label: 'Departments',
              options: departments,
            },
            {
              key: 'status',
              label: 'Status',
              options: [
                { value: 'active', label: 'Active' },
                { value: 'on leave', label: 'On Leave' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'retired', label: 'Retired' },
              ],
            },
          ]}
          sortOptions={[
            { value: 'name', label: 'Sort by Name' },
            { value: 'department', label: 'Sort by Department' },
            { value: 'experience', label: 'Sort by Experience' },
            { value: 'rating', label: 'Sort by Rating' },
          ]}
          headerActions={[]}
          advancedFilterGate={{
            cap: 'staff.update',
            neededPlan: 'starter' as Plan,
          }}
          exportGate={{ cap: 'staff.update', neededPlan: 'starter' as Plan }}
          onSort={handleSort}
          onFilter={handleFilter}
          getRowKey={(instructor, index) => instructor.id.toString()}
          isLoading={dataLoading}
          error={error}
          emptyStateIcon={<Users className="w-12 h-12" />}
          emptyStateTitle="No instructors found"
          emptyStateSubtitle="Add instructors to get started"
        />
      )}
    </Box>
  );
}
