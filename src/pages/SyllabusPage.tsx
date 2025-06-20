import { useState } from 'react';
import { Box, Flex, Text, Heading, Grid, Badge, Tabs } from '@radix-ui/themes';
import { DashboardLayout } from 'components/layout/DashboardLayout';
import { RadixCard } from 'components/ui/RadixCard';
import { RadixButton } from 'components/ui/RadixButton';
import {
  FileText,
  BookOpen,
  Calendar,
  Clock,
  Target,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Edit,
  Share,
  Star,
  CheckCircle,
  AlertCircle,
  User,
  Users,
  BarChart3,
  TrendingUp,
  Globe,
  Trash2,
} from 'lucide-react';

interface SyllabusItem {
  id: string;
  title: string;
  course: string;
  courseCode: string;
  instructor: string;
  semester: string;
  year: string;
  department: string;
  credits: number;
  description: string;
  objectives: string[];
  topics: SyllabusTopic[];
  assessments: Assessment[];
  resources: Resource[];
  prerequisites: string[];
  status: 'draft' | 'published' | 'archived';
  lastUpdated: string;
  version: string;
}

interface SyllabusTopic {
  id: string;
  week: number;
  title: string;
  description: string;
  learningOutcomes: string[];
  readings: string[];
  assignments?: string[];
  duration: number;
}

interface Assessment {
  id: string;
  type: 'exam' | 'assignment' | 'project' | 'quiz' | 'presentation';
  title: string;
  description: string;
  weight: number;
  dueDate: string;
  duration?: number;
}

interface Resource {
  id: string;
  type: 'textbook' | 'article' | 'video' | 'website' | 'software';
  title: string;
  author?: string;
  url?: string;
  required: boolean;
}

const mockSyllabi: SyllabusItem[] = [
  {
    id: '1',
    title: 'Advanced JavaScript Programming',
    course: 'Advanced JavaScript Programming',
    courseCode: 'CS301',
    instructor: 'Dr. Sarah Johnson',
    semester: 'Fall',
    year: '2024',
    department: 'Computer Science',
    credits: 3,
    description:
      'This course covers advanced JavaScript concepts including ES6+, async programming, modern frameworks, and best practices for web development.',
    objectives: [
      'Master ES6+ features and modern JavaScript syntax',
      'Understand asynchronous programming patterns',
      'Build applications using modern JavaScript frameworks',
      'Apply best practices for code organization and testing',
    ],
    topics: [
      {
        id: '1',
        week: 1,
        title: 'ES6+ Features and Modern Syntax',
        description:
          'Introduction to modern JavaScript features including arrow functions, destructuring, and modules',
        learningOutcomes: [
          'Use arrow functions effectively',
          'Apply destructuring patterns',
          'Organize code with modules',
        ],
        readings: [
          'JavaScript: The Definitive Guide - Chapter 8',
          'MDN ES6 Guide',
        ],
        duration: 3,
      },
      {
        id: '2',
        week: 2,
        title: 'Asynchronous Programming',
        description:
          'Promises, async/await, and handling asynchronous operations',
        learningOutcomes: [
          'Understand Promise patterns',
          'Use async/await syntax',
          'Handle errors in async code',
        ],
        readings: ["You Don't Know JS: Async & Performance"],
        assignments: ['Async Programming Exercise'],
        duration: 3,
      },
    ],
    assessments: [
      {
        id: '1',
        type: 'assignment',
        title: 'Modern JavaScript Portfolio',
        description:
          'Build a portfolio website using modern JavaScript features',
        weight: 25,
        dueDate: '2024-02-15',
      },
      {
        id: '2',
        type: 'exam',
        title: 'Midterm Examination',
        description: 'Comprehensive exam covering weeks 1-8',
        weight: 30,
        dueDate: '2024-03-15',
        duration: 120,
      },
    ],
    resources: [
      {
        id: '1',
        type: 'textbook',
        title: 'JavaScript: The Definitive Guide',
        author: 'David Flanagan',
        required: true,
      },
      {
        id: '2',
        type: 'website',
        title: 'MDN Web Docs',
        url: 'https://developer.mozilla.org',
        required: true,
      },
    ],
    prerequisites: [
      'CS201 - Data Structures',
      'CS101 - Programming Fundamentals',
    ],
    status: 'published',
    lastUpdated: '2024-01-10',
    version: '2.1',
  },
  {
    id: '2',
    title: 'Data Structures and Algorithms',
    course: 'Data Structures and Algorithms',
    courseCode: 'CS201',
    instructor: 'Prof. Michael Chen',
    semester: 'Fall',
    year: '2024',
    department: 'Computer Science',
    credits: 4,
    description:
      'Comprehensive study of fundamental data structures and algorithmic problem-solving techniques.',
    objectives: [
      'Understand fundamental data structures',
      'Analyze algorithm complexity',
      'Implement efficient algorithms',
      'Solve complex programming problems',
    ],
    topics: [
      {
        id: '1',
        week: 1,
        title: 'Introduction to Data Structures',
        description:
          'Overview of data structures and their importance in programming',
        learningOutcomes: [
          'Understand data structure concepts',
          'Compare different data structures',
        ],
        readings: ['Introduction to Algorithms - Chapter 1'],
        duration: 4,
      },
    ],
    assessments: [
      {
        id: '1',
        type: 'project',
        title: 'Algorithm Implementation Project',
        description: 'Implement and compare sorting algorithms',
        weight: 35,
        dueDate: '2024-03-01',
      },
    ],
    resources: [
      {
        id: '1',
        type: 'textbook',
        title: 'Introduction to Algorithms',
        author: 'Cormen, Leiserson, Rivest, Stein',
        required: true,
      },
    ],
    prerequisites: ['CS101 - Programming Fundamentals'],
    status: 'published',
    lastUpdated: '2024-01-08',
    version: '1.5',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'published':
      return 'green';
    case 'draft':
      return 'yellow';
    case 'archived':
      return 'gray';
    default:
      return 'gray';
  }
};

const getAssessmentIcon = (type: string) => {
  switch (type) {
    case 'exam':
      return FileText;
    case 'assignment':
      return Edit;
    case 'project':
      return Target;
    case 'quiz':
      return CheckCircle;
    case 'presentation':
      return Users;
    default:
      return FileText;
  }
};

export function SyllabusPage(): JSX.Element {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSyllabus, setSelectedSyllabus] = useState<SyllabusItem | null>(
    mockSyllabi[0]
  );
  const [selectedSemester, setSelectedSemester] = useState('Fall 2024');

  const filteredSyllabi = mockSyllabi.filter(
    (syllabus) =>
      syllabus.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      syllabus.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      syllabus.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSyllabi = mockSyllabi.length;
  const publishedSyllabi = mockSyllabi.filter(
    (s) => s.status === 'published'
  ).length;
  const draftSyllabi = mockSyllabi.filter((s) => s.status === 'draft').length;
  const totalCredits = mockSyllabi.reduce((sum, s) => sum + s.credits, 0);

  return (
    <DashboardLayout>
      {/* Header Section */}
      <Box className="mb-8">
        <Flex justify="between" align="center" className="mb-4">
          <Box>
            <Heading size="7" className="text-gray-900 mb-2">
              Syllabus Management
            </Heading>
            <Text size="4" className="text-gray-600">
              Create, manage, and share comprehensive course syllabi
            </Text>
          </Box>
          <Flex gap="3">
            <RadixButton variant="outline" size="3">
              <Download className="w-4 h-4 mr-2" />
              Export All
            </RadixButton>
            <RadixButton variant="outline" size="3">
              <Upload className="w-4 h-4 mr-2" />
              Import Template
            </RadixButton>
            <RadixButton variant="solid" size="3">
              <Plus className="w-4 h-4 mr-2" />
              Create Syllabus
            </RadixButton>
          </Flex>
        </Flex>

        {/* Quick Stats */}
        <Grid columns="4" gap="4" className="mb-6">
          <RadixCard className="p-4">
            <Flex align="center" gap="3">
              <Box className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </Box>
              <Box>
                <Text size="3" weight="bold" className="text-gray-900">
                  {totalSyllabi}
                </Text>
                <Text size="2" className="text-gray-600">
                  Total Syllabi
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
                  {publishedSyllabi}
                </Text>
                <Text size="2" className="text-gray-600">
                  Published
                </Text>
              </Box>
            </Flex>
          </RadixCard>

          <RadixCard className="p-4">
            <Flex align="center" gap="3">
              <Box className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Edit className="w-6 h-6 text-yellow-600" />
              </Box>
              <Box>
                <Text size="3" weight="bold" className="text-gray-900">
                  {draftSyllabi}
                </Text>
                <Text size="2" className="text-gray-600">
                  Drafts
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
        </Grid>
      </Box>

      {/* Tabs Navigation */}
      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List className="mb-6">
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="syllabi">All Syllabi</Tabs.Trigger>
          <Tabs.Trigger value="view">Syllabus Viewer</Tabs.Trigger>
          <Tabs.Trigger value="templates">Templates</Tabs.Trigger>
        </Tabs.List>

        {/* Overview Tab */}
        <Tabs.Content value="overview">
          <Grid columns="2" gap="6">
            {/* Recent Syllabi */}
            <RadixCard className="p-6">
              <Heading size="4" className="mb-4">
                Recent Updates
              </Heading>
              <Flex direction="column" gap="4">
                {mockSyllabi.slice(0, 3).map((syllabus) => (
                  <Box key={syllabus.id} className="p-4 bg-gray-50 rounded-lg">
                    <Flex justify="between" align="start" className="mb-2">
                      <Box>
                        <Text
                          size="3"
                          weight="medium"
                          className="text-gray-900"
                        >
                          {syllabus.title}
                        </Text>
                        <Text size="2" className="text-gray-600">
                          {syllabus.courseCode} • {syllabus.instructor}
                        </Text>
                      </Box>
                      <Badge color={getStatusColor(syllabus.status)}>
                        {syllabus.status}
                      </Badge>
                    </Flex>
                    <Flex justify="between" align="center">
                      <Text size="2" className="text-gray-600">
                        Updated:{' '}
                        {new Date(syllabus.lastUpdated).toLocaleDateString()}
                      </Text>
                      <RadixButton
                        variant="ghost"
                        size="1"
                        onClick={() => setSelectedSyllabus(syllabus)}
                      >
                        <Eye className="w-4 h-4" />
                      </RadixButton>
                    </Flex>
                  </Box>
                ))}
              </Flex>
            </RadixCard>

            {/* Syllabus Statistics */}
            <RadixCard className="p-6">
              <Heading size="4" className="mb-4">
                Department Overview
              </Heading>
              <Flex direction="column" gap="4">
                <Flex
                  justify="between"
                  align="center"
                  className="p-3 bg-blue-50 rounded-lg"
                >
                  <Box>
                    <Text size="2" weight="medium" className="text-blue-800">
                      Computer Science
                    </Text>
                    <Text size="1" className="text-blue-600">
                      2 courses
                    </Text>
                  </Box>
                  <Text size="2" weight="bold" className="text-blue-600">
                    7 credits
                  </Text>
                </Flex>

                <Flex
                  justify="between"
                  align="center"
                  className="p-3 bg-green-50 rounded-lg"
                >
                  <Box>
                    <Text size="2" weight="medium" className="text-green-800">
                      Mathematics
                    </Text>
                    <Text size="1" className="text-green-600">
                      0 courses
                    </Text>
                  </Box>
                  <Text size="2" weight="bold" className="text-green-600">
                    0 credits
                  </Text>
                </Flex>

                <Flex
                  justify="between"
                  align="center"
                  className="p-3 bg-purple-50 rounded-lg"
                >
                  <Box>
                    <Text size="2" weight="medium" className="text-purple-800">
                      Physics
                    </Text>
                    <Text size="1" className="text-purple-600">
                      0 courses
                    </Text>
                  </Box>
                  <Text size="2" weight="bold" className="text-purple-600">
                    0 credits
                  </Text>
                </Flex>
              </Flex>
            </RadixCard>

            {/* Upcoming Deadlines */}
            <RadixCard className="p-6">
              <Heading size="4" className="mb-4">
                Upcoming Deadlines
              </Heading>
              <Flex direction="column" gap="3">
                <Flex
                  justify="between"
                  align="center"
                  className="p-3 border-l-4 border-red-400 bg-red-50 rounded-r-lg"
                >
                  <Box>
                    <Text size="2" weight="medium" className="text-red-800">
                      Syllabus Review Deadline
                    </Text>
                    <Text size="1" className="text-red-600">
                      All departments
                    </Text>
                  </Box>
                  <Badge color="red">2 days left</Badge>
                </Flex>

                <Flex
                  justify="between"
                  align="center"
                  className="p-3 border-l-4 border-yellow-400 bg-yellow-50 rounded-r-lg"
                >
                  <Box>
                    <Text size="2" weight="medium" className="text-yellow-800">
                      Spring Syllabus Submission
                    </Text>
                    <Text size="1" className="text-yellow-600">
                      Next semester preparation
                    </Text>
                  </Box>
                  <Badge color="yellow">1 week left</Badge>
                </Flex>
              </Flex>
            </RadixCard>

            {/* Quick Actions */}
            <RadixCard className="p-6">
              <Heading size="4" className="mb-4">
                Quick Actions
              </Heading>
              <Flex direction="column" gap="3">
                <RadixButton
                  variant="outline"
                  size="3"
                  className="justify-start"
                >
                  <Plus className="w-4 h-4 mr-3" />
                  Create New Syllabus
                </RadixButton>
                <RadixButton
                  variant="outline"
                  size="3"
                  className="justify-start"
                >
                  <Upload className="w-4 h-4 mr-3" />
                  Import from Template
                </RadixButton>
                <RadixButton
                  variant="outline"
                  size="3"
                  className="justify-start"
                >
                  <Share className="w-4 h-4 mr-3" />
                  Share with Department
                </RadixButton>
                <RadixButton
                  variant="outline"
                  size="3"
                  className="justify-start"
                >
                  <Download className="w-4 h-4 mr-3" />
                  Export All Syllabi
                </RadixButton>
              </Flex>
            </RadixCard>
          </Grid>
        </Tabs.Content>

        {/* All Syllabi Tab */}
        <Tabs.Content value="syllabi">
          {/* Search and Filter */}
          <Flex justify="between" align="center" className="mb-6">
            <Flex gap="3" align="center">
              <Box className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search syllabi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </Box>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Fall 2024">Fall 2024</option>
                <option value="Spring 2024">Spring 2024</option>
                <option value="Summer 2024">Summer 2024</option>
              </select>
            </Flex>
          </Flex>

          {/* Syllabi Grid */}
          <Grid columns="2" gap="6">
            {filteredSyllabi.map((syllabus) => (
              <RadixCard
                key={syllabus.id}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <Flex direction="column" gap="4">
                  <Flex justify="between" align="start">
                    <Box className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </Box>
                    <Badge color={getStatusColor(syllabus.status)}>
                      {syllabus.status}
                    </Badge>
                  </Flex>

                  <Box>
                    <Heading size="4" className="text-gray-900 mb-2">
                      {syllabus.title}
                    </Heading>
                    <Text size="2" className="text-gray-600 mb-2">
                      {syllabus.courseCode} • {syllabus.credits} Credits
                    </Text>
                    <Text size="2" className="text-gray-600 mb-3">
                      {syllabus.instructor} • {syllabus.department}
                    </Text>
                    <Text size="2" className="text-gray-600 mb-3 line-clamp-2">
                      {syllabus.description}
                    </Text>
                  </Box>

                  <Flex justify="between" align="center">
                    <Text size="2" className="text-gray-600">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      {syllabus.semester} {syllabus.year}
                    </Text>
                    <Text size="2" className="text-gray-600">
                      v{syllabus.version}
                    </Text>
                  </Flex>

                  <Flex gap="2">
                    <RadixButton
                      variant="solid"
                      size="2"
                      className="flex-1"
                      onClick={() => {
                        setSelectedSyllabus(syllabus);
                        setActiveTab('view');
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </RadixButton>
                    <RadixButton variant="outline" size="2">
                      <Edit className="w-4 h-4" />
                    </RadixButton>
                    <RadixButton variant="outline" size="2">
                      <Share className="w-4 h-4" />
                    </RadixButton>
                  </Flex>
                </Flex>
              </RadixCard>
            ))}
          </Grid>
        </Tabs.Content>

        {/* Syllabus Viewer Tab */}
        <Tabs.Content value="view">
          {selectedSyllabus ? (
            <Box>
              {/* Syllabus Header */}
              <RadixCard className="p-6 mb-6">
                <Flex justify="between" align="start" className="mb-4">
                  <Box>
                    <Heading size="6" className="text-gray-900 mb-2">
                      {selectedSyllabus.title}
                    </Heading>
                    <Text size="3" className="text-gray-600 mb-2">
                      {selectedSyllabus.courseCode} • {selectedSyllabus.credits}{' '}
                      Credit Hours
                    </Text>
                    <Text size="3" className="text-gray-600">
                      {selectedSyllabus.instructor} •{' '}
                      {selectedSyllabus.department}
                    </Text>
                  </Box>
                  <Flex gap="2">
                    <RadixButton variant="outline" size="2">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </RadixButton>
                    <RadixButton variant="outline" size="2">
                      <Share className="w-4 h-4 mr-2" />
                      Share
                    </RadixButton>
                    <RadixButton variant="outline" size="2">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </RadixButton>
                  </Flex>
                </Flex>

                <Text size="3" className="text-gray-700 leading-relaxed">
                  {selectedSyllabus.description}
                </Text>
              </RadixCard>

              <Grid columns="3" gap="6">
                {/* Course Information */}
                <Box className="col-span-2">
                  {/* Learning Objectives */}
                  <RadixCard className="p-6 mb-6">
                    <Heading size="4" className="mb-4">
                      Learning Objectives
                    </Heading>
                    <Flex direction="column" gap="2">
                      {selectedSyllabus.objectives.map((objective, index) => (
                        <Flex key={index} align="start" gap="2">
                          <Target className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                          <Text size="2" className="text-gray-700">
                            {objective}
                          </Text>
                        </Flex>
                      ))}
                    </Flex>
                  </RadixCard>

                  {/* Course Topics */}
                  <RadixCard className="p-6 mb-6">
                    <Heading size="4" className="mb-4">
                      Course Topics
                    </Heading>
                    <Flex direction="column" gap="4">
                      {selectedSyllabus.topics.map((topic) => (
                        <Box
                          key={topic.id}
                          className="p-4 border border-gray-200 rounded-lg"
                        >
                          <Flex
                            justify="between"
                            align="start"
                            className="mb-2"
                          >
                            <Box>
                              <Text
                                size="3"
                                weight="medium"
                                className="text-gray-900"
                              >
                                Week {topic.week}: {topic.title}
                              </Text>
                              <Text size="2" className="text-gray-600 mt-1">
                                {topic.description}
                              </Text>
                            </Box>
                            <Badge color="blue">{topic.duration}h</Badge>
                          </Flex>

                          {topic.learningOutcomes.length > 0 && (
                            <Box className="mt-3">
                              <Text
                                size="2"
                                weight="medium"
                                className="text-gray-700 mb-1"
                              >
                                Learning Outcomes:
                              </Text>
                              <Flex direction="column" gap="1">
                                {topic.learningOutcomes.map(
                                  (outcome, index) => (
                                    <Text
                                      key={index}
                                      size="2"
                                      className="text-gray-600"
                                    >
                                      • {outcome}
                                    </Text>
                                  )
                                )}
                              </Flex>
                            </Box>
                          )}

                          {topic.readings.length > 0 && (
                            <Box className="mt-3">
                              <Text
                                size="2"
                                weight="medium"
                                className="text-gray-700 mb-1"
                              >
                                Required Readings:
                              </Text>
                              <Flex direction="column" gap="1">
                                {topic.readings.map((reading, index) => (
                                  <Text
                                    key={index}
                                    size="2"
                                    className="text-gray-600"
                                  >
                                    • {reading}
                                  </Text>
                                ))}
                              </Flex>
                            </Box>
                          )}
                        </Box>
                      ))}
                    </Flex>
                  </RadixCard>

                  {/* Assessments */}
                  <RadixCard className="p-6">
                    <Heading size="4" className="mb-4">
                      Assessments
                    </Heading>
                    <Flex direction="column" gap="4">
                      {selectedSyllabus.assessments.map((assessment) => {
                        const AssessmentIcon = getAssessmentIcon(
                          assessment.type
                        );
                        return (
                          <Box
                            key={assessment.id}
                            className="p-4 border border-gray-200 rounded-lg"
                          >
                            <Flex
                              justify="between"
                              align="start"
                              className="mb-2"
                            >
                              <Flex align="center" gap="3">
                                <Box className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                  <AssessmentIcon className="w-5 h-5 text-purple-600" />
                                </Box>
                                <Box>
                                  <Text
                                    size="3"
                                    weight="medium"
                                    className="text-gray-900"
                                  >
                                    {assessment.title}
                                  </Text>
                                  <Text size="2" className="text-gray-600">
                                    {assessment.description}
                                  </Text>
                                </Box>
                              </Flex>
                              <Badge color="purple">{assessment.weight}%</Badge>
                            </Flex>
                            <Flex gap="4" className="mt-2">
                              <Text size="2" className="text-gray-600">
                                <Calendar className="w-4 h-4 inline mr-1" />
                                Due:{' '}
                                {new Date(
                                  assessment.dueDate
                                ).toLocaleDateString()}
                              </Text>
                              {assessment.duration && (
                                <Text size="2" className="text-gray-600">
                                  <Clock className="w-4 h-4 inline mr-1" />
                                  {assessment.duration} minutes
                                </Text>
                              )}
                            </Flex>
                          </Box>
                        );
                      })}
                    </Flex>
                  </RadixCard>
                </Box>

                {/* Sidebar Information */}
                <Box>
                  {/* Course Details */}
                  <RadixCard className="p-6 mb-6">
                    <Heading size="4" className="mb-4">
                      Course Details
                    </Heading>
                    <Flex direction="column" gap="3">
                      <Box>
                        <Text
                          size="2"
                          weight="medium"
                          className="text-gray-700"
                        >
                          Semester
                        </Text>
                        <Text size="2" className="text-gray-600">
                          {selectedSyllabus.semester} {selectedSyllabus.year}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          size="2"
                          weight="medium"
                          className="text-gray-700"
                        >
                          Department
                        </Text>
                        <Text size="2" className="text-gray-600">
                          {selectedSyllabus.department}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          size="2"
                          weight="medium"
                          className="text-gray-700"
                        >
                          Credits
                        </Text>
                        <Text size="2" className="text-gray-600">
                          {selectedSyllabus.credits}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          size="2"
                          weight="medium"
                          className="text-gray-700"
                        >
                          Version
                        </Text>
                        <Text size="2" className="text-gray-600">
                          v{selectedSyllabus.version}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          size="2"
                          weight="medium"
                          className="text-gray-700"
                        >
                          Last Updated
                        </Text>
                        <Text size="2" className="text-gray-600">
                          {new Date(
                            selectedSyllabus.lastUpdated
                          ).toLocaleDateString()}
                        </Text>
                      </Box>
                    </Flex>
                  </RadixCard>

                  {/* Prerequisites */}
                  {selectedSyllabus.prerequisites.length > 0 && (
                    <RadixCard className="p-6 mb-6">
                      <Heading size="4" className="mb-4">
                        Prerequisites
                      </Heading>
                      <Flex direction="column" gap="2">
                        {selectedSyllabus.prerequisites.map((prereq, index) => (
                          <Text key={index} size="2" className="text-gray-600">
                            • {prereq}
                          </Text>
                        ))}
                      </Flex>
                    </RadixCard>
                  )}

                  {/* Resources */}
                  <RadixCard className="p-6">
                    <Heading size="4" className="mb-4">
                      Required Resources
                    </Heading>
                    <Flex direction="column" gap="3">
                      {selectedSyllabus.resources.map((resource) => (
                        <Box
                          key={resource.id}
                          className="p-3 bg-gray-50 rounded-lg"
                        >
                          <Flex
                            justify="between"
                            align="start"
                            className="mb-1"
                          >
                            <Text
                              size="2"
                              weight="medium"
                              className="text-gray-900"
                            >
                              {resource.title}
                            </Text>
                            {resource.required && (
                              <Badge color="red" size="1">
                                Required
                              </Badge>
                            )}
                          </Flex>
                          {resource.author && (
                            <Text size="2" className="text-gray-600">
                              by {resource.author}
                            </Text>
                          )}
                          <Badge color="gray" size="1" className="mt-1">
                            {resource.type}
                          </Badge>
                        </Box>
                      ))}
                    </Flex>
                  </RadixCard>
                </Box>
              </Grid>
            </Box>
          ) : (
            <RadixCard className="p-12 text-center">
              <Flex direction="column" align="center" gap="4">
                <Box className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <FileText className="w-8 h-8 text-gray-400" />
                </Box>
                <Box>
                  <Heading size="4" className="text-gray-900 mb-2">
                    No Syllabus Selected
                  </Heading>
                  <Text size="3" className="text-gray-600">
                    Select a syllabus from the list to view its details
                  </Text>
                </Box>
              </Flex>
            </RadixCard>
          )}
        </Tabs.Content>

        {/* Templates Tab */}
        <Tabs.Content value="templates">
          <Grid columns="3" gap="6">
            {/* Template cards would go here */}
            <RadixCard className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <Flex direction="column" gap="4">
                <Box className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </Box>
                <Box>
                  <Heading size="4" className="text-gray-900 mb-2">
                    Computer Science Template
                  </Heading>
                  <Text size="2" className="text-gray-600 mb-3">
                    Standard template for CS courses with programming
                    assignments
                  </Text>
                  <Badge color="blue">Most Popular</Badge>
                </Box>
                <RadixButton variant="outline" size="2">
                  Use Template
                </RadixButton>
              </Flex>
            </RadixCard>

            <RadixCard className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <Flex direction="column" gap="4">
                <Box className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </Box>
                <Box>
                  <Heading size="4" className="text-gray-900 mb-2">
                    Mathematics Template
                  </Heading>
                  <Text size="2" className="text-gray-600 mb-3">
                    Template for math courses with problem sets and exams
                  </Text>
                  <Badge color="green">New</Badge>
                </Box>
                <RadixButton variant="outline" size="2">
                  Use Template
                </RadixButton>
              </Flex>
            </RadixCard>

            <RadixCard className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <Flex direction="column" gap="4">
                <Box className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </Box>
                <Box>
                  <Heading size="4" className="text-gray-900 mb-2">
                    Seminar Template
                  </Heading>
                  <Text size="2" className="text-gray-600 mb-3">
                    Template for discussion-based courses and seminars
                  </Text>
                  <Badge color="purple">Updated</Badge>
                </Box>
                <RadixButton variant="outline" size="2">
                  Use Template
                </RadixButton>
              </Flex>
            </RadixCard>
          </Grid>
        </Tabs.Content>
      </Tabs.Root>
    </DashboardLayout>
  );
}
