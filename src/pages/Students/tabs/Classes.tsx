import { ClassSectionCard } from '../components/ClassSectionCard';
import { useStudentData } from '../hooks/useStudentData';
import { useStudentManagement } from '../hooks/useStudentManagement';

export function Classes(): JSX.Element {
  const { classSections } = useStudentData();
  const { handleMarkAttendance } = useStudentManagement();

  const handleViewStudents = (classId: string, section: string) => {
    console.log('View students for class:', classId, 'section:', section);
    // Navigate to filtered student view
  };

  const handleManageClass = (classId: string) => {
    console.log('Manage class:', classId);
    // Navigate to class management page
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Class Sections
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage classes and their students
          </p>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classSections.map((classSection) => (
          <ClassSectionCard
            key={classSection.id}
            classSection={classSection}
            onViewStudents={handleViewStudents}
            onMarkAttendance={handleMarkAttendance}
            onManageClass={handleManageClass}
          />
        ))}
      </div>

      {classSections.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No classes found
          </h3>
          <p className="text-center">
            Classes will appear here once they are created.
          </p>
        </div>
      )}
    </div>
  );
}
