import { useCallback } from 'react';
import type { Plan } from '../types/access';

/**
 * Telemetry hook for tracking access-related events
 */
export function useAccessTelemetry() {
  /**
   * Track when a route is locked due to access restrictions
   */
  const trackRouteLocked = useCallback(
    (data: {
      feature?: string;
      cap?: string;
      plan: Plan;
      neededPlan?: Plan;
      reason: 'plan' | 'feature' | 'capability';
    }) => {
      // In production, this would send to your analytics service
      console.log('Route locked:', {
        event: 'route_locked',
        timestamp: new Date().toISOString(),
        ...data,
      });

      // Example: Send to analytics service
      // analytics.track('route_locked', data);
    },
    []
  );

  /**
   * Track when a feature is unlocked (MVP: plan upgrades only)
   */
  const trackFeatureUnlocked = useCallback(
    (data: {
      feature: string;
      reason: 'plan_upgrade' | 'trial' | 'promo' | 'support';
      plan: Plan;
      metadata?: Record<string, any>;
    }) => {
      console.log('Feature unlocked:', {
        event: 'feature_unlocked',
        timestamp: new Date().toISOString(),
        ...data,
      });

      // Example: Send to analytics service
      // analytics.track('feature_unlocked', data);
    },
    []
  );

  /**
   * Track when a feature is locked (MVP: plan downgrade)
   */
  const trackFeatureLocked = useCallback(
    (data: {
      feature: string;
      reason: 'plan_downgrade' | 'trial_expired' | 'support';
      plan: Plan;
      metadata?: Record<string, any>;
    }) => {
      console.log('Feature locked:', {
        event: 'feature_locked',
        timestamp: new Date().toISOString(),
        ...data,
      });

      // Example: Send to analytics service
      // analytics.track('feature_locked', data);
    },
    []
  );

  /**
   * Track when a trial expires (MVP: plan-based trials)
   */
  const trackTrialExpired = useCallback(
    (data: { feature: string; plan: Plan; metadata?: Record<string, any> }) => {
      console.log('Trial expired:', {
        event: 'trial_expired',
        timestamp: new Date().toISOString(),
        ...data,
      });

      // Example: Send to analytics service
      // analytics.track('trial_expired', data);
    },
    []
  );

  /**
   * Track when a user attempts to access a locked feature
   */
  const trackFeatureLockedViewed = useCallback(
    (data: {
      feature: string;
      plan: Plan;
      neededPlan?: Plan;
      context: string;
    }) => {
      console.log('Feature locked viewed:', {
        event: 'feature_locked_viewed',
        timestamp: new Date().toISOString(),
        ...data,
      });

      // Example: Send to analytics service
      // analytics.track('feature_locked_viewed', data);
    },
    []
  );

  /**
   * Track when a user attempts to perform a locked action
   */
  const trackActionLocked = useCallback(
    (data: { action: string; cap: string; plan: Plan; context: string }) => {
      console.log('Action locked:', {
        event: 'action_locked',
        timestamp: new Date().toISOString(),
        ...data,
      });

      // Example: Send to analytics service
      // analytics.track('action_locked', data);
    },
    []
  );

  return {
    trackRouteLocked,
    trackFeatureUnlocked,
    trackFeatureLocked,
    trackTrialExpired,
    trackFeatureLockedViewed,
    trackActionLocked,
  };
}
