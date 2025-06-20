import { useState } from 'react';
import { Box, Flex, Text, Heading, Grid, Badge, Tabs } from '@radix-ui/themes';
import { DashboardLayout } from 'components/layout/DashboardLayout';
import { RadixCard } from 'components/ui/RadixCard';
import { RadixButton } from 'components/ui/RadixButton';
import {
  BookOpen,
  Users,
  Calendar,
  Award,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  GraduationCap,
  Target,
  BarChart3,
} from 'lucide-react';

interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  instructor: string;
  enrolledStudents: number;
  status: 'active' | 'inactive';
  semester: string;
  department: string;
}

interface AcademicProgram {
  id: string;
  name: string;
  duration: string;
  totalCredits: number;
  enrolledStudents: number;
  status: 'active' | 'inactive';
}

const mockSubjects: Subject[] = [
  {
    id: '1',
    name: 'Advanced Mathematics',
    code: 'MATH401',
    credits: 4,
    instructor: 'Dr. Sarah Johnson',
    enrolledStudents: 45,
    status: 'active',
    semester: 'Fall 2024',
    department: 'Mathematics',
  },
  {
    id: '2',
    name: 'Computer Science Fundamentals',
    code: 'CS101',
    credits: 3,
    instructor: 'Prof. Michael Chen',
    enrolledStudents: 67,
    status: 'active',
    semester: 'Fall 2024',
    department: 'Computer Science',
  },
  {
    id: '3',
    name: 'Physics Laboratory',
    code: 'PHYS301',
    credits: 2,
    instructor: 'Dr. Emily Rodriguez',
    enrolledStudents: 32,
    status: 'active',
    semester: 'Fall 2024',
    department: 'Physics',
  },
];

const mockPrograms: AcademicProgram[] = [
  {
    id: '1',
    name: 'Bachelor of Science in Computer Science',
    duration: '4 years',
    totalCredits: 120,
    enrolledStudents: 245,
    status: 'active',
  },
  {
    id: '2',
    name: 'Bachelor of Arts in Mathematics',
    duration: '4 years',
    totalCredits: 120,
    enrolledStudents: 156,
    status: 'active',
  },
];

export function AcademicsPage(): JSX.Element {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubjects = mockSubjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCredits = mockSubjects.reduce(
    (sum, subject) => sum + subject.credits,
    0
  );
  const totalEnrolledStudents = mockSubjects.reduce(
    (sum, subject) => sum + subject.enrolledStudents,
    0
  );

  return (
    <DashboardLayout>
      {/* Header Section */}
      <Box className="mb-8">
        <Flex justify="between" align="center" className="mb-4">
          <Box>
            <Heading size="7" className="text-gray-900 mb-2">
              Academic
            </Heading>
            <Text size="4" className="text-gray-600">
              Comprehensive academic program and curriculum management
            </Text>
          </Box>
          <Flex gap="3">
            <RadixButton variant="outline" size="3">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </RadixButton>
            <Flex gap="3" className="mt-6">
              <RadixButton variant="outline" size="3">
                <Plus className="w-4 h-4 mr-2" />
                Add Subject
              </RadixButton>
              <RadixButton variant="solid" size="3">
                <Search className="w-4 h-4 mr-2" />
                Browse All
              </RadixButton>
            </Flex>
          </Flex>
        </Flex>

        {/* Quick Stats */}
        <Grid columns="4" gap="4" className="mb-6">
          <RadixCard className="p-4">
            <Flex align="center" gap="3">
              <Box className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </Box>
              <Box>
                <Text size="3" weight="bold" className="text-gray-900">
                  {mockSubjects.length}
                </Text>
                <Text size="2" className="text-gray-600">
                  Active Subjects
                </Text>
              </Box>
            </Flex>
          </RadixCard>

          <RadixCard className="p-4">
            <Flex align="center" gap="3">
              <Box className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-green-600" />
              </Box>
              <Box>
                <Text size="3" weight="bold" className="text-gray-900">
                  {mockPrograms.length}
                </Text>
                <Text size="2" className="text-gray-600">
                  Programs
                </Text>
              </Box>
            </Flex>
          </RadixCard>

          <RadixCard className="p-4">
            <Flex align="center" gap="3">
              <Box className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
              </Box>
              <Box>
                <Text size="3" weight="bold" className="text-gray-900">
                  {totalCredits}
                </Text>
                <Text size="2" className="text-gray-600">
                  Total Credits
                </Text>
              </Box>
            </Flex>
          </RadixCard>

          <RadixCard className="p-4">
            <Flex align="center" gap="3">
              <Box className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </Box>
              <Box>
                <Text size="3" weight="bold" className="text-gray-900">
                  {totalEnrolledStudents}
                </Text>
                <Text size="2" className="text-gray-600">
                  Enrolled Students
                </Text>
              </Box>
            </Flex>
          </RadixCard>
        </Grid>
      </Box>

      {/* Tabs Navigation */}
      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List className="mb-6">
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="subjects">Subjects</Tabs.Trigger>
          <Tabs.Trigger value="programs">Programs</Tabs.Trigger>
          <Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
        </Tabs.List>

        {/* Overview Tab */}
        <Tabs.Content value="overview">
          <Grid columns="2" gap="6">
            {/* Recent Activity */}
            <RadixCard className="p-6">
              <Heading size="4" className="mb-4">
                Recent Activity
              </Heading>
              <Flex direction="column" gap="4">
                <Flex
                  justify="between"
                  align="center"
                  className="p-3 bg-gray-50 rounded-lg"
                >
                  <Flex align="center" gap="3">
                    <Box className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                    </Box>
                    <Box>
                      <Text size="2" weight="medium">
                        New subject added
                      </Text>
                      <Text size="1" className="text-gray-600">
                        MATH401 - Advanced Mathematics
                      </Text>
                    </Box>
                  </Flex>
                  <Text size="1" className="text-gray-500">
                    2 hours ago
                  </Text>
                </Flex>

                <Flex
                  justify="between"
                  align="center"
                  className="p-3 bg-gray-50 rounded-lg"
                >
                  <Flex align="center" gap="3">
                    <Box className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-green-600" />
                    </Box>
                    <Box>
                      <Text size="2" weight="medium">
                        Enrollment updated
                      </Text>
                      <Text size="1" className="text-gray-600">
                        CS101 - 5 new students enrolled
                      </Text>
                    </Box>
                  </Flex>
                  <Text size="1" className="text-gray-500">
                    1 day ago
                  </Text>
                </Flex>

                <Flex
                  justify="between"
                  align="center"
                  className="p-3 bg-gray-50 rounded-lg"
                >
                  <Flex align="center" gap="3">
                    <Box className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Award className="w-4 h-4 text-purple-600" />
                    </Box>
                    <Box>
                      <Text size="2" weight="medium">
                        Curriculum updated
                      </Text>
                      <Text size="1" className="text-gray-600">
                        Physics Laboratory syllabus revised
                      </Text>
                    </Box>
                  </Flex>
                  <Text size="1" className="text-gray-500">
                    3 days ago
                  </Text>
                </Flex>
              </Flex>
            </RadixCard>

            {/* Upcoming Deadlines */}
            <RadixCard className="p-6">
              <Heading size="4" className="mb-4">
                Upcoming Deadlines
              </Heading>
              <Flex direction="column" gap="4">
                <Flex
                  justify="between"
                  align="center"
                  className="p-3 border-l-4 border-red-400 bg-red-50 rounded-r-lg"
                >
                  <Box>
                    <Text size="2" weight="medium" className="text-red-800">
                      Course Registration Deadline
                    </Text>
                    <Text size="1" className="text-red-600">
                      Fall 2024 semester
                    </Text>
                  </Box>
                  <Badge color="red">3 days left</Badge>
                </Flex>

                <Flex
                  justify="between"
                  align="center"
                  className="p-3 border-l-4 border-yellow-400 bg-yellow-50 rounded-r-lg"
                >
                  <Box>
                    <Text size="2" weight="medium" className="text-yellow-800">
                      Syllabus Submission
                    </Text>
                    <Text size="1" className="text-yellow-600">
                      All departments
                    </Text>
                  </Box>
                  <Badge color="yellow">1 week left</Badge>
                </Flex>

                <Flex
                  justify="between"
                  align="center"
                  className="p-3 border-l-4 border-blue-400 bg-blue-50 rounded-r-lg"
                >
                  <Box>
                    <Text size="2" weight="medium" className="text-blue-800">
                      Mid-term Exam Schedule
                    </Text>
                    <Text size="1" className="text-blue-600">
                      Schedule finalization
                    </Text>
                  </Box>
                  <Badge color="blue">2 weeks left</Badge>
                </Flex>
              </Flex>
            </RadixCard>
          </Grid>
        </Tabs.Content>

        {/* Subjects Tab */}
        <Tabs.Content value="subjects">
          {/* Search and Filter Bar */}
          <Flex justify="between" align="center" className="mb-6">
            <Flex gap="3" align="center">
              <Box className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search subjects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </Box>
              <RadixButton variant="outline" size="2">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </RadixButton>
            </Flex>
          </Flex>

          {/* Subjects Grid */}
          <Grid columns="1" gap="4">
            {filteredSubjects.map((subject) => (
              <RadixCard
                key={subject.id}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <Flex justify="between" align="start">
                  <Flex gap="4" align="start">
                    <Box className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </Box>
                    <Box>
                      <Flex align="center" gap="3" className="mb-2">
                        <Heading size="4" className="text-gray-900">
                          {subject.name}
                        </Heading>
                        <Badge
                          color={subject.status === 'active' ? 'green' : 'gray'}
                        >
                          {subject.status}
                        </Badge>
                      </Flex>
                      <Text size="2" className="text-gray-600 mb-2">
                        {subject.code} • {subject.credits} Credits •{' '}
                        {subject.department}
                      </Text>
                      <Text size="2" className="text-gray-600 mb-3">
                        Instructor: {subject.instructor}
                      </Text>
                      <Flex gap="4">
                        <Text size="2" className="text-gray-600">
                          <Users className="w-4 h-4 inline mr-1" />
                          {subject.enrolledStudents} students
                        </Text>
                        <Text size="2" className="text-gray-600">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          {subject.semester}
                        </Text>
                      </Flex>
                    </Box>
                  </Flex>
                  <Flex gap="2">
                    <RadixButton variant="outline" size="2">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </RadixButton>
                    <RadixButton variant="ghost" size="2">
                      <Edit className="w-4 h-4" />
                    </RadixButton>
                  </Flex>
                </Flex>
              </RadixCard>
            ))}
          </Grid>
        </Tabs.Content>

        {/* Programs Tab */}
        <Tabs.Content value="programs">
          <Grid columns="2" gap="6">
            {mockPrograms.map((program) => (
              <RadixCard
                key={program.id}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <Flex direction="column" gap="4">
                  <Flex justify="between" align="start">
                    <Box className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-purple-600" />
                    </Box>
                    <Badge
                      color={program.status === 'active' ? 'green' : 'gray'}
                    >
                      {program.status}
                    </Badge>
                  </Flex>
                  <Box>
                    <Heading size="4" className="text-gray-900 mb-2">
                      {program.name}
                    </Heading>
                    <Text size="2" className="text-gray-600 mb-4">
                      Duration: {program.duration} • {program.totalCredits}{' '}
                      Total Credits
                    </Text>
                    <Flex justify="between" align="center">
                      <Text size="2" className="text-gray-600">
                        <Users className="w-4 h-4 inline mr-1" />
                        {program.enrolledStudents} enrolled
                      </Text>
                      <RadixButton variant="outline" size="2">
                        View Program
                      </RadixButton>
                    </Flex>
                  </Box>
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
                Enrollment Trends
              </Heading>
              <Box className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <Flex direction="column" align="center" gap="2">
                  <BarChart3 className="w-12 h-12 text-gray-400" />
                  <Text size="2" className="text-gray-600">
                    Chart visualization would go here
                  </Text>
                </Flex>
              </Box>
            </RadixCard>

            <RadixCard className="p-6">
              <Heading size="4" className="mb-4">
                Performance Metrics
              </Heading>
              <Flex direction="column" gap="4">
                <Flex justify="between" align="center">
                  <Text size="2" className="text-gray-600">
                    Average Enrollment Rate
                  </Text>
                  <Text size="2" weight="bold" className="text-green-600">
                    87%
                  </Text>
                </Flex>
                <Flex justify="between" align="center">
                  <Text size="2" className="text-gray-600">
                    Course Completion Rate
                  </Text>
                  <Text size="2" weight="bold" className="text-blue-600">
                    92%
                  </Text>
                </Flex>
                <Flex justify="between" align="center">
                  <Text size="2" className="text-gray-600">
                    Student Satisfaction
                  </Text>
                  <Text size="2" weight="bold" className="text-purple-600">
                    4.5/5
                  </Text>
                </Flex>
                <Flex justify="between" align="center">
                  <Text size="2" className="text-gray-600">
                    Faculty Utilization
                  </Text>
                  <Text size="2" weight="bold" className="text-orange-600">
                    78%
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
