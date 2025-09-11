import {
  Lock,
  ArrowLeft,
  Sparkles,
  CreditCard,
  ExternalLink,
} from 'lucide-react';
import { usePlan } from '../../context/AccessContext';
import { useUpgradeTelemetry } from '../../hooks/useUpgradeTelemetry';
import { useIsAddonFeature } from '../../hooks/useAccessCheck';
import { getAddonByFeature } from '../../config/addons';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Plan } from '../../types/access';
import { Button } from '@radix-ui/themes';
import {
  Card,
  Flex,
  Text,
  Box,
  Heading,
  Badge,
  Separator,
} from '@radix-ui/themes';

type Needed = Plan;

export function UpgradeHint({
  neededPlan,
  feature,
  message,
  ctaHref = '/billing',
  context = 'route_guard',
}: {
  neededPlan?: Needed;
  feature?: string;
  message?: string;
  ctaHref?: string;
  context?: string;
}): JSX.Element {
  const plan = usePlan();
  const navigate = useNavigate();
  const { trackUpgradeShown, trackUpgradeClicked } = useUpgradeTelemetry();
  const isAddonFeature = useIsAddonFeature(feature || '');
  const addonInfo = feature ? getAddonByFeature(feature) : null;

  useEffect(() => {
    if (neededPlan) {
      trackUpgradeShown(neededPlan, context);
    } else if (feature) {
      trackUpgradeShown('addon', context);
    }
  }, [neededPlan, feature, context, trackUpgradeShown]);

  const handleUpgradeClick = () => {
    if (neededPlan) {
      trackUpgradeClicked(plan, neededPlan, context);
    } else if (feature) {
      trackUpgradeClicked(plan, 'addon', context);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleBillingClick = () => {
    handleUpgradeClick();
    navigate('/billing');
  };

  const handleAddonClick = () => {
    handleUpgradeClick();
    navigate(`/billing?addon=${feature}`);
  };

  let displayMessage = message;
  let primaryCtaText = 'Upgrade';
  let secondaryCtaText = '';
  let showAddonOption = false;
  let showPlanUpgrade = false;

  if (isAddonFeature && addonInfo) {
    displayMessage = addonInfo.description;
    primaryCtaText = `Enable ${addonInfo.label}`;
    secondaryCtaText = `Upgrade to ${getMinPlanForAddon(feature || '')} for full access`;
    showAddonOption = true;
    showPlanUpgrade = true;
  } else if (neededPlan) {
    displayMessage = message ?? `This feature requires the ${neededPlan} plan.`;
    primaryCtaText = `Upgrade to ${neededPlan}`;
    secondaryCtaText = `Get access to advanced features and capabilities`;
    showPlanUpgrade = true;
  } else {
    displayMessage = message ?? 'This feature requires an upgrade.';
    primaryCtaText = 'Upgrade';
    secondaryCtaText = 'Unlock premium features and capabilities';
    showPlanUpgrade = true;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
        <Box className="p-8">
          {/* Header */}
          <Flex direction="column" align="center" className="text-center mb-6">
            <Box className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-white" />
            </Box>

            <Heading size="6" className="mb-2">
              {isAddonFeature
                ? 'Feature Available as Add-on'
                : 'Feature Locked'}
            </Heading>

            <Flex gap="2" align="center" className="mb-3">
              <Badge color="gray" variant="soft">
                Current Plan: {plan.toUpperCase()}
              </Badge>
              {neededPlan && (
                <Badge color="blue" variant="soft">
                  Requires: {neededPlan.toUpperCase()}
                </Badge>
              )}
            </Flex>

            <Text size="3" color="gray" className="max-w-md">
              {displayMessage}
            </Text>
          </Flex>

          <Separator className="my-6" />

          {/* Feature Details */}
          {isAddonFeature && addonInfo && (
            <Box className="mb-6">
              <Flex direction="column" gap="3">
                <Flex justify="between" align="center">
                  <Text size="4" weight="bold">
                    {addonInfo.label}
                  </Text>
                  <Text size="5" weight="bold" color="blue">
                    {addonInfo.price}
                  </Text>
                </Flex>
                <Text size="2" color="gray">
                  {addonInfo.description}
                </Text>
                <Badge color="blue" variant="soft" className="capitalize w-fit">
                  {addonInfo.category}
                </Badge>
              </Flex>
            </Box>
          )}

          {/* Action Buttons */}
          <Flex direction="column" gap="3" className="mb-6">
            {showAddonOption ? (
              <>
                <Button
                  size="4"
                  onClick={handleAddonClick}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  {primaryCtaText}
                </Button>

                {showPlanUpgrade && (
                  <Button
                    size="3"
                    variant="outline"
                    onClick={handleBillingClick}
                    className="w-full"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    {secondaryCtaText}
                  </Button>
                )}
              </>
            ) : (
              <Button
                size="4"
                onClick={handleBillingClick}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                {primaryCtaText}
              </Button>
            )}
          </Flex>

          {/* Navigation */}
          <Flex justify="center" gap="3">
            <Button
              size="2"
              variant="ghost"
              onClick={handleGoBack}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>

            <Button
              size="2"
              variant="ghost"
              onClick={handleBillingClick}
              className="text-blue-600 hover:text-blue-800"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View All Plans
            </Button>
          </Flex>
        </Box>
      </Card>
    </div>
  );
}

function getMinPlanForAddon(feature: string): Plan {
  const planFeatures = {
    'fees.online': 'growth',
    'fees.reminders.smswa': 'scale',
    'analytics.advanced': 'growth',
    'auth.sso': 'scale',
    'audit.logs': 'scale',
    'settings.branding': 'enterprise',
    'admissions.view': 'enterprise',
    'syllabus.advanced': 'enterprise',
  };

  return (planFeatures as Record<string, Plan>)[feature] || 'growth';
}
