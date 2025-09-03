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
   * Track when a feature grant is added
   */
  const trackGrantAdded = useCallback(
    (data: {
      feature: string;
      reason: 'paid_addon' | 'trial' | 'promo' | 'contract' | 'support';
      plan: Plan;
      metadata?: Record<string, any>;
    }) => {
      console.log('Feature grant added:', {
        event: 'addon_enabled',
        timestamp: new Date().toISOString(),
        ...data,
      });

      // Example: Send to analytics service
      // analytics.track('addon_enabled', data);
    },
    []
  );

  /**
   * Track when a feature grant is removed
   */
  const trackGrantRemoved = useCallback(
    (data: {
      feature: string;
      reason: 'paid_addon' | 'trial' | 'promo' | 'contract' | 'support';
      plan: Plan;
      metadata?: Record<string, any>;
    }) => {
      console.log('Feature grant removed:', {
        event: 'addon_disabled',
        timestamp: new Date().toISOString(),
        ...data,
      });

      // Example: Send to analytics service
      // analytics.track('addon_disabled', data);
    },
    []
  );

  /**
   * Track when a feature grant expires
   */
  const trackGrantExpired = useCallback(
    (data: {
      feature: string;
      reason: 'paid_addon' | 'trial' | 'promo' | 'contract' | 'support';
      plan: Plan;
      metadata?: Record<string, any>;
    }) => {
      console.log('Feature grant expired:', {
        event: 'addon_expired',
        timestamp: new Date().toISOString(),
        ...data,
      });

      // Example: Send to analytics service
      // analytics.track('addon_expired', data);
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
    trackGrantAdded,
    trackGrantRemoved,
    trackGrantExpired,
    trackFeatureLockedViewed,
    trackActionLocked,
  };
}
