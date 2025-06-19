import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Flex, Text, Heading, Separator } from '@radix-ui/themes';
import {
  Home,
  BookOpen,
  Bell,
  Users,
  GraduationCap,
  UserPlus,
  Calendar,
  DollarSign,
  BarChart3,
  Sparkles,
  Building,
  Shield,
  HelpCircle,
  Settings,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  children?: MenuItem[];
}

interface SidebarProps {
  className?: string;
}

const menuItems: MenuItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    path: '/dashboard',
  },
  {
    id: 'academics',
    label: 'Academics',
    icon: BookOpen,
    path: '/academics',
    children: [
      {
        id: 'subjects',
        label: 'Subjects',
        icon: BookOpen,
        path: '/academics/subjects',
      },
      {
        id: 'classes',
        label: 'Classes',
        icon: Users,
        path: '/academics/classes',
      },
      {
        id: 'syllabus',
        label: 'Syllabus',
        icon: BookOpen,
        path: '/academics/syllabus',
      },
    ],
  },
  {
    id: 'notice',
    label: 'Notice',
    icon: Bell,
    path: '/notice',
  },
  {
    id: 'teachers',
    label: 'Teachers',
    icon: Users,
    path: '/teachers',
    children: [
      {
        id: 'all-teachers',
        label: 'All Teachers',
        icon: Users,
        path: '/teachers/all',
      },
      {
        id: 'add-teacher',
        label: 'Add Teacher',
        icon: UserPlus,
        path: '/teachers/add',
      },
    ],
  },
  {
    id: 'students',
    label: 'Students',
    icon: GraduationCap,
    path: '/students',
    children: [
      {
        id: 'all-students',
        label: 'All Students',
        icon: GraduationCap,
        path: '/students/all',
      },
      {
        id: 'add-student',
        label: 'Add Student',
        icon: UserPlus,
        path: '/students/add',
      },
    ],
  },
  {
    id: 'admission',
    label: 'Admission',
    icon: UserPlus,
    path: '/admission',
  },
  {
    id: 'attendance',
    label: 'Attendance',
    icon: Calendar,
    path: '/attendance',
  },
  {
    id: 'fee',
    label: 'Fee',
    icon: DollarSign,
    path: '/fee',
  },
  {
    id: 'result',
    label: 'Result',
    icon: BarChart3,
    path: '/result',
  },
];

const otherItems: MenuItem[] = [
  {
    id: 'test',
    label: '🧪 Integration Test',
    icon: Settings,
    path: '/test',
  },
  {
    id: 'whats-new',
    label: "What's New",
    icon: Sparkles,
    path: '/whats-new',
  },
  {
    id: 'organization',
    label: 'Organization',
    icon: Building,
    path: '/organization',
  },
  {
    id: 'admins',
    label: 'Admins',
    icon: Shield,
    path: '/admins',
  },
  {
    id: 'support',
    label: 'Support',
    icon: HelpCircle,
    path: '/support',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    path: '/settings',
  },
];

export function Sidebar({ className = '' }: SidebarProps): JSX.Element {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(['academics']);

  const toggleExpanded = (itemId: string): void => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActive = (path: string): boolean => {
    return (
      location.pathname === path || location.pathname.startsWith(path + '/')
    );
  };

  const renderMenuItem = (item: MenuItem, level = 0): JSX.Element => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const active = isActive(item.path);

    return (
      <Box key={item.id}>
        <Box
          className={`
            flex items-center px-3 py-2 rounded-lg cursor-pointer transition-colors
            ${active ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'}
            ${level > 0 ? 'ml-6' : ''}
          `}
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id);
            }
          }}
        >
          <Link
            to={item.path}
            className="flex items-center w-full no-underline"
            onClick={(e) => {
              if (hasChildren) {
                e.preventDefault();
              }
            }}
          >
            <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
            <Text size="2" className="flex-1">
              {item.label}
            </Text>
            {hasChildren && (
              <Box className="ml-2">
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Box>
            )}
          </Link>
        </Box>
        {hasChildren && isExpanded && (
          <Box className="mt-1">
            {item.children?.map((child) => renderMenuItem(child, level + 1))}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box
      className={`
        w-64 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col
        ${className}
      `}
    >
      {/* Logo Section */}
      <Box className="px-4 py-6 border-b border-gray-200 dark:border-gray-700">
        <Link to="/dashboard" className="no-underline">
          <Flex align="center" gap="3">
            <Box className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Text size="4" weight="bold" className="text-white">
                E
              </Text>
            </Box>
            <Heading size="5" className="text-gray-900 dark:text-gray-100">
              EdVerse
            </Heading>
          </Flex>
        </Link>
      </Box>

      {/* Menu Section */}
      <Box className="px-4 py-4">
        <Text
          size="1"
          weight="medium"
          className="text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3"
        >
          MENU
        </Text>
        <Flex direction="column" gap="1">
          {menuItems.map((item) => renderMenuItem(item))}
        </Flex>
      </Box>

      <Separator className="mx-4" />

      {/* Other Section */}
      <Box className="px-4 py-4 flex-1">
        <Text
          size="1"
          weight="medium"
          className="text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3"
        >
          OTHER
        </Text>
        <Flex direction="column" gap="1">
          {otherItems.map((item) => renderMenuItem(item))}
        </Flex>
      </Box>
    </Box>
  );
}
