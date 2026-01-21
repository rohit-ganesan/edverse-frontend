# 🔐 JWT Onboarding Flow - Complete Walkthrough

This document explains **exactly how JWT claims get populated** during user signup and onboarding, and when the frontend can access them.

---

## 📋 Table of Contents

1. [Current Onboarding Flow](#current-onboarding-flow)
2. [JWT Population Timing](#jwt-population-timing)
3. [The Critical Problem](#the-critical-problem)
4. [Three Solutions](#three-solutions)
5. [Recommended Approach](#recommended-approach)
6. [Implementation Details](#implementation-details)
7. [Edge Cases](#edge-cases)
8. [Testing Strategy](#testing-strategy)

---

## Current Onboarding Flow

### Step-by-Step: What Happens Today

```
┌──────────────────────────────────────────────────────────────┐
│ STEP 1: User Fills Out Signup Form                          │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
         User enters:
         - Email & Password
         - First/Last Name
         - Role (owner/admin/teacher/student/parent)
         - Role-specific info (school name, subjects, grade, etc.)
                     │
                     ▼
┌──────────────────────────────────────────────────────────────┐
│ STEP 2: Frontend Calls Supabase Auth                        │
│ → supabase.auth.signUp()                                    │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
         Creates record in auth.users:
         {
           "id": "user-uuid",
           "email": "user@example.com",
           "email_confirmed_at": null,  ← NOT CONFIRMED YET
           "user_metadata": {
             "first_name": "John",
             "last_name": "Doe",
             "role": "admin"
           },
           "app_metadata": {}  ← EMPTY!
         }
                     │
                     ▼
┌──────────────────────────────────────────────────────────────┐
│ STEP 3: Email Verification                                   │
│ User receives email, clicks verify link                      │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
         Updates auth.users:
         - email_confirmed_at = now()
         - User can now log in
                     │
                     ▼
┌──────────────────────────────────────────────────────────────┐
│ STEP 4: User Logs In                                         │
│ → supabase.auth.signInWithPassword()                        │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
         Gets JWT token:
         {
           "sub": "user-uuid",
           "email": "user@example.com",
           "user_metadata": {
             "first_name": "John",
             "role": "admin"
           },
           "app_metadata": {}  ← STILL EMPTY!
         }
                     │
                     ▼
┌──────────────────────────────────────────────────────────────┐
│ STEP 5: OnboardingGate Detects Incomplete Profile            │
│ Checks: Is user in tenant_members? NO                        │
│ → Redirects to /onboarding                                   │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────┐
│ STEP 6: User Completes Onboarding Form                       │
│ → Calls authAPI.finalizeOnboarding()                        │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────┐
│ STEP 7: onboarding-finalize Edge Function                    │
│ 1. Updates public.users (first_name, last_name, role)       │
│ 2. Creates tenant (if owner/admin)                          │
│ 3. Creates tenant_members record                            │
│ 4. Creates role-specific records (instructors/students)     │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
         Database state after onboarding:
         
         auth.users:
         - id: user-uuid
         - email: user@example.com
         - app_metadata: {}  ← STILL EMPTY!
         
         public.users:
         - id: user-uuid
         - first_name: "John"
         - last_name: "Doe"
         - role: "admin"
         
         tenants:
         - id: tenant-uuid
         - name: "My School"
         - plan: "starter"
         - trial_ends_at: now() + 7 days
         
         tenant_members:
         - tenant_id: tenant-uuid
         - user_id: user-uuid
         - role: "admin"
         - status: "active"
                     │
                     ▼
┌──────────────────────────────────────────────────────────────┐
│ STEP 8: User Redirected to Dashboard                         │
│ JWT STILL HAS EMPTY app_metadata!                            │
└──────────────────────────────────────────────────────────────┘
```

**Problem:** User's JWT doesn't have access data yet!

---

## JWT Population Timing

### When Does JWT Get Updated?

**Current JWT (after Step 7):**
```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "authenticated",
  "user_metadata": {
    "first_name": "John",
    "last_name": "Doe",
    "role": "admin"
  },
  "app_metadata": {}  ← EMPTY!
}
```

**Needed JWT (with access data):**
```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "authenticated",
  "user_metadata": {
    "first_name": "John",
    "last_name": "Doe",
    "role": "admin"
  },
  "app_metadata": {
    "tenant_id": "tenant-uuid",
    "tenant_role": "admin",
    "tenant_plan": "starter",
    "tenant_name": "My School",
    "features": ["students.view", "students.create", ...],
    "capabilities": ["students.view", "students.create", ...],
    "trial_ends_at": "2026-01-20T00:00:00Z"
  }
}
```

### How JWT Gets Populated

**Backend Trigger Flow:**

```sql
-- When tenant_members is inserted/updated:
tenant_members (INSERT/UPDATE)
  ↓
TRIGGER: sync_jwt_on_member_change
  ↓
FUNCTION: sync_user_jwt_claims()
  ↓
1. Get tenant info (plan, trial_ends_at, name)
2. Get features for plan
3. Get capabilities for role
4. UPDATE auth.users SET raw_app_meta_data = {...}
  ↓
auth.users.raw_app_meta_data now has access data
```

**BUT:** Existing JWT tokens don't automatically update!

---

## The Critical Problem

### Timing Issue

```
Timeline:
─────────────────────────────────────────────────────────────

T0: User signs up
    → auth.users created
    → app_metadata = {}
    
T1: User verifies email

T2: User logs in
    → JWT issued with app_metadata = {}
    
T3: User completes onboarding
    → tenant_members created
    → Trigger fires
    → auth.users.raw_app_meta_data updated
    
T4: User redirected to dashboard
    → JWT STILL has app_metadata = {}!
    → Frontend parses JWT, sees empty app_metadata
    → User has no access!
```

**Why?** JWT is **already issued** at T2. Database update at T3 doesn't affect existing JWT.

### JWT Lifecycle

```
JWT is issued when:
1. User logs in (signInWithPassword)
2. Token refreshes (every ~60 minutes)
3. User explicitly calls refreshSession()

JWT is NOT updated when:
❌ Database auth.users changes
❌ Triggers fire
❌ Backend updates raw_app_meta_data
```

**The JWT is a snapshot taken at login time!**

---

## Three Solutions

### Solution 1: Force Token Refresh After Onboarding ✅ RECOMMENDED

**Idea:** After onboarding completes, immediately refresh the token.

**Flow:**
```
Onboarding completes
  ↓
Trigger updates auth.users.raw_app_meta_data
  ↓
Frontend calls supabase.auth.refreshSession()
  ↓
New JWT issued with updated app_metadata
  ↓
AccessContext parses new JWT
  ↓
User has correct access!
```

**Pros:**
- ✅ Works immediately
- ✅ User doesn't need to re-login
- ✅ Simple frontend change
- ✅ No backend complexity

**Cons:**
- ⚠️ Requires one extra API call
- ⚠️ Small delay (200-500ms)

**Implementation:**
```typescript
// After onboarding finalize succeeds:
const response = await authAPI.finalizeOnboarding(data);

if (response.ok) {
  // Force token refresh to get updated JWT claims
  const { data: { session } } = await supabase.auth.refreshSession();
  
  // Now AccessContext will parse JWT with app_metadata
  navigate('/dashboard');
}
```

---

### Solution 2: Require Re-login After Onboarding

**Idea:** After onboarding, log user out and ask them to log back in.

**Flow:**
```
Onboarding completes
  ↓
Trigger updates auth.users.raw_app_meta_data
  ↓
Frontend logs user out
  ↓
User logs back in
  ↓
New JWT issued with updated app_metadata
  ↓
User has correct access!
```

**Pros:**
- ✅ Very simple
- ✅ Guaranteed fresh JWT
- ✅ No special logic needed

**Cons:**
- ❌ Bad UX (user has to log in again)
- ❌ Annoying for users
- ❌ Feels like a bug

**Implementation:**
```typescript
// After onboarding finalize succeeds:
const response = await authAPI.finalizeOnboarding(data);

if (response.ok) {
  await supabase.auth.signOut();
  navigate('/login', { 
    state: { 
      message: 'Onboarding complete! Please log in again.' 
    }
  });
}
```

---

### Solution 3: Update JWT in Edge Function Directly

**Idea:** Have the Edge Function update JWT claims AND return new token.

**Flow:**
```
Onboarding completes
  ↓
Edge Function:
  1. Creates tenant_members
  2. Manually updates auth.users.raw_app_meta_data
  3. Generates new JWT
  4. Returns new JWT to frontend
  ↓
Frontend replaces current session with new JWT
  ↓
User has correct access!
```

**Pros:**
- ✅ No extra API call
- ✅ Immediate
- ✅ Good UX

**Cons:**
- ❌ Complex backend logic
- ❌ Need to manually generate JWT
- ❌ May not be supported by Supabase
- ❌ Security risk (bypassing Supabase auth)

**Not recommended** - too complex and risky.

---

## Recommended Approach

### Solution 1: Force Token Refresh ✅

This is the **best balance** of simplicity, UX, and security.

### Complete Implementation

#### Backend: JWT Sync Triggers (Already Have This)

```sql
-- File: supabase/migrations/002_jwt_sync_system.sql
-- (Same as in previous documents)

CREATE OR REPLACE FUNCTION sync_user_jwt_claims()
RETURNS TRIGGER AS $$
DECLARE
  user_features TEXT[];
  user_capabilities TEXT[];
  tenant_plan TEXT;
  tenant_trial_ends_at TIMESTAMPTZ;
  tenant_name TEXT;
BEGIN
  -- Get tenant info
  SELECT plan, trial_ends_at, name 
  INTO tenant_plan, tenant_trial_ends_at, tenant_name
  FROM tenants WHERE id = NEW.tenant_id;

  -- Get features based on plan
  user_features := get_plan_features(tenant_plan);

  -- Get capabilities based on role
  user_capabilities := get_role_capabilities(NEW.role);

  -- Update auth.users metadata
  UPDATE auth.users
  SET raw_app_meta_data = jsonb_build_object(
    'tenant_id', NEW.tenant_id::text,
    'tenant_role', NEW.role,
    'tenant_plan', tenant_plan,
    'tenant_name', tenant_name,
    'features', to_jsonb(user_features),
    'capabilities', to_jsonb(user_capabilities),
    'trial_ends_at', tenant_trial_ends_at
  )
  WHERE id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on tenant_members
CREATE TRIGGER sync_jwt_on_member_change
AFTER INSERT OR UPDATE ON tenant_members
FOR EACH ROW
WHEN (NEW.status = 'active')
EXECUTE FUNCTION sync_user_jwt_claims();
```

#### Frontend: Update Onboarding Pages

**File 1: Update onboarding completion handler**

```typescript
// File: src/pages/OnboardingPage.tsx (or wherever finalize is called)

const handleFinalizeOnboarding = async (data: any) => {
  setLoading(true);
  setError(null);

  try {
    // Step 1: Call onboarding-finalize Edge Function
    const response = await authAPI.finalizeOnboarding(data);

    if (!response.ok) {
      throw new Error(response.error || 'Onboarding failed');
    }

    console.log('✅ Onboarding completed successfully');

    // Step 2: CRITICAL - Force token refresh to get updated JWT claims
    console.log('🔄 Refreshing session to get updated access data...');
    
    const { data: { session }, error: refreshError } = 
      await supabase.auth.refreshSession();

    if (refreshError) {
      console.error('Failed to refresh session:', refreshError);
      // Fallback: Let user continue, they can refresh manually or wait for auto-refresh
    } else if (session?.access_token) {
      console.log('✅ Session refreshed, JWT now has access data');
      
      // Optional: Debug log to verify JWT has app_metadata
      const jwt = parseJWT(session.access_token);
      console.log('JWT app_metadata:', jwt.app_metadata);
    }

    // Step 3: Navigate to dashboard
    // AccessContext will now parse JWT and find app_metadata
    navigate('/dashboard', { replace: true });

  } catch (err: any) {
    console.error('Onboarding error:', err);
    setError(err.message || 'Failed to complete onboarding');
  } finally {
    setLoading(false);
  }
};
```

**File 2: Update OnboardingGate to handle refresh**

```typescript
// File: src/components/OnboardingGate.tsx

export function OnboardingGate({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { isInitialized } = useAccess();
  const [checking, setChecking] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    async function checkOnboardingStatus() {
      if (!user || authLoading) return;

      try {
        // Check if user has tenant membership
        const { data, error } = await supabase
          .from('tenant_members')
          .select('id')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          // No membership = needs onboarding
          setNeedsOnboarding(true);
        } else {
          // Has membership but JWT might not have app_metadata yet
          // Check JWT
          const token = user.access_token;
          if (token) {
            const jwt = parseJWT(token);
            
            if (!jwt.app_metadata?.tenant_id) {
              // Has membership but JWT is stale
              console.log('🔄 JWT missing app_metadata, refreshing session...');
              await supabase.auth.refreshSession();
            }
          }
          
          setNeedsOnboarding(false);
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setNeedsOnboarding(false);
      } finally {
        setChecking(false);
      }
    }

    checkOnboardingStatus();
  }, [user, authLoading]);

  if (authLoading || checking || !isInitialized) {
    return <LoadingSpinner />;
  }

  if (needsOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}
```

**File 3: Update AccessContext to handle empty app_metadata**

```typescript
// File: src/context/AccessContext.tsx

const initializeAccess = useCallback(() => {
  if (!user) {
    setState(DEFAULT_ACCESS);
    return;
  }

  try {
    const token = user.access_token || (user as any).token;
    
    if (!token) {
      console.warn('No access token found');
      setState(DEFAULT_ACCESS);
      return;
    }

    const jwt = parseJWT(token);
    const metadata = jwt.app_metadata || {};

    // Check if app_metadata is populated
    if (!metadata.tenant_id) {
      console.warn('⚠️ JWT missing tenant_id - user may need to refresh session');
      
      // Use fallback: check user_metadata or defaults
      setState({
        plan: 'free',
        role: (metadata.tenant_role || user.user_metadata?.role || 'student') as Role,
        features: [],
        capabilities: [],
        isLoading: false,
        isInitialized: true,
        trial_ends_at: null,
        tenant_name: null,
        tenant_id: null,
      });
      return;
    }

    // JWT has app_metadata - use it
    const plan: Plan = 
      metadata.tenant_plan === 'starter' || metadata.tenant_plan === 'growth'
        ? metadata.tenant_plan
        : 'free';

    const role: Role = (metadata.tenant_role as Role) || 'student';

    const features = 
      Array.isArray(metadata.features) && metadata.features.length > 0
        ? metadata.features
        : getFeaturesForPlan(plan);

    const capabilities = 
      Array.isArray(metadata.capabilities) && metadata.capabilities.length > 0
        ? metadata.capabilities
        : ROLE_CAPS[role] || ROLE_CAPS.student;

    setState({
      plan,
      role,
      features: [...features].sort(),
      capabilities,
      isLoading: false,
      isInitialized: true,
      trial_ends_at: metadata.trial_ends_at || null,
      tenant_name: metadata.tenant_name || null,
      tenant_id: metadata.tenant_id || null,
    });

    console.log('✅ Access data loaded from JWT');

  } catch (error) {
    console.error('❌ Failed to parse JWT:', error);
    setState(DEFAULT_ACCESS);
  }
}, [user]);
```

---

## Implementation Details

### Backend Changes Needed

#### 1. JWT Sync System (One-time setup)

Create these SQL functions and triggers:

- [ ] `get_plan_features(plan_name TEXT) → TEXT[]`
- [ ] `get_role_capabilities(role_name TEXT) → TEXT[]`
- [ ] `sync_user_jwt_claims()` function
- [ ] Trigger on `tenant_members` (INSERT/UPDATE)
- [ ] Trigger on `tenants` (UPDATE plan/trial_ends_at)
- [ ] Backfill script for existing users

**Location:** `supabase/migrations/002_jwt_sync_system.sql`

#### 2. Update onboarding-finalize Edge Function (Optional)

Add explicit JWT refresh in the Edge Function itself:

```typescript
// At the end of onboarding-finalize/index.ts

// After creating tenant_members...

// Force a session refresh by updating user metadata
// This triggers Supabase to regenerate the JWT
const { error: updateError } = await svc.auth.admin.updateUserById(
  uid,
  { 
    app_metadata: {
      // Trigger JWT regeneration
      _refresh_trigger: Date.now()
    }
  }
);

return new Response(
  JSON.stringify({ 
    ok: true, 
    tenant_id, 
    role: payload.role,
    refresh_needed: true  // Tell frontend to refresh
  }), 
  { headers: json }
);
```

**Note:** This is optional - frontend refresh is sufficient.

### Frontend Changes Needed

#### 1. Add JWT Parser (Already covered)

Create `src/lib/jwtUtils.ts` with `parseJWT()` function.

#### 2. Update Onboarding Completion

```typescript
// src/pages/OnboardingPage.tsx or similar

// After onboarding succeeds:
await authAPI.finalizeOnboarding(data);

// CRITICAL: Refresh session
await supabase.auth.refreshSession();

// Navigate
navigate('/dashboard');
```

#### 3. Update OnboardingGate

Add check for stale JWT and force refresh if needed.

#### 4. Update AccessContext

Handle empty `app_metadata` gracefully with fallbacks.

---

## Edge Cases

### Case 1: User Closes Browser Before Refresh

**Scenario:**
1. User completes onboarding
2. Before token refresh, user closes browser
3. User returns later and logs in

**What Happens:**
- JWT will have empty `app_metadata` on first login
- OnboardingGate detects stale JWT
- Forces token refresh
- User gets correct access

**Solution:** OnboardingGate should always check and refresh if needed.

---

### Case 2: Token Refresh Fails

**Scenario:**
1. Onboarding completes
2. Token refresh call fails (network error)

**What Happens:**
- User still has old JWT with empty `app_metadata`
- AccessContext sees empty data
- User has limited/no access

**Solution:**
```typescript
try {
  await supabase.auth.refreshSession();
} catch (error) {
  console.error('Token refresh failed:', error);
  
  // Fallback 1: Try again after short delay
  setTimeout(async () => {
    try {
      await supabase.auth.refreshSession();
    } catch {
      // Fallback 2: Show message to user
      toast.warning('Please refresh the page to complete setup');
    }
  }, 2000);
}
```

---

### Case 3: User Invited via Join Code

**Scenario:**
1. Teacher invited by owner (join code)
2. Teacher signs up, uses join code
3. Onboarding creates tenant_members entry

**Flow:**
```
Teacher signs up
  ↓
Email verification
  ↓
Logs in → JWT with empty app_metadata
  ↓
Onboarding: Enters join code
  ↓
onboarding-finalize:
  - Redeems join code
  - Creates tenant_members
  - Trigger updates auth.users
  ↓
Frontend refreshes session
  ↓
JWT now has app_metadata with correct tenant
```

**Works the same way!** Just refresh after onboarding.

---

### Case 4: User's Plan Changes After Login

**Scenario:**
1. User logs in as Free plan user
2. JWT has `app_metadata.tenant_plan = 'free'`
3. Owner upgrades tenant to Growth plan
4. User still logged in

**What Happens:**
- User's JWT still says `plan: 'free'`
- JWT doesn't auto-update
- User won't see Growth features until token refresh

**Solutions:**

**Option A: Wait for auto-refresh** (every ~60 min)
- Simplest, but slow

**Option B: Force refresh on plan change**
- Backend sends real-time update via Supabase Realtime
- Frontend listens and refreshes session
- Complex but immediate

**Option C: Manual refresh button**
- Add "Refresh" button in UI
- User clicks if they don't see new features
- Simple fallback

**Recommended:** Option A + C (auto-refresh + manual button)

---

### Case 5: Multiple Browser Tabs

**Scenario:**
1. User completes onboarding in Tab A
2. Tab B is still open with old session

**What Happens:**
- Tab A refreshes, gets new JWT
- Tab B still has old JWT

**Solution:**
- Supabase automatically syncs sessions across tabs
- Both tabs will get updated JWT
- No extra work needed!

---

## Testing Strategy

### Unit Tests

#### Test 1: JWT Parser with Empty app_metadata
```typescript
test('parseJWT handles empty app_metadata', () => {
  const token = createMockJWT({ app_metadata: {} });
  const jwt = parseJWT(token);
  
  expect(jwt.app_metadata).toEqual({});
});
```

#### Test 2: AccessContext Fallback
```typescript
test('AccessContext uses defaults when app_metadata empty', () => {
  const mockUser = {
    access_token: createMockJWT({ 
      user_metadata: { role: 'teacher' },
      app_metadata: {} 
    })
  };
  
  const { result } = renderHook(() => useAccess(), {
    wrapper: createWrapper(mockUser)
  });

  expect(result.current.role).toBe('teacher');
  expect(result.current.plan).toBe('free');
  expect(result.current.features).toEqual([]);
});
```

### Integration Tests

#### Test 1: Complete Onboarding Flow
```typescript
test('onboarding populates JWT correctly', async () => {
  // 1. User signs up
  await signUp(userData);
  
  // 2. Verify email (mock)
  await verifyEmail();
  
  // 3. Log in
  await signIn(email, password);
  let jwt = parseJWT(currentUser.access_token);
  expect(jwt.app_metadata).toEqual({}); // Empty before onboarding
  
  // 4. Complete onboarding
  await finalizeOnboarding(onboardingData);
  
  // 5. Refresh session
  await refreshSession();
  
  // 6. Check JWT now has data
  jwt = parseJWT(currentUser.access_token);
  expect(jwt.app_metadata.tenant_id).toBeDefined();
  expect(jwt.app_metadata.tenant_role).toBe('admin');
  expect(jwt.app_metadata.tenant_plan).toBe('starter');
});
```

#### Test 2: Token Refresh After Onboarding
```typescript
test('token refresh after onboarding updates JWT', async () => {
  // Setup: User just completed onboarding
  const oldToken = currentUser.access_token;
  const oldJWT = parseJWT(oldToken);
  
  // Refresh
  await supabase.auth.refreshSession();
  
  const newToken = currentUser.access_token;
  const newJWT = parseJWT(newToken);
  
  // Verify JWT changed
  expect(newToken).not.toBe(oldToken);
  expect(newJWT.app_metadata.tenant_id).toBeDefined();
  expect(oldJWT.app_metadata).toEqual({});
});
```

### Manual Testing Checklist

- [ ] **New owner signup**
  1. Sign up as owner
  2. Verify email
  3. Log in
  4. Complete onboarding (create school)
  5. Verify: After onboarding, immediately have admin access
  6. Check console: JWT has app_metadata
  7. Navigate around: All features work

- [ ] **New teacher signup (join code)**
  1. Owner creates join code
  2. Teacher signs up with join code
  3. Complete onboarding
  4. Verify: Teacher has correct access
  5. Check console: JWT has tenant info

- [ ] **Failed token refresh**
  1. Complete onboarding
  2. Simulate network error during refresh
  3. Verify: User sees helpful error message
  4. Manual refresh works

- [ ] **Browser close during onboarding**
  1. Start onboarding
  2. Close browser mid-way
  3. Return and complete onboarding
  4. Verify: Everything works

---

## Summary

### The Problem
JWT doesn't automatically update when database changes. After onboarding, user's JWT has empty `app_metadata` even though `tenant_members` was created.

### The Solution
**Force token refresh** immediately after onboarding completes:

```typescript
await authAPI.finalizeOnboarding(data);
await supabase.auth.refreshSession(); // ← This is critical!
navigate('/dashboard');
```

### Why This Works
1. Onboarding creates `tenant_members`
2. Trigger fires, updates `auth.users.raw_app_meta_data`
3. `refreshSession()` asks Supabase for new JWT
4. Supabase reads `raw_app_meta_data` and includes it in new JWT
5. Frontend parses new JWT, sees `app_metadata`
6. User has correct access!

### Implementation Checklist

Backend:
- [ ] JWT sync triggers deployed
- [ ] Tested with sample user
- [ ] Verified `auth.users.raw_app_meta_data` updates

Frontend:
- [ ] JWT parser created (`jwtUtils.ts`)
- [ ] AccessContext updated to parse JWT
- [ ] Onboarding completion calls `refreshSession()`
- [ ] OnboardingGate checks for stale JWT
- [ ] Fallbacks for empty `app_metadata`
- [ ] Tests written and passing

---

**Status:** 📋 Ready for Implementation  
**Complexity:** 🟡 Medium  
**Critical Path:** Token refresh after onboarding  

