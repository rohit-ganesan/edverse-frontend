import { useState, useMemo, useEffect } from 'react';
import type { Notice, NoticeFilters, NoticeAnalytics } from '../types';

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
  {
    id: '5',
    title: 'Student Council Elections',
    content:
      'Nominations for Student Council positions are now open. Interested candidates must submit their applications by February 1st. Elections will be held on February 15th.',
    author: 'Student Affairs Office',
    authorRole: 'Student Affairs Coordinator',
    targetAudience: 'students',
    priority: 'medium',
    category: 'event',
    status: 'published',
    publishDate: '2024-01-15',
    expiryDate: '2024-02-20',
    isPinned: false,
    views: 234,
    likes: 34,
    comments: 12,
    tags: ['elections', 'student-council', 'nominations'],
  },
  {
    id: '6',
    title: 'Faculty Meeting - Curriculum Review',
    content:
      'All faculty members are required to attend the curriculum review meeting scheduled for January 25th at 2:00 PM in Conference Room A.',
    author: 'Dr. Michael Johnson',
    authorRole: 'Department Head',
    targetAudience: 'instructors',
    priority: 'high',
    category: 'administrative',
    status: 'published',
    publishDate: '2024-01-18',
    isPinned: false,
    views: 89,
    likes: 12,
    comments: 5,
    tags: ['faculty', 'curriculum', 'meeting'],
  },
];

const mockDraftNotices: Notice[] = [
  {
    id: 'draft-1',
    title: 'Summer Course Registration',
    content:
      'Summer course registration will begin soon. More details to follow.',
    author: 'Dr. Jennifer Smith',
    authorRole: 'Academic Dean',
    targetAudience: 'students',
    priority: 'medium',
    category: 'academic',
    status: 'draft',
    publishDate: '2024-01-20',
    isPinned: false,
    views: 0,
    likes: 0,
    comments: 0,
    tags: ['summer', 'registration', 'courses'],
    attachments: [],
  },
  {
    id: 'draft-2',
    title: 'New Parking Regulations',
    content:
      'Updated parking regulations for the campus. Draft pending review.',
    author: 'Campus Security',
    authorRole: 'Security Chief',
    targetAudience: 'all',
    priority: 'medium',
    category: 'administrative',
    status: 'draft',
    publishDate: '2024-01-22',
    isPinned: false,
    views: 0,
    likes: 0,
    comments: 0,
    tags: ['parking', 'regulations', 'campus'],
    attachments: [],
  },
];

export function useNoticeData() {
  const [filters, setFilters] = useState<NoticeFilters>({
    search: '',
    category: 'all',
    priority: 'all',
    status: 'all',
    targetAudience: 'all',
    dateRange: {},
    tags: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timeout);
  }, []);

  // Combine published and draft notices for all notices view
  const allNotices = useMemo(() => [...mockNotices, ...mockDraftNotices], []);

  // Filter notices based on current filters
  const filteredNotices = useMemo(() => {
    return allNotices.filter((notice) => {
      const matchesSearch =
        notice.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        notice.content.toLowerCase().includes(filters.search.toLowerCase()) ||
        notice.author.toLowerCase().includes(filters.search.toLowerCase());

      const matchesCategory =
        filters.category === 'all' || notice.category === filters.category;

      const matchesPriority =
        filters.priority === 'all' || notice.priority === filters.priority;

      const matchesStatus =
        filters.status === 'all' || notice.status === filters.status;

      const matchesAudience =
        filters.targetAudience === 'all' ||
        notice.targetAudience === filters.targetAudience;

      const matchesTags =
        filters.tags.length === 0 ||
        filters.tags.some((tag) => notice.tags.includes(tag));

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPriority &&
        matchesStatus &&
        matchesAudience &&
        matchesTags
      );
    });
  }, [allNotices, filters]);

  // Get pinned notices
  const pinnedNotices = useMemo(() => {
    return mockNotices.filter((notice) => notice.isPinned);
  }, []);

  // Get recent notices (last 7 days)
  const recentNotices = useMemo(() => {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return mockNotices.filter(
      (notice) => new Date(notice.publishDate) >= sevenDaysAgo
    );
  }, []);

  // Get draft notices
  const draftNotices = useMemo(() => {
    return mockDraftNotices;
  }, []);

  // Calculate analytics
  const analytics = useMemo((): NoticeAnalytics => {
    const totalNotices = allNotices.length;
    const publishedNotices = allNotices.filter(
      (n) => n.status === 'published'
    ).length;
    const draftNotices = allNotices.filter((n) => n.status === 'draft').length;
    const archivedNotices = allNotices.filter(
      (n) => n.status === 'archived'
    ).length;
    const urgentNotices = allNotices.filter(
      (n) => n.priority === 'urgent'
    ).length;
    const totalViews = allNotices.reduce((sum, n) => sum + n.views, 0);
    const totalLikes = allNotices.reduce((sum, n) => sum + n.likes, 0);
    const totalComments = allNotices.reduce((sum, n) => sum + n.comments, 0);
    const averageEngagement =
      totalNotices > 0 ? (totalLikes + totalComments) / totalNotices : 0;

    // Category analysis
    const categoryStats = allNotices.reduce(
      (acc, notice) => {
        if (!acc[notice.category]) {
          acc[notice.category] = { count: 0, views: 0, engagement: 0 };
        }
        acc[notice.category].count++;
        acc[notice.category].views += notice.views;
        acc[notice.category].engagement += notice.likes + notice.comments;
        return acc;
      },
      {} as Record<string, { count: number; views: number; engagement: number }>
    );

    const topCategories = Object.entries(categoryStats).map(
      ([category, stats]) => ({
        category,
        count: stats.count,
        views: stats.views,
        engagement: stats.engagement,
        color: getCategoryColor(category),
      })
    );

    // Mock engagement trend data
    const engagementTrend = [
      { date: '2024-01-01', views: 120, likes: 15, comments: 8 },
      { date: '2024-01-02', views: 145, likes: 22, comments: 12 },
      { date: '2024-01-03', views: 198, likes: 31, comments: 18 },
      { date: '2024-01-04', views: 167, likes: 28, comments: 15 },
      { date: '2024-01-05', views: 203, likes: 35, comments: 22 },
      { date: '2024-01-06', views: 189, likes: 29, comments: 19 },
      { date: '2024-01-07', views: 234, likes: 42, comments: 26 },
    ];

    // Audience reach data
    const audienceStats = allNotices.reduce(
      (acc, notice) => {
        if (!acc[notice.targetAudience]) {
          acc[notice.targetAudience] = 0;
        }
        acc[notice.targetAudience]++;
        return acc;
      },
      {} as Record<string, number>
    );

    const audienceReach = Object.entries(audienceStats).map(
      ([audience, count]) => ({
        audience,
        count,
        percentage: (count / totalNotices) * 100,
      })
    );

    return {
      totalNotices,
      publishedNotices,
      draftNotices,
      archivedNotices,
      urgentNotices,
      totalViews,
      totalLikes,
      totalComments,
      averageEngagement,
      topCategories,
      engagementTrend,
      audienceReach,
    };
  }, [allNotices]);

  return {
    notices: filteredNotices,
    pinnedNotices,
    recentNotices,
    draftNotices,
    analytics,
    filters,
    setFilters,
    updateFilter: (key: keyof NoticeFilters, value: any) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    resetFilters: () => {
      setFilters({
        search: '',
        category: 'all',
        priority: 'all',
        status: 'all',
        targetAudience: 'all',
        dateRange: {},
        tags: [],
      });
    },
    isLoading,
  };
}

function getCategoryColor(category: string): string {
  switch (category) {
    case 'academic':
      return '#3B82F6'; // blue
    case 'administrative':
      return '#8B5CF6'; // purple
    case 'event':
      return '#10B981'; // green
    case 'emergency':
      return '#EF4444'; // red
    case 'general':
      return '#6B7280'; // gray
    default:
      return '#6B7280';
  }
}
