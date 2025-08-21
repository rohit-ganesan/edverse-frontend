import { useState } from 'react';
import { Box, Flex, Text, Heading, Grid } from '@radix-ui/themes';
import { DashboardLayout } from 'components/layout/DashboardLayout';
import { RadixCard } from 'components/ui/RadixCard';
import { RadixButton } from 'components/ui/RadixButton';
import { LineItem } from 'components/ui/LineItem';
import { FormField } from 'components/ui/FormField';
import { useAuth } from 'features/auth/AuthContext';
import { User, MapPin, Mail, Shield } from 'lucide-react';

export function ProfilePage(): JSX.Element {
  const authContext = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get user and profile safely
  const user = authContext?.user;
  const userProfile = authContext?.userProfile;
  const updateUserProfile = authContext?.updateUserProfile;

  // Initialize form data with safe defaults - must be called before conditional returns
  const [formData, setFormData] = useState({
    firstName: userProfile?.first_name || '',
    lastName: userProfile?.last_name || '',
    address: userProfile?.address || '',
    role: userProfile?.role || 'Administrator',
  });

  // Defensive check for auth context - after hooks
  if (!authContext) {
    console.error('ProfilePage: Auth context is not available');
    return (
      <DashboardLayout>
        <Box className="p-6">
          <div className="text-center">
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Authentication Error
            </h1>
            <p className="text-gray-600">
              Unable to load authentication context. Please refresh the page.
            </p>
          </div>
        </Box>
      </DashboardLayout>
    );
  }

  // Safe getters for user data
  const getUserDisplayName = (): string => {
    if (userProfile?.first_name && userProfile?.last_name) {
      return `${userProfile.first_name} ${userProfile.last_name}`;
    }

    if (user?.email) {
      return user.email.split('@')[0]; // Use email username as fallback
    }

    return 'User';
  };

  const getUserEmail = (): string => {
    return user?.email || 'Not available';
  };

  const getUserRole = (): string => {
    return userProfile?.role || 'Administrator';
  };

  const getUserAddress = (): string | null => {
    return userProfile?.address || null;
  };

  const handleInputChange = (field: string, value: string): void => {
    if (!field || typeof value !== 'string') {
      console.warn('ProfilePage: Invalid input change parameters');
      return;
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (): Promise<void> => {
    if (!updateUserProfile) {
      console.error('ProfilePage: updateUserProfile function is not available');
      return;
    }

    // Validate form data
    if (!formData.firstName?.trim() || !formData.lastName?.trim()) {
      console.error('ProfilePage: First name and last name are required');
      return;
    }

    setLoading(true);
    try {
      // Transform camelCase form data to snake_case for database
      const profileData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        address: formData.address,
        role: formData.role,
      };
      await updateUserProfile(profileData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (): void => {
    // Reset form data to current profile values
    setFormData({
      firstName: userProfile?.first_name || '',
      lastName: userProfile?.last_name || '',
      address: userProfile?.address || '',
      role: userProfile?.role || 'Administrator',
    });
    setIsEditing(false);
  };

  const handleStartEditing = (): void => {
    // Refresh form data when starting to edit
    setFormData({
      firstName: userProfile?.first_name || '',
      lastName: userProfile?.last_name || '',
      address: userProfile?.address || '',
      role: userProfile?.role || 'Administrator',
    });
    setIsEditing(true);
  };

  // Safe form field values
  const getFieldValue = (
    field: keyof typeof formData,
    profileField?: string
  ): string => {
    if (isEditing) {
      return formData[field] || '';
    }

    if (profileField && userProfile) {
      return (userProfile as any)[profileField] || '';
    }

    // Map formData field names to userProfile field names
    const fieldMap: Record<string, string> = {
      firstName: 'first_name',
      lastName: 'last_name',
      address: 'address',
      role: 'role',
    };

    const profileFieldName = fieldMap[field] || field;
    return (userProfile as any)?.[profileFieldName] || '';
  };

  return (
    <DashboardLayout>
      <Box className="mb-6">
        <Heading size="6" className="text-gray-900 dark:text-gray-100 mb-2">
          Profile Settings
        </Heading>
        <Text size="3" className="text-gray-600 dark:text-gray-400">
          Manage your account information and preferences
        </Text>
      </Box>

      <Grid columns="2" gap="6">
        {/* Profile Information Card */}
        <RadixCard size="2" className="p-6">
          <Flex justify="between" align="center" className="mb-6">
            <Heading size="4" className="text-gray-900 dark:text-gray-100">
              Personal Information
            </Heading>
            {!isEditing && (
              <RadixButton variant="outline" onClick={handleStartEditing}>
                Edit Profile
              </RadixButton>
            )}
          </Flex>

          <Flex direction="column" gap="4">
            {/* Profile Avatar */}
            <Flex
              align="center"
              gap="4"
              className="mb-6 pb-4 border-b border-gray-100 dark:border-gray-700"
            >
              <Box className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </Box>
              <Box>
                <Text
                  size="4"
                  weight="medium"
                  className="text-gray-900 dark:text-gray-100 block mb-1"
                >
                  {getUserDisplayName()}
                </Text>
                <Text
                  size="2"
                  className="text-gray-600 dark:text-gray-400 block"
                >
                  {getUserRole()}
                </Text>
              </Box>
            </Flex>

            {/* Form Fields */}
            <Flex direction="column" gap="5">
              <Grid columns="2" gap="4">
                <FormField
                  label="First Name"
                  value={getFieldValue('firstName', 'firstName')}
                  placeholder="Enter first name"
                  isEditing={isEditing}
                  onChange={(value) => handleInputChange('firstName', value)}
                />

                <FormField
                  label="Last Name"
                  value={getFieldValue('lastName', 'lastName')}
                  placeholder="Enter last name"
                  isEditing={isEditing}
                  onChange={(value) => handleInputChange('lastName', value)}
                />
              </Grid>

              <FormField
                label="Address"
                value={getFieldValue('address', 'address')}
                placeholder="Enter your address"
                isEditing={isEditing}
                onChange={(value) => handleInputChange('address', value)}
              />

              <FormField label="Role" value={getUserRole()} isEditing={false} />
            </Flex>

            {isEditing && (
              <Flex gap="3" className="mt-4">
                <RadixButton onClick={handleSave} loading={loading}>
                  Save Changes
                </RadixButton>
                <RadixButton variant="outline" onClick={handleCancel}>
                  Cancel
                </RadixButton>
              </Flex>
            )}
          </Flex>
        </RadixCard>

        {/* Account Information Card */}
        <RadixCard size="2" className="p-6">
          <Heading size="4" className="text-gray-900 dark:text-gray-100 mb-6">
            Account Information
          </Heading>

          <Flex direction="column" gap="4">
            <LineItem
              icon={Mail}
              label="Email Address"
              value={getUserEmail()}
              variant="bordered"
            />

            <LineItem
              icon={Shield}
              label="Account Type"
              value={getUserRole()}
              variant="bordered"
            />

            {getUserAddress() && (
              <LineItem
                icon={MapPin}
                label="Location"
                value={getUserAddress() || ''}
                variant="bordered"
              />
            )}
          </Flex>
        </RadixCard>
      </Grid>
    </DashboardLayout>
  );
}
