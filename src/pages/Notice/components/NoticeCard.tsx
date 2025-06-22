import { Box, Flex, Text, Heading, Badge } from '@radix-ui/themes';
import { RadixCard } from 'components/ui/RadixCard';
import { RadixButton } from 'components/ui/RadixButton';
import {
  Eye,
  Edit,
  Share,
  Archive,
  Pin,
  PinOff,
  User,
  Calendar,
  Users,
  Star,
  MessageSquare,
  Paperclip,
} from 'lucide-react';
import { useNoticeManagement } from '../hooks/useNoticeManagement';
import type { Notice } from '../types';

interface NoticeCardProps {
  notice: Notice;
  showActions?: boolean;
  compact?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function NoticeCard({
  notice,
  showActions = true,
  compact = false,
  className = '',
  style,
}: NoticeCardProps): JSX.Element {
  const {
    getPriorityColor,
    getCategoryIcon,
    getAttachmentIcon,
    formatRelativeTime,
    isExpiringSoon,
    isExpired,
    handleViewNotice,
    handleEditNotice,
    handleShareNotice,
    handleArchiveNotice,
    handlePinNotice,
    handleUnpinNotice,
  } = useNoticeManagement();

  const CategoryIcon = getCategoryIcon(notice.category);
  const isExpiringWarning = isExpiringSoon(notice.expiryDate);
  const hasExpired = isExpired(notice.expiryDate);

  if (compact) {
    return (
      <RadixCard
        className={`p-4 hover:shadow-lg transition-all duration-200 ${className}`}
        style={style}
      >
        <Flex gap="3" align="start">
          <Box className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <CategoryIcon className="w-5 h-5 text-blue-600" />
          </Box>

          <Box className="flex-1 min-w-0">
            <Flex align="center" gap="2" className="mb-2">
              <Heading size="3" className="text-gray-900 truncate">
                {notice.title}
              </Heading>
              <Badge color={getPriorityColor(notice.priority)} size="1">
                {notice.priority}
              </Badge>
              {notice.isPinned && (
                <Pin className="w-3 h-3 text-yellow-600 flex-shrink-0" />
              )}
            </Flex>

            <Text size="2" className="text-gray-600 line-clamp-2 mb-2">
              {notice.content}
            </Text>

            <Flex justify="between" align="center">
              <Text size="1" className="text-gray-500">
                {formatRelativeTime(notice.publishDate)}
              </Text>
              {showActions && (
                <Flex gap="1">
                  <RadixButton
                    variant="ghost"
                    size="1"
                    onClick={() => handleViewNotice(notice.id)}
                  >
                    <Eye className="w-3 h-3" />
                  </RadixButton>
                  <RadixButton
                    variant="ghost"
                    size="1"
                    onClick={() => handleShareNotice(notice.id)}
                  >
                    <Share className="w-3 h-3" />
                  </RadixButton>
                </Flex>
              )}
            </Flex>
          </Box>
        </Flex>
      </RadixCard>
    );
  }

  return (
    <RadixCard
      className={`p-6 hover:shadow-lg transition-all duration-200 ${hasExpired ? 'opacity-75' : ''} ${className}`}
      style={style}
    >
      <Flex justify="between" align="start">
        <Flex gap="4" align="start" className="flex-1">
          <Box className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <CategoryIcon className="w-6 h-6 text-blue-600" />
          </Box>

          <Box className="flex-1 min-w-0">
            {/* Title and Badges */}
            <Flex align="center" gap="3" className="mb-2 flex-wrap">
              <Heading size="4" className="text-gray-900">
                {notice.title}
              </Heading>
              <Badge color={getPriorityColor(notice.priority)}>
                {notice.priority}
              </Badge>
              <Badge color="gray">{notice.category}</Badge>
              {notice.status === 'draft' && <Badge color="yellow">Draft</Badge>}
              {notice.isPinned && <Pin className="w-4 h-4 text-yellow-600" />}
              {isExpiringWarning && !hasExpired && (
                <Badge color="orange" variant="soft">
                  Expiring Soon
                </Badge>
              )}
              {hasExpired && (
                <Badge color="red" variant="soft">
                  Expired
                </Badge>
              )}
            </Flex>

            {/* Content */}
            <Text size="2" className="text-gray-600 mb-3 line-clamp-2">
              {notice.content}
            </Text>

            {/* Metadata */}
            <Flex justify="between" align="center" className="mb-3">
              <Flex align="center" gap="4" className="flex-wrap">
                <Text size="2" className="text-gray-600">
                  <User className="w-4 h-4 inline mr-1" />
                  {notice.author} ({notice.authorRole})
                </Text>
                <Text size="2" className="text-gray-600">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  {formatRelativeTime(notice.publishDate)}
                </Text>
                <Text size="2" className="text-gray-600">
                  <Users className="w-4 h-4 inline mr-1" />
                  {notice.targetAudience}
                </Text>
              </Flex>
            </Flex>

            {/* Attachments */}
            {notice.attachments && notice.attachments.length > 0 && (
              <Box className="mb-3">
                <Text size="2" className="text-gray-600 mb-2">
                  Attachments:
                </Text>
                <Flex gap="2" wrap="wrap">
                  {notice.attachments.map((attachment) => {
                    const AttachmentIcon = getAttachmentIcon(attachment.type);
                    return (
                      <Flex
                        key={attachment.id}
                        align="center"
                        gap="1"
                        className="px-2 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200 cursor-pointer transition-colors"
                      >
                        <AttachmentIcon className="w-3 h-3 text-gray-600" />
                        <Text size="1" className="text-gray-600">
                          {attachment.name}
                        </Text>
                        {attachment.size && (
                          <Text size="1" className="text-gray-500">
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
                  <Badge key={index} color="blue" variant="soft" size="1">
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

        {/* Actions */}
        {showActions && (
          <Flex gap="2" className="flex-shrink-0">
            <RadixButton
              variant="outline"
              size="2"
              onClick={() => handleViewNotice(notice.id)}
            >
              <Eye className="w-4 h-4" />
            </RadixButton>
            <RadixButton
              variant="outline"
              size="2"
              onClick={() => handleEditNotice(notice.id)}
            >
              <Edit className="w-4 h-4" />
            </RadixButton>
            <RadixButton
              variant="outline"
              size="2"
              onClick={() => handleShareNotice(notice.id)}
            >
              <Share className="w-4 h-4" />
            </RadixButton>
            <RadixButton
              variant="outline"
              size="2"
              onClick={() =>
                notice.isPinned
                  ? handleUnpinNotice(notice.id)
                  : handlePinNotice(notice.id)
              }
            >
              {notice.isPinned ? (
                <PinOff className="w-4 h-4" />
              ) : (
                <Pin className="w-4 h-4" />
              )}
            </RadixButton>
            <RadixButton
              variant="ghost"
              size="2"
              onClick={() => handleArchiveNotice(notice.id)}
            >
              <Archive className="w-4 h-4" />
            </RadixButton>
          </Flex>
        )}
      </Flex>
    </RadixCard>
  );
}
