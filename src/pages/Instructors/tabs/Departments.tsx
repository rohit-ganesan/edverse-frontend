import { useState, useMemo } from 'react';
import { Search, Plus, TrendingUp, Users, BookOpen, Award } from 'lucide-react';
import { RadixTextField } from 'components/ui/RadixTextField';
import { RadixButton } from 'components/ui/RadixButton';
import { ModernStatsGrid } from 'components/ui/ModernStatsGrid';
import { DepartmentCard } from '../components/DepartmentCard';
import { useInstructorData } from '../hooks/useInstructorData';
import type { Department } from '../types';

export function Departments(): JSX.Element {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );

  const { instructors, isLoading, error } = useInstructorData();

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

  // Filter departments
  const filteredDepartments = useMemo(() => {
    if (!searchTerm) return departments;

    return departments.filter(
      (dept) =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.head.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.subjects.some((subject) =>
          subject.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [departments, searchTerm]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalInstructors = instructors.length;
    const totalDepartments = departments.length;
    const avgPerformance =
      departments.reduce((sum, dept) => sum + dept.avgPerformance, 0) /
        departments.length || 0;
    const totalStudents = departments.reduce(
      (sum, dept) => sum + dept.totalStudents,
      0
    );

    return [
      {
        icon: <Users />,
        label: 'Total Departments',
        value: totalDepartments.toString(),
        iconColor: 'blue' as const,
      },
      {
        icon: <BookOpen />,
        label: 'Total Instructors',
        value: totalInstructors.toString(),
        iconColor: 'green' as const,
      },
      {
        icon: <Award />,
        label: 'Avg Performance',
        value: `${avgPerformance.toFixed(1)}/5.0`,
        iconColor: 'purple' as const,
      },
      {
        icon: <TrendingUp />,
        label: 'Total Students',
        value: totalStudents.toLocaleString(),
        iconColor: 'orange' as const,
      },
    ];
  }, [departments, instructors]);

  const handleDepartmentClick = (deptId: string) => {
    setSelectedDepartment(deptId === selectedDepartment ? null : deptId);
  };

  const handleAddDepartment = () => {
    console.log('Add new department');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading departments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error loading departments: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Departments</h2>
          <p className="text-sm text-gray-600 mt-1">
            {filteredDepartments.length} departments with {instructors.length}{' '}
            instructors
          </p>
        </div>
        <RadixButton variant="solid" size="2" onClick={handleAddDepartment}>
          <Plus className="w-4 h-4" />
          Add Department
        </RadixButton>
      </div>

      {/* Statistics */}
      {/* <ModernStatsGrid stats={stats} /> */}

      {/* Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <RadixTextField
            placeholder="Search departments by name, code, head, or subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDepartments.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-500 mb-2">No departments found</div>
            <p className="text-sm text-gray-400">
              Try adjusting your search terms
            </p>
          </div>
        ) : (
          filteredDepartments.map((department) => (
            <DepartmentCard
              key={department.id}
              department={department}
              onClick={handleDepartmentClick}
            />
          ))
        )}
      </div>

      {/* Selected Department Details */}
      {selectedDepartment && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Department Details
          </h3>
          {(() => {
            const dept = departments.find((d) => d.id === selectedDepartment);
            if (!dept) return null;

            const deptInstructors = instructors.filter(
              (i) => i.department === dept.name
            );

            return (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Basic Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Department:</span>
                        <span className="font-medium">{dept.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Code:</span>
                        <span className="font-medium">{dept.code}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Head:</span>
                        <span className="font-medium">{dept.head}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Instructors:</span>
                        <span className="font-medium">
                          {dept.instructorCount}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Performance Metrics
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Avg Performance:</span>
                        <span className="font-medium">
                          {dept.avgPerformance.toFixed(1)}/5.0
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Active Courses:</span>
                        <span className="font-medium">
                          {dept.activeCourses}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Students:</span>
                        <span className="font-medium">
                          {dept.totalStudents}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Instructors
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {deptInstructors.map((instructor) => (
                      <div
                        key={instructor.id}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <span className="text-sm font-medium">
                          {instructor.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {instructor.designation}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Subjects</h4>
                  <div className="flex flex-wrap gap-2">
                    {dept.subjects.map((subject, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
