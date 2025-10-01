import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { authAPI } from '../lib/supabase-api';
import { Box, Flex, Text, Button, Spinner } from '@radix-ui/themes';

interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  onboarding_status: 'pending' | 'complete';
}

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const initializeProfile = useCallback(async () => {
    try {
      setLoading(true);

      // First, try to get the existing profile
      const { data: existingProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        throw profileError;
      }

      let userProfile = existingProfile;

      // If profile doesn't exist, call the ensure_profile RPC
      if (!userProfile) {
        console.log('Profile not found, calling ensure_profile RPC...');
        const { data: ensuredProfile, error: ensureError } =
          await supabase.rpc('ensure_profile');

        if (ensureError) {
          console.error('Error ensuring profile:', ensureError);
          throw ensureError;
        }

        userProfile = ensuredProfile;
      }

      if (userProfile) {
        setProfile(userProfile);

        // If already complete, redirect to dashboard
        if (userProfile.onboarding_status === 'complete') {
          navigate('/dashboard');
          return;
        }
      } else {
        throw new Error('Failed to create or retrieve user profile');
      }
    } catch (error) {
      console.error('Failed to initialize profile:', error);
      // Show error state - could redirect to login or show error message
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    initializeProfile();
  }, [initializeProfile]);

  const handleComplete = async () => {
    if (!profile) return;

    try {
      setSaving(true);
      // Pull any local draft and finalize on server
      let localDraft: any = null;
      try {
        const raw = localStorage.getItem('edverse_onboarding_draft');
        if (raw) {
          localDraft = JSON.parse(raw);

          // Save draft to DB before finalizing (ensures join_code is persisted)
          if (localDraft.join_code) {
            await authAPI.saveOnboardingDraft({
              step: localDraft.step || 3,
              data: localDraft,
              invite_code: localDraft.join_code,
              tenant_hint: null,
            });
          }
        }
      } catch (e) {
        console.error('Error processing draft:', e);
      }

      // Fallback minimal payload from profile if no draft
      const payload = localDraft || {
        first_name: profile.first_name,
        last_name: profile.last_name,
        role: 'student',
        plan_key: 'free',
      };

      await authAPI.finalizeOnboarding(payload);

      // Mark onboarding complete in users
      await supabase
        .from('users')
        .update({
          onboarding_status: 'complete',
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      // Clear localStorage draft after successful completion
      localStorage.removeItem('edverse_onboarding_draft');

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      // Could show error toast here
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box className="min-h-screen flex items-center justify-center bg-gray-50">
        <Flex direction="column" align="center" gap="4">
          <Spinner size="3" />
          <Text size="4" weight="medium">
            Preparing your account...
          </Text>
          <Text size="2" color="gray">
            This will only take a moment
          </Text>
        </Flex>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box className="min-h-screen flex items-center justify-center bg-gray-50">
        <Flex direction="column" align="center" gap="4">
          <Text size="4" weight="medium" color="red">
            Unable to set up your account
          </Text>
          <Button onClick={() => navigate('/login')}>Return to Login</Button>
        </Flex>
      </Box>
    );
  }

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gray-50">
      <Box
        style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          minWidth: '400px',
          maxWidth: '500px',
        }}
      >
        <Flex direction="column" gap="6">
          <Box>
            <Text size="6" weight="bold" className="block mb-2">
              Welcome to EdVerse!
            </Text>
            <Text size="3" color="gray">
              Let's set up your profile to get started.
            </Text>
          </Box>

          <Flex direction="column" gap="4">
            <Box>
              <Text size="2" weight="medium" className="block mb-2">
                Email
              </Text>
              <Text size="3" color="gray">
                {profile.email}
              </Text>
            </Box>

            <Box>
              <Text size="2" weight="medium" className="block mb-2">
                Name
              </Text>
              <Text size="3" color="gray">
                {[profile.first_name, profile.last_name]
                  .filter(Boolean)
                  .join(' ') || 'Not provided'}
              </Text>
            </Box>
          </Flex>

          <Flex gap="3" justify="end">
            <Button
              variant="soft"
              onClick={() => navigate('/login')}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={handleComplete} disabled={saving}>
              {saving ? (
                <Flex align="center" gap="2">
                  <Spinner size="1" />
                  <Text>Setting up...</Text>
                </Flex>
              ) : (
                'Continue'
              )}
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default OnboardingPage;
