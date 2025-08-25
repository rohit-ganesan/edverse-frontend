import React from 'react';
import { Box, Flex, Text } from '@radix-ui/themes';
import { CreditCard, CheckCircle, Star } from 'lucide-react';

export const BillingPage: React.FC = () => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      features: [
        'Basic attendance tracking',
        'Student management',
        'Course management',
        'Basic fee tracking',
        'Simple announcements',
      ],
      current: true,
    },
    {
      name: 'Starter',
      price: '$29/month',
      features: [
        'Everything in Free',
        'Bulk attendance import',
        'Grade management',
        'Course CRUD operations',
        'Basic analytics',
      ],
      current: false,
    },
    {
      name: 'Growth',
      price: '$79/month',
      features: [
        'Everything in Starter',
        'Online payments',
        'Email reminders',
        'Advanced announcements',
        'Parent portal',
        'Full analytics',
      ],
      current: false,
    },
    {
      name: 'Scale',
      price: '$199/month',
      features: [
        'Everything in Growth',
        'SSO authentication',
        'SMS/WhatsApp reminders',
        'Audit logs',
        'API access',
      ],
      current: false,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      features: [
        'Everything in Scale',
        'Custom branding',
        'Admissions management',
        'Advanced curriculum tools',
        'Integrations',
      ],
      current: false,
    },
  ];

  return (
    <Box className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Box className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Box className="text-center mb-12">
          <Text
            size="6"
            weight="bold"
            className="text-gray-900 dark:text-gray-100 mb-4"
          >
            Choose Your Plan
          </Text>
          <Text size="4" className="text-gray-600 dark:text-gray-400">
            Select the perfect plan for your educational institution
          </Text>
        </Box>

        <Flex gap="6" wrap="wrap" justify="center">
          {plans.map((plan) => (
            <Box
              key={plan.name}
              className={`
                bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-80
                ${plan.current ? 'ring-2 ring-blue-500' : ''}
              `}
            >
              <Box className="text-center mb-6">
                <Flex align="center" justify="center" gap="2" className="mb-2">
                  <Text
                    size="5"
                    weight="bold"
                    className="text-gray-900 dark:text-gray-100"
                  >
                    {plan.name}
                  </Text>
                  {plan.current && (
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                  )}
                </Flex>
                <Text
                  size="6"
                  weight="bold"
                  className="text-blue-600 dark:text-blue-400 mb-1"
                >
                  {plan.price}
                </Text>
                {plan.name !== 'Free' && (
                  <Text size="2" className="text-gray-500 dark:text-gray-400">
                    per month
                  </Text>
                )}
              </Box>

              <Box className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <Flex key={index} align="center" gap="2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <Text size="2" className="text-gray-700 dark:text-gray-300">
                      {feature}
                    </Text>
                  </Flex>
                ))}
              </Box>

              <Box className="text-center">
                {plan.current ? (
                  <Box className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                    <Text size="2" className="text-gray-600 dark:text-gray-400">
                      Current Plan
                    </Text>
                  </Box>
                ) : (
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                    {plan.name === 'Enterprise' ? 'Contact Sales' : 'Upgrade'}
                  </button>
                )}
              </Box>
            </Box>
          ))}
        </Flex>

        <Box className="text-center mt-12">
          <Text size="3" className="text-gray-600 dark:text-gray-400">
            Need help choosing? Contact our sales team for a personalized
            consultation.
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default BillingPage;
