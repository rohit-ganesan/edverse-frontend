import React from 'react';
import { useAccess } from '../context/AccessContext';
import {
  Card,
  Flex,
  Text,
  Heading,
  Button,
  Box,
  Grid,
  Badge,
  Separator,
  Container,
} from '@radix-ui/themes';
import { Check, Sparkles } from 'lucide-react';

export function BillingPage(): JSX.Element {
  const { plan } = useAccess();

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        'View students, courses, and classes',
        'View attendance and results',
        'View notices and fees',
        'Basic dashboard',
      ],
      current: plan === 'free',
      cta: 'Current Plan',
      ctaVariant: 'soft' as const,
    },
    {
      name: 'Starter',
      price: '$29',
      period: 'per month',
      description: 'Everything you need for daily operations',
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
      cta: plan === 'starter' ? 'Current Plan' : 'Upgrade to Starter',
      ctaVariant: plan === 'starter' ? ('soft' as const) : ('solid' as const),
      popular: true,
    },
    {
      name: 'Growth',
      price: '$99',
      period: 'per month',
      description: 'Advanced analytics and insights',
      features: [
        'Everything in Starter',
        'Advanced analytics dashboard',
        'Detailed reporting',
        'Performance insights',
        'Data export capabilities',
      ],
      current: plan === 'growth',
      cta: plan === 'growth' ? 'Current Plan' : 'Upgrade to Growth',
      ctaVariant: plan === 'growth' ? ('soft' as const) : ('solid' as const),
    },
  ];

  return (
    <Container size="4" className="py-8">
      {/* Header */}
      <Box className="text-center mb-12">
        <Heading size="8" className="mb-4">
          Choose Your Plan
        </Heading>
        <Text size="4" color="gray">
          Select the perfect plan for your educational institution
        </Text>
      </Box>

      {/* Plans Grid */}
      <Grid columns={{ initial: '1', md: '3' }} gap="6" className="mb-12">
        {plans.map((planItem) => (
          <Card
            key={planItem.name}
            className={`p-8 relative ${
              planItem.popular
                ? 'border-2 border-blue-500 shadow-lg'
                : 'border border-gray-200'
            }`}
          >
            {planItem.popular && (
              <Badge
                color="blue"
                variant="solid"
                className="absolute -top-3 left-1/2 transform -translate-x-1/2"
              >
                Most Popular
              </Badge>
            )}

            <Box className="text-center mb-6">
              <Heading size="6" className="mb-2">
                {planItem.name}
              </Heading>
              <Text size="2" color="gray" className="mb-4">
                {planItem.description}
              </Text>
              <Flex align="baseline" justify="center" gap="1">
                <Text size="8" weight="bold">
                  {planItem.price}
                </Text>
                <Text size="3" color="gray">
                  {planItem.period}
                </Text>
              </Flex>
            </Box>

            <Box className="mb-8">
              <ul className="space-y-3">
                {planItem.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <Text size="2">{feature}</Text>
                  </li>
                ))}
              </ul>
            </Box>

            <Button
              size="4"
              variant={planItem.ctaVariant}
              className="w-full"
              disabled={planItem.current}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {planItem.cta}
            </Button>
          </Card>
        ))}
      </Grid>

      <Separator className="my-12" />

      {/* Contact Sales */}
      <Card className="text-center p-8">
        <Heading size="5" className="mb-4">
          Need a Custom Solution?
        </Heading>
        <Text size="3" color="gray" className="mb-6">
          Contact our sales team for a personalized consultation and custom
          pricing options.
        </Text>
        <Button size="3">Contact Sales Team</Button>
      </Card>
    </Container>
  );
}
