import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const PUBLIC_ROUTES = [
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/auth/callback',
  '/auth/verify',
  '/billing',
];

export default function OnboardingGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const ranRef = useRef<string | null>(null); // avoid double-run per path

  useEffect(() => {
    // don’t block render — just revalidate and redirect if needed
    const run = async () => {
      try {
        if (ranRef.current === location.pathname) return;
        ranRef.current = location.pathname;

        // Allow public routes and the onboarding page itself
        if (
          PUBLIC_ROUTES.includes(location.pathname) ||
          location.pathname === '/onboarding'
        )
          return;

        // Read session (retry once to avoid post-redirect race)
        let {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          await new Promise((r) => setTimeout(r, 200));
          ({
            data: { session },
          } = await supabase.auth.getSession());
        }

        // No session? Let outer auth guards handle it
        if (!session?.user?.id) return;

        // Check onboarding flag
        const { data: profile, error } = await supabase
          .from('users')
          .select('onboarding_status')
          .eq('id', session.user.id)
          .maybeSingle();

        if (error) {
          // fail-open if query fails (RLS/network) — don’t lock user on a spinner
          console.warn('OnboardingGate profile check error:', error);
          return;
        }

        if (!profile || profile.onboarding_status !== 'complete') {
          navigate('/onboarding', { replace: true });
        }
      } catch (e) {
        console.warn('OnboardingGate unexpected error:', e);
        // fail-open
      }
    };

    run();
  }, [location.pathname, navigate]);

  return <>{children}</>;
}
