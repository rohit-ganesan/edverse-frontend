import { Link, useLocation } from 'react-router-dom';
import { Box, Text, Heading, Separator } from '@radix-ui/themes';
import {
  Home,
  BookOpen,
  Bell,
  Users,
  GraduationCap,
  UserPlus,
  DollarSign,
  Sparkles,
  Building,
  Shield,
  HelpCircle,
  Settings,
  FileText,
  CalendarDays,
  UserCheck,
  Award,
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
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
    id: 'courses',
    label: 'Courses',
    icon: BookOpen,
    path: '/courses',
  },
  {
    id: 'classes',
    label: 'Classes',
    icon: CalendarDays,
    path: '/classes',
  },
  {
    id: 'syllabus',
    label: 'Syllabus',
    icon: FileText,
    path: '/syllabus',
  },
  {
    id: 'attendance',
    label: 'Attendance',
    icon: UserCheck,
    path: '/attendance',
  },
  {
    id: 'result',
    label: 'Results',
    icon: Award,
    path: '/result',
  },
  {
    id: 'notice',
    label: 'Notice Board',
    icon: Bell,
    path: '/notice',
  },
  {
    id: 'instructors',
    label: 'Instructors',
    icon: Users,
    path: '/instructors',
  },
  {
    id: 'students',
    label: 'Students',
    icon: GraduationCap,
    path: '/students',
  },
  {
    id: 'admission',
    label: 'Admission',
    icon: UserPlus,
    path: '/admission',
  },
  {
    id: 'fee',
    label: 'Fee Management',
    icon: DollarSign,
    path: '/fee',
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

  const isActive = (path: string): boolean => {
    return (
      location.pathname === path || location.pathname.startsWith(path + '/')
    );
  };

  const renderMenuItem = (item: MenuItem): JSX.Element => {
    const active = isActive(item.path);

    return (
      <Box key={item.id}>
        <Link
          to={item.path}
          className={`
            flex items-center px-3 py-2 rounded-lg transition-colors no-underline
            ${active ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'}
          `}
        >
          <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
          <Text size="2" className="flex-1">
            {item.label}
          </Text>
        </Link>
      </Box>
    );
  };

  return (
    <Box
      className={`
        w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
        flex flex-col h-full ${className}
      `}
    >
      {/* Logo */}
      <Box className="p-6 border-b border-gray-200 dark:border-gray-700">
        <Heading size="6" className="text-gray-900 dark:text-white">
          EdVerse
        </Heading>
        <Text size="2" className="text-gray-600 dark:text-gray-400">
          Student Management
        </Text>
      </Box>

      {/* Main Navigation */}
      <Box className="flex-1 overflow-y-auto p-4">
        <Box className="space-y-1">
          {menuItems.map((item) => renderMenuItem(item))}
        </Box>

        <Separator className="my-6" />

        {/* Other Items */}
        <Box className="space-y-1">
          <Text
            size="1"
            className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
          >
            Other
          </Text>
          {otherItems.map((item) => renderMenuItem(item))}
        </Box>
      </Box>
    </Box>
  );
}
