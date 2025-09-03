# RouteGuard Pattern - Safe Access Control with Lazy Loading

This document explains the new RouteGuard pattern that provides safe access control and lazy loading without violating React's hook rules.

## Overview

The RouteGuard pattern solves the problem of conditional hook calls while providing:
- **Route-level access control** with feature/capability checks
- **Lazy loading** of modules based on access
- **Upgrade prompts** for locked features
- **Telemetry tracking** for upgrade events

## Key Components

### 1. `useAccessCheck` Hook

A pure hook that safely checks access without conditional hook calls:

```tsx
import { useAccessCheck } from '@/hooks/useAccessCheck';

const { allowed, reason } = useAccessCheck({ 
  feature: 'fees.online',
  cap: 'fees.online',
  neededPlan: 'growth'
});
```

### 2. Module Registry

Stable lazy loading registry that prevents conditional imports:

```tsx
// src/modules/registry.ts
export const MODULES: Record<string, Loader> = {
  'students:core': () => import('./core').then(m => ({ default: m.StudentsPage })),
  'analytics:growth': () => import('./growth/AnalyticsPage'),
  'admissions:enterprise': () => import('./enterprise/Admission/AdmissionsPage'),
};

export function lazyFromRegistry(key: keyof typeof MODULES) {
  return React.lazy(MODULES[key]);
}
```

### 3. RouteGuard Component

The main component that handles access checks and lazy loading:

```tsx
<RouteGuard
  moduleKey="analytics:growth"
  feature="analytics.view"
  cap="analytics.view"
  neededPlan="growth"
/>
```

## Usage Examples

### Basic Route Protection

```tsx
// src/router/AppRoutes.tsx
<Route
  path="/analytics"
  element={
    <RouteGuard
      moduleKey="analytics:growth"
      feature="analytics.view"
      cap="analytics.view"
      neededPlan="growth"
    />
  }
/>
```

### Advanced vs Basic Components

```tsx
<Route
  path="/fees/reconcile"
  element={
    <RouteGuard
      moduleKey="fees:core"
      altModuleKey="fees:reconcile"
      feature="fees.reconcile"
      cap="fees.reconcile"
      neededPlan="scale"
    />
  }
/>
```

### Component-Level Action Gates

For buttons and actions within loaded pages:

```tsx
import { FeatureGate, CapabilityGate } from '@/components/guards';
import { UpgradeHint } from '@/components/upsell/UpgradeHint';

<FeatureGate
  feature="fees.reminders.email"
  fallback={
    <UpgradeHint 
      neededPlan="growth" 
      message="Automated reminders are part of Growth plan."
      context="action_button"
    />
  }
>
  <CapabilityGate cap="fees.reminders.email">
    <SendEmailRemindersButton />
  </CapabilityGate>
</FeatureGate>
```

## Why This Pattern Works

### 1. No Conditional Hook Calls

All hooks are called at the top level, before any conditional returns:

```tsx
export default function RouteGuard({ ... }) {
  // ✅ All hooks called unconditionally at top level
  const { user, loading: authLoading } = useAuth();
  const { allowed, reason } = useAccessCheck({ feature, cap, neededPlan });
  const Component = useMemo(() => lazyFromRegistry(moduleKey), [moduleKey]);

  // ✅ Conditional logic only affects JSX, not hook calls
  if (authLoading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" />;
  if (!allowed) return <UpgradeHint />;
  
  return <Suspense><Component /></Suspense>;
}
```

### 2. Stable Lazy Loading

The module registry ensures stable lazy components:

```tsx
// ✅ React.lazy is called once at module import time
const Component = useMemo(() => lazyFromRegistry(moduleKey), [moduleKey]);

// ❌ NOT conditional lazy calls in render
// const Component = allowed ? lazy(() => import('./advanced')) : lazy(() => import('./basic'));
```

### 3. Pure Access Checks

The `useAccessCheck` hook is pure and memoized:

```tsx
export function useAccessCheck({ feature, cap, neededPlan }) {
  // ✅ All hooks called unconditionally
  const plan = usePlan();
  const hasFeature = feature ? useFeature(feature) : true;
  const hasCap = cap ? useCan(cap) : true;

  // ✅ Pure computation with useMemo
  return useMemo(() => {
    if (hasFeature && hasCap) return { allowed: true, reason: null };
    return { allowed: false, reason: { ... } };
  }, [hasFeature, hasCap, feature, cap, neededPlan, plan]);
}
```

## Telemetry Integration

The pattern includes built-in telemetry for upgrade events:

```tsx
// Automatically tracked in UpgradeHint component
<UpgradeHint 
  neededPlan="growth"
  context="route_guard" // Tracks where upgrade was shown
/>
```

Events tracked:
- `upgrade_shown` - When upgrade hint is displayed
- `upgrade_clicked` - When user clicks upgrade button
- `feature_locked_viewed` - When locked feature is accessed

## Migration Guide

### From Old Pattern

**Before (problematic):**
```tsx
function GuardedRoute({ element, feature, cap }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  
  // ❌ Conditional hook calls
  const hasFeature = feature ? useFeature(feature) : true;
  const hasCap = cap ? useCan(cap) : true;
  
  if (!hasFeature || !hasCap) return <UpgradeHint />;
  return element;
}
```

**After (safe):**
```tsx
<RouteGuard
  moduleKey="students:core"
  feature="students.view"
  cap="students.view"
/>
```

### Benefits

1. **No hook rule violations** - All hooks called unconditionally
2. **Better performance** - Lazy loading with stable components
3. **Cleaner code** - Declarative route definitions
4. **Built-in telemetry** - Automatic upgrade event tracking
5. **Type safety** - Full TypeScript support with registry keys

## Testing

The pattern is designed to be easily testable:

```tsx
// Mock the registry for testing
jest.mock('@/modules/registry', () => ({
  lazyFromRegistry: jest.fn(() => MockComponent),
}));

// Test different access scenarios
it('shows upgrade hint when feature not available', () => {
  mockUseAccess.mockReturnValue({
    plan: 'free',
    features: ['students.view'], // Missing 'analytics.view'
  });
  
  render(<RouteGuard moduleKey="analytics:growth" feature="analytics.view" />);
  expect(screen.getByTestId('upgrade-hint')).toBeInTheDocument();
});
```

## Best Practices

1. **Always use registry keys** - Don't inline lazy imports
2. **Call hooks at top level** - Never after conditional returns
3. **Use memoization** - For expensive computations and stable references
4. **Provide fallbacks** - Always have a fallback for locked features
5. **Track telemetry** - Use context parameter for better analytics
6. **Test access scenarios** - Verify both allowed and denied states

