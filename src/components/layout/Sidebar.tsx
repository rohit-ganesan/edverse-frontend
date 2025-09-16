import { Link, useLocation } from 'react-router-dom';
import { Box, Text, Heading, Separator } from '@radix-ui/themes';
import { useState, useEffect } from 'react';
import { useAuth } from 'features/auth/AuthContext';
import { ROUTES } from 'config/routes';
import { useAccess } from 'context/AccessContext';
import { PLAN_RANKS } from 'types/access';
import en from 'i18n/en.json';
// Feature filtering will be handled by route guards
import {
  Home,
  BookOpen,
  Bell,
  Users,
  GraduationCap,
  DollarSign,
  Sparkles,
  Building,
  Shield,
  HelpCircle,
  Settings,
  CalendarDays,
  UserCheck,
  Award,
  GripVertical,
  Check,
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  basePath: string;
  feature?: string;
  cap?: string;
  module: 'core' | 'growth';
}

interface SidebarProps {
  className?: string;
  isRearrangeMode?: boolean;
  onToggleRearrangeMode?: () => void;
}

// Icon mapping removed (unused)

// Build menu items with proper labels (i18n)
const buildMenuItems = (): MenuItem[] => {
  const items: MenuItem[] = [
    {
      id: 'home',
      label: en.nav.dashboard,
      icon: Home,
      path: '/dashboard',
      basePath: '/dashboard',
      module: 'core',
    },
    {
      id: 'students',
      label: en.nav.students,
      icon: GraduationCap,
      path: '/students/all-students',
      basePath: '/students',
      module: 'core',
    },
    {
      id: 'courses',
      label: en.nav.courses,
      icon: BookOpen,
      path: '/courses/overview',
      basePath: '/courses',
      module: 'core',
    },
    {
      id: 'classes',
      label: en.nav.classes,
      icon: CalendarDays,
      path: '/classes/overview',
      basePath: '/classes',
      module: 'core',
    },
    {
      id: 'attendance',
      label: en.labels.attendance,
      icon: UserCheck,
      path: '/attendance/overview',
      basePath: '/attendance',
      module: 'core',
    },
    {
      id: 'results',
      label: en.labels.results,
      icon: Award,
      path: '/results/overview',
      basePath: '/results',
      module: 'core',
    },
    {
      id: 'fees',
      label: en.nav.fees,
      icon: DollarSign,
      path: '/fees/overview',
      basePath: '/fees',
      module: 'core',
    },
    {
      id: 'notices',
      label: en.nav.announcements,
      icon: Bell,
      path: '/notices/overview',
      basePath: '/notices',
      module: 'core',
    },
    {
      id: 'instructors',
      label: en.nav.instructors,
      icon: Users,
      path: '/teachers/overview',
      basePath: '/teachers',
      module: 'core',
    },
    {
      id: 'admins',
      label: 'Admins',
      icon: Shield,
      path: '/admins/overview',
      basePath: '/admins',
      module: 'core',
    },
    {
      id: 'organization',
      label: en.nav.organization,
      icon: Building,
      path: '/organization/overview',
      basePath: '/organization',
      module: 'core',
    },
  ];

  return items;
};

// Additional items not in route registry
const additionalItems: MenuItem[] = [
  {
    id: 'settings',
    label: en.nav.settings,
    icon: Settings,
    path: '/settings/overview',
    basePath: '/settings',
    module: 'core',
  },
  {
    id: 'test',
    label: '🧪 Integration Test',
    icon: Settings,
    path: '/test',
    basePath: '/test',
    module: 'core',
  },
  {
    id: 'whats-new',
    label: en.nav.whats_new,
    icon: Sparkles,
    path: '/whats-new',
    basePath: '/whats-new',
    module: 'growth',
  },
  {
    id: 'support',
    label: en.nav.support,
    icon: HelpCircle,
    path: '/support',
    basePath: '/support',
    module: 'core',
  },
];

export function Sidebar({
  className = '',
  isRearrangeMode = false,
  onToggleRearrangeMode,
}: SidebarProps): JSX.Element {
  const location = useLocation();
  const { user, updateUserProfile } = useAuth();
  const { plan, features, capabilities } = useAccess();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  // Build menu items from route registry and filter by permissions
  useEffect(() => {
    const mainItems = buildMenuItems();
    setMenuItems(mainItems);
  }, []);

  // Filter menu items: hide if user lacks role capability entirely
  const filteredMenuItems = menuItems.filter((item, index, self) => {
    const isFirstOccurrence = index === self.findIndex((t) => t.id === item.id);
    if (!isFirstOccurrence) return false;

    // Map basePath to a route config when available
    const route = ROUTES.find((r) => item.basePath.startsWith(r.path));
    if (!route) return true; // keep items not in registry

    if (
      route.cap &&
      !(capabilities.includes('*') || capabilities.includes(route.cap))
    ) {
      return false;
    }
    return true;
  });

  // Save menu order to user profile
  const saveMenuOrder = async (items: MenuItem[]) => {
    if (!user || !updateUserProfile) {
      console.warn('Cannot save menu order: user not authenticated');
      return;
    }

    try {
      // TODO: Implement menuOrder saving in Supabase schema if needed
      console.log(
        'Menu order would be saved:',
        items.map((item) => item.id)
      );
    } catch (error) {
      console.error('Error saving menu order to profile:', error);
    }
  };

  const isActive = (basePath: string): boolean => {
    return (
      location.pathname === basePath ||
      location.pathname.startsWith(basePath + '/')
    );
  };

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetItemId: string) => {
    e.preventDefault();

    if (!draggedItem || draggedItem === targetItemId) {
      setDraggedItem(null);
      return;
    }

    const draggedIndex = menuItems.findIndex((item) => item.id === draggedItem);
    const targetIndex = menuItems.findIndex((item) => item.id === targetItemId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedItem(null);
      return;
    }

    const newItems = [...menuItems];
    const [removed] = newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, removed);

    setMenuItems(newItems);
    await saveMenuOrder(newItems);
    setDraggedItem(null);
  };

  const renderMenuItem = (item: MenuItem, index: number): JSX.Element => {
    const active = isActive(item.basePath);
    const isDragging = draggedItem === item.id;

    // Locked if plan/feature gating blocks visibility (role capability is granted but plan/feature missing)
    const route = ROUTES.find((r) => item.basePath.startsWith(r.path));
    const locked = route
      ? (route.neededPlan &&
          PLAN_RANKS[plan] <
            PLAN_RANKS[route.neededPlan as keyof typeof PLAN_RANKS]) ||
        (route.feature ? !features.includes(route.feature) : false)
      : false;

    const handleClick = (e: React.MouseEvent) => {
      if (isRearrangeMode) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    return (
      <Box
        key={item.id}
        className={`relative ${isDragging ? 'opacity-50' : ''}`}
        draggable={isRearrangeMode}
        onDragStart={(e) => handleDragStart(e, item.id)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, item.id)}
      >
        <Link
          to={item.path}
          onClick={handleClick}
          className={`
            flex items-center px-3 py-2 rounded-lg transition-colors no-underline
            ${active ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'}
            ${isRearrangeMode ? 'cursor-move pointer-events-none' : ''}
          `}
        >
          {isRearrangeMode && (
            <GripVertical className="w-4 h-4 mr-2 text-gray-400" />
          )}
          <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
          <Text size="2" className="flex-1">
            {item.label}
          </Text>
          {locked && <span className="ml-2 text-gray-400">🔒</span>}
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
      <Box className="flex-1 overflow-y-auto p-4 flex flex-col">
        {isRearrangeMode && (
          <>
            {/* Done Button */}
            <Box className="mb-3">
              <button
                onClick={onToggleRearrangeMode}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Done
              </button>
            </Box>

            {/* Help Text */}
            <Box className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <Text
                size="2"
                className="text-blue-700 dark:text-blue-300 font-medium block mb-2"
              >
                🔄 Rearrange Mode Active
              </Text>
              <Text
                size="1"
                className="text-blue-600 dark:text-blue-400 leading-relaxed"
              >
                Drag and drop menu items to reorder them
              </Text>
            </Box>
          </>
        )}

        {/* Main Menu Items - Takes up available space */}
        <Box className="flex-1 space-y-1">
          {filteredMenuItems.map((item, index) => renderMenuItem(item, index))}
        </Box>

        {/* Utilities Section - Anchored to bottom */}
        <Box className="mt-auto pt-6">
          <Separator className="mb-6" />

          <Box className="space-y-1">
            <Text
              size="1"
              className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Utilities
            </Text>
            {additionalItems.map((item) => renderMenuItem(item, -1))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
