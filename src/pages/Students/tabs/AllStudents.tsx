import { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { RadixButton } from 'components/ui/RadixButton';
import { RadixTextField } from 'components/ui/RadixTextField';
import { StudentCard } from '../components/StudentCard';
import { useStudentData } from '../hooks/useStudentData';
import { useStudentManagement } from '../hooks/useStudentManagement';

export function AllStudents(): JSX.Element {
  const { students, filters, updateFilter } = useStudentData();
  const {
    handleViewStudent,
    handleEditStudent,
    handleContactParent,
    handleExportStudents,
  } = useStudentManagement();

  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const studentsPerPage = 12;

  // Pagination
  const totalPages = Math.ceil(students.length / studentsPerPage);
  const startIndex = (currentPage - 1) * studentsPerPage;
  const paginatedStudents = students.slice(
    startIndex,
    startIndex + studentsPerPage
  );

  const handleSearch = (value: string) => {
    updateFilter('search', value);
    setCurrentPage(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    updateFilter(key as keyof typeof filters, value);
    setCurrentPage(1);
  };

  const handleExport = () => {
    handleExportStudents(students);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <RadixTextField
              placeholder="Search students, roll numbers, or parents..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <RadixButton
            variant="outline"
            size="2"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
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
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class
              </label>
              <select
                value={filters.class}
                onChange={(e) => handleFilterChange('class', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Classes</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Section
              </label>
              <select
                value={filters.section}
                onChange={(e) => handleFilterChange('section', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Sections</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Attendance
              </label>
              <select
                value={filters.attendanceRange}
                onChange={(e) =>
                  handleFilterChange('attendanceRange', e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Ranges</option>
                <option value="excellent">95%+ (Excellent)</option>
                <option value="good">85-94% (Good)</option>
                <option value="average">75-84% (Average)</option>
                <option value="poor">Below 75% (Poor)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grade
              </label>
              <select
                value={filters.gradeRange}
                onChange={(e) =>
                  handleFilterChange('gradeRange', e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Grades</option>
                <option value="A">A Grades</option>
                <option value="B">B Grades</option>
                <option value="C">C Grades</option>
                <option value="D">D Grades</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Showing {startIndex + 1}-
          {Math.min(startIndex + studentsPerPage, students.length)} of{' '}
          {students.length} students
        </span>
        {totalPages > 1 && (
          <span>
            Page {currentPage} of {totalPages}
          </span>
        )}
      </div>

      {/* Students Grid */}
      <div className="h-[600px] overflow-y-auto">
        {paginatedStudents.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pr-2">
            {paginatedStudents.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onViewDetails={handleViewStudent}
                onEdit={handleEditStudent}
                onContact={handleContactParent}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No students found
            </h3>
            <p className="text-center">
              Try adjusting your search criteria or filters to find students.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <RadixButton
            variant="outline"
            size="2"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </RadixButton>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <RadixButton
                  key={pageNum}
                  variant={currentPage === pageNum ? 'solid' : 'ghost'}
                  size="2"
                  onClick={() => setCurrentPage(pageNum)}
                  className="w-10 h-10"
                >
                  {pageNum}
                </RadixButton>
              );
            })}
            {totalPages > 5 && (
              <>
                <span className="px-2 text-gray-500">...</span>
                <RadixButton
                  variant={currentPage === totalPages ? 'solid' : 'ghost'}
                  size="2"
                  onClick={() => setCurrentPage(totalPages)}
                  className="w-10 h-10"
                >
                  {totalPages}
                </RadixButton>
              </>
            )}
          </div>

          <RadixButton
            variant="outline"
            size="2"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </RadixButton>
        </div>
      )}
    </div>
  );
}
