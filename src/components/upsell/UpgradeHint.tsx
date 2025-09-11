import {
  Lock,
  ArrowLeft,
  Sparkles,
  CreditCard,
  ExternalLink,
} from 'lucide-react';
import { usePlan } from '../../context/AccessContext';
import { useUpgradeTelemetry } from '../../hooks/useUpgradeTelemetry';
// MVP: Simplified imports - add-ons disabled
// import { useIsAddonFeature } from '../../hooks/useAccessCheck';
// import { getAddonByFeature } from '../../config/addons';
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
  // MVP: No add-ons - simplified 3-tier structure only

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
  // MVP: Only plan upgrades, no add-ons

  if (neededPlan) {
    displayMessage = message ?? `This feature requires the ${neededPlan} plan.`;
    primaryCtaText = `Upgrade to ${neededPlan}`;
  } else {
    displayMessage = message ?? 'This feature requires an upgrade.';
    primaryCtaText = 'Upgrade';
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
              Feature Locked
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

          {/* MVP: No add-on details - simplified 3-tier structure */}

          {/* Action Buttons - MVP: Only plan upgrades */}
          <Flex direction="column" gap="3" className="mb-6">
            <Button
              size="4"
              onClick={handleBillingClick}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              {primaryCtaText}
            </Button>
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
