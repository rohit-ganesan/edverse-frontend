// No React import needed with new JSX transform
import { useState } from 'react';
import { Container, Flex, Box, Heading, Text } from '@radix-ui/themes';
import { Button } from 'components/ui/RadixButton';
import { RadixCard } from 'components/ui/RadixCard';
import { auth } from 'lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export function DebugPage(): JSX.Element {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (result: string): void => {
    setTestResults((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${result}`,
    ]);
  };

  const runFirebaseTests = async (): Promise<void> => {
    setLoading(true);
    setTestResults([]);

    try {
      // Test 1: Firebase App Initialization
      addResult('✅ Firebase app initialized successfully');
      addResult(`Project ID: ${auth.app.options.projectId}`);
      addResult(`Auth Domain: ${auth.app.options.authDomain}`);

      // Test 2: Auth Instance
      if (auth) {
        addResult('✅ Firebase Auth instance created');
        addResult(
          `Current User: ${auth.currentUser ? auth.currentUser.email : 'None'}`
        );
      } else {
        addResult('❌ Firebase Auth instance not available');
      }

      // Test 3: Test with invalid credentials to see what error we get
      addResult('🧪 Testing authentication with dummy credentials...');

      try {
        await signInWithEmailAndPassword(
          auth,
          'test@test.com',
          'wrongpassword'
        );
      } catch (error: any) {
        if (
          error.code === 'auth/user-not-found' ||
          error.code === 'auth/wrong-password' ||
          error.code === 'auth/invalid-credential'
        ) {
          addResult('✅ Auth is working - got expected auth error');
        } else if (error.code === 'auth/configuration-not-found') {
          addResult(
            '❌ CONFIGURATION_NOT_FOUND error - Firebase Auth not configured'
          );
          addResult(`Error details: ${error.message}`);
        } else {
          addResult(`⚠️ Unexpected error: ${error.code} - ${error.message}`);
        }
      }

      // Test 4: Network connectivity
      addResult('🌐 Testing network connectivity...');
      try {
        const response = await fetch(
          'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
            auth.app.options.apiKey,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: 'test@example.com',
              password: 'testpass',
              returnSecureToken: true,
            }),
          }
        );

        if (response.status === 400) {
          const errorData = await response.json();
          if (errorData.error?.message === 'CONFIGURATION_NOT_FOUND') {
            addResult('❌ Firebase project configuration not found');
            addResult(
              '📋 Please check: 1) Firebase project exists 2) Auth is enabled 3) Web app is configured'
            );
          } else {
            addResult(
              `✅ Network request successful, got: ${errorData.error?.message || 'Unknown error'}`
            );
          }
        } else {
          addResult('✅ Network connectivity working');
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
            Firebase Debug Page
          </Heading>

          <RadixCard size="3">
            <Flex direction="column" gap="4" className="p-6">
              <Heading size="5">Firebase Configuration Test</Heading>
              <Button
                onClick={runFirebaseTests}
                loading={loading}
                disabled={loading}
                size="3"
              >
                Run Firebase Tests
              </Button>
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
                Common Solutions for CONFIGURATION_NOT_FOUND:
              </Heading>
              <Box className="text-blue-800 space-y-2">
                <Text as="div" size="2">
                  • Go to{' '}
                  <a
                    href="https://console.firebase.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Firebase Console
                  </a>
                </Text>
                <Text as="div" size="2">
                  • Select your project: <strong>edverse-f1640</strong>
                </Text>
                <Text as="div" size="2">
                  • Go to <strong>Authentication</strong> →{' '}
                  <strong>Get Started</strong>
                </Text>
                <Text as="div" size="2">
                  • Enable <strong>Email/Password</strong> provider in the
                  Sign-in method tab
                </Text>
                <Text as="div" size="2">
                  • Enable <strong>Google</strong> provider if you want Google
                  sign-in
                </Text>
                <Text as="div" size="2">
                  • Add your domain (<strong>localhost</strong> for development)
                  to authorized domains
                </Text>
                <Text as="div" size="2">
                  • Verify the Web App configuration matches your config
                </Text>
              </Box>
            </Flex>
          </RadixCard>
        </Flex>
      </Container>
    </Box>
  );
}
