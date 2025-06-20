import { useState } from 'react';
import { Box, Flex, Text, Heading, Grid, Badge, Tabs } from '@radix-ui/themes';
import { DashboardLayout } from 'components/layout/DashboardLayout';
import { RadixCard } from 'components/ui/RadixCard';
import { RadixButton } from 'components/ui/RadixButton';
import {
  UserPlus,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Download,
  Upload,
  Plus,
  Search,
  User,
  GraduationCap,
  TrendingUp,
  BarChart3,
  Mail,
  Phone,
  Send,
  MessageSquare,
} from 'lucide-react';

interface Application {
  id: string;
  applicationNumber: string;
  studentName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  program: string;
  department: string;
  academicYear: string;
  submissionDate: string;
  status:
    | 'submitted'
    | 'under_review'
    | 'interview_scheduled'
    | 'accepted'
    | 'rejected'
    | 'waitlisted';
  priority: 'high' | 'medium' | 'low';
  documents: Document[];
  scores: AcademicScore;
  interviewDate?: string;
  interviewScore?: number;
  notes?: string;
  reviewedBy?: string;
  decisionDate?: string;
}

interface Document {
  id: string;
  name: string;
  type:
    | 'transcript'
    | 'essay'
    | 'recommendation'
    | 'certificate'
    | 'id_proof'
    | 'other';
  status: 'pending' | 'submitted' | 'verified' | 'rejected';
  uploadDate: string;
  fileSize: string;
  url: string;
}

interface AcademicScore {
  gpa: number;
  satScore?: number;
  actScore?: number;
  toeflScore?: number;
  ieltsScore?: number;
  gmatScore?: number;
  greScore?: number;
}

interface AdmissionProgram {
  id: string;
  name: string;
  department: string;
  degree: 'undergraduate' | 'graduate' | 'doctorate';
  duration: string;
  capacity: number;
  applicants: number;
  accepted: number;
  requirements: string[];
  deadline: string;
  tuitionFee: number;
  description: string;
}

const mockApplications: Application[] = [
  {
    id: '1',
    applicationNumber: 'APP2024001',
    studentName: 'Emily Chen',
    email: 'emily.chen@email.com',
    phone: '+1-555-0123',
    address: '123 Main St, City, State 12345',
    dateOfBirth: '2000-05-15',
    program: 'Bachelor of Science in Computer Science',
    department: 'Computer Science',
    academicYear: '2024-2025',
    submissionDate: '2024-01-10',
    status: 'under_review',
    priority: 'high',
    documents: [
      {
        id: '1',
        name: 'High School Transcript',
        type: 'transcript',
        status: 'verified',
        uploadDate: '2024-01-10',
        fileSize: '2.3 MB',
        url: '/documents/transcript.pdf',
      },
      {
        id: '2',
        name: 'Personal Statement',
        type: 'essay',
        status: 'submitted',
        uploadDate: '2024-01-10',
        fileSize: '1.1 MB',
        url: '/documents/essay.pdf',
      },
    ],
    scores: {
      gpa: 3.85,
      satScore: 1450,
      toeflScore: 105,
    },
    notes:
      'Strong academic background in STEM subjects. Excellent extracurricular activities.',
    reviewedBy: 'Dr. Sarah Johnson',
  },
  {
    id: '2',
    applicationNumber: 'APP2024002',
    studentName: 'Michael Rodriguez',
    email: 'michael.rodriguez@email.com',
    phone: '+1-555-0124',
    address: '456 Oak Ave, City, State 12345',
    dateOfBirth: '1999-12-03',
    program: 'Master of Business Administration',
    department: 'Business',
    academicYear: '2024-2025',
    submissionDate: '2024-01-08',
    status: 'interview_scheduled',
    priority: 'medium',
    documents: [
      {
        id: '3',
        name: 'Bachelor Degree Transcript',
        type: 'transcript',
        status: 'verified',
        uploadDate: '2024-01-08',
        fileSize: '1.8 MB',
        url: '/documents/transcript2.pdf',
      },
    ],
    scores: {
      gpa: 3.7,
      gmatScore: 680,
    },
    interviewDate: '2024-01-20',
    notes: 'Good work experience in finance sector.',
    reviewedBy: 'Prof. David Wilson',
  },
  {
    id: '3',
    applicationNumber: 'APP2024003',
    studentName: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1-555-0125',
    address: '789 Pine St, City, State 12345',
    dateOfBirth: '2001-03-22',
    program: 'Bachelor of Arts in Psychology',
    department: 'Psychology',
    academicYear: '2024-2025',
    submissionDate: '2024-01-12',
    status: 'accepted',
    priority: 'high',
    documents: [
      {
        id: '4',
        name: 'High School Transcript',
        type: 'transcript',
        status: 'verified',
        uploadDate: '2024-01-12',
        fileSize: '2.1 MB',
        url: '/documents/transcript3.pdf',
      },
    ],
    scores: {
      gpa: 3.95,
      satScore: 1520,
    },
    decisionDate: '2024-01-15',
    notes: 'Outstanding academic performance and leadership qualities.',
    reviewedBy: 'Dr. Lisa Thompson',
  },
];

const mockPrograms: AdmissionProgram[] = [
  {
    id: '1',
    name: 'Bachelor of Science in Computer Science',
    department: 'Computer Science',
    degree: 'undergraduate',
    duration: '4 years',
    capacity: 100,
    applicants: 245,
    accepted: 85,
    requirements: [
      'High School Diploma',
      'SAT/ACT Scores',
      'Personal Statement',
      'Letters of Recommendation',
    ],
    deadline: '2024-03-01',
    tuitionFee: 25000,
    description:
      'Comprehensive computer science program covering software development, algorithms, and emerging technologies.',
  },
  {
    id: '2',
    name: 'Master of Business Administration',
    department: 'Business',
    degree: 'graduate',
    duration: '2 years',
    capacity: 50,
    applicants: 156,
    accepted: 42,
    requirements: [
      'Bachelor Degree',
      'GMAT/GRE Scores',
      'Work Experience',
      'Essays',
      'Interview',
    ],
    deadline: '2024-02-15',
    tuitionFee: 45000,
    description:
      'Advanced business education focusing on leadership, strategy, and entrepreneurship.',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'accepted':
      return 'green';
    case 'rejected':
      return 'red';
    case 'under_review':
      return 'yellow';
    case 'interview_scheduled':
      return 'blue';
    case 'waitlisted':
      return 'purple';
    case 'submitted':
      return 'gray';
    default:
      return 'gray';
  }
};

// const getStatusIcon = (status: string) => {
//   switch (status) {
//     case 'accepted': return CheckCircle;
//     case 'rejected': return XCircle;
//     case 'under_review': return Clock;
//     case 'interview_scheduled': return Calendar;
//     case 'waitlisted': return AlertTriangle;
//     case 'submitted': return FileText;
//     default: return FileText;
//   }
// };

// const getDocumentIcon = (type: string) => {
//   switch (type) {
//     case 'transcript': return FileText;
//     case 'essay': return Edit;
//     case 'recommendation': return Star;
//     case 'certificate': return Award;
//     case 'id_proof': return User;
//     default: return Paperclip;
//   }
// };

export function AdmissionPage(): JSX.Element {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedProgram, setSelectedProgram] = useState('all');
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);

  const filteredApplications = mockApplications.filter((app) => {
    const matchesSearch =
      app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === 'all' || app.status === selectedStatus;
    const matchesProgram =
      selectedProgram === 'all' || app.program === selectedProgram;
    return matchesSearch && matchesStatus && matchesProgram;
  });

  const totalApplications = mockApplications.length;
  const acceptedApplications = mockApplications.filter(
    (a) => a.status === 'accepted'
  ).length;
  const pendingReview = mockApplications.filter(
    (a) => a.status === 'under_review'
  ).length;
  const interviewsScheduled = mockApplications.filter(
    (a) => a.status === 'interview_scheduled'
  ).length;
  const acceptanceRate =
    totalApplications > 0
      ? Math.round((acceptedApplications / totalApplications) * 100)
      : 0;

  return (
    <DashboardLayout>
      {/* Header Section */}
      <Box className="mb-8">
        <Flex justify="between" align="center" className="mb-4">
          <Box>
            <Heading size="7" className="text-gray-900 mb-2">
              Admission Management
            </Heading>
            <Text size="4" className="text-gray-600">
              Streamline application processing and student enrollment
            </Text>
          </Box>
          <Flex gap="3">
            <RadixButton variant="outline" size="3">
              <Download className="w-4 h-4 mr-2" />
              Export Applications
            </RadixButton>
            <RadixButton variant="outline" size="3">
              <Upload className="w-4 h-4 mr-2" />
              Bulk Import
            </RadixButton>
            <RadixButton variant="solid" size="3">
              <Plus className="w-4 h-4 mr-2" />
              New Application
            </RadixButton>
          </Flex>
        </Flex>

        {/* Quick Stats */}
        <Grid columns="4" gap="4" className="mb-6">
          <RadixCard className="p-4">
            <Flex align="center" gap="3">
              <Box className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-blue-600" />
              </Box>
              <Box>
                <Text size="3" weight="bold" className="text-gray-900">
                  {totalApplications}
                </Text>
                <Text size="2" className="text-gray-600">
                  Total Applications
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
                  {acceptedApplications}
                </Text>
                <Text size="2" className="text-gray-600">
                  Accepted
                </Text>
              </Box>
            </Flex>
          </RadixCard>

          <RadixCard className="p-4">
            <Flex align="center" gap="3">
              <Box className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </Box>
              <Box>
                <Text size="3" weight="bold" className="text-gray-900">
                  {pendingReview}
                </Text>
                <Text size="2" className="text-gray-600">
                  Under Review
                </Text>
              </Box>
            </Flex>
          </RadixCard>

          <RadixCard className="p-4">
            <Flex align="center" gap="3">
              <Box className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </Box>
              <Box>
                <Text size="3" weight="bold" className="text-gray-900">
                  {acceptanceRate}%
                </Text>
                <Text size="2" className="text-gray-600">
                  Acceptance Rate
                </Text>
              </Box>
            </Flex>
          </RadixCard>
        </Grid>

        {/* Urgent Actions */}
        <Grid columns="3" gap="4" className="mb-6">
          <RadixCard className="p-4 bg-red-50 border-l-4 border-red-400">
            <Flex justify="between" align="center">
              <Box>
                <Text size="3" weight="bold" className="text-red-800">
                  Application Deadline Approaching
                </Text>
                <Text size="2" className="text-red-600">
                  Spring 2024 applications due in 5 days
                </Text>
              </Box>
              <RadixButton variant="solid" size="2" className="bg-red-600">
                <Calendar className="w-4 h-4 mr-2" />
                Review
              </RadixButton>
            </Flex>
          </RadixCard>

          <RadixCard className="p-4 bg-blue-50 border-l-4 border-blue-400">
            <Flex justify="between" align="center">
              <Box>
                <Text size="3" weight="bold" className="text-blue-800">
                  Interviews Scheduled
                </Text>
                <Text size="2" className="text-blue-600">
                  {interviewsScheduled} interviews this week
                </Text>
              </Box>
              <RadixButton variant="solid" size="2" className="bg-blue-600">
                <Eye className="w-4 h-4 mr-2" />
                View
              </RadixButton>
            </Flex>
          </RadixCard>

          <RadixCard className="p-4 bg-green-50 border-l-4 border-green-400">
            <Flex justify="between" align="center">
              <Box>
                <Text size="3" weight="bold" className="text-green-800">
                  Admission Letters Ready
                </Text>
                <Text size="2" className="text-green-600">
                  {acceptedApplications} acceptance letters to send
                </Text>
              </Box>
              <RadixButton variant="solid" size="2" className="bg-green-600">
                <Send className="w-4 h-4 mr-2" />
                Send
              </RadixButton>
            </Flex>
          </RadixCard>
        </Grid>
      </Box>

      {/* Tabs Navigation */}
      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List className="mb-6">
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="applications">Applications</Tabs.Trigger>
          <Tabs.Trigger value="programs">Programs</Tabs.Trigger>
          <Tabs.Trigger value="interviews">Interviews</Tabs.Trigger>
          <Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
        </Tabs.List>

        {/* Overview Tab */}
        <Tabs.Content value="overview">
          <Grid columns="2" gap="6">
            {/* Recent Applications */}
            <RadixCard className="p-6">
              <Heading size="4" className="mb-4">
                Recent Applications
              </Heading>
              <Flex direction="column" gap="4">
                {mockApplications.slice(0, 5).map((app) => {
                  // const StatusIcon = getStatusIcon(app.status);
                  return (
                    <Box key={app.id} className="p-4 bg-gray-50 rounded-lg">
                      <Flex justify="between" align="start" className="mb-2">
                        <Box>
                          <Text
                            size="3"
                            weight="medium"
                            className="text-gray-900"
                          >
                            {app.studentName}
                          </Text>
                          <Text size="2" className="text-gray-600">
                            {app.applicationNumber} • {app.program}
                          </Text>
                        </Box>
                        <Badge color={getStatusColor(app.status)}>
                          {app.status.replace('_', ' ')}
                        </Badge>
                      </Flex>
                      <Flex justify="between" align="center">
                        <Text size="2" className="text-gray-600">
                          GPA: {app.scores.gpa} • Submitted:{' '}
                          {new Date(app.submissionDate).toLocaleDateString()}
                        </Text>
                        <RadixButton
                          variant="ghost"
                          size="1"
                          onClick={() => setSelectedApplication(app)}
                        >
                          <Eye className="w-4 h-4" />
                        </RadixButton>
                      </Flex>
                    </Box>
                  );
                })}
              </Flex>
            </RadixCard>

            {/* Application Status Distribution */}
            <RadixCard className="p-6">
              <Heading size="4" className="mb-4">
                Application Status
              </Heading>
              <Flex direction="column" gap="3">
                <Flex justify="between" align="center">
                  <Flex align="center" gap="2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <Text size="2" className="text-gray-600">
                      Accepted
                    </Text>
                  </Flex>
                  <Text size="2" weight="medium">
                    {acceptedApplications}
                  </Text>
                </Flex>
                <Flex justify="between" align="center">
                  <Flex align="center" gap="2">
                    <Clock className="w-4 h-4 text-yellow-600" />
                    <Text size="2" className="text-gray-600">
                      Under Review
                    </Text>
                  </Flex>
                  <Text size="2" weight="medium">
                    {pendingReview}
                  </Text>
                </Flex>
                <Flex justify="between" align="center">
                  <Flex align="center" gap="2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <Text size="2" className="text-gray-600">
                      Interview Scheduled
                    </Text>
                  </Flex>
                  <Text size="2" weight="medium">
                    {interviewsScheduled}
                  </Text>
                </Flex>
                <Flex justify="between" align="center">
                  <Flex align="center" gap="2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <Text size="2" className="text-gray-600">
                      Rejected
                    </Text>
                  </Flex>
                  <Text size="2" weight="medium">
                    0
                  </Text>
                </Flex>
              </Flex>
            </RadixCard>

            {/* Program Popularity */}
            <RadixCard className="p-6">
              <Heading size="4" className="mb-4">
                Popular Programs
              </Heading>
              <Flex direction="column" gap="3">
                {mockPrograms.map((program, index) => (
                  <Flex
                    key={program.id}
                    justify="between"
                    align="center"
                    className="p-3 bg-gray-50 rounded-lg"
                  >
                    <Box>
                      <Text size="2" weight="medium" className="line-clamp-1">
                        {program.name}
                      </Text>
                      <Text size="1" className="text-gray-600">
                        {program.applicants} applicants • {program.accepted}{' '}
                        accepted
                      </Text>
                    </Box>
                    <Badge color={index === 0 ? 'gold' : 'gray'}>
                      #{index + 1}
                    </Badge>
                  </Flex>
                ))}
              </Flex>
            </RadixCard>

            {/* Upcoming Deadlines */}
            <RadixCard className="p-6">
              <Heading size="4" className="mb-4">
                Upcoming Deadlines
              </Heading>
              <Flex direction="column" gap="3">
                {mockPrograms.map((program) => (
                  <Flex
                    key={program.id}
                    justify="between"
                    align="center"
                    className="p-3 border-l-4 border-orange-400 bg-orange-50 rounded-r-lg"
                  >
                    <Box>
                      <Text
                        size="2"
                        weight="medium"
                        className="text-orange-800"
                      >
                        {program.name}
                      </Text>
                      <Text size="1" className="text-orange-600">
                        Application Deadline
                      </Text>
                    </Box>
                    <Text size="2" weight="bold" className="text-orange-600">
                      {new Date(program.deadline).toLocaleDateString()}
                    </Text>
                  </Flex>
                ))}
              </Flex>
            </RadixCard>
          </Grid>
        </Tabs.Content>

        {/* Applications Tab */}
        <Tabs.Content value="applications">
          {/* Search and Filter */}
          <Flex justify="between" align="center" className="mb-6">
            <Flex gap="3" align="center">
              <Box className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </Box>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="interview_scheduled">Interview Scheduled</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="waitlisted">Waitlisted</option>
              </select>
              <select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Programs</option>
                {mockPrograms.map((program) => (
                  <option key={program.id} value={program.name}>
                    {program.name}
                  </option>
                ))}
              </select>
            </Flex>
          </Flex>

          {/* Applications List */}
          <Grid columns="1" gap="4">
            {filteredApplications.map((app) => {
              // const StatusIcon = getStatusIcon(app.status);
              return (
                <RadixCard
                  key={app.id}
                  className="p-6 hover:shadow-lg transition-shadow"
                >
                  <Flex justify="between" align="start">
                    <Flex gap="4" align="start" className="flex-1">
                      <Box className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                        <User className="w-8 h-8 text-blue-600" />
                      </Box>
                      <Box className="flex-1">
                        <Flex align="center" gap="3" className="mb-2">
                          <Heading size="4" className="text-gray-900">
                            {app.studentName}
                          </Heading>
                          <Badge color={getStatusColor(app.status)}>
                            {app.status.replace('_', ' ')}
                          </Badge>
                          {app.priority === 'high' && (
                            <Badge color="red">High Priority</Badge>
                          )}
                        </Flex>

                        <Text size="2" className="text-gray-600 mb-2">
                          {app.applicationNumber} • {app.program}
                        </Text>

                        <Grid columns="3" gap="4" className="mb-3">
                          <Text size="2" className="text-gray-600">
                            <Mail className="w-4 h-4 inline mr-1" />
                            {app.email}
                          </Text>
                          <Text size="2" className="text-gray-600">
                            <Phone className="w-4 h-4 inline mr-1" />
                            {app.phone}
                          </Text>
                          <Text size="2" className="text-gray-600">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            Submitted:{' '}
                            {new Date(app.submissionDate).toLocaleDateString()}
                          </Text>
                        </Grid>

                        {/* Academic Scores */}
                        <Flex gap="4" className="mb-3">
                          <Text size="2" className="text-gray-600">
                            <GraduationCap className="w-4 h-4 inline mr-1" />
                            GPA: {app.scores.gpa}
                          </Text>
                          {app.scores.satScore && (
                            <Text size="2" className="text-gray-600">
                              SAT: {app.scores.satScore}
                            </Text>
                          )}
                          {app.scores.gmatScore && (
                            <Text size="2" className="text-gray-600">
                              GMAT: {app.scores.gmatScore}
                            </Text>
                          )}
                          {app.scores.toeflScore && (
                            <Text size="2" className="text-gray-600">
                              TOEFL: {app.scores.toeflScore}
                            </Text>
                          )}
                        </Flex>

                        {/* Documents Status */}
                        <Box className="mb-3">
                          <Text size="2" className="text-gray-600 mb-1">
                            Documents:
                          </Text>
                          <Flex gap="2" wrap="wrap">
                            {app.documents.map((doc) => (
                              <Badge
                                key={doc.id}
                                color={
                                  doc.status === 'verified'
                                    ? 'green'
                                    : doc.status === 'submitted'
                                      ? 'blue'
                                      : 'gray'
                                }
                                size="1"
                              >
                                {doc.name}
                              </Badge>
                            ))}
                          </Flex>
                        </Box>

                        {app.notes && (
                          <Text size="2" className="text-gray-600 italic">
                            Note: {app.notes}
                          </Text>
                        )}
                      </Box>
                    </Flex>

                    <Flex gap="2">
                      <RadixButton
                        variant="outline"
                        size="2"
                        onClick={() => setSelectedApplication(app)}
                      >
                        <Eye className="w-4 h-4" />
                      </RadixButton>
                      <RadixButton variant="outline" size="2">
                        <Edit className="w-4 h-4" />
                      </RadixButton>
                      <RadixButton variant="outline" size="2">
                        <MessageSquare className="w-4 h-4" />
                      </RadixButton>
                      {app.status === 'under_review' && (
                        <RadixButton variant="solid" size="2">
                          Review
                        </RadixButton>
                      )}
                    </Flex>
                  </Flex>
                </RadixCard>
              );
            })}
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
                    <Badge color="purple">{program.degree}</Badge>
                  </Flex>

                  <Box>
                    <Heading size="4" className="text-gray-900 mb-2">
                      {program.name}
                    </Heading>
                    <Text size="2" className="text-gray-600 mb-3">
                      {program.description}
                    </Text>
                  </Box>

                  <Grid columns="2" gap="4">
                    <Box>
                      <Text size="2" weight="medium" className="text-gray-700">
                        Department
                      </Text>
                      <Text size="2" className="text-gray-600">
                        {program.department}
                      </Text>
                    </Box>
                    <Box>
                      <Text size="2" weight="medium" className="text-gray-700">
                        Duration
                      </Text>
                      <Text size="2" className="text-gray-600">
                        {program.duration}
                      </Text>
                    </Box>
                    <Box>
                      <Text size="2" weight="medium" className="text-gray-700">
                        Capacity
                      </Text>
                      <Text size="2" className="text-gray-600">
                        {program.capacity} students
                      </Text>
                    </Box>
                    <Box>
                      <Text size="2" weight="medium" className="text-gray-700">
                        Tuition Fee
                      </Text>
                      <Text size="2" className="text-gray-600">
                        ${program.tuitionFee.toLocaleString()}/year
                      </Text>
                    </Box>
                  </Grid>

                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-700 mb-2"
                    >
                      Requirements
                    </Text>
                    <Flex direction="column" gap="1">
                      {program.requirements.map((req, index) => (
                        <Text key={index} size="2" className="text-gray-600">
                          • {req}
                        </Text>
                      ))}
                    </Flex>
                  </Box>

                  <Flex justify="between" align="center">
                    <Box>
                      <Text size="2" className="text-gray-600">
                        {program.applicants} applicants • {program.accepted}{' '}
                        accepted
                      </Text>
                      <Text size="1" className="text-gray-500">
                        Deadline:{' '}
                        {new Date(program.deadline).toLocaleDateString()}
                      </Text>
                    </Box>
                    <RadixButton variant="outline" size="2">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </RadixButton>
                  </Flex>
                </Flex>
              </RadixCard>
            ))}
          </Grid>
        </Tabs.Content>

        {/* Interviews Tab */}
        <Tabs.Content value="interviews">
          <RadixCard className="p-6">
            <Heading size="4" className="mb-4">
              Scheduled Interviews
            </Heading>
            <Grid columns="1" gap="4">
              {mockApplications
                .filter((app) => app.interviewDate)
                .map((app) => (
                  <Box
                    key={app.id}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <Flex justify="between" align="start">
                      <Flex gap="4" align="start">
                        <Box className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-blue-600" />
                        </Box>
                        <Box>
                          <Text
                            size="3"
                            weight="medium"
                            className="text-gray-900 mb-1"
                          >
                            {app.studentName}
                          </Text>
                          <Text size="2" className="text-gray-600 mb-2">
                            {app.program}
                          </Text>
                          <Flex gap="4">
                            <Text size="2" className="text-gray-600">
                              <Calendar className="w-4 h-4 inline mr-1" />
                              {app.interviewDate
                                ? new Date(
                                    app.interviewDate
                                  ).toLocaleDateString()
                                : 'TBD'}
                            </Text>
                            <Text size="2" className="text-gray-600">
                              <User className="w-4 h-4 inline mr-1" />
                              {app.reviewedBy || 'TBD'}
                            </Text>
                          </Flex>
                        </Box>
                      </Flex>
                      <Flex gap="2">
                        <RadixButton variant="outline" size="2">
                          <Eye className="w-4 h-4" />
                        </RadixButton>
                        <RadixButton variant="outline" size="2">
                          <Edit className="w-4 h-4" />
                        </RadixButton>
                        <RadixButton variant="solid" size="2">
                          Start Interview
                        </RadixButton>
                      </Flex>
                    </Flex>
                  </Box>
                ))}
            </Grid>
          </RadixCard>
        </Tabs.Content>

        {/* Analytics Tab */}
        <Tabs.Content value="analytics">
          <Grid columns="2" gap="6">
            <RadixCard className="p-6">
              <Heading size="4" className="mb-4">
                Application Trends
              </Heading>
              <Box className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <Flex direction="column" align="center" gap="2">
                  <BarChart3 className="w-12 h-12 text-gray-400" />
                  <Text size="2" className="text-gray-600">
                    Application trends chart
                  </Text>
                </Flex>
              </Box>
            </RadixCard>

            <RadixCard className="p-6">
              <Heading size="4" className="mb-4">
                Admission Metrics
              </Heading>
              <Flex direction="column" gap="4">
                <Flex justify="between" align="center">
                  <Text size="2" className="text-gray-600">
                    Acceptance Rate
                  </Text>
                  <Text size="2" weight="bold" className="text-green-600">
                    {acceptanceRate}%
                  </Text>
                </Flex>
                <Flex justify="between" align="center">
                  <Text size="2" className="text-gray-600">
                    Average GPA
                  </Text>
                  <Text size="2" weight="bold" className="text-blue-600">
                    3.75
                  </Text>
                </Flex>
                <Flex justify="between" align="center">
                  <Text size="2" className="text-gray-600">
                    Average SAT Score
                  </Text>
                  <Text size="2" weight="bold" className="text-purple-600">
                    1485
                  </Text>
                </Flex>
                <Flex justify="between" align="center">
                  <Text size="2" className="text-gray-600">
                    Application Processing Time
                  </Text>
                  <Text size="2" weight="bold" className="text-orange-600">
                    12 days
                  </Text>
                </Flex>
              </Flex>
            </RadixCard>

            <RadixCard className="p-6">
              <Heading size="4" className="mb-4">
                Program Demand
              </Heading>
              <Flex direction="column" gap="3">
                {mockPrograms.map((program) => (
                  <Flex key={program.id} justify="between" align="center">
                    <Text size="2" className="text-gray-600">
                      {program.name}
                    </Text>
                    <Text size="2" weight="medium">
                      {Math.round(
                        (program.applicants / program.capacity) * 100
                      )}
                      % demand
                    </Text>
                  </Flex>
                ))}
              </Flex>
            </RadixCard>

            <RadixCard className="p-6">
              <Heading size="4" className="mb-4">
                Geographic Distribution
              </Heading>
              <Flex direction="column" gap="3">
                <Flex justify="between" align="center">
                  <Text size="2" className="text-gray-600">
                    In-State
                  </Text>
                  <Text size="2" weight="medium">
                    65%
                  </Text>
                </Flex>
                <Flex justify="between" align="center">
                  <Text size="2" className="text-gray-600">
                    Out-of-State
                  </Text>
                  <Text size="2" weight="medium">
                    25%
                  </Text>
                </Flex>
                <Flex justify="between" align="center">
                  <Text size="2" className="text-gray-600">
                    International
                  </Text>
                  <Text size="2" weight="medium">
                    10%
                  </Text>
                </Flex>
              </Flex>
            </RadixCard>
          </Grid>
        </Tabs.Content>
      </Tabs.Root>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <Box className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <RadixCard className="max-w-4xl w-full m-4 p-6 max-h-[80vh] overflow-y-auto">
            <Flex justify="between" align="start" className="mb-6">
              <Box>
                <Heading size="5" className="text-gray-900 mb-2">
                  {selectedApplication.studentName}
                </Heading>
                <Text size="3" className="text-gray-600">
                  Application #{selectedApplication.applicationNumber}
                </Text>
              </Box>
              <Flex gap="2">
                <RadixButton variant="outline" size="2">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </RadixButton>
                <RadixButton
                  variant="ghost"
                  size="2"
                  onClick={() => setSelectedApplication(null)}
                >
                  ✕
                </RadixButton>
              </Flex>
            </Flex>

            <Grid columns="2" gap="6">
              <Box>
                <Heading size="4" className="mb-3">
                  Personal Information
                </Heading>
                <Flex direction="column" gap="2">
                  <Text size="2">
                    <strong>Email:</strong> {selectedApplication.email}
                  </Text>
                  <Text size="2">
                    <strong>Phone:</strong> {selectedApplication.phone}
                  </Text>
                  <Text size="2">
                    <strong>Address:</strong> {selectedApplication.address}
                  </Text>
                  <Text size="2">
                    <strong>Date of Birth:</strong>{' '}
                    {new Date(
                      selectedApplication.dateOfBirth
                    ).toLocaleDateString()}
                  </Text>
                </Flex>
              </Box>

              <Box>
                <Heading size="4" className="mb-3">
                  Academic Information
                </Heading>
                <Flex direction="column" gap="2">
                  <Text size="2">
                    <strong>Program:</strong> {selectedApplication.program}
                  </Text>
                  <Text size="2">
                    <strong>Department:</strong>{' '}
                    {selectedApplication.department}
                  </Text>
                  <Text size="2">
                    <strong>GPA:</strong> {selectedApplication.scores.gpa}
                  </Text>
                  {selectedApplication.scores.satScore && (
                    <Text size="2">
                      <strong>SAT Score:</strong>{' '}
                      {selectedApplication.scores.satScore}
                    </Text>
                  )}
                </Flex>
              </Box>
            </Grid>

            {selectedApplication.notes && (
              <Box className="mt-4">
                <Heading size="4" className="mb-3">
                  Review Notes
                </Heading>
                <Text size="2" className="text-gray-700">
                  {selectedApplication.notes}
                </Text>
              </Box>
            )}
          </RadixCard>
        </Box>
      )}
    </DashboardLayout>
  );
}
