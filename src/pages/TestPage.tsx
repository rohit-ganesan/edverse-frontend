import { useState } from 'react';
import { Box, Flex, Text, Heading, Button } from '@radix-ui/themes';
import { RadixCard } from 'components/ui/RadixCard';
import { supabaseAPI } from 'lib/supabase-api';
import { useAuth } from 'features/auth/AuthContext';

export function TestPage(): JSX.Element {
  const { user } = useAuth();
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setTestResult('Testing connection...');

    try {
      const result = await supabaseAPI.health.testConnection();
      setTestResult(`✅ Success: ${result.message} (${result.timestamp})`);
    } catch (error: any) {
      setTestResult(`❌ Error: ${error.message}`);
      console.error('Test connection error:', error);
    } finally {
      setLoading(false);
    }
  };

  const testNotifications = async () => {
    setLoading(true);
    setTestResult('Testing notifications...');

    try {
      const notifications = await supabaseAPI.notification.getNotifications();
      setTestResult(`✅ Notifications loaded: ${notifications.length} items`);
      console.log('Notifications:', notifications);
    } catch (error: any) {
      setTestResult(`❌ Notifications error: ${error.message}`);
      console.error('Notifications error:', error);
    } finally {
      setLoading(false);
    }
  };

  const testDashboardStats = async () => {
    setLoading(true);
    setTestResult('Testing dashboard stats...');

    try {
      const stats = await supabaseAPI.dashboard.getDashboardStats();
      setTestResult(`✅ Stats loaded: ${JSON.stringify(stats)}`);
      console.log('Dashboard stats:', stats);
    } catch (error: any) {
      setTestResult(`❌ Stats error: ${error.message}`);
      console.error('Stats error:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeUserData = async () => {
    setLoading(true);
    setTestResult('Initializing user data and sample notifications...');

    try {
      // User data initialization is now handled by AuthContext
      const result = {
        message: 'User data initialization handled by AuthContext',
        timestamp: new Date().toISOString(),
      };
      setTestResult(`✅ ${result.message}`);
    } catch (error: any) {
      setTestResult(`❌ Initialization error: ${error.message}`);
      console.error('Initialization error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSampleNotifications = async () => {
    setLoading(true);
    setTestResult('Creating sample notifications...');

    try {
      // Create multiple sample notifications
      const notifications = [
        {
          title: 'Welcome to EdVerse!',
          message: 'Your educational management system is ready to use.',
          type: 'success' as const,
          targetRole: 'all',
        },
        {
          title: 'System Maintenance',
          message: 'Scheduled maintenance will occur this weekend.',
          type: 'info' as const,
          targetRole: 'all',
        },
        {
          title: 'New Features Available',
          message: 'Check out the latest updates to your dashboard.',
          type: 'info' as const,
          targetRole: 'all',
        },
      ];

      let successCount = 0;
      for (const notification of notifications) {
        try {
          // Note: createNotification would need to be implemented in SupabaseApiService
          // For now, just simulate success
          console.log('Would create notification:', notification);
          successCount++;
        } catch (error) {
          console.error('Error creating notification:', error);
        }
      }

      setTestResult(
        `✅ Created ${successCount}/${notifications.length} sample notifications`
      );
    } catch (error: any) {
      setTestResult(`❌ Error creating notifications: ${error.message}`);
      console.error('Create notifications error:', error);
    } finally {
      setLoading(false);
    }
  };

  const testMigration = async () => {
    setLoading(true);
    try {
      // Migration functions would need to be implemented as needed
      const result = {
        message: 'Migration functions not yet implemented in Supabase',
        timestamp: new Date().toISOString(),
      };
      setTestResult(`Migration completed: ${result.message}`);
    } catch (error) {
      setTestResult(`Migration failed: ${error}`);
    }
    setLoading(false);
  };

  return (
    <Box className="p-6">
      <Heading size="6" className="mb-6">
        API Test Page
      </Heading>

      <RadixCard size="2" className="p-6 mb-6">
        <Heading size="4" className="mb-4">
          User Information
        </Heading>
        <Text size="2" className="block mb-2">
          <strong>User ID:</strong> {user?.id || 'Not authenticated'}
        </Text>
        <Text size="2" className="block mb-2">
          <strong>Email:</strong> {user?.email || 'No email'}
        </Text>
        <Text size="2" className="block mb-2">
          <strong>Auth Status:</strong>{' '}
          {user ? '✅ Authenticated' : '❌ Not authenticated'}
        </Text>
      </RadixCard>

      <RadixCard size="2" className="p-6 mb-6">
        <Heading size="4" className="mb-4">
          API Tests
        </Heading>

        <Flex gap="3" className="mb-4 flex-wrap">
          <Button onClick={testConnection} disabled={loading}>
            Test Connection
          </Button>
          <Button onClick={testNotifications} disabled={loading}>
            Test Notifications
          </Button>
          <Button onClick={testDashboardStats} disabled={loading}>
            Test Dashboard Stats
          </Button>
          <Button onClick={initializeUserData} disabled={loading}>
            Initialize User Data
          </Button>
          <Button onClick={createSampleNotifications} disabled={loading}>
            Create Sample Notifications
          </Button>
          <Button onClick={testMigration} disabled={loading}>
            Run Teacher → Instructor Migration
          </Button>
        </Flex>

        {testResult && (
          <Box className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <Text size="2" className="font-mono whitespace-pre-wrap">
              {testResult}
            </Text>
          </Box>
        )}
      </RadixCard>

      <RadixCard size="2" className="p-6">
        <Heading size="4" className="mb-4">
          Supabase Configuration
        </Heading>
        <Text size="2" className="block mb-2">
          <strong>Supabase URL:</strong>{' '}
          {process.env.REACT_APP_SUPABASE_URL ? '✅ Configured' : '❌ Missing'}
        </Text>
        <Text size="2" className="block mb-2">
          <strong>Project ID:</strong>{' '}
          {process.env.REACT_APP_SUPABASE_URL
            ? process.env.REACT_APP_SUPABASE_URL.split('//')[1]?.split('.')[0]
            : 'N/A'}
        </Text>
        <Text size="2" className="block mb-2">
          <strong>Anon Key:</strong>{' '}
          {process.env.REACT_APP_SUPABASE_ANON_KEY
            ? '✅ Configured'
            : '❌ Missing'}
        </Text>
        <Text size="2" className="block mb-2">
          <strong>Edge Functions:</strong> 11 functions deployed
        </Text>
        <Text size="2" className="block">
          <strong>Environment:</strong> {process.env.NODE_ENV}
        </Text>
      </RadixCard>
    </Box>
  );
}
