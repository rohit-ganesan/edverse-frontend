import { Box, Flex, Text, Heading } from '@radix-ui/themes';
import { RadixCard } from 'components/ui/RadixCard';
import { Bell, FileText, RefreshCw, ChevronRight } from 'lucide-react';

interface QuickActionItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: string;
  urgent?: boolean;
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
      id: 'payment-reminders',
      title: 'Send Payment Reminders',
      description: 'Send automated reminders to students with pending payments',
      icon: Bell,
      count: '15 items',
      urgent: true,
      onClick: () => console.log('Navigate to payment reminders'),
    },
    {
      id: 'collection-report',
      title: 'Generate Collection Report',
      description: 'Generate detailed collection report for this month',
      icon: FileText,
      onClick: () => console.log('Generate collection report'),
    },
    {
      id: 'pending-refunds',
      title: 'Process Pending Refunds',
      description: 'Review and process pending refund requests',
      icon: RefreshCw,
      count: '3 items',
      onClick: () => console.log('Navigate to pending refunds'),
    },
  ];

  return (
    <RadixCard
      className={`p-0 shadow-xl border-0 bg-white overflow-hidden ${className}`}
    >
      <Box className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
        <Heading size="4" className="text-gray-900 mb-1">
          Quick Actions
        </Heading>
        <Text size="2" className="text-gray-600">
          Common tasks and operations
        </Text>
      </Box>

      <Box className="p-6">
        <Flex direction="column" gap="3">
          {quickActions.map((action) => (
            <Box
              key={action.id}
              className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
              onClick={action.onClick}
            >
              <Flex align="center" gap="3">
                <Box
                  className={`p-2 rounded-lg ${
                    action.urgent ? 'bg-red-100' : 'bg-blue-100'
                  }`}
                >
                  <action.icon
                    className={`w-5 h-5 ${
                      action.urgent ? 'text-red-600' : 'text-blue-600'
                    }`}
                  />
                </Box>
                <Box className="flex-1">
                  <Text
                    size="2"
                    weight="medium"
                    className="text-gray-900 block mb-1"
                  >
                    {action.title}
                  </Text>
                  <Text size="1" className="text-gray-600">
                    {action.description}
                  </Text>
                  {action.count && (
                    <Text
                      size="1"
                      className={`mt-1 inline-block px-2 py-1 rounded-full ${
                        action.urgent
                          ? 'bg-red-100 text-red-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}
                    >
                      {action.count}
                    </Text>
                  )}
                </Box>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Flex>
            </Box>
          ))}
        </Flex>
      </Box>
    </RadixCard>
  );
}
