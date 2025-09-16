import { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Heading,
  Badge,
  Grid,
  Switch,
  Select,
} from '@radix-ui/themes';
import { DashboardLayout } from 'components/layout/DashboardLayout';
import { PageHeader } from 'components/ui/PageHeader';
import en from 'i18n/en.json';
import { RadixCard } from 'components/ui/RadixCard';
import { RadixButton } from 'components/ui/RadixButton';
import { TabContainer } from 'components/ui/TabContainer';
import {
  ModernStatsGridColored,
  ColoredStatItem,
} from 'components/ui/ModernStatsGridColored';
import {
  Building,
  Users,
  MapPin,
  Clock,
  Phone,
  Mail,
  Globe,
  FileText,
  Edit,
  Plus,
  Save,
  Upload,
  Eye,
  ChevronRight,
  Building2,
  GraduationCap,
  BookOpen,
  Target,
  Award,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Info,
} from 'lucide-react';
import { useTabRouting } from 'lib/useTabRouting';
import { Plan } from 'types/access';
import { FeatureGate } from 'components/guards/FeatureGate';
import { SkeletonCard } from 'components/ui/Skeleton';

interface Department {
  id: string;
  name: string;
  head: string;
  headEmail: string;
  studentCount: number;
  instructorCount: number;
  status: 'active' | 'inactive';
  budget: number;
  location: string;
}

interface Location {
  id: string;
  name: string;
  type: 'campus' | 'building' | 'room';
  capacity: number;
  address: string;
  facilities: string[];
  status: 'active' | 'maintenance' | 'inactive';
}

interface OrganizationSettings {
  name: string;
  type: string;
  establishedYear: number;
  accreditation: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logo: string;
  timezone: string;
  academicYear: string;
  currency: string;
}

export function OrganizationPage(): JSX.Element {
  // Use tab routing instead of local state
  const { activeTab, setActiveTab } = useTabRouting({
    defaultTab: 'overview',
    validTabs: ['overview', 'departments', 'locations', 'settings'],
    basePath: '/organization',
  });

  const [editMode, setEditMode] = useState(false);
  const [isLoading] = useState(false); // Mock loading state

  const departments: Department[] = [
    {
      id: '1',
      name: 'Computer Science',
      head: 'Dr. Sarah Johnson',
      headEmail: 'sarah.johnson@edverse.edu',
      studentCount: 245,
      instructorCount: 18,
      status: 'active',
      budget: 125000,
      location: 'Technology Building',
    },
    {
      id: '2',
      name: 'Mathematics',
      head: 'Prof. Michael Chen',
      headEmail: 'michael.chen@edverse.edu',
      studentCount: 189,
      instructorCount: 15,
      status: 'active',
      budget: 98000,
      location: 'Science Building',
    },
    {
      id: '3',
      name: 'English Literature',
      head: 'Dr. Emily Rodriguez',
      headEmail: 'emily.rodriguez@edverse.edu',
      studentCount: 156,
      instructorCount: 12,
      status: 'active',
      budget: 87000,
      location: 'Humanities Building',
    },
    {
      id: '4',
      name: 'Business Administration',
      head: 'Dr. James Wilson',
      headEmail: 'james.wilson@edverse.edu',
      studentCount: 198,
      instructorCount: 14,
      status: 'active',
      budget: 110000,
      location: 'Business Center',
    },
  ];

  const locations: Location[] = [
    {
      id: '1',
      name: 'Main Campus',
      type: 'campus',
      capacity: 2000,
      address: '123 Education Ave, Academic City, AC 12345',
      facilities: ['Library', 'Cafeteria', 'Gym', 'Auditorium', 'Parking'],
      status: 'active',
    },
    {
      id: '2',
      name: 'Technology Building',
      type: 'building',
      capacity: 500,
      address: 'Building A, Main Campus',
      facilities: ['Computer Labs', 'Research Center', 'Conference Rooms'],
      status: 'active',
    },
    {
      id: '3',
      name: 'Science Building',
      type: 'building',
      capacity: 400,
      address: 'Building B, Main Campus',
      facilities: ['Laboratories', 'Equipment Room', 'Study Areas'],
      status: 'maintenance',
    },
  ];

  const [orgSettings] = useState<OrganizationSettings>({
    name: 'EdVerse University',
    type: 'University',
    establishedYear: 1995,
    accreditation: 'AACSB International',
    address: '123 Education Avenue, Academic City, AC 12345',
    phone: '+1 (555) 123-4567',
    email: 'info@edverse.edu',
    website: 'https://www.edverse.edu',
    logo: '',
    timezone: 'America/New_York',
    academicYear: '2023-2024',
    currency: 'USD',
  });

  // Calculate organization stats
  const totalStudents = departments.reduce(
    (sum, dept) => sum + dept.studentCount,
    0
  );
  const totalInstructors = departments.reduce(
    (sum, dept) => sum + dept.instructorCount,
    0
  );
  const totalBudget = departments.reduce((sum, dept) => sum + dept.budget, 0);
  const activeDepartments = departments.filter(
    (dept) => dept.status === 'active'
  ).length;

  const organizationStats: ColoredStatItem[] = [
    {
      title: 'Total Students',
      value: totalStudents,
      icon: GraduationCap,
      gradient: {
        from: 'from-blue-50',
        to: 'to-indigo-50',
      },
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-100',
      trend: {
        icon: TrendingUp,
        value: '+12% this year',
        color: 'text-green-600',
      },
    },
    {
      title: 'Total Faculty',
      value: totalInstructors,
      icon: Users,
      gradient: {
        from: 'from-green-50',
        to: 'to-emerald-50',
      },
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-100',
      trend: {
        icon: TrendingUp,
        value: '+8% this year',
        color: 'text-green-600',
      },
    },
    {
      title: 'Active Departments',
      value: activeDepartments,
      icon: Building2,
      gradient: {
        from: 'from-purple-50',
        to: 'to-violet-50',
      },
      iconColor: 'text-purple-600',
      iconBgColor: 'bg-purple-100',
      trend: {
        icon: CheckCircle,
        value: 'All operational',
        color: 'text-green-600',
      },
    },
    {
      title: 'Total Budget',
      value: `$${(totalBudget / 1000).toFixed(0)}K`,
      icon: Target,
      gradient: {
        from: 'from-orange-50',
        to: 'to-amber-50',
      },
      iconColor: 'text-orange-600',
      iconBgColor: 'bg-orange-100',
      trend: {
        icon: Award,
        value: 'Well allocated',
        color: 'text-green-600',
      },
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'maintenance':
        return 'orange';
      case 'inactive':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'maintenance':
        return <Clock className="w-4 h-4" />;
      case 'inactive':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const tabs = [
    {
      value: 'overview',
      label: 'Overview',
      content: (
        <Box className="space-y-6">
          {/* Institution Information */}
          <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
            <Box className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
              <Flex justify="between" align="center">
                <Box>
                  <Heading size="4" className="text-gray-900 mb-1">
                    {en.pages.organization.institution_info}
                  </Heading>
                  <Text size="2" className="text-gray-600">
                    {en.pages.organization.institution_info_sub}
                  </Text>
                </Box>
                <RadixButton
                  variant="soft"
                  size="2"
                  className="bg-white/70 hover:bg-white"
                  onClick={() => setEditMode(!editMode)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  {editMode ? 'Cancel' : 'Edit'}
                </RadixButton>
              </Flex>
            </Box>

            <Box className="p-6">
              <Grid columns="2" gap="6">
                <Box className="space-y-4">
                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 mb-2 block"
                    >
                      Institution Name
                    </Text>
                    <Text size="3" className="text-gray-700">
                      {orgSettings.name}
                    </Text>
                  </Box>
                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 mb-2 block"
                    >
                      Type
                    </Text>
                    <Badge color="blue" variant="soft" size="2">
                      {orgSettings.type}
                    </Badge>
                  </Box>
                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 mb-2 block"
                    >
                      Established
                    </Text>
                    <Text size="2" className="text-gray-700">
                      {orgSettings.establishedYear}
                    </Text>
                  </Box>
                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 mb-2 block"
                    >
                      Accreditation
                    </Text>
                    <Badge color="green" variant="soft" size="2">
                      {orgSettings.accreditation}
                    </Badge>
                  </Box>
                </Box>

                <Box className="space-y-4">
                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 mb-2 block"
                    >
                      Address
                    </Text>
                    <Text size="2" className="text-gray-700">
                      {orgSettings.address}
                    </Text>
                  </Box>
                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 mb-2 block"
                    >
                      Contact Information
                    </Text>
                    <Box className="space-y-2">
                      <Flex align="center" gap="2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <Text size="2" className="text-gray-700">
                          {orgSettings.phone}
                        </Text>
                      </Flex>
                      <Flex align="center" gap="2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <Text size="2" className="text-gray-700">
                          {orgSettings.email}
                        </Text>
                      </Flex>
                      <Flex align="center" gap="2">
                        <Globe className="w-4 h-4 text-gray-500" />
                        <Text size="2" className="text-gray-700">
                          {orgSettings.website}
                        </Text>
                      </Flex>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Box>
          </RadixCard>

          {/* Quick Actions */}
          <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
            <Box className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
              <Heading size="4" className="text-gray-900 mb-1">
                {en.pages.organization.quick_actions}
              </Heading>
              <Text size="2" className="text-gray-600">
                {en.pages.organization.quick_actions_sub}
              </Text>
            </Box>

            <Box className="p-6">
              <Grid columns="4" gap="4">
                <RadixButton
                  variant="outline"
                  size="3"
                  className="h-20 flex-col gap-2"
                >
                  <Plus className="w-6 h-6" />
                  <Text size="2">{en.cta.add_department}</Text>
                </RadixButton>
                <RadixButton
                  variant="outline"
                  size="3"
                  className="h-20 flex-col gap-2"
                >
                  <MapPin className="w-6 h-6" />
                  <Text size="2">{en.cta.manage_locations}</Text>
                </RadixButton>
                <RadixButton
                  variant="outline"
                  size="3"
                  className="h-20 flex-col gap-2"
                >
                  <FileText className="w-6 h-6" />
                  <Text size="2">{en.cta.generate_report}</Text>
                </RadixButton>
                <RadixButton
                  variant="outline"
                  size="3"
                  className="h-20 flex-col gap-2"
                >
                  <Upload className="w-6 h-6" />
                  <Text size="2">{en.cta.import_data}</Text>
                </RadixButton>
              </Grid>
            </Box>
          </RadixCard>
        </Box>
      ),
    },
    {
      value: 'departments',
      label: 'Departments',
      content: (
        <Box className="space-y-6">
          <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
            <Box className="p-6 bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-100">
              <Flex justify="between" align="center">
                <Box>
                  <Heading size="4" className="text-gray-900 mb-1">
                    Academic Departments
                  </Heading>
                  <Text size="2" className="text-gray-600">
                    Manage departments, faculty, and academic structure
                  </Text>
                </Box>
                <Badge color="purple" variant="soft" size="2">
                  {departments.length} Departments
                </Badge>
              </Flex>
            </Box>

            <Box className="p-6">
              <Box className="space-y-4">
                {departments.map((department) => (
                  <Box
                    key={department.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
                  >
                    <Flex justify="between" align="start">
                      <Flex align="start" gap="4">
                        <Box className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-purple-600" />
                        </Box>
                        <Box className="flex-1">
                          <Flex align="center" gap="2" className="mb-2">
                            <Heading size="3" className="text-gray-900">
                              {department.name}
                            </Heading>
                            <Badge
                              color={getStatusColor(department.status)}
                              variant="soft"
                              size="1"
                            >
                              <Box className="mr-1">
                                {getStatusIcon(department.status)}
                              </Box>
                              {department.status}
                            </Badge>
                          </Flex>
                          <Text size="2" className="text-gray-600 mb-2">
                            Head: {department.head} • {department.headEmail}
                          </Text>
                          <Flex align="center" gap="4">
                            <Flex align="center" gap="1">
                              <GraduationCap className="w-4 h-4 text-gray-500" />
                              <Text size="2" className="text-gray-600">
                                {department.studentCount} students
                              </Text>
                            </Flex>
                            <Flex align="center" gap="1">
                              <Users className="w-4 h-4 text-gray-500" />
                              <Text size="2" className="text-gray-600">
                                {department.instructorCount} faculty
                              </Text>
                            </Flex>
                            <Flex align="center" gap="1">
                              <MapPin className="w-4 h-4 text-gray-500" />
                              <Text size="2" className="text-gray-600">
                                {department.location}
                              </Text>
                            </Flex>
                            <Flex align="center" gap="1">
                              <Target className="w-4 h-4 text-gray-500" />
                              <Text size="2" className="text-gray-600">
                                ${department.budget.toLocaleString()} budget
                              </Text>
                            </Flex>
                          </Flex>
                        </Box>
                      </Flex>
                      <Flex align="center" gap="2">
                        <RadixButton variant="ghost" size="1">
                          <Eye className="w-4 h-4" />
                        </RadixButton>
                        <RadixButton variant="ghost" size="1">
                          <Edit className="w-4 h-4" />
                        </RadixButton>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </Flex>
                    </Flex>
                  </Box>
                ))}
              </Box>
            </Box>
          </RadixCard>
        </Box>
      ),
    },
    {
      value: 'locations',
      label: 'Locations',
      content: (
        <Box className="space-y-6">
          <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
            <Box className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
              <Flex justify="between" align="center">
                <Box>
                  <Heading size="4" className="text-gray-900 mb-1">
                    {en.pages.organization.campus_locations}
                  </Heading>
                  <Text size="2" className="text-gray-600">
                    {en.pages.organization.locations_sub}
                  </Text>
                </Box>
                <Badge color="orange" variant="soft" size="2">
                  {locations.length} Locations
                </Badge>
              </Flex>
            </Box>

            <Box className="p-6">
              <Box className="space-y-4">
                {locations.map((location) => (
                  <Box
                    key={location.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors"
                  >
                    <Flex justify="between" align="start">
                      <Flex align="start" gap="4">
                        <Box className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Building className="w-6 h-6 text-orange-600" />
                        </Box>
                        <Box className="flex-1">
                          <Flex align="center" gap="2" className="mb-2">
                            <Heading size="3" className="text-gray-900">
                              {location.name}
                            </Heading>
                            <Badge color="blue" variant="soft" size="1">
                              {location.type}
                            </Badge>
                            <Badge
                              color={getStatusColor(location.status)}
                              variant="soft"
                              size="1"
                            >
                              <Box className="mr-1">
                                {getStatusIcon(location.status)}
                              </Box>
                              {location.status}
                            </Badge>
                          </Flex>
                          <Text size="2" className="text-gray-600 mb-2">
                            {location.address}
                          </Text>
                          <Flex align="center" gap="4" className="mb-2">
                            <Flex align="center" gap="1">
                              <Users className="w-4 h-4 text-gray-500" />
                              <Text size="2" className="text-gray-600">
                                Capacity: {location.capacity}
                              </Text>
                            </Flex>
                          </Flex>
                          <Box>
                            <Text
                              size="2"
                              weight="medium"
                              className="text-gray-900 mb-1"
                            >
                              Facilities:
                            </Text>
                            <Flex gap="1" wrap="wrap">
                              {location.facilities.map((facility, index) => (
                                <Badge
                                  key={index}
                                  color="gray"
                                  variant="soft"
                                  size="1"
                                >
                                  {facility}
                                </Badge>
                              ))}
                            </Flex>
                          </Box>
                        </Box>
                      </Flex>
                      <Flex align="center" gap="2">
                        <RadixButton variant="ghost" size="1">
                          <Eye className="w-4 h-4" />
                        </RadixButton>
                        <RadixButton variant="ghost" size="1">
                          <Edit className="w-4 h-4" />
                        </RadixButton>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </Flex>
                    </Flex>
                  </Box>
                ))}
              </Box>
            </Box>
          </RadixCard>
        </Box>
      ),
    },
    {
      value: 'settings',
      label: 'Settings',
      content: (
        <Box className="space-y-6">
          <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
            <Box className="p-6 bg-gradient-to-r from-red-50 to-pink-50 border-b border-red-100">
              <Flex justify="between" align="center">
                <Box>
                  <Heading size="4" className="text-gray-900 mb-1">
                    {en.pages.organization.school_settings}
                  </Heading>
                  <Text size="2" className="text-gray-600">
                    {en.pages.organization.settings_sub}
                  </Text>
                </Box>
                <RadixButton
                  variant="soft"
                  size="2"
                  className="bg-white/70 hover:bg-white"
                >
                  <Save className="w-4 h-4 mr-1" />
                  {en.cta.save_changes}
                </RadixButton>
              </Flex>
            </Box>

            <Box className="p-6">
              <Grid columns="2" gap="6">
                <Box className="space-y-4">
                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 mb-2 block"
                    >
                      Academic Year
                    </Text>
                    <Select.Root value={orgSettings.academicYear}>
                      <Select.Trigger className="w-full" />
                      <Select.Content>
                        <Select.Item value="2023-2024">2023-2024</Select.Item>
                        <Select.Item value="2024-2025">2024-2025</Select.Item>
                      </Select.Content>
                    </Select.Root>
                  </Box>
                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 mb-2 block"
                    >
                      Timezone
                    </Text>
                    <Select.Root value={orgSettings.timezone}>
                      <Select.Trigger className="w-full" />
                      <Select.Content>
                        <Select.Item value="America/New_York">
                          Eastern Time
                        </Select.Item>
                        <Select.Item value="America/Chicago">
                          Central Time
                        </Select.Item>
                        <Select.Item value="America/Denver">
                          Mountain Time
                        </Select.Item>
                        <Select.Item value="America/Los_Angeles">
                          Pacific Time
                        </Select.Item>
                      </Select.Content>
                    </Select.Root>
                  </Box>
                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 mb-2 block"
                    >
                      Currency
                    </Text>
                    <Select.Root value={orgSettings.currency}>
                      <Select.Trigger className="w-full" />
                      <Select.Content>
                        <Select.Item value="USD">USD - US Dollar</Select.Item>
                        <Select.Item value="EUR">EUR - Euro</Select.Item>
                        <Select.Item value="GBP">
                          GBP - British Pound
                        </Select.Item>
                      </Select.Content>
                    </Select.Root>
                  </Box>
                </Box>

                <Box className="space-y-4">
                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 mb-2 block"
                    >
                      Notification Settings
                    </Text>
                    <Box className="space-y-3">
                      <Flex justify="between" align="center">
                        <Text size="2" className="text-gray-700">
                          Email Notifications
                        </Text>
                        <Switch checked={true} size="2" />
                      </Flex>
                      <Flex justify="between" align="center">
                        <Text size="2" className="text-gray-700">
                          SMS Notifications
                        </Text>
                        <Switch checked={false} size="2" />
                      </Flex>
                      <Flex justify="between" align="center">
                        <Text size="2" className="text-gray-700">
                          Push Notifications
                        </Text>
                        <Switch checked={true} size="2" />
                      </Flex>
                    </Box>
                  </Box>
                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 mb-2 block"
                    >
                      Security Settings
                    </Text>
                    <Box className="space-y-3">
                      <Flex justify="between" align="center">
                        <Text size="2" className="text-gray-700">
                          Two-Factor Authentication
                        </Text>
                        <Switch checked={true} size="2" />
                      </Flex>
                      <Flex justify="between" align="center">
                        <Text size="2" className="text-gray-700">
                          Password Complexity
                        </Text>
                        <Switch checked={true} size="2" />
                      </Flex>
                      <Flex justify="between" align="center">
                        <Text size="2" className="text-gray-700">
                          Session Timeout
                        </Text>
                        <Switch checked={false} size="2" />
                      </Flex>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Box>
          </RadixCard>
        </Box>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title={en.labels.school}
        description={en.pages.organization.description}
        actions={[
          {
            label: 'Add Department',
            icon: Plus,
            onClick: () => console.log('Add department clicked'),
            isPrimary: true,
            gate: { cap: 'org.manage', neededPlan: 'starter' as Plan },
          },
        ]}
      />

      <FeatureGate
        feature="analytics.view"
        neededPlan="growth"
        showUpgradeHint={false}
      >
        {isLoading ? (
          <div className="grid grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} height="120px" />
            ))}
          </div>
        ) : (
          <ModernStatsGridColored
            stats={organizationStats}
            columns="4"
            gap="6"
            isLoading={false}
          />
        )}
      </FeatureGate>

      <TabContainer
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </DashboardLayout>
  );
}
