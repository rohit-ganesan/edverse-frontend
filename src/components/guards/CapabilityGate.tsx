import React from 'react';
import { useAccessCheck } from '../../hooks/useAccessCheck';
import { UpgradeHint } from '../upsell/UpgradeHint';

type Props = {
  cap: string;
  children: React.ReactNode;
  /** Rendered when user lacks capability */
  fallback?: React.ReactNode;
  /** Show upgrade hint instead of fallback when capability is missing */
  showUpgradeHint?: boolean;
};

export function CapabilityGate({
  cap,
  children,
  fallback = null,
  showUpgradeHint = true,
}: Props) {
  const accessCheck = useAccessCheck({ cap });

  if (accessCheck.allowed) {
    return <>{children}</>;
  }

  // Show upgrade hint if enabled and capability is missing
  if (showUpgradeHint && accessCheck.reason?.missingCapability) {
    return (
      <UpgradeHint
        message={`You don't have permission to perform this action. Required capability: ${cap}`}
        context="capability_gate"
      />
    );
  }

  return <>{fallback}</>;
}
