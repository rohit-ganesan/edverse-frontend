import React from 'react';
import { useFeature } from '../../context/AccessContext';

type Props = {
  feature: string;
  children: React.ReactNode;
  /** Rendered when feature is not enabled */
  fallback?: React.ReactNode;
};

export function FeatureGate({ feature, children, fallback = null }: Props) {
  const enabled = useFeature(feature);
  return <>{enabled ? children : fallback}</>;
}
