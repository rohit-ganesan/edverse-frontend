// No React import needed with new JSX transform
import { Link } from 'react-router-dom';
import { Container, Flex, Box, Heading, Text, Grid } from '@radix-ui/themes';
import { Button } from 'components/ui/RadixButton';
import { RadixCard } from 'components/ui/RadixCard';
import { useAuth } from 'features/auth/AuthContext';

export function DashboardPage(): JSX.Element {
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
          <Box className="border-4 border-dashed border-gray-200 rounded-lg min-h-96 flex items-center justify-center p-8">
            <Flex
              direction="column"
              align="center"
              className="text-center"
              gap="6"
            >
              <Box>
                <Heading size="6" className="mb-2">
                  Welcome to EdVerse!
                </Heading>
                <Text size="4" color="gray">
                  Your learning dashboard will be built here.
                </Text>
              </Box>
              <Grid columns="3" gap="4" className="max-w-2xl">
                <Link to="/courses" className="no-underline">
                  <RadixCard
                    size="2"
                    className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <Flex direction="column" gap="2">
                      <Heading size="4">Courses</Heading>
                      <Text size="2" color="gray">
                        Explore and enroll in courses
                      </Text>
                    </Flex>
                  </RadixCard>
                </Link>
                <RadixCard size="2" className="p-6">
                  <Flex direction="column" gap="2">
                    <Heading size="4">Progress</Heading>
                    <Text size="2" color="gray">
                      Track your learning progress
                    </Text>
                  </Flex>
                </RadixCard>
                <RadixCard size="2" className="p-6">
                  <Flex direction="column" gap="2">
                    <Heading size="4">Achievements</Heading>
                    <Text size="2" color="gray">
                      View your accomplishments
                    </Text>
                  </Flex>
                </RadixCard>
              </Grid>
            </Flex>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
