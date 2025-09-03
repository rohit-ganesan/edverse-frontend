import React, { useEffect } from 'react';
import { useAccessCheck } from '../../hooks/useAccessCheck';
import { UpgradeHint } from '../upsell/UpgradeHint';
import { useAccessTelemetry } from '../../hooks/useAccessTelemetry';
import type { Plan } from '../../types/access';

interface RouteGuardProps {
  children: React.ReactNode;
  /** Feature required to access this route */
  feature?: string;
  /** Capability required to access this route */
  cap?: string;
  /** Minimum plan required for this route */
  neededPlan?: Plan;
  /** Route path for telemetry */
  routePath?: string;
  /** Show upgrade hint when access is denied */
  showUpgradeHint?: boolean;
  /** Fallback content when access is denied */
  fallback?: React.ReactNode;
}

/**
 * Comprehensive route guard that enforces neededPlan, features, and capabilities
 * Provides detailed telemetry and upgrade hints for locked routes
 */
export function RouteGuard({
  children,
  feature,
  cap,
  neededPlan,
  routePath = 'unknown',
  showUpgradeHint = true,
  fallback = null,
}: RouteGuardProps): JSX.Element {
  const accessCheck = useAccessCheck({ feature, cap, neededPlan });
  const { trackRouteLocked } = useAccessTelemetry();

  // Track route locks for telemetry
  useEffect(() => {
    if (!accessCheck.allowed) {
      let reason: 'plan' | 'feature' | 'capability' = 'feature';

      if (accessCheck.reason?.neededPlan) {
        reason = 'plan';
      } else if (accessCheck.reason?.missingCapability) {
        reason = 'capability';
      }

      trackRouteLocked({
        feature,
        cap,
        plan: accessCheck.reason?.currentPlan || 'free',
        neededPlan: accessCheck.reason?.neededPlan,
        reason,
      });
    }
  }, [accessCheck, feature, cap, neededPlan, trackRouteLocked]);

  // Access allowed
  if (accessCheck.allowed) {
    return <>{children}</>;
  }

  // Show upgrade hint if enabled
  if (showUpgradeHint) {
    return (
      <UpgradeHint
        neededPlan={accessCheck.reason?.neededPlan}
        feature={accessCheck.reason?.missingFeature}
        message={
          accessCheck.reason?.missingCapability
            ? `You don't have permission to access this page. Required capability: ${accessCheck.reason.missingCapability}`
            : undefined
        }
        context={`route_guard:${routePath}`}
      />
    );
  }

  // Show fallback or nothing
  return <>{fallback}</>;
}

/**
 * Hook for checking route access without rendering
 * Useful for conditional navigation or sidebar items
 */
export function useRouteAccess(options: {
  feature?: string;
  cap?: string;
  neededPlan?: Plan;
}) {
  const accessCheck = useAccessCheck(options);

  return {
    canAccess: accessCheck.allowed,
    reason: accessCheck.reason,
    isPlanBlocked: !!accessCheck.reason?.neededPlan,
    isFeatureBlocked: !!accessCheck.reason?.missingFeature,
    isCapabilityBlocked: !!accessCheck.reason?.missingCapability,
  };
}
