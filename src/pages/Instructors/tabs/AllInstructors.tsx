import { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Download,
  Plus,
} from 'lucide-react';
import { RadixTextField } from 'components/ui/RadixTextField';
import { RadixButton } from 'components/ui/RadixButton';
import { InstructorCard } from '../components/InstructorCard';
import { useInstructorData } from '../hooks/useInstructorData';
import { useInstructorManagement } from '../hooks/useInstructorManagement';

export function AllInstructors(): JSX.Element {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [experienceRange, setExperienceRange] = useState({ min: 0, max: 50 });
  const [performanceRange, setPerformanceRange] = useState({ min: 0, max: 5 });
  const [showFilters, setShowFilters] = useState(false);

  const { instructors, isLoading, error } = useInstructorData();
  const {
    handleViewInstructor: handleViewDetails,
    handleEditInstructor: handleEdit,
    handleContactInstructor: handleContact,
    handleScheduleReview,
    handleExportInstructors: handleExport,
  } = useInstructorManagement();

  const itemsPerPage = 10;

  // Get unique departments for filter
  const departments = useMemo(() => {
    const deptSet = new Set(
      instructors.map((instructor) => instructor.department)
    );
    const depts = Array.from(deptSet);
    return depts.sort();
  }, [instructors]);

  // Filter instructors
  const filteredInstructors = useMemo(() => {
    return instructors.filter((instructor) => {
      const matchesSearch =
        instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instructor.employeeId
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        instructor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instructor.subjects.some((subject) =>
          subject.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesDepartment =
        selectedDepartment === 'all' ||
        instructor.department === selectedDepartment;
      const matchesStatus =
        selectedStatus === 'all' || instructor.status === selectedStatus;
      const matchesExperience =
        instructor.experience.years >= experienceRange.min &&
        instructor.experience.years <= experienceRange.max;
      const matchesPerformance =
        instructor.performance.rating >= performanceRange.min &&
        instructor.performance.rating <= performanceRange.max;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesStatus &&
        matchesExperience &&
        matchesPerformance
      );
    });
  }, [
    instructors,
    searchTerm,
    selectedDepartment,
    selectedStatus,
    experienceRange,
    performanceRange,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredInstructors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInstructors = filteredInstructors.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedDepartment('all');
    setSelectedStatus('all');
    setExperienceRange({ min: 0, max: 50 });
    setPerformanceRange({ min: 0, max: 5 });
    setCurrentPage(1);
  };

  const handleAddInstructor = () => {
    // Navigate to add instructor page
    console.log('Navigate to add instructor');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading instructors...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error loading instructors: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            All Instructors
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {filteredInstructors.length} of {instructors.length} instructors
          </p>
        </div>
        <div className="flex items-center gap-3">
          <RadixButton
            variant="outline"
            size="2"
            onClick={() => handleExport(filteredInstructors)}
          >
            <Download className="w-4 h-4" />
            Export
          </RadixButton>
          <RadixButton variant="solid" size="2" onClick={handleAddInstructor}>
            <Plus className="w-4 h-4" />
            Add Instructor
          </RadixButton>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <RadixTextField
                placeholder="Search by name, ID, email, or subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <RadixButton
            variant="outline"
            size="2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4" />
            Filters
          </RadixButton>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience (Years)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={experienceRange.min}
                  onChange={(e) =>
                    setExperienceRange((prev) => ({
                      ...prev,
                      min: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={experienceRange.max}
                  onChange={(e) =>
                    setExperienceRange((prev) => ({
                      ...prev,
                      max: parseInt(e.target.value) || 50,
                    }))
                  }
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Performance Rating
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={performanceRange.min}
                  onChange={(e) =>
                    setPerformanceRange((prev) => ({
                      ...prev,
                      min: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={performanceRange.max}
                  onChange={(e) =>
                    setPerformanceRange((prev) => ({
                      ...prev,
                      max: parseFloat(e.target.value) || 5,
                    }))
                  }
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>

            <div className="md:col-span-2 lg:col-span-4 flex justify-end">
              <RadixButton
                variant="ghost"
                size="1"
                onClick={handleClearFilters}
              >
                Clear Filters
              </RadixButton>
            </div>
          </div>
        )}
      </div>

      {/* Instructors List */}
      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {paginatedInstructors.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-2">No instructors found</div>
            <p className="text-sm text-gray-400">
              Try adjusting your search terms or filters
            </p>
          </div>
        ) : (
          paginatedInstructors.map((instructor) => (
            <InstructorCard
              key={instructor.id}
              instructor={instructor}
              onViewDetails={handleViewDetails}
              onEdit={handleEdit}
              onContact={handleContact}
              onScheduleReview={handleScheduleReview}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-lg">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to{' '}
            {Math.min(startIndex + itemsPerPage, filteredInstructors.length)} of{' '}
            {filteredInstructors.length} results
          </div>
          <div className="flex items-center gap-2">
            <RadixButton
              variant="outline"
              size="1"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </RadixButton>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                if (page > totalPages) return null;

                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      page === currentPage
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <RadixButton
              variant="outline"
              size="1"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </RadixButton>
          </div>
        </div>
      )}
    </div>
  );
}
