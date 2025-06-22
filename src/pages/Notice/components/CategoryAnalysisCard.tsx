import { Box, Flex, Text, Heading } from '@radix-ui/themes';
import { RadixCard } from 'components/ui/RadixCard';
import { Eye, Star, MessageSquare, TrendingUp } from 'lucide-react';
import { useNoticeManagement } from '../hooks/useNoticeManagement';
import type { CategoryAnalysis } from '../types';

interface CategoryAnalysisCardProps {
  category: CategoryAnalysis;
  rank: number;
  className?: string;
  style?: React.CSSProperties;
}

export function CategoryAnalysisCard({
  category,
  rank,
  className = '',
  style,
}: CategoryAnalysisCardProps): JSX.Element {
  const { getCategoryIcon, getCategoryBgColor } = useNoticeManagement();

  const CategoryIcon = getCategoryIcon(category.category as any);
  const bgGradient = getCategoryBgColor(category.category as any);

  return (
    <RadixCard
      className={`p-4 hover:shadow-lg transition-all duration-200 ${className}`}
      style={style}
    >
      <Flex direction="column" gap="3">
        {/* Header */}
        <Flex justify="between" align="center">
          <Flex align="center" gap="3">
            <Box
              className={`w-10 h-10 bg-gradient-to-br ${bgGradient} rounded-lg flex items-center justify-center`}
            >
              <CategoryIcon className="w-5 h-5 text-gray-700" />
            </Box>
            <Box>
              <Heading size="3" className="text-gray-900 capitalize">
                {category.category}
              </Heading>
              <Text size="1" className="text-gray-600">
                {category.count} notice{category.count !== 1 ? 's' : ''}
              </Text>
            </Box>
          </Flex>
          <Box className="text-right">
            <Text size="1" className="text-gray-500">
              Rank #{rank}
            </Text>
          </Box>
        </Flex>

        {/* Stats */}
        <Box className="space-y-2">
          {/* Views */}
          <Flex justify="between" align="center">
            <Flex align="center" gap="2">
              <Eye className="w-4 h-4 text-blue-600" />
              <Text size="2" className="text-gray-700">
                Total Views
              </Text>
            </Flex>
            <Text size="2" weight="medium" className="text-gray-900">
              {category.views.toLocaleString()}
            </Text>
          </Flex>

          {/* Engagement */}
          <Flex justify="between" align="center">
            <Flex align="center" gap="2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <Text size="2" className="text-gray-700">
                Engagement
              </Text>
            </Flex>
            <Text size="2" weight="medium" className="text-gray-900">
              {category.engagement}
            </Text>
          </Flex>

          {/* Average per notice */}
          <Flex justify="between" align="center">
            <Flex align="center" gap="2">
              <Star className="w-4 h-4 text-yellow-600" />
              <Text size="2" className="text-gray-700">
                Avg per Notice
              </Text>
            </Flex>
            <Text size="2" weight="medium" className="text-gray-900">
              {Math.round(category.views / category.count)}
            </Text>
          </Flex>
        </Box>

        {/* Progress Bar */}
        <Box className="space-y-1">
          <Flex justify="between" align="center">
            <Text size="1" className="text-gray-600">
              Performance
            </Text>
            <Text size="1" className="text-gray-600">
              {Math.round(
                (category.engagement / Math.max(category.views, 1)) * 100
              )}
              %
            </Text>
          </Flex>
          <Box className="w-full bg-gray-200 rounded-full h-2">
            <Box
              className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
              style={{
                width: `${Math.min(Math.round((category.engagement / Math.max(category.views, 1)) * 100), 100)}%`,
              }}
            />
          </Box>
        </Box>
      </Flex>
    </RadixCard>
  );
}
