import React from 'react';
import { Box, Flex, Text, Button } from '@radix-ui/themes';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { useAccess } from '../context/AccessContext';
import { useNavigate } from 'react-router-dom';

export const BillingPage: React.FC = () => {
  const { plan } = useAccess();
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Free',
      price: 0,
      period: 'per month',
      features: [
        'View students, courses, and classes',
        'View attendance and results',
        'View notices and fees',
        'Basic dashboard',
      ],
      current: plan === 'free',
    },
    {
      name: 'Starter',
      price: 29,
      period: 'per month',
      features: [
        'Everything in Free',
        'Record attendance',
        'Enter results and grades',
        'Send notices to students',
        'Invite staff members',
        'Basic integrations',
        'Parent & student portals',
      ],
      current: plan === 'starter',
    },
    {
      name: 'Growth',
      price: 99,
      period: 'per month',
      features: [
        'Everything in Starter',
        'Advanced analytics dashboard',
        'Detailed reporting',
        'Performance insights',
        'Data export capabilities',
      ],
      current: plan === 'growth',
    },
  ];

  return (
    <Box className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Box className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Box className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Box>

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
          {plans.map((planItem) => (
            <Box
              key={planItem.name}
              className={`
                bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-80
                ${planItem.current ? 'ring-2 ring-blue-500' : ''}
              `}
            >
              <Box className="text-center mb-6">
                <Flex align="center" justify="center" gap="2" className="mb-2">
                  <Text
                    size="5"
                    weight="bold"
                    className="text-gray-900 dark:text-gray-100"
                  >
                    {planItem.name}
                  </Text>
                  {planItem.current && (
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                  )}
                </Flex>
                <Flex align="baseline" justify="center" gap="1">
                  <Text
                    size="6"
                    weight="bold"
                    className="text-blue-600 dark:text-blue-400"
                  >
                    ${planItem.price}
                  </Text>
                  <Text size="3" className="text-gray-500 dark:text-gray-400">
                    {planItem.period}
                  </Text>
                </Flex>
              </Box>

              <Box className="space-y-3 mb-6">
                {planItem.features.map((feature, index) => (
                  <Flex key={index} align="center" gap="2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <Text size="2" className="text-gray-700 dark:text-gray-300">
                      {feature}
                    </Text>
                  </Flex>
                ))}
              </Box>

              <Box className="text-center">
                {planItem.current ? (
                  <Box className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                    <Text size="2" className="text-gray-600 dark:text-gray-400">
                      Current Plan
                    </Text>
                  </Box>
                ) : (
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                    {plan === 'free' ? 'Upgrade' : 'Contact Sales'}
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
