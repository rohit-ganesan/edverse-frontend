import { useState } from 'react';
import { Box, Flex, Text, Heading, Grid, Badge, Tabs } from '@radix-ui/themes';
import { DashboardLayout } from 'components/layout/DashboardLayout';
import { RadixCard } from 'components/ui/RadixCard';
import { RadixButton } from 'components/ui/RadixButton';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  BookOpen,
  Plus,
  Search,
  Download,
  Eye,
  Video,
  User,
  CheckCircle,
  MoreHorizontal,
} from 'lucide-react';

interface ClassSession {
  id: string;
  title: string;
  course: string;
  courseCode: string;
  instructor: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  type: 'lecture' | 'lab' | 'seminar' | 'online';
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  enrolledStudents: number;
  maxCapacity: number;
  description?: string;
  materials?: string[];
  recordingAvailable?: boolean;
}

const mockClasses: ClassSession[] = [
  {
    id: '1',
    title: 'Introduction to React Hooks',
    course: 'Advanced JavaScript Programming',
    courseCode: 'CS301',
    instructor: 'Dr. Sarah Johnson',
    date: '2024-01-15',
    time: '10:00',
    duration: 90,
    location: 'Room 301, CS Building',
    type: 'lecture',
    status: 'scheduled',
    enrolledStudents: 45,
    maxCapacity: 50,
    description:
      'Deep dive into React Hooks including useState, useEffect, and custom hooks',
    materials: ['React Hooks Guide.pdf', 'Code Examples.zip'],
    recordingAvailable: false,
  },
  {
    id: '2',
    title: 'Data Structures Lab Session',
    course: 'Data Structures and Algorithms',
    courseCode: 'CS201',
    instructor: 'Prof. Michael Chen',
    date: '2024-01-15',
    time: '14:00',
    duration: 120,
    location: 'Computer Lab 2',
    type: 'lab',
    status: 'ongoing',
    enrolledStudents: 32,
    maxCapacity: 35,
    description: 'Hands-on implementation of binary trees and graph algorithms',
    materials: ['Lab Instructions.pdf', 'Starter Code.zip'],
    recordingAvailable: false,
  },
  {
    id: '3',
    title: 'Digital Marketing Strategy Discussion',
    course: 'Digital Marketing Fundamentals',
    courseCode: 'MKT101',
    instructor: 'Ms. Emily Rodriguez',
    date: '2024-01-14',
    time: '15:00',
    duration: 60,
    location: 'Online (Zoom)',
    type: 'online',
    status: 'completed',
    enrolledStudents: 28,
    maxCapacity: 40,
    description:
      'Case study analysis of successful digital marketing campaigns',
    materials: ['Case Studies.pdf', 'Discussion Questions.docx'],
    recordingAvailable: true,
  },
  {
    id: '4',
    title: 'Advanced Calculus Seminar',
    course: 'Advanced Mathematics',
    courseCode: 'MATH401',
    instructor: 'Dr. Robert Wilson',
    date: '2024-01-16',
    time: '11:00',
    duration: 75,
    location: 'Room 205, Math Building',
    type: 'seminar',
    status: 'scheduled',
    enrolledStudents: 18,
    maxCapacity: 20,
    description: 'Student presentations on advanced calculus applications',
    materials: ['Presentation Guidelines.pdf'],
    recordingAvailable: false,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'scheduled':
      return 'blue';
    case 'ongoing':
      return 'green';
    case 'completed':
      return 'gray';
    case 'cancelled':
      return 'red';
    default:
      return 'gray';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'lecture':
      return BookOpen;
    case 'lab':
      return Users;
    case 'seminar':
      return User;
    case 'online':
      return Video;
    default:
      return BookOpen;
  }
};

export function ClassesPage(): JSX.Element {
  const [activeTab, setActiveTab] = useState('today');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('2024-01-15');

  const filteredClasses = mockClasses.filter((classItem) => {
    const matchesSearch =
      classItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const todayClasses = mockClasses.filter(
    (classItem) => classItem.date === selectedDate
  );
  const upcomingClasses = mockClasses.filter(
    (classItem) => new Date(classItem.date) > new Date(selectedDate)
  );
  const completedClasses = mockClasses.filter(
    (classItem) => classItem.status === 'completed'
  );

  const totalClasses = mockClasses.length;
  const ongoingClasses = mockClasses.filter(
    (c) => c.status === 'ongoing'
  ).length;
  const completedToday = todayClasses.filter(
    (c) => c.status === 'completed'
  ).length;
  const totalStudents = mockClasses.reduce(
    (sum, c) => sum + c.enrolledStudents,
    0
  );

  return (
    <DashboardLayout>
      {/* Header Section */}
      <Box className="mb-8">
        <Flex justify="between" align="center" className="mb-4">
          <Box>
            <Heading size="7" className="text-gray-900 mb-2">
              Classes
            </Heading>
            <Text size="4" className="text-gray-600">
              Manage class schedules, sessions, and attendance
            </Text>
          </Box>
          <Flex gap="3">
            <RadixButton variant="outline" size="3">
              <Download className="w-4 h-4 mr-2" />
              Export Schedule
            </RadixButton>
            <RadixButton variant="solid" size="3">
              <Plus className="w-4 h-4 mr-2" />
              Schedule Class
            </RadixButton>
          </Flex>
        </Flex>

        {/* Quick Stats */}
        <Grid columns="4" gap="4" className="mb-6">
          <RadixCard className="p-4">
            <Flex align="center" gap="3">
              <Box className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </Box>
              <Box>
                <Text size="3" weight="bold" className="text-gray-900">
                  {todayClasses.length}
                </Text>
                <Text size="2" className="text-gray-600">
                  Today's Classes
                </Text>
              </Box>
            </Flex>
          </RadixCard>

          <RadixCard className="p-4">
            <Flex align="center" gap="3">
              <Box className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </Box>
              <Box>
                <Text size="3" weight="bold" className="text-gray-900">
                  {ongoingClasses}
                </Text>
                <Text size="2" className="text-gray-600">
                  Ongoing Now
                </Text>
              </Box>
            </Flex>
          </RadixCard>

          <RadixCard className="p-4">
            <Flex align="center" gap="3">
              <Box className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </Box>
              <Box>
                <Text size="3" weight="bold" className="text-gray-900">
                  {totalStudents}
                </Text>
                <Text size="2" className="text-gray-600">
                  Total Attendees
                </Text>
              </Box>
            </Flex>
          </RadixCard>

          <RadixCard className="p-4">
            <Flex align="center" gap="3">
              <Box className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-orange-600" />
              </Box>
              <Box>
                <Text size="3" weight="bold" className="text-gray-900">
                  {completedToday}
                </Text>
                <Text size="2" className="text-gray-600">
                  Completed Today
                </Text>
              </Box>
            </Flex>
          </RadixCard>
        </Grid>
      </Box>

      {/* Tabs Navigation */}
      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List className="mb-6">
          <Tabs.Trigger value="today">Today's Classes</Tabs.Trigger>
          <Tabs.Trigger value="upcoming">Upcoming</Tabs.Trigger>
          <Tabs.Trigger value="all">All Classes</Tabs.Trigger>
          <Tabs.Trigger value="calendar">Calendar View</Tabs.Trigger>
        </Tabs.List>

        {/* Today's Classes Tab */}
        <Tabs.Content value="today">
          <Box className="mb-6">
            <Flex justify="between" align="center" className="mb-4">
              <Heading size="5" className="text-gray-900">
                Classes for{' '}
                {new Date(selectedDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Heading>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </Flex>
          </Box>

          <Grid columns="1" gap="4">
            {todayClasses.map((classItem) => {
              const TypeIcon = getTypeIcon(classItem.type);
              return (
                <RadixCard
                  key={classItem.id}
                  className="p-6 hover:shadow-lg transition-shadow"
                >
                  <Flex justify="between" align="start">
                    <Flex gap="4" align="start">
                      <Box className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                        <TypeIcon className="w-8 h-8 text-blue-600" />
                      </Box>
                      <Box className="flex-1">
                        <Flex align="center" gap="3" className="mb-2">
                          <Heading size="4" className="text-gray-900">
                            {classItem.title}
                          </Heading>
                          <Badge color={getStatusColor(classItem.status)}>
                            {classItem.status}
                          </Badge>
                          <Badge color="gray">{classItem.type}</Badge>
                        </Flex>

                        <Text size="2" className="text-gray-600 mb-2">
                          {classItem.course} ({classItem.courseCode})
                        </Text>

                        <Text size="2" className="text-gray-600 mb-3">
                          Instructor: {classItem.instructor}
                        </Text>

                        {classItem.description && (
                          <Text size="2" className="text-gray-600 mb-3">
                            {classItem.description}
                          </Text>
                        )}

                        <Flex gap="6" className="mb-3">
                          <Text size="2" className="text-gray-600">
                            <Clock className="w-4 h-4 inline mr-1" />
                            {classItem.time} ({classItem.duration} min)
                          </Text>
                          <Text size="2" className="text-gray-600">
                            <MapPin className="w-4 h-4 inline mr-1" />
                            {classItem.location}
                          </Text>
                          <Text size="2" className="text-gray-600">
                            <Users className="w-4 h-4 inline mr-1" />
                            {classItem.enrolledStudents}/{classItem.maxCapacity}{' '}
                            students
                          </Text>
                        </Flex>

                        {classItem.materials &&
                          classItem.materials.length > 0 && (
                            <Box className="mb-3">
                              <Text size="2" className="text-gray-600 mb-1">
                                Materials:
                              </Text>
                              <Flex gap="2" wrap="wrap">
                                {classItem.materials.map((material, index) => (
                                  <Badge
                                    key={index}
                                    color="blue"
                                    variant="soft"
                                  >
                                    {material}
                                  </Badge>
                                ))}
                              </Flex>
                            </Box>
                          )}

                        {classItem.recordingAvailable && (
                          <Flex align="center" gap="2">
                            <Video className="w-4 h-4 text-green-600" />
                            <Text size="2" className="text-green-600">
                              Recording available
                            </Text>
                          </Flex>
                        )}
                      </Box>
                    </Flex>

                    <Flex gap="2">
                      {classItem.status === 'scheduled' && (
                        <>
                          <RadixButton variant="solid" size="2">
                            Start Class
                          </RadixButton>
                          <RadixButton variant="outline" size="2">
                            View Details
                          </RadixButton>
                        </>
                      )}
                      {classItem.status === 'ongoing' && (
                        <>
                          <RadixButton
                            variant="solid"
                            size="2"
                            className="bg-green-600"
                          >
                            Join Class
                          </RadixButton>
                          <RadixButton variant="outline" size="2">
                            View Materials
                          </RadixButton>
                        </>
                      )}
                      {classItem.status === 'completed' && (
                        <>
                          <RadixButton variant="outline" size="2">
                            View Recording
                          </RadixButton>
                          {classItem.recordingAvailable && (
                            <RadixButton variant="outline" size="2">
                              View Recording
                            </RadixButton>
                          )}
                        </>
                      )}
                      <RadixButton variant="ghost" size="2">
                        <MoreHorizontal className="w-4 h-4" />
                      </RadixButton>
                    </Flex>
                  </Flex>
                </RadixCard>
              );
            })}
          </Grid>
        </Tabs.Content>

        {/* Upcoming Classes Tab */}
        <Tabs.Content value="upcoming">
          <Grid columns="2" gap="6">
            {upcomingClasses.map((classItem) => {
              const TypeIcon = getTypeIcon(classItem.type);
              return (
                <RadixCard
                  key={classItem.id}
                  className="p-6 hover:shadow-lg transition-shadow"
                >
                  <Flex direction="column" gap="4">
                    <Flex justify="between" align="start">
                      <Box className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <TypeIcon className="w-6 h-6 text-blue-600" />
                      </Box>
                      <Badge color={getStatusColor(classItem.status)}>
                        {classItem.status}
                      </Badge>
                    </Flex>

                    <Box>
                      <Heading size="4" className="text-gray-900 mb-2">
                        {classItem.title}
                      </Heading>
                      <Text size="2" className="text-gray-600 mb-2">
                        {classItem.course} ({classItem.courseCode})
                      </Text>
                      <Text size="2" className="text-gray-600 mb-3">
                        {classItem.instructor}
                      </Text>
                    </Box>

                    <Flex direction="column" gap="2">
                      <Text size="2" className="text-gray-600">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        {new Date(classItem.date).toLocaleDateString()} at{' '}
                        {classItem.time}
                      </Text>
                      <Text size="2" className="text-gray-600">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        {classItem.location}
                      </Text>
                      <Text size="2" className="text-gray-600">
                        <Clock className="w-4 h-4 inline mr-1" />
                        {classItem.duration} minutes
                      </Text>
                    </Flex>

                    <Flex justify="between" align="center">
                      <Text size="2" className="text-gray-600">
                        {classItem.enrolledStudents}/{classItem.maxCapacity}{' '}
                        enrolled
                      </Text>
                      <Flex gap="2">
                        <RadixButton variant="outline" size="2">
                          View Details
                        </RadixButton>
                        <RadixButton variant="outline" size="2">
                          Edit Class
                        </RadixButton>
                      </Flex>
                    </Flex>
                  </Flex>
                </RadixCard>
              );
            })}
          </Grid>
        </Tabs.Content>

        {/* All Classes Tab */}
        <Tabs.Content value="all">
          {/* Search Bar */}
          <Flex justify="between" align="center" className="mb-6">
            <Box className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </Box>
          </Flex>

          <Grid columns="1" gap="4">
            {filteredClasses.map((classItem) => {
              const TypeIcon = getTypeIcon(classItem.type);
              return (
                <RadixCard
                  key={classItem.id}
                  className="p-4 hover:shadow-lg transition-shadow"
                >
                  <Flex justify="between" align="center">
                    <Flex gap="3" align="center">
                      <Box className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <TypeIcon className="w-5 h-5 text-blue-600" />
                      </Box>
                      <Box>
                        <Text
                          size="3"
                          weight="medium"
                          className="text-gray-900"
                        >
                          {classItem.title}
                        </Text>
                        <Text size="2" className="text-gray-600">
                          {classItem.course} • {classItem.instructor}
                        </Text>
                      </Box>
                    </Flex>

                    <Flex gap="4" align="center">
                      <Text size="2" className="text-gray-600">
                        {new Date(classItem.date).toLocaleDateString()} at{' '}
                        {classItem.time}
                      </Text>
                      <Text size="2" className="text-gray-600">
                        {classItem.location}
                      </Text>
                      <Badge color={getStatusColor(classItem.status)}>
                        {classItem.status}
                      </Badge>
                      <RadixButton variant="ghost" size="2">
                        <Eye className="w-4 h-4" />
                      </RadixButton>
                    </Flex>
                  </Flex>
                </RadixCard>
              );
            })}
          </Grid>
        </Tabs.Content>

        {/* Calendar View Tab */}
        <Tabs.Content value="calendar">
          <RadixCard className="p-6">
            <Heading size="4" className="mb-4">
              Calendar View
            </Heading>
            <Box className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
              <Flex direction="column" align="center" gap="2">
                <Calendar className="w-16 h-16 text-gray-400" />
                <Text size="3" className="text-gray-600">
                  Calendar component would go here
                </Text>
                <Text size="2" className="text-gray-500">
                  Integration with calendar library for visual schedule
                  management
                </Text>
              </Flex>
            </Box>
          </RadixCard>
        </Tabs.Content>
      </Tabs.Root>
    </DashboardLayout>
  );
}
