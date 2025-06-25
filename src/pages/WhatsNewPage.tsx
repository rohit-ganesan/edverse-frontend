import React, { useState } from 'react';
import { Box, Flex, Text, Heading, Badge, Grid } from '@radix-ui/themes';
import { DashboardLayout } from 'components/layout/DashboardLayout';
import { PageHeader } from 'components/ui/PageHeader';
import { RadixCard } from 'components/ui/RadixCard';
import { RadixButton } from 'components/ui/RadixButton';
import { TabContainer } from 'components/ui/TabContainer';
import {
  ModernStatsGridColored,
  ColoredStatItem,
} from 'components/ui/ModernStatsGridColored';
import {
  Sparkles,
  Calendar,
  Star,
  Zap,
  Shield,
  BarChart3,
  Smartphone,
  Palette,
  Bug,
  ArrowRight,
  ExternalLink,
  CheckCircle,
  Clock,
  AlertCircle,
  Lightbulb,
  Rocket,
  Heart,
  Download,
  Play,
  TrendingUp,
  Target,
  Activity,
} from 'lucide-react';

interface Update {
  id: string;
  version: string;
  date: string;
  type: 'major' | 'minor' | 'patch' | 'hotfix';
  title: string;
  description: string;
  features: string[];
  status: 'released' | 'beta' | 'coming-soon';
  category: 'feature' | 'improvement' | 'bugfix' | 'security';
}

interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'feature' | 'maintenance' | 'event' | 'promotion';
  priority: 'high' | 'medium' | 'low';
  actionLabel?: string;
  actionUrl?: string;
}

export function WhatsNewPage(): JSX.Element {
  const [activeTab, setActiveTab] = useState('updates');

  const updates: Update[] = [
    {
      id: '1',
      version: '2.4.0',
      date: '2024-01-15',
      type: 'major',
      title: 'Enhanced Dashboard Analytics',
      description:
        'Complete redesign of the dashboard with new analytics capabilities and improved user experience.',
      features: [
        'Modern dashboard with gradient cards',
        'Real-time attendance tracking',
        'Advanced financial reporting',
        'Improved mobile responsiveness',
        'Dark mode support',
      ],
      status: 'released',
      category: 'feature',
    },
    {
      id: '2',
      version: '2.3.5',
      date: '2024-01-10',
      type: 'minor',
      title: 'Student Management Improvements',
      description:
        'Enhanced student profile management with better data visualization and bulk operations.',
      features: [
        'Bulk student import/export',
        'Enhanced student profiles',
        'Improved search functionality',
        'Better parent communication tools',
      ],
      status: 'released',
      category: 'improvement',
    },
    {
      id: '3',
      version: '2.5.0',
      date: '2024-02-01',
      type: 'major',
      title: 'AI-Powered Insights',
      description:
        'Introducing artificial intelligence to help predict student performance and optimize resource allocation.',
      features: [
        'Predictive analytics for student performance',
        'Automated attendance pattern recognition',
        'Smart resource allocation suggestions',
        'Intelligent report generation',
      ],
      status: 'coming-soon',
      category: 'feature',
    },
  ];

  const announcements: Announcement[] = [
    {
      id: '1',
      title: 'System Maintenance Scheduled',
      description:
        'We will be performing routine maintenance on January 20th from 2:00 AM to 4:00 AM EST.',
      date: '2024-01-18',
      type: 'maintenance',
      priority: 'high',
    },
    {
      id: '2',
      title: 'New Training Webinar Series',
      description:
        'Join our weekly training sessions to learn about the latest features and best practices.',
      date: '2024-01-16',
      type: 'event',
      priority: 'medium',
      actionLabel: 'Register Now',
      actionUrl: '#',
    },
    {
      id: '3',
      title: 'Holiday Promotion - 20% Off Premium Features',
      description:
        'Upgrade to premium and get access to advanced analytics and priority support.',
      date: '2024-01-14',
      type: 'promotion',
      priority: 'medium',
      actionLabel: 'Learn More',
      actionUrl: '#',
    },
  ];

  const whatsNewStats: ColoredStatItem[] = [
    {
      title: 'New Features',
      value: '12',
      icon: Rocket,
      gradient: {
        from: 'from-blue-50',
        to: 'to-indigo-50',
      },
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-100',
      trend: {
        icon: TrendingUp,
        value: '+3 this month',
        color: 'text-green-600',
      },
    },
    {
      title: 'Updates Released',
      value: updates.filter((u) => u.status === 'released').length,
      icon: CheckCircle,
      gradient: {
        from: 'from-green-50',
        to: 'to-emerald-50',
      },
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-100',
      trend: {
        icon: Activity,
        value: '2 this week',
        color: 'text-blue-600',
      },
    },
    {
      title: 'Announcements',
      value: announcements.length,
      icon: Calendar,
      gradient: {
        from: 'from-purple-50',
        to: 'to-violet-50',
      },
      iconColor: 'text-purple-600',
      iconBgColor: 'bg-purple-100',
      trend: {
        icon: Star,
        value: `${announcements.filter((a) => a.priority === 'high').length} high priority`,
        color: 'text-orange-600',
      },
    },
    {
      title: 'Coming Soon',
      value: updates.filter((u) => u.status === 'coming-soon').length,
      icon: Lightbulb,
      gradient: {
        from: 'from-orange-50',
        to: 'to-amber-50',
      },
      iconColor: 'text-orange-600',
      iconBgColor: 'bg-orange-100',
      trend: {
        icon: Target,
        value: 'Q1 2024',
        color: 'text-purple-600',
      },
    },
  ];

  const getUpdateIcon = (category: string) => {
    switch (category) {
      case 'feature':
        return <Rocket className="w-5 h-5" />;
      case 'improvement':
        return <Zap className="w-5 h-5" />;
      case 'bugfix':
        return <Bug className="w-5 h-5" />;
      case 'security':
        return <Shield className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const getUpdateColor = (category: string) => {
    switch (category) {
      case 'feature':
        return 'blue';
      case 'improvement':
        return 'green';
      case 'bugfix':
        return 'orange';
      case 'security':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'released':
        return <CheckCircle className="w-4 h-4" />;
      case 'beta':
        return <Clock className="w-4 h-4" />;
      case 'coming-soon':
        return <Lightbulb className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getAnnouncementIcon = (type: string) => {
    switch (type) {
      case 'feature':
        return <Star className="w-5 h-5" />;
      case 'maintenance':
        return <AlertCircle className="w-5 h-5" />;
      case 'event':
        return <Calendar className="w-5 h-5" />;
      case 'promotion':
        return <Heart className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const getAnnouncementColor = (type: string) => {
    switch (type) {
      case 'feature':
        return 'blue';
      case 'maintenance':
        return 'orange';
      case 'event':
        return 'purple';
      case 'promotion':
        return 'green';
      default:
        return 'gray';
    }
  };

  const tabs = [
    {
      value: 'updates',
      label: 'Latest Updates',
      content: (
        <Box className="space-y-6">
          {/* Feature Highlights */}
          <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
            <Box className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
              <Flex align="center" gap="3">
                <Box className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-blue-600" />
                </Box>
                <Box>
                  <Heading size="4" className="text-gray-900 mb-1">
                    Feature Highlights
                  </Heading>
                  <Text size="2" className="text-gray-600">
                    Discover the most exciting new features and improvements
                  </Text>
                </Box>
              </Flex>
            </Box>

            <Box className="p-6">
              <Grid columns="3" gap="6">
                <Box className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                  <Flex align="center" gap="3" className="mb-3">
                    <Palette className="w-6 h-6 text-purple-600" />
                    <Text size="3" weight="medium" className="text-gray-900">
                      Modern UI Design
                    </Text>
                  </Flex>
                  <Text size="2" className="text-gray-600 mb-3">
                    Completely redesigned interface with modern gradients and
                    improved accessibility
                  </Text>
                  <RadixButton variant="soft" size="1">
                    <Play className="w-3 h-3 mr-1" />
                    View Demo
                  </RadixButton>
                </Box>

                <Box className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100">
                  <Flex align="center" gap="3" className="mb-3">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                    <Text size="3" weight="medium" className="text-gray-900">
                      Advanced Analytics
                    </Text>
                  </Flex>
                  <Text size="2" className="text-gray-600 mb-3">
                    Real-time insights and predictive analytics for better
                    decision making
                  </Text>
                  <RadixButton variant="soft" size="1">
                    <ArrowRight className="w-3 h-3 mr-1" />
                    Learn More
                  </RadixButton>
                </Box>

                <Box className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-100">
                  <Flex align="center" gap="3" className="mb-3">
                    <Smartphone className="w-6 h-6 text-orange-600" />
                    <Text size="3" weight="medium" className="text-gray-900">
                      Mobile Optimized
                    </Text>
                  </Flex>
                  <Text size="2" className="text-gray-600 mb-3">
                    Fully responsive design that works perfectly on all devices
                  </Text>
                  <RadixButton variant="soft" size="1">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Try Mobile
                  </RadixButton>
                </Box>
              </Grid>
            </Box>
          </RadixCard>

          {/* Version Updates */}
          <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
            <Box className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
              <Flex justify="between" align="center">
                <Box>
                  <Heading size="4" className="text-gray-900 mb-1">
                    Version Updates
                  </Heading>
                  <Text size="2" className="text-gray-600">
                    Complete changelog of all recent updates
                  </Text>
                </Box>
                <Badge color="green" variant="soft" size="2">
                  {updates.filter((u) => u.status === 'released').length}{' '}
                  Released
                </Badge>
              </Flex>
            </Box>

            <Box className="p-6">
              <Box className="space-y-6">
                {updates.map((update) => (
                  <Box
                    key={update.id}
                    className="border border-gray-200 rounded-lg p-6"
                  >
                    <Flex justify="between" align="start" className="mb-4">
                      <Flex align="center" gap="3">
                        <Box
                          className={`w-10 h-10 bg-${getUpdateColor(update.category)}-100 rounded-lg flex items-center justify-center`}
                        >
                          <Box
                            className={`text-${getUpdateColor(update.category)}-600`}
                          >
                            {getUpdateIcon(update.category)}
                          </Box>
                        </Box>
                        <Box>
                          <Flex align="center" gap="2" className="mb-1">
                            <Heading size="3" className="text-gray-900">
                              {update.title}
                            </Heading>
                            <Badge
                              color={getUpdateColor(update.category)}
                              variant="soft"
                              size="1"
                            >
                              v{update.version}
                            </Badge>
                          </Flex>
                          <Text size="2" className="text-gray-600">
                            {update.description}
                          </Text>
                        </Box>
                      </Flex>
                      <Flex align="center" gap="2">
                        <Box
                          className={`text-${update.status === 'released' ? 'green' : update.status === 'beta' ? 'orange' : 'blue'}-600`}
                        >
                          {getStatusIcon(update.status)}
                        </Box>
                        <Text size="1" className="text-gray-500">
                          {new Date(update.date).toLocaleDateString()}
                        </Text>
                      </Flex>
                    </Flex>

                    <Box className="ml-13">
                      <Text
                        size="2"
                        weight="medium"
                        className="text-gray-900 mb-2"
                      >
                        What's New:
                      </Text>
                      <Box className="space-y-1">
                        {update.features.map((feature, index) => (
                          <Flex key={index} align="center" gap="2">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <Text size="2" className="text-gray-700">
                              {feature}
                            </Text>
                          </Flex>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </RadixCard>
        </Box>
      ),
    },
    {
      value: 'announcements',
      label: 'Announcements',
      content: (
        <Box className="space-y-6">
          <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
            <Box className="p-6 bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-100">
              <Flex justify="between" align="center">
                <Box>
                  <Heading size="4" className="text-gray-900 mb-1">
                    Recent Announcements
                  </Heading>
                  <Text size="2" className="text-gray-600">
                    Important updates and notifications
                  </Text>
                </Box>
                <Badge color="purple" variant="soft" size="2">
                  {announcements.length} Active
                </Badge>
              </Flex>
            </Box>

            <Box className="p-6">
              <Box className="space-y-4">
                {announcements.map((announcement) => (
                  <Box
                    key={announcement.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
                  >
                    <Flex justify="between" align="start">
                      <Flex align="start" gap="3">
                        <Box
                          className={`w-8 h-8 bg-${getAnnouncementColor(announcement.type)}-100 rounded-lg flex items-center justify-center flex-shrink-0`}
                        >
                          <Box
                            className={`text-${getAnnouncementColor(announcement.type)}-600`}
                          >
                            {getAnnouncementIcon(announcement.type)}
                          </Box>
                        </Box>
                        <Box className="flex-1">
                          <Flex align="center" gap="2" className="mb-1">
                            <Heading size="3" className="text-gray-900">
                              {announcement.title}
                            </Heading>
                            <Badge
                              color={
                                announcement.priority === 'high'
                                  ? 'red'
                                  : announcement.priority === 'medium'
                                    ? 'orange'
                                    : 'gray'
                              }
                              variant="soft"
                              size="1"
                            >
                              {announcement.priority}
                            </Badge>
                          </Flex>
                          <Text size="2" className="text-gray-600 mb-2">
                            {announcement.description}
                          </Text>
                          <Text size="1" className="text-gray-500">
                            {new Date(announcement.date).toLocaleDateString()}
                          </Text>
                        </Box>
                      </Flex>
                      {announcement.actionLabel && (
                        <RadixButton variant="soft" size="1">
                          {announcement.actionLabel}
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </RadixButton>
                      )}
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
      value: 'roadmap',
      label: 'Roadmap',
      content: (
        <Box className="space-y-6">
          <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
            <Box className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
              <Flex align="center" gap="3">
                <Box className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-orange-600" />
                </Box>
                <Box>
                  <Heading size="4" className="text-gray-900 mb-1">
                    Product Roadmap
                  </Heading>
                  <Text size="2" className="text-gray-600">
                    Upcoming features and improvements planned for future
                    releases
                  </Text>
                </Box>
              </Flex>
            </Box>

            <Box className="p-6">
              <Box className="space-y-6">
                {/* Roadmap items */}
                <Box className="space-y-4">
                  <Box className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
                    <Flex align="center" gap="2" className="mb-2">
                      <Badge color="blue" variant="soft" size="1">
                        Q1 2024
                      </Badge>
                      <Text size="2" weight="medium" className="text-gray-900">
                        AI-Powered Analytics
                      </Text>
                    </Flex>
                    <Text size="2" className="text-gray-600">
                      Advanced machine learning algorithms for predictive
                      insights and automated reporting
                    </Text>
                  </Box>

                  <Box className="p-4 border-l-4 border-green-500 bg-green-50 rounded-r-lg">
                    <Flex align="center" gap="2" className="mb-2">
                      <Badge color="green" variant="soft" size="1">
                        Q2 2024
                      </Badge>
                      <Text size="2" weight="medium" className="text-gray-900">
                        Mobile App Launch
                      </Text>
                    </Flex>
                    <Text size="2" className="text-gray-600">
                      Native mobile applications for iOS and Android with full
                      feature parity
                    </Text>
                  </Box>

                  <Box className="p-4 border-l-4 border-purple-500 bg-purple-50 rounded-r-lg">
                    <Flex align="center" gap="2" className="mb-2">
                      <Badge color="purple" variant="soft" size="1">
                        Q3 2024
                      </Badge>
                      <Text size="2" weight="medium" className="text-gray-900">
                        Advanced Integrations
                      </Text>
                    </Flex>
                    <Text size="2" className="text-gray-600">
                      Seamless integration with popular third-party tools and
                      platforms
                    </Text>
                  </Box>
                </Box>
              </Box>
            </Box>
          </RadixCard>
        </Box>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="What's New"
        description="Stay updated with the latest features, improvements, and announcements"
        actions={[
          {
            label: 'Subscribe to Updates',
            icon: Download,
            onClick: () => console.log('Subscribe clicked'),
          },
          {
            label: 'View Changelog',
            icon: ExternalLink,
            onClick: () => console.log('Changelog clicked'),
            isPrimary: true,
          },
        ]}
      />

      <ModernStatsGridColored
        stats={whatsNewStats}
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
