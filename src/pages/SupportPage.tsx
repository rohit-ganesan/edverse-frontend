import { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Heading,
  Badge,
  Grid,
  TextField,
  Card as RadixCard,
  Button as RadixButton,
} from '@radix-ui/themes';
import {
  Download,
  MessageSquare,
  Search,
  Star,
  ArrowRight,
  ExternalLink,
  Book,
  Video,
  Phone,
  Clock,
  CheckCircle,
  Users,
  Plus,
  Filter,
  Calendar,
  Send,
  Mail,
  MapPin,
  Globe,
  FileText,
  Play,
  Headphones,
  Eye,
  Edit,
} from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PageHeader } from '../components/ui/PageHeader';
import { TabContainer } from '../components/ui/TabContainer';
import {
  ModernStatsGridColored,
  ColoredStatItem,
} from '../components/ui/ModernStatsGridColored';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
}

interface SupportTicket {
  id: string;
  title: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created: string;
  updated: string;
  category: string;
  description: string;
  assignee?: string;
}

interface Resource {
  id: string;
  title: string;
  type: 'video' | 'guide' | 'documentation' | 'webinar';
  duration?: string;
  category: string;
  description: string;
  url: string;
  views: number;
  rating: number;
}

interface ContactInfo {
  type: 'phone' | 'email' | 'address' | 'hours';
  label: string;
  value: string;
  icon: any;
  available?: boolean;
}

export function SupportPage(): JSX.Element {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'How do I reset my password?',
      answer:
        'You can reset your password by clicking the "Forgot Password" link on the login page and following the instructions sent to your email.',
      category: 'Account',
      helpful: 45,
    },
    {
      id: '2',
      question: 'How do I add new students to the system?',
      answer:
        'Navigate to the Students section and click "Add Student". Fill in the required information and save.',
      category: 'Students',
      helpful: 32,
    },
    {
      id: '3',
      question: 'Can I export attendance reports?',
      answer:
        'Yes, you can export attendance reports from the Attendance section by clicking the Export button and selecting your preferred format.',
      category: 'Attendance',
      helpful: 28,
    },
  ];

  const tickets: SupportTicket[] = [
    {
      id: 'T001',
      title: 'Unable to generate fee reports',
      status: 'open',
      priority: 'high',
      created: '2024-01-15',
      updated: '2024-01-15',
      category: 'Reports',
      description:
        'When trying to generate monthly fee reports, the system shows an error message and fails to complete the process.',
      assignee: 'Sarah Johnson',
    },
    {
      id: 'T002',
      title: 'Student data import failing',
      status: 'in-progress',
      priority: 'medium',
      created: '2024-01-14',
      updated: '2024-01-16',
      category: 'Data Import',
      description:
        'CSV import for student data is failing with validation errors. Need assistance with proper format.',
      assignee: 'Mike Chen',
    },
    {
      id: 'T003',
      title: 'Login issues for teachers',
      status: 'resolved',
      priority: 'urgent',
      created: '2024-01-12',
      updated: '2024-01-13',
      category: 'Authentication',
      description:
        'Multiple teachers reporting they cannot log into the system. Password reset not working.',
      assignee: 'Alex Rodriguez',
    },
    {
      id: 'T004',
      title: 'Attendance tracking not syncing',
      status: 'closed',
      priority: 'low',
      created: '2024-01-10',
      updated: '2024-01-11',
      category: 'Attendance',
      description:
        'Attendance data from mobile app not syncing with web dashboard.',
    },
  ];

  const resources: Resource[] = [
    {
      id: 'R001',
      title: 'Getting Started Guide',
      type: 'guide',
      category: 'Setup',
      description: 'Complete guide to setting up your school management system',
      url: '#',
      views: 1247,
      rating: 4.8,
    },
    {
      id: 'R002',
      title: 'Student Management Tutorial',
      type: 'video',
      duration: '15 min',
      category: 'Students',
      description: 'Learn how to manage student records effectively',
      url: '#',
      views: 856,
      rating: 4.6,
    },
    {
      id: 'R003',
      title: 'Fee Management Webinar',
      type: 'webinar',
      duration: '45 min',
      category: 'Finance',
      description: 'Advanced techniques for managing school fees and payments',
      url: '#',
      views: 423,
      rating: 4.9,
    },
    {
      id: 'R004',
      title: 'API Documentation',
      type: 'documentation',
      category: 'Development',
      description: 'Complete API reference for developers and integrations',
      url: '#',
      views: 234,
      rating: 4.5,
    },
    {
      id: 'R005',
      title: 'Attendance Tracking Best Practices',
      type: 'guide',
      category: 'Attendance',
      description:
        'Best practices for accurate and efficient attendance tracking',
      url: '#',
      views: 678,
      rating: 4.7,
    },
    {
      id: 'R006',
      title: 'Report Generation Tutorial',
      type: 'video',
      duration: '20 min',
      category: 'Reports',
      description: 'How to create and customize various reports in the system',
      url: '#',
      views: 512,
      rating: 4.4,
    },
  ];

  const contactInfo: ContactInfo[] = [
    {
      type: 'phone',
      label: 'Support Hotline',
      value: '+1 (555) 123-HELP',
      icon: Phone,
      available: true,
    },
    {
      type: 'email',
      label: 'Email Support',
      value: 'support@edverse.com',
      icon: Mail,
      available: true,
    },
    {
      type: 'address',
      label: 'Office Address',
      value: '123 Education St, Learning City, LC 12345',
      icon: MapPin,
    },
    {
      type: 'hours',
      label: 'Support Hours',
      value: 'Mon-Fri: 8AM-8PM EST, Weekends: 10AM-4PM EST',
      icon: Clock,
    },
  ];

  const supportStats: ColoredStatItem[] = [
    {
      title: 'Open Tickets',
      value: '3',
      icon: MessageSquare,
      gradient: {
        from: 'from-orange-50',
        to: 'to-amber-50',
      },
      iconColor: 'text-orange-600',
      iconBgColor: 'bg-orange-100',
    },
    {
      title: 'Avg Response Time',
      value: '2.4 hrs',
      icon: Clock,
      gradient: {
        from: 'from-blue-50',
        to: 'to-indigo-50',
      },
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-100',
    },
    {
      title: 'Resolution Rate',
      value: '94%',
      icon: CheckCircle,
      gradient: {
        from: 'from-green-50',
        to: 'to-emerald-50',
      },
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-100',
    },
    {
      title: 'Active Users',
      value: '1,247',
      icon: Users,
      gradient: {
        from: 'from-purple-50',
        to: 'to-violet-50',
      },
      iconColor: 'text-purple-600',
      iconBgColor: 'bg-purple-100',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'orange';
      case 'in-progress':
        return 'blue';
      case 'resolved':
        return 'green';
      case 'closed':
        return 'gray';
      default:
        return 'gray';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'red';
      case 'high':
        return 'orange';
      case 'medium':
        return 'yellow';
      case 'low':
        return 'green';
      default:
        return 'gray';
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video':
        return Video;
      case 'guide':
        return Book;
      case 'documentation':
        return FileText;
      case 'webinar':
        return Headphones;
      default:
        return Book;
    }
  };

  const handleCreateTicket = () => {
    console.log('Create new ticket');
  };

  const handleViewTicket = (ticketId: string) => {
    console.log('View ticket:', ticketId);
  };

  const handleOpenResource = (resourceUrl: string) => {
    window.open(resourceUrl, '_blank');
  };

  const tabs = [
    {
      value: 'overview',
      label: 'Overview',
      content: (
        <Box className="space-y-6">
          {/* Quick Help */}
          <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
            <Box className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
              <Heading size="4" className="text-gray-900 mb-1">
                Quick Help
              </Heading>
              <Text size="2" className="text-gray-600">
                Find answers to common questions and get started quickly
              </Text>
            </Box>

            <Box className="p-6">
              <Grid columns="4" gap="4">
                <RadixButton
                  variant="outline"
                  size="3"
                  className="h-20 flex-col gap-2"
                >
                  <Book className="w-6 h-6" />
                  <Text size="2">User Guide</Text>
                </RadixButton>
                <RadixButton
                  variant="outline"
                  size="3"
                  className="h-20 flex-col gap-2"
                >
                  <Video className="w-6 h-6" />
                  <Text size="2">Video Tutorials</Text>
                </RadixButton>
                <RadixButton
                  variant="outline"
                  size="3"
                  className="h-20 flex-col gap-2"
                >
                  <MessageSquare className="w-6 h-6" />
                  <Text size="2">Submit Ticket</Text>
                </RadixButton>
                <RadixButton
                  variant="outline"
                  size="3"
                  className="h-20 flex-col gap-2"
                >
                  <Phone className="w-6 h-6" />
                  <Text size="2">Call Support</Text>
                </RadixButton>
              </Grid>
            </Box>
          </RadixCard>

          {/* Popular FAQs */}
          <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
            <Box className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
              <Heading size="4" className="text-gray-900 mb-1">
                Popular Questions
              </Heading>
              <Text size="2" className="text-gray-600">
                Most frequently asked questions and answers
              </Text>
            </Box>

            <Box className="p-6">
              <Box className="space-y-4">
                {faqs.slice(0, 3).map((faq) => (
                  <Box
                    key={faq.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-colors"
                  >
                    <Flex justify="between" align="start" className="mb-2">
                      <Heading size="3" className="text-gray-900 flex-1">
                        {faq.question}
                      </Heading>
                      <Badge color="green" variant="soft" size="1">
                        {faq.category}
                      </Badge>
                    </Flex>
                    <Text size="2" className="text-gray-600 mb-3">
                      {faq.answer}
                    </Text>
                    <Flex justify="between" align="center">
                      <Flex align="center" gap="1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <Text size="1" className="text-gray-500">
                          {faq.helpful} found this helpful
                        </Text>
                      </Flex>
                      <RadixButton variant="ghost" size="1">
                        <ArrowRight className="w-4 h-4" />
                      </RadixButton>
                    </Flex>
                  </Box>
                ))}
              </Box>
            </Box>
          </RadixCard>
        </Box>
      ),
    },
    {
      value: 'faq',
      label: 'FAQ',
      content: (
        <Box className="space-y-6">
          {/* Search */}
          <RadixCard className="p-6 shadow-xl border-0 bg-white">
            <Box className="max-w-md">
              <TextField.Root
                placeholder="Search FAQ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="3"
              >
                <TextField.Slot>
                  <Search className="w-4 h-4" />
                </TextField.Slot>
              </TextField.Root>
            </Box>
          </RadixCard>

          <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
            <Box className="p-6 bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-100">
              <Heading size="4" className="text-gray-900 mb-1">
                Frequently Asked Questions
              </Heading>
              <Text size="2" className="text-gray-600">
                Browse all questions and answers by category
              </Text>
            </Box>

            <Box className="p-6">
              <Box className="space-y-6">
                {faqs.map((faq) => (
                  <Box
                    key={faq.id}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <Flex justify="between" align="start" className="mb-3">
                      <Heading size="3" className="text-gray-900 flex-1">
                        {faq.question}
                      </Heading>
                      <Badge color="purple" variant="soft" size="1">
                        {faq.category}
                      </Badge>
                    </Flex>
                    <Text size="2" className="text-gray-600 mb-4">
                      {faq.answer}
                    </Text>
                    <Flex justify="between" align="center">
                      <Flex align="center" gap="2">
                        <RadixButton variant="ghost" size="1">
                          <Star className="w-4 h-4" />
                          Helpful
                        </RadixButton>
                        <Text size="1" className="text-gray-500">
                          {faq.helpful} people found this helpful
                        </Text>
                      </Flex>
                      <RadixButton variant="soft" size="1">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View Details
                      </RadixButton>
                    </Flex>
                  </Box>
                ))}
              </Box>
            </Box>
          </RadixCard>
        </Box>
      ),
    },
    {
      value: 'tickets',
      label: 'Support Tickets',
      content: (
        <Box className="space-y-6">
          {/* Ticket Actions */}
          <RadixCard className="p-6 shadow-xl border-0 bg-white">
            <Flex justify="between" align="center">
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Support Tickets
                </Heading>
                <Text size="2" className="text-gray-600">
                  Manage and track your support requests
                </Text>
              </Box>
              <Flex gap="3">
                <RadixButton variant="outline" size="2">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </RadixButton>
                <RadixButton onClick={handleCreateTicket} size="2">
                  <Plus className="w-4 h-4 mr-2" />
                  New Ticket
                </RadixButton>
              </Flex>
            </Flex>
          </RadixCard>

          {/* Tickets List */}
          <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
            <Box className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
              <Heading size="4" className="text-gray-900 mb-1">
                Your Tickets
              </Heading>
              <Text size="2" className="text-gray-600">
                {tickets.length} total tickets
              </Text>
            </Box>

            <Box className="p-6">
              <Box className="space-y-4">
                {tickets.map((ticket) => (
                  <Box
                    key={ticket.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                  >
                    <Flex justify="between" align="start" className="mb-3">
                      <Box className="flex-1">
                        <Flex align="center" gap="2" className="mb-2">
                          <Text size="1" className="text-gray-500 font-mono">
                            #{ticket.id}
                          </Text>
                          <Badge
                            color={getStatusColor(ticket.status) as any}
                            variant="soft"
                            size="1"
                          >
                            {ticket.status.replace('-', ' ').toUpperCase()}
                          </Badge>
                          <Badge
                            color={getPriorityColor(ticket.priority) as any}
                            variant="outline"
                            size="1"
                          >
                            {ticket.priority.toUpperCase()}
                          </Badge>
                        </Flex>
                        <Heading size="3" className="text-gray-900 mb-2">
                          {ticket.title}
                        </Heading>
                        <Text size="2" className="text-gray-600 mb-3">
                          {ticket.description}
                        </Text>
                        <Flex
                          align="center"
                          gap="4"
                          className="text-sm text-gray-500"
                        >
                          <Flex align="center" gap="1">
                            <Calendar className="w-4 h-4" />
                            <Text size="1">Created: {ticket.created}</Text>
                          </Flex>
                          <Flex align="center" gap="1">
                            <Clock className="w-4 h-4" />
                            <Text size="1">Updated: {ticket.updated}</Text>
                          </Flex>
                          {ticket.assignee && (
                            <Flex align="center" gap="1">
                              <Users className="w-4 h-4" />
                              <Text size="1">
                                Assigned to: {ticket.assignee}
                              </Text>
                            </Flex>
                          )}
                        </Flex>
                      </Box>
                      <Flex gap="2">
                        <RadixButton
                          variant="ghost"
                          size="1"
                          onClick={() => handleViewTicket(ticket.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </RadixButton>
                        <RadixButton variant="ghost" size="1">
                          <Edit className="w-4 h-4" />
                        </RadixButton>
                      </Flex>
                    </Flex>
                    <Box className="pt-3 border-t border-gray-100">
                      <Flex justify="between" align="center">
                        <Badge color="gray" variant="soft" size="1">
                          {ticket.category}
                        </Badge>
                        <RadixButton variant="soft" size="1">
                          View Details
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </RadixButton>
                      </Flex>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </RadixCard>

          {/* Create New Ticket Form */}
          <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
            <Box className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
              <Heading size="4" className="text-gray-900 mb-1">
                Submit New Ticket
              </Heading>
              <Text size="2" className="text-gray-600">
                Describe your issue and we'll help you resolve it
              </Text>
            </Box>

            <Box className="p-6">
              <Box className="space-y-4">
                <Grid columns="2" gap="4">
                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 mb-2 block"
                    >
                      Subject
                    </Text>
                    <TextField.Root placeholder="Brief description of your issue" />
                  </Box>
                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 mb-2 block"
                    >
                      Category
                    </Text>
                    <TextField.Root placeholder="e.g., Reports, Students, Attendance" />
                  </Box>
                </Grid>

                <Box>
                  <Text
                    size="2"
                    weight="medium"
                    className="text-gray-900 mb-2 block"
                  >
                    Priority
                  </Text>
                  <Grid columns="4" gap="2">
                    {['Low', 'Medium', 'High', 'Urgent'].map((priority) => (
                      <RadixButton
                        key={priority}
                        variant="outline"
                        size="2"
                        className="justify-center"
                      >
                        {priority}
                      </RadixButton>
                    ))}
                  </Grid>
                </Box>

                <Box>
                  <Text
                    size="2"
                    weight="medium"
                    className="text-gray-900 mb-2 block"
                  >
                    Description
                  </Text>
                  <TextField.Root
                    placeholder="Please provide detailed information about the issue you're experiencing..."
                    className="min-h-24"
                  />
                </Box>

                <Flex justify="end" gap="3">
                  <RadixButton variant="outline" size="2">
                    Cancel
                  </RadixButton>
                  <RadixButton size="2">
                    <Send className="w-4 h-4 mr-2" />
                    Submit Ticket
                  </RadixButton>
                </Flex>
              </Box>
            </Box>
          </RadixCard>
        </Box>
      ),
    },
    {
      value: 'resources',
      label: 'Resources',
      content: (
        <Box className="space-y-6">
          {/* Resources Header */}
          <RadixCard className="p-6 shadow-xl border-0 bg-white">
            <Flex justify="between" align="center">
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Learning Resources
                </Heading>
                <Text size="2" className="text-gray-600">
                  Guides, tutorials, and documentation to help you succeed
                </Text>
              </Box>
              <Box className="max-w-xs">
                <TextField.Root
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                >
                  <TextField.Slot>
                    <Search className="w-4 h-4" />
                  </TextField.Slot>
                </TextField.Root>
              </Box>
            </Flex>
          </RadixCard>

          {/* Resource Categories */}
          <Grid columns="4" gap="4">
            {['All', 'Setup', 'Students', 'Finance', 'Reports'].map(
              (category) => (
                <RadixButton
                  key={category}
                  variant="outline"
                  size="2"
                  className="justify-center"
                >
                  {category}
                </RadixButton>
              )
            )}
          </Grid>

          {/* Popular Resources */}
          <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
            <Box className="p-6 bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-100">
              <Heading size="4" className="text-gray-900 mb-1">
                Popular Resources
              </Heading>
              <Text size="2" className="text-gray-600">
                Most viewed and highest rated content
              </Text>
            </Box>

            <Box className="p-6">
              <Grid columns="2" gap="6">
                {resources.slice(0, 4).map((resource) => {
                  const ResourceIcon = getResourceIcon(resource.type);
                  return (
                    <Box
                      key={resource.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer"
                    >
                      <Flex align="start" gap="3">
                        <Box className="p-2 bg-purple-100 rounded-lg">
                          <ResourceIcon className="w-5 h-5 text-purple-600" />
                        </Box>
                        <Box className="flex-1">
                          <Flex
                            justify="between"
                            align="start"
                            className="mb-2"
                          >
                            <Heading size="3" className="text-gray-900">
                              {resource.title}
                            </Heading>
                            <Badge color="purple" variant="soft" size="1">
                              {resource.type}
                            </Badge>
                          </Flex>
                          <Text size="2" className="text-gray-600 mb-3">
                            {resource.description}
                          </Text>
                          <Flex justify="between" align="center">
                            <Flex align="center" gap="3">
                              <Flex align="center" gap="1">
                                <Eye className="w-4 h-4 text-gray-400" />
                                <Text size="1" className="text-gray-500">
                                  {resource.views}
                                </Text>
                              </Flex>
                              <Flex align="center" gap="1">
                                <Star className="w-4 h-4 text-yellow-500" />
                                <Text size="1" className="text-gray-500">
                                  {resource.rating}
                                </Text>
                              </Flex>
                              {resource.duration && (
                                <Flex align="center" gap="1">
                                  <Clock className="w-4 h-4 text-gray-400" />
                                  <Text size="1" className="text-gray-500">
                                    {resource.duration}
                                  </Text>
                                </Flex>
                              )}
                            </Flex>
                            <RadixButton
                              variant="soft"
                              size="1"
                              onClick={() => handleOpenResource(resource.url)}
                            >
                              <Play className="w-4 h-4 mr-1" />
                              Open
                            </RadixButton>
                          </Flex>
                        </Box>
                      </Flex>
                    </Box>
                  );
                })}
              </Grid>
            </Box>
          </RadixCard>

          {/* All Resources */}
          <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
            <Box className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
              <Heading size="4" className="text-gray-900 mb-1">
                All Resources
              </Heading>
              <Text size="2" className="text-gray-600">
                Complete library of guides, tutorials, and documentation
              </Text>
            </Box>

            <Box className="p-6">
              <Box className="space-y-4">
                {resources.map((resource) => {
                  const ResourceIcon = getResourceIcon(resource.type);
                  return (
                    <Box
                      key={resource.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                    >
                      <Flex align="center" gap="4">
                        <Box className="p-3 bg-blue-100 rounded-lg">
                          <ResourceIcon className="w-6 h-6 text-blue-600" />
                        </Box>
                        <Box className="flex-1">
                          <Flex
                            justify="between"
                            align="start"
                            className="mb-2"
                          >
                            <Box>
                              <Heading size="3" className="text-gray-900 mb-1">
                                {resource.title}
                              </Heading>
                              <Text size="2" className="text-gray-600">
                                {resource.description}
                              </Text>
                            </Box>
                            <Flex gap="2">
                              <Badge color="blue" variant="soft" size="1">
                                {resource.category}
                              </Badge>
                              <Badge color="gray" variant="outline" size="1">
                                {resource.type}
                              </Badge>
                            </Flex>
                          </Flex>
                          <Flex
                            justify="between"
                            align="center"
                            className="mt-3"
                          >
                            <Flex align="center" gap="4">
                              <Flex align="center" gap="1">
                                <Eye className="w-4 h-4 text-gray-400" />
                                <Text size="1" className="text-gray-500">
                                  {resource.views} views
                                </Text>
                              </Flex>
                              <Flex align="center" gap="1">
                                <Star className="w-4 h-4 text-yellow-500" />
                                <Text size="1" className="text-gray-500">
                                  {resource.rating}/5
                                </Text>
                              </Flex>
                              {resource.duration && (
                                <Flex align="center" gap="1">
                                  <Clock className="w-4 h-4 text-gray-400" />
                                  <Text size="1" className="text-gray-500">
                                    {resource.duration}
                                  </Text>
                                </Flex>
                              )}
                            </Flex>
                            <Flex gap="2">
                              <RadixButton variant="ghost" size="1">
                                <Download className="w-4 h-4" />
                              </RadixButton>
                              <RadixButton
                                variant="soft"
                                size="1"
                                onClick={() => handleOpenResource(resource.url)}
                              >
                                <ExternalLink className="w-4 h-4 mr-1" />
                                Open
                              </RadixButton>
                            </Flex>
                          </Flex>
                        </Box>
                      </Flex>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </RadixCard>
        </Box>
      ),
    },
    {
      value: 'contact',
      label: 'Contact',
      content: (
        <Box className="space-y-6">
          {/* Contact Methods */}
          <Grid columns="2" gap="6">
            {contactInfo.map((contact, index) => (
              <RadixCard
                key={index}
                className="p-0 shadow-xl border-0 bg-white overflow-hidden"
              >
                <Box className="p-6">
                  <Flex align="center" gap="4">
                    <Box
                      className={`p-4 rounded-lg ${
                        contact.type === 'phone'
                          ? 'bg-green-100'
                          : contact.type === 'email'
                            ? 'bg-blue-100'
                            : contact.type === 'address'
                              ? 'bg-purple-100'
                              : 'bg-orange-100'
                      }`}
                    >
                      <contact.icon
                        className={`w-6 h-6 ${
                          contact.type === 'phone'
                            ? 'text-green-600'
                            : contact.type === 'email'
                              ? 'text-blue-600'
                              : contact.type === 'address'
                                ? 'text-purple-600'
                                : 'text-orange-600'
                        }`}
                      />
                    </Box>
                    <Box className="flex-1">
                      <Flex justify="between" align="center" className="mb-2">
                        <Heading size="3" className="text-gray-900">
                          {contact.label}
                        </Heading>
                        {contact.available && (
                          <Badge color="green" variant="soft" size="1">
                            Available
                          </Badge>
                        )}
                      </Flex>
                      <Text size="2" className="text-gray-600">
                        {contact.value}
                      </Text>
                      {contact.type === 'phone' && (
                        <RadixButton variant="soft" size="1" className="mt-3">
                          <Phone className="w-4 h-4 mr-2" />
                          Call Now
                        </RadixButton>
                      )}
                      {contact.type === 'email' && (
                        <RadixButton variant="soft" size="1" className="mt-3">
                          <Mail className="w-4 h-4 mr-2" />
                          Send Email
                        </RadixButton>
                      )}
                    </Box>
                  </Flex>
                </Box>
              </RadixCard>
            ))}
          </Grid>

          {/* Contact Form */}
          <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
            <Box className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
              <Heading size="4" className="text-gray-900 mb-1">
                Send us a Message
              </Heading>
              <Text size="2" className="text-gray-600">
                Get in touch with our support team directly
              </Text>
            </Box>

            <Box className="p-6">
              <Box className="space-y-4">
                <Grid columns="2" gap="4">
                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 mb-2 block"
                    >
                      Name
                    </Text>
                    <TextField.Root placeholder="Your full name" />
                  </Box>
                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 mb-2 block"
                    >
                      Email
                    </Text>
                    <TextField.Root placeholder="your.email@example.com" />
                  </Box>
                </Grid>

                <Box>
                  <Text
                    size="2"
                    weight="medium"
                    className="text-gray-900 mb-2 block"
                  >
                    Subject
                  </Text>
                  <TextField.Root placeholder="What can we help you with?" />
                </Box>

                <Box>
                  <Text
                    size="2"
                    weight="medium"
                    className="text-gray-900 mb-2 block"
                  >
                    Message
                  </Text>
                  <TextField.Root
                    placeholder="Please describe your question or issue in detail..."
                    className="min-h-32"
                  />
                </Box>

                <Box>
                  <Text
                    size="2"
                    weight="medium"
                    className="text-gray-900 mb-2 block"
                  >
                    Priority
                  </Text>
                  <Grid columns="3" gap="2">
                    {['Low', 'Medium', 'High'].map((priority) => (
                      <RadixButton
                        key={priority}
                        variant="outline"
                        size="2"
                        className="justify-center"
                      >
                        {priority}
                      </RadixButton>
                    ))}
                  </Grid>
                </Box>

                <Flex justify="end" gap="3">
                  <RadixButton variant="outline" size="2">
                    Cancel
                  </RadixButton>
                  <RadixButton size="2">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </RadixButton>
                </Flex>
              </Box>
            </Box>
          </RadixCard>

          {/* Additional Support Options */}
          <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
            <Box className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
              <Heading size="4" className="text-gray-900 mb-1">
                Other Ways to Get Help
              </Heading>
              <Text size="2" className="text-gray-600">
                Additional resources and support channels
              </Text>
            </Box>

            <Box className="p-6">
              <Grid columns="3" gap="4">
                <Box className="p-4 border border-gray-200 rounded-lg text-center hover:border-blue-300 transition-colors cursor-pointer">
                  <Box className="p-3 bg-blue-100 rounded-lg inline-block mb-3">
                    <Globe className="w-6 h-6 text-blue-600" />
                  </Box>
                  <Heading size="3" className="text-gray-900 mb-2">
                    Knowledge Base
                  </Heading>
                  <Text size="2" className="text-gray-600 mb-3">
                    Browse our comprehensive help articles
                  </Text>
                  <RadixButton variant="soft" size="1">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Visit
                  </RadixButton>
                </Box>

                <Box className="p-4 border border-gray-200 rounded-lg text-center hover:border-green-300 transition-colors cursor-pointer">
                  <Box className="p-3 bg-green-100 rounded-lg inline-block mb-3">
                    <Users className="w-6 h-6 text-green-600" />
                  </Box>
                  <Heading size="3" className="text-gray-900 mb-2">
                    Community Forum
                  </Heading>
                  <Text size="2" className="text-gray-600 mb-3">
                    Connect with other users and experts
                  </Text>
                  <RadixButton variant="soft" size="1">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Join
                  </RadixButton>
                </Box>

                <Box className="p-4 border border-gray-200 rounded-lg text-center hover:border-purple-300 transition-colors cursor-pointer">
                  <Box className="p-3 bg-purple-100 rounded-lg inline-block mb-3">
                    <Video className="w-6 h-6 text-purple-600" />
                  </Box>
                  <Heading size="3" className="text-gray-900 mb-2">
                    Live Chat
                  </Heading>
                  <Text size="2" className="text-gray-600 mb-3">
                    Chat with our support team in real-time
                  </Text>
                  <RadixButton variant="soft" size="1">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Start Chat
                  </RadixButton>
                </Box>
              </Grid>
            </Box>
          </RadixCard>

          {/* Support Team */}
          <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
            <Box className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
              <Heading size="4" className="text-gray-900 mb-1">
                Meet Our Support Team
              </Heading>
              <Text size="2" className="text-gray-600">
                Dedicated professionals ready to help you succeed
              </Text>
            </Box>

            <Box className="p-6">
              <Grid columns="3" gap="6">
                {[
                  {
                    name: 'Sarah Johnson',
                    role: 'Senior Support Specialist',
                    expertise: 'Reports & Analytics',
                  },
                  {
                    name: 'Mike Chen',
                    role: 'Technical Support Lead',
                    expertise: 'Data Import & Integration',
                  },
                  {
                    name: 'Alex Rodriguez',
                    role: 'Customer Success Manager',
                    expertise: 'Account & Authentication',
                  },
                ].map((member, index) => (
                  <Box key={index} className="text-center">
                    <Box className="w-16 h-16 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <Users className="w-8 h-8 text-orange-600" />
                    </Box>
                    <Heading size="3" className="text-gray-900 mb-1">
                      {member.name}
                    </Heading>
                    <Text size="2" className="text-gray-600 mb-1">
                      {member.role}
                    </Text>
                    <Badge color="orange" variant="soft" size="1">
                      {member.expertise}
                    </Badge>
                  </Box>
                ))}
              </Grid>
            </Box>
          </RadixCard>
        </Box>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Support Center"
        description="Get help, access resources, and contact our support team"
        actions={[
          {
            label: 'Download Guides',
            icon: Download,
            onClick: () => console.log('Download guides clicked'),
          },
          {
            label: 'Contact Support',
            icon: MessageSquare,
            onClick: () => console.log('Contact support clicked'),
            isPrimary: true,
          },
        ]}
      />

      <ModernStatsGridColored
        stats={supportStats}
        columns="4"
        gap="6"
        isLoading={false}
      />

      <TabContainer
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </DashboardLayout>
  );
}
