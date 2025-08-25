import { useState } from 'react';
import { RadixCard } from 'components/ui/RadixCard';
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  User,
  Users,
  Eye,
  MessageSquare,
  Pin,
  Clock,
  Paperclip,
  Share,
  Edit,
} from 'lucide-react';
import { useNoticeManagement } from '../hooks/useNoticeManagement';
import type { Notice } from '../types';

interface ImprovedNoticeCardProps {
  notice: Notice;
  onViewDetails?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function ImprovedNoticeCard({
  notice,
  onViewDetails,
  className = '',
  style,
}: ImprovedNoticeCardProps): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false);

  const { getCategoryIcon, formatRelativeTime, isExpiringSoon, isExpired } =
    useNoticeManagement();

  const CategoryIcon = getCategoryIcon(notice.category);
  const isExpiringWarning = isExpiringSoon(notice.expiryDate);
  const hasExpired = isExpired(notice.expiryDate);

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleViewDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onViewDetails) {
      onViewDetails();
    }
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Handle other actions like Share, Edit
  };

  const getPriorityIndicatorColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'high':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <RadixCard
      className={`relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer border border-gray-200 bg-white ${hasExpired ? 'opacity-60' : ''} ${className}`}
      style={style}
      onClick={handleCardClick}
    >
      {/* Priority Indicator */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${getPriorityIndicatorColor(notice.priority)}`}
      />

      {/* Main Content */}
      <div className="p-4 pl-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Category Icon */}
            <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <CategoryIcon className="w-4 h-4 text-gray-600" />
            </div>

            {/* Title and Meta */}
            <div className="flex-1 min-w-0">
              {/* Title Row */}
              <div className="flex items-center gap-2 mb-1.5">
                <h3 className="text-base font-semibold text-gray-900 truncate leading-tight">
                  {notice.title}
                </h3>
                {notice.isPinned && (
                  <Pin className="w-4 h-4 text-amber-500 flex-shrink-0" />
                )}
                {isExpiringWarning && !hasExpired && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200">
                    Expiring Soon
                  </span>
                )}
                {hasExpired && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                    Expired
                  </span>
                )}
              </div>

              {/* Meta Info Row */}
              <div className="flex items-center gap-3 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span className="font-medium">{notice.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatRelativeTime(notice.publishDate)}</span>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${getPriorityBadgeColor(notice.priority)}`}
                >
                  {notice.priority}
                </span>
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 flex-shrink-0 ml-3">
            {/* Stats */}
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span className="font-medium">{notice.views}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                <span className="font-medium">{notice.comments}</span>
              </div>
            </div>

            {/* Expand Indicator */}
            <div className="p-1 rounded text-gray-400">
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
          </div>
        </div>

        {/* Content Preview */}
        <div className="mb-3">
          <p
            className={`text-gray-700 text-sm leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}
          >
            {notice.content}
          </p>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="border-t border-gray-100 pt-3 space-y-3">
            {/* Two Column Layout for Meta Information */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-gray-600">
                <Users className="w-3 h-3 text-gray-400" />
                <span className="font-medium text-gray-500">Target:</span>
                <span className="capitalize">{notice.targetAudience}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600">
                <Clock className="w-3 h-3 text-gray-400" />
                <span className="font-medium text-gray-500">Category:</span>
                <span className="capitalize">{notice.category}</span>
              </div>
              {notice.expiryDate && (
                <div className="flex items-center gap-1.5 text-gray-600 col-span-2 lg:col-span-1">
                  <Calendar className="w-3 h-3 text-gray-400" />
                  <span className="font-medium text-gray-500">Expires:</span>
                  <span>
                    {new Date(notice.expiryDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {/* Compact Attachments and Tags Row */}
            <div className="flex flex-wrap items-start gap-4">
              {/* Attachments */}
              {notice.attachments && notice.attachments.length > 0 && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h4 className="text-xs font-semibold text-gray-900">
                      Attachments ({notice.attachments.length})
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {notice.attachments.slice(0, 2).map((attachment) => (
                      <div
                        key={attachment.id}
                        onClick={handleActionClick}
                        className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 hover:bg-gray-100 rounded text-xs text-gray-700 transition-colors cursor-pointer border border-gray-200"
                      >
                        <Paperclip className="w-3 h-3 text-gray-500" />
                        <span className="font-medium truncate max-w-24">
                          {attachment.name}
                        </span>
                        {attachment.size && (
                          <span className="text-xs text-gray-500">
                            ({attachment.size})
                          </span>
                        )}
                      </div>
                    ))}
                    {notice.attachments.length > 2 && (
                      <div className="flex items-center px-2 py-1 text-xs text-gray-500">
                        +{notice.attachments.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tags */}
              {notice.tags && notice.tags.length > 0 && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h4 className="text-xs font-semibold text-gray-900">
                      Tags
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {notice.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                      >
                        #{tag}
                      </span>
                    ))}
                    {notice.tags.length > 4 && (
                      <span className="inline-flex items-center px-1.5 py-0.5 text-xs text-gray-500">
                        +{notice.tags.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Compact Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleViewDetailsClick}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors"
              >
                <Eye className="w-3 h-3" />
                View Details
              </button>
              <button
                onClick={handleActionClick}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium rounded border border-gray-200 transition-colors"
              >
                <Share className="w-3 h-3" />
                Share
              </button>
              <button
                onClick={handleActionClick}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium rounded border border-gray-200 transition-colors"
              >
                <Edit className="w-3 h-3" />
                Edit
              </button>
            </div>
          </div>
        )}
      </div>
    </RadixCard>
  );
}
