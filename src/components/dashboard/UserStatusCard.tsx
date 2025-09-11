import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../features/auth/AuthContext';
import { useAccess } from '../../context/AccessContext';
import {
  Text,
  Card,
  Badge,
  Button,
  Separator,
  Flex,
  Box,
} from '@radix-ui/themes';
import { supabase } from '../../lib/supabase';
import { RefreshCw, User, Building, Shield, AlertTriangle } from 'lucide-react';

interface TenantMember {
  id: string;
  user_id: string;
  tenant_id: string;
  role: string;
  status: string;
  joined_at: string;
  tenants?: {
    id: string;
    name: string;
    plan: string;
    status: string;
  };
}

export function UserStatusCard() {
  const { user, userProfile } = useAuth();
  const { plan, role, features, capabilities, isLoading, isInitialized } =
    useAccess();
  const [tenantMember, setTenantMember] = useState<TenantMember | null>(null);
  const [loading, setLoading] = useState(false);
  const [fixing, setFixing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchTenantData = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      // Get tenant member data
      const { data: memberData, error: memberError } = await supabase
        .from('tenant_members')
        .select(
          `
          *,
          tenants!inner(
            id,
            name,
            plan,
            status
          )
        `
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (memberError) {
        console.error('Error fetching tenant member:', memberError);
      } else {
        setTenantMember(memberData);
      }
    } catch (error) {
      console.error('Error fetching tenant data:', error);
    } finally {
      setLoading(false);
      setLastUpdated(new Date());
    }
  }, [user?.id]);

  const fixTenantMembership = async () => {
    if (!user?.id) return;

    setFixing(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch(
        `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/fix-user-tenant-membership`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      console.log('Fix tenant membership result:', result);

      // Refresh the data
      await fetchTenantData();

      alert(
        'Tenant membership created successfully! Please refresh the page to see updated access data.'
      );
    } catch (error) {
      console.error('Error fixing tenant membership:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Error: ${errorMessage}`);
    } finally {
      setFixing(false);
    }
  };

  useEffect(() => {
    fetchTenantData();
  }, [fetchTenantData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'pending':
        return 'yellow';
      case 'inactive':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'red';
      case 'admin':
        return 'orange';
      case 'teacher':
        return 'blue';
      case 'student':
        return 'green';
      case 'parent':
        return 'purple';
      default:
        return 'gray';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'enterprise':
        return 'red';
      case 'scale':
        return 'orange';
      case 'growth':
        return 'blue';
      case 'starter':
        return 'green';
      case 'free':
        return 'gray';
      default:
        return 'gray';
    }
  };

  if (isLoading || loading) {
    return (
      <Card className="p-6">
        <Flex align="center" gap="3">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <Text>Loading user status...</Text>
        </Flex>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <Flex justify="between" align="center" className="mb-4">
        <Text size="5" weight="bold">
          User Status & Access
        </Text>
        <Button
          variant="soft"
          size="2"
          onClick={fetchTenantData}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </Flex>

      <div className="space-y-4">
        {/* User Profile Section */}
        <Box>
          <Flex align="center" gap="2" className="mb-2">
            <User className="w-4 h-4" />
            <Text size="3" weight="bold">
              User Profile
            </Text>
          </Flex>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <Text weight="medium">Name:</Text>
                <Text className="ml-2">
                  {userProfile?.first_name} {userProfile?.last_name}
                </Text>
              </div>
              <div>
                <Text weight="medium">Email:</Text>
                <Text className="ml-2">{userProfile?.email}</Text>
              </div>
              <div>
                <Text weight="medium">Profile Role:</Text>
                <Badge
                  color={getRoleColor(userProfile?.role || '')}
                  className="ml-2"
                >
                  {userProfile?.role || 'N/A'}
                </Badge>
              </div>
              <div>
                <Text weight="medium">Onboarding:</Text>
                <Badge
                  color={
                    userProfile?.onboarding_status === 'complete'
                      ? 'green'
                      : 'yellow'
                  }
                  className="ml-2"
                >
                  {userProfile?.onboarding_status || 'pending'}
                </Badge>
              </div>
            </div>
          </div>
        </Box>

        <Separator />

        {/* Tenant Membership Section */}
        <Box>
          <Flex align="center" gap="2" className="mb-2">
            <Building className="w-4 h-4" />
            <Text size="3" weight="bold">
              Tenant Membership
            </Text>
          </Flex>
          {tenantMember ? (
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <Text weight="medium">Tenant:</Text>
                  <Text className="ml-2">{tenantMember.tenants?.name}</Text>
                </div>
                <div>
                  <Text weight="medium">Tenant Role:</Text>
                  <Badge
                    color={getRoleColor(tenantMember.role)}
                    className="ml-2"
                  >
                    {tenantMember.role}
                  </Badge>
                </div>
                <div>
                  <Text weight="medium">Status:</Text>
                  <Badge
                    color={getStatusColor(tenantMember.status)}
                    className="ml-2"
                  >
                    {tenantMember.status}
                  </Badge>
                </div>
                <div>
                  <Text weight="medium">Plan:</Text>
                  <Badge
                    color={getPlanColor(tenantMember.tenants?.plan || '')}
                    className="ml-2"
                  >
                    {tenantMember.tenants?.plan || 'N/A'}
                  </Badge>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 p-3 rounded-lg">
              <Flex align="center" gap="2" className="mb-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <Text color="red" weight="medium">
                  No tenant membership found
                </Text>
              </Flex>
              <Text size="2" color="red" className="mb-3">
                This user is not associated with any tenant. This may cause
                access issues.
              </Text>
              <Button
                onClick={fixTenantMembership}
                color="red"
                size="2"
                disabled={fixing}
              >
                {fixing ? 'Creating...' : 'Create Tenant Membership'}
              </Button>
            </div>
          )}
        </Box>

        <Separator />

        {/* Access Context Section */}
        <Box>
          <Flex align="center" gap="2" className="mb-2">
            <Shield className="w-4 h-4" />
            <Text size="3" weight="bold">
              Access Context
            </Text>
            <Badge color={isInitialized ? 'green' : 'red'} size="1">
              {isInitialized ? 'Active' : 'Inactive'}
            </Badge>
          </Flex>
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-3">
              <div>
                <Text weight="medium">Current Plan:</Text>
                <Badge color={getPlanColor(plan)} className="ml-2">
                  {plan}
                </Badge>
              </div>
              <div>
                <Text weight="medium">Current Role:</Text>
                <Badge color={getRoleColor(role)} className="ml-2">
                  {role}
                </Badge>
              </div>
              <div>
                <Text weight="medium">Features:</Text>
                <Badge color="blue" className="ml-2">
                  {features.length} available
                </Badge>
              </div>
              <div>
                <Text weight="medium">Capabilities:</Text>
                <Badge color="purple" className="ml-2">
                  {capabilities.length} available
                </Badge>
              </div>
            </div>

            {/* Role Mismatch Warning */}
            {userProfile?.role && userProfile.role !== role && (
              <div className="bg-yellow-50 p-2 rounded border border-yellow-200 mb-3">
                <Flex align="center" gap="2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <Text size="2" color="yellow">
                    Role mismatch: Profile shows "{userProfile.role}" but
                    AccessContext shows "{role}"
                  </Text>
                </Flex>
              </div>
            )}

            {/* Quick Feature Preview */}
            <div className="mt-3">
              <Text weight="medium" className="mb-2">
                Key Features:
              </Text>
              <div className="flex flex-wrap gap-1">
                {features.slice(0, 6).map((feature) => (
                  <Badge key={feature} color="gray" variant="soft" size="1">
                    {feature}
                  </Badge>
                ))}
                {features.length > 6 && (
                  <Badge color="gray" variant="soft" size="1">
                    +{features.length - 6} more
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Box>

        {/* Last Updated */}
        <div className="text-center">
          <Text size="1" color="gray">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </Text>
        </div>
      </div>
    </Card>
  );
}
