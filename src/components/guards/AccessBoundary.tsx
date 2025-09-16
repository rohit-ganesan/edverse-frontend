import React from 'react';
import type { Plan } from '../../types/access';
import { useAccessCheck } from '../../hooks/useAccessCheck';
import InlineUpgradeHint from '../upsell/InlineUpgradeHint';
import { Box } from '@radix-ui/themes';

type Props = {
  feature?: string;
  cap?: string;
  neededPlan?: Plan;
  children: React.ReactNode;
  title?: string;
  softLock?: boolean;
  fallback?: React.ReactNode;
  context?: string;
};

export function AccessBoundary({
  feature,
  cap,
  neededPlan,
  children,
  title,
  softLock = true,
  fallback,
  context = 'access_boundary',
}: Props): JSX.Element {
  const check = useAccessCheck({ feature, cap, neededPlan });

  if (check.allowed) return <>{children}</>;

  const needed = (check.reason?.neededPlan as Plan) || 'starter';

  if (softLock) {
    return (
      <Box className="relative rounded-lg border border-amber-200 bg-amber-50 p-3">
        {title && (
          <div className="mb-2 text-amber-800 text-sm font-medium">{title}</div>
        )}
        <Box className="pointer-events-none opacity-40 select-none">
          {children}
        </Box>
        <Box className="absolute inset-0 flex items-center justify-center">
          <InlineUpgradeHint neededPlan={needed} context={context} />
        </Box>
      </Box>
    );
  }

  if (fallback) return <>{fallback}</>;

  return (
    <Box className="rounded-lg border border-amber-200 bg-amber-50 p-4">
      <InlineUpgradeHint neededPlan={needed} context={context} />
    </Box>
  );
}

export default AccessBoundary;
