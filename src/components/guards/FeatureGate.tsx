import React, { useEffect } from 'react';
import { useAccessCheck } from '../../hooks/useAccessCheck';
import { UpgradeHint } from '../upsell/UpgradeHint';
import InlineUpgradeHint from '../upsell/InlineUpgradeHint';
import { Box } from '@radix-ui/themes';
import type { Plan } from '../../types/access';
import { usePlan } from '../../context/AccessContext';
import { useAccessTelemetry } from '../../hooks/useAccessTelemetry';

type Props = {
  feature: string;
  neededPlan?: Plan;
  children: React.ReactNode;
  /** Rendered when feature is not enabled */
  fallback?: React.ReactNode;
  /** Show upgrade hint instead of fallback when feature is locked */
  showUpgradeHint?: boolean;
  /** When true, render children with a soft lock overlay + inline hint */
  softLock?: boolean;
};

export function FeatureGate({
  feature,
  neededPlan,
  children,
  fallback = null,
  showUpgradeHint = true,
  softLock = false,
}: Props) {
  const accessCheck = useAccessCheck({ feature, neededPlan });
  const plan = usePlan();
  const { trackFeatureLockedViewed } = useAccessTelemetry();

  useEffect(() => {
    if (!accessCheck.allowed) {
      trackFeatureLockedViewed({
        feature,
        plan,
        neededPlan: accessCheck.reason?.neededPlan,
        context: 'feature_gate',
      });
    }
  }, [
    accessCheck.allowed,
    accessCheck.reason?.neededPlan,
    feature,
    plan,
    trackFeatureLockedViewed,
  ]);

  if (accessCheck.allowed) {
    return <>{children}</>;
  }

  // Show upgrade hint if enabled and it's a plan or add-on restriction
  if (
    showUpgradeHint &&
    (accessCheck.reason?.neededPlan || accessCheck.reason?.missingFeature)
  ) {
    if (softLock) {
      const needed = (accessCheck.reason?.neededPlan as Plan) || 'starter';
      return (
        <Box className="relative">
          <Box className="pointer-events-none opacity-40 select-none">
            {children}
          </Box>
          <Box className="absolute inset-0 flex items-center justify-center">
            <InlineUpgradeHint
              neededPlan={needed}
              context={`feature:${feature}`}
            />
          </Box>
        </Box>
      );
    }
    return (
      <UpgradeHint
        neededPlan={accessCheck.reason?.neededPlan}
        feature={accessCheck.reason?.missingFeature}
        context="feature_gate"
      />
    );
  }

  return <>{fallback}</>;
}
