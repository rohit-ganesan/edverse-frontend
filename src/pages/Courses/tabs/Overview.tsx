import { Box, Grid, Flex, Heading, Text, Progress } from '@radix-ui/themes';
import { RadixCard } from '../../../components/ui/RadixCard';
import { RadixButton } from '../../../components/ui/RadixButton';
import { Eye, GraduationCap, User, Users, Award } from 'lucide-react';
// import { CourseCard } from '../components/CourseCard';
import { useCoursesData } from '../hooks/useCoursesData';

export function Overview(): JSX.Element {
  const { courses } = useCoursesData();

  return (
    <Grid columns="3" gap="8">
      {/* Active Courses - Enhanced with Modern Style */}
      <Box className="col-span-2">
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          {/* Header Section */}
          <Box className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
            <Flex justify="between" align="center">
              <Box>
                <Heading size="5" className="text-gray-900 mb-1">
                  Active Courses
                </Heading>
                <Text size="3" className="text-gray-600">
                  {courses?.length || 0} courses available
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

          {/* Courses List */}
          <Box className="p-6">
            <Flex direction="column" gap="6">
              {courses && courses.length > 0 ? (
                courses.slice(0, 3).map((course, index) => (
                  <Box
                    key={course.id}
                    className="p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:shadow-md transition-all animate-in slide-in-from-bottom-1 duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Flex justify="between" align="start" className="mb-2">
                      <Box className="flex-1">
                        <div className="text-lg font-bold text-gray-900 mb-2">
                          {course.name}
                        </div>
                        <div className="text-sm text-gray-600 mb-1">
                          {course.code} • {course.instructor}
                        </div>
                      </Box>
                      <Box className="text-right ml-4">
                        <Text size="2" className="text-gray-600 block">
                          {course.credits} credits
                        </Text>
                        <Text size="2" className="text-gray-500 block">
                          {course.duration}
                        </Text>
                      </Box>
                    </Flex>

                    <Box>
                      <Flex justify="between" align="center" className="mb-1">
                        <Text size="2" className="text-gray-700 font-medium">
                          Enrollment
                        </Text>
                        <Text size="2" className="text-gray-600 font-semibold">
                          {course.enrolledStudents}/{course.maxCapacity}
                        </Text>
                      </Flex>
                      <Progress
                        value={
                          (course.enrolledStudents / course.maxCapacity) * 100
                        }
                        className="h-2"
                      />
                    </Box>
                  </Box>
                ))
              ) : (
                <Box className="text-center py-12">
                  <Box className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="w-8 h-8 text-gray-400" />
                  </Box>
                  <Text size="3" weight="medium" className="text-gray-900 mb-2">
                    No courses available
                  </Text>
                  <Text size="2" className="text-gray-500 mb-4">
                    Create your first course to get started
                  </Text>
                  <RadixButton
                    variant="solid"
                    size="3"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Create Course
                  </RadixButton>
                </Box>
              )}
            </Flex>
          </Box>
        </RadixCard>
      </Box>

      {/* Course Statistics - Enhanced with Modern Style */}
      <Box>
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden h-fit">
          {/* Header */}
          <Box className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <Flex justify="between" align="center">
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Course Stats
                </Heading>
                <Text size="2" className="text-gray-600">
                  Quick overview
                </Text>
              </Box>
            </Flex>
          </Box>

          {/* Stats List */}
          <Box className="p-6">
            <Flex direction="column" gap="5">
              <Box className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                <Flex align="start" gap="4">
                  <Box className="p-3 bg-purple-100 rounded-lg">
                    <Users className="w-5 h-5 text-purple-600" />
                  </Box>
                  <Box className="flex-1">
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 block mb-1"
                    >
                      Total Enrollment
                    </Text>
                    <Text
                      size="4"
                      weight="bold"
                      className="text-purple-600 block"
                    >
                      {courses
                        ?.reduce(
                          (sum, course) => sum + course.enrolledStudents,
                          0
                        )
                        .toLocaleString() || '0'}
                    </Text>
                  </Box>
                </Flex>
              </Box>

              <Box className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                <Flex align="start" gap="4">
                  <Box className="p-3 bg-orange-100 rounded-lg">
                    <Award className="w-5 h-5 text-orange-600" />
                  </Box>
                  <Box className="flex-1">
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
                      78%
                    </Text>
                  </Box>
                </Flex>
              </Box>

              <Box className="p-4 bg-green-50 rounded-lg border border-green-100">
                <Flex align="start" gap="4">
                  <Box className="p-3 bg-green-100 rounded-lg">
                    <User className="w-5 h-5 text-green-600" />
                  </Box>
                  <Box className="flex-1">
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 block mb-1"
                    >
                      Active Instructors
                    </Text>
                    <Text
                      size="4"
                      weight="bold"
                      className="text-green-600 block"
                    >
                      {courses
                        ? new Set(courses.map((c) => c.instructor)).size
                        : 0}
                    </Text>
                  </Box>
                </Flex>
              </Box>
            </Flex>

            <Box className="mt-6 pt-5 border-t border-gray-100">
              <RadixButton variant="ghost" size="2" className="w-full">
                <Eye className="w-4 h-4 mr-2" />
                View Detailed Stats
              </RadixButton>
            </Box>
          </Box>
        </RadixCard>
      </Box>
    </Grid>
  );
}
