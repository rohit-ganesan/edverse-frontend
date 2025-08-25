import { Box, Flex, Text, Heading, Grid } from '@radix-ui/themes';
import { RadixCard } from 'components/ui/RadixCard';
import { RadixButton } from 'components/ui/RadixButton';
import { FileText, Plus, Edit, Trash2, Send, Save } from 'lucide-react';
import { NoticeCard } from '../components/NoticeCard';
import { useNoticeData } from '../hooks/useNoticeData';
import { useNoticeManagement } from '../hooks/useNoticeManagement';
import { SkeletonCard } from 'components/ui/Skeleton';

export function Drafts({
  isLoading = false,
}: {
  isLoading?: boolean;
}): JSX.Element {
  const { draftNotices } = useNoticeData();
  const {
    handleCreateNotice,
    handleEditNotice,
    handleDeleteNotice,
    handlePublishNotice,
  } = useNoticeManagement();

  return (
    <Box className="space-y-6">
      {/* Quick Actions */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-100">
          <Flex align="center" gap="3">
            <Box className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Edit className="w-5 h-5 text-purple-600" />
            </Box>
            <Box>
              <Heading size="4" className="text-gray-900 mb-1">
                Draft Management
              </Heading>
              <Text size="2" className="text-gray-600">
                Quick actions for managing your drafts
              </Text>
            </Box>
          </Flex>
        </Box>

        <Box className="p-6">
          <Grid columns="4" gap="4">
            <RadixButton
              variant="outline"
              size="3"
              className="h-20 flex-col gap-2"
              onClick={handleCreateNotice}
            >
              <Plus className="w-6 h-6" />
              <Text size="2">New Draft</Text>
            </RadixButton>

            <RadixButton
              variant="outline"
              size="3"
              className="h-20 flex-col gap-2"
              disabled={draftNotices.length === 0}
            >
              <Send className="w-6 h-6" />
              <Text size="2">Publish All</Text>
            </RadixButton>

            <RadixButton
              variant="outline"
              size="3"
              className="h-20 flex-col gap-2"
              disabled={draftNotices.length === 0}
            >
              <Save className="w-6 h-6" />
              <Text size="2">Save All</Text>
            </RadixButton>

            <RadixButton
              variant="outline"
              size="3"
              className="h-20 flex-col gap-2"
              disabled={draftNotices.length === 0}
            >
              <Trash2 className="w-6 h-6" />
              <Text size="2">Clear Drafts</Text>
            </RadixButton>
          </Grid>
        </Box>
      </RadixCard>

      {/* Drafts Header */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-100">
          <Flex justify="between" align="center">
            <Flex align="center" gap="3">
              <Box className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-amber-600" />
              </Box>
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Draft Notices
                </Heading>
                <Text size="2" className="text-gray-600">
                  Manage your unpublished notice drafts
                </Text>
              </Box>
            </Flex>
            <RadixButton variant="solid" size="2" onClick={handleCreateNotice}>
              <Plus className="w-4 h-4 mr-2" />
              New Draft
            </RadixButton>
          </Flex>
        </Box>

        {/* Draft Stats */}
        <Box className="p-6">
          <Grid columns="3" gap="4">
            <Box className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
              <Box className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <FileText className="w-6 h-6 text-blue-600" />
              </Box>
              <Text size="3" weight="bold" className="text-gray-900 block">
                {draftNotices.length}
              </Text>
              <Text size="1" className="text-gray-600">
                Total Drafts
              </Text>
            </Box>

            <Box className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
              <Box className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Edit className="w-6 h-6 text-green-600" />
              </Box>
              <Text size="3" weight="bold" className="text-gray-900 block">
                {draftNotices.filter((d) => d.content.length > 100).length}
              </Text>
              <Text size="1" className="text-gray-600">
                Ready to Publish
              </Text>
            </Box>

            <Box className="text-center p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg">
              <Box className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Save className="w-6 h-6 text-orange-600" />
              </Box>
              <Text size="3" weight="bold" className="text-gray-900 block">
                {draftNotices.filter((d) => d.content.length <= 100).length}
              </Text>
              <Text size="1" className="text-gray-600">
                In Progress
              </Text>
            </Box>
          </Grid>
        </Box>
      </RadixCard>

      {/* Draft Notices List */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-100">
          <Flex justify="between" align="center">
            <Box>
              <Heading size="4" className="text-gray-900 mb-1">
                Your Drafts
              </Heading>
              <Text size="2" className="text-gray-600">
                Unpublished notices ready for editing
              </Text>
            </Box>
            <Flex gap="2">
              <RadixButton variant="outline" size="2">
                <Save className="w-4 h-4 mr-2" />
                Auto-save: On
              </RadixButton>
            </Flex>
          </Flex>
        </Box>

        <Box className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <SkeletonCard key={i} height="80px" />
              ))}
            </div>
          ) : draftNotices.length > 0 ? (
            <Grid columns="1" gap="4">
              {draftNotices.map((notice, index) => (
                <RadixCard
                  key={notice.id}
                  className={`p-6 border-l-4 border-amber-400 bg-amber-50/30 hover:shadow-lg transition-all duration-300 animate-fade-in`}
                  style={{ animationDelay: `${index * 100}ms` } as any}
                >
                  <Flex justify="between" align="start">
                    <Flex gap="4" align="start" className="flex-1">
                      <Box className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-amber-600" />
                      </Box>

                      <Box className="flex-1 min-w-0">
                        <Flex align="center" gap="3" className="mb-2">
                          <Heading size="4" className="text-gray-900">
                            {notice.title || 'Untitled Draft'}
                          </Heading>
                          <Text
                            size="1"
                            className="text-amber-600 bg-amber-100 px-2 py-1 rounded"
                          >
                            DRAFT
                          </Text>
                          {notice.content.length > 100 && (
                            <Text
                              size="1"
                              className="text-green-600 bg-green-100 px-2 py-1 rounded"
                            >
                              READY
                            </Text>
                          )}
                        </Flex>

                        <Text
                          size="2"
                          className="text-gray-600 mb-3 line-clamp-2"
                        >
                          {notice.content || 'No content yet...'}
                        </Text>

                        <Flex align="center" gap="4" className="mb-3">
                          <Text size="2" className="text-gray-600">
                            Category: {notice.category}
                          </Text>
                          <Text size="2" className="text-gray-600">
                            Priority: {notice.priority}
                          </Text>
                          <Text size="2" className="text-gray-600">
                            Audience: {notice.targetAudience}
                          </Text>
                        </Flex>

                        <Text size="1" className="text-gray-500">
                          Last modified:{' '}
                          {new Date(notice.publishDate).toLocaleDateString()}
                        </Text>
                      </Box>
                    </Flex>

                    {/* Actions */}
                    <Flex gap="2" className="flex-shrink-0">
                      <RadixButton
                        variant="outline"
                        size="2"
                        onClick={() => handleEditNotice(notice.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </RadixButton>
                      <RadixButton
                        variant="solid"
                        size="2"
                        onClick={() => handlePublishNotice(notice.id)}
                        disabled={notice.content.length < 10}
                      >
                        <Send className="w-4 h-4" />
                      </RadixButton>
                      <RadixButton
                        variant="ghost"
                        size="2"
                        onClick={() => handleDeleteNotice(notice.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </RadixButton>
                    </Flex>
                  </Flex>
                </RadixCard>
              ))}
            </Grid>
          ) : (
            <Box className="text-center py-12">
              <Box className="w-16 h-16 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-amber-600" />
              </Box>
              <Box className="space-y-2">
                <Text size="3" weight="medium" className="text-gray-900 block">
                  No draft notices
                </Text>
                <Text size="2" className="text-gray-500 block">
                  Create your first draft to get started with notice management
                </Text>
              </Box>
              <RadixButton
                variant="solid"
                size="3"
                className="mt-4"
                onClick={handleCreateNotice}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Draft
              </RadixButton>
            </Box>
          )}
        </Box>
      </RadixCard>
    </Box>
  );
}
