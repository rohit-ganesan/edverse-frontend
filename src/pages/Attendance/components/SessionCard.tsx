import { Box, Flex, Text, Badge } from '@radix-ui/themes';
import { RadixButton } from 'components/ui/RadixButton';
import { Clock, MapPin, Eye } from 'lucide-react';
import { AttendanceSession } from '../types';

interface SessionCardProps {
  session: AttendanceSession;
  index?: number;
  onViewClick?: (sessionId: string) => void;
}

export function SessionCard({
  session,
  index = 0,
  onViewClick,
}: SessionCardProps): JSX.Element {
  return (
    <Box
      className="group animate-in slide-in-from-bottom-1 duration-300"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Box className="relative p-5 bg-gray-50/50 hover:bg-white border border-gray-200/50 hover:border-gray-300 hover:shadow-md rounded-xl transition-all duration-300 group-hover:scale-[1.01]">
        {/* Status Indicator */}
        <Box
          className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${
            session.status === 'active'
              ? 'bg-green-500'
              : session.status === 'completed'
                ? 'bg-gray-400'
                : 'bg-blue-500'
          }`}
        />

        <Flex justify="between" align="start">
          <Box className="flex-1">
            <Flex align="center" gap="3" className="mb-3">
              <Text size="3" weight="bold" className="text-gray-900">
                {session.className}
              </Text>
              <Badge
                color={
                  session.status === 'active'
                    ? 'green'
                    : session.status === 'completed'
                      ? 'gray'
                      : 'blue'
                }
                variant="soft"
                size="1"
              >
                {session.status}
              </Badge>
            </Flex>

            <Flex align="center" gap="6" className="mb-3">
              <Flex align="center" gap="2">
                <Clock className="w-4 h-4 text-gray-500" />
                <Text size="2" className="text-gray-600">
                  {session.time}
                </Text>
              </Flex>
              <Flex align="center" gap="2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <Text size="2" className="text-gray-600">
                  {session.location}
                </Text>
              </Flex>
            </Flex>

            <Flex align="center" gap="4">
              <Text size="2" className="text-gray-700">
                <Text weight="medium" className="text-gray-900">
                  {session.presentCount}/{session.totalStudents}
                </Text>{' '}
                present
              </Text>
              <Text size="2" className="text-gray-700">
                <Text weight="medium" className="text-green-600">
                  {session.attendanceRate}%
                </Text>{' '}
                rate
              </Text>
            </Flex>
          </Box>

          <RadixButton
            variant="ghost"
            size="2"
            className="opacity-70 group-hover:opacity-100 transition-opacity"
            onClick={() => onViewClick?.(session.id)}
          >
            <Eye className="w-4 h-4" />
          </RadixButton>
        </Flex>
      </Box>
    </Box>
  );
}
