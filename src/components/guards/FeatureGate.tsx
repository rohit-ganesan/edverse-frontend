import React from 'react';
import { useAccessCheck } from '../../hooks/useAccessCheck';
import { UpgradeHint } from '../upsell/UpgradeHint';
import type { Plan } from '../../types/access';

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
