'use client';
import React, { Suspense, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccessCheck } from '../../hooks/useAccessCheck';
import { UpgradeHint } from '../upsell/UpgradeHint';
import { lazyFromRegistry } from '../../modules/registry';
import { useAuth } from '../../features/auth/AuthContext';

type Props = {
  /** key inside MODULES registry */
  moduleKey: keyof typeof import('../../modules/registry').MODULES;
  /** optional alternative (e.g., advanced version) if feature present */
  altModuleKey?: keyof typeof import('../../modules/registry').MODULES;
  /** access requirements */
  feature?: string;
  cap?: string;
  neededPlan?: 'starter' | 'growth' | 'scale' | 'enterprise';
  /** optional locked UI */
  locked?: React.ReactNode;
  /** optional skeleton */
  fallback?: React.ReactNode;
};

export default function RouteGuard({
  moduleKey,
  altModuleKey,
  feature,
  cap,
  neededPlan,
  locked,
  fallback = <div className="p-4 text-sm text-neutral-500">Loading…</div>,
}: Props): JSX.Element {
  // All hooks must be called at the top level, before any conditional returns
  const { user, loading: authLoading } = useAuth();
  const { allowed, reason } = useAccessCheck({ feature, cap, neededPlan });
  const navigate = useNavigate();

  // 2) Compute which module to render (basic vs advanced)
  // Important: we still produce a stable lazy component — no conditional hook calls.
  const Component = useMemo(() => {
    // If an alt module is specified and feature is required, you can choose which to load
    // based on feature presence only for the *module selection*.
    // Access is still enforced by `allowed`.
    if (altModuleKey && feature) {
      // We can't call useFeature here again; rely on `allowed` or add a separate boolean prop.
      // Safer: choose alt only if access allowed (user has feature/cap).
      return lazyFromRegistry(allowed ? altModuleKey : moduleKey);
    }
    return lazyFromRegistry(moduleKey);
  }, [moduleKey, altModuleKey, allowed, feature]) as React.ComponentType<any>;

  // Handle navigation to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <div className="p-4 text-sm text-neutral-500">
        Checking authentication...
      </div>
    );
  }

  // Show loading while redirecting to login
  if (!user) {
    return (
      <div className="p-4 text-sm text-neutral-500">
        Redirecting to login...
      </div>
    );
  }

  if (!allowed) {
    // Prefer a rich locked panel if provided; otherwise, show UpgradeHint
    return (locked ?? (
      <div className="p-4">
        <UpgradeHint
          neededPlan={reason?.neededPlan ?? 'growth'}
          message={
            reason?.missingCapability
              ? 'You do not have permission to access this area.'
              : 'This feature is locked on your current plan.'
          }
        />
      </div>
    )) as JSX.Element;
  }

  return (
    <Suspense fallback={fallback}>
      <Component />
    </Suspense>
  );
}
