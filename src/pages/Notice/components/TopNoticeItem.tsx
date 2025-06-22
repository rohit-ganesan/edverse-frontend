import { Box, Flex, Text, Badge } from '@radix-ui/themes';
import { Eye, Star, MessageSquare, Trophy, Medal, Award } from 'lucide-react';
import { useNoticeManagement } from '../hooks/useNoticeManagement';
import type { Notice } from '../types';

interface TopNoticeItemProps {
  notice: Notice;
  rank: number;
  className?: string;
  style?: React.CSSProperties;
}

export function TopNoticeItem({
  notice,
  rank,
  className = '',
  style,
}: TopNoticeItemProps): JSX.Element {
  const {
    getPriorityColor,
    getCategoryIcon,
    formatRelativeTime,
    getEngagementLevel,
  } = useNoticeManagement();

  const CategoryIcon = getCategoryIcon(notice.category);
  const engagementLevel = getEngagementLevel(
    notice.views,
    notice.likes,
    notice.comments
  );

  // Get rank icon and color
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return Trophy;
      case 2:
        return Medal;
      case 3:
        return Award;
      default:
        return null;
    }
  };

  const getRankColor = (rank: number): string => {
    switch (rank) {
      case 1:
        return 'text-yellow-600';
      case 2:
        return 'text-gray-600';
      case 3:
        return 'text-amber-600';
      default:
        return 'text-gray-500';
    }
  };

  const getRankBg = (rank: number): string => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-br from-yellow-50 to-amber-50';
      case 2:
        return 'bg-gradient-to-br from-gray-50 to-slate-50';
      case 3:
        return 'bg-gradient-to-br from-amber-50 to-orange-50';
      default:
        return 'bg-gray-50';
    }
  };

  const RankIcon = getRankIcon(rank);
  const rankColor = getRankColor(rank);
  const rankBg = getRankBg(rank);

  return (
    <Box
      className={`p-4 rounded-lg ${rankBg} hover:shadow-md transition-all duration-200 ${className}`}
      style={style}
    >
      <Flex gap="3" align="start">
        {/* Rank indicator */}
        <Box className="flex-shrink-0">
          <Flex
            align="center"
            justify="center"
            className="w-8 h-8 rounded-full bg-white shadow-sm"
          >
            {RankIcon ? (
              <RankIcon className={`w-4 h-4 ${rankColor}`} />
            ) : (
              <Text size="2" weight="bold" className={rankColor}>
                #{rank}
              </Text>
            )}
          </Flex>
        </Box>

        {/* Content */}
        <Box className="flex-1 min-w-0">
          <Flex align="center" gap="2" className="mb-2">
            <Box className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
              <CategoryIcon className="w-3 h-3 text-blue-600" />
            </Box>
            <Text
              size="2"
              weight="medium"
              className="text-gray-900 line-clamp-1"
            >
              {notice.title}
            </Text>
          </Flex>

          <Flex align="center" gap="3" className="mb-2">
            <Badge color={getPriorityColor(notice.priority)} size="1">
              {notice.priority}
            </Badge>
            <Text size="1" className="text-gray-600">
              {notice.author}
            </Text>
            <Text size="1" className="text-gray-500">
              {formatRelativeTime(notice.publishDate)}
            </Text>
          </Flex>

          {/* Engagement stats */}
          <Flex gap="4" className="text-sm">
            <Flex align="center" gap="1">
              <Eye className="w-3 h-3 text-blue-600" />
              <Text size="1" className="text-gray-600">
                {notice.views}
              </Text>
            </Flex>
            <Flex align="center" gap="1">
              <Star className="w-3 h-3 text-yellow-600" />
              <Text size="1" className="text-gray-600">
                {notice.likes}
              </Text>
            </Flex>
            <Flex align="center" gap="1">
              <MessageSquare className="w-3 h-3 text-green-600" />
              <Text size="1" className="text-gray-600">
                {notice.comments}
              </Text>
            </Flex>
          </Flex>

          {/* Engagement level indicator */}
          <Box className="mt-2">
            <Flex align="center" gap="2">
              <Text size="1" className="text-gray-600">
                Engagement:
              </Text>
              <Badge
                color={
                  engagementLevel === 'high'
                    ? 'green'
                    : engagementLevel === 'medium'
                      ? 'yellow'
                      : 'gray'
                }
                size="1"
                variant="soft"
              >
                {engagementLevel}
              </Badge>
            </Flex>
          </Box>
        </Box>

        {/* Score */}
        <Box className="text-right flex-shrink-0">
          <Text size="2" weight="bold" className="text-gray-900">
            {notice.views + notice.likes * 2 + notice.comments * 3}
          </Text>
          <Text size="1" className="text-gray-500">
            score
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}
