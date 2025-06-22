import { Box, Flex, Text, Badge } from '@radix-ui/themes';
import { User } from 'lucide-react';
import { AttendanceRecord } from '../types';

interface ActivityItemProps {
  record: AttendanceRecord;
  index?: number;
}

export function ActivityItem({
  record,
  index = 0,
}: ActivityItemProps): JSX.Element {
  return (
    <Box
      className="group animate-in slide-in-from-right-1 duration-300"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <Flex
        align="center"
        gap="3"
        className="p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150 border border-transparent hover:border-gray-200"
      >
        <Box
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            record.status === 'present'
              ? 'bg-green-100 ring-2 ring-green-200'
              : record.status === 'late'
                ? 'bg-orange-100 ring-2 ring-orange-200'
                : record.status === 'absent'
                  ? 'bg-red-100 ring-2 ring-red-200'
                  : 'bg-gray-100'
          }`}
        >
          <User
            className={`w-4 h-4 ${
              record.status === 'present'
                ? 'text-green-600'
                : record.status === 'late'
                  ? 'text-orange-600'
                  : record.status === 'absent'
                    ? 'text-red-600'
                    : 'text-gray-500'
            }`}
          />
        </Box>
        <Box className="flex-1 min-w-0">
          <Text size="2" weight="medium" className="text-gray-900 mb-1 block">
            {record.student.name}
          </Text>
          <Text size="1" className="text-gray-500 block">
            {record.className} • {record.checkInTime || 'No check-in'}
          </Text>
        </Box>
        <Box className="flex-shrink-0">
          <Badge
            color={
              record.status === 'present'
                ? 'green'
                : record.status === 'absent'
                  ? 'red'
                  : record.status === 'late'
                    ? 'orange'
                    : 'blue'
            }
            size="1"
            variant="soft"
          >
            {record.status}
          </Badge>
        </Box>
      </Flex>
    </Box>
  );
}
