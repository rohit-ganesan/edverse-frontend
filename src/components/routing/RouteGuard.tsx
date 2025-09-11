import React, { useEffect, useMemo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAccessCheck } from '../../hooks/useAccessCheck';
import { UpgradeHint } from '../upsell/UpgradeHint';
import { useAccessTelemetry } from '../../hooks/useAccessTelemetry';
import { getComponent, type ModuleKey } from '../../modules/registry';
import { useAuth } from '../../features/auth/AuthContext';
import { useAccess } from '../../context/AccessContext';
import type { Plan } from '../../types/access';

interface RouteGuardProps {
  children?: React.ReactNode;
  /** Legacy: key inside MODULES registry */
  moduleKey?: ModuleKey;
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
  /** Legacy: optional locked UI */
  locked?: React.ReactNode;
}

/**
 * Comprehensive route guard that enforces neededPlan, features, and capabilities
 * Provides detailed telemetry and upgrade hints for locked routes
 * Maintains backward compatibility with the old moduleKey system
 */
export function RouteGuard({
  children,
  moduleKey,
  feature,
  cap,
  neededPlan,
  routePath = 'unknown',
  showUpgradeHint = true,
  fallback = null,
  locked,
}: RouteGuardProps): JSX.Element {
  const { user, ready } = useAuth();
  const { allowed, reason } = useAccessCheck({ feature, cap, neededPlan });
  const { isInitialized: accessInitialized } = useAccess();
  const { trackRouteLocked } = useAccessTelemetry();
  const location = useLocation();

  // Get the component from the registry if moduleKey is provided (legacy mode)
  const Component = useMemo(() => {
    if (moduleKey) {
      return getComponent(moduleKey);
    }
    return null;
  }, [moduleKey]);

  // Track route locks for telemetry
  useEffect(() => {
    if (!allowed && accessInitialized) {
      let reasonType: 'plan' | 'feature' | 'capability' = 'feature';

      if (reason?.neededPlan) {
        reasonType = 'plan';
      } else if (reason?.missingCapability) {
        reasonType = 'capability';
      }

      trackRouteLocked({
        feature,
        cap,
        plan: reason?.currentPlan || 'free',
        neededPlan: reason?.neededPlan,
        reason: reasonType,
      });
    }
  }, [
    allowed,
    accessInitialized,
    feature,
    cap,
    neededPlan,
    reason,
    trackRouteLocked,
  ]);

  // Show loading while auth or access is being initialized
  if (!ready || !accessInitialized) {
    console.log('🟡 RouteGuard: Loading', {
      ready,
      accessInitialized,
      hasUser: !!user,
    });
    return <div className="p-4 text-sm text-neutral-500">Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If using legacy moduleKey system, render the component directly
  if (moduleKey && Component) {
    // Even for legacy routes, we must check access control
    if (!allowed) {
      // Show upgrade hint if enabled
      if (showUpgradeHint) {
        // Prefer a rich locked panel if provided (legacy compatibility)
        if (locked) {
          return locked as JSX.Element;
        }

        return (
          <UpgradeHint
            neededPlan={reason?.neededPlan}
            feature={reason?.missingFeature}
            message={
              reason?.missingCapability
                ? `You don't have permission to access this page. Required capability: ${reason.missingCapability}`
                : undefined
            }
            context={`route_guard:${routePath}`}
          />
        );
      }

      // Show fallback or nothing
      return <>{fallback}</>;
    }

    // Access is allowed, render the component
    return <Component />;
  }

  // Access allowed for new system
  if (allowed) {
    return <>{children}</>;
  }

  // Show upgrade hint if enabled
  if (showUpgradeHint) {
    // Prefer a rich locked panel if provided (legacy compatibility)
    if (locked) {
      return locked as JSX.Element;
    }

    // Return the modal-like UpgradeHint that takes full viewport
    return (
      <UpgradeHint
        neededPlan={reason?.neededPlan}
        feature={reason?.missingFeature}
        message={
          reason?.missingCapability
            ? `You don't have permission to access this page. Required capability: ${reason.missingCapability}`
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
