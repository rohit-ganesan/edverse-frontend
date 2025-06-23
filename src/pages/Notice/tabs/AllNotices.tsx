import { useState } from 'react';
import { Box, Flex, Text, Heading, Grid, Select } from '@radix-ui/themes';
import { RadixCard } from 'components/ui/RadixCard';
import { RadixTextField } from 'components/ui/RadixTextField';
import { RadixButton } from 'components/ui/RadixButton';
import {
  Search,
  Filter,
  SortAsc,
  Pin,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { NoticeCard } from '../components/NoticeCard';
import { ImprovedNoticeCard } from '../components/ImprovedNoticeCard';
import { useNoticeData } from '../hooks/useNoticeData';
import { useNoticeManagement } from '../hooks/useNoticeManagement';

const NOTICES_PER_PAGE = 10;

export function AllNotices(): JSX.Element {
  const [currentPage, setCurrentPage] = useState(1);

  const { notices, pinnedNotices, filters, updateFilter, resetFilters } =
    useNoticeData();

  const { handleCreateNotice, handleViewNotice } = useNoticeManagement();

  // Pagination logic
  const totalPages = Math.ceil(notices.length / NOTICES_PER_PAGE);
  const startIndex = (currentPage - 1) * NOTICES_PER_PAGE;
  const endIndex = startIndex + NOTICES_PER_PAGE;
  const currentNotices = notices.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleNoticeViewDetails = (noticeId: string) => {
    // This will later navigate to the notice detail page
    handleViewNotice(noticeId);
  };

  return (
    <Box className="space-y-6">
      {/* Modern Header Card */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <Flex align="center" gap="3">
            <Box className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Search className="w-5 h-5 text-blue-600" />
            </Box>
            <Box>
              <Heading size="4" className="text-gray-900 mb-1">
                All Notices
              </Heading>
              <Text size="2" className="text-gray-600">
                Browse and manage all notice announcements
              </Text>
            </Box>
          </Flex>
        </Box>

        {/* Search and Filters */}
        <Box className="p-6">
          <Flex direction="column" gap="4">
            {/* Search Bar and Filters Row */}
            <Flex gap="4" align="center" wrap="wrap">
              <Box className="relative flex-1 min-w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <RadixTextField
                  placeholder="Search notices by title, content, or author..."
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  className="pl-10 w-full"
                  size="3"
                />
              </Box>
              <Select.Root
                value={filters.category}
                onValueChange={(value) => updateFilter('category', value)}
                size="2"
              >
                <Select.Trigger className="min-w-[140px]" />
                <Select.Content>
                  <Select.Item value="all">All Categories</Select.Item>
                  <Select.Item value="academic">Academic</Select.Item>
                  <Select.Item value="administrative">
                    Administrative
                  </Select.Item>
                  <Select.Item value="event">Event</Select.Item>
                  <Select.Item value="emergency">Emergency</Select.Item>
                  <Select.Item value="general">General</Select.Item>
                </Select.Content>
              </Select.Root>

              <Select.Root
                value={filters.priority}
                onValueChange={(value) => updateFilter('priority', value)}
                size="2"
              >
                <Select.Trigger className="min-w-[120px]" />
                <Select.Content>
                  <Select.Item value="all">All Priorities</Select.Item>
                  <Select.Item value="urgent">Urgent</Select.Item>
                  <Select.Item value="high">High</Select.Item>
                  <Select.Item value="medium">Medium</Select.Item>
                  <Select.Item value="low">Low</Select.Item>
                </Select.Content>
              </Select.Root>

              <Select.Root
                value={filters.status}
                onValueChange={(value) => updateFilter('status', value)}
                size="2"
              >
                <Select.Trigger className="min-w-[120px]" />
                <Select.Content>
                  <Select.Item value="all">All Status</Select.Item>
                  <Select.Item value="published">Published</Select.Item>
                  <Select.Item value="draft">Draft</Select.Item>
                  <Select.Item value="archived">Archived</Select.Item>
                </Select.Content>
              </Select.Root>

              <Select.Root
                value={filters.targetAudience}
                onValueChange={(value) => updateFilter('targetAudience', value)}
                size="2"
              >
                <Select.Trigger className="min-w-[140px]" />
                <Select.Content>
                  <Select.Item value="all">All Audiences</Select.Item>
                  <Select.Item value="students">Students</Select.Item>
                  <Select.Item value="instructors">Instructors</Select.Item>
                  <Select.Item value="administrators">
                    Administrators
                  </Select.Item>
                </Select.Content>
              </Select.Root>

              <RadixButton variant="outline" size="2" onClick={resetFilters}>
                <Filter className="w-4 h-4 mr-2" />
                Reset
              </RadixButton>
            </Flex>

            {/* Results Summary */}
            <Flex justify="between" align="center">
              <Text size="2" className="text-gray-600">
                Showing {startIndex + 1}-{Math.min(endIndex, notices.length)} of{' '}
                {notices.length} notice{notices.length !== 1 ? 's' : ''}
              </Text>
              <RadixButton
                variant="solid"
                size="2"
                onClick={handleCreateNotice}
              >
                Create Notice
              </RadixButton>
            </Flex>
          </Flex>
        </Box>
      </RadixCard>

      {/* Pinned Notices */}
      {pinnedNotices.length > 0 && (
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-yellow-50 to-amber-50 border-b border-yellow-100">
            <Flex align="center" gap="3">
              <Box className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Pin className="w-5 h-5 text-yellow-600" />
              </Box>
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  📌 Pinned Notices
                </Heading>
                <Text size="2" className="text-gray-600">
                  Important announcements pinned for visibility
                </Text>
              </Box>
            </Flex>
          </Box>

          <Box className="p-6">
            <Grid columns="2" gap="4">
              {pinnedNotices.map((notice, index) => (
                <NoticeCard
                  key={notice.id}
                  notice={notice}
                  compact
                  className={`transform transition-all duration-300 hover:scale-[1.02] ${
                    index % 2 === 0
                      ? 'animate-slide-in-left'
                      : 'animate-slide-in-right'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` } as any}
                />
              ))}
            </Grid>
          </Box>
        </RadixCard>
      )}

      {/* All Notices List with Scrollable Container */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-100">
          <Flex justify="between" align="center">
            <Box>
              <Heading size="4" className="text-gray-900 mb-1">
                All Notices
              </Heading>
              <Text size="2" className="text-gray-600">
                Complete list of all notice announcements
              </Text>
            </Box>
            <RadixButton variant="outline" size="2">
              <SortAsc className="w-4 h-4 mr-2" />
              Sort by Date
            </RadixButton>
          </Flex>
        </Box>

        {/* Scrollable Content Container */}
        <Box className="h-[600px] overflow-hidden flex flex-col">
          {currentNotices.length > 0 ? (
            <>
              {/* Scrollable Notice List */}
              <Box className="flex-1 overflow-y-auto p-6 space-y-3">
                {currentNotices.map((notice, index) => (
                  <ImprovedNoticeCard
                    key={notice.id}
                    notice={notice}
                    onViewDetails={() => handleNoticeViewDetails(notice.id)}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` } as any}
                  />
                ))}
              </Box>

              {/* Pagination Footer */}
              {totalPages > 1 && (
                <Box className="border-t border-gray-100 p-4 bg-gray-50">
                  <Flex justify="between" align="center">
                    <Text size="2" className="text-gray-600">
                      Page {currentPage} of {totalPages}
                    </Text>

                    <Flex align="center" gap="2">
                      <RadixButton
                        variant="outline"
                        size="2"
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </RadixButton>

                      {/* Page Numbers */}
                      <Flex align="center" gap="1">
                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
                            const pageNum = Math.max(
                              1,
                              Math.min(currentPage - 2 + i, totalPages - 4 + i)
                            );
                            return (
                              <RadixButton
                                key={pageNum}
                                variant={
                                  currentPage === pageNum ? 'solid' : 'ghost'
                                }
                                size="1"
                                onClick={() => goToPage(pageNum)}
                                className="min-w-[32px]"
                              >
                                {pageNum}
                              </RadixButton>
                            );
                          }
                        )}
                      </Flex>

                      <RadixButton
                        variant="outline"
                        size="2"
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </RadixButton>
                    </Flex>
                  </Flex>
                </Box>
              )}
            </>
          ) : (
            <Box className="flex-1 flex items-center justify-center">
              <Box className="text-center py-12">
                <Box className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </Box>
                <Box className="space-y-2">
                  <Text
                    size="3"
                    weight="medium"
                    className="text-gray-900 block"
                  >
                    No notices found
                  </Text>
                  <Text size="2" className="text-gray-500 block">
                    Try adjusting your search criteria or create a new notice
                  </Text>
                </Box>
                <RadixButton
                  variant="outline"
                  size="3"
                  className="mt-4"
                  onClick={handleCreateNotice}
                >
                  Create First Notice
                </RadixButton>
              </Box>
            </Box>
          )}
        </Box>
      </RadixCard>
    </Box>
  );
}
