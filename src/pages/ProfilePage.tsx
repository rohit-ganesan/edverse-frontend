import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PageHeader } from '../components/ui/PageHeader';
import {
  Text,
  Heading,
  Button,
  Card,
  TextField,
  Switch,
  Badge,
} from '@radix-ui/themes';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Edit,
  Save,
  X,
  Camera,
} from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';
import { useAccess } from '../context/AccessContext';

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  avatar_url?: string;
  role: string;
  plan: string;
  created_at: string;
  last_login?: string;
}

export function ProfilePage(): JSX.Element {
  const { user } = useAuth();
  const { plan, role } = useAccess();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    date_of_birth: '',
  });

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        // In a real app, you'd fetch from your API
        // For now, we'll construct from available data
        const userProfile: UserProfile = {
          id: user.id,
          first_name: user.user_metadata?.first_name || 'User',
          last_name: user.user_metadata?.last_name || '',
          email: user.email || '',
          phone: user.user_metadata?.phone || '',
          address: user.user_metadata?.address || '',
          date_of_birth: user.user_metadata?.date_of_birth || '',
          avatar_url: user.user_metadata?.avatar_url || '',
          role: role || 'user',
          plan: plan || 'free',
          created_at: user.created_at || new Date().toISOString(),
          last_login: user.last_sign_in_at || '',
        };

        setProfile(userProfile);
        setFormData({
          first_name: userProfile.first_name,
          last_name: userProfile.last_name,
          phone: userProfile.phone || '',
          address: userProfile.address || '',
          date_of_birth: userProfile.date_of_birth || '',
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user, role, plan]);

  const handleSave = async () => {
    try {
      // In a real app, you'd update via API
      console.log('Saving profile:', formData);
      setIsEditing(false);
      // You would typically update the profile state here after successful save
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone: profile.phone || '',
        address: profile.address || '',
        date_of_birth: profile.date_of_birth || '',
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Text className="text-gray-600">Profile not found</Text>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Profile"
        description="Manage your account information and preferences"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card className="p-8">
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-blue-600" />
                  )}
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>

              <Heading size="4" className="mb-3">
                {profile.first_name} {profile.last_name}
              </Heading>
              <Text className="text-gray-600 mb-4">{profile.email}</Text>

              <div className="flex justify-center gap-3 mb-6">
                <Badge color="blue" variant="soft">
                  {profile.role}
                </Badge>
                <Badge color="green" variant="soft">
                  {profile.plan} Plan
                </Badge>
              </div>

              <div className="text-sm text-gray-500 space-y-2">
                <div>
                  Member since{' '}
                  {new Date(profile.created_at).toLocaleDateString()}
                </div>
                {profile.last_login && (
                  <div>
                    Last login{' '}
                    {new Date(profile.last_login).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <Heading size="4">Personal Information</Heading>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleSave} color="blue">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button onClick={handleCancel} variant="outline">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                {isEditing ? (
                  <TextField.Root
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData({ ...formData, first_name: e.target.value })
                    }
                    placeholder="Enter first name"
                  />
                ) : (
                  <div className="flex items-center p-3 bg-gray-50 rounded-md">
                    <User className="w-4 h-4 text-gray-400 mr-3" />
                    <Text>{profile.first_name}</Text>
                  </div>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                {isEditing ? (
                  <TextField.Root
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData({ ...formData, last_name: e.target.value })
                    }
                    placeholder="Enter last name"
                  />
                ) : (
                  <div className="flex items-center p-3 bg-gray-50 rounded-md">
                    <User className="w-4 h-4 text-gray-400 mr-3" />
                    <Text>{profile.last_name}</Text>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="flex items-center p-3 bg-gray-50 rounded-md">
                  <Mail className="w-4 h-4 text-gray-400 mr-3" />
                  <Text>{profile.email}</Text>
                </div>
                <Text className="text-xs text-gray-500 mt-1">
                  Email cannot be changed from this page
                </Text>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <TextField.Root
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="Enter phone number"
                  />
                ) : (
                  <div className="flex items-center p-3 bg-gray-50 rounded-md">
                    <Phone className="w-4 h-4 text-gray-400 mr-3" />
                    <Text>{profile.phone || 'Not provided'}</Text>
                  </div>
                )}
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                {isEditing ? (
                  <TextField.Root
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Enter address"
                  />
                ) : (
                  <div className="flex items-center p-3 bg-gray-50 rounded-md">
                    <MapPin className="w-4 h-4 text-gray-400 mr-3" />
                    <Text>{profile.address || 'Not provided'}</Text>
                  </div>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                {isEditing ? (
                  <TextField.Root
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        date_of_birth: e.target.value,
                      })
                    }
                  />
                ) : (
                  <div className="flex items-center p-3 bg-gray-50 rounded-md">
                    <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                    <Text>
                      {profile.date_of_birth
                        ? new Date(profile.date_of_birth).toLocaleDateString()
                        : 'Not provided'}
                    </Text>
                  </div>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <div className="flex items-center p-3 bg-gray-50 rounded-md">
                  <Shield className="w-4 h-4 text-gray-400 mr-3" />
                  <Text className="capitalize">{profile.role}</Text>
                </div>
                <Text className="text-xs text-gray-500 mt-1">
                  Role is managed by administrators
                </Text>
              </div>
            </div>
          </Card>

          {/* Account Settings */}
          <Card className="p-6 mt-6">
            <Heading size="4" className="mb-6">
              Account Settings
            </Heading>

            <div className="space-y-6">
              <div className="flex items-start justify-between py-2">
                <div className="flex-1 mr-8">
                  <Text className="font-medium mb-2">Email Notifications</Text>
                  <Text className="text-sm text-gray-600">
                    Receive email updates about your account
                  </Text>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-start justify-between py-2">
                <div className="flex-1 mr-8">
                  <Text className="font-medium mb-2">
                    Two-Factor Authentication
                  </Text>
                  <Text className="text-sm text-gray-600">
                    Add an extra layer of security to your account
                  </Text>
                </div>
                <Switch />
              </div>

              <div className="flex items-start justify-between py-2">
                <div className="flex-1 mr-8">
                  <Text className="font-medium mb-2">Dark Mode</Text>
                  <Text className="text-sm text-gray-600">
                    Switch between light and dark themes
                  </Text>
                </div>
                <Switch />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
