import { Box, Grid, Flex, Heading, Text } from '@radix-ui/themes';
import { RadixCard } from 'components/ui/RadixCard';
import { RadixButton } from 'components/ui/RadixButton';
import { Eye, Calendar, User, Clock } from 'lucide-react';
import { ClassCard } from '../components/ClassCard';
import { useClassesData } from '../hooks/useClassesData';
import { SkeletonCard, SkeletonText } from 'components/ui/Skeleton';

export function Overview({
  isLoading = false,
}: {
  isLoading?: boolean;
}): JSX.Element {
  const { classes } = useClassesData();

  return (
    <Grid columns="3" gap="8">
      {/* Today's Classes - Enhanced with Modern Style */}
      <Box className="col-span-2">
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          {/* Header Section */}
          <Box className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <Flex justify="between" align="center">
              <Box>
                <Heading size="5" className="text-gray-900 mb-1">
                  Today's Classes
                </Heading>
                <Text size="3" className="text-gray-600">
                  {isLoading ? (
                    <SkeletonText width="6em" />
                  ) : (
                    `${classes?.length || 0} classes scheduled`
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

          {/* Classes List */}
          <Box className="p-6">
            <Flex direction="column" gap="6">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonCard key={i} height={72} className="mb-2" />
                ))
              ) : classes && classes.length > 0 ? (
                classes.slice(0, 3).map((classItem, index) => (
                  <Box
                    key={classItem.id}
                    className="p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:shadow-md transition-all animate-in slide-in-from-bottom-1 duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Flex justify="between" align="start" className="mb-2">
                      <Box className="flex-1">
                        <div className="text-lg font-bold text-gray-900 mb-2">
                          {classItem.name}
                        </div>
                        <Flex
                          align="center"
                          gap="6"
                          className="text-gray-600 mb-1"
                        >
                          <Flex align="center" gap="2">
                            <User className="w-4 h-4" />
                            <Text size="2">{classItem.instructor}</Text>
                          </Flex>
                          <Flex align="center" gap="2">
                            <Clock className="w-4 h-4" />
                            <Text size="2">{classItem.schedule}</Text>
                          </Flex>
                        </Flex>
                      </Box>
                      <Box className="text-right ml-4">
                        <Text size="2" className="text-gray-600 block">
                          {classItem.students} students
                        </Text>
                        <Text size="2" className="text-gray-500 block">
                          Grade {classItem.grade} - {classItem.section}
                        </Text>
                      </Box>
                    </Flex>
                  </Box>
                ))
              ) : (
                <Box className="text-center py-12">
                  <Box className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-gray-400" />
                  </Box>
                  <Text size="3" weight="medium" className="text-gray-900 mb-2">
                    No classes scheduled
                  </Text>
                  <Text size="2" className="text-gray-500 mb-4">
                    Create your first class schedule to get started
                  </Text>
                  <RadixButton
                    variant="solid"
                    size="3"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Class
                  </RadixButton>
                </Box>
              )}
            </Flex>
          </Box>
        </RadixCard>
      </Box>

      {/* Recent Classes - Enhanced with Modern Style */}
      <Box>
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden h-fit">
          {/* Header */}
          <Box className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
            <Flex justify="between" align="center">
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Recent Classes
                </Heading>
                <Text size="2" className="text-gray-600">
                  Latest activities
                </Text>
              </Box>
            </Flex>
          </Box>

          {/* Classes List */}
          <Box className="p-6">
            <Flex direction="column" gap="5">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonCard key={i} height={56} className="mb-2" />
                ))
              ) : classes && classes.length > 0 ? (
                classes.slice(0, 4).map((classItem, index) => (
                  <Box
                    key={classItem.id}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors animate-in slide-in-from-right-1 duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 block mb-1"
                    >
                      {classItem.name}
                    </Text>
                    <Text size="2" className="text-gray-600 block">
                      {classItem.instructor} • {classItem.students} students
                    </Text>
                  </Box>
                ))
              ) : (
                <Box className="text-center py-12">
                  <Box className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-gray-400" />
                  </Box>
                  <Text size="2" className="text-gray-500">
                    No recent classes
                  </Text>
                </Box>
              )}
            </Flex>

            {isLoading
              ? null
              : classes &&
                classes.length > 4 && (
                  <Box className="mt-6 pt-5 border-t border-gray-100">
                    <RadixButton variant="ghost" size="2" className="w-full">
                      <Eye className="w-4 h-4 mr-2" />
                      View All Classes
                    </RadixButton>
                  </Box>
                )}
          </Box>
        </RadixCard>
      </Box>
    </Grid>
  );
}
