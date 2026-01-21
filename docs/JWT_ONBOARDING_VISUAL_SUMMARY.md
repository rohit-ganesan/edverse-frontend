# 🎨 JWT Onboarding Flow - Visual Summary

Quick visual reference for how JWT gets populated during user signup and onboarding.

---

## 🔄 Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER SIGNUP & ONBOARDING                      │
└─────────────────────────────────────────────────────────────────┘

STEP 1: User Signs Up
┌──────────────────────┐
│ Frontend:            │
│ StepByStepSignUpForm │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────────────────────────────────┐
│ supabase.auth.signUp({                                │
│   email,                                              │
│   password,                                           │
│   options: {                                          │
│     data: { first_name, last_name, role }  ← user_metadata
│   }                                                   │
│ })                                                    │
└──────────┬───────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────┐
│ Supabase Creates:                                     │
│                                                       │
│ auth.users:                                          │
│ ├─ id: user-uuid                                     │
│ ├─ email: user@example.com                          │
│ ├─ email_confirmed_at: null                         │
│ ├─ user_metadata: { first_name, last_name, role }   │
│ └─ raw_app_meta_data: {}  ← EMPTY!                  │
└──────────┬───────────────────────────────────────────┘
           │
           ▼
═══════════════════════════════════════════════════════
STEP 2: Email Verification
═══════════════════════════════════════════════════════
           │
           ▼
┌──────────────────────────────────────────────────────┐
│ User Clicks Verification Link                         │
│ email_confirmed_at = NOW()                           │
└──────────┬───────────────────────────────────────────┘
           │
           ▼
═══════════════════════════════════════════════════════
STEP 3: User Logs In
═══════════════════════════════════════════════════════
           │
           ▼
┌──────────────────────────────────────────────────────┐
│ supabase.auth.signInWithPassword()                    │
└──────────┬───────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────┐
│ Supabase Issues JWT:                                  │
│                                                       │
│ {                                                     │
│   "sub": "user-uuid",                                │
│   "email": "user@example.com",                       │
│   "user_metadata": {                                 │
│     "first_name": "John",                            │
│     "last_name": "Doe",                              │
│     "role": "admin"                                  │
│   },                                                  │
│   "app_metadata": {}  ← STILL EMPTY!                │
│ }                                                     │
└──────────┬───────────────────────────────────────────┘
           │
           ▼
═══════════════════════════════════════════════════════
STEP 4: OnboardingGate Check
═══════════════════════════════════════════════════════
           │
           ▼
┌──────────────────────────────────────────────────────┐
│ Check: Is user in tenant_members?                    │
│ → NO                                                 │
│ → Redirect to /onboarding                           │
└──────────┬───────────────────────────────────────────┘
           │
           ▼
═══════════════════════════════════════════════════════
STEP 5: User Completes Onboarding Form
═══════════════════════════════════════════════════════
           │
           ▼
┌──────────────────────────────────────────────────────┐
│ authAPI.finalizeOnboarding({                         │
│   first_name, last_name, role,                       │
│   tenant_name, join_code, etc.                       │
│ })                                                    │
└──────────┬───────────────────────────────────────────┘
           │
           ▼
═══════════════════════════════════════════════════════
STEP 6: onboarding-finalize Edge Function
═══════════════════════════════════════════════════════
           │
           ▼
┌──────────────────────────────────────────────────────┐
│ Edge Function Does:                                   │
│                                                       │
│ 1. Update public.users                               │
│    └─ first_name, last_name, role, address          │
│                                                       │
│ 2. Create/Join Tenant                                │
│    ├─ Owner/Admin: Create new tenant                 │
│    │  └─ tenants(name, plan='starter',              │
│    │     trial_ends_at=now()+7days)                  │
│    └─ Others: Redeem join code                       │
│                                                       │
│ 3. Create tenant_members ← KEY STEP!                │
│    └─ INSERT INTO tenant_members                     │
│       (tenant_id, user_id, role, status)            │
│                                                       │
│ 4. Create role-specific records                      │
│    ├─ Teacher → instructors table                    │
│    └─ Student → students table                       │
└──────────┬───────────────────────────────────────────┘
           │
           │  ⚡ TRIGGER FIRES! ⚡
           │
           ▼
═══════════════════════════════════════════════════════
STEP 7: Database Trigger Updates JWT Claims
═══════════════════════════════════════════════════════
           │
           ▼
┌──────────────────────────────────────────────────────┐
│ TRIGGER: sync_jwt_on_member_change                    │
│ WHEN: tenant_members INSERT/UPDATE                    │
└──────────┬───────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────┐
│ FUNCTION: sync_user_jwt_claims()                      │
│                                                       │
│ 1. Get tenant info:                                  │
│    SELECT plan, trial_ends_at, name                  │
│    FROM tenants WHERE id = NEW.tenant_id             │
│                                                       │
│ 2. Get features for plan:                            │
│    features = get_plan_features(plan)                │
│                                                       │
│ 3. Get capabilities for role:                        │
│    capabilities = get_role_capabilities(role)        │
│                                                       │
│ 4. UPDATE auth.users:                                │
│    SET raw_app_meta_data = {                         │
│      tenant_id, tenant_role, tenant_plan,            │
│      tenant_name, features, capabilities,            │
│      trial_ends_at                                   │
│    }                                                  │
│    WHERE id = user_id                                │
└──────────┬───────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────┐
│ ✅ auth.users.raw_app_meta_data NOW POPULATED!       │
│                                                       │
│ BUT: User's JWT still has empty app_metadata!        │
│ (JWT is already issued, doesn't auto-update)         │
└──────────┬───────────────────────────────────────────┘
           │
           ▼
═══════════════════════════════════════════════════════
STEP 8: Frontend Forces Token Refresh ← CRITICAL!
═══════════════════════════════════════════════════════
           │
           ▼
┌──────────────────────────────────────────────────────┐
│ Frontend (after onboarding success):                  │
│                                                       │
│ const response = await finalizeOnboarding(data);     │
│                                                       │
│ if (response.ok) {                                   │
│   // ⚡ CRITICAL: Force token refresh!               │
│   await supabase.auth.refreshSession();              │
│                                                       │
│   navigate('/dashboard');                            │
│ }                                                     │
└──────────┬───────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────┐
│ supabase.auth.refreshSession() does:                 │
│                                                       │
│ 1. Sends refresh_token to Supabase                   │
│ 2. Supabase reads auth.users.raw_app_meta_data      │
│ 3. Generates NEW JWT with app_metadata               │
│ 4. Returns new JWT to frontend                       │
└──────────┬───────────────────────────────────────────┘
           │
           ▼
═══════════════════════════════════════════════════════
STEP 9: New JWT Has Complete Access Data!
═══════════════════════════════════════════════════════
           │
           ▼
┌──────────────────────────────────────────────────────┐
│ NEW JWT:                                              │
│                                                       │
│ {                                                     │
│   "sub": "user-uuid",                                │
│   "email": "user@example.com",                       │
│   "user_metadata": {                                 │
│     "first_name": "John",                            │
│     "last_name": "Doe",                              │
│     "role": "admin"                                  │
│   },                                                  │
│   "app_metadata": {  ← NOW POPULATED! ✅            │
│     "tenant_id": "tenant-uuid",                      │
│     "tenant_role": "admin",                          │
│     "tenant_plan": "starter",                        │
│     "tenant_name": "My School",                      │
│     "features": [                                    │
│       "students.view",                               │
│       "students.create",                             │
│       "analytics.view",                              │
│       ...                                            │
│     ],                                                │
│     "capabilities": [                                │
│       "students.view",                               │
│       "students.create",                             │
│       ...                                            │
│     ],                                                │
│     "trial_ends_at": "2026-01-20T00:00:00Z"         │
│   }                                                   │
│ }                                                     │
└──────────┬───────────────────────────────────────────┘
           │
           ▼
═══════════════════════════════════════════════════════
STEP 10: AccessContext Parses JWT
═══════════════════════════════════════════════════════
           │
           ▼
┌──────────────────────────────────────────────────────┐
│ AccessContext:                                        │
│                                                       │
│ const jwt = parseJWT(user.access_token);             │
│ const metadata = jwt.app_metadata;                   │
│                                                       │
│ setState({                                           │
│   plan: metadata.tenant_plan,      // 'starter'     │
│   role: metadata.tenant_role,      // 'admin'       │
│   features: metadata.features,     // [...]         │
│   capabilities: metadata.capabilities, // [...]     │
│   tenant_id: metadata.tenant_id,   // uuid          │
│   tenant_name: metadata.tenant_name, // 'My School' │
│   trial_ends_at: metadata.trial_ends_at,            │
│   isInitialized: true                                │
│ });                                                   │
└──────────┬───────────────────────────────────────────┘
           │
           ▼
═══════════════════════════════════════════════════════
STEP 11: User Has Full Access!
═══════════════════════════════════════════════════════
           │
           ▼
┌──────────────────────────────────────────────────────┐
│ UI Hooks Work:                                        │
│                                                       │
│ ✅ useAccess().plan === 'starter'                    │
│ ✅ useAccess().role === 'admin'                      │
│ ✅ useFeature('students.create') === true            │
│ ✅ useCan('students.create') === true                │
│                                                       │
│ Components Render Correctly:                          │
│ ✅ <FeatureGate feature="analytics.view">            │
│ ✅ <CapabilityGate capability="students.create">     │
│                                                       │
│ RLS Enforcement Works:                                │
│ ✅ Database reads JWT.app_metadata for policies      │
│ ✅ Queries only return tenant's data                 │
│ ✅ Writes blocked if plan/role insufficient          │
└──────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════
✅ ONBOARDING COMPLETE - USER FULLY FUNCTIONAL
═══════════════════════════════════════════════════════
```

---

## 🔑 Key Takeaways

### 1. JWT Doesn't Auto-Update

```
❌ WRONG: Database changes → JWT automatically updates

✅ RIGHT: Database changes → Must refresh session → New JWT
```

### 2. The Critical Call

```typescript
// After onboarding completes:
await authAPI.finalizeOnboarding(data);

// ⚡ THIS IS CRITICAL:
await supabase.auth.refreshSession();

// Now JWT has app_metadata
navigate('/dashboard');
```

### 3. Timing is Everything

```
Before Refresh:
JWT.app_metadata = {}
→ User has no access

After Refresh:
JWT.app_metadata = { tenant_id, role, plan, features, ... }
→ User has full access
```

---

## 🎯 Three Critical Components

### 1. Backend Trigger (One-time setup)

```sql
CREATE TRIGGER sync_jwt_on_member_change
AFTER INSERT OR UPDATE ON tenant_members
FOR EACH ROW
EXECUTE FUNCTION sync_user_jwt_claims();
```

**Does:** Updates `auth.users.raw_app_meta_data` when tenant membership changes

### 2. Frontend Refresh (After onboarding)

```typescript
await supabase.auth.refreshSession();
```

**Does:** Gets new JWT with populated `app_metadata`

### 3. AccessContext Parse (On every load)

```typescript
const jwt = parseJWT(user.access_token);
setState(jwt.app_metadata);
```

**Does:** Extracts access data from JWT for UI

---

## ⚠️ Common Mistakes

### Mistake 1: Forgetting to Refresh

```typescript
// ❌ WRONG:
await authAPI.finalizeOnboarding(data);
navigate('/dashboard'); // JWT still empty!

// ✅ RIGHT:
await authAPI.finalizeOnboarding(data);
await supabase.auth.refreshSession(); // Get new JWT!
navigate('/dashboard');
```

### Mistake 2: Checking DB Instead of JWT

```typescript
// ❌ WRONG (slow, extra DB query):
const { data } = await supabase
  .from('tenant_members')
  .select('role, tenants(plan)')
  .eq('user_id', user.id)
  .single();

// ✅ RIGHT (instant, no DB query):
const jwt = parseJWT(user.access_token);
const role = jwt.app_metadata.tenant_role;
const plan = jwt.app_metadata.tenant_plan;
```

### Mistake 3: Not Handling Empty app_metadata

```typescript
// ❌ WRONG (crashes if empty):
const plan = jwt.app_metadata.tenant_plan;

// ✅ RIGHT (fallback):
const plan = jwt.app_metadata?.tenant_plan || 'free';
```

---

## 📊 State Comparison

### Before Onboarding

```javascript
// auth.users table:
{
  id: "user-uuid",
  email: "user@example.com",
  raw_app_meta_data: {}  ← Empty
}

// JWT:
{
  sub: "user-uuid",
  app_metadata: {}  ← Empty
}

// AccessContext:
{
  plan: "free",
  role: "student",
  features: [],
  capabilities: [],
  tenant_id: null
}
```

### After Onboarding (Before Refresh)

```javascript
// auth.users table:
{
  id: "user-uuid",
  email: "user@example.com",
  raw_app_meta_data: {  ← POPULATED! ✅
    tenant_id: "tenant-uuid",
    tenant_role: "admin",
    tenant_plan: "starter",
    features: [...],
    ...
  }
}

// JWT:
{
  sub: "user-uuid",
  app_metadata: {}  ← Still empty! ⚠️
}

// AccessContext:
{
  plan: "free",
  role: "student",
  features: [],
  capabilities: [],
  tenant_id: null
}
```

### After Token Refresh

```javascript
// auth.users table:
{
  id: "user-uuid",
  email: "user@example.com",
  raw_app_meta_data: {  ← Populated ✅
    tenant_id: "tenant-uuid",
    tenant_role: "admin",
    tenant_plan: "starter",
    features: [...],
    ...
  }
}

// JWT:
{
  sub: "user-uuid",
  app_metadata: {  ← NOW POPULATED! ✅
    tenant_id: "tenant-uuid",
    tenant_role: "admin",
    tenant_plan: "starter",
    features: [...],
    ...
  }
}

// AccessContext:
{
  plan: "starter",
  role: "admin",
  features: ["students.view", "students.create", ...],
  capabilities: ["students.view", "students.create", ...],
  tenant_id: "tenant-uuid"
}
```

---

## 🔄 Alternative Flows

### Owner Creating New School

```
Sign Up
  ↓
Verify Email
  ↓
Log In (JWT empty)
  ↓
Onboarding:
  - Enter school name: "Demo School"
  - Role: Owner
  ↓
Edge Function:
  - CREATE tenant (plan='starter', trial=7days)
  - CREATE tenant_members (role='owner')
  - Trigger → Update auth.users
  ↓
Frontend:
  - refreshSession()
  - JWT now has: tenant_id, role='owner', plan='starter'
  ↓
Dashboard with full access
```

### Teacher Joining Existing School

```
Sign Up
  ↓
Verify Email
  ↓
Log In (JWT empty)
  ↓
Onboarding:
  - Enter join code: "ABC123XYZ"
  - Role: Teacher
  - Subjects: ["Math", "Physics"]
  ↓
Edge Function:
  - VERIFY join code (valid, not expired)
  - REDEEM join code
  - CREATE tenant_members (tenant_id from code, role='teacher')
  - CREATE instructors (subjects)
  - Trigger → Update auth.users
  ↓
Frontend:
  - refreshSession()
  - JWT now has: tenant_id, role='teacher', plan=(whatever school has)
  ↓
Dashboard with teacher access
```

---

## 🧪 Testing Checklist

### Backend Tests

- [ ] Trigger fires on tenant_members INSERT
- [ ] Trigger fires on tenant_members UPDATE
- [ ] Function correctly populates all fields
- [ ] Features match plan
- [ ] Capabilities match role
- [ ] Works for all roles (owner, admin, teacher, student, parent)
- [ ] Works for all plans (free, starter, growth)

### Frontend Tests

- [ ] AccessContext parses JWT correctly
- [ ] Handles empty app_metadata gracefully
- [ ] Token refresh after onboarding works
- [ ] Multiple refreshes don't cause issues
- [ ] All hooks return correct values
- [ ] Components gate correctly

### Integration Tests

- [ ] Complete owner signup flow
- [ ] Complete teacher signup with join code
- [ ] Complete student signup with join code
- [ ] Join code redemption
- [ ] Plan upgrade updates JWT (after refresh)
- [ ] Role change updates JWT (after refresh)

---

## 🎬 Quick Start

### For New Implementation:

1. **Backend:** Deploy JWT sync triggers
2. **Frontend:** Add refresh call after onboarding:
   ```typescript
   await authAPI.finalizeOnboarding(data);
   await supabase.auth.refreshSession(); // ← Add this!
   navigate('/dashboard');
   ```
3. **Test:** Sign up as new owner, verify access works immediately

### That's it! 🎉

---

**Status:** 📋 Visual Reference  
**Use Case:** Quick lookup during implementation  
**Related Docs:**
- `JWT_ONBOARDING_FLOW_WALKTHROUGH.md` (detailed explanation)
- `SIMPLIFIED_RLS_CODE_COMPARISON.md` (code examples)

