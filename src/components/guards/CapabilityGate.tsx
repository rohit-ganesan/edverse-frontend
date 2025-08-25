import React from 'react';
import { useCan } from '../../context/AccessContext';

type Props = {
  cap: string;
  children: React.ReactNode;
  /** Rendered when user lacks capability */
  fallback?: React.ReactNode;
};

export function CapabilityGate({ cap, children, fallback = null }: Props) {
  const allowed = useCan(cap);
  return <>{allowed ? children : fallback}</>;
}
