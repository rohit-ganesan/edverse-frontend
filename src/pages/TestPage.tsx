import { useState } from 'react';
import { Box, Flex, Text, Heading, Button } from '@radix-ui/themes';
import { RadixCard } from 'components/ui/RadixCard';
import { ApiService } from 'lib/api';
import { useAuth } from 'features/auth/AuthContext';

export function TestPage(): JSX.Element {
  const { user } = useAuth();
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setTestResult('Testing connection...');

    try {
      const result = await ApiService.testConnection({
        message: 'Hello from test page!',
      });
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
      const notifications = await ApiService.getUserNotifications();
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
      const stats = await ApiService.getDashboardStats();
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
      const result = await ApiService.initializeUserData();
      if (result.success) {
        setTestResult(`✅ ${result.message}`);
      } else {
        setTestResult(`❌ ${result.message}`);
      }
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
          await ApiService.createNotification(
            notification.title,
            notification.message,
            notification.type,
            notification.targetRole
          );
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
      const result = await ApiService.runTeacherToInstructorMigration();
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
          <strong>User ID:</strong> {user?.uid || 'Not authenticated'}
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
          Firebase Configuration
        </Heading>
        <Text size="2" className="block mb-2">
          <strong>Project ID:</strong> edverse-f1640
        </Text>
        <Text size="2" className="block mb-2">
          <strong>Auth Domain:</strong> edverse-f1640.firebaseapp.com
        </Text>
        <Text size="2" className="block mb-2">
          <strong>Functions Region:</strong> us-central1 (default)
        </Text>
        <Text size="2" className="block">
          <strong>Environment:</strong> {process.env.NODE_ENV}
        </Text>
      </RadixCard>
    </Box>
  );
}
