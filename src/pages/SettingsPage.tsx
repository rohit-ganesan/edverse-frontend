import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Heading,
  Badge,
  Grid,
  Switch,
  TextField,
  Select,
  Card as RadixCard,
} from '@radix-ui/themes';
import {
  Download,
  Save,
  Mail,
  Bell,
  Smartphone,
  Monitor,
  Key,
  Lock,
  AlertCircle,
  Sun,
  Moon,
  Volume2,
  Upload,
  RotateCcw,
  CheckCircle,
  Database,
  Zap,
} from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PageHeader } from '../components/ui/PageHeader';
import { TabContainer } from '../components/ui/TabContainer';
import {
  ModernStatsGridColored,
  ColoredStatItem,
} from '../components/ui/ModernStatsGridColored';
import { useTabRouting } from '../lib/useTabRouting';

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    desktop: boolean;
  };
  privacy: {
    profileVisible: boolean;
    activityTracking: boolean;
    dataCollection: boolean;
  };
  appearance: {
    fontSize: 'small' | 'medium' | 'large' | 'extra-large';
    fontFamily: 'inter' | 'roboto' | 'system';
    reduceMotion: boolean;
    highContrast: boolean;
    compactMode: boolean;
    soundEnabled: boolean;
    hapticFeedback: boolean;
  };
  performance: {
    caching: boolean;
    preloading: boolean;
    backgroundSync: boolean;
  };
  developer: {
    debugMode: boolean;
    apiLogging: boolean;
    performanceMonitoring: boolean;
    betaFeatures: boolean;
  };
}

export function SettingsPage(): JSX.Element {
  // Use tab routing instead of local state
  const { activeTab, setActiveTab } = useTabRouting({
    defaultTab: 'general',
    validTabs: [
      'general',
      'account',
      'notifications',
      'security',
      'appearance',
      'advanced',
    ],
    basePath: '/settings',
  });

  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'light',
    language: 'en',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    notifications: {
      email: true,
      push: true,
      sms: false,
      desktop: true,
    },
    privacy: {
      profileVisible: true,
      activityTracking: true,
      dataCollection: false,
    },
    appearance: {
      fontSize: 'medium',
      fontFamily: 'inter',
      reduceMotion: false,
      highContrast: false,
      compactMode: false,
      soundEnabled: true,
      hapticFeedback: true,
    },
    performance: {
      caching: true,
      preloading: true,
      backgroundSync: false,
    },
    developer: {
      debugMode: false,
      apiLogging: false,
      performanceMonitoring: true,
      betaFeatures: false,
    },
  });

  const settingsStats: ColoredStatItem[] = [
    {
      title: 'Account Status',
      value: 'Active',
      icon: Bell,
      gradient: {
        from: 'from-green-50',
        to: 'to-emerald-50',
      },
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-100',
    },
    {
      title: 'Security Level',
      value: 'High',
      icon: Key,
      gradient: {
        from: 'from-blue-50',
        to: 'to-indigo-50',
      },
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-100',
    },
    {
      title: 'Data Usage',
      value: '2.4 GB',
      icon: Monitor,
      gradient: {
        from: 'from-purple-50',
        to: 'to-violet-50',
      },
      iconColor: 'text-purple-600',
      iconBgColor: 'bg-purple-100',
    },
    {
      title: 'Last Backup',
      value: '2 hours ago',
      icon: Download,
      gradient: {
        from: 'from-orange-50',
        to: 'to-amber-50',
      },
      iconColor: 'text-orange-600',
      iconBgColor: 'bg-orange-100',
    },
  ];

  const updatePreferences = (
    section: keyof UserPreferences,
    key: string,
    value: any
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [section]: {
        ...((prev[section] as object) || {}),
        [key]: value,
      },
    }));
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(preferences, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'edverse-settings.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string);
          setPreferences(importedSettings);
        } catch (error) {
          console.error('Error importing settings:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleResetSettings = () => {
    if (
      window.confirm(
        'Are you sure you want to reset all settings to default? This action cannot be undone.'
      )
    ) {
      setPreferences({
        theme: 'light',
        language: 'en',
        timezone: 'America/New_York',
        dateFormat: 'MM/DD/YYYY',
        currency: 'USD',
        notifications: {
          email: true,
          push: true,
          sms: false,
          desktop: true,
        },
        privacy: {
          profileVisible: true,
          activityTracking: true,
          dataCollection: false,
        },
        appearance: {
          fontSize: 'medium',
          fontFamily: 'inter',
          reduceMotion: false,
          highContrast: false,
          compactMode: false,
          soundEnabled: true,
          hapticFeedback: true,
        },
        performance: {
          caching: true,
          preloading: true,
          backgroundSync: false,
        },
        developer: {
          debugMode: false,
          apiLogging: false,
          performanceMonitoring: true,
          betaFeatures: false,
        },
      });
    }
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to backend/localStorage
    localStorage.setItem('edverse-preferences', JSON.stringify(preferences));
    console.log('Settings saved successfully');
  };

  const tabs = [
    {
      value: 'general',
      label: 'General',
      content: (
        <Box className="space-y-6">
          <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
            <Box className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
              <Heading size="4" className="text-gray-900 mb-1">
                General Preferences
              </Heading>
              <Text size="2" className="text-gray-600">
                Configure basic application settings and preferences
              </Text>
            </Box>

            <Box className="p-6">
              <Grid columns="2" gap="6">
                <Box className="space-y-4">
                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 mb-2 block"
                    >
                      Language
                    </Text>
                    <Select.Root value={preferences.language}>
                      <Select.Trigger className="w-full" />
                      <Select.Content>
                        <Select.Item value="en">English</Select.Item>
                        <Select.Item value="es">Spanish</Select.Item>
                        <Select.Item value="fr">French</Select.Item>
                        <Select.Item value="de">German</Select.Item>
                      </Select.Content>
                    </Select.Root>
                  </Box>

                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 mb-2 block"
                    >
                      Timezone
                    </Text>
                    <Select.Root value={preferences.timezone}>
                      <Select.Trigger className="w-full" />
                      <Select.Content>
                        <Select.Item value="America/New_York">
                          Eastern Time
                        </Select.Item>
                        <Select.Item value="America/Chicago">
                          Central Time
                        </Select.Item>
                        <Select.Item value="America/Denver">
                          Mountain Time
                        </Select.Item>
                        <Select.Item value="America/Los_Angeles">
                          Pacific Time
                        </Select.Item>
                      </Select.Content>
                    </Select.Root>
                  </Box>

                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 mb-2 block"
                    >
                      Date Format
                    </Text>
                    <Select.Root value={preferences.dateFormat}>
                      <Select.Trigger className="w-full" />
                      <Select.Content>
                        <Select.Item value="MM/DD/YYYY">MM/DD/YYYY</Select.Item>
                        <Select.Item value="DD/MM/YYYY">DD/MM/YYYY</Select.Item>
                        <Select.Item value="YYYY-MM-DD">YYYY-MM-DD</Select.Item>
                      </Select.Content>
                    </Select.Root>
                  </Box>
                </Box>

                <Box className="space-y-4">
                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 mb-2 block"
                    >
                      Currency
                    </Text>
                    <Select.Root value={preferences.currency}>
                      <Select.Trigger className="w-full" />
                      <Select.Content>
                        <Select.Item value="USD">USD - US Dollar</Select.Item>
                        <Select.Item value="EUR">EUR - Euro</Select.Item>
                        <Select.Item value="GBP">
                          GBP - British Pound
                        </Select.Item>
                        <Select.Item value="CAD">
                          CAD - Canadian Dollar
                        </Select.Item>
                      </Select.Content>
                    </Select.Root>
                  </Box>

                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 mb-3"
                    >
                      System Preferences
                    </Text>
                    <Box className="space-y-3">
                      <Flex justify="between" align="center">
                        <Text size="2" className="text-gray-700">
                          Auto-save changes
                        </Text>
                        <Switch checked={true} size="2" />
                      </Flex>
                      <Flex justify="between" align="center">
                        <Text size="2" className="text-gray-700">
                          Compact view
                        </Text>
                        <Switch
                          checked={preferences.performance.backgroundSync}
                          onCheckedChange={(checked) =>
                            updatePreferences(
                              'performance',
                              'backgroundSync',
                              checked
                            )
                          }
                          size="2"
                        />
                      </Flex>
                      <Flex justify="between" align="center">
                        <Text size="2" className="text-gray-700">
                          Show tooltips
                        </Text>
                        <Switch checked={true} size="2" />
                      </Flex>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Box>
          </RadixCard>
        </Box>
      ),
    },
    {
      value: 'account',
      label: 'Account',
      content: (
        <Box className="space-y-6">
          <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
            <Box className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
              <Heading size="4" className="text-gray-900 mb-1">
                Account Information
              </Heading>
              <Text size="2" className="text-gray-600">
                Manage your personal information and account details
              </Text>
            </Box>

            <Box className="p-6">
              <Grid columns="2" gap="6">
                <Box className="space-y-4">
                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 mb-2 block"
                    >
                      First Name
                    </Text>
                    <TextField.Root
                      placeholder="Enter your first name"
                      defaultValue="John"
                    />
                  </Box>

                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 mb-2 block"
                    >
                      Last Name
                    </Text>
                    <TextField.Root
                      placeholder="Enter your last name"
                      defaultValue="Smith"
                    />
                  </Box>

                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 mb-2 block"
                    >
                      Email Address
                    </Text>
                    <TextField.Root
                      placeholder="Enter your email"
                      defaultValue="john.smith@edverse.edu"
                    />
                  </Box>
                </Box>

                <Box className="space-y-4">
                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 mb-2 block"
                    >
                      Phone Number
                    </Text>
                    <TextField.Root
                      placeholder="Enter your phone number"
                      defaultValue="+1 (555) 123-4567"
                    />
                  </Box>

                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 mb-2 block"
                    >
                      Department
                    </Text>
                    <Select.Root defaultValue="admin">
                      <Select.Trigger className="w-full" />
                      <Select.Content>
                        <Select.Item value="admin">Administration</Select.Item>
                        <Select.Item value="academic">
                          Academic Affairs
                        </Select.Item>
                        <Select.Item value="finance">Finance</Select.Item>
                        <Select.Item value="it">IT Department</Select.Item>
                      </Select.Content>
                    </Select.Root>
                  </Box>

                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 mb-2 block"
                    >
                      Role
                    </Text>
                    <Badge color="blue" variant="soft" size="2">
                      Administrator
                    </Badge>
                  </Box>
                </Box>
              </Grid>
            </Box>
          </RadixCard>
        </Box>
      ),
    },
    {
      value: 'notifications',
      label: 'Notifications',
      content: (
        <Box className="space-y-6">
          <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
            <Box className="p-6 bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-100">
              <Heading size="4" className="text-gray-900 mb-1">
                Notification Preferences
              </Heading>
              <Text size="2" className="text-gray-600">
                Choose how and when you want to receive notifications
              </Text>
            </Box>

            <Box className="p-6">
              <Grid columns="2" gap="6">
                <Box className="space-y-6">
                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 mb-3"
                    >
                      Notification Channels
                    </Text>
                    <Box className="space-y-3">
                      <Flex justify="between" align="center">
                        <Flex align="center" gap="2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <Text size="2" className="text-gray-700">
                            Email Notifications
                          </Text>
                        </Flex>
                        <Switch
                          checked={preferences.notifications.email}
                          onCheckedChange={(checked) =>
                            updatePreferences('notifications', 'email', checked)
                          }
                          size="2"
                        />
                      </Flex>
                      <Flex justify="between" align="center">
                        <Flex align="center" gap="2">
                          <Bell className="w-4 h-4 text-gray-500" />
                          <Text size="2" className="text-gray-700">
                            Push Notifications
                          </Text>
                        </Flex>
                        <Switch
                          checked={preferences.notifications.push}
                          onCheckedChange={(checked) =>
                            updatePreferences('notifications', 'push', checked)
                          }
                          size="2"
                        />
                      </Flex>
                      <Flex justify="between" align="center">
                        <Flex align="center" gap="2">
                          <Smartphone className="w-4 h-4 text-gray-500" />
                          <Text size="2" className="text-gray-700">
                            SMS Notifications
                          </Text>
                        </Flex>
                        <Switch
                          checked={preferences.notifications.sms}
                          onCheckedChange={(checked) =>
                            updatePreferences('notifications', 'sms', checked)
                          }
                          size="2"
                        />
                      </Flex>
                      <Flex justify="between" align="center">
                        <Flex align="center" gap="2">
                          <Monitor className="w-4 h-4 text-gray-500" />
                          <Text size="2" className="text-gray-700">
                            Desktop Notifications
                          </Text>
                        </Flex>
                        <Switch
                          checked={preferences.notifications.desktop}
                          onCheckedChange={(checked) =>
                            updatePreferences(
                              'notifications',
                              'desktop',
                              checked
                            )
                          }
                          size="2"
                        />
                      </Flex>
                    </Box>
                  </Box>
                </Box>

                <Box className="space-y-6">
                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 mb-3"
                    >
                      Notification Types
                    </Text>
                    <Box className="space-y-3">
                      <Flex justify="between" align="center">
                        <Text size="2" className="text-gray-700">
                          System Updates
                        </Text>
                        <Switch checked={true} size="2" />
                      </Flex>
                      <Flex justify="between" align="center">
                        <Text size="2" className="text-gray-700">
                          Security Alerts
                        </Text>
                        <Switch checked={true} size="2" />
                      </Flex>
                      <Flex justify="between" align="center">
                        <Text size="2" className="text-gray-700">
                          Feature Announcements
                        </Text>
                        <Switch checked={false} size="2" />
                      </Flex>
                      <Flex justify="between" align="center">
                        <Text size="2" className="text-gray-700">
                          Marketing Updates
                        </Text>
                        <Switch checked={false} size="2" />
                      </Flex>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Box>
          </RadixCard>
        </Box>
      ),
    },
    {
      value: 'security',
      label: 'Security',
      content: (
        <Box className="space-y-6">
          <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
            <Box className="p-6 bg-gradient-to-r from-red-50 to-pink-50 border-b border-red-100">
              <Heading size="4" className="text-gray-900 mb-1">
                Security Settings
              </Heading>
              <Text size="2" className="text-gray-600">
                Manage your account security and privacy settings
              </Text>
            </Box>

            <Box className="p-6">
              <Grid columns="2" gap="6">
                <Box className="space-y-6">
                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 mb-3"
                    >
                      Authentication
                    </Text>
                    <Box className="space-y-3">
                      <Flex justify="between" align="center">
                        <Flex align="center" gap="2">
                          <Key className="w-4 h-4 text-gray-500" />
                          <Text size="2" className="text-gray-700">
                            Two-Factor Authentication
                          </Text>
                        </Flex>
                        <Badge color="green" variant="soft" size="1">
                          Enabled
                        </Badge>
                      </Flex>
                      <Flex justify="between" align="center">
                        <Text size="2" className="text-gray-700">
                          Session Timeout (30 min)
                        </Text>
                        <Switch checked={true} size="2" />
                      </Flex>
                      <Flex justify="between" align="center">
                        <Text size="2" className="text-gray-700">
                          Login Alerts
                        </Text>
                        <Switch checked={true} size="2" />
                      </Flex>
                    </Box>
                  </Box>

                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 mb-3"
                    >
                      Password Security
                    </Text>
                    <Box className="space-y-3">
                      <Flex
                        justify="between"
                        align="center"
                        className="p-3 bg-gray-50 rounded-lg"
                      >
                        <Flex align="center" gap="2">
                          <Lock className="w-4 h-4 text-gray-500" />
                          <Box>
                            <Text
                              size="2"
                              className="text-gray-900 font-medium"
                            >
                              Password Strength
                            </Text>
                            <Text size="1" className="text-gray-500">
                              Last changed: 30 days ago
                            </Text>
                          </Box>
                        </Flex>
                        <Badge color="green" variant="soft" size="1">
                          Strong
                        </Badge>
                      </Flex>
                      <TextField.Root
                        placeholder="Change Password"
                        type="password"
                        className="w-full"
                      />
                    </Box>
                  </Box>
                </Box>

                <Box className="space-y-6">
                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 mb-3"
                    >
                      Privacy Controls
                    </Text>
                    <Box className="space-y-3">
                      <Flex justify="between" align="center">
                        <Text size="2" className="text-gray-700">
                          Profile Visibility
                        </Text>
                        <Switch
                          checked={preferences.privacy.profileVisible}
                          onCheckedChange={(checked) =>
                            updatePreferences(
                              'privacy',
                              'profileVisible',
                              checked
                            )
                          }
                          size="2"
                        />
                      </Flex>
                      <Flex justify="between" align="center">
                        <Text size="2" className="text-gray-700">
                          Activity Tracking
                        </Text>
                        <Switch
                          checked={preferences.privacy.activityTracking}
                          onCheckedChange={(checked) =>
                            updatePreferences(
                              'privacy',
                              'activityTracking',
                              checked
                            )
                          }
                          size="2"
                        />
                      </Flex>
                      <Flex justify="between" align="center">
                        <Text size="2" className="text-gray-700">
                          Data Collection
                        </Text>
                        <Switch
                          checked={preferences.privacy.dataCollection}
                          onCheckedChange={(checked) =>
                            updatePreferences(
                              'privacy',
                              'dataCollection',
                              checked
                            )
                          }
                          size="2"
                        />
                      </Flex>
                    </Box>
                  </Box>

                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 mb-3"
                    >
                      Account Actions
                    </Text>
                    <Box className="space-y-3">
                      <Flex className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <Download className="w-4 h-4 text-blue-600 mr-2 mt-0.5" />
                        <Box>
                          <Text size="2" className="text-blue-900 font-medium">
                            Download Your Data
                          </Text>
                          <Text size="1" className="text-blue-700">
                            Export all your account data
                          </Text>
                        </Box>
                      </Flex>
                      <Flex className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <AlertCircle className="w-4 h-4 text-red-600 mr-2 mt-0.5" />
                        <Box>
                          <Text size="2" className="text-red-900 font-medium">
                            Delete Account
                          </Text>
                          <Text size="1" className="text-red-700">
                            Permanently delete your account
                          </Text>
                        </Box>
                      </Flex>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Box>
          </RadixCard>
        </Box>
      ),
    },
    {
      value: 'appearance',
      label: 'Appearance',
      content: (
        <Box className="space-y-6">
          <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
            <Box className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100">
              <Heading size="4" className="text-gray-900 mb-1">
                Appearance Settings
              </Heading>
              <Text size="2" className="text-gray-600">
                Customize the look and feel of your interface
              </Text>
            </Box>

            <Box className="p-6">
              <Grid columns="2" gap="6">
                <Box className="space-y-6">
                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 mb-3"
                    >
                      Theme
                    </Text>
                    <Box className="space-y-3">
                      {[
                        {
                          value: 'light',
                          label: 'Light Mode',
                          icon: Sun,
                          desc: 'Clean and bright interface',
                        },
                        {
                          value: 'dark',
                          label: 'Dark Mode',
                          icon: Moon,
                          desc: 'Easy on the eyes',
                        },
                        {
                          value: 'auto',
                          label: 'Auto (System)',
                          icon: Monitor,
                          desc: 'Follows system preference',
                        },
                      ].map((theme) => (
                        <Box
                          key={theme.value}
                          className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-indigo-300 ${
                            preferences.theme === theme.value
                              ? 'border-indigo-500 bg-indigo-50'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                          onClick={() =>
                            updatePreferences('theme', 'value', theme.value)
                          }
                        >
                          <Flex align="center" gap="3">
                            <theme.icon
                              className={`w-5 h-5 ${
                                preferences.theme === theme.value
                                  ? 'text-indigo-600'
                                  : 'text-gray-600'
                              }`}
                            />
                            <Box className="flex-1">
                              <Text
                                size="2"
                                className="text-gray-900 font-medium"
                              >
                                {theme.label}
                              </Text>
                              <Text size="1" className="text-gray-500">
                                {theme.desc}
                              </Text>
                            </Box>
                            {preferences.theme === theme.value && (
                              <CheckCircle className="w-4 h-4 text-indigo-600" />
                            )}
                          </Flex>
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 mb-3"
                    >
                      Font Settings
                    </Text>
                    <Box className="space-y-3">
                      <Box>
                        <Text size="2" className="text-gray-700 mb-2">
                          Font Size
                        </Text>
                        <Select.Root defaultValue="medium">
                          <Select.Trigger className="w-full" />
                          <Select.Content>
                            <Select.Item value="small">Small</Select.Item>
                            <Select.Item value="medium">Medium</Select.Item>
                            <Select.Item value="large">Large</Select.Item>
                            <Select.Item value="extra-large">
                              Extra Large
                            </Select.Item>
                          </Select.Content>
                        </Select.Root>
                      </Box>
                      <Box>
                        <Text size="2" className="text-gray-700 mb-2">
                          Font Family
                        </Text>
                        <Select.Root defaultValue="inter">
                          <Select.Trigger className="w-full" />
                          <Select.Content>
                            <Select.Item value="inter">Inter</Select.Item>
                            <Select.Item value="roboto">Roboto</Select.Item>
                            <Select.Item value="system">
                              System Default
                            </Select.Item>
                          </Select.Content>
                        </Select.Root>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                <Box className="space-y-6">
                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 mb-3"
                    >
                      Display Options
                    </Text>
                    <Box className="space-y-3">
                      <Flex justify="between" align="center">
                        <Box>
                          <Text size="2" className="text-gray-700">
                            Reduce motion
                          </Text>
                          <Text size="1" className="text-gray-500">
                            Minimize animations and transitions
                          </Text>
                        </Box>
                        <Switch checked={false} size="2" />
                      </Flex>
                      <Flex justify="between" align="center">
                        <Box>
                          <Text size="2" className="text-gray-700">
                            High contrast
                          </Text>
                          <Text size="1" className="text-gray-500">
                            Increase contrast for better visibility
                          </Text>
                        </Box>
                        <Switch checked={false} size="2" />
                      </Flex>
                      <Flex justify="between" align="center">
                        <Box>
                          <Text size="2" className="text-gray-700">
                            Compact mode
                          </Text>
                          <Text size="1" className="text-gray-500">
                            Reduce spacing between elements
                          </Text>
                        </Box>
                        <Switch checked={false} size="2" />
                      </Flex>
                    </Box>
                  </Box>

                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 mb-3"
                    >
                      Sound & Feedback
                    </Text>
                    <Box className="space-y-3">
                      <Flex justify="between" align="center">
                        <Flex align="center" gap="2">
                          <Volume2 className="w-4 h-4 text-gray-500" />
                          <Text size="2" className="text-gray-700">
                            Notification sounds
                          </Text>
                        </Flex>
                        <Switch checked={true} size="2" />
                      </Flex>
                      <Flex justify="between" align="center">
                        <Text size="2" className="text-gray-700">
                          Button click sounds
                        </Text>
                        <Switch checked={false} size="2" />
                      </Flex>
                      <Flex justify="between" align="center">
                        <Text size="2" className="text-gray-700">
                          Haptic feedback
                        </Text>
                        <Switch checked={true} size="2" />
                      </Flex>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Box>
          </RadixCard>
        </Box>
      ),
    },
    {
      value: 'advanced',
      label: 'Advanced',
      content: (
        <Box className="space-y-6">
          <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
            <Box className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
              <Heading size="4" className="text-gray-900 mb-1">
                Advanced Settings
              </Heading>
              <Text size="2" className="text-gray-600">
                Configure advanced system options and developer settings
              </Text>
            </Box>

            <Box className="p-6">
              <Grid columns="2" gap="6">
                <Box className="space-y-6">
                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 mb-3"
                    >
                      Performance
                    </Text>
                    <Box className="space-y-3">
                      <Flex justify="between" align="center">
                        <Box>
                          <Text size="2" className="text-gray-700">
                            Enable caching
                          </Text>
                          <Text size="1" className="text-gray-500">
                            Cache data for faster loading
                          </Text>
                        </Box>
                        <Switch
                          checked={preferences.performance.caching}
                          onCheckedChange={(checked) =>
                            updatePreferences('performance', 'caching', checked)
                          }
                          size="2"
                        />
                      </Flex>
                      <Flex justify="between" align="center">
                        <Box>
                          <Text size="2" className="text-gray-700">
                            Preload data
                          </Text>
                          <Text size="1" className="text-gray-500">
                            Load data in advance for better UX
                          </Text>
                        </Box>
                        <Switch
                          checked={preferences.performance.preloading}
                          onCheckedChange={(checked) =>
                            updatePreferences(
                              'performance',
                              'preloading',
                              checked
                            )
                          }
                          size="2"
                        />
                      </Flex>
                      <Flex justify="between" align="center">
                        <Box>
                          <Text size="2" className="text-gray-700">
                            Background sync
                          </Text>
                          <Text size="1" className="text-gray-500">
                            Sync data when app is in background
                          </Text>
                        </Box>
                        <Switch checked={false} size="2" />
                      </Flex>
                    </Box>
                  </Box>

                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 mb-3"
                    >
                      Developer Options
                    </Text>
                    <Box className="space-y-3">
                      <Flex justify="between" align="center">
                        <Box>
                          <Text size="2" className="text-gray-700">
                            Debug mode
                          </Text>
                          <Text size="1" className="text-gray-500">
                            Enable debugging features
                          </Text>
                        </Box>
                        <Switch checked={false} size="2" />
                      </Flex>
                      <Flex justify="between" align="center">
                        <Box>
                          <Text size="2" className="text-gray-700">
                            API logging
                          </Text>
                          <Text size="1" className="text-gray-500">
                            Log all API requests and responses
                          </Text>
                        </Box>
                        <Switch checked={false} size="2" />
                      </Flex>
                      <Flex justify="between" align="center">
                        <Box>
                          <Text size="2" className="text-gray-700">
                            Performance monitoring
                          </Text>
                          <Text size="1" className="text-gray-500">
                            Track app performance metrics
                          </Text>
                        </Box>
                        <Switch checked={true} size="2" />
                      </Flex>
                    </Box>
                  </Box>

                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 mb-3"
                    >
                      Storage Management
                    </Text>
                    <Box className="space-y-3">
                      <Flex
                        justify="between"
                        align="center"
                        className="p-3 bg-gray-50 rounded-lg"
                      >
                        <Box>
                          <Text size="2" className="text-gray-900 font-medium">
                            Cache Size
                          </Text>
                          <Text size="1" className="text-gray-500">
                            Local storage usage
                          </Text>
                        </Box>
                        <Text size="2" className="text-gray-700 font-medium">
                          24.8 MB
                        </Text>
                      </Flex>
                      <Flex className="p-3 bg-red-50 rounded-lg border border-red-200 cursor-pointer hover:bg-red-100">
                        <Database className="w-4 h-4 text-red-600 mr-2 mt-0.5" />
                        <Box>
                          <Text size="2" className="text-red-900 font-medium">
                            Clear Cache
                          </Text>
                          <Text size="1" className="text-red-700">
                            Remove all cached data
                          </Text>
                        </Box>
                      </Flex>
                    </Box>
                  </Box>
                </Box>

                <Box className="space-y-6">
                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 mb-3"
                    >
                      Data Management
                    </Text>
                    <Box className="space-y-3">
                      <Box className="relative">
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportSettings}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Flex className="p-3 bg-blue-50 rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-100">
                          <Upload className="w-4 h-4 text-blue-600 mr-2 mt-0.5" />
                          <Box>
                            <Text
                              size="2"
                              className="text-blue-900 font-medium"
                            >
                              Import Settings
                            </Text>
                            <Text size="1" className="text-blue-700">
                              Import configuration from file
                            </Text>
                          </Box>
                        </Flex>
                      </Box>
                      <Flex
                        className="p-3 bg-green-50 rounded-lg border border-green-200 cursor-pointer hover:bg-green-100"
                        onClick={handleExportSettings}
                      >
                        <Download className="w-4 h-4 text-green-600 mr-2 mt-0.5" />
                        <Box>
                          <Text size="2" className="text-green-900 font-medium">
                            Export Settings
                          </Text>
                          <Text size="1" className="text-green-700">
                            Save current configuration
                          </Text>
                        </Box>
                      </Flex>
                      <Flex
                        className="p-3 bg-orange-50 rounded-lg border border-orange-200 cursor-pointer hover:bg-orange-100"
                        onClick={handleResetSettings}
                      >
                        <RotateCcw className="w-4 h-4 text-orange-600 mr-2 mt-0.5" />
                        <Box>
                          <Text
                            size="2"
                            className="text-orange-900 font-medium"
                          >
                            Reset to Default
                          </Text>
                          <Text size="1" className="text-orange-700">
                            Restore factory settings
                          </Text>
                        </Box>
                      </Flex>
                    </Box>
                  </Box>

                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 mb-3"
                    >
                      System Information
                    </Text>
                    <Box className="space-y-3 p-4 bg-gray-50 rounded-lg">
                      <Flex justify="between">
                        <Text size="2" className="text-gray-600">
                          Version:
                        </Text>
                        <Text size="2" className="text-gray-900 font-medium">
                          2.4.0
                        </Text>
                      </Flex>
                      <Flex justify="between">
                        <Text size="2" className="text-gray-600">
                          Build:
                        </Text>
                        <Text size="2" className="text-gray-900 font-medium">
                          20240115
                        </Text>
                      </Flex>
                      <Flex justify="between">
                        <Text size="2" className="text-gray-600">
                          Environment:
                        </Text>
                        <Badge color="green" variant="soft" size="1">
                          Production
                        </Badge>
                      </Flex>
                      <Flex justify="between">
                        <Text size="2" className="text-gray-600">
                          Last Update:
                        </Text>
                        <Text size="2" className="text-gray-900 font-medium">
                          2 days ago
                        </Text>
                      </Flex>
                    </Box>
                  </Box>

                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 mb-3"
                    >
                      Experimental Features
                    </Text>
                    <Box className="space-y-3">
                      <Flex justify="between" align="center">
                        <Box>
                          <Flex align="center" gap="2">
                            <Zap className="w-4 h-4 text-amber-500" />
                            <Text size="2" className="text-gray-700">
                              Beta Features
                            </Text>
                          </Flex>
                          <Text size="1" className="text-gray-500">
                            Enable experimental functionality
                          </Text>
                        </Box>
                        <Switch checked={false} size="2" />
                      </Flex>
                      <Box className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <Text size="1" className="text-amber-800">
                          ⚠️ Experimental features may be unstable and could
                          affect performance.
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Box>
          </RadixCard>
        </Box>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Settings"
        description="Manage your preferences, security, and application settings"
        actions={[
          {
            label: 'Export Settings',
            icon: Download,
            onClick: handleExportSettings,
          },
          {
            label: 'Save Changes',
            icon: Save,
            onClick: handleSaveSettings,
            isPrimary: true,
          },
        ]}
      />

      <ModernStatsGridColored
        stats={settingsStats}
        columns="4"
        gap="6"
        isLoading={false}
      />

      <TabContainer
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </DashboardLayout>
  );
}
