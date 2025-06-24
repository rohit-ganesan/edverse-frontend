import { Box, Flex, Text, Heading, Grid } from '@radix-ui/themes';
import { RadixCard } from 'components/ui/RadixCard';
import { RadixButton } from 'components/ui/RadixButton';
import {
  CreditCard,
  Building,
  Wallet,
  Receipt,
  Send,
  Phone,
} from 'lucide-react';
import { useFeeData } from '../hooks/useFeeData';
import { PaymentCard } from '../components/PaymentCard';

export function Overview(): JSX.Element {
  const { payments, feeStructure } = useFeeData();

  const handleSendReminder = (payment: any) => {
    console.log('Send reminder to:', payment.studentName);
  };

  const handleCall = (payment: any) => {
    console.log('Call:', payment.studentName);
  };

  return (
    <Grid columns="2" gap="8">
      {/* Recent Payments */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <Heading size="4" className="text-gray-900 mb-1">
            Recent Payments
          </Heading>
          <Text size="2" className="text-gray-600">
            Latest payment transactions
          </Text>
        </Box>

        <Box className="p-6">
          <Flex direction="column" gap="4">
            {payments.slice(0, 5).map((payment) => (
              <PaymentCard
                key={payment.id}
                payment={payment}
                onSendReminder={handleSendReminder}
                onCall={handleCall}
              />
            ))}
          </Flex>
        </Box>
      </RadixCard>

      {/* Overdue Payments */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-red-50 to-rose-50 border-b border-red-100">
          <Heading size="4" className="text-gray-900 mb-1">
            Overdue Payments
          </Heading>
          <Text size="2" className="text-gray-600">
            Payments requiring immediate attention
          </Text>
        </Box>

        <Box className="p-6">
          <Flex direction="column" gap="4">
            {payments
              .filter((p) => p.status === 'overdue')
              .map((payment) => (
                <PaymentCard
                  key={payment.id}
                  payment={payment}
                  onSendReminder={handleSendReminder}
                  onCall={handleCall}
                />
              ))}
            {payments.filter((p) => p.status === 'overdue').length === 0 && (
              <Box className="text-center py-8">
                <Text size="2" className="text-gray-500">
                  No overdue payments
                </Text>
              </Box>
            )}
          </Flex>
        </Box>
      </RadixCard>

      {/* Payment Methods Distribution */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-100">
          <Heading size="4" className="text-gray-900 mb-1">
            Payment Methods
          </Heading>
          <Text size="2" className="text-gray-600">
            Distribution by payment type
          </Text>
        </Box>

        <Box className="p-6">
          <Flex direction="column" gap="4">
            <Box className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Flex justify="between" align="center">
                <Flex align="center" gap="3">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <Text size="2" weight="medium" className="text-gray-700">
                    Online Payment
                  </Text>
                </Flex>
                <Text size="3" weight="bold" className="text-blue-600">
                  45%
                </Text>
              </Flex>
            </Box>

            <Box className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Flex justify="between" align="center">
                <Flex align="center" gap="3">
                  <Building className="w-5 h-5 text-green-600" />
                  <Text size="2" weight="medium" className="text-gray-700">
                    Bank Transfer
                  </Text>
                </Flex>
                <Text size="3" weight="bold" className="text-green-600">
                  30%
                </Text>
              </Flex>
            </Box>

            <Box className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Flex justify="between" align="center">
                <Flex align="center" gap="3">
                  <Wallet className="w-5 h-5 text-purple-600" />
                  <Text size="2" weight="medium" className="text-gray-700">
                    Cash
                  </Text>
                </Flex>
                <Text size="3" weight="bold" className="text-purple-600">
                  20%
                </Text>
              </Flex>
            </Box>

            <Box className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Flex justify="between" align="center">
                <Flex align="center" gap="3">
                  <Receipt className="w-5 h-5 text-orange-600" />
                  <Text size="2" weight="medium" className="text-gray-700">
                    Check
                  </Text>
                </Flex>
                <Text size="3" weight="bold" className="text-orange-600">
                  5%
                </Text>
              </Flex>
            </Box>
          </Flex>
        </Box>
      </RadixCard>

      {/* Upcoming Due Dates */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
          <Heading size="4" className="text-gray-900 mb-1">
            Upcoming Due Dates
          </Heading>
          <Text size="2" className="text-gray-600">
            Fee deadlines approaching
          </Text>
        </Box>

        <Box className="p-6">
          <Flex direction="column" gap="4">
            {feeStructure.map((fee) => (
              <Box
                key={fee.id}
                className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg"
              >
                <Flex justify="between" align="center">
                  <Box>
                    <Text size="2" weight="medium" className="text-yellow-800">
                      {fee.name}
                    </Text>
                    <Text size="1" className="text-yellow-600">
                      Due: {new Date(fee.dueDate).toLocaleDateString()}
                    </Text>
                  </Box>
                  <Text size="2" weight="bold" className="text-yellow-600">
                    ${fee.amount.toLocaleString()}
                  </Text>
                </Flex>
              </Box>
            ))}
          </Flex>
        </Box>
      </RadixCard>
    </Grid>
  );
}
