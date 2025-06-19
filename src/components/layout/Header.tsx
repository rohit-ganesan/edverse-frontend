import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Flex, Text, Heading, Badge } from '@radix-ui/themes';
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
} from 'lucide-react';
import { useAuth } from 'features/auth/AuthContext';

interface HeaderProps {
  className?: string;
}

interface BreadcrumbItem {
  label: string;
  path?: string;
}

export function Header({ className = '' }: HeaderProps): JSX.Element {
  const { user, signOut } = useAuth();
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
        bg-white border-b border-gray-200 px-6 py-4
        ${className}
      `}
    >
      <Flex justify="between" align="center">
        {/* Left Section - Logo and Search */}
        <Flex align="center" gap="6">
          {/* Logo */}
          <Link to="/dashboard" className="no-underline">
            <Flex align="center" gap="2">
              <Box className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Text size="3" weight="bold" className="text-white">
                  I
                </Text>
              </Box>
              <Heading size="4" className="text-gray-900">
                Indigle
              </Heading>
            </Flex>
          </Link>

          {/* Search */}
          <Box className="w-80">
            <RadixTextField
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              size="2"
              className="w-full"
            >
              <Search className="w-4 h-4 text-gray-400" />
            </RadixTextField>
          </Box>
        </Flex>

        {/* Right Section - Breadcrumbs, Notifications, User */}
        <Flex align="center" gap="4">
          {/* Breadcrumbs */}
          <Flex align="center" gap="2">
            {breadcrumbs.map((item, index) => (
              <Flex key={index} align="center" gap="2">
                {item.path ? (
                  <Link to={item.path} className="no-underline">
                    <Text
                      size="2"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      {item.label}
                    </Text>
                  </Link>
                ) : (
                  <Text size="2" className="text-gray-900 font-medium">
                    {item.label}
                  </Text>
                )}
                {index < breadcrumbs.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </Flex>
            ))}
          </Flex>

          {/* Notifications */}
          <Flex align="center" gap="2">
            <Box className="relative">
              <Button variant="ghost" size="2" className="p-2">
                <MessageSquare className="w-5 h-5 text-gray-600" />
              </Button>
              <Badge
                size="1"
                className="absolute -top-1 -right-1 bg-red-500 text-white min-w-5 h-5 rounded-full flex items-center justify-center text-xs"
              >
                2
              </Badge>
            </Box>
            <Box className="relative">
              <Button variant="ghost" size="2" className="p-2">
                <Bell className="w-5 h-5 text-gray-600" />
              </Button>
              <Badge
                size="1"
                className="absolute -top-1 -right-1 bg-red-500 text-white min-w-5 h-5 rounded-full flex items-center justify-center text-xs"
              >
                5
              </Badge>
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
              <Flex align="center" gap="2">
                <Box className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </Box>
                <Box className="text-left">
                  <Text size="2" weight="medium" className="text-gray-900">
                    Dwarika Singh Public School &
                  </Text>
                  <Text size="1" className="text-gray-600">
                    College
                  </Text>
                </Box>
              </Flex>
            </Button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <Box
                className="
                  absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg
                  border border-gray-200 py-2 z-50
                "
              >
                <Box className="px-4 py-2 border-b border-gray-100">
                  <Text size="2" weight="medium" className="text-gray-900">
                    {user?.email || 'User'}
                  </Text>
                  <Text size="1" className="text-gray-600">
                    Administrator
                  </Text>
                </Box>
                <Box className="py-1">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 no-underline"
                  >
                    <User className="w-4 h-4 mr-3" />
                    <Text size="2">Profile</Text>
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 no-underline"
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    <Text size="2">Settings</Text>
                  </Link>
                  <Box className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50"
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
