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
  const { user, userProfile, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: userProfile?.firstName || '',
    lastName: userProfile?.lastName || '',
    address: userProfile?.address || '',
    role: userProfile?.role || 'Administrator',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (): Promise<void> => {
    setLoading(true);
    try {
      await updateUserProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (): void => {
    setFormData({
      firstName: userProfile?.firstName || '',
      lastName: userProfile?.lastName || '',
      address: userProfile?.address || '',
      role: userProfile?.role || 'Administrator',
    });
    setIsEditing(false);
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
              <RadixButton variant="outline" onClick={() => setIsEditing(true)}>
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
                  {userProfile?.firstName && userProfile?.lastName
                    ? `${userProfile.firstName} ${userProfile.lastName}`
                    : user?.displayName || 'User'}
                </Text>
                <Text
                  size="2"
                  className="text-gray-600 dark:text-gray-400 block"
                >
                  {userProfile?.role || 'Administrator'}
                </Text>
              </Box>
            </Flex>

            {/* Form Fields */}
            <Flex direction="column" gap="5">
              <Grid columns="2" gap="4">
                <FormField
                  label="First Name"
                  value={
                    isEditing ? formData.firstName : userProfile?.firstName
                  }
                  placeholder="Enter first name"
                  isEditing={isEditing}
                  onChange={(value) => handleInputChange('firstName', value)}
                />

                <FormField
                  label="Last Name"
                  value={isEditing ? formData.lastName : userProfile?.lastName}
                  placeholder="Enter last name"
                  isEditing={isEditing}
                  onChange={(value) => handleInputChange('lastName', value)}
                />
              </Grid>

              <FormField
                label="Address"
                value={isEditing ? formData.address : userProfile?.address}
                placeholder="Enter your address"
                isEditing={isEditing}
                onChange={(value) => handleInputChange('address', value)}
              />

              <FormField
                label="Role"
                value={userProfile?.role || 'Administrator'}
                isEditing={false}
              />
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
              value={user?.email || 'Not available'}
              variant="bordered"
            />

            <LineItem
              icon={Shield}
              label="Account Type"
              value={userProfile?.role || 'Administrator'}
              variant="bordered"
            />

            {userProfile?.address && (
              <LineItem
                icon={MapPin}
                label="Location"
                value={userProfile.address}
                variant="bordered"
              />
            )}
          </Flex>
        </RadixCard>
      </Grid>
    </DashboardLayout>
  );
}
