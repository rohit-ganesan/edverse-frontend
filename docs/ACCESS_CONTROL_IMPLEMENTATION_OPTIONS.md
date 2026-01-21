# 🔧 Access Control Implementation Options - Code Examples

This document provides concrete implementation code for each access control approach discussed in the ideation document.

---

## Option 1: Frontend-Only (NOT RECOMMENDED)

### Implementation Steps

#### Step 1: Create JWT Sync System

```sql
-- File: supabase/migrations/002_jwt_sync_system.sql

-- Function to get plan features as array
CREATE OR REPLACE FUNCTION get_plan_features(plan_name TEXT)
RETURNS TEXT[] AS $$
BEGIN
  RETURN CASE plan_name
    WHEN 'free' THEN ARRAY[
      'students.view','courses.view','classes.view',
      'attendance.view','results.view','notices.view','fees.view',
      'staff.invite','org.manage','settings.integrations'
    ]
    WHEN 'starter' THEN ARRAY[
      'students.view','courses.view','classes.view',
      'attendance.view','results.view','notices.view','fees.view',
      'students.create','students.update','students.delete',
      'courses.create','courses.update','courses.delete',
      'classes.create','classes.update','classes.delete','classes.reschedule',
      'attendance.record','attendance.import',
      'results.enter','results.publish','results.export',
      'notices.send','fees.record_manual','fees.export',
      'staff.invite','org.manage','settings.integrations',
      'portal.parent','portal.student'
    ]
    WHEN 'growth' THEN ARRAY[
      'students.view','courses.view','classes.view',
      'attendance.view','results.view','notices.view','fees.view',
      'students.create','students.update','students.delete',
      'courses.create','courses.update','courses.delete',
      'classes.create','classes.update','classes.delete','classes.reschedule',
      'attendance.record','attendance.import',
      'results.enter','results.publish','results.export',
      'notices.send','fees.record_manual','fees.export',
      'staff.invite','org.manage','settings.integrations',
      'portal.parent','portal.student','analytics.view'
    ]
    ELSE ARRAY['students.view','courses.view'] -- fallback
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to get role capabilities as array
CREATE OR REPLACE FUNCTION get_role_capabilities(role_name TEXT)
RETURNS TEXT[] AS $$
BEGIN
  RETURN CASE role_name
    WHEN 'owner' THEN ARRAY[
      'students.view','students.create','students.update','students.delete',
      'courses.view','courses.create','courses.update','courses.delete',
      'classes.view','classes.create','classes.update','classes.delete','classes.reschedule',
      'attendance.view','attendance.record','attendance.import',
      'results.view','results.enter','results.publish','results.export',
      'notices.view','notices.send',
      'fees.view','fees.record_manual','fees.export',
      'staff.invite','org.manage','settings.integrations','billing.manage'
    ]
    WHEN 'admin' THEN ARRAY[
      'students.view','students.create','students.update','students.delete',
      'courses.view','courses.create','courses.update','courses.delete',
      'classes.view','classes.create','classes.update','classes.delete','classes.reschedule',
      'attendance.view','attendance.record','attendance.import',
      'results.view','results.enter','results.publish','results.export',
      'notices.view','notices.send',
      'fees.view','fees.record_manual','fees.export',
      'staff.invite','org.manage','settings.integrations'
    ]
    WHEN 'teacher' THEN ARRAY[
      'classes.view','attendance.view','attendance.record',
      'results.view','results.enter','notices.view','notices.send',
      'students.view','courses.view','fees.view'
    ]
    WHEN 'finance' THEN ARRAY['fees.view','fees.record_manual','fees.export']
    WHEN 'parent' THEN ARRAY[
      'portal.parent','portal.parent.attendance.view',
      'portal.parent.results.view','portal.parent.notices.view'
    ]
    WHEN 'student' THEN ARRAY[
      'portal.student','portal.student.courses.view',
      'portal.student.results.view','portal.student.attendance.view',
      'portal.student.notices.view'
    ]
    ELSE ARRAY[]::TEXT[] -- empty for unknown roles
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Main function to sync user JWT claims
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

-- Function to sync when tenant plan changes
CREATE OR REPLACE FUNCTION sync_tenant_jwt_claims()
RETURNS TRIGGER AS $$
BEGIN
  -- Update all active members' JWT claims
  PERFORM sync_user_jwt_claims()
  FROM tenant_members
  WHERE tenant_id = NEW.id AND status = 'active';

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on tenants
CREATE TRIGGER sync_jwt_on_tenant_change
AFTER UPDATE OF plan, trial_ends_at ON tenants
FOR EACH ROW
EXECUTE FUNCTION sync_tenant_jwt_claims();

-- Backfill existing users
DO $$
DECLARE
  member_record RECORD;
BEGIN
  FOR member_record IN 
    SELECT * FROM tenant_members WHERE status = 'active'
  LOOP
    PERFORM sync_user_jwt_claims() FROM tenant_members 
    WHERE id = member_record.id;
  END LOOP;
END $$;
```

#### Step 2: Disable RLS (Dangerous!)

```sql
-- File: supabase/migrations/003_disable_rls.sql
-- ⚠️ WARNING: This removes backend security enforcement

ALTER TABLE students DISABLE ROW LEVEL SECURITY;
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE classes DISABLE ROW LEVEL SECURITY;
ALTER TABLE attendance DISABLE ROW LEVEL SECURITY;
ALTER TABLE grades DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE assignments DISABLE ROW LEVEL SECURITY;
ALTER TABLE submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE events DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can read own profile or admin can read any" ON users;
DROP POLICY IF EXISTS "Instructors can read student data" ON students;
-- ... (drop all policies)
```

#### Step 3: Update Frontend AccessContext

```typescript
// File: src/context/AccessContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Plan, Role, Capability } from '../types/access';
import { useAuth } from '../features/auth/AuthContext';
import { parseJWT } from '../lib/jwtUtils';
import { ROLE_CAPS } from '../types/access';

export type AccessState = {
  plan: Plan;
  role: Role;
  features: string[];
  capabilities: Capability[];
  isLoading: boolean;
  isInitialized: boolean;
  trial_ends_at: string | null;
  tenant_name: string | null;
  tenant_id: string | null;
};

const DEFAULT_ACCESS: AccessState = {
  plan: 'free',
  role: 'student',
  features: [],
  capabilities: [],
  isLoading: false,
  isInitialized: false,
  trial_ends_at: null,
  tenant_name: null,
  tenant_id: null,
};

const AccessContext = createContext<AccessState>(DEFAULT_ACCESS);

export function AccessProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AccessState>(DEFAULT_ACCESS);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setState({
        ...DEFAULT_ACCESS,
        isInitialized: true,
      });
      return;
    }

    try {
      // Get the access token from Supabase session
      const token = user.access_token || (user as any).token;
      
      if (!token) {
        console.warn('No access token found');
        setState({
          ...DEFAULT_ACCESS,
          isInitialized: true,
        });
        return;
      }

      // Parse JWT to extract app_metadata
      const jwt = parseJWT(token);
      const metadata = jwt.app_metadata || {};

      setState({
        plan: metadata.tenant_plan || 'free',
        role: metadata.tenant_role || 'student',
        features: metadata.features || [],
        capabilities: metadata.capabilities || ROLE_CAPS[metadata.tenant_role] || [],
        trial_ends_at: metadata.trial_ends_at || null,
        tenant_name: metadata.tenant_name || null,
        tenant_id: metadata.tenant_id || null,
        isLoading: false,
        isInitialized: true,
      });

      console.log('Access data loaded from JWT:', {
        plan: metadata.tenant_plan,
        role: metadata.tenant_role,
        featuresCount: metadata.features?.length || 0,
      });
    } catch (error) {
      console.error('Error parsing JWT:', error);
      setState({
        ...DEFAULT_ACCESS,
        isInitialized: true,
      });
    }
  }, [user, user?.access_token]);

  return (
    <AccessContext.Provider value={state}>
      {children}
    </AccessContext.Provider>
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

#### Step 4: Create JWT Parser Utility

```typescript
// File: src/lib/jwtUtils.ts

export interface JWTPayload {
  sub: string; // user_id
  email?: string;
  role: string; // 'authenticated'
  aud: string;
  iat?: number;
  exp?: number;
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
 * Parse and decode a JWT token (without verification)
 * Note: This only decodes the payload. Supabase validates the signature.
 */
export function parseJWT(token: string): JWTPayload {
  try {
    // Split the token into parts
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }

    // Decode the payload (second part)
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // Decode base64 and parse JSON
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to parse JWT:', error);
    throw new Error('Invalid JWT token');
  }
}

/**
 * Check if JWT is expired
 */
export function isJWTExpired(token: string): boolean {
  try {
    const jwt = parseJWT(token);
    if (!jwt.exp) return false;
    
    const now = Math.floor(Date.now() / 1000);
    return jwt.exp < now;
  } catch {
    return true;
  }
}

/**
 * Get token expiration time
 */
export function getJWTExpiration(token: string): Date | null {
  try {
    const jwt = parseJWT(token);
    if (!jwt.exp) return null;
    return new Date(jwt.exp * 1000);
  } catch {
    return null;
  }
}
```

---

## Option 2: Simplified RLS with JWT (RECOMMENDED)

This keeps backend security but simplifies the RLS policies by reading from JWT claims.

### Implementation Steps

#### Step 1: Create JWT Sync System (Same as Option 1)

Use the same JWT sync code from Option 1 Step 1.

#### Step 2: Create Simplified RLS Policies

```sql
-- File: supabase/migrations/004_simplified_rls.sql

-- Drop all existing complex policies and helper functions
DROP POLICY IF EXISTS "Users can read own profile or admin can read any" ON users;
DROP POLICY IF EXISTS "Instructors can read student data" ON students;
-- ... drop all existing policies

DROP FUNCTION IF EXISTS get_user_role(UUID);
DROP FUNCTION IF EXISTS is_authenticated();
DROP FUNCTION IF EXISTS is_admin();
DROP FUNCTION IF EXISTS is_instructor();
DROP FUNCTION IF EXISTS is_student();
DROP FUNCTION IF EXISTS is_instructor_or_admin();

-- Helper function to get tenant_id from JWT
CREATE OR REPLACE FUNCTION get_jwt_tenant_id()
RETURNS UUID AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true)::json->'app_metadata'->>'tenant_id', '')::uuid;
$$ LANGUAGE sql STABLE;

-- Helper function to get role from JWT
CREATE OR REPLACE FUNCTION get_jwt_role()
RETURNS TEXT AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true)::json->'app_metadata'->>'tenant_role', '');
$$ LANGUAGE sql STABLE;

-- Helper function to get plan from JWT
CREATE OR REPLACE FUNCTION get_jwt_plan()
RETURNS TEXT AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true)::json->'app_metadata'->>'tenant_plan', '');
$$ LANGUAGE sql STABLE;

-- =====================================================
-- STUDENTS TABLE - SIMPLIFIED POLICIES
-- =====================================================

-- Everyone can read students in their tenant
CREATE POLICY "tenant_students_select" ON students
  FOR SELECT USING (
    tenant_id = get_jwt_tenant_id()
  );

-- Only admin/owner can create students, and only on Starter+ plans
CREATE POLICY "tenant_students_insert" ON students
  FOR INSERT WITH CHECK (
    tenant_id = get_jwt_tenant_id()
    AND get_jwt_role() IN ('admin', 'owner')
    AND get_jwt_plan() IN ('starter', 'growth')
  );

-- Only admin/owner can update students
CREATE POLICY "tenant_students_update" ON students
  FOR UPDATE USING (
    tenant_id = get_jwt_tenant_id()
    AND get_jwt_role() IN ('admin', 'owner')
  );

-- Only admin/owner can delete students, and only on Starter+ plans
CREATE POLICY "tenant_students_delete" ON students
  FOR DELETE USING (
    tenant_id = get_jwt_tenant_id()
    AND get_jwt_role() IN ('admin', 'owner')
    AND get_jwt_plan() IN ('starter', 'growth')
  );

-- =====================================================
-- COURSES TABLE - SIMPLIFIED POLICIES
-- =====================================================

CREATE POLICY "tenant_courses_select" ON courses
  FOR SELECT USING (
    tenant_id = get_jwt_tenant_id()
  );

CREATE POLICY "tenant_courses_insert" ON courses
  FOR INSERT WITH CHECK (
    tenant_id = get_jwt_tenant_id()
    AND get_jwt_role() IN ('admin', 'owner', 'teacher')
    AND get_jwt_plan() IN ('starter', 'growth')
  );

CREATE POLICY "tenant_courses_update" ON courses
  FOR UPDATE USING (
    tenant_id = get_jwt_tenant_id()
    AND (
      get_jwt_role() IN ('admin', 'owner')
      OR (get_jwt_role() = 'teacher' AND instructor_id = auth.uid())
    )
  );

CREATE POLICY "tenant_courses_delete" ON courses
  FOR DELETE USING (
    tenant_id = get_jwt_tenant_id()
    AND get_jwt_role() IN ('admin', 'owner')
    AND get_jwt_plan() IN ('starter', 'growth')
  );

-- =====================================================
-- CLASSES TABLE - SIMPLIFIED POLICIES
-- =====================================================

CREATE POLICY "tenant_classes_select" ON classes
  FOR SELECT USING (
    tenant_id = get_jwt_tenant_id()
  );

CREATE POLICY "tenant_classes_insert" ON classes
  FOR INSERT WITH CHECK (
    tenant_id = get_jwt_tenant_id()
    AND get_jwt_role() IN ('admin', 'owner')
    AND get_jwt_plan() IN ('starter', 'growth')
  );

CREATE POLICY "tenant_classes_update" ON classes
  FOR UPDATE USING (
    tenant_id = get_jwt_tenant_id()
    AND get_jwt_role() IN ('admin', 'owner', 'teacher')
  );

CREATE POLICY "tenant_classes_delete" ON classes
  FOR DELETE USING (
    tenant_id = get_jwt_tenant_id()
    AND get_jwt_role() IN ('admin', 'owner')
    AND get_jwt_plan() IN ('starter', 'growth')
  );

-- =====================================================
-- ATTENDANCE TABLE - SIMPLIFIED POLICIES
-- =====================================================

CREATE POLICY "tenant_attendance_select" ON attendance
  FOR SELECT USING (
    tenant_id = get_jwt_tenant_id()
  );

CREATE POLICY "tenant_attendance_insert" ON attendance
  FOR INSERT WITH CHECK (
    tenant_id = get_jwt_tenant_id()
    AND get_jwt_role() IN ('admin', 'owner', 'teacher')
    AND get_jwt_plan() IN ('starter', 'growth')
  );

CREATE POLICY "tenant_attendance_update" ON attendance
  FOR UPDATE USING (
    tenant_id = get_jwt_tenant_id()
    AND get_jwt_role() IN ('admin', 'owner', 'teacher')
  );

CREATE POLICY "tenant_attendance_delete" ON attendance
  FOR DELETE USING (
    tenant_id = get_jwt_tenant_id()
    AND get_jwt_role() IN ('admin', 'owner')
  );

-- =====================================================
-- NOTIFICATIONS TABLE - SIMPLIFIED POLICIES
-- =====================================================

CREATE POLICY "tenant_notifications_select" ON notifications
  FOR SELECT USING (
    tenant_id = get_jwt_tenant_id()
  );

CREATE POLICY "tenant_notifications_insert" ON notifications
  FOR INSERT WITH CHECK (
    tenant_id = get_jwt_tenant_id()
    AND get_jwt_role() IN ('admin', 'owner', 'teacher')
  );

CREATE POLICY "tenant_notifications_update" ON notifications
  FOR UPDATE USING (
    tenant_id = get_jwt_tenant_id()
    AND get_jwt_role() IN ('admin', 'owner')
  );

CREATE POLICY "tenant_notifications_delete" ON notifications
  FOR DELETE USING (
    tenant_id = get_jwt_tenant_id()
    AND get_jwt_role() IN ('admin', 'owner')
  );

-- =====================================================
-- GRANTS FOR HELPER FUNCTIONS
-- =====================================================

GRANT EXECUTE ON FUNCTION get_jwt_tenant_id() TO authenticated;
GRANT EXECUTE ON FUNCTION get_jwt_role() TO authenticated;
GRANT EXECUTE ON FUNCTION get_jwt_plan() TO authenticated;

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';
```

#### Step 3: Update Frontend (Same as Option 1)

Use the same AccessContext and jwtUtils from Option 1.

#### Step 4: Test RLS Enforcement

```sql
-- File: supabase/test_simplified_rls.sql

-- Test as a teacher (should fail to delete)
BEGIN;
  SET request.jwt.claims = '{
    "sub": "user-123",
    "role": "authenticated",
    "app_metadata": {
      "tenant_id": "tenant-abc",
      "tenant_role": "teacher",
      "tenant_plan": "starter"
    }
  }';

  -- This should fail (teachers can't delete)
  DELETE FROM students WHERE id = 'some-student-id';
ROLLBACK;

-- Test as admin on free plan (should fail to create)
BEGIN;
  SET request.jwt.claims = '{
    "sub": "user-456",
    "role": "authenticated",
    "app_metadata": {
      "tenant_id": "tenant-abc",
      "tenant_role": "admin",
      "tenant_plan": "free"
    }
  }';

  -- This should fail (free plan can't create)
  INSERT INTO students (name, tenant_id) VALUES ('Test', 'tenant-abc');
ROLLBACK;

-- Test as admin on starter plan (should succeed)
BEGIN;
  SET request.jwt.claims = '{
    "sub": "user-789",
    "role": "authenticated",
    "app_metadata": {
      "tenant_id": "tenant-abc",
      "tenant_role": "admin",
      "tenant_plan": "starter"
    }
  }';

  -- This should succeed
  INSERT INTO students (name, tenant_id) VALUES ('Test', 'tenant-abc');
ROLLBACK;
```

---

## Option 3: Edge Function Gateway

Route all database access through Edge Functions for maximum control.

### Implementation Steps

#### Step 1: Create Generic Query Edge Function

```typescript
// File: supabase/functions/query-database/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

interface QueryRequest {
  table: string;
  operation: 'select' | 'insert' | 'update' | 'delete';
  filters?: Record<string, any>;
  data?: Record<string, any>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authorization = req.headers.get('Authorization');
    if (!authorization) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authorization.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: QueryRequest = await req.json();
    const metadata = user.app_metadata || {};

    // Validate access based on operation
    const hasAccess = await validateAccess(
      body.table,
      body.operation,
      metadata.tenant_role,
      metadata.tenant_plan
    );

    if (!hasAccess) {
      return new Response(
        JSON.stringify({ error: 'Access denied', reason: 'Insufficient permissions' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Execute query with tenant isolation
    let query = supabaseClient.from(body.table);

    // Always filter by tenant
    const tenantFilter = { tenant_id: metadata.tenant_id };

    switch (body.operation) {
      case 'select':
        query = query.select('*');
        if (body.filters) {
          Object.entries({ ...body.filters, ...tenantFilter }).forEach(([key, value]) => {
            query = query.eq(key, value);
          });
        }
        break;

      case 'insert':
        query = query.insert({ ...body.data, ...tenantFilter });
        break;

      case 'update':
        query = query.update(body.data);
        if (body.filters) {
          Object.entries({ ...body.filters, ...tenantFilter }).forEach(([key, value]) => {
            query = query.eq(key, value);
          });
        }
        break;

      case 'delete':
        if (body.filters) {
          Object.entries({ ...body.filters, ...tenantFilter }).forEach(([key, value]) => {
            query = query.eq(key, value);
          });
        }
        query = query.delete();
        break;
    }

    const { data, error } = await query;

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function validateAccess(
  table: string,
  operation: string,
  role: string,
  plan: string
): Promise<boolean> {
  // Define access rules
  const rules: Record<string, Record<string, { roles: string[], plans?: string[] }>> = {
    students: {
      select: { roles: ['owner', 'admin', 'teacher', 'finance'] },
      insert: { roles: ['owner', 'admin'], plans: ['starter', 'growth'] },
      update: { roles: ['owner', 'admin'], plans: ['starter', 'growth'] },
      delete: { roles: ['owner', 'admin'], plans: ['starter', 'growth'] },
    },
    courses: {
      select: { roles: ['owner', 'admin', 'teacher', 'finance'] },
      insert: { roles: ['owner', 'admin', 'teacher'], plans: ['starter', 'growth'] },
      update: { roles: ['owner', 'admin', 'teacher'], plans: ['starter', 'growth'] },
      delete: { roles: ['owner', 'admin'], plans: ['starter', 'growth'] },
    },
    // ... more tables
  };

  const rule = rules[table]?.[operation];
  if (!rule) return false;

  if (!rule.roles.includes(role)) return false;
  if (rule.plans && !rule.plans.includes(plan)) return false;

  return true;
}
```

#### Step 2: Create Frontend API Wrapper

```typescript
// File: src/lib/database-api.ts

import { supabase } from './supabase';

interface QueryOptions {
  table: string;
  operation: 'select' | 'insert' | 'update' | 'delete';
  filters?: Record<string, any>;
  data?: Record<string, any>;
}

async function queryDatabase<T = any>(options: QueryOptions): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error('No active session');
  }

  const response = await fetch(
    `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/query-database`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(options),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Query failed');
  }

  const result = await response.json();
  return result.data;
}

// Type-safe API wrappers
export const databaseAPI = {
  students: {
    list: () => queryDatabase({ table: 'students', operation: 'select' }),
    get: (id: string) => queryDatabase({ 
      table: 'students', 
      operation: 'select', 
      filters: { id } 
    }),
    create: (data: any) => queryDatabase({ 
      table: 'students', 
      operation: 'insert', 
      data 
    }),
    update: (id: string, data: any) => queryDatabase({ 
      table: 'students', 
      operation: 'update', 
      filters: { id }, 
      data 
    }),
    delete: (id: string) => queryDatabase({ 
      table: 'students', 
      operation: 'delete', 
      filters: { id } 
    }),
  },
  courses: {
    // Similar structure
  },
  // ... more tables
};
```

---

## Comparison Table

| Aspect | Frontend-Only | Simplified RLS | Edge Gateway |
|--------|--------------|----------------|--------------|
| **Security** | ⭐ Low | ⭐⭐⭐⭐ High | ⭐⭐⭐⭐ High |
| **Complexity** | ⭐⭐⭐⭐⭐ Simple | ⭐⭐⭐⭐ Moderate | ⭐⭐ Complex |
| **Performance** | ⭐⭐⭐⭐⭐ Fast | ⭐⭐⭐⭐ Fast | ⭐⭐ Slow |
| **Cost** | ⭐⭐⭐⭐⭐ Low | ⭐⭐⭐⭐ Low | ⭐⭐ High |
| **Flexibility** | ⭐⭐⭐⭐⭐ High | ⭐⭐⭐ Moderate | ⭐⭐⭐⭐⭐ High |
| **Maintainability** | ⭐⭐⭐⭐⭐ Easy | ⭐⭐⭐⭐ Good | ⭐⭐⭐ Moderate |
| **Debugging** | ⭐⭐⭐⭐⭐ Easy | ⭐⭐⭐⭐ Good | ⭐⭐⭐ Moderate |
| **Compliance** | ⭐ Poor | ⭐⭐⭐⭐ Good | ⭐⭐⭐⭐⭐ Excellent |

---

## Recommended Decision Matrix

Choose based on your priorities:

### Choose **Simplified RLS** (Option 2) if:
- ✅ You want backend security enforcement
- ✅ You need good performance
- ✅ You want balance of simplicity and security
- ✅ You're okay with some SQL
- ✅ **This is the recommended option for most cases**

### Choose **Edge Function Gateway** (Option 3) if:
- ✅ You need maximum security control
- ✅ You need complex business logic
- ✅ You need detailed audit logging
- ✅ Performance is less critical
- ✅ You have budget for function invocations

### Avoid **Frontend-Only** (Option 1) unless:
- ❌ You're building a demo/prototype only
- ❌ Data is non-sensitive (public data)
- ❌ You understand and accept the security risks
- ❌ **NOT recommended for production**

