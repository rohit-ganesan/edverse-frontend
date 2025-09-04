import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAccess } from '../context/AccessContext';
import { getAddonByFeature, getPopularAddons } from '../config/addons';
import { useAccessTelemetry } from '../hooks/useAccessTelemetry';
import {
  Card,
  Flex,
  Text,
  Button,
  Badge,
  Container,
  Heading,
  Box,
  Grid,
  Separator,
  Tabs,
} from '@radix-ui/themes';

export function BillingPage(): JSX.Element {
  const [searchParams] = useSearchParams();
  const { plan, features } = useAccess();
  const { trackFeatureLockedViewed } = useAccessTelemetry();

  const addonFeature = searchParams.get('addon');
  const addonInfo = addonFeature ? getAddonByFeature(addonFeature) : null;
  const popularAddons = getPopularAddons();

  useEffect(() => {
    if (addonFeature) {
      trackFeatureLockedViewed({
        feature: addonFeature,
        plan,
        context: 'billing_page',
      });
    }
  }, [addonFeature, plan, trackFeatureLockedViewed]);

  return (
    <Container size="4" className="py-8">
      {/* Header */}
      <Box className="text-center mb-12">
        <Heading size="8" className="mb-4">
          {addonInfo ? `Enable ${addonInfo.label}` : 'Choose Your Plan'}
        </Heading>
        <Text size="4" color="gray">
          {addonInfo
            ? `Unlock ${addonInfo.description}`
            : 'Select the perfect plan for your educational institution'}
        </Text>
      </Box>

      {/* Featured Add-on (if specific addon requested) */}
      {addonInfo && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 mb-12">
          <Flex justify="between" align="center" className="p-8">
            <Box className="flex-1">
              <Heading size="5" className="text-blue-900 mb-2">
                {addonInfo.label}
              </Heading>
              <Text size="3" color="blue" className="text-blue-700 mb-3">
                {addonInfo.description}
              </Text>
              <Badge color="blue" variant="soft" className="capitalize">
                {addonInfo.category}
              </Badge>
            </Box>
            <Box className="text-right">
              <Text size="7" weight="bold" className="text-blue-900 mb-3">
                {addonInfo.price}
              </Text>
              <Button size="4" className="bg-blue-600 hover:bg-blue-700">
                Enable Now
              </Button>
            </Box>
          </Flex>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs.Root defaultValue="plans" className="w-full">
        <Tabs.List className="grid w-full grid-cols-2 mb-8">
          <Tabs.Trigger value="plans">Plans & Pricing</Tabs.Trigger>
          <Tabs.Trigger value="addons">Add-ons & Features</Tabs.Trigger>
        </Tabs.List>

        {/* Plans Tab */}
        <Tabs.Content value="plans" className="space-y-8">
          <Box>
            <Heading size="6" className="mb-8 text-center">
              Choose Your Plan
            </Heading>
            <Grid columns={{ initial: '1', md: '3' }} gap="6">
              {[
                {
                  name: 'free',
                  price: '$0',
                  features: [
                    'Basic attendance tracking',
                    'Student management',
                    'Course management',
                    'Basic fee tracking',
                    'Simple announcements',
                  ],
                },
                {
                  name: 'starter',
                  price: '$29',
                  features: [
                    'Everything in Free',
                    'Bulk attendance import',
                    'Grade management',
                    'Course CRUD operations',
                    'Basic analytics',
                  ],
                },
                {
                  name: 'growth',
                  price: '$79',
                  features: [
                    'Everything in Starter',
                    'Online payments',
                    'Email reminders',
                    'Advanced announcements',
                    'Parent portal',
                    'Full analytics',
                  ],
                },
                {
                  name: 'scale',
                  price: '$199',
                  features: [
                    'Everything in Growth',
                    'SSO authentication',
                    'SMS/WhatsApp reminders',
                    'Audit logs',
                    'API access',
                  ],
                },
                {
                  name: 'enterprise',
                  price: 'Custom',
                  features: [
                    'Everything in Scale',
                    'Custom branding',
                    'Admissions management',
                    'Advanced curriculum tools',
                    'Integrations',
                  ],
                },
              ].map((planOption) => (
                <Card
                  key={planOption.name}
                  className={`${
                    plan === planOption.name
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'border-gray-200 hover:shadow-md transition-shadow'
                  } h-full`}
                >
                  <Box className="p-6 h-full flex flex-col">
                    <Box className="text-center mb-6">
                      <Heading size="4" className="capitalize mb-3">
                        {planOption.name}
                      </Heading>
                      <Text size="7" weight="bold" className="mb-4">
                        {planOption.price}
                        {planOption.price !== '$0' &&
                          planOption.price !== 'Custom' && (
                            <Text size="3" color="gray" className="ml-1">
                              /mo
                            </Text>
                          )}
                      </Text>
                    </Box>

                    <Box className="flex-1 mb-6">
                      <ul className="space-y-3">
                        {planOption.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <Box className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                              <div className="w-2 h-2 bg-green-600 rounded-full" />
                            </Box>
                            <Text size="2" className="text-gray-700">
                              {feature}
                            </Text>
                          </li>
                        ))}
                      </ul>
                    </Box>

                    <Box className="mt-auto">
                      {plan === planOption.name ? (
                        <Badge
                          color="blue"
                          variant="soft"
                          className="w-full justify-center py-2"
                        >
                          Current Plan
                        </Badge>
                      ) : (
                        <Button
                          size="3"
                          className="w-full"
                          variant={
                            planOption.name === 'enterprise'
                              ? 'outline'
                              : 'solid'
                          }
                        >
                          {planOption.name === 'enterprise'
                            ? 'Contact Sales'
                            : 'Upgrade'}
                        </Button>
                      )}
                    </Box>
                  </Box>
                </Card>
              ))}
            </Grid>
          </Box>
        </Tabs.Content>

        {/* Add-ons Tab */}
        <Tabs.Content value="addons" className="space-y-8">
          <Box>
            <Heading size="6" className="mb-8 text-center">
              Available Add-ons
            </Heading>

            {/* Popular Add-ons Grid */}
            <Box className="mb-12">
              <Heading size="4" className="mb-6">
                Popular Add-ons
              </Heading>
              <Grid columns={{ initial: '1', md: '2', lg: '3' }} gap="6">
                {popularAddons.map((addon) => (
                  <Card
                    key={addon.feature}
                    className="p-6 hover:shadow-md transition-shadow"
                  >
                    <Flex justify="between" align="start" className="mb-4">
                      <Heading size="3" className="text-gray-900">
                        {addon.label}
                      </Heading>
                      <Text size="5" weight="bold" className="text-gray-900">
                        {addon.price}
                      </Text>
                    </Flex>
                    <Text size="2" color="gray" className="mb-4">
                      {addon.description}
                    </Text>
                    <Flex gap="2" align="center" className="mb-4">
                      <Badge color="blue" variant="soft" className="capitalize">
                        {addon.category}
                      </Badge>
                      <Text size="1" color="gray">
                        Requires: {addon.plan || 'Any Plan'}
                      </Text>
                    </Flex>
                    <Button size="3" className="w-full">
                      Enable {addon.label}
                    </Button>
                  </Card>
                ))}
              </Grid>
            </Box>

            {/* Add-ons by Category */}
            <Box>
              <Heading size="4" className="mb-6">
                All Add-ons by Category
              </Heading>
              {[
                'payments',
                'communication',
                'analytics',
                'security',
                'customization',
                'management',
              ].map((category) => {
                const categoryAddons = Object.values(popularAddons).filter(
                  (addon) => addon.category === category
                );
                if (categoryAddons.length === 0) return null;

                return (
                  <Box key={category} className="mb-8">
                    <Heading size="3" className="capitalize mb-4 text-gray-800">
                      {category}
                    </Heading>
                    <Grid columns={{ initial: '1', md: '2', lg: '3' }} gap="4">
                      {categoryAddons.map((addon) => (
                        <Card
                          key={addon.feature}
                          className="p-4 hover:shadow-sm transition-shadow"
                        >
                          <Flex
                            justify="between"
                            align="start"
                            className="mb-3"
                          >
                            <Heading
                              size="3"
                              className="font-medium text-gray-900"
                            >
                              {addon.label}
                            </Heading>
                            <Text
                              size="3"
                              weight="bold"
                              className="text-gray-900"
                            >
                              {addon.price}
                            </Text>
                          </Flex>
                          <Text size="1" color="gray" className="mb-3">
                            {addon.description}
                          </Text>
                          <Button size="2" variant="outline" className="w-full">
                            Learn More
                          </Button>
                        </Card>
                      ))}
                    </Grid>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Tabs.Content>
      </Tabs.Root>

      <Separator className="my-12" />

      {/* Contact Support */}
      <Card className="text-center p-8 bg-gray-50">
        <Heading size="4" className="mb-3">
          Need Help Choosing?
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
