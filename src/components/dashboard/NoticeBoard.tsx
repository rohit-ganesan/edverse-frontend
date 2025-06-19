import { Box, Flex, Text, Heading } from '@radix-ui/themes';
import { RadixCard } from 'components/ui/RadixCard';
import { FileText, Calendar } from 'lucide-react';

interface Notice {
  id: string;
  title: string;
  date: string;
  type: 'announcement' | 'event' | 'reminder';
}

interface NoticeBoardProps {
  className?: string;
}

export function NoticeBoard({ className = '' }: NoticeBoardProps): JSX.Element {
  const notices: Notice[] = [
    {
      id: '1',
      title: 'Annual Sports Day - Registration Open',
      date: '2024-01-15',
      type: 'event',
    },
    {
      id: '2',
      title: 'Parent-Teacher Meeting Schedule',
      date: '2024-01-12',
      type: 'announcement',
    },
    {
      id: '3',
      title: 'Mid-term Examination Timetable',
      date: '2024-01-10',
      type: 'reminder',
    },
  ];

  const getTypeColor = (type: Notice['type']): string => {
    switch (type) {
      case 'event':
        return 'text-blue-600';
      case 'announcement':
        return 'text-green-600';
      case 'reminder':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <RadixCard size="2" className={`p-6 ${className}`}>
      <Box className="mb-4">
        <Heading size="4" className="text-gray-900">
          Notice Board
        </Heading>
      </Box>

      {notices.length === 0 ? (
        <Box className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <Text size="2" className="text-gray-500">
            No notices at the moment
          </Text>
        </Box>
      ) : (
        <Flex direction="column" gap="4">
          {notices.map((notice) => (
            <Flex
              key={notice.id}
              align="start"
              gap="3"
              className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <Box className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className={`w-5 h-5 ${getTypeColor(notice.type)}`} />
              </Box>
              <Box className="flex-1 min-w-0">
                <Text size="2" weight="medium" className="text-gray-900 mb-1">
                  {notice.title}
                </Text>
                <Flex align="center" gap="2">
                  <Calendar className="w-3 h-3 text-gray-400" />
                  <Text size="1" className="text-gray-600">
                    {formatDate(notice.date)}
                  </Text>
                  <Box
                    className={`
                      px-2 py-1 rounded text-xs font-medium capitalize
                      ${
                        notice.type === 'event'
                          ? 'bg-blue-100 text-blue-700'
                          : notice.type === 'announcement'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-orange-100 text-orange-700'
                      }
                    `}
                  >
                    {notice.type}
                  </Box>
                </Flex>
              </Box>
            </Flex>
          ))}
        </Flex>
      )}
    </RadixCard>
  );
}
