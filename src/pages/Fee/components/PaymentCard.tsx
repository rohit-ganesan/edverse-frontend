import { Box, Flex, Text, Badge } from '@radix-ui/themes';
import { RadixButton } from 'components/ui/RadixButton';
import {
  Send,
  Phone,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import { Payment } from '../types';

interface PaymentCardProps {
  payment: Payment;
  onSendReminder?: (payment: Payment) => void;
  onCall?: (payment: Payment) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'paid':
      return 'green';
    case 'partial':
      return 'yellow';
    case 'pending':
      return 'blue';
    case 'overdue':
      return 'red';
    default:
      return 'gray';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'paid':
      return CheckCircle;
    case 'partial':
      return Clock;
    case 'pending':
      return AlertTriangle;
    case 'overdue':
      return XCircle;
    default:
      return AlertTriangle;
  }
};

export function PaymentCard({
  payment,
  onSendReminder,
  onCall,
}: PaymentCardProps): JSX.Element {
  const StatusIcon = getStatusIcon(payment.status);
  const isOverdue = payment.status === 'overdue';

  return (
    <Box
      className={`p-4 rounded-lg ${isOverdue ? 'bg-red-50 border-l-4 border-red-400' : 'bg-gray-50'} hover:bg-opacity-80 transition-colors`}
    >
      <Flex justify="between" align="start" className="mb-2">
        <Box>
          <Text
            size="3"
            weight="medium"
            className={isOverdue ? 'text-red-800' : 'text-gray-900'}
          >
            {payment.studentName}
          </Text>
          <Text
            size="2"
            className={isOverdue ? 'text-red-600' : 'text-gray-600'}
          >
            {payment.feeType}
            {isOverdue &&
              ` • Due: ${new Date(payment.dueDate).toLocaleDateString()}`}
          </Text>
        </Box>
        {isOverdue ? (
          <Text size="3" weight="bold" className="text-red-600">
            ${payment.remainingAmount.toLocaleString()}
          </Text>
        ) : (
          <Badge color={getStatusColor(payment.status)}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {payment.status}
          </Badge>
        )}
      </Flex>

      {!isOverdue && (
        <Flex justify="between" align="center">
          <Text size="2" className="text-gray-600">
            ${payment.paidAmount.toLocaleString()} / $
            {payment.amount.toLocaleString()}
          </Text>
          <Text size="2" className="text-gray-500">
            {payment.paymentDate
              ? new Date(payment.paymentDate).toLocaleDateString()
              : 'Not paid'}
          </Text>
        </Flex>
      )}

      {isOverdue && (onSendReminder || onCall) && (
        <Flex gap="2" className="mt-3">
          {onSendReminder && (
            <RadixButton
              variant="solid"
              size="1"
              className="bg-red-600"
              onClick={() => onSendReminder(payment)}
            >
              <Send className="w-3 h-3 mr-1" />
              Send Reminder
            </RadixButton>
          )}
          {onCall && (
            <RadixButton
              variant="outline"
              size="1"
              onClick={() => onCall(payment)}
            >
              <Phone className="w-3 h-3 mr-1" />
              Call
            </RadixButton>
          )}
        </Flex>
      )}
    </Box>
  );
}
