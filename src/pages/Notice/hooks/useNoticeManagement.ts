import {
  Bell,
  AlertTriangle,
  Info,
  CheckCircle,
  FileText,
  User,
  Calendar,
  AlertCircle,
  Zap,
  Paperclip,
  Image,
  Download,
  ExternalLink,
} from 'lucide-react';
import type { PriorityLevel, CategoryType, Attachment } from '../types';

export function useNoticeManagement() {
  // Priority color mapping
  const getPriorityColor = (
    priority: PriorityLevel
  ): 'red' | 'orange' | 'yellow' | 'blue' | 'gray' => {
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

  // Priority icon mapping
  const getPriorityIcon = (priority: PriorityLevel) => {
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

  // Category icon mapping
  const getCategoryIcon = (category: CategoryType) => {
    switch (category) {
      case 'academic':
        return FileText;
      case 'administrative':
        return User;
      case 'event':
        return Calendar;
      case 'emergency':
        return AlertCircle;
      case 'general':
        return Info;
      default:
        return Info;
    }
  };

  // Category color mapping
  const getCategoryColor = (
    category: CategoryType
  ): 'blue' | 'purple' | 'green' | 'red' | 'gray' => {
    switch (category) {
      case 'academic':
        return 'blue';
      case 'administrative':
        return 'purple';
      case 'event':
        return 'green';
      case 'emergency':
        return 'red';
      case 'general':
        return 'gray';
      default:
        return 'gray';
    }
  };

  // Attachment icon mapping
  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case 'pdf':
      case 'document':
        return FileText;
      case 'image':
        return Image;
      case 'link':
        return ExternalLink;
      default:
        return Paperclip;
    }
  };

  // Priority background colors for modern cards
  const getPriorityBgColor = (priority: PriorityLevel): string => {
    switch (priority) {
      case 'urgent':
        return 'from-red-50 to-rose-50';
      case 'high':
        return 'from-orange-50 to-amber-50';
      case 'medium':
        return 'from-yellow-50 to-orange-50';
      case 'low':
        return 'from-blue-50 to-indigo-50';
      default:
        return 'from-gray-50 to-slate-50';
    }
  };

  // Category background colors for modern cards
  const getCategoryBgColor = (category: CategoryType): string => {
    switch (category) {
      case 'academic':
        return 'from-blue-50 to-indigo-50';
      case 'administrative':
        return 'from-purple-50 to-violet-50';
      case 'event':
        return 'from-green-50 to-emerald-50';
      case 'emergency':
        return 'from-red-50 to-rose-50';
      case 'general':
        return 'from-gray-50 to-slate-50';
      default:
        return 'from-gray-50 to-slate-50';
    }
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Format relative time
  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 168) {
      // 7 days
      const days = Math.floor(diffInHours / 24);
      return `${days}d ago`;
    } else {
      return formatDate(dateString);
    }
  };

  // Check if notice is expiring soon (within 3 days)
  const isExpiringSoon = (expiryDate?: string): boolean => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    return expiry <= threeDaysFromNow;
  };

  // Check if notice is expired
  const isExpired = (expiryDate?: string): boolean => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const now = new Date();
    return expiry < now;
  };

  // Get engagement level based on views and interactions
  const getEngagementLevel = (
    views: number,
    likes: number,
    comments: number
  ): 'low' | 'medium' | 'high' => {
    const totalEngagement = views + likes * 2 + comments * 3;
    if (totalEngagement > 500) return 'high';
    if (totalEngagement > 100) return 'medium';
    return 'low';
  };

  // Get engagement color
  const getEngagementColor = (level: 'low' | 'medium' | 'high'): string => {
    switch (level) {
      case 'high':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  // Action handlers (mock implementations)
  const handleViewNotice = (noticeId: string) => {
    console.log('View notice:', noticeId);
    // TODO: Implement notice detail view
  };

  const handleEditNotice = (noticeId: string) => {
    console.log('Edit notice:', noticeId);
    // TODO: Implement notice editing
  };

  const handleDeleteNotice = (noticeId: string) => {
    console.log('Delete notice:', noticeId);
    // TODO: Implement notice deletion with confirmation
  };

  const handlePinNotice = (noticeId: string) => {
    console.log('Pin notice:', noticeId);
    // TODO: Implement notice pinning
  };

  const handleUnpinNotice = (noticeId: string) => {
    console.log('Unpin notice:', noticeId);
    // TODO: Implement notice unpinning
  };

  const handleArchiveNotice = (noticeId: string) => {
    console.log('Archive notice:', noticeId);
    // TODO: Implement notice archiving
  };

  const handlePublishNotice = (noticeId: string) => {
    console.log('Publish notice:', noticeId);
    // TODO: Implement notice publishing
  };

  const handleShareNotice = (noticeId: string) => {
    console.log('Share notice:', noticeId);
    // TODO: Implement notice sharing
  };

  const handleExportNotices = () => {
    console.log('Export notices');
    // TODO: Implement notices export functionality
  };

  const handleCreateNotice = () => {
    console.log('Create new notice');
    // TODO: Implement notice creation
  };

  const handleBulkAction = (action: string, noticeIds: string[]) => {
    console.log(`Bulk ${action}:`, noticeIds);
    // TODO: Implement bulk actions
  };

  // Download attachment
  const handleDownloadAttachment = (attachment: Attachment) => {
    console.log('Download attachment:', attachment);
    // TODO: Implement attachment download
  };

  return {
    // Color and styling helpers
    getPriorityColor,
    getCategoryColor,
    getPriorityBgColor,
    getCategoryBgColor,
    getEngagementColor,

    // Icon helpers
    getPriorityIcon,
    getCategoryIcon,
    getAttachmentIcon,

    // Date and time helpers
    formatDate,
    formatRelativeTime,

    // Status helpers
    isExpiringSoon,
    isExpired,
    getEngagementLevel,

    // Action handlers
    handleViewNotice,
    handleEditNotice,
    handleDeleteNotice,
    handlePinNotice,
    handleUnpinNotice,
    handleArchiveNotice,
    handlePublishNotice,
    handleShareNotice,
    handleExportNotices,
    handleCreateNotice,
    handleBulkAction,
    handleDownloadAttachment,
  };
}
