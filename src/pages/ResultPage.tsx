import { useState } from 'react';
import { Box, Flex, Text, Heading, Grid, Badge, Tabs } from '@radix-ui/themes';
import { DashboardLayout } from 'components/layout/DashboardLayout';
import { RadixCard } from 'components/ui/RadixCard';
import { RadixButton } from 'components/ui/RadixButton';
import { PageHeader } from 'components/ui/PageHeader';
import { StatsGrid } from 'components/ui/StatsGrid';
import {
  Trophy,
  Award,
  Star,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  FileText,
  Download,
  Upload,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  MoreHorizontal,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  User,
  GraduationCap,
  BookOpen,
  Target,
  Percent,
  Hash,
} from 'lucide-react';

interface StudentResult {
  id: string;
  studentId: string;
  studentName: string;
  course: string;
  semester: string;
  year: string;
  subjects: Subject[];
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  grade: string;
  gpa: number;
  cgpa: number;
  status: 'pass' | 'fail' | 'pending' | 'published';
  publishedDate?: string;
  remarks?: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  fullMarks: number;
  obtainedMarks: number;
  grade: string;
  gradePoints: number;
  status: 'pass' | 'fail';
  examType: 'theory' | 'practical' | 'both';
}

interface ResultAnalytics {
  totalStudents: number;
  passedStudents: number;
  failedStudents: number;
  passPercentage: number;
  averageGPA: number;
  topPerformers: StudentResult[];
  subjectWiseAnalysis: SubjectAnalysis[];
}

interface SubjectAnalysis {
  subjectName: string;
  subjectCode: string;
  averageMarks: number;
  passRate: number;
  highestMarks: number;
  lowestMarks: number;
}

const mockResults: StudentResult[] = [
  {
    id: '1',
    studentId: 'STU001',
    studentName: 'Alice Johnson',
    course: 'Computer Science',
    semester: 'Fall',
    year: '2024',
    subjects: [
      {
        id: '1',
        name: 'Data Structures',
        code: 'CS201',
        credits: 3,
        fullMarks: 100,
        obtainedMarks: 85,
        grade: 'A',
        gradePoints: 4.0,
        status: 'pass',
        examType: 'both',
      },
      {
        id: '2',
        name: 'Database Systems',
        code: 'CS202',
        credits: 3,
        fullMarks: 100,
        obtainedMarks: 78,
        grade: 'B+',
        gradePoints: 3.5,
        status: 'pass',
        examType: 'both',
      },
    ],
    totalMarks: 600,
    obtainedMarks: 485,
    percentage: 80.83,
    grade: 'A-',
    gpa: 3.75,
    cgpa: 3.68,
    status: 'published',
    publishedDate: '2024-01-15',
  },
  {
    id: '2',
    studentId: 'STU002',
    studentName: 'Bob Smith',
    course: 'Computer Science',
    semester: 'Fall',
    year: '2024',
    subjects: [
      {
        id: '3',
        name: 'Data Structures',
        code: 'CS201',
        credits: 3,
        fullMarks: 100,
        obtainedMarks: 65,
        grade: 'B',
        gradePoints: 3.0,
        status: 'pass',
        examType: 'both',
      },
      {
        id: '4',
        name: 'Database Systems',
        code: 'CS202',
        credits: 3,
        fullMarks: 100,
        obtainedMarks: 72,
        grade: 'B+',
        gradePoints: 3.5,
        status: 'pass',
        examType: 'both',
      },
    ],
    totalMarks: 600,
    obtainedMarks: 411,
    percentage: 68.5,
    grade: 'B',
    gpa: 3.25,
    cgpa: 3.42,
    status: 'published',
    publishedDate: '2024-01-15',
  },
];

const mockAnalytics: ResultAnalytics = {
  totalStudents: 120,
  passedStudents: 105,
  failedStudents: 15,
  passPercentage: 87.5,
  averageGPA: 3.42,
  topPerformers: mockResults.slice(0, 3),
  subjectWiseAnalysis: [
    {
      subjectName: 'Data Structures',
      subjectCode: 'CS201',
      averageMarks: 75.2,
      passRate: 92.5,
      highestMarks: 98,
      lowestMarks: 45,
    },
    {
      subjectName: 'Database Systems',
      subjectCode: 'CS202',
      averageMarks: 78.8,
      passRate: 95.0,
      highestMarks: 96,
      lowestMarks: 52,
    },
  ],
};

const getGradeColor = (grade: string) => {
  switch (grade) {
    case 'A+':
    case 'A':
      return 'green';
    case 'A-':
    case 'B+':
      return 'blue';
    case 'B':
    case 'B-':
      return 'orange';
    case 'C+':
    case 'C':
      return 'yellow';
    default:
      return 'red';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pass':
    case 'published':
      return 'green';
    case 'pending':
      return 'yellow';
    case 'fail':
      return 'red';
    default:
      return 'gray';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pass':
    case 'published':
      return <CheckCircle className="w-4 h-4" />;
    case 'pending':
      return <Clock className="w-4 h-4" />;
    case 'fail':
      return <XCircle className="w-4 h-4" />;
    default:
      return <AlertTriangle className="w-4 h-4" />;
  }
};

export function ResultPage(): JSX.Element {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredResults = mockResults.filter((result) => {
    const matchesSearch =
      result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSemester =
      selectedSemester === 'all' || result.semester === selectedSemester;
    const matchesStatus =
      selectedStatus === 'all' || result.status === selectedStatus;

    return matchesSearch && matchesSemester && matchesStatus;
  });

  const headerActions = [
    {
      label: 'Export Results',
      icon: Download,
      variant: 'outline' as const,
      onClick: () => console.log('Export results'),
    },
    {
      label: 'Add Result',
      icon: Plus,
      isPrimary: true,
      onClick: () => console.log('Add result'),
    },
  ];

  const stats = [
    {
      title: 'Total Students',
      value: mockAnalytics.totalStudents,
      icon: Users,
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-100',
    },
    {
      title: 'Pass Rate',
      value: `${mockAnalytics.passPercentage}%`,
      icon: CheckCircle,
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-100',
    },
    {
      title: 'Average GPA',
      value: mockAnalytics.averageGPA,
      icon: Star,
      iconColor: 'text-purple-600',
      iconBgColor: 'bg-purple-100',
    },
    {
      title: 'Top Performers',
      value: mockAnalytics.topPerformers.length,
      icon: Trophy,
      iconColor: 'text-orange-600',
      iconBgColor: 'bg-orange-100',
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Results"
        description="Manage student results, grades, and academic performance"
        actions={headerActions}
      />

      <StatsGrid stats={stats} />

      <Box className="space-y-6">
        {/* Main Content */}
        <Tabs.Root value={selectedTab} onValueChange={setSelectedTab}>
          <Tabs.List>
            <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
            <Tabs.Trigger value="results">Student Results</Tabs.Trigger>
            <Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
            <Tabs.Trigger value="publish">Publish Results</Tabs.Trigger>
          </Tabs.List>

          <Box className="mt-6">
            <Tabs.Content value="overview">
              <Grid columns="2" gap="6">
                {/* Recent Results */}
                <RadixCard>
                  <Box className="p-6">
                    <Flex justify="between" align="center" className="mb-4">
                      <Heading size="4">Recent Results</Heading>
                      <RadixButton variant="ghost" size="2">
                        <Eye className="w-4 h-4 mr-2" />
                        View All
                      </RadixButton>
                    </Flex>
                    <Box className="space-y-4">
                      {mockResults.slice(0, 5).map((result) => (
                        <Flex
                          key={result.id}
                          justify="between"
                          align="center"
                          className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <Box>
                            <Text
                              weight="medium"
                              className="text-gray-900 dark:text-white"
                            >
                              {result.studentName}
                            </Text>
                            <Text
                              size="2"
                              className="text-gray-600 dark:text-gray-400"
                            >
                              {result.course} • {result.semester} {result.year}
                            </Text>
                          </Box>
                          <Flex align="center" gap="2">
                            <Badge color={getGradeColor(result.grade)}>
                              {result.grade}
                            </Badge>
                            <Text size="2" weight="medium">
                              {result.percentage.toFixed(1)}%
                            </Text>
                          </Flex>
                        </Flex>
                      ))}
                    </Box>
                  </Box>
                </RadixCard>

                {/* Top Performers */}
                <RadixCard>
                  <Box className="p-6">
                    <Flex justify="between" align="center" className="mb-4">
                      <Heading size="4">Top Performers</Heading>
                      <RadixButton variant="ghost" size="2">
                        <Trophy className="w-4 h-4 mr-2" />
                        View All
                      </RadixButton>
                    </Flex>
                    <Box className="space-y-4">
                      {mockAnalytics.topPerformers.map((student, index) => (
                        <Flex
                          key={student.id}
                          align="center"
                          gap="3"
                          className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <Box className="flex-shrink-0">
                            <Box className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                              <Text
                                size="2"
                                weight="bold"
                                className="text-white"
                              >
                                {index + 1}
                              </Text>
                            </Box>
                          </Box>
                          <Box className="flex-1">
                            <Text
                              weight="medium"
                              className="text-gray-900 dark:text-white"
                            >
                              {student.studentName}
                            </Text>
                            <Text
                              size="2"
                              className="text-gray-600 dark:text-gray-400"
                            >
                              GPA: {student.gpa} •{' '}
                              {student.percentage.toFixed(1)}%
                            </Text>
                          </Box>
                          <Badge color={getGradeColor(student.grade)}>
                            {student.grade}
                          </Badge>
                        </Flex>
                      ))}
                    </Box>
                  </Box>
                </RadixCard>
              </Grid>
            </Tabs.Content>

            <Tabs.Content value="results">
              <RadixCard>
                <Box className="p-6">
                  {/* Filters */}
                  <Flex gap="4" className="mb-6">
                    <Box className="flex-1">
                      <input
                        type="text"
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </Box>
                    <select
                      value={selectedSemester}
                      onChange={(e) => setSelectedSemester(e.target.value)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="all">All Semesters</option>
                      <option value="Fall">Fall</option>
                      <option value="Spring">Spring</option>
                      <option value="Summer">Summer</option>
                    </select>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="all">All Status</option>
                      <option value="published">Published</option>
                      <option value="pending">Pending</option>
                      <option value="pass">Pass</option>
                      <option value="fail">Fail</option>
                    </select>
                  </Flex>

                  {/* Results Table */}
                  <Box className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                            Student
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                            Course
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                            Semester
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                            GPA
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                            Percentage
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                            Grade
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                            Status
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredResults.map((result) => (
                          <tr
                            key={result.id}
                            className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <td className="py-3 px-4">
                              <Box>
                                <Text
                                  weight="medium"
                                  className="text-gray-900 dark:text-white"
                                >
                                  {result.studentName}
                                </Text>
                                <Text
                                  size="2"
                                  className="text-gray-600 dark:text-gray-400"
                                >
                                  {result.studentId}
                                </Text>
                              </Box>
                            </td>
                            <td className="py-3 px-4">
                              <Text className="text-gray-900 dark:text-white">
                                {result.course}
                              </Text>
                            </td>
                            <td className="py-3 px-4">
                              <Text className="text-gray-900 dark:text-white">
                                {result.semester} {result.year}
                              </Text>
                            </td>
                            <td className="py-3 px-4">
                              <Text
                                weight="medium"
                                className="text-gray-900 dark:text-white"
                              >
                                {result.gpa}
                              </Text>
                            </td>
                            <td className="py-3 px-4">
                              <Text className="text-gray-900 dark:text-white">
                                {result.percentage.toFixed(1)}%
                              </Text>
                            </td>
                            <td className="py-3 px-4">
                              <Badge color={getGradeColor(result.grade)}>
                                {result.grade}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Flex align="center" gap="2">
                                {getStatusIcon(result.status)}
                                <Badge color={getStatusColor(result.status)}>
                                  {result.status}
                                </Badge>
                              </Flex>
                            </td>
                            <td className="py-3 px-4">
                              <Flex gap="2">
                                <RadixButton variant="ghost" size="2">
                                  <Eye className="w-4 h-4" />
                                </RadixButton>
                                <RadixButton variant="ghost" size="2">
                                  <Edit className="w-4 h-4" />
                                </RadixButton>
                                <RadixButton variant="ghost" size="2">
                                  <MoreHorizontal className="w-4 h-4" />
                                </RadixButton>
                              </Flex>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Box>
                </Box>
              </RadixCard>
            </Tabs.Content>

            <Tabs.Content value="analytics">
              <Grid columns="2" gap="6">
                {/* Subject-wise Analysis */}
                <RadixCard>
                  <Box className="p-6">
                    <Heading size="4" className="mb-4">
                      Subject-wise Performance
                    </Heading>
                    <Box className="space-y-4">
                      {mockAnalytics.subjectWiseAnalysis.map((subject) => (
                        <Box
                          key={subject.subjectCode}
                          className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <Flex
                            justify="between"
                            align="center"
                            className="mb-2"
                          >
                            <Text
                              weight="medium"
                              className="text-gray-900 dark:text-white"
                            >
                              {subject.subjectName}
                            </Text>
                            <Text
                              size="2"
                              className="text-gray-600 dark:text-gray-400"
                            >
                              {subject.subjectCode}
                            </Text>
                          </Flex>
                          <Grid columns="3" gap="4">
                            <Box>
                              <Text
                                size="2"
                                className="text-gray-600 dark:text-gray-400"
                              >
                                Average Marks
                              </Text>
                              <Text
                                weight="medium"
                                className="text-gray-900 dark:text-white"
                              >
                                {subject.averageMarks}
                              </Text>
                            </Box>
                            <Box>
                              <Text
                                size="2"
                                className="text-gray-600 dark:text-gray-400"
                              >
                                Pass Rate
                              </Text>
                              <Text
                                weight="medium"
                                className="text-gray-900 dark:text-white"
                              >
                                {subject.passRate}%
                              </Text>
                            </Box>
                            <Box>
                              <Text
                                size="2"
                                className="text-gray-600 dark:text-gray-400"
                              >
                                Highest
                              </Text>
                              <Text
                                weight="medium"
                                className="text-gray-900 dark:text-white"
                              >
                                {subject.highestMarks}
                              </Text>
                            </Box>
                          </Grid>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </RadixCard>

                {/* Grade Distribution */}
                <RadixCard>
                  <Box className="p-6">
                    <Heading size="4" className="mb-4">
                      Grade Distribution
                    </Heading>
                    <Box className="space-y-3">
                      {[
                        'A+',
                        'A',
                        'A-',
                        'B+',
                        'B',
                        'B-',
                        'C+',
                        'C',
                        'D',
                        'F',
                      ].map((grade) => {
                        const count = mockResults.filter(
                          (r) => r.grade === grade
                        ).length;
                        const percentage = (count / mockResults.length) * 100;

                        return (
                          <Flex key={grade} align="center" gap="3">
                            <Box className="w-8">
                              <Text
                                size="2"
                                weight="medium"
                                className="text-gray-900 dark:text-white"
                              >
                                {grade}
                              </Text>
                            </Box>
                            <Box className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <Box
                                className={`h-2 rounded-full bg-${getGradeColor(grade)}-500`}
                                style={{ width: `${percentage}%` }}
                              />
                            </Box>
                            <Box className="w-12">
                              <Text
                                size="2"
                                className="text-gray-600 dark:text-gray-400"
                              >
                                {count}
                              </Text>
                            </Box>
                          </Flex>
                        );
                      })}
                    </Box>
                  </Box>
                </RadixCard>
              </Grid>
            </Tabs.Content>

            <Tabs.Content value="publish">
              <RadixCard>
                <Box className="p-6">
                  <Heading size="4" className="mb-4">
                    Publish Results
                  </Heading>
                  <Text className="text-gray-600 dark:text-gray-400 mb-6">
                    Select results to publish to students. Once published,
                    students will be able to view their results.
                  </Text>

                  <Box className="space-y-4">
                    <Flex gap="4" className="mb-4">
                      <RadixButton variant="outline">
                        <Upload className="w-4 h-4 mr-2" />
                        Bulk Upload Results
                      </RadixButton>
                      <RadixButton>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Publish Selected
                      </RadixButton>
                    </Flex>

                    <Box className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                      <Flex align="center" gap="2">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        <Text className="text-yellow-800 dark:text-yellow-200">
                          <strong>Note:</strong> Once results are published,
                          they cannot be modified without proper authorization.
                        </Text>
                      </Flex>
                    </Box>

                    <Box className="text-center py-12">
                      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <Text className="text-gray-600 dark:text-gray-400">
                        No pending results to publish
                      </Text>
                    </Box>
                  </Box>
                </Box>
              </RadixCard>
            </Tabs.Content>
          </Box>
        </Tabs.Root>
      </Box>
    </DashboardLayout>
  );
}
