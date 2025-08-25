import { useCallback } from 'react';

export function useUpgradeTelemetry() {
  const trackEvent = useCallback(
    (eventName: string, properties?: Record<string, any>) => {
      // In a real app, you'd send this to your analytics service
      // For now, we'll just log to console
      console.log('Telemetry Event:', eventName, properties);

      // Example: Send to analytics service
      // analytics.track(eventName, {
      //   timestamp: new Date().toISOString(),
      //   ...properties,
      // });
    },
    []
  );

  const trackFeatureLockedViewed = useCallback(
    (feature: string, plan: string) => {
      trackEvent('feature_locked_viewed', { feature, plan });
    },
    [trackEvent]
  );

  const trackUpgradeClicked = useCallback(
    (fromPlan: string, toPlan: string, source: string) => {
      trackEvent('upgrade_clicked', { fromPlan, toPlan, source });
    },
    [trackEvent]
  );

  const trackUpgradeShown = useCallback(
    (neededPlan: string, context: string) => {
      trackEvent('upgrade_shown', { neededPlan, context });
    },
    [trackEvent]
  );

  return {
    trackFeatureLockedViewed,
    trackUpgradeClicked,
    trackUpgradeShown,
    trackEvent,
  };
}
