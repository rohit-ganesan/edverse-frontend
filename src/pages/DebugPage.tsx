// No React import needed with new JSX transform
import { useState } from 'react';
import { Container, Flex, Box, Heading, Text } from '@radix-ui/themes';
import { RadixButton } from 'components/ui/RadixButton';
import { RadixCard } from 'components/ui/RadixCard';
import { supabase } from 'lib/supabase';
import { useAuth } from 'features/auth/AuthContext';

export function DebugPage(): JSX.Element {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const addResult = (result: string): void => {
    setTestResults((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${result}`,
    ]);
  };

  const runSupabaseTests = async (): Promise<void> => {
    setLoading(true);
    setTestResults([]);

    try {
      // Test 1: Supabase Connection
      addResult('🔧 Testing Supabase connection...');
      addResult(`✅ Supabase client initialized`);
      addResult(`Project URL: ${process.env.REACT_APP_SUPABASE_URL}`);

      // Test 2: Auth Status
      addResult('🔐 Checking authentication status...');
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        addResult(`❌ Session error: ${sessionError.message}`);
      } else if (session) {
        addResult(`✅ User authenticated: ${session.user.email}`);
        addResult(`User ID: ${session.user.id}`);
        addResult(
          `Email verified: ${session.user.email_confirmed_at ? 'Yes' : 'No'}`
        );
      } else {
        addResult('ℹ️ No active session');
      }

      // Test 3: Database Connection
      addResult('🗄️ Testing database connection...');
      try {
        const { data, error } = await supabase
          .from('users')
          .select('count')
          .limit(1);

        if (error) {
          addResult(`❌ Database error: ${error.message}`);
          if (error.code === 'PGRST301') {
            addResult('💡 Hint: Check if RLS policies are properly configured');
          }
        } else {
          addResult('✅ Database connection successful');
        }
      } catch (dbError: any) {
        addResult(`❌ Database connection failed: ${dbError.message}`);
      }

      // Test 4: User Profile Check
      if (user) {
        addResult('👤 Testing user profile...');
        try {
          const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profileError) {
            addResult(`❌ Profile fetch error: ${profileError.message}`);
            if (profileError.code === 'PGRST116') {
              addResult('💡 Profile not found - may need to be created');
            }
          } else {
            addResult(
              `✅ Profile found: ${profile.first_name} ${profile.last_name}`
            );
            addResult(`Role: ${profile.role}`);
          }
        } catch (profileError: any) {
          addResult(`❌ Profile test failed: ${profileError.message}`);
        }
      }

      // Test 5: RLS Policy Test
      addResult('🔒 Testing Row Level Security...');
      try {
        const { data: users, error: rlsError } = await supabase
          .from('users')
          .select('id')
          .limit(5);

        if (rlsError) {
          addResult(`❌ RLS test failed: ${rlsError.message}`);
          if (rlsError.code === '42501') {
            addResult('💡 RLS is active but policies may be restrictive');
          }
        } else {
          addResult(
            `✅ RLS test passed - can access ${users?.length || 0} users`
          );
        }
      } catch (rlsError: any) {
        addResult(`❌ RLS test error: ${rlsError.message}`);
      }

      // Test 6: Network Connectivity
      addResult('🌐 Testing network connectivity...');
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SUPABASE_URL}/rest/v1/`,
          {
            headers: {
              apikey: process.env.REACT_APP_SUPABASE_ANON_KEY!,
              Authorization: `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY!}`,
            },
          }
        );

        if (response.ok) {
          addResult('✅ Network connectivity working');
        } else {
          addResult(
            `⚠️ Network response: ${response.status} ${response.statusText}`
          );
        }
      } catch (netError: any) {
        addResult(`❌ Network error: ${netError.message}`);
      }
    } catch (error: any) {
      addResult(`❌ Test failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="min-h-screen bg-gray-50 p-8">
      <Container size="4">
        <Flex direction="column" gap="6">
          <Heading size="7" className="text-gray-900">
            Supabase Debug Page
          </Heading>

          <RadixCard size="3">
            <Flex direction="column" gap="4" className="p-6">
              <Heading size="5">Supabase Configuration Test</Heading>
              <Text className="text-gray-600">
                Current user: {user ? user.email : 'Not authenticated'}
              </Text>
              <RadixButton
                onClick={runSupabaseTests}
                loading={loading}
                disabled={loading}
                size="3"
              >
                Run Supabase Tests
              </RadixButton>
            </Flex>
          </RadixCard>

          {testResults.length > 0 && (
            <RadixCard size="3">
              <Flex direction="column" gap="4" className="p-6">
                <Heading size="4">Test Results</Heading>
                <Box className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
                  {testResults.map((result, index) => (
                    <Box key={index} className="mb-1">
                      {result}
                    </Box>
                  ))}
                </Box>
              </Flex>
            </RadixCard>
          )}

          <RadixCard size="3" className="bg-blue-50 border border-blue-200">
            <Flex direction="column" gap="4" className="p-6">
              <Heading size="4" className="text-blue-900">
                Common Supabase Issues & Solutions:
              </Heading>
              <Box className="text-blue-800 space-y-2">
                <Text as="div" size="2">
                  • Check your{' '}
                  <a
                    href="https://app.supabase.com/project/fqyzfpbrlkenhrnnlalb"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Supabase Dashboard
                  </a>
                </Text>
                <Text as="div" size="2">
                  • Verify <strong>Row Level Security</strong> policies are
                  configured
                </Text>
                <Text as="div" size="2">
                  • Check <strong>Authentication</strong> settings and providers
                </Text>
                <Text as="div" size="2">
                  • Ensure <strong>API Keys</strong> are correctly set in
                  .env.local
                </Text>
                <Text as="div" size="2">
                  • Verify database <strong>tables</strong> exist with proper
                  schemas
                </Text>
                <Text as="div" size="2">
                  • Check <strong>Site URL</strong> and{' '}
                  <strong>Redirect URLs</strong> in Auth settings
                </Text>
              </Box>
            </Flex>
          </RadixCard>
        </Flex>
      </Container>
    </Box>
  );
}
