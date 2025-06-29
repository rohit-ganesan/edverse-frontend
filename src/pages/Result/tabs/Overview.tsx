import { Box, Grid, Flex, Heading, Text } from '@radix-ui/themes';
import { RadixCard } from 'components/ui/RadixCard';
import { RadixButton } from 'components/ui/RadixButton';
import { Eye, Trophy, Award, GraduationCap } from 'lucide-react';
import { useResultData } from '../hooks/useResultData';
import { useResultManagement } from '../hooks/useResultManagement';
import { SkeletonCard } from 'components/ui/Skeleton';

export function Overview({
  isLoading = false,
}: {
  isLoading?: boolean;
}): JSX.Element {
  const { results, analytics } = useResultData();
  const { getGradeColor } = useResultManagement();

  return (
    <Grid columns="3" gap="8">
      {/* Recent Results - Enhanced with Modern Style */}
      <Box className="col-span-2">
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          {/* Header Section */}
          <Box className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <Flex justify="between" align="center">
              <Box>
                <Heading size="5" className="text-gray-900 mb-1">
                  Recent Results
                </Heading>
                <Text size="3" className="text-gray-600">
                  {isLoading ? (
                    <span className="inline-block w-24 h-4 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    `${results?.length || 0} results published`
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

          {/* Results List */}
          <Box className="p-6">
            <Flex direction="column" gap="4">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonCard key={i} height="56px" className="mb-2" />
                ))
              ) : results && results.length > 0 ? (
                results.slice(0, 5).map((result, index) => (
                  <Box
                    key={result.id}
                    className={`p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200 animate-in slide-in-from-bottom-1 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Flex justify="between" align="center">
                      <Flex align="center" gap="3">
                        <Box
                          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            result.grade === 'A+' || result.grade === 'A'
                              ? 'bg-green-100 ring-2 ring-green-200'
                              : result.grade === 'A-' || result.grade === 'B+'
                                ? 'bg-blue-100 ring-2 ring-blue-200'
                                : result.grade === 'B' || result.grade === 'B-'
                                  ? 'bg-orange-100 ring-2 ring-orange-200'
                                  : 'bg-red-100 ring-2 ring-red-200'
                          }`}
                        >
                          <GraduationCap
                            className={`w-5 h-5 ${
                              result.grade === 'A+' || result.grade === 'A'
                                ? 'text-green-600'
                                : result.grade === 'A-' || result.grade === 'B+'
                                  ? 'text-blue-600'
                                  : result.grade === 'B' ||
                                      result.grade === 'B-'
                                    ? 'text-orange-600'
                                    : 'text-red-600'
                            }`}
                          />
                        </Box>
                        <Box>
                          <Text
                            size="3"
                            weight="medium"
                            className="text-gray-900 block"
                          >
                            {result.studentName}
                          </Text>
                          <Text size="2" className="text-gray-600">
                            {result.course} • {result.semester} {result.year}
                          </Text>
                        </Box>
                      </Flex>
                      <Flex align="center" gap="3">
                        <Box className="text-right">
                          <Text
                            size="2"
                            weight="medium"
                            className="text-gray-900 block"
                          >
                            {result.percentage.toFixed(1)}%
                          </Text>
                          <Text size="1" className="text-gray-500">
                            GPA: {result.gpa}
                          </Text>
                        </Box>
                        <Box
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            getGradeColor(result.grade) === 'green'
                              ? 'bg-green-100 text-green-700'
                              : getGradeColor(result.grade) === 'blue'
                                ? 'bg-blue-100 text-blue-700'
                                : getGradeColor(result.grade) === 'orange'
                                  ? 'bg-orange-100 text-orange-700'
                                  : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {result.grade}
                        </Box>
                      </Flex>
                    </Flex>
                  </Box>
                ))
              ) : (
                <Box className="text-center py-12">
                  <Box className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="w-8 h-8 text-gray-400" />
                  </Box>
                  <Text size="3" weight="medium" className="text-gray-900 mb-2">
                    No results published yet
                  </Text>
                  <Text size="2" className="text-gray-500 mb-4">
                    Start by adding student results to see them here
                  </Text>
                  <RadixButton
                    variant="solid"
                    size="3"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Award className="w-4 h-4 mr-2" />
                    Add Results
                  </RadixButton>
                </Box>
              )}
            </Flex>
          </Box>
        </RadixCard>
      </Box>

      {/* Top Performers - Enhanced with Modern Style */}
      <Box>
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden h-fit">
          {/* Header */}
          <Box className="p-5 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
            <Flex justify="between" align="center">
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Top Performers
                </Heading>
                <Text size="2" className="text-gray-600">
                  Highest achievers
                </Text>
              </Box>
            </Flex>
          </Box>

          {/* Top Performers List */}
          <Box className="p-5">
            <Flex direction="column" gap="3">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonCard key={i} height="40px" className="mb-2" />
                ))
              ) : analytics.topPerformers &&
                analytics.topPerformers.length > 0 ? (
                analytics.topPerformers.map((student, index) => (
                  <Box
                    key={student.id}
                    className={`p-3 rounded-lg hover:bg-gray-50 transition-colors animate-in slide-in-from-right-1 duration-300`}
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <Flex align="center" gap="3">
                      <Box className="flex-shrink-0">
                        <Box className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                          <Text size="2" weight="bold" className="text-white">
                            {index + 1}
                          </Text>
                        </Box>
                      </Box>
                      <Box className="flex-1">
                        <Text
                          size="2"
                          weight="medium"
                          className="text-gray-900 block"
                        >
                          {student.studentName}
                        </Text>
                        <Text size="1" className="text-gray-600">
                          GPA: {student.gpa} • {student.percentage.toFixed(1)}%
                        </Text>
                      </Box>
                      <Box
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          getGradeColor(student.grade) === 'green'
                            ? 'bg-green-100 text-green-700'
                            : getGradeColor(student.grade) === 'blue'
                              ? 'bg-blue-100 text-blue-700'
                              : getGradeColor(student.grade) === 'orange'
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {student.grade}
                      </Box>
                    </Flex>
                  </Box>
                ))
              ) : (
                <Box className="text-center py-8">
                  <Box className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Trophy className="w-6 h-6 text-gray-400" />
                  </Box>
                  <Text size="2" className="text-gray-500">
                    No top performers yet
                  </Text>
                </Box>
              )}
            </Flex>

            {analytics.topPerformers && analytics.topPerformers.length > 3 && (
              <Box className="mt-5 pt-4 border-t border-gray-100">
                <RadixButton variant="ghost" size="2" className="w-full">
                  <Trophy className="w-4 h-4 mr-2" />
                  View All Performers
                </RadixButton>
              </Box>
            )}
          </Box>
        </RadixCard>
      </Box>
    </Grid>
  );
}
