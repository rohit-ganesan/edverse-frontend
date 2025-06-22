import { ReactNode } from 'react';
import { Box, Flex, Text, Badge } from '@radix-ui/themes';
import { User } from 'lucide-react';

interface ModernActivityItemProps {
  name: string;
  description: string;
  status: 'present' | 'absent' | 'late' | 'completed' | 'pending' | 'active';
  avatar?: ReactNode;
  timestamp?: string;
  badge?: {
    text: string;
    color: 'green' | 'red' | 'orange' | 'blue' | 'purple' | 'gray';
  };
  size?: 'sm' | 'md' | 'lg';
  showStatusRing?: boolean;
  animation?: 'none' | 'slide-up' | 'slide-right' | 'fade';
  animationDelay?: number;
  className?: string;
  onClick?: () => void;
}

const statusConfig = {
  present: {
    color: 'green',
    bgColor: 'bg-green-100',
    ringColor: 'ring-green-200',
    textColor: 'text-green-600',
  },
  absent: {
    color: 'red',
    bgColor: 'bg-red-100',
    ringColor: 'ring-red-200',
    textColor: 'text-red-600',
  },
  late: {
    color: 'orange',
    bgColor: 'bg-orange-100',
    ringColor: 'ring-orange-200',
    textColor: 'text-orange-600',
  },
  completed: {
    color: 'gray',
    bgColor: 'bg-gray-100',
    ringColor: 'ring-gray-200',
    textColor: 'text-gray-600',
  },
  pending: {
    color: 'blue',
    bgColor: 'bg-blue-100',
    ringColor: 'ring-blue-200',
    textColor: 'text-blue-600',
  },
  active: {
    color: 'green',
    bgColor: 'bg-green-100',
    ringColor: 'ring-green-200',
    textColor: 'text-green-600',
  },
};

const sizeConfig = {
  sm: {
    avatar: 'w-8 h-8',
    icon: 'w-4 h-4',
    name: 'size-2',
    description: 'size-1',
    padding: 'p-3',
    gap: 'gap-3',
  },
  md: {
    avatar: 'w-10 h-10',
    icon: 'w-5 h-5',
    name: 'size-3',
    description: 'size-2',
    padding: 'p-4',
    gap: 'gap-3',
  },
  lg: {
    avatar: 'w-12 h-12',
    icon: 'w-6 h-6',
    name: 'size-4',
    description: 'size-2',
    padding: 'p-5',
    gap: 'gap-4',
  },
};

const animationClasses = {
  none: '',
  'slide-up': 'animate-in slide-in-from-bottom-1 duration-300',
  'slide-right': 'animate-in slide-in-from-right-1 duration-300',
  fade: 'animate-in fade-in duration-300',
};

export function ModernActivityItem({
  name,
  description,
  status,
  avatar,
  timestamp,
  badge,
  size = 'md',
  showStatusRing = true,
  animation = 'none',
  animationDelay = 0,
  className = '',
  onClick,
}: ModernActivityItemProps): JSX.Element {
  const statusStyle = statusConfig[status];
  const sizeStyle = sizeConfig[size];
  const isClickable = !!onClick;

  return (
    <Box
      className={`
        group
        ${animationClasses[animation]}
        ${className}
      `}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <Flex
        align="center"
        className={`
          ${sizeStyle.gap} 
          ${sizeStyle.padding} 
          rounded-lg 
          hover:bg-gray-50 
          transition-all 
          duration-200 
          border 
          border-gray-100 
          hover:border-gray-200
          hover:shadow-sm
          ${isClickable ? 'cursor-pointer' : ''}
        `}
        onClick={onClick}
      >
        {/* Avatar */}
        <Box className="relative flex-shrink-0">
          <Box
            className={`
            ${sizeStyle.avatar} 
            rounded-xl 
            flex 
            items-center 
            justify-center 
            ${showStatusRing ? `${statusStyle.bgColor} ring-2 ${statusStyle.ringColor}` : 'bg-gray-100'}
            shadow-sm
          `}
          >
            {avatar || (
              <User
                className={`
                ${sizeStyle.icon} 
                ${showStatusRing ? statusStyle.textColor : 'text-gray-500'}
              `}
              />
            )}
          </Box>

          {/* Live Status Dot for Active Items */}
          {status === 'active' && (
            <Box className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <Box className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            </Box>
          )}
        </Box>

        {/* Content */}
        <Box className="flex-1 min-w-0">
          <Flex align="center" gap="2" className="mb-1">
            <Text
              className={`${sizeStyle.name} font-semibold text-gray-900 block truncate`}
            >
              {name}
            </Text>
            {timestamp && (
              <Text
                className={`${sizeStyle.description} text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-md text-xs flex-shrink-0`}
              >
                ✓ {timestamp}
              </Text>
            )}
          </Flex>
          <Text
            className={`${sizeStyle.description} text-gray-600 block line-clamp-2 font-medium`}
          >
            {description}
          </Text>
        </Box>

        {/* Badge */}
        <Box className="flex-shrink-0">
          {badge ? (
            <Badge color={badge.color} size="1" variant="soft">
              {badge.text}
            </Badge>
          ) : (
            <Badge color={statusStyle.color as any} size="1" variant="soft">
              {status}
            </Badge>
          )}
        </Box>
      </Flex>
    </Box>
  );
}
