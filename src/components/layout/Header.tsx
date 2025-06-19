import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Flex, Text } from '@radix-ui/themes';
import { RadixTextField } from 'components/ui/RadixTextField';
import { Button } from 'components/ui/RadixButton';
import {
  Search,
  Bell,
  MessageSquare,
  ChevronRight,
  User,
  LogOut,
  Settings,
  Moon,
  Sun,
} from 'lucide-react';
import { useAuth } from 'features/auth/AuthContext';
import { useTheme } from 'contexts/ThemeContext';

interface HeaderProps {
  className?: string;
}

interface BreadcrumbItem {
  label: string;
  path?: string;
}

export function Header({ className = '' }: HeaderProps): JSX.Element {
  const { user, userProfile, signOut } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const location = useLocation();
  const [searchValue, setSearchValue] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async (): Promise<void> => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Generate breadcrumbs based on current path
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    if (pathSegments.length === 0 || pathSegments[0] === 'dashboard') {
      return [{ label: 'Dashboard' }];
    }

    // Add Dashboard as first item if not on dashboard
    breadcrumbs.push({ label: 'Dashboard', path: '/dashboard' });

    // Add current path segments
    let currentPath = '';
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      const label = segment.charAt(0).toUpperCase() + segment.slice(1);
      breadcrumbs.push({
        label,
        path: currentPath,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <Box
      className={`
        bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4
        ${className}
      `}
    >
      <Flex justify="between" align="center">
        {/* Left Section - Search and Breadcrumbs */}
        <Flex align="center" gap="6" className="flex-1">
          {/* Search */}
          <Box className="w-80">
            <Box className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
              <RadixTextField
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                size="2"
                className="w-full pl-10"
              />
            </Box>
          </Box>

          {/* Breadcrumbs */}
          <Flex align="center" gap="2">
            {breadcrumbs.map((item, index) => (
              <Flex key={index} align="center" gap="2">
                {item.path ? (
                  <Link to={item.path} className="no-underline">
                    <Text
                      size="2"
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 whitespace-nowrap"
                    >
                      {item.label}
                    </Text>
                  </Link>
                ) : (
                  <Text
                    size="2"
                    className="text-gray-900 dark:text-gray-100 font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </Text>
                )}
                {index < breadcrumbs.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </Flex>
            ))}
          </Flex>
        </Flex>

        {/* Right Section - Notifications and User */}
        <Flex align="center" gap="4">
          {/* Notifications */}
          <Flex align="center" gap="4">
            <Box className="relative">
              <Button variant="ghost" size="2" className="p-3 relative">
                <MessageSquare className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </Button>
              <Box className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                2
              </Box>
            </Box>
            <Box className="relative">
              <Button variant="ghost" size="2" className="p-3 relative">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </Button>
              <Box className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                5
              </Box>
            </Box>
          </Flex>

          {/* User Profile */}
          <Box className="relative">
            <Button
              variant="ghost"
              size="2"
              className="p-2"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <Flex align="center" gap="3">
                <Box className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </Box>
                <Box className="text-left min-w-0">
                  <Text
                    size="2"
                    weight="medium"
                    className="text-gray-900 dark:text-gray-100 block truncate max-w-[150px]"
                  >
                    {userProfile?.firstName && userProfile?.lastName
                      ? `${userProfile.firstName} ${userProfile.lastName}`
                      : user?.displayName ||
                        user?.email?.split('@')[0] ||
                        'User'}
                  </Text>
                  <Text
                    size="1"
                    className="text-gray-600 dark:text-gray-400 block"
                  >
                    {userProfile?.role || 'Administrator'}
                  </Text>
                </Box>
              </Flex>
            </Button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <Box
                className="
                  absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg
                  border border-gray-200 dark:border-gray-700 py-2 z-50
                "
              >
                <Box className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                  <Text
                    size="2"
                    weight="medium"
                    className="text-gray-900 dark:text-gray-100 block mb-2"
                  >
                    {userProfile?.firstName && userProfile?.lastName
                      ? `${userProfile.firstName} ${userProfile.lastName}`
                      : user?.displayName ||
                        user?.email?.split('@')[0] ||
                        'User'}
                  </Text>
                  <Text
                    size="1"
                    className="text-gray-600 dark:text-gray-400 block mb-1 break-all"
                  >
                    {user?.email}
                  </Text>
                  {userProfile?.address && (
                    <Text
                      size="1"
                      className="text-gray-500 dark:text-gray-500 block"
                    >
                      {userProfile.address}
                    </Text>
                  )}
                </Box>
                <Box className="py-1">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 no-underline"
                  >
                    <User className="w-4 h-4 mr-3" />
                    <Text size="2">Profile</Text>
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 no-underline"
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    <Text size="2">Settings</Text>
                  </Link>
                  <button
                    onClick={toggleTheme}
                    className="flex items-center w-full px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    {isDark ? (
                      <Sun className="w-4 h-4 mr-3" />
                    ) : (
                      <Moon className="w-4 h-4 mr-3" />
                    )}
                    <Text size="2">{isDark ? 'Light Mode' : 'Dark Mode'}</Text>
                  </button>
                  <Box className="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      <Text size="2">Sign Out</Text>
                    </button>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}
