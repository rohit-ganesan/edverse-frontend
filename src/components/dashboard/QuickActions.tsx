import { Box, Flex, Text, Heading, Grid } from '@radix-ui/themes';
import { RadixCard } from 'components/ui/RadixCard';
import { Button } from 'components/ui/RadixButton';
import { BookOpen, Users, Calendar, Eye } from 'lucide-react';

interface QuickActionItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
}

interface QuickActionsProps {
  className?: string;
}

export function QuickActions({
  className = '',
}: QuickActionsProps): JSX.Element {
  const quickActions: QuickActionItem[] = [
    {
      id: 'subjects',
      title: 'Subjects',
      subtitle: 'Manage subjects',
      icon: BookOpen,
      onClick: () => console.log('Navigate to subjects'),
    },
    {
      id: 'classes',
      title: 'Classes',
      subtitle: 'View all classes',
      icon: Users,
      onClick: () => console.log('Navigate to classes'),
    },
    {
      id: 'attendance',
      title: 'Attendance',
      subtitle: 'Track attendance',
      icon: Calendar,
      onClick: () => console.log('Navigate to attendance'),
    },
    {
      id: 'students',
      title: 'Students',
      subtitle: 'Manage students',
      icon: Eye,
      onClick: () => console.log('Navigate to students'),
    },
    {
      id: 'attendance-2',
      title: 'Attendance',
      subtitle: 'View reports',
      icon: Calendar,
      onClick: () => console.log('Navigate to attendance reports'),
    },
    {
      id: 'students-2',
      title: 'Students',
      subtitle: 'Student records',
      icon: Eye,
      onClick: () => console.log('Navigate to student records'),
    },
  ];

  return (
    <RadixCard size="2" className={`p-6 ${className}`}>
      <Box className="mb-4">
        <Heading size="4" className="text-gray-900">
          Quick Actions
        </Heading>
      </Box>

      <Grid columns="2" gap="4">
        {quickActions.map((action) => (
          <Button
            key={action.id}
            variant="ghost"
            className="h-auto p-4 justify-start"
            onClick={action.onClick}
          >
            <Flex align="center" gap="3" className="w-full">
              <Box className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <action.icon className="w-5 h-5 text-gray-600" />
              </Box>
              <Box className="text-left">
                <Text size="2" weight="medium" className="text-gray-900 block">
                  {action.title}
                </Text>
                <Text size="1" className="text-gray-600">
                  {action.subtitle}
                </Text>
              </Box>
            </Flex>
          </Button>
        ))}
      </Grid>
    </RadixCard>
  );
}
