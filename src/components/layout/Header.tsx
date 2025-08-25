import { useState, useEffect, useRef } from 'react';
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
  ArrowUpDown,
  Check,
} from 'lucide-react';
import { useAuth } from 'features/auth/AuthContext';
import { useTheme } from 'contexts/ThemeContext';
import { SignOutConfirmationModal } from '../ui/SignOutConfirmationModal';

interface HeaderProps {
  className?: string;
  isRearrangeMode?: boolean;
  onToggleRearrangeMode?: () => void;
}

interface BreadcrumbItem {
  label: string;
  path?: string;
}

export function Header({
  className = '',
  isRearrangeMode = false,
  onToggleRearrangeMode,
}: HeaderProps): JSX.Element {
  const authContext = useAuth();
  const themeContext = useTheme();
  const location = useLocation();
  const [searchValue, setSearchValue] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [signOutLoading, setSignOutLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close the user menu when clicking outside the profile/menu container
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showUserMenu &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };
    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  // Defensive checks for contexts
  if (!authContext) {
    console.error('Header: Auth context is not available');
    return <Box className="h-16 bg-gray-50 dark:bg-gray-900" />;
  }

  if (!themeContext) {
    console.error('Header: Theme context is not available');
    return <Box className="h-16 bg-gray-50 dark:bg-gray-900" />;
  }

  const { user, userProfile, signOut } = authContext;
  const { toggleTheme, isDark } = themeContext;

  const handleSignOutClick = (): void => {
    setShowSignOutModal(true);
    setShowUserMenu(false); // Close the user menu when opening modal
  };

  const handleSignOutConfirm = async (): Promise<void> => {
    try {
      setSignOutLoading(true);
      console.log('🔘 Header: Sign out confirmed');
      await signOut();
      console.log('✅ Header: Sign out completed successfully');
    } catch (error) {
      console.error('❌ Header: Error signing out:', error);
    } finally {
      setSignOutLoading(false);
    }
  };

  const handleSignOutCancel = (): void => {
    setShowSignOutModal(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e?.target) {
      setSearchValue(e.target.value);
    }
  };

  const handleToggleUserMenu = (): void => {
    setShowUserMenu((prev) => !prev);
  };

  const handleThemeToggle = (): void => {
    try {
      toggleTheme();
    } catch (error) {
      console.error('Error toggling theme:', error);
    }
  };

  // Generate breadcrumbs based on current path
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    if (!location?.pathname) {
      return [{ label: 'Dashboard' }];
    }

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

  // Safe user display name
  const getUserDisplayName = (): string => {
    if (userProfile?.first_name && userProfile?.last_name) {
      return `${userProfile.first_name} ${userProfile.last_name}`;
    }

    if (user?.email) {
      return user.email.split('@')[0]; // Use email username as fallback
    }

    return 'User';
  };

  const getUserRole = (): string => {
    return userProfile?.role || 'Administrator';
  };

  const getUserEmail = (): string => {
    return user?.email || '';
  };

  const getUserAddress = (): string | null => {
    return userProfile?.address || null;
  };

  return (
    <>
      <Box
        className={`
          bg-gray-50 dark:bg-gray-900 px-6 py-4 border-b border-gray-200/30 dark:border-gray-700/30
          ${className}
        `}
      >
        <Flex justify="between" align="center">
          {/* Left Section - Search and Breadcrumbs */}
          <Flex align="center" gap="6" className="flex-1">
            {/* Search */}
            <Box className="w-80">
              <Box className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 z-10" />
                <RadixTextField
                  placeholder="Search..."
                  value={searchValue}
                  onChange={handleSearchChange}
                  size="2"
                  className="w-full pl-12 pr-4 py-2 rounded-full bg-gray-50 dark:bg-gray-900 border border-gray-300/50 dark:border-gray-600/50 shadow-sm hover:shadow-md transition-all duration-200 focus:bg-white dark:focus:bg-gray-800 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-400/20 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                />
              </Box>
            </Box>

            {/* Breadcrumbs */}
            <Flex align="center" gap="2">
              {breadcrumbs?.map((item, index) => (
                <Flex key={index} align="center" gap="2">
                  {item.path ? (
                    <Link to={item.path} className="no-underline">
                      <Text
                        size="2"
                        className="text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 whitespace-nowrap transition-colors duration-200"
                      >
                        {item.label || 'Unknown'}
                      </Text>
                    </Link>
                  ) : (
                    <Text
                      size="2"
                      className="text-gray-500 dark:text-gray-500 whitespace-nowrap"
                    >
                      {item.label || 'Unknown'}
                    </Text>
                  )}
                  {index < breadcrumbs.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  )}
                </Flex>
              ))}
            </Flex>
          </Flex>

          {/* Right Section - Notifications and User */}
          <Flex align="center" gap="4">
            {/* Notifications */}
            <Flex align="center" gap="1">
              <Box className="relative">
                <Button
                  variant="ghost"
                  size="2"
                  className="p-3 relative hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200"
                >
                  <MessageSquare className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </Button>
                <Box className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-medium shadow-lg">
                  2
                </Box>
              </Box>
              <Box className="relative">
                <Button
                  variant="ghost"
                  size="2"
                  className="p-3 relative hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200"
                >
                  <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </Button>
                <Box className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-medium shadow-lg">
                  5
                </Box>
              </Box>
            </Flex>

            {/* User Profile */}
            <Box className="relative" ref={containerRef}>
              <Button
                variant="ghost"
                size="2"
                className="p-2"
                onClick={handleToggleUserMenu}
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
                      {getUserDisplayName()}
                    </Text>
                    <Text
                      size="1"
                      className="text-gray-600 dark:text-gray-400 block"
                    >
                      {getUserRole()}
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
                      {getUserDisplayName()}
                    </Text>
                    <Text
                      size="1"
                      className="text-gray-600 dark:text-gray-400 block mb-1 break-all"
                    >
                      {getUserEmail()}
                    </Text>
                    {getUserAddress() && (
                      <Text
                        size="1"
                        className="text-gray-500 dark:text-gray-500 block"
                      >
                        {getUserAddress()}
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
                      onClick={handleThemeToggle}
                      className="flex items-center w-full px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      {isDark ? (
                        <Sun className="w-4 h-4 mr-3" />
                      ) : (
                        <Moon className="w-4 h-4 mr-3" />
                      )}
                      <Text size="2">
                        {isDark ? 'Light Mode' : 'Dark Mode'}
                      </Text>
                    </button>
                    <button
                      onClick={onToggleRearrangeMode}
                      className={`
                      flex items-center w-full px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700
                      ${isRearrangeMode ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : ''}
                    `}
                    >
                      {isRearrangeMode ? (
                        <Check className="w-4 h-4 mr-3" />
                      ) : (
                        <ArrowUpDown className="w-4 h-4 mr-3" />
                      )}
                      <Text size="2">
                        {isRearrangeMode
                          ? 'Done Rearranging'
                          : 'Rearrange Menu'}
                      </Text>
                    </button>
                    <Box className="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
                      <button
                        onClick={handleSignOutClick}
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

      {/* Sign Out Confirmation Modal */}
      <SignOutConfirmationModal
        open={showSignOutModal}
        onOpenChange={setShowSignOutModal}
        onConfirm={handleSignOutConfirm}
        onCancel={handleSignOutCancel}
        loading={signOutLoading}
        userName={getUserDisplayName()}
      />
    </>
  );
}
