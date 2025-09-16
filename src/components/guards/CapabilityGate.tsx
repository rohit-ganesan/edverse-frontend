import React from 'react';
import { useAccessCheck } from '../../hooks/useAccessCheck';
// UpgradeHint kept for future full-screen upsell, not used in this component
import { InlineUpgradeHint } from '../upsell/InlineUpgradeHint';
import type { Plan } from '../../types/access';
import { usePlan } from '../../context/AccessContext';
import { useAccessTelemetry } from '../../hooks/useAccessTelemetry';
import { Box } from '@radix-ui/themes';

type Props = {
  cap?: string;
  feature?: string;
  neededPlan?: Plan;
  children: React.ReactNode;
  /** Rendered when user lacks capability */
  fallback?: React.ReactNode;
  /** Show upgrade hint instead of fallback when capability is missing */
  showUpgradeHint?: boolean;
  /** When true, render children but with a lock overlay and disabled interactions */
  softLock?: boolean;
  /** Optional context tag for telemetry */
  context?: string;
};

export function CapabilityGate({
  cap,
  feature,
  neededPlan,
  children,
  fallback = null,
  showUpgradeHint = true,
  softLock = false,
  context = 'capability_gate',
}: Props) {
  const accessCheck = useAccessCheck({ cap, feature, neededPlan });
  const plan = usePlan();
  const { trackActionLocked } = useAccessTelemetry();

  if (!accessCheck.allowed) {
    trackActionLocked({
      action: 'capability_block',
      cap: cap || 'unknown',
      plan,
      context,
    });
  }

  if (accessCheck.allowed) {
    return <>{children}</>;
  }

  // Show upgrade hint if enabled and capability is missing
  if (
    showUpgradeHint &&
    (accessCheck.reason?.neededPlan || accessCheck.reason?.missingFeature)
  ) {
    const needed = (accessCheck.reason?.neededPlan as Plan) || 'starter';
    if (softLock) {
      return (
        <Box className="relative">
          <Box className="pointer-events-none opacity-40 select-none">
            {children}
          </Box>
          <Box className="absolute inset-0 flex items-center justify-center">
            <InlineUpgradeHint neededPlan={needed} context={`cap:${cap}`} />
          </Box>
        </Box>
      );
    }
    return <InlineUpgradeHint neededPlan={needed} context={`cap:${cap}`} />;
  }

  return <>{fallback}</>;
}
