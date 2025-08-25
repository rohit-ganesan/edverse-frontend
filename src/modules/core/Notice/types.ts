export interface Notice {
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

export interface Attachment {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'document' | 'link';
  url: string;
  size?: string;
}

export interface NoticeAnalytics {
  totalNotices: number;
  publishedNotices: number;
  draftNotices: number;
  archivedNotices: number;
  urgentNotices: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  averageEngagement: number;
  topCategories: CategoryAnalysis[];
  engagementTrend: EngagementData[];
  audienceReach: AudienceData[];
}

export interface CategoryAnalysis {
  category: string;
  count: number;
  views: number;
  engagement: number;
  color: string;
}

export interface EngagementData {
  date: string;
  views: number;
  likes: number;
  comments: number;
}

export interface AudienceData {
  audience: string;
  count: number;
  percentage: number;
}

export interface NoticeFilters {
  search: string;
  category: string;
  priority: string;
  status: string;
  targetAudience: string;
  dateRange: {
    start?: string;
    end?: string;
  };
  tags: string[];
}

export interface DraftNotice {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: string;
  targetAudience: string;
  tags: string[];
  attachments: Attachment[];
  lastModified: string;
  autoSaveEnabled: boolean;
}

export type NoticeTab = 'all' | 'recent' | 'drafts' | 'analytics';

export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';
export type CategoryType =
  | 'academic'
  | 'administrative'
  | 'event'
  | 'emergency'
  | 'general';
export type StatusType = 'draft' | 'published' | 'archived';
export type AudienceType =
  | 'all'
  | 'students'
  | 'instructors'
  | 'administrators';
