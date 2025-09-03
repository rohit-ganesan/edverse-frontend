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
} from '@radix-ui/themes';

export function BillingPage(): JSX.Element {
  const [searchParams] = useSearchParams();
  const { plan, features } = useAccess();
  const { trackFeatureLockedViewed } = useAccessTelemetry();

  const addonFeature = searchParams.get('addon');
  const addonInfo = addonFeature ? getAddonByFeature(addonFeature) : null;
  const popularAddons = getPopularAddons();

  // Track when add-on specific page is viewed
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
      <Box className="text-center mb-8">
        <Heading size="8" className="mb-4">
          {addonInfo ? `Enable ${addonInfo.label}` : 'Billing & Plans'}
        </Heading>
        <Text size="4" color="gray">
          {addonInfo
            ? `Unlock ${addonInfo.description}`
            : 'Choose the right plan for your school and add the features you need'}
        </Text>
      </Box>

      {addonInfo && (
        <Card className="bg-blue-50 border border-blue-200 mb-8">
          <Flex justify="between" align="center" className="p-6">
            <Box>
              <Heading size="4" className="text-blue-900 mb-1">
                {addonInfo.label}
              </Heading>
              <Text size="3" color="blue" className="text-blue-700">
                {addonInfo.description}
              </Text>
            </Box>
            <Box className="text-right">
              <Text size="6" weight="bold" className="text-blue-900 mb-2">
                {addonInfo.price}
              </Text>
              <Button size="3" className="bg-blue-600 hover:bg-blue-700">
                Enable Now
              </Button>
            </Box>
          </Flex>
        </Card>
      )}

      {/* Plan Comparison */}
      <Box className="mb-8">
        <Heading size="6" className="mb-6">
          Choose Your Plan
        </Heading>
        <Grid columns={{ initial: '1', md: '3' }} gap="6">
          {['free', 'starter', 'growth', 'scale', 'enterprise'].map(
            (planName) => (
              <Card
                key={planName}
                className={`${
                  plan === planName
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <Box className="text-center p-6">
                  <Heading size="4" className="capitalize mb-2">
                    {planName}
                  </Heading>
                  <Text size="6" weight="bold" className="mb-4">
                    {planName === 'free'
                      ? 'Free'
                      : planName === 'starter'
                        ? '$29/mo'
                        : planName === 'growth'
                          ? '$79/mo'
                          : planName === 'scale'
                            ? '$199/mo'
                            : '$399/mo'}
                  </Text>
                  {plan === planName ? (
                    <Badge color="blue" variant="soft">
                      Current Plan
                    </Badge>
                  ) : (
                    <Button size="3" className="w-full">
                      {plan === 'free' ? 'Upgrade' : 'Change Plan'}
                    </Button>
                  )}
                </Box>
              </Card>
            )
          )}
        </Grid>
      </Box>

      {/* Popular Add-ons */}
      <Box className="mb-8">
        <Heading size="6" className="mb-6">
          Popular Add-ons
        </Heading>
        <Grid columns={{ initial: '1', md: '2', lg: '3' }} gap="6">
          {popularAddons.map((addon) => (
            <Card key={addon.feature} className="p-6">
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
              <Button size="3" className="w-full">
                Enable {addon.label}
              </Button>
            </Card>
          ))}
        </Grid>
      </Box>

      {/* Add-on Categories */}
      <Box>
        <Heading size="6" className="mb-6">
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
          const categoryAddons = Object.values(getPopularAddons()).filter(
            (addon) => addon.category === category
          );
          if (categoryAddons.length === 0) return null;

          return (
            <Box key={category} className="mb-8">
              <Heading size="4" className="capitalize mb-4">
                {category}
              </Heading>
              <Grid columns={{ initial: '1', md: '2', lg: '3' }} gap="4">
                {categoryAddons.map((addon) => (
                  <Card key={addon.feature} className="p-4">
                    <Flex justify="between" align="start" className="mb-3">
                      <Heading size="3" className="font-medium text-gray-900">
                        {addon.label}
                      </Heading>
                      <Text size="3" weight="bold" className="text-gray-900">
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

      <Separator className="my-12" />

      {/* Contact Support */}
      <Card className="text-center p-6 bg-gray-50">
        <Heading size="4" className="mb-2">
          Need Help?
        </Heading>
        <Text size="3" color="gray" className="mb-4">
          Our team is here to help you choose the right plan and add-ons for
          your school.
        </Text>
        <Button size="3">Contact Support</Button>
      </Card>
    </Container>
  );
}
