import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Box, Flex, Text } from '@radix-ui/themes';
import { Button } from 'components/ui/RadixButton';
import {
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
  Clock,
  Sparkles,
  X,
} from 'lucide-react';
import { useAuth } from 'features/auth/AuthContext';
import { useTheme } from 'contexts/ThemeContext';
import { useAccess } from 'context/AccessContext';
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
  const accessContext = useAccess();
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [signOutLoading, setSignOutLoading] = useState(false);
  const [trialBannerDismissed, setTrialBannerDismissed] = useState(false);
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
    return userProfile?.role || '';
  };

  const getUserEmail = (): string => {
    return user?.email || '';
  };

  const getUserAddress = (): string => {
    return userProfile?.address || '';
  };

  // Calculate trial status
  const getTrialStatus = () => {
    const { trial_ends_at, plan } = accessContext;

    if (!trial_ends_at) return null;

    const now = new Date();
    const trialEnd = new Date(trial_ends_at);
    const msLeft = trialEnd.getTime() - now.getTime();

    if (msLeft <= 0) {
      return { expired: true, daysLeft: 0 };
    }

    const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24));
    return { expired: false, daysLeft, plan };
  };

  const trialStatus = getTrialStatus();
  const showTrialBanner = trialStatus && !trialBannerDismissed;

  return (
    <>
      {/* Trial Banner */}
      {showTrialBanner && (
        <Box
          className={`
            ${trialStatus.expired ? 'bg-red-500' : trialStatus.daysLeft <= 3 ? 'bg-orange-500' : 'bg-blue-500'}
            text-white px-6 py-3
          `}
        >
          <Flex justify="between" align="center">
            <Flex align="center" gap="3">
              {trialStatus.expired ? (
                <Clock className="w-5 h-5" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
              <Text size="2" weight="medium">
                {trialStatus.expired ? (
                  <>
                    Your {trialStatus.plan} trial has expired. Upgrade now to
                    continue using premium features.
                  </>
                ) : (
                  <>
                    {trialStatus.daysLeft}{' '}
                    {trialStatus.daysLeft === 1 ? 'day' : 'days'} left in your{' '}
                    {trialStatus.plan} trial
                  </>
                )}
              </Text>
            </Flex>

            <Flex align="center" gap="3">
              {trialStatus.expired ? (
                <Button
                  size="1"
                  onClick={() => navigate('/billing')}
                  className="bg-white text-red-600 hover:bg-gray-100"
                >
                  Upgrade Now
                </Button>
              ) : (
                <Button
                  size="1"
                  variant="ghost"
                  onClick={() => navigate('/billing')}
                  className="text-white hover:bg-white/20"
                >
                  View Plans
                </Button>
              )}

              <button
                onClick={() => setTrialBannerDismissed(true)}
                className="text-white hover:bg-white/20 rounded p-1"
                aria-label="Dismiss trial banner"
              >
                <X className="w-4 h-4" />
              </button>
            </Flex>
          </Flex>
        </Box>
      )}

      <Box
        className={`
          bg-gray-50 dark:bg-gray-900 px-6 py-4 border-b border-gray-200/30 dark:border-gray-700/30
          ${className}
        `}
      >
        <Flex justify="between" align="center">
          {/* Left Section - Search and Breadcrumbs */}
          <Flex align="center" gap="6" className="flex-1">
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
