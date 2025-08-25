import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Extract the JWT token
    const token = authHeader.replace('Bearer ', '');
    
    // Verify the JWT and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get user's tenant membership
    const { data: membership, error: membershipError } = await supabase
      .from('tenant_members')
      .select(`
        role,
        tenant_id,
        tenants (
          plan,
          name
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (membershipError || !membership) {
      // Return default access for users without tenant membership
      return new Response(
        JSON.stringify({
          success: true,
          data: {
            plan: 'free',
            role: 'teacher',
            features: [
              'attendance.view', 'attendance.mark',
              'results.view',
              'classes.view', 'courses.view', 'students.view',
              'fees.view_overview', 'fees.structures.basic', 'fees.record_manual',
              'notices.view', 'notices.send',
              'org.manage', 'staff.invite', 'settings.integrations',
            ],
            capabilities: ['classes.view', 'classes.take_attendance', 'results.enter', 'notices.send'],
          }
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get tenant features
    const { data: features, error: featuresError } = await supabase
      .from('tenant_features')
      .select('feature')
      .eq('tenant_id', membership.tenant_id)
      .eq('enabled', true);

    if (featuresError) {
      console.error('Error fetching features:', featuresError);
    }

    // Get plan-based features
    const plan = membership.tenants?.plan || 'free';
    const role = membership.role || 'teacher';
    
    // Define plan-based features
    const planFeatures: Record<string, string[]> = {
      free: [
        'attendance.view', 'attendance.mark',
        'results.view',
        'classes.view', 'courses.view', 'students.view',
        'fees.view_overview', 'fees.structures.basic', 'fees.record_manual',
        'notices.view', 'notices.send',
        'org.manage', 'staff.invite', 'settings.integrations',
      ],
      starter: [
        'attendance.view', 'attendance.mark', 'attendance.bulk_import',
        'results.view', 'results.enter', 'results.export',
        'classes.view', 'classes.crud', 'classes.reschedule',
        'courses.view', 'courses.crud', 'courses.export',
        'students.view', 'students.crud',
        'fees.view_overview', 'fees.structures.basic', 'fees.record_manual',
        'notices.view', 'notices.send',
        'org.manage', 'staff.invite', 'settings.integrations',
        'analytics.view',
      ],
      growth: [
        'attendance.view', 'attendance.mark', 'attendance.bulk_import',
        'results.view', 'results.enter', 'results.export',
        'classes.view', 'classes.crud', 'classes.reschedule',
        'courses.view', 'courses.crud', 'courses.export',
        'students.view', 'students.crud',
        'fees.view_overview', 'fees.structures.basic', 'fees.record_manual', 'fees.online', 'fees.reminders.email',
        'notices.view', 'notices.send', 'notices.analytics',
        'org.manage', 'staff.invite', 'settings.integrations',
        'analytics.view',
        'portal.parent',
        'api.read',
      ],
      scale: [
        'attendance.view', 'attendance.mark', 'attendance.bulk_import',
        'results.view', 'results.enter', 'results.export',
        'classes.view', 'classes.crud', 'classes.reschedule',
        'courses.view', 'courses.crud', 'courses.export',
        'students.view', 'students.crud',
        'fees.view_overview', 'fees.structures.basic', 'fees.record_manual', 'fees.online', 'fees.reminders.email', 'fees.reminders.smswa', 'fees.reconcile',
        'notices.view', 'notices.send', 'notices.analytics',
        'org.manage', 'staff.invite', 'settings.integrations',
        'analytics.view',
        'portal.parent',
        'api.read', 'api.rw',
        'auth.sso',
        'audit.logs',
      ],
      enterprise: [
        'attendance.view', 'attendance.mark', 'attendance.bulk_import',
        'results.view', 'results.enter', 'results.export',
        'classes.view', 'classes.crud', 'classes.reschedule',
        'courses.view', 'courses.crud', 'courses.export',
        'students.view', 'students.crud',
        'fees.view_overview', 'fees.structures.basic', 'fees.record_manual', 'fees.online', 'fees.reminders.email', 'fees.reminders.smswa', 'fees.reconcile', 'fees.advanced',
        'notices.view', 'notices.send', 'notices.analytics',
        'org.manage', 'staff.invite', 'settings.integrations', 'settings.branding',
        'analytics.view',
        'portal.parent',
        'api.read', 'api.rw',
        'auth.sso',
        'audit.logs',
        'admissions.view', 'admissions.crud',
        'syllabus.advanced',
        'integrations.view',
      ],
    };

    // Define role-based capabilities
    const roleCapabilities: Record<string, string[]> = {
      owner: [
        'classes.view', 'classes.crud', 'classes.take_attendance',
        'courses.view', 'courses.crud',
        'students.view', 'students.crud',
        'results.view', 'results.enter',
        'notices.send', 'notices.view',
        'org.manage', 'staff.invite',
        'settings.integrations', 'settings.branding',
        'fees.view_overview', 'fees.structures.basic', 'fees.record_manual',
        'analytics.view',
        'portal.parent',
        'api.read', 'api.rw',
        'auth.sso',
        'audit.logs',
        'admissions.view', 'admissions.crud',
        'syllabus.advanced',
        'integrations.view',
      ],
      admin: [
        'classes.view', 'classes.crud', 'classes.take_attendance',
        'courses.view', 'courses.crud',
        'students.view', 'students.crud',
        'results.view', 'results.enter',
        'notices.send', 'notices.view',
        'org.manage', 'staff.invite',
        'settings.integrations',
        'fees.view_overview', 'fees.structures.basic', 'fees.record_manual',
        'analytics.view',
        'portal.parent',
        'api.read',
      ],
      teacher: [
        'classes.view', 'classes.take_attendance',
        'courses.view',
        'students.view',
        'results.view', 'results.enter',
        'notices.send', 'notices.view',
        'attendance.view', 'attendance.mark',
      ],
      admissions: [
        'admissions.view', 'admissions.crud',
        'students.view', 'students.crud',
        'notices.view', 'notices.send',
      ],
      finance: [
        'fees.view_overview', 'fees.structures.basic', 'fees.record_manual',
        'analytics.view',
        'students.view',
      ],
      parent: [
        'students.view',
        'results.view',
        'attendance.view',
        'notices.view',
      ],
      student: [
        'results.view',
        'attendance.view',
        'notices.view',
      ],
    };

    // Combine plan features with tenant-specific features
    const baseFeatures = planFeatures[plan] || planFeatures.free;
    const tenantFeatures = features?.map(f => f.feature) || [];
    const allFeatures = [...new Set([...baseFeatures, ...tenantFeatures])];

    // Get role-based capabilities
    const capabilities = roleCapabilities[role] || roleCapabilities.teacher;

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          plan,
          role,
          features: allFeatures,
          capabilities,
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in get-access-data:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
