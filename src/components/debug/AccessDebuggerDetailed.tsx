import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../features/auth/AuthContext';
import { useAccess } from '../../context/AccessContext';
import { Text, Card, Badge, Button, Separator } from '@radix-ui/themes';
import { supabase } from '../../lib/supabase';

export function AccessDebuggerDetailed() {
  const { user, userProfile } = useAuth();
  const { plan, role, features, capabilities, isLoading, isInitialized } =
    useAccess();
  const [tenantMember, setTenantMember] = useState<any>(null);
  const [tenantData, setTenantData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fixing, setFixing] = useState(false);

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
        .order('last_accessed', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (memberError) {
        console.error('Error fetching tenant member:', memberError);
      } else {
        setTenantMember(memberData);
        setTenantData(memberData?.tenants);
      }
    } catch (error) {
      console.error('Error fetching tenant data:', error);
    } finally {
      setLoading(false);
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
  }, [user?.id, fetchTenantData]);

  if (isLoading || loading) {
    return (
      <Card className="p-4 m-4">
        <Text>Loading detailed access data...</Text>
      </Card>
    );
  }

  return (
    <Card className="p-4 m-4">
      <Text size="4" weight="bold" className="mb-4">
        Detailed Access Debug Information
      </Text>

      <div className="space-y-6">
        {/* User Profile Section */}
        <div>
          <Text size="3" weight="bold" className="mb-2">
            User Profile (Legacy)
          </Text>
          <div className="bg-gray-50 p-3 rounded">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <Text weight="medium">ID:</Text> {userProfile?.id || 'N/A'}
              </div>
              <div>
                <Text weight="medium">Email:</Text>{' '}
                {userProfile?.email || 'N/A'}
              </div>
              <div>
                <Text weight="medium">Name:</Text> {userProfile?.first_name}{' '}
                {userProfile?.last_name}
              </div>
              <div>
                <Text weight="medium">Role:</Text>
                <Badge color="blue" className="ml-1">
                  {userProfile?.role || 'N/A'}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Tenant Member Section */}
        <div>
          <Text size="3" weight="bold" className="mb-2">
            Tenant Member (New System)
          </Text>
          {tenantMember ? (
            <div className="bg-green-50 p-3 rounded">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <Text weight="medium">Tenant ID:</Text>{' '}
                  {tenantMember.tenant_id}
                </div>
                <div>
                  <Text weight="medium">Role:</Text>
                  <Badge color="green" className="ml-1">
                    {tenantMember.role}
                  </Badge>
                </div>
                <div>
                  <Text weight="medium">Status:</Text>
                  <Badge
                    color={tenantMember.status === 'active' ? 'green' : 'red'}
                    className="ml-1"
                  >
                    {tenantMember.status}
                  </Badge>
                </div>
                <div>
                  <Text weight="medium">Joined:</Text>{' '}
                  {new Date(tenantMember.joined_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 p-3 rounded">
              <Text color="red">No tenant member record found!</Text>
              <Text size="2" className="mt-1">
                This user is not associated with any tenant. The migration
                script may not have been run.
              </Text>
            </div>
          )}
        </div>

        <Separator />

        {/* Tenant Data Section */}
        <div>
          <Text size="3" weight="bold" className="mb-2">
            Tenant Information
          </Text>
          {tenantData ? (
            <div className="bg-blue-50 p-3 rounded">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <Text weight="medium">Name:</Text> {tenantData.name}
                </div>
                <div>
                  <Text weight="medium">Plan:</Text>
                  <Badge color="blue" className="ml-1">
                    {tenantData.plan}
                  </Badge>
                </div>
                <div>
                  <Text weight="medium">Status:</Text>
                  <Badge
                    color={tenantData.status === 'active' ? 'green' : 'red'}
                    className="ml-1"
                  >
                    {tenantData.status}
                  </Badge>
                </div>
                <div>
                  <Text weight="medium">ID:</Text> {tenantData.id}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 p-3 rounded">
              <Text color="orange">No tenant data available</Text>
            </div>
          )}
        </div>

        <Separator />

        {/* Access Context Section */}
        <div>
          <Text size="3" weight="bold" className="mb-2">
            Access Context (Current)
          </Text>
          <div className="bg-purple-50 p-3 rounded">
            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div>
                <Text weight="medium">Plan:</Text>
                <Badge color="purple" className="ml-1">
                  {plan}
                </Badge>
              </div>
              <div>
                <Text weight="medium">Role:</Text>
                <Badge color="purple" className="ml-1">
                  {role}
                </Badge>
              </div>
              <div>
                <Text weight="medium">Initialized:</Text>
                <Badge color={isInitialized ? 'green' : 'red'} className="ml-1">
                  {isInitialized ? 'Yes' : 'No'}
                </Badge>
              </div>
              <div>
                <Text weight="medium">Features:</Text> {features.length}
              </div>
            </div>

            <div className="mt-3">
              <Text weight="medium" className="mb-2">
                Features ({features.length}):
              </Text>
              <div className="flex flex-wrap gap-1">
                {features.map((feature) => (
                  <Badge key={feature} color="gray" variant="soft" size="1">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mt-3">
              <Text weight="medium" className="mb-2">
                Capabilities ({capabilities.length}):
              </Text>
              <div className="flex flex-wrap gap-1">
                {capabilities.map((cap) => (
                  <Badge key={cap} color="purple" variant="soft" size="1">
                    {cap}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div>
          <Text size="3" weight="bold" className="mb-2">
            Actions
          </Text>
          <div className="flex gap-2">
            <Button onClick={fetchTenantData} size="2">
              Refresh Tenant Data
            </Button>
            {!tenantMember && (
              <Button
                onClick={fixTenantMembership}
                color="orange"
                size="2"
                disabled={fixing}
              >
                {fixing ? 'Creating...' : 'Create Tenant Member'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
