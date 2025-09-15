import React, { useEffect } from 'react';
import { useAccessCheck } from '../../hooks/useAccessCheck';
import { UpgradeHint } from '../upsell/UpgradeHint';
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
};

export function FeatureGate({
  feature,
  neededPlan,
  children,
  fallback = null,
  showUpgradeHint = true,
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
