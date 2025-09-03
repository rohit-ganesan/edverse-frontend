import { Lock } from 'lucide-react';
import { usePlan } from '../../context/AccessContext';
import { useUpgradeTelemetry } from '../../hooks/useUpgradeTelemetry';
import { useIsAddonFeature, useAddonInfo } from '../../hooks/useAccessCheck';
import { useEffect } from 'react';
import type { Plan } from '../../types/access';
import { Button } from '@radix-ui/themes';
import { Card, Flex, Text, Box } from '@radix-ui/themes';

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
  const { trackUpgradeShown, trackUpgradeClicked } = useUpgradeTelemetry();
  const isAddonFeature = useIsAddonFeature(feature || '');
  const addonInfo = useAddonInfo(feature || '');

  // Track when upgrade hint is shown
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

  // Determine the message and CTAs based on whether it's a plan upgrade or add-on
  let displayMessage = message;
  let primaryCtaText = 'Upgrade';
  let primaryCtaHref = ctaHref;
  let secondaryCtaText = '';
  let secondaryCtaHref = '';

  if (isAddonFeature && addonInfo) {
    // Add-on feature - show both options
    displayMessage = addonInfo.description;
    primaryCtaText = `Enable ${addonInfo.label} — ${addonInfo.price}`;
    primaryCtaHref = '/billing?addon=' + feature;
    secondaryCtaText = `Upgrade to ${getMinPlanForAddon(feature || '')} for full access`;
    secondaryCtaHref = '/billing';
  } else if (neededPlan) {
    // Plan upgrade
    displayMessage = message ?? `This feature requires the ${neededPlan} plan.`;
    primaryCtaText = `Upgrade to ${neededPlan}`;
    primaryCtaHref = '/billing';
  } else {
    // Fallback
    displayMessage = message ?? 'This feature requires an upgrade.';
    primaryCtaText = 'Upgrade';
    primaryCtaHref = '/billing';
  }

  return (
    <Card className="border border-neutral-200 bg-neutral-50">
      <Flex gap="3" align="start">
        <Box className="mt-0.5">
          <Lock className="h-5 w-5" aria-hidden />
        </Box>
        <Box className="flex-1">
          <Text size="4" weight="bold">
            {isAddonFeature
              ? 'Feature Available as Add-on'
              : `Locked on current plan (${plan.toUpperCase()})`}
          </Text>
          <Text size="2" color="gray" className="mt-1">
            {displayMessage}
          </Text>

          <Flex gap="2" className="mt-3">
            <Button size="2" onClick={handleUpgradeClick} asChild>
              <a href={primaryCtaHref}>{primaryCtaText}</a>
            </Button>

            {secondaryCtaText && (
              <Button
                size="2"
                variant="outline"
                onClick={handleUpgradeClick}
                asChild
              >
                <a href={secondaryCtaHref}>{secondaryCtaText}</a>
              </Button>
            )}
          </Flex>
        </Box>
      </Flex>
    </Card>
  );
}

/**
 * Helper function to determine the minimum plan that includes a feature
 */
function getMinPlanForAddon(feature: string): Plan {
  const planFeatures = {
    'fees.online': 'growth',
    'fees.reminders.smswa': 'scale',
    'analytics.advanced': 'growth',
    'auth.sso': 'scale',
    'audit.logs': 'scale',
    'settings.branding': 'enterprise',
    'admissions.view': 'enterprise',
    'syllabus-advanced': 'enterprise',
  };

  return (planFeatures as Record<string, Plan>)[feature] || 'growth';
}
