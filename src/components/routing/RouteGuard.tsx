import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccessCheck } from '../../hooks/useAccessCheck';
import { UpgradeHint } from '../upsell/UpgradeHint';
import { getComponent } from '../../modules/registry';
import { useAuth } from '../../features/auth/AuthContext';
import { useAccess } from '../../context/AccessContext';

type Props = {
  /** key inside MODULES registry */
  moduleKey: keyof typeof import('../../modules/registry').MODULES;
  /** access requirements */
  feature?: string;
  cap?: string;
  neededPlan?: 'starter' | 'growth' | 'scale' | 'enterprise';
  /** optional locked UI */
  locked?: React.ReactNode;
};

export default function RouteGuard({
  moduleKey,
  feature,
  cap,
  neededPlan,
  locked,
}: Props): JSX.Element {
  // All hooks must be called at the top level, before any conditional returns
  const { user, loading: authLoading } = useAuth();
  const { allowed, reason } = useAccessCheck({ feature, cap, neededPlan });
  const { isInitialized: accessInitialized } = useAccess();
  const navigate = useNavigate();

  // Get the component directly from the registry
  const Component = getComponent(moduleKey);

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

  // Show loading while access context is being initialized
  if (!accessInitialized) {
    return (
      <div className="p-4 text-sm text-neutral-500">Loading permissions...</div>
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
  return <Component />;
}
