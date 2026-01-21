# 🤔 Frontend-Only Access Control Architecture Ideation

## Executive Summary

This document explores the architectural shift from **hybrid RLS + frontend gating** to **frontend-only access control** for the EdVerse platform. The proposal aims to simplify development by centralizing access control logic in the frontend, eliminating the need to maintain synchronized RLS policies in Supabase.

---

## 🏗️ Current Architecture (Hybrid Model)

### How It Works Today

```
┌─────────────────────────────────────────────────────────────┐
│                        USER LOGIN                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  Supabase Auth Token   │
         │  (JWT with user_id)    │
         └───────────┬────────────┘
                     │
         ┌───────────▼────────────┐
         │ Edge Function:         │
         │ get-access-data        │
         │                        │
         │ Queries:               │
         │ - tenant_members       │
         │ - tenants (plan)       │
         │ - tenant_features      │
         └───────────┬────────────┘
                     │
         ┌───────────▼────────────┐
         │ Returns Access Object: │
         │ - plan                 │
         │ - role                 │
         │ - features[]           │
         │ - capabilities[]       │
         │ - trial_ends_at        │
         └───────────┬────────────┘
                     │
         ┌───────────▼────────────┐
         │   AccessContext        │
         │   (Frontend State)     │
         └───────────┬────────────┘
                     │
         ┌───────────▼────────────┐
         │   UI Components:       │
         │ - useFeature()         │
         │ - useCan()             │
         │ - FeatureGate          │
         │ - CapabilityGate       │
         └────────────────────────┘
```

### Current Security Layers

1. **Layer 1: Supabase RLS Policies** (Backend)
   - Enforced on every database query
   - Based on `auth.uid()` from JWT
   - Uses helper functions: `get_user_role()`, `is_admin()`, etc.
   - Prevents unauthorized data access at database level

2. **Layer 2: Edge Functions** (API Gateway)
   - Validate JWT tokens
   - Additional business logic checks
   - Return computed access data

3. **Layer 3: Frontend Gating** (UX Layer)
   - Show/hide UI components
   - Enable/disable actions
   - Display upgrade prompts
   - **Does NOT enforce security**

### Current Pain Points

✅ **Problems This Solves:**
- Complex RLS policy syntax
- Maintaining sync between frontend capabilities and backend policies
- Debugging RLS failures (cryptic errors)
- RLS performance overhead on every query
- Multiple sources of truth for access rules

❌ **Current Issues:**
- RLS policies are hard to write and test
- Policy mismatches cause runtime errors
- Need to understand PostgreSQL security model
- Difficult to debug "permission denied" errors
- RLS adds query planning overhead

---

## 🎯 Proposed Architecture (Frontend-Only Model)

### How It Would Work

```
┌─────────────────────────────────────────────────────────────┐
│                        USER LOGIN                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  Supabase Auth Token   │
         │  (JWT with custom      │
         │   claims: role, plan,  │
         │   tenant_id, features) │
         └───────────┬────────────┘
                     │
         ┌───────────▼────────────┐
         │  Decode JWT on Login   │
         │  Extract:              │
         │  - user_id             │
         │  - tenant_id           │
         │  - role                │
         │  - plan                │
         │  - features[]          │
         │  - capabilities[]      │
         │  - trial_ends_at       │
         └───────────┬────────────┘
                     │
         ┌───────────▼────────────┐
         │   AccessContext        │
         │   (Frontend State)     │
         │   - Derived from JWT   │
         │   - Refreshed on token │
         │     renewal            │
         └───────────┬────────────┘
                     │
         ┌───────────▼────────────┐
         │   All UI Components:   │
         │ - useFeature()         │
         │ - useCan()             │
         │ - FeatureGate          │
         │ - CapabilityGate       │
         │                        │
         │ + Direct DB Queries    │
         │   (NO RLS checking)    │
         └────────────────────────┘
```

### Key Changes

#### 1. **JWT Custom Claims Enhancement**

Current JWT:
```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "authenticated",
  "aud": "authenticated"
}
```

Proposed JWT (with custom claims):
```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "authenticated",
  "aud": "authenticated",
  "app_metadata": {
    "tenant_id": "tenant-uuid",
    "tenant_role": "admin",
    "tenant_plan": "growth",
    "features": ["students.create", "courses.view", "analytics.view"],
    "capabilities": ["students.view", "students.create", "courses.view"],
    "trial_ends_at": "2026-01-20T00:00:00Z"
  }
}
```

#### 2. **Remove RLS Policies**

**Before:**
```sql
-- Complex RLS policies on every table
CREATE POLICY "Instructors can read student data" ON students
    FOR SELECT USING (
        is_instructor_or_admin() OR auth.uid() = id
    );

CREATE POLICY "Admins can update students" ON students
    FOR UPDATE USING (
        is_admin() OR auth.uid() = id
    );
```

**After:**
```sql
-- Disable RLS entirely
ALTER TABLE students DISABLE ROW LEVEL SECURITY;
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE attendance DISABLE ROW LEVEL SECURITY;
-- etc. for all tables
```

**OR keep minimal tenant isolation:**
```sql
-- Keep ONLY tenant isolation (not role/plan checking)
CREATE POLICY "Users can only access own tenant data" ON students
    FOR ALL USING (
        tenant_id = (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid
    );
```

#### 3. **Frontend Handles All Access Logic**

```typescript
// src/context/AccessContext.tsx
export function AccessProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [access, setAccess] = useState<AccessState>(DEFAULT_ACCESS);

  useEffect(() => {
    if (!user) return;

    // Extract access data from JWT
    const jwt = parseJWT(user.access_token);
    const metadata = jwt.app_metadata || {};

    setAccess({
      plan: metadata.tenant_plan || 'free',
      role: metadata.tenant_role || 'student',
      features: metadata.features || [],
      capabilities: metadata.capabilities || [],
      trial_ends_at: metadata.trial_ends_at,
      tenant_id: metadata.tenant_id,
    });
  }, [user]);

  return (
    <AccessContext.Provider value={access}>
      {children}
    </AccessContext.Provider>
  );
}
```

#### 4. **Database Hook to Update JWT Claims**

```sql
-- Trigger on tenant_members to update auth.users metadata
CREATE OR REPLACE FUNCTION sync_user_jwt_claims()
RETURNS TRIGGER AS $$
DECLARE
  user_features TEXT[];
  user_capabilities TEXT[];
  tenant_plan TEXT;
  tenant_trial_ends_at TIMESTAMPTZ;
BEGIN
  -- Get tenant info
  SELECT plan, trial_ends_at INTO tenant_plan, tenant_trial_ends_at
  FROM tenants WHERE id = NEW.tenant_id;

  -- Get features based on plan
  user_features := get_plan_features(tenant_plan);

  -- Get capabilities based on role
  user_capabilities := get_role_capabilities(NEW.role);

  -- Update auth.users metadata
  UPDATE auth.users
  SET raw_app_meta_data = jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            COALESCE(raw_app_meta_data, '{}'::jsonb),
            '{tenant_id}', to_jsonb(NEW.tenant_id::text)
          ),
          '{tenant_role}', to_jsonb(NEW.role)
        ),
        '{tenant_plan}', to_jsonb(tenant_plan)
      ),
      '{features}', to_jsonb(user_features)
    ),
    '{trial_ends_at}', to_jsonb(tenant_trial_ends_at)
  )
  WHERE id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_user_jwt_claims
AFTER INSERT OR UPDATE ON tenant_members
FOR EACH ROW EXECUTE FUNCTION sync_user_jwt_claims();
```

---

## 📋 Required Changes Breakdown

### Phase 1: JWT Infrastructure (2-3 days)

#### Backend Changes

1. **Create JWT Sync Functions** (`supabase/jwt-sync.sql`)
   ```sql
   -- Functions to compute features/capabilities
   -- Triggers on tenant_members, tenants, tenant_features
   -- Update auth.users raw_app_meta_data
   ```

2. **Migration to Add JWT Claims** (`supabase/migrations/add_jwt_claims.sql`)
   ```sql
   -- Add triggers to sync changes
   -- Backfill existing users
   -- Add updated_at triggers
   ```

3. **Remove Edge Function Dependency**
   - Delete or simplify `get-access-data` function
   - Or keep for fallback/debugging

#### Frontend Changes

1. **Update AccessContext** (`src/context/AccessContext.tsx`)
   - Remove `getAccessData()` API call
   - Parse JWT directly
   - Extract `app_metadata` claims
   - Handle token refresh

2. **Add JWT Parser Utility** (`src/lib/jwtUtils.ts`)
   ```typescript
   export function parseJWT(token: string): JWTPayload {
     const base64Url = token.split('.')[1];
     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
     const jsonPayload = decodeURIComponent(
       atob(base64)
         .split('')
         .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
         .join('')
     );
     return JSON.parse(jsonPayload);
   }
   ```

3. **Update Auth Flow**
   - On login: immediately parse JWT
   - On token refresh: re-parse JWT
   - No separate API call needed

### Phase 2: Remove RLS (1 day)

1. **Option A: Disable RLS Entirely**
   ```sql
   -- DANGEROUS: No backend security
   ALTER TABLE students DISABLE ROW LEVEL SECURITY;
   ALTER TABLE courses DISABLE ROW LEVEL SECURITY;
   -- etc.
   ```

2. **Option B: Keep Tenant Isolation Only (RECOMMENDED)**
   ```sql
   -- Keep minimal tenant scoping
   CREATE POLICY "tenant_isolation" ON students
     FOR ALL USING (
       tenant_id = (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid
     );
   ```

### Phase 3: Testing & Validation (2-3 days)

1. **Test JWT Claims Update**
   - Create new user → JWT has correct claims
   - Change user role → JWT updates
   - Change tenant plan → JWT updates
   - Upgrade/downgrade → JWT reflects changes

2. **Test Access Gating**
   - Free plan: read-only works
   - Starter plan: CRUD works
   - Growth plan: analytics visible
   - Role changes: UI updates correctly

3. **Security Audit**
   - Verify tenant isolation still works
   - Test cross-tenant access attempts
   - Validate JWT signature verification
   - Test token expiry/refresh

### Phase 4: Cleanup (1 day)

1. Remove old RLS policy files
2. Delete unused helper functions
3. Update documentation
4. Remove `get-access-data` edge function (optional)

---

## ⚖️ Pros and Cons Analysis

### ✅ PROS

#### 1. **Simplified Development**
- ✅ Single source of truth (JWT + frontend)
- ✅ No need to write/maintain RLS policies
- ✅ Easier to understand access logic
- ✅ Faster iteration on features
- ✅ No policy/frontend mismatch bugs

#### 2. **Better Performance**
- ✅ No RLS policy evaluation on every query
- ✅ Faster query execution (no extra joins)
- ✅ Reduced database CPU usage
- ✅ One less API call (`get-access-data`)

#### 3. **Improved Developer Experience**
- ✅ No cryptic RLS errors
- ✅ Easier debugging (just check JWT)
- ✅ TypeScript access logic (type-safe)
- ✅ Centralized in one place
- ✅ Easier onboarding for new devs

#### 4. **Flexibility**
- ✅ Quick access rule changes (just update JWT sync)
- ✅ Complex logic easier in TypeScript than SQL
- ✅ Can implement sophisticated gating
- ✅ Easy A/B testing of features

### ❌ CONS

#### 1. **CRITICAL: Security Concerns**

**⚠️ BIGGEST RISK: Frontend is NOT a security boundary**

- ❌ **Any technical user can bypass frontend checks**
  - Open browser DevTools
  - Manually call Supabase client
  - Bypass all `useFeature()` / `useCan()` checks
  
- ❌ **JWT manipulation attempts**
  - User could try to modify JWT claims
  - Supabase validates signature, but...
  - If JWT sync has bugs, user gets wrong access

- ❌ **API direct access**
  ```javascript
  // User can do this in console:
  await supabase.from('students').delete().eq('id', 'any-id');
  // If RLS is disabled, this WILL work!
  ```

- ❌ **No server-side validation**
  - Backend doesn't check role/plan/features
  - Database becomes a "dumb store"
  - Relies entirely on JWT being correct

#### 2. **Compliance & Audit Issues**
- ❌ Harder to prove data access controls for SOC2/ISO27001
- ❌ No database-level audit trail of denials
- ❌ Regulators prefer defense-in-depth

#### 3. **Multi-Tenant Risk**
- ❌ If tenant isolation policy is wrong, **CRITICAL DATA LEAK**
- ❌ One bug = cross-tenant data access
- ❌ Must be 100% sure every table has `tenant_id`

#### 4. **JWT Limitations**
- ❌ JWT size limits (~8KB typical)
- ❌ If user has 100+ features, JWT gets too large
- ❌ JWT claims cached until refresh (stale data risk)
- ❌ Cannot revoke access immediately (until token expires)

#### 5. **Loss of Defense in Depth**
- ❌ Security best practice: multiple layers
- ❌ Frontend-only = single point of failure
- ❌ If JWT sync breaks, wrong access granted
- ❌ No fallback if frontend bug exists

---

## 🔐 Security Deep Dive

### Current Security Model (Defense in Depth)

```
┌─────────────────────────────────────────────────────┐
│ Layer 1: Frontend Gating (UX Only)                  │
│ - Shows/hides features                              │
│ - NOT a security control                            │
└───────────────────┬─────────────────────────────────┘
                    │ ✅ User tries to bypass
                    ▼
┌─────────────────────────────────────────────────────┐
│ Layer 2: Edge Functions (Business Logic)            │
│ - Validates requests                                │
│ - Checks permissions                                │
│ - MODERATE security control                         │
└───────────────────┬─────────────────────────────────┘
                    │ ✅ User tries to bypass
                    ▼
┌─────────────────────────────────────────────────────┐
│ Layer 3: RLS Policies (DATABASE ENFORCEMENT)        │
│ - PostgreSQL enforces on EVERY query                │
│ - Cannot be bypassed                                │
│ - STRONG security control ✅                        │
└─────────────────────────────────────────────────────┘
```

### Proposed Security Model (Single Layer)

```
┌─────────────────────────────────────────────────────┐
│ Layer 1: Frontend Gating (UX Only)                  │
│ - Shows/hides features                              │
│ - NOT a security control                            │
└───────────────────┬─────────────────────────────────┘
                    │ ❌ User bypasses in DevTools
                    ▼
┌─────────────────────────────────────────────────────┐
│ Layer 2: Tenant Isolation (Minimal RLS)             │
│ - ONLY checks tenant_id match                       │
│ - Does NOT check role, plan, or features            │
│ - CRITICAL: This MUST be correct                    │
└─────────────────────────────────────────────────────┘
```

### Attack Scenarios

#### Scenario 1: Malicious Teacher Tries to Delete Students

**Current (RLS):**
```javascript
// Teacher opens console and tries:
await supabase.from('students').delete().eq('id', 'student-123');

// RLS Policy blocks this:
// "Only admins can delete students"
// Result: Permission denied ✅
```

**Proposed (Frontend-only):**
```javascript
// Teacher opens console and tries:
await supabase.from('students').delete().eq('id', 'student-123');

// No RLS policy to stop it!
// If tenant_id matches, DELETE succeeds! ❌
// Teacher just deleted a student.
```

#### Scenario 2: Free User Tries to Access Analytics

**Current (RLS):**
```javascript
// Free user tries to query analytics table:
await supabase.from('analytics_data').select('*');

// RLS Policy checks:
// - user_has_feature('analytics.view') → false
// Result: Permission denied ✅
```

**Proposed (Frontend-only):**
```javascript
// Free user tries to query analytics table:
await supabase.from('analytics_data').select('*');

// No plan checking in RLS
// If tenant_id matches, SELECT succeeds! ❌
// Free user got paid feature data.
```

#### Scenario 3: Cross-Tenant Data Access

**Current (RLS):**
```javascript
// User from Tenant A tries to access Tenant B's data:
await supabase.from('students')
  .select('*')
  .eq('tenant_id', 'tenant-B-uuid');

// RLS Policy filters by user's tenant:
// WHERE tenant_id = get_user_tenant_id()
// Result: Empty result set ✅
```

**Proposed (Frontend-only with tenant isolation):**
```javascript
// User from Tenant A tries to access Tenant B's data:
await supabase.from('students')
  .select('*')
  .eq('tenant_id', 'tenant-B-uuid');

// RLS tenant isolation policy:
// WHERE tenant_id = jwt.app_metadata.tenant_id
// Result: Empty result set ✅ (IF policy is correct)
```

---

## 🛡️ Mitigation Strategies

If you proceed with frontend-only access control, you MUST implement these safeguards:

### 1. **Keep Minimal RLS for Tenant Isolation** (CRITICAL)

```sql
-- Apply to EVERY table without exception
CREATE POLICY "tenant_isolation" ON students
  FOR ALL USING (
    tenant_id = (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid
  );

CREATE POLICY "tenant_isolation" ON courses
  FOR ALL USING (
    tenant_id = (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid
  );

-- Repeat for EVERY table
```

**Why:** This prevents cross-tenant data leaks, the #1 risk in multi-tenant apps.

### 2. **Add Backend Validation in Edge Functions**

For critical operations (delete, create, sensitive updates):

```typescript
// edge-function: delete-student
const { data: { user } } = await supabase.auth.getUser(token);
const metadata = user.app_metadata;

// Validate role
if (!['admin', 'owner'].includes(metadata.tenant_role)) {
  return Response.json({ error: 'Forbidden' }, { status: 403 });
}

// Validate plan (if needed)
if (metadata.tenant_plan === 'free') {
  return Response.json({ error: 'Upgrade required' }, { status: 402 });
}

// Proceed with operation
```

### 3. **Implement Audit Logging**

Log all database writes to an audit table:

```sql
-- Audit log for critical operations
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  tenant_id UUID NOT NULL,
  action TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
  table_name TEXT NOT NULL,
  record_id UUID,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger on students table
CREATE OR REPLACE FUNCTION log_student_changes()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (user_id, tenant_id, action, table_name, record_id)
  VALUES (auth.uid(), NEW.tenant_id, TG_OP, TG_TABLE_NAME, NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_students
AFTER INSERT OR UPDATE OR DELETE ON students
FOR EACH ROW EXECUTE FUNCTION log_student_changes();
```

### 4. **Rate Limiting & Anomaly Detection**

```typescript
// Detect suspicious activity
// Example: User making 100 delete requests in 1 minute
// Flag account, send alert to admin
```

### 5. **Regular Security Audits**

- Automated tests for access control
- Pen testing by security experts
- Monitor audit logs for anomalies
- Review JWT sync logic regularly

### 6. **Consider Hybrid Approach** (RECOMMENDED)

Keep RLS for:
- ✅ Tenant isolation (always)
- ✅ Critical operations (delete, create)
- ✅ Sensitive data (financial, PII)

Remove RLS for:
- ✅ Read-only queries (where performance matters)
- ✅ UI-level feature gating (analytics visibility)
- ✅ Complex permission logic (easier in TypeScript)

---

## 🔄 Alternative Approaches (RECOMMENDED)

Instead of going full frontend-only, consider these hybrid options:

### Option 1: Simplified RLS (Best of Both Worlds)

**Keep RLS but make it simpler:**

```sql
-- Instead of complex role checks, use JWT claims
CREATE POLICY "check_jwt_role" ON students
  FOR DELETE USING (
    (auth.jwt() -> 'app_metadata' ->> 'tenant_role') IN ('admin', 'owner')
    AND tenant_id = (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid
  );
```

**Benefits:**
- ✅ Backend still enforces security
- ✅ Simpler than current RLS (no complex functions)
- ✅ Single source of truth (JWT)
- ✅ Keeps defense in depth

### Option 2: Edge Function Gateway

**Route ALL database access through Edge Functions:**

```typescript
// Frontend never calls supabase.from() directly
// Always goes through Edge Functions
// Edge Functions validate access before query

// Example:
export const studentAPI = {
  deleteStudent: async (id: string) => {
    // Edge function checks JWT claims
    return callEdgeFunction('delete-student', { id });
  }
};
```

**Benefits:**
- ✅ Backend validation enforced
- ✅ Complex logic in TypeScript (not SQL)
- ✅ Easy to test and debug
- ✅ Can add rate limiting, logging easily

**Drawbacks:**
- ❌ More Edge Functions to write
- ❌ Extra HTTP round-trip latency
- ❌ Higher costs (more function invocations)

### Option 3: Database Views with Permissions

**Create restricted views based on access:**

```sql
-- View for teachers (read-only students in their classes)
CREATE VIEW teachers_students AS
SELECT * FROM students
WHERE class_id IN (
  SELECT class_id FROM class_teachers WHERE teacher_id = auth.uid()
);

GRANT SELECT ON teachers_students TO authenticated;
-- No INSERT/UPDATE/DELETE grants
```

**Benefits:**
- ✅ Database enforces permissions
- ✅ Cleaner than RLS policies
- ✅ Easy to understand
- ✅ Good performance

---

## 📊 Recommendation Matrix

| Approach | Security | Complexity | Performance | Recommended? |
|----------|----------|------------|-------------|--------------|
| **Current (RLS + Frontend)** | ⭐⭐⭐⭐⭐ | ⭐⭐ (hard) | ⭐⭐⭐ (decent) | ✅ For high-security needs |
| **Frontend-Only (No RLS)** | ⭐ (dangerous) | ⭐⭐⭐⭐⭐ (easy) | ⭐⭐⭐⭐⭐ (fast) | ❌ NOT recommended |
| **Frontend + Tenant RLS** | ⭐⭐⭐ (moderate) | ⭐⭐⭐⭐ (easier) | ⭐⭐⭐⭐ (fast) | ⚠️ Acceptable for low-risk |
| **Simplified RLS (JWT)** | ⭐⭐⭐⭐ (good) | ⭐⭐⭐⭐ (easier) | ⭐⭐⭐⭐ (fast) | ✅ **RECOMMENDED** |
| **Edge Function Gateway** | ⭐⭐⭐⭐ (good) | ⭐⭐⭐ (moderate) | ⭐⭐ (slower) | ✅ For complex logic |
| **Database Views** | ⭐⭐⭐⭐ (good) | ⭐⭐⭐⭐ (easier) | ⭐⭐⭐⭐⭐ (fast) | ✅ For read-heavy apps |

---

## 🎯 Final Recommendation

### ⚠️ DO NOT go fully frontend-only

**Reasons:**
1. ❌ Unacceptable security risk for a school management system
2. ❌ Handles sensitive student/financial data
3. ❌ Compliance issues (FERPA, GDPR, etc.)
4. ❌ Reputational damage if breach occurs
5. ❌ Frontend is trivially bypassable

### ✅ INSTEAD: Use Simplified RLS with JWT

**Proposed Hybrid Approach:**

```sql
-- Tenant isolation (ALWAYS enforced)
CREATE POLICY "tenant_isolation" ON {table}
  FOR ALL USING (
    tenant_id = (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid
  );

-- Role-based access (simplified with JWT)
CREATE POLICY "role_based_delete" ON students
  FOR DELETE USING (
    tenant_id = (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid
    AND (auth.jwt() -> 'app_metadata' ->> 'tenant_role') IN ('admin', 'owner')
  );

CREATE POLICY "role_based_insert" ON students
  FOR INSERT WITH CHECK (
    tenant_id = (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid
    AND (auth.jwt() -> 'app_metadata' ->> 'tenant_plan') != 'free'
    AND (auth.jwt() -> 'app_metadata' ->> 'tenant_role') IN ('admin', 'owner')
  );
```

**This gives you:**
- ✅ **Simplified RLS** (easier than current complex policies)
- ✅ **Single source of truth** (JWT claims)
- ✅ **Backend security** (database enforced)
- ✅ **Better DX** (TypeScript for complex UI logic)
- ✅ **Good performance** (no extra API calls)
- ✅ **Compliance ready** (proper access controls)

---

## 📝 Implementation Roadmap (If You Proceed with Simplified RLS)

### Week 1: JWT Infrastructure
- [ ] Create JWT sync functions
- [ ] Add triggers to update auth.users metadata
- [ ] Backfill existing users
- [ ] Test JWT claims update on role/plan changes

### Week 2: Simplified RLS Policies
- [ ] Replace complex RLS functions with JWT-based checks
- [ ] Test each policy thoroughly
- [ ] Document the new policy patterns
- [ ] Create migration scripts

### Week 3: Frontend Integration
- [ ] Update AccessContext to read JWT directly
- [ ] Remove `get-access-data` API call
- [ ] Add JWT parsing utility
- [ ] Test access control UI updates

### Week 4: Testing & Validation
- [ ] Security audit
- [ ] Pen testing
- [ ] Performance testing
- [ ] User acceptance testing

---

## 🤔 Questions to Consider

Before making this decision, answer these:

1. **What is your risk tolerance?**
   - Handling sensitive student data?
   - Financial data (fees, payments)?
   - Compliance requirements (FERPA, GDPR)?

2. **What is the primary pain point?**
   - RLS is too complex?
   - Too slow?
   - Hard to maintain sync?

3. **What is your scale?**
   - 10 schools or 10,000?
   - If breach occurs, what's the impact?

4. **Do you have security expertise?**
   - Can you properly audit frontend-only approach?
   - Can you respond to incidents?

5. **What do similar products do?**
   - Most SaaS products use backend enforcement
   - Frontend-only is rare for good reason

---

## 📚 Additional Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP Access Control Guidelines](https://owasp.org/www-project-web-security-testing-guide/)
- [Defense in Depth Strategy](https://en.wikipedia.org/wiki/Defense_in_depth_(computing))

---

## 🎤 Conclusion

The current RLS complexity is a valid concern, but **frontend-only access control is not the solution** for a school management system handling sensitive data.

**Recommended Path Forward:**
1. ✅ Implement JWT sync infrastructure
2. ✅ Simplify RLS policies to use JWT claims (not complex functions)
3. ✅ Keep tenant isolation and critical operation enforcement
4. ✅ Use frontend gating for UX/features (current approach)
5. ✅ Consider Edge Function gateway for complex operations

This gives you **90% of the simplicity benefits** with **minimal security trade-offs**.

---

**Status:** ❌ Implementation PAUSED pending decision
**Decision Required:** Choose between:
- Option A: Proceed with Simplified RLS (Recommended)
- Option B: Full frontend-only (Not recommended)
- Option C: Stay with current approach
- Option D: Hybrid with Edge Function gateway

