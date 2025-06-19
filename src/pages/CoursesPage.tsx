import { Link } from 'react-router-dom';
import { Container, Flex, Box, Heading, Text } from '@radix-ui/themes';
import { Button } from 'components/ui/RadixButton';
import { RadixCard } from 'components/ui/RadixCard';
import { useAuth } from 'features/auth/AuthContext';

export function CoursesPage(): JSX.Element {
  const { user, signOut } = useAuth();

  const handleSignOut = async (): Promise<void> => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <Box className="min-h-screen bg-gray-50">
      <Box className="bg-white shadow">
        <Container size="4">
          <Flex justify="between" align="center" className="py-6">
            <Heading size="7" className="text-blue-600">
              EdVerse
            </Heading>
            <Flex align="center" gap="4">
              <Text color="gray">Welcome, {user?.email || 'User'}</Text>
              <Button onClick={handleSignOut} variant="outline" size="2">
                Sign Out
              </Button>
            </Flex>
          </Flex>
        </Container>
      </Box>

      <Container size="4" className="py-6">
        <Box className="px-4 py-6">
          <RadixCard size="3" className="p-8">
            <Flex
              direction="column"
              align="center"
              className="text-center"
              gap="6"
            >
              <Box>
                <Heading size="6" className="mb-2">
                  Courses
                </Heading>
                <Text size="4" color="gray">
                  Browse and enroll in available courses.
                </Text>
              </Box>
              <Text size="3" color="gray">
                This is a protected route! You can only access this page when
                authenticated.
              </Text>
              <Link to="/dashboard">
                <Button variant="outline" size="3">
                  ← Back to Dashboard
                </Button>
              </Link>
            </Flex>
          </RadixCard>
        </Box>
      </Container>
    </Box>
  );
}
