# 📊 Simplified RLS - Frontend Code Comparison

This document shows **exact code changes** side-by-side for the Simplified RLS with JWT implementation.

---

## Overview

- **Total files to modify:** 2 files
- **Total files to create:** 1 file
- **Total lines changed:** ~80 lines
- **Complexity:** Low-Medium

---

## 1. NEW FILE: `src/lib/jwtUtils.ts`

**Action:** Create this file from scratch

```typescript
// ============================================================
// NEW FILE: src/lib/jwtUtils.ts
// ============================================================

/**
 * JWT parsing utilities for extracting access control data
 * from Supabase auth tokens
 */

export interface JWTPayload {
  sub: string; // user_id
  email?: string;
  role: string; // Supabase role: 'authenticated'
  aud: string;
  iat?: number; // issued at
  exp?: number; // expiration
  app_metadata?: {
    tenant_id?: string;
    tenant_role?: string;
    tenant_plan?: string;
    tenant_name?: string;
    features?: string[];
    capabilities?: string[];
    trial_ends_at?: string;
  };
  user_metadata?: {
    [key: string]: any;
  };
}

/**
 * Parse and decode a JWT token
 * Note: This only decodes the payload. Supabase validates the signature.
 * 
 * @param token - The JWT token string
 * @returns Decoded JWT payload
 * @throws Error if token format is invalid
 */
export function parseJWT(token: string): JWTPayload {
  try {
    // Validate token format
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format: expected 3 parts');
    }

    // Decode the payload (middle part)
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // Decode base64 to string
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const payload = JSON.parse(jsonPayload) as JWTPayload;

    // Ensure app_metadata exists (even if empty)
    if (!payload.app_metadata) {
      payload.app_metadata = {};
    }

    return payload;
  } catch (error) {
    console.error('Failed to parse JWT:', error);
    throw new Error(`Invalid JWT token: ${(error as Error).message}`);
  }
}

/**
 * Check if a JWT token is expired
 * 
 * @param token - The JWT token string
 * @returns true if expired, false otherwise
 */
export function isJWTExpired(token: string): boolean {
  try {
    const jwt = parseJWT(token);
    if (!jwt.exp) return false; // No expiration = never expires
    
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    return jwt.exp < now;
  } catch {
    return true; // If we can't parse it, treat as expired
  }
}

/**
 * Get the expiration time of a JWT token
 * 
 * @param token - The JWT token string
 * @returns Date object or null if no expiration
 */
export function getJWTExpiration(token: string): Date | null {
  try {
    const jwt = parseJWT(token);
    if (!jwt.exp) return null;
    return new Date(jwt.exp * 1000); // Convert seconds to milliseconds
  } catch {
    return null;
  }
}

/**
 * Get time until JWT expires
 * 
 * @param token - The JWT token string
 * @returns Milliseconds until expiration, or null
 */
export function getJWTTimeUntilExpiration(token: string): number | null {
  const expiration = getJWTExpiration(token);
  if (!expiration) return null;
  
  const now = new Date();
  return expiration.getTime() - now.getTime();
}

/**
 * Debug helper: Log JWT contents to console
 * 
 * @param token - The JWT token string
 */
export function debugJWT(token: string): void {
  try {
    const jwt = parseJWT(token);
    console.group('🔍 JWT Debug Info');
    console.log('User ID:', jwt.sub);
    console.log('Email:', jwt.email);
    console.log('Expires:', getJWTExpiration(token)?.toISOString());
    console.log('Is Expired:', isJWTExpired(token));
    console.log('App Metadata:', jwt.app_metadata);
    console.groupEnd();
  } catch (error) {
    console.error('Failed to debug JWT:', error);
  }
}
```

---

## 2. MODIFY: `src/context/AccessContext.tsx`

**Action:** Replace the API call logic with JWT parsing

### Before (Current Code):

```typescript
// ============================================================
// CURRENT: src/context/AccessContext.tsx
// ============================================================

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import type { Plan, Role, Capability } from '../types/access';
import { getFeaturesForPlan } from '../config/planFeatures';
import { useAuth } from '../features/auth/AuthContext';
import { getAccessData } from '../lib/supabase-api'; // ← REMOVE THIS
import { ROLE_CAPS } from '../types/access';

// ... AccessState interface (stays the same)

const AccessContext = createContext<
  AccessState & {
    initializeAccess: () => Promise<void>;
    refreshAccess: () => Promise<void>;
  }
>({
  ...DEFAULT_ACCESS,
  initializeAccess: async () => {},
  refreshAccess: async () => {},
});

// ... helper functions (stay the same)

export function AccessProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AccessState>(DEFAULT_ACCESS);
  const { user, userProfile, ready } = useAuth();
  const callTokenRef = useRef(0);

  const effectiveRole =
    (userProfile?.role as Role | undefined) ||
    ((user as any)?.user_metadata?.role as Role | undefined) ||
    undefined;

  // ============================================================
  // THIS WHOLE FUNCTION CHANGES ↓
  // ============================================================
  const initializeAccess = useCallback(async () => {
    const myToken = ++callTokenRef.current;

    if (!user) {
      const next: AccessState = {
        plan: 'free',
        role: 'student',
        features: getFeaturesForPlan('free'),
        capabilities: [],
        isLoading: false,
        isInitialized: true,
        trial_ends_at: null,
        tenant_name: null,
      };
      setState((prev) => (shallowEqual(prev, next) ? prev : next));
      return;
    }

    setState((prev) => (prev.isLoading ? prev : { ...prev, isLoading: true }));

    // ← ALL THIS API CALL LOGIC GETS REMOVED
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const timeoutMs = 4000;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(
        () => reject(new Error('access-timeout')),
        timeoutMs
      );
    });

    try {
      const remote = await Promise.race([
        getAccessData(), // ← THIS API CALL REMOVED
        timeoutPromise,
      ]).catch(() => null as any);

      if (callTokenRef.current !== myToken) return;

      const plan: Plan =
        remote?.plan === 'starter' || remote?.plan === 'growth'
          ? remote.plan
          : 'free';

      const role: Role =
        (remote?.role as Role) ||
        (effectiveRole as Role) ||
        ((user as any)?.user_metadata?.role as Role) ||
        'student';

      const rawFeatures =
        Array.isArray(remote?.features) && remote.features.length
          ? remote.features
          : getFeaturesForPlan(plan);

      const normalizedFeatures = [...rawFeatures].sort();
      const capabilities = ROLE_CAPS[role] || ROLE_CAPS.student;

      setState((prev) => {
        const next: AccessState = {
          plan,
          role,
          features: stableArray(prev.features, normalizedFeatures),
          capabilities: stableArray(prev.capabilities, capabilities),
          isLoading: false,
          isInitialized: true,
          trial_ends_at: remote?.trial_ends_at || null,
          tenant_name: remote?.tenant_name || null,
        };
        return shallowEqual(prev, next) ? prev : next;
      });
    } catch (err) {
      // ... error handling
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  }, [user, effectiveRole]);

  // ... rest stays the same
}
```

### After (New Code):

```typescript
// ============================================================
// NEW: src/context/AccessContext.tsx
// ============================================================

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import type { Plan, Role, Capability } from '../types/access';
import { getFeaturesForPlan } from '../config/planFeatures';
import { useAuth } from '../features/auth/AuthContext';
import { parseJWT } from '../lib/jwtUtils'; // ← ADD THIS
import { ROLE_CAPS } from '../types/access';

// ... AccessState interface (stays the same)

const AccessContext = createContext<
  AccessState & {
    initializeAccess: () => void; // ← Note: no longer async!
    refreshAccess: () => void;    // ← Note: no longer async!
  }
>({
  ...DEFAULT_ACCESS,
  initializeAccess: () => {},      // ← No longer async
  refreshAccess: () => {},         // ← No longer async
});

// ... helper functions (stay the same)

export function AccessProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AccessState>(DEFAULT_ACCESS);
  const { user, userProfile, ready } = useAuth();

  const effectiveRole =
    (userProfile?.role as Role | undefined) ||
    ((user as any)?.user_metadata?.role as Role | undefined) ||
    undefined;

  // ============================================================
  // NEW SIMPLIFIED FUNCTION ↓
  // ============================================================
  const initializeAccess = useCallback(() => {
    // Guest users - fast path (unchanged)
    if (!user) {
      const next: AccessState = {
        plan: 'free',
        role: 'student',
        features: getFeaturesForPlan('free'),
        capabilities: [],
        isLoading: false,
        isInitialized: true,
        trial_ends_at: null,
        tenant_name: null,
      };
      setState((prev) => (shallowEqual(prev, next) ? prev : next));
      return;
    }

    // ============================================================
    // NEW: Parse JWT instead of API call
    // ============================================================
    try {
      // Get access token from user object
      const token = user.access_token || (user as any).token;
      
      if (!token) {
        console.warn('No access token found on user object');
        setState((prev) => ({
          ...prev,
          isLoading: false,
          isInitialized: true,
        }));
        return;
      }

      // Parse JWT to extract app_metadata
      const jwt = parseJWT(token);
      const metadata = jwt.app_metadata || {};

      // Map JWT metadata to access state
      const plan: Plan =
        metadata.tenant_plan === 'starter' || metadata.tenant_plan === 'growth'
          ? metadata.tenant_plan
          : 'free';

      // Prefer JWT role, fallback to profile role, then default
      const role: Role =
        (metadata.tenant_role as Role) ||
        (effectiveRole as Role) ||
        'student';

      // Use features from JWT, fallback to plan defaults
      const rawFeatures =
        Array.isArray(metadata.features) && metadata.features.length > 0
          ? metadata.features
          : getFeaturesForPlan(plan);

      const normalizedFeatures = [...rawFeatures].sort();

      // Get capabilities from JWT or derive from role
      const capabilities =
        Array.isArray(metadata.capabilities) && metadata.capabilities.length > 0
          ? metadata.capabilities
          : ROLE_CAPS[role] || ROLE_CAPS.student;

      // Update state
      setState((prev) => {
        const next: AccessState = {
          plan,
          role,
          features: stableArray(prev.features, normalizedFeatures),
          capabilities: stableArray(prev.capabilities, capabilities),
          isLoading: false,
          isInitialized: true,
          trial_ends_at: metadata.trial_ends_at || null,
          tenant_name: metadata.tenant_name || null,
        };
        return shallowEqual(prev, next) ? prev : next;
      });

      console.log('✅ Access data loaded from JWT:', {
        plan,
        role,
        featuresCount: normalizedFeatures.length,
        capabilitiesCount: capabilities.length,
      });

    } catch (error) {
      console.error('❌ Failed to parse JWT:', error);
      
      // Fallback: Use best-known role from profile
      const role: Role = (effectiveRole as Role) || 'student';
      const fallbackFeatures = getFeaturesForPlan('free');

      setState((prev) => {
        const next: AccessState = {
          plan: 'free',
          role,
          features: stableArray(prev.features, fallbackFeatures),
          capabilities: stableArray(
            prev.capabilities,
            ROLE_CAPS[role] || ROLE_CAPS.student
          ),
          isLoading: false,
          isInitialized: true,
          trial_ends_at: null,
          tenant_name: null,
        };
        return shallowEqual(prev, next) ? prev : next;
      });
    }
  }, [user, effectiveRole]);

  const refreshAccess = useCallback(() => {
    initializeAccess(); // Now synchronous
  }, [initializeAccess]);

  // ============================================================
  // OPTIONAL: Listen for token refresh
  // ============================================================
  useEffect(() => {
    if (!user) return;

    // Import supabase client
    import('../lib/supabase').then(({ supabase }) => {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (event === 'TOKEN_REFRESHED' && session?.user) {
            console.log('🔄 Token refreshed, re-parsing JWT...');
            initializeAccess();
          }
        }
      );

      return () => subscription.unsubscribe();
    });
  }, [user, initializeAccess]);

  // Rest of the code stays the same
  useEffect(() => {
    if (!ready) return;
    if (user?.id) {
      initializeAccess();
    } else {
      setState((s) =>
        s.isInitialized && !s.isLoading
          ? s
          : { ...s, isLoading: false, isInitialized: true }
      );
    }
  }, [ready, user?.id, initializeAccess]);

  const value = useMemo(
    () => ({ ...state, initializeAccess, refreshAccess }),
    [state, initializeAccess, refreshAccess]
  );

  return (
    <AccessContext.Provider value={value}>{children}</AccessContext.Provider>
  );
}

export const useAccess = () => useContext(AccessContext);
export const usePlan = () => useAccess().plan;
export const useRole = () => useAccess().role;
export const useFeatures = () => useAccess().features;
export const useCapabilities = () => useAccess().capabilities;
export const useFeature = (feature: string) => useFeatures().includes(feature);
export const useCan = (cap: Capability) => {
  const caps = useCapabilities();
  return caps.includes(cap);
};
```

---

## 3. OPTIONAL: `src/lib/supabase-api.ts`

**Action:** Mark getAccessData as deprecated (or remove it)

### Option A: Deprecate (Safer for Migration)

```typescript
// ============================================================
// MODIFY: src/lib/supabase-api.ts
// ============================================================

// Keep existing imports and code...

/**
 * @deprecated Use parseJWT from jwtUtils.ts instead
 * This function is kept for backward compatibility and debugging only.
 * 
 * Gets user access data from Edge Function.
 * In the new architecture, this data comes from JWT app_metadata.
 */
export async function getAccessData(): Promise<{
  plan: string;
  role: string;
  features: string[];
  capabilities: string[];
  trial_ends_at: string | null;
  tenant_name: string | null;
}> {
  console.warn('⚠️ getAccessData() is deprecated. Use parseJWT() instead.');
  return callEdgeFunctionGet('get-access-data', {});
}

// Rest of the file stays the same...
```

### Option B: Remove Completely (After Full Migration)

```typescript
// ============================================================
// MODIFY: src/lib/supabase-api.ts
// ============================================================

// Simply delete the getAccessData function entirely
// (Do this only after verifying everything works with JWT)
```

---

## Summary of Changes

### Files Changed

```
src/
├── lib/
│   ├── jwtUtils.ts                 [NEW] ~150 lines
│   └── supabase-api.ts             [MODIFY] ~5 lines (deprecate)
└── context/
    └── AccessContext.tsx           [MODIFY] ~80 lines changed
```

### Line Count

- **Added:** ~150 lines (new jwtUtils.ts)
- **Removed:** ~50 lines (API call logic)
- **Modified:** ~80 lines (AccessContext)
- **Net change:** ~+100 lines total

### Complexity Reduction

**Before:**
- Async API call
- Timeout handling
- Retry logic
- Network error handling
- Complex state management

**After:**
- Synchronous JWT parsing
- Simple error handling
- No network complexity
- Cleaner code flow

### Breaking Changes

**None!** All hooks and components using access control continue to work exactly the same:
- ✅ `useFeature('analytics.view')` - works
- ✅ `useCan('students.create')` - works
- ✅ `<FeatureGate>` - works
- ✅ `<CapabilityGate>` - works

---

## Testing the Changes

### 1. Test JWT Parser

```typescript
// In browser console or test file
import { parseJWT, debugJWT } from './lib/jwtUtils';

// Get current user's token
const user = await supabase.auth.getUser();
const token = user.data.user?.access_token;

// Parse it
const jwt = parseJWT(token);
console.log(jwt.app_metadata);

// Or use debug helper
debugJWT(token);
```

Expected output:
```javascript
{
  tenant_id: "uuid",
  tenant_role: "admin",
  tenant_plan: "growth",
  tenant_name: "My School",
  features: ["students.view", "students.create", ...],
  capabilities: ["students.view", "students.create", ...],
  trial_ends_at: "2026-01-20T00:00:00Z"
}
```

### 2. Test AccessContext

```typescript
// In your app, add temporary logging
import { useAccess } from './context/AccessContext';

function DebugAccess() {
  const access = useAccess();
  
  console.log('Current Access State:', {
    plan: access.plan,
    role: access.role,
    featuresCount: access.features.length,
    capabilitiesCount: access.capabilities.length,
    tenantName: access.tenant_name,
  });

  return null;
}

// Add to your app temporarily
<DebugAccess />
```

### 3. Verify Features Work

```typescript
// Test feature gating
function TestComponent() {
  const hasAnalytics = useFeature('analytics.view');
  const canCreateStudents = useCan('students.create');
  
  return (
    <div>
      <p>Has Analytics: {hasAnalytics ? '✅' : '❌'}</p>
      <p>Can Create Students: {canCreateStudents ? '✅' : '❌'}</p>
    </div>
  );
}
```

---

## Migration Checklist

### Pre-deployment
- [ ] Backend JWT sync is working
- [ ] Test user JWT has correct app_metadata
- [ ] jwtUtils.ts created and tested
- [ ] AccessContext.tsx updated
- [ ] Local testing completed
- [ ] Unit tests updated

### Deployment
- [ ] Deploy to staging first
- [ ] Verify staging works
- [ ] Monitor for errors
- [ ] Deploy to production
- [ ] Monitor production

### Post-deployment
- [ ] Verify all features work
- [ ] Check error logs
- [ ] Performance metrics
- [ ] Remove deprecated code (after 1-2 weeks)

---

## Rollback Procedure

If issues arise:

### Quick Rollback (< 5 minutes)

1. In `AccessContext.tsx`, comment out new code:
```typescript
// Comment out JWT parsing
// const jwt = parseJWT(token);

// Uncomment old API call
const remote = await getAccessData();
```

2. Git commit and push
3. Redeploy

### Full Rollback (< 30 minutes)

```bash
# Revert the commits
git revert <commit-hash>

# Or reset to previous version
git reset --hard <previous-commit>

# Force push (if needed)
git push origin main --force

# Redeploy
```

---

## Key Takeaways

### What's Different
- ❌ No more Edge Function call for access data
- ❌ No more async/await for access initialization
- ❌ No more timeout/retry logic
- ✅ JWT parsing happens immediately
- ✅ Synchronous state updates
- ✅ Simpler error handling

### What's The Same
- ✅ All hooks (useFeature, useCan, etc.)
- ✅ All components (FeatureGate, etc.)
- ✅ All UI behavior
- ✅ All route guards
- ✅ All access control logic

### Why This Is Better
- ⚡ Faster (no network call)
- 🐛 Easier to debug (inspect JWT)
- 📦 Simpler code (less complexity)
- 🎯 Single source of truth (JWT)
- 💰 Lower costs (no Edge Function calls)

---

**Next:** Review the `SIMPLIFIED_RLS_FRONTEND_WALKTHROUGH.md` for detailed implementation steps

**Status:** 📋 Ready for Implementation  
**Risk:** 🟢 Low (with proper testing)

