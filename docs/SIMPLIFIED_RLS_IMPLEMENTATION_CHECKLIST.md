# ✅ Simplified RLS with JWT - Implementation Checklist

Quick reference checklist for implementing Option 2 (Simplified RLS with JWT) in the frontend.

---

## 📋 Pre-Implementation

### Backend Prerequisites (Must be done first!)

- [ ] **JWT Sync System Deployed**
  - [ ] Triggers on `tenant_members` table
  - [ ] Triggers on `tenants` table
  - [ ] Triggers on `tenant_features` table
  - [ ] Helper functions: `get_plan_features()`, `get_role_capabilities()`
  - [ ] `sync_user_jwt_claims()` function working
  - [ ] Backfill script run for existing users

- [ ] **Verify JWT Contains Data**
  ```bash
  # Test with a real user
  psql -c "SELECT raw_app_meta_data FROM auth.users WHERE email = 'test@example.com';"
  
  # Should show:
  # {
  #   "tenant_id": "...",
  #   "tenant_role": "admin",
  #   "tenant_plan": "growth",
  #   "features": [...],
  #   "capabilities": [...]
  # }
  ```
  - [ ] JWT has `tenant_id`
  - [ ] JWT has `tenant_role`
  - [ ] JWT has `tenant_plan`
  - [ ] JWT has `features` array
  - [ ] JWT has `capabilities` array

- [ ] **Simplified RLS Policies Deployed** (Optional but recommended)
  - [ ] Helper functions: `get_jwt_tenant_id()`, `get_jwt_role()`, `get_jwt_plan()`
  - [ ] New policies created (parallel to old ones)
  - [ ] Policies tested with sample users

---

## 🛠️ Implementation Steps

### Step 1: Create JWT Utility (30 minutes)

- [ ] **Create file:** `src/lib/jwtUtils.ts`
- [ ] **Copy code from:** `SIMPLIFIED_RLS_CODE_COMPARISON.md`
- [ ] **Add these functions:**
  - [ ] `parseJWT(token: string): JWTPayload`
  - [ ] `isJWTExpired(token: string): boolean`
  - [ ] `getJWTExpiration(token: string): Date | null`
  - [ ] `debugJWT(token: string): void`
- [ ] **Save file**

#### Test JWT Parser
```typescript
// In browser console or test file
import { parseJWT, debugJWT } from '@/lib/jwtUtils';
import { supabase } from '@/lib/supabase';

const { data: { user } } = await supabase.auth.getUser();
debugJWT(user.access_token);
```

- [ ] **Verify output shows:**
  - [ ] `tenant_id`
  - [ ] `tenant_role`
  - [ ] `tenant_plan`
  - [ ] `features` array
  - [ ] `capabilities` array

---

### Step 2: Update AccessContext (1 hour)

- [ ] **Open file:** `src/context/AccessContext.tsx`
- [ ] **Backup current code** (comment it out or save copy)

#### Changes to make:

##### A. Update Imports
- [ ] **Add:** `import { parseJWT } from '../lib/jwtUtils';`
- [ ] **Remove/Comment:** `import { getAccessData } from '../lib/supabase-api';`

##### B. Update Context Interface
```typescript
// Change from:
initializeAccess: () => Promise<void>;
refreshAccess: () => Promise<void>;

// To:
initializeAccess: () => void;
refreshAccess: () => void;
```
- [ ] Remove `Promise<void>` return type (now synchronous)

##### C. Replace initializeAccess Function
- [ ] **Remove:** All API call logic (~100 lines)
- [ ] **Remove:** Timeout logic
- [ ] **Remove:** Retry logic
- [ ] **Add:** JWT parsing logic (~50 lines)
- [ ] **Keep:** Guest user fast path (unchanged)
- [ ] **Keep:** Error handling (but simplified)

##### D. Add Token Refresh Listener (Optional)
```typescript
useEffect(() => {
  if (!user) return;
  
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      if (event === 'TOKEN_REFRESHED') {
        initializeAccess();
      }
    }
  );
  
  return () => subscription.unsubscribe();
}, [user, initializeAccess]);
```
- [ ] Add token refresh listener

##### E. Update refreshAccess
```typescript
const refreshAccess = useCallback(() => {
  initializeAccess(); // No longer async
}, [initializeAccess]);
```
- [ ] Remove `async`/`await`

- [ ] **Save file**

#### Test AccessContext
```typescript
// In your app, temporarily add:
function DebugAccess() {
  const access = useAccess();
  console.log('Access State:', access);
  return null;
}

// Add to App.tsx:
<AccessProvider>
  <DebugAccess />
  {/* rest of app */}
</AccessProvider>
```

- [ ] **Verify console shows:**
  - [ ] Correct `plan`
  - [ ] Correct `role`
  - [ ] Non-empty `features` array
  - [ ] Non-empty `capabilities` array
  - [ ] `isInitialized: true`
  - [ ] `isLoading: false`

---

### Step 3: Update supabase-api.ts (10 minutes)

- [ ] **Open file:** `src/lib/supabase-api.ts`
- [ ] **Find function:** `export async function getAccessData()`

#### Option A: Deprecate (Recommended for migration)
```typescript
/**
 * @deprecated Use parseJWT from jwtUtils.ts instead
 */
export async function getAccessData() {
  console.warn('⚠️ getAccessData() is deprecated');
  return callEdgeFunctionGet('get-access-data', {});
}
```
- [ ] Add deprecation warning
- [ ] Keep function for now

#### Option B: Remove (After validation)
- [ ] Delete function entirely
- [ ] Remove from exports

- [ ] **Save file**

---

### Step 4: Update Tests (1 hour)

#### Find Test Files
```bash
# Find all test files that might be affected
find src -name "*.test.ts*" | grep -E "(Access|auth)" 
```

#### For Each Test File:

- [ ] **AccessContext.test.tsx** (if exists)
  - [ ] Replace `getAccessData` mock with `parseJWT` mock
  - [ ] Update mock JWT structure
  - [ ] Test guest user flow
  - [ ] Test authenticated user flow
  - [ ] Test JWT parse error handling

- [ ] **Auth-related component tests**
  - [ ] Update any mocks that relied on `getAccessData`
  - [ ] Add JWT mock data

#### Example Test Update:
```typescript
// Before:
jest.mock('../lib/supabase-api', () => ({
  getAccessData: jest.fn().mockResolvedValue({
    plan: 'growth',
    role: 'admin',
  }),
}));

// After:
jest.mock('../lib/jwtUtils', () => ({
  parseJWT: jest.fn().mockReturnValue({
    app_metadata: {
      tenant_plan: 'growth',
      tenant_role: 'admin',
      features: ['analytics.view'],
      capabilities: ['students.create'],
    },
  }),
}));
```

- [ ] **Run tests:** `npm test` or `yarn test`
- [ ] **Verify all pass**

---

### Step 5: Local Testing (1 hour)

#### Test Scenario 1: Fresh Login
- [ ] Log out completely
- [ ] Clear browser storage
- [ ] Log in with admin account
- [ ] Open DevTools console
- [ ] Verify: "✅ Access data loaded from JWT" message
- [ ] Verify: Correct role/plan shown
- [ ] Verify: Admin features visible
- [ ] Verify: No errors in console

#### Test Scenario 2: Different Roles
- [ ] Test as Owner → Should see billing options
- [ ] Test as Admin → Should see admin features
- [ ] Test as Teacher → Should see limited features
- [ ] Test as Student → Should see student portal only
- [ ] Test as Finance → Should see fees only

#### Test Scenario 3: Different Plans
- [ ] Test Free plan → Read-only, no analytics
- [ ] Test Starter plan → CRUD ops work, no analytics
- [ ] Test Growth plan → Analytics visible

#### Test Scenario 4: Feature Gating
```typescript
// Test in a component
const hasAnalytics = useFeature('analytics.view');
const canCreateStudents = useCan('students.create');

console.log('Has Analytics:', hasAnalytics);
console.log('Can Create Students:', canCreateStudents);
```
- [ ] Free plan user: both should be false
- [ ] Growth admin: both should be true

#### Test Scenario 5: RLS Enforcement (Backend)
```javascript
// In browser console, try to bypass frontend:
await supabase.from('students').delete().eq('id', 'some-id');
```
- [ ] **Free plan user:** Should fail (RLS blocks)
- [ ] **Teacher:** Should fail (RLS blocks)
- [ ] **Admin on Starter:** Should succeed
- [ ] Verify backend still enforces rules

#### Test Scenario 6: Token Refresh
- [ ] Trigger manual refresh: `await supabase.auth.refreshSession()`
- [ ] Verify: AccessContext re-parses JWT
- [ ] Verify: UI updates if access changed
- [ ] Or wait ~60 minutes for auto-refresh

---

### Step 6: Code Review (30 minutes)

- [ ] **Review changes with team**
  - [ ] Security implications understood
  - [ ] Error handling adequate
  - [ ] Fallback behavior correct

- [ ] **Check code quality**
  - [ ] TypeScript types correct
  - [ ] No lint errors: `npm run lint`
  - [ ] No type errors: `npm run type-check`
  - [ ] Proper error messages

- [ ] **Documentation**
  - [ ] Code comments added
  - [ ] README updated if needed
  - [ ] Team notified of changes

---

## 🚀 Deployment

### Pre-Deployment Checklist

- [ ] All tests pass locally
- [ ] Manual testing completed
- [ ] Code reviewed and approved
- [ ] Backend prerequisites confirmed
- [ ] Rollback plan ready
- [ ] Monitoring setup

### Deploy to Staging

- [ ] **Create feature branch**
  ```bash
  git checkout -b feature/simplified-rls-jwt
  git add .
  git commit -m "feat(access): Implement simplified RLS with JWT parsing"
  git push origin feature/simplified-rls-jwt
  ```

- [ ] **Create PR**
  - [ ] Add description
  - [ ] Link to design docs
  - [ ] Request reviews

- [ ] **Deploy to staging**
  - [ ] Merge to staging branch
  - [ ] Wait for deployment
  - [ ] Verify deployment successful

### Staging Validation

- [ ] **Smoke tests**
  - [ ] Login works
  - [ ] Access data loads
  - [ ] Features gate correctly
  - [ ] No console errors

- [ ] **Full regression**
  - [ ] All user roles work
  - [ ] All plan tiers work
  - [ ] All features gate correctly
  - [ ] Performance acceptable

- [ ] **Monitor errors**
  - [ ] Check error logs
  - [ ] Check Sentry/monitoring
  - [ ] No new errors

### Deploy to Production

- [ ] **Final checks**
  - [ ] Staging working perfectly
  - [ ] Team approval
  - [ ] Rollback plan confirmed

- [ ] **Deploy**
  ```bash
  git checkout main
  git merge feature/simplified-rls-jwt
  git push origin main
  ```

- [ ] **Monitor closely**
  - [ ] Watch deployment
  - [ ] Check error rates
  - [ ] Monitor user reports
  - [ ] Check analytics

- [ ] **Validate production**
  - [ ] Test with real account
  - [ ] Verify access data correct
  - [ ] Check multiple user types
  - [ ] Monitor for 1 hour

---

## 🔍 Post-Deployment Validation

### Day 1: Immediate Checks (First hour)

- [ ] **Error monitoring**
  - [ ] No spike in errors
  - [ ] No JWT parse errors
  - [ ] No access control failures

- [ ] **Performance**
  - [ ] Page load times normal or better
  - [ ] No new slow queries
  - [ ] Edge Function calls reduced

- [ ] **User reports**
  - [ ] No user complaints
  - [ ] No access issues
  - [ ] Features working

### Day 1-3: Short-term Monitoring

- [ ] **Daily error check**
  - [ ] Review error logs
  - [ ] Check for patterns
  - [ ] Fix any issues

- [ ] **User feedback**
  - [ ] Monitor support tickets
  - [ ] Check user reports
  - [ ] Address concerns

### Week 1: Validation

- [ ] **Metrics review**
  - [ ] Compare before/after
  - [ ] Performance improved?
  - [ ] Error rate same or lower?
  - [ ] Cost savings?

- [ ] **Team feedback**
  - [ ] Easier to debug?
  - [ ] Less complexity?
  - [ ] Any issues?

---

## 🧹 Cleanup (After 1-2 weeks)

### Once Everything is Stable:

- [ ] **Remove deprecated code**
  - [ ] Delete `getAccessData()` from `supabase-api.ts`
  - [ ] Remove old commented code from `AccessContext.tsx`
  - [ ] Update any remaining references

- [ ] **Backend cleanup**
  - [ ] Remove old RLS policies (if replaced)
  - [ ] Remove old helper functions
  - [ ] Keep only JWT-based policies

- [ ] **Documentation**
  - [ ] Update architecture docs
  - [ ] Update onboarding docs
  - [ ] Archive old implementation docs

- [ ] **Final validation**
  - [ ] Run full test suite
  - [ ] Verify everything still works
  - [ ] Commit cleanup changes

---

## 🔄 Rollback Procedure

### If Issues Arise:

#### Emergency Rollback (< 5 minutes)

**In AccessContext.tsx:**
```typescript
// 1. Comment out JWT parsing
// const jwt = parseJWT(token);

// 2. Uncomment old API call
import { getAccessData } from '../lib/supabase-api';
const remote = await getAccessData();
setState(remote);
```

**Deploy:**
```bash
git add src/context/AccessContext.tsx
git commit -m "fix: Rollback to API-based access data"
git push origin main
```

- [ ] Make changes
- [ ] Commit
- [ ] Deploy
- [ ] Verify rollback successful

#### Full Rollback (< 30 minutes)

```bash
# Revert commits
git log  # Find commit hash before changes
git revert <commit-hash>

# Or reset
git reset --hard <previous-commit>
git push origin main --force  # Only if necessary

# Redeploy
```

- [ ] Revert changes
- [ ] Redeploy
- [ ] Verify old version working
- [ ] Investigate issue
- [ ] Plan retry

---

## 📊 Success Metrics

### Track These Metrics:

#### Performance
- [ ] **Initial load time:** Should be faster (no API call)
  - Before: ~200-500ms for access data
  - After: ~1-10ms for JWT parsing
  - Expected: 10-50x improvement

- [ ] **Edge Function calls:** Should be reduced
  - Before: 1 call per login + refresh
  - After: 0 calls for access data
  - Expected: ~50% reduction in function calls

#### Developer Experience
- [ ] **Debug time:** Easier (inspect JWT vs API calls)
- [ ] **Bug reports:** Should decrease
- [ ] **New feature velocity:** Should increase

#### Cost
- [ ] **Edge Function costs:** Should decrease
  - Track: Function invocations
  - Expected: 30-50% reduction

---

## ❓ Troubleshooting

### Issue: JWT doesn't have app_metadata

**Symptom:** `jwt.app_metadata` is undefined or empty

**Cause:** Backend JWT sync not working

**Fix:**
1. Check backend triggers are deployed
2. Manually trigger sync for test user:
   ```sql
   SELECT sync_user_jwt_claims() 
   FROM tenant_members 
   WHERE user_id = '<user-id>';
   ```
3. Force user to re-login

### Issue: Access data is wrong

**Symptom:** User has wrong role/plan/features

**Cause:** JWT has stale data

**Fix:**
1. Check when user last logged in
2. Force token refresh: `await supabase.auth.refreshSession()`
3. Verify JWT updated: `debugJWT(token)`

### Issue: Features not gating correctly

**Symptom:** User sees features they shouldn't

**Cause:** Frontend logic error or JWT has wrong data

**Fix:**
1. Inspect JWT: `debugJWT(token)`
2. Check feature list matches plan
3. Verify `useFeature()` hook logic
4. Check component using correct hook

### Issue: RLS still blocking queries

**Symptom:** User gets "permission denied" errors

**Cause:** RLS policies too strict or not updated

**Fix:**
1. Check RLS policies reading from JWT correctly
2. Verify JWT has correct role/plan
3. Test with `SET request.jwt.claims = ...` in psql
4. Update RLS policies if needed

---

## 📚 Reference Links

- **Main Analysis:** `FRONTEND_ONLY_ACCESS_CONTROL_IDEATION.md`
- **Decision Guide:** `ACCESS_CONTROL_DECISION_SUMMARY.md`
- **Code Comparison:** `SIMPLIFIED_RLS_CODE_COMPARISON.md`
- **Full Walkthrough:** `SIMPLIFIED_RLS_FRONTEND_WALKTHROUGH.md`
- **Index:** `ACCESS_CONTROL_ANALYSIS_README.md`

---

## ✅ Final Checklist

Before marking as complete:

- [ ] All code changes implemented
- [ ] All tests passing
- [ ] Deployed to production
- [ ] Monitoring showing no issues
- [ ] Performance improved
- [ ] Team trained on new approach
- [ ] Documentation updated
- [ ] Old code cleaned up (after validation period)

---

**Status:** 📋 Ready to Start  
**Estimated Time:** 1 week  
**Risk Level:** 🟡 Medium  
**Rollback Time:** 5 minutes  

**Last Updated:** 2026-01-12

