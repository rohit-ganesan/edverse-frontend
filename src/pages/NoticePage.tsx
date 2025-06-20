import { useState } from 'react';
import { Box, Flex, Text, Heading, Grid, Badge, Tabs } from '@radix-ui/themes';
import { DashboardLayout } from 'components/layout/DashboardLayout';
import { RadixCard } from 'components/ui/RadixCard';
import { RadixButton } from 'components/ui/RadixButton';
import { PageHeader } from 'components/ui/PageHeader';
import { StatsGrid } from 'components/ui/StatsGrid';
import {
  Bell,
  AlertTriangle,
  Info,
  CheckCircle,
  Calendar,
  Users,
  User,
  Plus,
  Search,
  Download,
  Eye,
  Edit,
  Share,
  Pin,
  Archive,
  FileText,
  Image,
  Paperclip,
  Star,
  MessageSquare,
  TrendingUp,
} from 'lucide-react';

interface Notice {
  id: string;
  title: string;
  content: string;
  author: string;
  authorRole: string;
  targetAudience: 'all' | 'students' | 'instructors' | 'administrators';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'academic' | 'administrative' | 'event' | 'emergency' | 'general';
  status: 'draft' | 'published' | 'archived';
  publishDate: string;
  expiryDate?: string;
  isPinned: boolean;
  attachments?: Attachment[];
  views: number;
  likes: number;
  comments: number;
  tags: string[];
}

interface Attachment {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'document' | 'link';
  url: string;
  size?: string;
}

const mockNotices: Notice[] = [
  {
    id: '1',
    title: 'Spring Semester Registration Opens',
    content:
      'Registration for Spring 2024 semester will begin on January 20th. Students are advised to meet with their academic advisors before registration. Early registration is encouraged to secure preferred class schedules.',
    author: 'Dr. Jennifer Smith',
    authorRole: 'Academic Dean',
    targetAudience: 'students',
    priority: 'high',
    category: 'academic',
    status: 'published',
    publishDate: '2024-01-10',
    expiryDate: '2024-01-25',
    isPinned: true,
    views: 1247,
    likes: 89,
    comments: 23,
    tags: ['registration', 'spring2024', 'important'],
    attachments: [
      {
        id: '1',
        name: 'Registration Guidelines.pdf',
        type: 'pdf',
        url: '/documents/registration-guidelines.pdf',
        size: '2.3 MB',
      },
    ],
  },
  {
    id: '2',
    title: 'Emergency Maintenance - Campus WiFi',
    content:
      'Campus-wide WiFi maintenance will be conducted on January 15th from 2:00 AM to 6:00 AM. Internet services may be intermittent during this period. Students are advised to download necessary materials beforehand.',
    author: 'IT Support Team',
    authorRole: 'Technical Staff',
    targetAudience: 'all',
    priority: 'urgent',
    category: 'administrative',
    status: 'published',
    publishDate: '2024-01-12',
    expiryDate: '2024-01-16',
    isPinned: true,
    views: 892,
    likes: 45,
    comments: 12,
    tags: ['maintenance', 'wifi', 'urgent'],
    attachments: [],
  },
  {
    id: '3',
    title: 'Annual Tech Symposium 2024',
    content:
      'Join us for the Annual Tech Symposium featuring keynote speakers from leading tech companies. The event will showcase student projects and provide networking opportunities with industry professionals.',
    author: 'Student Activities Office',
    authorRole: 'Event Coordinator',
    targetAudience: 'all',
    priority: 'medium',
    category: 'event',
    status: 'published',
    publishDate: '2024-01-08',
    expiryDate: '2024-03-15',
    isPinned: false,
    views: 567,
    likes: 78,
    comments: 34,
    tags: ['symposium', 'technology', 'networking'],
    attachments: [
      {
        id: '2',
        name: 'Event Schedule.pdf',
        type: 'pdf',
        url: '/documents/symposium-schedule.pdf',
        size: '1.8 MB',
      },
      {
        id: '3',
        name: 'Registration Form',
        type: 'link',
        url: 'https://forms.edu/symposium-registration',
      },
    ],
  },
  {
    id: '4',
    title: 'Library Extended Hours During Finals',
    content:
      'The library will extend its operating hours during finals week (March 10-17). The library will be open 24/7 to support students during their examination period.',
    author: 'Library Administration',
    authorRole: 'Librarian',
    targetAudience: 'students',
    priority: 'medium',
    category: 'academic',
    status: 'published',
    publishDate: '2024-01-05',
    expiryDate: '2024-03-20',
    isPinned: false,
    views: 423,
    likes: 56,
    comments: 8,
    tags: ['library', 'finals', 'extended-hours'],
  },
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return 'red';
    case 'high':
      return 'orange';
    case 'medium':
      return 'yellow';
    case 'low':
      return 'blue';
    default:
      return 'gray';
  }
};

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return AlertTriangle;
    case 'high':
      return Bell;
    case 'medium':
      return Info;
    case 'low':
      return CheckCircle;
    default:
      return Info;
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'academic':
      return FileText;
    case 'administrative':
      return User;
    case 'event':
      return Calendar;
    case 'emergency':
      return AlertTriangle;
    case 'general':
      return Info;
    default:
      return Info;
  }
};

const getAttachmentIcon = (type: string) => {
  switch (type) {
    case 'pdf':
      return FileText;
    case 'image':
      return Image;
    case 'document':
      return FileText;
    case 'link':
      return Paperclip;
    default:
      return Paperclip;
  }
};

export function NoticePage(): JSX.Element {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  const filteredNotices = mockNotices.filter((notice) => {
    const matchesSearch =
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || notice.category === selectedCategory;
    const matchesPriority =
      selectedPriority === 'all' || notice.priority === selectedPriority;

    return matchesSearch && matchesCategory && matchesPriority;
  });

  const pinnedNotices = mockNotices.filter((notice) => notice.isPinned);
  const recentNotices = mockNotices.filter(
    (notice) =>
      new Date(notice.publishDate) >=
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  );

  const totalNotices = mockNotices.length;
  const publishedNotices = mockNotices.filter(
    (n) => n.status === 'published'
  ).length;
  const urgentNotices = mockNotices.filter(
    (n) => n.priority === 'urgent'
  ).length;
  const totalViews = mockNotices.reduce((sum, n) => sum + n.views, 0);

  return (
    <DashboardLayout>
      <PageHeader
        title="Notice Board"
        description="Manage announcements, notifications, and important updates"
        actions={[
          {
            label: 'Export Notices',
            icon: Download,
            variant: 'outline',
            onClick: () => console.log('Export notices clicked'),
          },
          {
            label: 'Create Notice',
            icon: Plus,
            isPrimary: true,
            onClick: () => console.log('Create notice clicked'),
          },
        ]}
      />

      <StatsGrid
        stats={[
          {
            title: 'Total Notices',
            value: totalNotices.toString(),
            icon: Bell,
            iconColor: 'text-blue-600',
            iconBgColor: 'bg-blue-100',
          },
          {
            title: 'Published',
            value: publishedNotices.toString(),
            icon: CheckCircle,
            iconColor: 'text-green-600',
            iconBgColor: 'bg-green-100',
          },
          {
            title: 'Urgent',
            value: urgentNotices.toString(),
            icon: AlertTriangle,
            iconColor: 'text-red-600',
            iconBgColor: 'bg-red-100',
          },
          {
            title: 'Total Views',
            value: totalViews.toLocaleString(),
            icon: TrendingUp,
            iconColor: 'text-purple-600',
            iconBgColor: 'bg-purple-100',
          },
        ]}
      />

      {/* Pinned Notices */}
      {pinnedNotices.length > 0 && (
        <Box className="mb-6">
          <Heading size="4" className="text-gray-900 mb-3">
            📌 Pinned Notices
          </Heading>
          <Grid columns="2" gap="4">
            {pinnedNotices.map((notice) => {
              const PriorityIcon = getPriorityIcon(notice.priority);
              return (
                <RadixCard
                  key={notice.id}
                  className="p-4 bg-yellow-50 border-l-4 border-yellow-400"
                >
                  <Flex justify="between" align="start" className="mb-2">
                    <Flex align="center" gap="2">
                      <PriorityIcon
                        className={`w-4 h-4 ${
                          notice.priority === 'urgent'
                            ? 'text-red-600'
                            : notice.priority === 'high'
                              ? 'text-orange-600'
                              : notice.priority === 'medium'
                                ? 'text-yellow-600'
                                : 'text-blue-600'
                        }`}
                      />
                      <Badge color={getPriorityColor(notice.priority)}>
                        {notice.priority}
                      </Badge>
                    </Flex>
                    <Pin className="w-4 h-4 text-yellow-600" />
                  </Flex>
                  <Heading size="3" className="text-gray-900 mb-2">
                    {notice.title}
                  </Heading>
                  <Text size="2" className="text-gray-600 mb-2 line-clamp-2">
                    {notice.content}
                  </Text>
                  <Flex justify="between" align="center">
                    <Text size="1" className="text-gray-500">
                      {notice.author} •{' '}
                      {new Date(notice.publishDate).toLocaleDateString()}
                    </Text>
                    <RadixButton
                      variant="ghost"
                      size="1"
                      onClick={() => setSelectedNotice(notice)}
                    >
                      <Eye className="w-3 h-3" />
                    </RadixButton>
                  </Flex>
                </RadixCard>
              );
            })}
          </Grid>
        </Box>
      )}

      {/* Tabs Navigation */}
      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List className="mb-6">
          <Tabs.Trigger value="all">All Notices</Tabs.Trigger>
          <Tabs.Trigger value="recent">Recent</Tabs.Trigger>
          <Tabs.Trigger value="drafts">Drafts</Tabs.Trigger>
          <Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
        </Tabs.List>

        {/* All Notices Tab */}
        <Tabs.Content value="all">
          {/* Search and Filter */}
          <Flex justify="between" align="center" className="mb-6">
            <Flex gap="3" align="center">
              <Box className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notices..."
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
                <option value="all">All Categories</option>
                <option value="academic">Academic</option>
                <option value="administrative">Administrative</option>
                <option value="event">Event</option>
                <option value="emergency">Emergency</option>
                <option value="general">General</option>
              </select>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </Flex>
          </Flex>

          {/* Notices Grid */}
          <Grid columns="1" gap="4">
            {filteredNotices.map((notice) => {
              const PriorityIcon = getPriorityIcon(notice.priority);
              const CategoryIcon = getCategoryIcon(notice.category);

              return (
                <RadixCard
                  key={notice.id}
                  className="p-6 hover:shadow-lg transition-shadow"
                >
                  <Flex justify="between" align="start">
                    <Flex gap="4" align="start" className="flex-1">
                      <Box className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <CategoryIcon className="w-6 h-6 text-blue-600" />
                      </Box>
                      <Box className="flex-1">
                        <Flex align="center" gap="3" className="mb-2">
                          <Heading size="4" className="text-gray-900">
                            {notice.title}
                          </Heading>
                          <Badge color={getPriorityColor(notice.priority)}>
                            {notice.priority}
                          </Badge>
                          <Badge color="gray">{notice.category}</Badge>
                          {notice.isPinned && (
                            <Pin className="w-4 h-4 text-yellow-600" />
                          )}
                        </Flex>

                        <Text
                          size="2"
                          className="text-gray-600 mb-3 line-clamp-2"
                        >
                          {notice.content}
                        </Text>

                        <Flex justify="between" align="center" className="mb-3">
                          <Flex align="center" gap="4">
                            <Text size="2" className="text-gray-600">
                              <User className="w-4 h-4 inline mr-1" />
                              {notice.author} ({notice.authorRole})
                            </Text>
                            <Text size="2" className="text-gray-600">
                              <Calendar className="w-4 h-4 inline mr-1" />
                              {new Date(
                                notice.publishDate
                              ).toLocaleDateString()}
                            </Text>
                            <Text size="2" className="text-gray-600">
                              <Users className="w-4 h-4 inline mr-1" />
                              {notice.targetAudience}
                            </Text>
                          </Flex>
                        </Flex>

                        {/* Attachments */}
                        {notice.attachments &&
                          notice.attachments.length > 0 && (
                            <Box className="mb-3">
                              <Text size="2" className="text-gray-600 mb-2">
                                Attachments:
                              </Text>
                              <Flex gap="2" wrap="wrap">
                                {notice.attachments.map((attachment) => {
                                  const AttachmentIcon = getAttachmentIcon(
                                    attachment.type
                                  );
                                  return (
                                    <Flex
                                      key={attachment.id}
                                      align="center"
                                      gap="1"
                                      className="px-2 py-1 bg-gray-100 rounded text-sm"
                                    >
                                      <AttachmentIcon className="w-3 h-3 text-gray-600" />
                                      <Text size="1" className="text-gray-600">
                                        {attachment.name}
                                      </Text>
                                      {attachment.size && (
                                        <Text
                                          size="1"
                                          className="text-gray-500"
                                        >
                                          ({attachment.size})
                                        </Text>
                                      )}
                                    </Flex>
                                  );
                                })}
                              </Flex>
                            </Box>
                          )}

                        {/* Tags */}
                        {notice.tags.length > 0 && (
                          <Flex gap="1" wrap="wrap" className="mb-3">
                            {notice.tags.map((tag, index) => (
                              <Badge
                                key={index}
                                color="blue"
                                variant="soft"
                                size="1"
                              >
                                #{tag}
                              </Badge>
                            ))}
                          </Flex>
                        )}

                        {/* Engagement Stats */}
                        <Flex gap="4">
                          <Text size="2" className="text-gray-600">
                            <Eye className="w-4 h-4 inline mr-1" />
                            {notice.views} views
                          </Text>
                          <Text size="2" className="text-gray-600">
                            <Star className="w-4 h-4 inline mr-1" />
                            {notice.likes} likes
                          </Text>
                          <Text size="2" className="text-gray-600">
                            <MessageSquare className="w-4 h-4 inline mr-1" />
                            {notice.comments} comments
                          </Text>
                        </Flex>
                      </Box>
                    </Flex>

                    <Flex gap="2">
                      <RadixButton
                        variant="outline"
                        size="2"
                        onClick={() => setSelectedNotice(notice)}
                      >
                        <Eye className="w-4 h-4" />
                      </RadixButton>
                      <RadixButton variant="outline" size="2">
                        <Edit className="w-4 h-4" />
                      </RadixButton>
                      <RadixButton variant="outline" size="2">
                        <Share className="w-4 h-4" />
                      </RadixButton>
                      <RadixButton variant="ghost" size="2">
                        <Archive className="w-4 h-4" />
                      </RadixButton>
                    </Flex>
                  </Flex>
                </RadixCard>
              );
            })}
          </Grid>
        </Tabs.Content>

        {/* Recent Notices Tab */}
        <Tabs.Content value="recent">
          <Grid columns="2" gap="6">
            {recentNotices.map((notice) => {
              const CategoryIcon = getCategoryIcon(notice.category);
              return (
                <RadixCard
                  key={notice.id}
                  className="p-6 hover:shadow-lg transition-shadow"
                >
                  <Flex direction="column" gap="4">
                    <Flex justify="between" align="start">
                      <Box className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <CategoryIcon className="w-6 h-6 text-blue-600" />
                      </Box>
                      <Badge color={getPriorityColor(notice.priority)}>
                        {notice.priority}
                      </Badge>
                    </Flex>

                    <Box>
                      <Heading size="4" className="text-gray-900 mb-2">
                        {notice.title}
                      </Heading>
                      <Text
                        size="2"
                        className="text-gray-600 mb-3 line-clamp-3"
                      >
                        {notice.content}
                      </Text>
                    </Box>

                    <Flex justify="between" align="center">
                      <Text size="2" className="text-gray-600">
                        {new Date(notice.publishDate).toLocaleDateString()}
                      </Text>
                      <Flex gap="2">
                        <RadixButton variant="outline" size="2">
                          <Eye className="w-4 h-4" />
                        </RadixButton>
                        <RadixButton variant="outline" size="2">
                          <Share className="w-4 h-4" />
                        </RadixButton>
                      </Flex>
                    </Flex>
                  </Flex>
                </RadixCard>
              );
            })}
          </Grid>
        </Tabs.Content>

        {/* Drafts Tab */}
        <Tabs.Content value="drafts">
          <RadixCard className="p-12 text-center">
            <Flex direction="column" align="center" gap="4">
              <Box className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-gray-400" />
              </Box>
              <Box>
                <Heading size="4" className="text-gray-900 mb-2">
                  No Draft Notices
                </Heading>
                <Text size="3" className="text-gray-600 mb-4">
                  You don't have any draft notices at the moment
                </Text>
                <RadixButton variant="solid" size="3">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Notice
                </RadixButton>
              </Box>
            </Flex>
          </RadixCard>
        </Tabs.Content>

        {/* Analytics Tab */}
        <Tabs.Content value="analytics">
          <Grid columns="2" gap="6">
            <RadixCard className="p-6">
              <Heading size="4" className="mb-4">
                Notice Engagement
              </Heading>
              <Box className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <Flex direction="column" align="center" gap="2">
                  <TrendingUp className="w-12 h-12 text-gray-400" />
                  <Text size="2" className="text-gray-600">
                    Engagement analytics chart
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
                    Average Views per Notice
                  </Text>
                  <Text size="2" weight="bold" className="text-blue-600">
                    {Math.round(totalViews / totalNotices)}
                  </Text>
                </Flex>
                <Flex justify="between" align="center">
                  <Text size="2" className="text-gray-600">
                    Engagement Rate
                  </Text>
                  <Text size="2" weight="bold" className="text-green-600">
                    73%
                  </Text>
                </Flex>
                <Flex justify="between" align="center">
                  <Text size="2" className="text-gray-600">
                    Most Popular Category
                  </Text>
                  <Text size="2" weight="bold" className="text-purple-600">
                    Academic
                  </Text>
                </Flex>
                <Flex justify="between" align="center">
                  <Text size="2" className="text-gray-600">
                    Response Time
                  </Text>
                  <Text size="2" weight="bold" className="text-orange-600">
                    2.3 hrs
                  </Text>
                </Flex>
              </Flex>
            </RadixCard>

            <RadixCard className="p-6">
              <Heading size="4" className="mb-4">
                Category Distribution
              </Heading>
              <Flex direction="column" gap="3">
                <Flex justify="between" align="center">
                  <Text size="2" className="text-gray-600">
                    Academic
                  </Text>
                  <Text size="2" weight="medium">
                    40%
                  </Text>
                </Flex>
                <Flex justify="between" align="center">
                  <Text size="2" className="text-gray-600">
                    Administrative
                  </Text>
                  <Text size="2" weight="medium">
                    25%
                  </Text>
                </Flex>
                <Flex justify="between" align="center">
                  <Text size="2" className="text-gray-600">
                    Events
                  </Text>
                  <Text size="2" weight="medium">
                    20%
                  </Text>
                </Flex>
                <Flex justify="between" align="center">
                  <Text size="2" className="text-gray-600">
                    Emergency
                  </Text>
                  <Text size="2" weight="medium">
                    10%
                  </Text>
                </Flex>
                <Flex justify="between" align="center">
                  <Text size="2" className="text-gray-600">
                    General
                  </Text>
                  <Text size="2" weight="medium">
                    5%
                  </Text>
                </Flex>
              </Flex>
            </RadixCard>

            <RadixCard className="p-6">
              <Heading size="4" className="mb-4">
                Top Performing Notices
              </Heading>
              <Flex direction="column" gap="3">
                {mockNotices
                  .sort((a, b) => b.views - a.views)
                  .slice(0, 5)
                  .map((notice, index) => (
                    <Flex
                      key={notice.id}
                      justify="between"
                      align="center"
                      className="p-3 bg-gray-50 rounded-lg"
                    >
                      <Box>
                        <Text size="2" weight="medium" className="line-clamp-1">
                          {notice.title}
                        </Text>
                        <Text size="1" className="text-gray-600">
                          {notice.views} views • {notice.likes} likes
                        </Text>
                      </Box>
                      <Badge color={index < 3 ? 'gold' : 'gray'}>
                        #{index + 1}
                      </Badge>
                    </Flex>
                  ))}
              </Flex>
            </RadixCard>
          </Grid>
        </Tabs.Content>
      </Tabs.Root>

      {/* Notice Detail Modal would go here */}
      {selectedNotice && (
        <Box className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <RadixCard className="max-w-2xl w-full m-4 p-6 max-h-[80vh] overflow-y-auto">
            <Flex justify="between" align="start" className="mb-4">
              <Heading size="5" className="text-gray-900">
                {selectedNotice.title}
              </Heading>
              <RadixButton
                variant="ghost"
                size="2"
                onClick={() => setSelectedNotice(null)}
              >
                ✕
              </RadixButton>
            </Flex>

            <Text size="3" className="text-gray-700 leading-relaxed mb-4">
              {selectedNotice.content}
            </Text>

            <Flex justify="between" align="center">
              <Text size="2" className="text-gray-600">
                By {selectedNotice.author} •{' '}
                {new Date(selectedNotice.publishDate).toLocaleDateString()}
              </Text>
              <Flex gap="2">
                <RadixButton variant="outline" size="2">
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </RadixButton>
                <RadixButton variant="outline" size="2">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </RadixButton>
              </Flex>
            </Flex>
          </RadixCard>
        </Box>
      )}
    </DashboardLayout>
  );
}
