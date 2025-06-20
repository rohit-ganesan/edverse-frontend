import { useState } from 'react';
import { Box, Flex, Text, Heading, Grid, Badge, Tabs } from '@radix-ui/themes';
import { DashboardLayout } from 'components/layout/DashboardLayout';
import { RadixCard } from 'components/ui/RadixCard';
import { RadixButton } from 'components/ui/RadixButton';
import { PageHeader } from 'components/ui/PageHeader';
import { StatsGrid } from 'components/ui/StatsGrid';
import {
  BookOpen,
  Users,
  Calendar,
  Clock,
  Star,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Play,
  FileText,
  Award,
  TrendingUp,
  BarChart3,
  User,
  MapPin,
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  code: string;
  description: string;
  instructor: string;
  instructorAvatar?: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  enrolledStudents: number;
  maxStudents: number;
  rating: number;
  reviews: number;
  price: number;
  category: string;
  schedule: string;
  location: string;
  status: 'active' | 'draft' | 'completed';
  progress?: number;
  nextClass?: string;
  thumbnail?: string;
}

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Advanced JavaScript Programming',
    code: 'CS301',
    description:
      'Master advanced JavaScript concepts including ES6+, async programming, and modern frameworks.',
    instructor: 'Dr. Sarah Johnson',
    duration: '12 weeks',
    level: 'Advanced',
    enrolledStudents: 45,
    maxStudents: 50,
    rating: 4.8,
    reviews: 124,
    price: 299,
    category: 'Computer Science',
    schedule: 'Mon, Wed, Fri - 10:00 AM',
    location: 'Room 301, CS Building',
    status: 'active',
    progress: 65,
    nextClass: 'Tomorrow at 10:00 AM',
  },
  {
    id: '2',
    title: 'Data Structures and Algorithms',
    code: 'CS201',
    description:
      'Comprehensive study of fundamental data structures and algorithmic problem-solving techniques.',
    instructor: 'Prof. Michael Chen',
    duration: '16 weeks',
    level: 'Intermediate',
    enrolledStudents: 67,
    maxStudents: 80,
    rating: 4.6,
    reviews: 89,
    price: 399,
    category: 'Computer Science',
    schedule: 'Tue, Thu - 2:00 PM',
    location: 'Room 205, CS Building',
    status: 'active',
    progress: 32,
    nextClass: 'Today at 2:00 PM',
  },
  {
    id: '3',
    title: 'Digital Marketing Fundamentals',
    code: 'MKT101',
    description:
      'Learn the essentials of digital marketing including SEO, social media, and analytics.',
    instructor: 'Ms. Emily Rodriguez',
    duration: '8 weeks',
    level: 'Beginner',
    enrolledStudents: 32,
    maxStudents: 40,
    rating: 4.7,
    reviews: 156,
    price: 199,
    category: 'Marketing',
    schedule: 'Mon, Wed - 3:00 PM',
    location: 'Room 102, Business Building',
    status: 'active',
    progress: 78,
    nextClass: 'Monday at 3:00 PM',
  },
];

const categories = [
  'All',
  'Computer Science',
  'Mathematics',
  'Marketing',
  'Physics',
  'Business',
];
const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export function CoursesPage(): JSX.Element {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');

  const filteredCourses = mockCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || course.category === selectedCategory;
    const matchesLevel =
      selectedLevel === 'All' || course.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  const enrolledCourses = mockCourses.filter(
    (course) => course.progress !== undefined
  );
  const availableCourses = mockCourses.filter(
    (course) => course.progress === undefined
  );

  const totalEnrolled = enrolledCourses.length;
  const totalCompleted = enrolledCourses.filter(
    (course) => course.progress === 100
  ).length;
  const averageProgress =
    enrolledCourses.reduce((sum, course) => sum + (course.progress || 0), 0) /
      enrolledCourses.length || 0;

  const headerActions = [
    {
      label: 'Export Progress',
      icon: Download,
      variant: 'outline' as const,
      onClick: () => console.log('Export progress'),
    },
    {
      label: 'Create Course',
      icon: Plus,
      isPrimary: true,
      onClick: () => console.log('Create course'),
    },
  ];

  const stats = [
    {
      title: 'Enrolled Courses',
      value: totalEnrolled,
      icon: BookOpen,
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-100',
    },
    {
      title: 'Completed',
      value: totalCompleted,
      icon: Award,
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-100',
    },
    {
      title: 'Avg Progress',
      value: `${Math.round(averageProgress)}%`,
      icon: TrendingUp,
      iconColor: 'text-purple-600',
      iconBgColor: 'bg-purple-100',
    },
    {
      title: 'Available Courses',
      value: availableCourses.length,
      icon: BarChart3,
      iconColor: 'text-orange-600',
      iconBgColor: 'bg-orange-100',
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Courses"
        description="Discover, enroll, and manage your learning journey"
        actions={headerActions}
      />

      <StatsGrid stats={stats} />

      {/* Tabs Navigation */}
      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List className="mb-6">
          <Tabs.Trigger value="all">All Courses</Tabs.Trigger>
          <Tabs.Trigger value="enrolled">My Courses</Tabs.Trigger>
          <Tabs.Trigger value="available">Available</Tabs.Trigger>
          <Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
        </Tabs.List>

        {/* All Courses Tab */}
        <Tabs.Content value="all">
          {/* Search and Filter Bar */}
          <Flex justify="between" align="center" className="mb-6">
            <Flex gap="3" align="center">
              <Box className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </Box>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </Flex>
          </Flex>

          {/* Courses Grid */}
          <Grid columns="3" gap="6">
            {filteredCourses.map((course) => (
              <RadixCard
                key={course.id}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <Flex direction="column" gap="4">
                  {/* Course Header */}
                  <Flex justify="between" align="start">
                    <Badge
                      color={
                        course.level === 'Beginner'
                          ? 'green'
                          : course.level === 'Intermediate'
                            ? 'blue'
                            : 'purple'
                      }
                    >
                      {course.level}
                    </Badge>
                    <Badge
                      color={course.status === 'active' ? 'green' : 'gray'}
                    >
                      {course.status}
                    </Badge>
                  </Flex>

                  {/* Course Info */}
                  <Box>
                    <Heading size="4" className="text-gray-900 mb-2">
                      {course.title}
                    </Heading>
                    <Text size="2" className="text-gray-600 mb-2">
                      {course.code} • {course.category}
                    </Text>
                    <Text size="2" className="text-gray-600 mb-3 line-clamp-2">
                      {course.description}
                    </Text>
                  </Box>

                  {/* Instructor */}
                  <Flex align="center" gap="2">
                    <Box className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600" />
                    </Box>
                    <Text size="2" className="text-gray-600">
                      {course.instructor}
                    </Text>
                  </Flex>

                  {/* Course Details */}
                  <Flex direction="column" gap="2">
                    <Flex justify="between" align="center">
                      <Text size="2" className="text-gray-600">
                        <Clock className="w-4 h-4 inline mr-1" />
                        {course.duration}
                      </Text>
                      <Text size="2" className="text-gray-600">
                        <Users className="w-4 h-4 inline mr-1" />
                        {course.enrolledStudents}/{course.maxStudents}
                      </Text>
                    </Flex>
                    <Flex justify="between" align="center">
                      <Flex align="center" gap="1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <Text size="2" weight="medium">
                          {course.rating}
                        </Text>
                        <Text size="2" className="text-gray-600">
                          ({course.reviews})
                        </Text>
                      </Flex>
                      <Text size="2" weight="bold" className="text-green-600">
                        ${course.price}
                      </Text>
                    </Flex>
                  </Flex>

                  {/* Progress Bar (if enrolled) */}
                  {course.progress !== undefined && (
                    <Box>
                      <Flex justify="between" align="center" className="mb-1">
                        <Text size="2" className="text-gray-600">
                          Progress
                        </Text>
                        <Text size="2" weight="medium">
                          {course.progress}%
                        </Text>
                      </Flex>
                      <Box className="w-full bg-gray-200 rounded-full h-2">
                        <Box
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${course.progress}%` }}
                        />
                      </Box>
                    </Box>
                  )}

                  {/* Action Buttons */}
                  <Flex gap="2">
                    {course.progress !== undefined ? (
                      <RadixButton variant="solid" size="2" className="flex-1">
                        <Play className="w-4 h-4 mr-2" />
                        Continue
                      </RadixButton>
                    ) : (
                      <RadixButton variant="solid" size="2" className="flex-1">
                        Enroll Now
                      </RadixButton>
                    )}
                    <RadixButton variant="outline" size="2">
                      <Eye className="w-4 h-4" />
                    </RadixButton>
                  </Flex>
                </Flex>
              </RadixCard>
            ))}
          </Grid>
        </Tabs.Content>

        {/* My Courses Tab */}
        <Tabs.Content value="enrolled">
          <Grid columns="1" gap="4">
            {enrolledCourses.map((course) => (
              <RadixCard
                key={course.id}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <Flex justify="between" align="start">
                  <Flex gap="4" align="start">
                    <Box className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-blue-600" />
                    </Box>
                    <Box className="flex-1">
                      <Flex align="center" gap="3" className="mb-2">
                        <Heading size="4" className="text-gray-900">
                          {course.title}
                        </Heading>
                        <Badge color="blue">{course.level}</Badge>
                      </Flex>
                      <Text size="2" className="text-gray-600 mb-3">
                        {course.code} • Instructor: {course.instructor}
                      </Text>

                      {/* Progress Section */}
                      <Box className="mb-4">
                        <Flex justify="between" align="center" className="mb-2">
                          <Text size="2" className="text-gray-600">
                            Course Progress
                          </Text>
                          <Text
                            size="2"
                            weight="bold"
                            className="text-blue-600"
                          >
                            {course.progress}%
                          </Text>
                        </Flex>
                        <Box className="w-full bg-gray-200 rounded-full h-3">
                          <Box
                            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${course.progress}%` }}
                          />
                        </Box>
                      </Box>

                      {/* Schedule Info */}
                      <Flex gap="4" className="mb-3">
                        <Text size="2" className="text-gray-600">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          {course.schedule}
                        </Text>
                        <Text size="2" className="text-gray-600">
                          <MapPin className="w-4 h-4 inline mr-1" />
                          {course.location}
                        </Text>
                      </Flex>

                      {course.nextClass && (
                        <Text size="2" className="text-blue-600 font-medium">
                          Next class: {course.nextClass}
                        </Text>
                      )}
                    </Box>
                  </Flex>
                  <Flex gap="2">
                    <RadixButton variant="solid" size="2">
                      <Play className="w-4 h-4 mr-2" />
                      Continue Learning
                    </RadixButton>
                    <RadixButton variant="outline" size="2">
                      <FileText className="w-4 h-4" />
                    </RadixButton>
                  </Flex>
                </Flex>
              </RadixCard>
            ))}
          </Grid>
        </Tabs.Content>

        {/* Available Courses Tab */}
        <Tabs.Content value="available">
          <Grid columns="2" gap="6">
            {availableCourses.map((course) => (
              <RadixCard
                key={course.id}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <Flex direction="column" gap="4">
                  <Flex justify="between" align="start">
                    <Badge
                      color={
                        course.level === 'Beginner'
                          ? 'green'
                          : course.level === 'Intermediate'
                            ? 'blue'
                            : 'purple'
                      }
                    >
                      {course.level}
                    </Badge>
                    <Text size="3" weight="bold" className="text-green-600">
                      ${course.price}
                    </Text>
                  </Flex>

                  <Box>
                    <Heading size="4" className="text-gray-900 mb-2">
                      {course.title}
                    </Heading>
                    <Text size="2" className="text-gray-600 mb-3">
                      {course.description}
                    </Text>
                  </Box>

                  <Flex justify="between" align="center">
                    <Flex align="center" gap="1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <Text size="2" weight="medium">
                        {course.rating}
                      </Text>
                      <Text size="2" className="text-gray-600">
                        ({course.reviews})
                      </Text>
                    </Flex>
                    <Text size="2" className="text-gray-600">
                      {course.enrolledStudents}/{course.maxStudents} enrolled
                    </Text>
                  </Flex>

                  <RadixButton variant="solid" size="3">
                    Enroll Now
                  </RadixButton>
                </Flex>
              </RadixCard>
            ))}
          </Grid>
        </Tabs.Content>

        {/* Analytics Tab */}
        <Tabs.Content value="analytics">
          <Grid columns="2" gap="6">
            <RadixCard className="p-6">
              <Heading size="4" className="mb-4">
                Learning Progress
              </Heading>
              <Box className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <Flex direction="column" align="center" gap="2">
                  <BarChart3 className="w-12 h-12 text-gray-400" />
                  <Text size="2" className="text-gray-600">
                    Progress chart would go here
                  </Text>
                </Flex>
              </Box>
            </RadixCard>

            <RadixCard className="p-6">
              <Heading size="4" className="mb-4">
                Course Statistics
              </Heading>
              <Flex direction="column" gap="4">
                <Flex justify="between" align="center">
                  <Text size="2" className="text-gray-600">
                    Completion Rate
                  </Text>
                  <Text size="2" weight="bold" className="text-green-600">
                    {Math.round((totalCompleted / totalEnrolled) * 100)}%
                  </Text>
                </Flex>
                <Flex justify="between" align="center">
                  <Text size="2" className="text-gray-600">
                    Average Rating
                  </Text>
                  <Text size="2" weight="bold" className="text-yellow-600">
                    4.7/5
                  </Text>
                </Flex>
                <Flex justify="between" align="center">
                  <Text size="2" className="text-gray-600">
                    Study Hours This Week
                  </Text>
                  <Text size="2" weight="bold" className="text-blue-600">
                    12.5 hrs
                  </Text>
                </Flex>
                <Flex justify="between" align="center">
                  <Text size="2" className="text-gray-600">
                    Certificates Earned
                  </Text>
                  <Text size="2" weight="bold" className="text-purple-600">
                    {totalCompleted}
                  </Text>
                </Flex>
              </Flex>
            </RadixCard>
          </Grid>
        </Tabs.Content>
      </Tabs.Root>
    </DashboardLayout>
  );
}
