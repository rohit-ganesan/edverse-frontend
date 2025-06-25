import {
  Box,
  Grid,
  Flex,
  Heading,
  Text,
  Progress,
  Badge,
} from '@radix-ui/themes';
import { RadixCard } from 'components/ui/RadixCard';
import { RadixButton } from 'components/ui/RadixButton';
import {
  Eye,
  FileText,
  BookOpen,
  Target,
  CheckCircle,
  Calendar,
} from 'lucide-react';
import { useSyllabusData } from '../hooks/useSyllabusData';
import { SkeletonCard } from 'components/ui/Skeleton';

export function Overview({
  isLoading = false,
}: {
  isLoading?: boolean;
}): JSX.Element {
  const { syllabi } = useSyllabusData();

  return (
    <Grid columns="3" gap="8">
      {/* Active Syllabi - Enhanced with Modern Style */}
      <Box className="col-span-2">
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          {/* Header Section */}
          <Box className="p-6 bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-100">
            <Flex justify="between" align="center">
              <Box>
                <Heading size="5" className="text-gray-900 mb-1">
                  Active Syllabi
                </Heading>
                <Text size="3" className="text-gray-600">
                  {isLoading ? (
                    <span className="inline-block w-24 h-4 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    `${syllabi?.length || 0} syllabi available`
                  )}
                </Text>
              </Box>
              <RadixButton
                variant="soft"
                size="2"
                className="bg-white/70 hover:bg-white"
              >
                <Eye className="w-4 h-4 mr-1" />
                View All
              </RadixButton>
            </Flex>
          </Box>

          {/* Syllabi List */}
          <Box className="p-6">
            <Flex direction="column" gap="6">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonCard key={i} height={72} className="mb-2" />
                ))
              ) : syllabi && syllabi.length > 0 ? (
                syllabi.slice(0, 3).map((syllabus, index) => (
                  <Box
                    key={syllabus.id}
                    className="p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:shadow-md transition-all animate-in slide-in-from-bottom-1 duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Flex justify="between" align="start" className="mb-2">
                      <Box className="flex-1">
                        <div className="text-lg font-bold text-gray-900 mb-2">
                          {syllabus.subject} Syllabus
                        </div>
                        <div className="text-sm text-gray-600 mb-1">
                          Grade {syllabus.grade}
                        </div>
                      </Box>
                      <Badge
                        color={syllabus.isActive ? 'green' : 'gray'}
                        variant="soft"
                        className="ml-4"
                      >
                        {syllabus.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </Flex>

                    <Flex align="center" gap="6" className="text-gray-600 mb-4">
                      <Flex align="center" gap="2">
                        <BookOpen className="w-4 h-4" />
                        <Text size="2">{syllabus.topics} topics</Text>
                      </Flex>
                      <Flex align="center" gap="2">
                        <Target className="w-4 h-4" />
                        <Text size="2">{syllabus.objectives} objectives</Text>
                      </Flex>
                      <Flex align="center" gap="2">
                        <Calendar className="w-4 h-4" />
                        <Text size="2">
                          Updated{' '}
                          {new Date(syllabus.lastUpdated).toLocaleDateString()}
                        </Text>
                      </Flex>
                    </Flex>

                    <Box>
                      <Flex justify="between" align="center" className="mb-1">
                        <Text size="2" className="text-gray-700 font-medium">
                          Completion Progress
                        </Text>
                        <Text size="2" className="text-gray-600 font-semibold">
                          {syllabus.completionRate}%
                        </Text>
                      </Flex>
                      <Progress
                        value={syllabus.completionRate}
                        className="h-2"
                      />
                    </Box>
                  </Box>
                ))
              ) : (
                <Box className="text-center py-12">
                  <Box className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </Box>
                  <Text size="3" weight="medium" className="text-gray-900 mb-2">
                    No syllabi available
                  </Text>
                  <Text size="2" className="text-gray-500 mb-4">
                    Create your first syllabus to get started
                  </Text>
                  <RadixButton
                    variant="solid"
                    size="3"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Create Syllabus
                  </RadixButton>
                </Box>
              )}
            </Flex>
          </Box>
        </RadixCard>
      </Box>

      {/* Curriculum Progress - Enhanced with Modern Style */}
      <Box>
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden h-fit">
          {/* Header */}
          <Box className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
            <Flex justify="between" align="center">
              <Box>
                <Heading size="4" className="text-gray-900 mb-2">
                  Curriculum Progress
                </Heading>
                <Text size="2" className="text-gray-600">
                  Overall completion
                </Text>
              </Box>
            </Flex>
          </Box>

          {/* Progress List */}
          <Box className="p-6">
            <Flex direction="column" gap="5">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonCard key={i} height={56} className="mb-2" />
                ))
              ) : (
                <>
                  <Box className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <Flex align="start" gap="4">
                      <Box className="p-3 bg-blue-100 rounded-lg">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                      </Box>
                      <Box className="flex-1">
                        <Text
                          size="2"
                          weight="medium"
                          className="text-gray-900 block mb-1"
                        >
                          Total Topics
                        </Text>
                        <Text
                          size="4"
                          weight="bold"
                          className="text-blue-600 block"
                        >
                          {syllabi?.reduce((sum, s) => sum + s.topics, 0) || 0}
                        </Text>
                      </Box>
                    </Flex>
                  </Box>
                  <Box className="p-4 bg-green-50 rounded-lg border border-green-100">
                    <Flex align="start" gap="4">
                      <Box className="p-3 bg-green-100 rounded-lg">
                        <Target className="w-5 h-5 text-green-600" />
                      </Box>
                      <Box className="flex-1">
                        <Text
                          size="2"
                          weight="medium"
                          className="text-gray-900 block mb-1"
                        >
                          Learning Objectives
                        </Text>
                        <Text
                          size="4"
                          weight="bold"
                          className="text-green-600 block"
                        >
                          {syllabi?.reduce((sum, s) => sum + s.objectives, 0) ||
                            0}
                        </Text>
                      </Box>
                    </Flex>
                  </Box>
                  <Box className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                    <Flex align="start" gap="4">
                      <Box className="p-3 bg-orange-100 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-orange-600" />
                      </Box>
                      <Box className="flex-1">
                        <Box className="mb-3">
                          <Text
                            size="2"
                            weight="medium"
                            className="text-gray-900 block mb-1"
                          >
                            Avg Completion
                          </Text>
                          <Text
                            size="4"
                            weight="bold"
                            className="text-orange-600 block"
                          >
                            {syllabi
                              ? Math.round(
                                  syllabi.reduce(
                                    (sum, s) => sum + s.completionRate,
                                    0
                                  ) / syllabi.length
                                )
                              : 0}
                            %
                          </Text>
                        </Box>
                        <Box>
                          <Progress
                            value={
                              syllabi
                                ? Math.round(
                                    syllabi.reduce(
                                      (sum, s) => sum + s.completionRate,
                                      0
                                    ) / syllabi.length
                                  )
                                : 0
                            }
                            className="h-2"
                          />
                        </Box>
                      </Box>
                    </Flex>
                  </Box>
                </>
              )}
            </Flex>

            <Box className="mt-6 pt-5 border-t border-gray-100">
              <RadixButton variant="ghost" size="2" className="w-full">
                <Eye className="w-4 h-4 mr-2" />
                View Progress Details
              </RadixButton>
            </Box>
          </Box>
        </RadixCard>
      </Box>
    </Grid>
  );
}
