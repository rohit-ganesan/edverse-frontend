import { Box, Flex, Text, Badge } from '@radix-ui/themes';
import { RadixButton } from 'components/ui/RadixButton';
import { Eye } from 'lucide-react';
import { Application } from '../types';

interface ApplicationCardProps {
  application: Application;
  onView?: (application: Application) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'accepted':
      return 'green';
    case 'rejected':
      return 'red';
    case 'under_review':
      return 'yellow';
    case 'interview_scheduled':
      return 'blue';
    case 'waitlisted':
      return 'purple';
    case 'submitted':
      return 'gray';
    default:
      return 'gray';
  }
};

export function ApplicationCard({
  application,
  onView,
}: ApplicationCardProps): JSX.Element {
  return (
    <Box className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <Flex justify="between" align="start" className="mb-2">
        <Box>
          <Text size="3" weight="medium" className="text-gray-900">
            {application.studentName}
          </Text>
          <Text size="2" className="text-gray-600">
            {application.applicationNumber} • {application.program}
          </Text>
        </Box>
        <Badge color={getStatusColor(application.status)}>
          {application.status.replace('_', ' ')}
        </Badge>
      </Flex>
      <Flex justify="between" align="center">
        <Text size="2" className="text-gray-600">
          GPA: {application.scores.gpa} • Submitted:{' '}
          {new Date(application.submissionDate).toLocaleDateString()}
        </Text>
        {onView && (
          <RadixButton
            variant="ghost"
            size="1"
            onClick={() => onView(application)}
          >
            <Eye className="w-4 h-4" />
          </RadixButton>
        )}
      </Flex>
    </Box>
  );
}
