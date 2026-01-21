# 🚀 Simplified RLS with JWT - Frontend Changes Walkthrough

## Overview

This document walks you through **all frontend changes** needed to implement Option 2 (Simplified RLS with JWT). No implementation yet - just a detailed breakdown of what needs to change.

---

## 📋 Table of Contents

1. [Prerequisites (Backend)](#prerequisites-backend)
2. [Frontend Changes Overview](#frontend-changes-overview)
3. [Detailed Step-by-Step](#detailed-step-by-step)
4. [File-by-File Breakdown](#file-by-file-breakdown)
5. [Testing Strategy](#testing-strategy)
6. [Migration Path](#migration-path)
7. [Rollback Plan](#rollback-plan)

---

## Prerequisites (Backend)

Before making frontend changes, these backend changes **MUST** be in place:

### ✅ 1. JWT Sync System (Backend)

The database must have triggers that automatically update JWT claims in `auth.users.raw_app_meta_data` whenever:
- User's tenant membership changes
- User's role changes
- Tenant's plan changes
- Tenant features are updated

**What this means:** When a user logs in, their JWT will contain:
```json
{
  "app_metadata": {
    "tenant_id": "uuid",
    "tenant_role": "admin",
    "tenant_plan": "growth",
    "tenant_name": "Demo School",
    "features": ["students.view", "students.create", ...],
    "capabilities": ["students.view", "students.create", ...],
    "trial_ends_at": "2026-01-20T00:00:00Z"
  }
}
```

### ✅ 2. Simplified RLS Policies (Backend)

RLS policies must be updated to read from JWT instead of complex functions:
```sql
-- Example: Simple policy reading from JWT
CREATE POLICY "tenant_students_delete" ON students
  FOR DELETE USING (
    tenant_id = get_jwt_tenant_id()
    AND get_jwt_role() IN ('admin', 'owner')
    AND get_jwt_plan() IN ('starter', 'growth')
  );
```

**Important:** Backend changes are covered in a separate backend walkthrough document. This document assumes backend is ready.

---

## Frontend Changes Overview

### What Changes
1. ✅ **AccessContext** - Remove API call, read from JWT instead
2. ✅ **JWT Utility** - New file to parse JWT tokens
3. ✅ **Auth Flow** - Update to parse JWT immediately on login
4. ✅ **Token Refresh** - Handle JWT refresh to get updated claims
5. ⚠️ **Remove get-access-data call** - No longer needed
6. ✅ **Types** - Minor updates if needed
7. ✅ **Tests** - Update to mock JWT structure

### What Stays The Same
- ✅ UI components (`FeatureGate`, `CapabilityGate`, etc.)
- ✅ Hooks (`useFeature`, `useCan`, etc.)
- ✅ Route guards and protection logic
- ✅ Upgrade prompts and UX
- ✅ All component code using access control

**Key Insight:** Only the **source** of access data changes (from API → JWT). Everything else stays the same!

---

## Detailed Step-by-Step

### Step 1: Create JWT Parser Utility

**What:** New utility file to parse JWT tokens

**Why:** Need to decode JWT to extract `app_metadata`

**Where:** `src/lib/jwtUtils.ts` (NEW FILE)

**What it does:**
- Decodes JWT payload (base64url → JSON)
- Extracts `app_metadata` with access info
- Validates JWT structure
- Provides helper functions

**Key functions:**
```typescript
parseJWT(token: string) → JWTPayload
isJWTExpired(token: string) → boolean
getJWTExpiration(token: string) → Date | null
```

**No external dependencies needed** - just native JS functions

---

### Step 2: Update AccessContext

**What:** Modify `src/context/AccessContext.tsx`

**Current flow:**
```
User logs in
  → useEffect triggers
    → Call getAccessData() Edge Function
      → Wait for response
        → Set state with access data
```

**New flow:**
```
User logs in
  → useEffect triggers
    → Parse JWT from user.access_token
      → Extract app_metadata
        → Set state with access data
```

**Key changes:**

#### A. Remove Edge Function Call
```typescript
// REMOVE this:
import { getAccessData } from '../lib/supabase-api';

// REMOVE this call:
const remote = await getAccessData();
```

#### B. Add JWT Parsing
```typescript
// ADD this:
import { parseJWT } from '../lib/jwtUtils';

// ADD this logic:
const token = user.access_token || (user as any).token;
const jwt = parseJWT(token);
const metadata = jwt.app_metadata || {};
```

#### C. Map JWT Data to State
```typescript
setState({
  plan: metadata.tenant_plan || 'free',
  role: metadata.tenant_role || 'student',
  features: metadata.features || [],
  capabilities: metadata.capabilities || [],
  trial_ends_at: metadata.trial_ends_at || null,
  tenant_name: metadata.tenant_name || null,
  tenant_id: metadata.tenant_id || null,
  isLoading: false,
  isInitialized: true,
});
```

#### D. Remove Async/Loading Complexity
Since JWT parsing is synchronous (no network call), we can simplify:
- No timeout needed
- No retry logic needed
- No error states for network failures
- Still handle JWT parse errors (malformed token)

---

### Step 3: Update Auth Flow Integration

**What:** Ensure JWT is fresh when we parse it

**Current:** After login, `useAuth` provides `user` object

**Issue:** When does JWT actually have the new metadata?

**Solution:** Depends on your auth flow:

#### Option A: JWT claims updated on login (Server-side)
If Supabase auth triggers update JWT on login:
- No change needed
- Parse JWT immediately

#### Option B: JWT claims updated after login (Client triggers refresh)
If JWT needs manual refresh:
```typescript
// After successful login, force token refresh
const { data: { session } } = await supabase.auth.refreshSession();
// Now session.access_token has updated claims
```

**Check your backend:** Does the JWT sync trigger update `auth.users` immediately? Test this!

---

### Step 4: Handle Token Refresh

**What:** When JWT expires and refreshes, re-parse it

**Why:** Access data might have changed (role upgrade, plan change)

**Current:** Supabase auto-refreshes tokens via `autoRefreshToken: true`

**New:** Listen for token refresh and re-parse

```typescript
// In AccessContext or AuthContext
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
        // Re-parse JWT to get latest access data
        if (session?.access_token) {
          const jwt = parseJWT(session.access_token);
          updateAccessState(jwt.app_metadata);
        }
      }
    }
  );

  return () => subscription.unsubscribe();
}, []);
```

**This ensures:** When user's role/plan changes in backend, frontend updates after next token refresh

---

### Step 5: Remove or Deprecate get-access-data API Call

**What:** The `getAccessData()` function in `src/lib/supabase-api.ts`

**Options:**

#### Option A: Remove Completely
```typescript
// DELETE this function from supabase-api.ts
export async function getAccessData() { ... }
```

#### Option B: Keep as Fallback (Safer)
```typescript
// KEEP but mark as deprecated
/**
 * @deprecated Use JWT parsing instead (parseJWT)
 * Kept as fallback for debugging
 */
export async function getAccessData() { ... }
```

**Recommendation:** Keep as fallback during migration, remove after validation

---

### Step 6: Update Types (if needed)

**What:** Check if `src/types/access.ts` needs updates

**Current types:**
```typescript
export type Plan = 'free' | 'starter' | 'growth';
export type Role = 'owner' | 'admin' | 'teacher' | 'finance' | 'parent' | 'student';
```

**Likely no changes needed** unless you want to add:
```typescript
// Optional: Add JWT-specific types
export interface JWTAccessMetadata {
  tenant_id: string;
  tenant_role: Role;
  tenant_plan: Plan;
  tenant_name: string;
  features: string[];
  capabilities: string[];
  trial_ends_at: string | null;
}
```

---

### Step 7: Update Tests

**What:** Update test files that mock access data

**Current:** Tests might mock `getAccessData()` response

**New:** Tests should mock JWT structure

**Example change:**

```typescript
// OLD: Mock API response
jest.mock('../lib/supabase-api', () => ({
  getAccessData: jest.fn().mockResolvedValue({
    plan: 'growth',
    role: 'admin',
    features: ['analytics.view'],
  }),
}));

// NEW: Mock JWT
jest.mock('../lib/jwtUtils', () => ({
  parseJWT: jest.fn().mockReturnValue({
    app_metadata: {
      tenant_plan: 'growth',
      tenant_role: 'admin',
      features: ['analytics.view'],
    },
  }),
}));
```

**Files to update:**
- `src/context/__tests__/AccessContext.test.tsx` (if exists)
- Any component tests that rely on access context
- Integration tests for auth flow

---

## File-by-File Breakdown

### 1. NEW FILE: `src/lib/jwtUtils.ts`

**Purpose:** Parse and validate JWT tokens

**Size:** ~100 lines

**Dependencies:** None (pure JS)

**Exports:**
```typescript
export interface JWTPayload { ... }
export function parseJWT(token: string): JWTPayload
export function isJWTExpired(token: string): boolean
export function getJWTExpiration(token: string): Date | null
```

**Key logic:**
1. Split JWT into 3 parts (header.payload.signature)
2. Base64url decode the payload
3. Parse JSON
4. Extract app_metadata
5. Handle errors gracefully

**Error handling:**
- Invalid JWT format → throw error with clear message
- Missing app_metadata → return empty object (fallback)
- Expired token → return but flag as expired

---

### 2. MODIFY: `src/context/AccessContext.tsx`

**Current size:** 231 lines

**Expected changes:** ~50 lines modified, ~30 lines removed

**New size:** ~220 lines (slightly smaller)

**What changes:**

#### Remove (Lines 14, 88-192):
```typescript
import { getAccessData } from '../lib/supabase-api'; // REMOVE
// REMOVE entire initializeAccess function body
// REMOVE timeout logic
// REMOVE API call
// REMOVE retry logic
```

#### Add (Top):
```typescript
import { parseJWT } from '../lib/jwtUtils'; // ADD
```

#### Replace initializeAccess function:
- **Before:** Complex async function with API call, timeout, retries
- **After:** Simple synchronous JWT parsing

**Key simplifications:**
1. No async/await for main logic (JWT parsing is sync)
2. No timeout needed (no network call)
3. No retry logic needed
4. No loading states for network
5. Keep error handling for malformed JWT

#### Keep unchanged:
- State structure (AccessState interface)
- Context setup
- Hooks (useAccess, usePlan, useRole, etc.)
- Memoization logic
- Default values

---

### 3. MODIFY: `src/lib/supabase-api.ts`

**Current size:** ~430 lines

**Expected changes:** ~30 lines removed or commented

**Options:**

#### Option A: Remove get-access-data
```typescript
// DELETE these lines:
export async function getAccessData(): Promise<AccessData> {
  return callEdgeFunctionGet('get-access-data', {});
}
```

#### Option B: Deprecate (safer)
```typescript
/**
 * @deprecated Use parseJWT from jwtUtils instead
 * This function is kept for backward compatibility and debugging
 */
export async function getAccessData(): Promise<AccessData> {
  // Keep implementation but mark as deprecated
  return callEdgeFunctionGet('get-access-data', {});
}
```

**Recommendation:** Option B during migration, then Option A after validation

---

### 4. OPTIONAL: Update `src/features/auth/AuthContext.tsx`

**Current:** Provides `user` object

**Potential addition:** Listen for token refresh

```typescript
// ADD: Token refresh listener
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      if (event === 'TOKEN_REFRESHED') {
        // Notify AccessContext to re-parse JWT
        console.log('Token refreshed, access data may have changed');
      }
    }
  );
  return () => subscription.unsubscribe();
}, []);
```

**Alternative:** Handle this in AccessContext directly (probably better)

---

### 5. UPDATE TESTS: Various test files

**Files to check:**
- `src/context/__tests__/AccessContext.test.tsx`
- `src/components/guards/__tests__/*.test.tsx`
- Any integration tests

**What to change:**
- Mock `parseJWT` instead of `getAccessData`
- Update mock JWT structure
- Test JWT parsing edge cases

---

## Testing Strategy

### Phase 1: Unit Tests

#### Test JWT Parser
```typescript
describe('parseJWT', () => {
  it('should parse valid JWT', () => {
    const token = 'valid.jwt.token';
    const result = parseJWT(token);
    expect(result.app_metadata).toBeDefined();
  });

  it('should handle missing app_metadata', () => {
    const token = 'jwt.without.metadata';
    const result = parseJWT(token);
    expect(result.app_metadata).toEqual({});
  });

  it('should throw on invalid JWT', () => {
    expect(() => parseJWT('invalid')).toThrow();
  });
});
```

#### Test AccessContext
```typescript
describe('AccessContext with JWT', () => {
  it('should extract access data from JWT', () => {
    const mockUser = {
      access_token: createMockJWT({
        tenant_role: 'admin',
        tenant_plan: 'growth',
      }),
    };
    
    const { result } = renderHook(() => useAccess(), {
      wrapper: ({ children }) => (
        <AuthProvider user={mockUser}>
          <AccessProvider>{children}</AccessProvider>
        </AuthProvider>
      ),
    });

    expect(result.current.role).toBe('admin');
    expect(result.current.plan).toBe('growth');
  });
});
```

### Phase 2: Integration Tests

#### Test Auth Flow
1. User logs in → JWT has correct data
2. Parse JWT → AccessContext updated
3. UI reflects correct access level

#### Test Token Refresh
1. Mock token refresh event
2. AccessContext re-parses JWT
3. Updated access data reflected in UI

### Phase 3: Manual Testing

#### Scenario 1: Fresh Login
1. Log out completely
2. Log in as admin on growth plan
3. Check console: JWT has correct metadata
4. Verify UI shows analytics (growth feature)
5. Verify admin capabilities available

#### Scenario 2: Role Change
1. Logged in as teacher
2. Backend admin changes user to admin
3. Force token refresh (wait ~60 min or trigger manually)
4. Verify UI updates to show admin capabilities

#### Scenario 3: Plan Downgrade
1. Logged in on growth plan
2. Backend downgrades to free
3. Force token refresh
4. Verify analytics locked
5. Verify write operations locked

#### Scenario 4: Token Expiry
1. Let token expire naturally
2. Supabase auto-refreshes
3. Verify access data still correct

---

## Migration Path

### Step-by-Step Rollout

#### Week 1: Preparation
- [ ] **Day 1:** Backend JWT sync implemented and tested
- [ ] **Day 2:** Backend simplified RLS policies added (parallel to old)
- [ ] **Day 3:** Verify JWT contains correct data for test users

#### Week 2: Frontend Changes
- [ ] **Day 1:** Create `jwtUtils.ts` + unit tests
- [ ] **Day 2:** Update `AccessContext.tsx` (keep old code commented)
- [ ] **Day 3:** Test locally with real JWT
- [ ] **Day 4:** Update related tests
- [ ] **Day 5:** Code review + fix issues

#### Week 3: Deployment & Validation
- [ ] **Day 1:** Deploy to staging
- [ ] **Day 2:** Full regression testing
- [ ] **Day 3:** Fix any bugs found
- [ ] **Day 4:** Deploy to production
- [ ] **Day 5:** Monitor for issues

#### Week 4: Cleanup
- [ ] Remove old `getAccessData` code
- [ ] Remove backend old RLS policies
- [ ] Update documentation

---

## Rollback Plan

### If something goes wrong:

#### Quick Rollback (5 minutes)
```typescript
// In AccessContext.tsx, revert to old code:
const initializeAccess = useCallback(async () => {
  // Comment out JWT parsing
  // const jwt = parseJWT(token);
  
  // Uncomment API call
  const remote = await getAccessData();
  setState({ ...remote, isLoading: false });
}, []);
```

**Deploy:** Git revert + redeploy

#### Medium Rollback (1 hour)
- Revert frontend PR
- Keep backend changes (they're backward compatible)
- Old code still works with new JWT structure

#### Full Rollback (rare)
- Revert backend simplified RLS
- Revert frontend changes
- Back to original state

---

## Key Differences Summary

### Before (Current)
```typescript
// AccessContext.tsx
const initializeAccess = async () => {
  setLoading(true);
  try {
    const remote = await getAccessData(); // API CALL
    setState(remote);
  } catch (error) {
    // Handle network errors
  }
};
```

### After (Simplified RLS with JWT)
```typescript
// AccessContext.tsx
const initializeAccess = () => {
  try {
    const jwt = parseJWT(user.access_token); // PARSE JWT
    const metadata = jwt.app_metadata || {};
    setState({
      plan: metadata.tenant_plan,
      role: metadata.tenant_role,
      features: metadata.features,
      // ... rest
    });
  } catch (error) {
    // Handle parse errors
  }
};
```

**Key improvements:**
- ✅ No network call (faster)
- ✅ Synchronous (simpler)
- ✅ No timeout/retry logic needed
- ✅ Single source of truth (JWT)
- ✅ Easier to debug (just inspect JWT)

---

## Common Pitfalls & Solutions

### Pitfall 1: JWT doesn't have app_metadata yet

**Symptom:** User logs in, but JWT is missing `app_metadata.tenant_role`

**Cause:** Backend JWT sync triggers haven't fired yet

**Solution:**
```typescript
// Fallback to user_metadata or default
const role = metadata.tenant_role 
  || user.user_metadata?.role 
  || 'student';
```

### Pitfall 2: Token refresh doesn't update UI

**Symptom:** User's role changes in backend, but UI doesn't update

**Cause:** Not listening to token refresh event

**Solution:** Add `onAuthStateChange` listener (see Step 4)

### Pitfall 3: JWT parsing fails on malformed token

**Symptom:** Error thrown, app crashes

**Cause:** Invalid JWT format from Supabase

**Solution:**
```typescript
try {
  const jwt = parseJWT(token);
  setState(jwt.app_metadata);
} catch (error) {
  console.error('JWT parse failed:', error);
  // Fallback to API call or default state
  setState(DEFAULT_ACCESS);
}
```

### Pitfall 4: JWT size too large

**Symptom:** JWT exceeds 8KB limit (rare)

**Cause:** Too many features/capabilities in array

**Solution:**
- Store only feature keys, not full objects
- Use shorthand notation
- Consider feature groups instead of individual features

### Pitfall 5: Stale JWT data

**Symptom:** User sees old access level

**Cause:** JWT not refreshed after backend changes

**Solution:**
- Document refresh timing (tokens refresh every ~60 min)
- Add manual refresh button for testing
- Consider shorter token expiry for critical changes

---

## Debug Checklist

When testing, verify these:

### ✅ JWT Structure
```javascript
// In browser console:
const user = supabase.auth.getUser();
console.log('JWT:', parseJWT(user.access_token));

// Should show:
{
  app_metadata: {
    tenant_id: "...",
    tenant_role: "admin",
    tenant_plan: "growth",
    features: [...],
    capabilities: [...]
  }
}
```

### ✅ AccessContext State
```javascript
// In browser console (React DevTools):
// Find AccessContext component
// Inspect state

// Should match JWT app_metadata
```

### ✅ Token Refresh
```javascript
// Trigger manual refresh
await supabase.auth.refreshSession();

// Check if state updated
```

### ✅ RLS Enforcement (Backend)
```javascript
// Try to bypass frontend (should fail if plan/role insufficient)
await supabase.from('students').delete().eq('id', 'test-id');
// Should get RLS policy violation error
```

---

## Performance Comparison

### Before (API Call)
```
User logs in
  ↓ (0ms)
Component mounts
  ↓ (0ms)
Call getAccessData()
  ↓ (100-500ms) ← NETWORK LATENCY
Parse response
  ↓ (1ms)
Update state
  ↓ (10ms)
Re-render UI
Total: ~111-511ms
```

### After (JWT Parse)
```
User logs in
  ↓ (0ms)
Component mounts
  ↓ (0ms)
Parse JWT
  ↓ (1ms) ← INSTANT
Update state
  ↓ (10ms)
Re-render UI
Total: ~11ms
```

**Speed improvement:** 10-50x faster initial load

---

## Questions to Answer Before Starting

1. **Is backend JWT sync ready?**
   - [ ] Triggers on tenant_members
   - [ ] Triggers on tenants
   - [ ] Backfill completed
   - [ ] Tested with sample users

2. **Which environment to start with?**
   - [ ] Local development
   - [ ] Staging
   - [ ] Production (after local + staging)

3. **How to handle rollback?**
   - [ ] Keep old code commented (safest)
   - [ ] Feature flag (more complex)
   - [ ] Git revert (simplest)

4. **What's the testing plan?**
   - [ ] Unit tests written
   - [ ] Integration tests updated
   - [ ] Manual test scenarios defined
   - [ ] Regression test suite ready

5. **Who needs to review?**
   - [ ] Security team (if you have one)
   - [ ] Backend team (JWT sync coordination)
   - [ ] Frontend team (code review)
   - [ ] QA team (testing)

---

## Success Criteria

After migration, you should have:

### ✅ Functionality
- [ ] All access control works as before
- [ ] No regressions in feature gating
- [ ] Role-based access correct
- [ ] Plan-based access correct

### ✅ Performance
- [ ] Faster initial load (no API call)
- [ ] Lower latency for access checks
- [ ] Reduced Edge Function costs

### ✅ Developer Experience
- [ ] Easier to debug (inspect JWT)
- [ ] Simpler code (less async)
- [ ] Single source of truth
- [ ] Better error messages

### ✅ Security
- [ ] Backend still enforces (RLS)
- [ ] Tenant isolation maintained
- [ ] No security regressions
- [ ] Audit trail preserved

---

## Next Steps

1. **Review this walkthrough** with your team
2. **Verify backend prerequisites** are met
3. **Set up test environment** with JWT sync
4. **Create implementation plan** with timeline
5. **Assign tasks** to team members
6. **Start with jwtUtils.ts** (lowest risk)
7. **Test incrementally** at each step
8. **Deploy carefully** with rollback ready

---

**Status:** 📋 Ready for Implementation  
**Estimated Time:** 1 week  
**Risk Level:** 🟡 Medium (with proper testing)  
**Rollback Time:** 5 minutes

