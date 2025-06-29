import { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Heading,
  Grid,
  Switch,
  TextField,
  Select,
} from '@radix-ui/themes';
import { RadixCard } from 'components/ui/RadixCard';
import { RadixButton } from 'components/ui/RadixButton';
import {
  Settings as SettingsIcon,
  Users,
  Bell,
  Calendar,
  FileText,
  CheckCircle,
  Save,
  RotateCcw,
  GraduationCap,
  Mail,
  Clock,
} from 'lucide-react';
import { SkeletonCard } from '../../../components/ui/Skeleton';

export function Settings({
  isLoading = false,
}: {
  isLoading?: boolean;
}): JSX.Element {
  const [autoReviewEnabled, setAutoReviewEnabled] = useState(true);
  const [requireDocuments, setRequireDocuments] = useState(true);
  const [enableWaitlist, setEnableWaitlist] = useState(true);
  const [allowSelfRegistration, setAllowSelfRegistration] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [reviewThreshold, setReviewThreshold] = useState('80');
  const [applicationDeadlineDays, setApplicationDeadlineDays] = useState('30');
  const [maxApplicationsPerUser, setMaxApplicationsPerUser] = useState('3');
  const [defaultApplicationStatus, setDefaultApplicationStatus] =
    useState('pending');

  const handleSaveSettings = () => {
    console.log('Saving admission settings...');
    // Implementation would save settings to backend
  };

  const handleResetSettings = () => {
    console.log('Resetting to default settings...');
    // Implementation would reset to default values
    setAutoReviewEnabled(true);
    setRequireDocuments(true);
    setEnableWaitlist(true);
    setAllowSelfRegistration(false);
    setEmailNotifications(true);
    setSmsNotifications(false);
    setReviewThreshold('80');
    setApplicationDeadlineDays('30');
    setMaxApplicationsPerUser('3');
    setDefaultApplicationStatus('pending');
  };

  if (isLoading) {
    return (
      <Box className="space-y-8">
        <SkeletonCard height="80px" />
        <div className="grid grid-cols-2 gap-8">
          <SkeletonCard height="320px" />
          <SkeletonCard height="320px" />
        </div>
      </Box>
    );
  }

  return (
    <Box className="space-y-8">
      {/* Settings Header */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100">
          <Flex justify="between" align="center">
            <Box>
              <Heading size="5" className="text-gray-900 mb-1">
                Admission Settings
              </Heading>
              <Text size="3" className="text-gray-600">
                Configure admission process preferences and application policies
              </Text>
            </Box>
            <Flex gap="2">
              <RadixButton
                variant="soft"
                size="2"
                onClick={handleResetSettings}
                className="bg-white/70 hover:bg-white"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </RadixButton>
              <RadixButton
                variant="solid"
                size="2"
                onClick={handleSaveSettings}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Save className="w-4 h-4 mr-1" />
                Save Settings
              </RadixButton>
            </Flex>
          </Flex>
        </Box>
      </RadixCard>

      <Grid columns="2" gap="8">
        {/* General Settings */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
            <Flex align="center" gap="3">
              <Box className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <SettingsIcon className="w-5 h-5 text-blue-600" />
              </Box>
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  General Settings
                </Heading>
                <Text size="2" className="text-gray-600">
                  Basic admission process configuration
                </Text>
              </Box>
            </Flex>
          </Box>

          <Box className="p-6">
            <Flex direction="column" gap="6">
              {/* Auto Review */}
              <Flex justify="between" align="center">
                <Box>
                  <Text
                    size="2"
                    weight="medium"
                    className="text-gray-900 block"
                  >
                    Auto-review applications
                  </Text>
                  <Text size="1" className="text-gray-600">
                    Automatically review applications meeting criteria
                  </Text>
                </Box>
                <Switch
                  checked={autoReviewEnabled}
                  onCheckedChange={setAutoReviewEnabled}
                  size="2"
                />
              </Flex>

              {/* Require Documents */}
              <Flex justify="between" align="center">
                <Box>
                  <Text
                    size="2"
                    weight="medium"
                    className="text-gray-900 block"
                  >
                    Require supporting documents
                  </Text>
                  <Text size="1" className="text-gray-600">
                    Applications must include required documents
                  </Text>
                </Box>
                <Switch
                  checked={requireDocuments}
                  onCheckedChange={setRequireDocuments}
                  size="2"
                />
              </Flex>

              {/* Enable Waitlist */}
              <Flex justify="between" align="center">
                <Box>
                  <Text
                    size="2"
                    weight="medium"
                    className="text-gray-900 block"
                  >
                    Enable waitlist
                  </Text>
                  <Text size="1" className="text-gray-600">
                    Allow students to join waitlist when programs are full
                  </Text>
                </Box>
                <Switch
                  checked={enableWaitlist}
                  onCheckedChange={setEnableWaitlist}
                  size="2"
                />
              </Flex>

              {/* Allow Self Registration */}
              <Flex justify="between" align="center">
                <Box>
                  <Text
                    size="2"
                    weight="medium"
                    className="text-gray-900 block"
                  >
                    Allow self-registration
                  </Text>
                  <Text size="1" className="text-gray-600">
                    Students can register and apply without admin approval
                  </Text>
                </Box>
                <Switch
                  checked={allowSelfRegistration}
                  onCheckedChange={setAllowSelfRegistration}
                  size="2"
                />
              </Flex>
            </Flex>
          </Box>
        </RadixCard>

        {/* Application Settings */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
            <Flex align="center" gap="3">
              <Box className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-600" />
              </Box>
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Application Settings
                </Heading>
                <Text size="2" className="text-gray-600">
                  Configure application processing rules
                </Text>
              </Box>
            </Flex>
          </Box>

          <Box className="p-6">
            <Flex direction="column" gap="6">
              {/* Review Threshold */}
              <Box>
                <Text
                  size="2"
                  weight="medium"
                  className="text-gray-900 mb-2 block"
                >
                  Auto-review threshold (%)
                </Text>
                <Text size="1" className="text-gray-600 mb-3 block">
                  Minimum score required for automatic approval
                </Text>
                <TextField.Root
                  value={reviewThreshold}
                  onChange={(e) => setReviewThreshold(e.target.value)}
                  size="2"
                  placeholder="80"
                />
              </Box>

              {/* Application Deadline */}
              <Box>
                <Text
                  size="2"
                  weight="medium"
                  className="text-gray-900 mb-2 block"
                >
                  Application deadline (days)
                </Text>
                <Text size="1" className="text-gray-600 mb-3 block">
                  Days from application start to deadline
                </Text>
                <TextField.Root
                  value={applicationDeadlineDays}
                  onChange={(e) => setApplicationDeadlineDays(e.target.value)}
                  size="2"
                  placeholder="30"
                />
              </Box>

              {/* Max Applications */}
              <Box>
                <Text
                  size="2"
                  weight="medium"
                  className="text-gray-900 mb-2 block"
                >
                  Max applications per user
                </Text>
                <Text size="1" className="text-gray-600 mb-3 block">
                  Maximum number of applications a user can submit
                </Text>
                <TextField.Root
                  value={maxApplicationsPerUser}
                  onChange={(e) => setMaxApplicationsPerUser(e.target.value)}
                  size="2"
                  placeholder="3"
                />
              </Box>
            </Flex>
          </Box>
        </RadixCard>
      </Grid>

      {/* Review Methods */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
          <Flex align="center" gap="3">
            <Box className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-purple-600" />
            </Box>
            <Box>
              <Heading size="4" className="text-gray-900 mb-1">
                Review Methods
              </Heading>
              <Text size="2" className="text-gray-600">
                Configure available application review methods
              </Text>
            </Box>
          </Flex>
        </Box>

        <Box className="p-6">
          <Grid columns="3" gap="6">
            {/* Automated Review */}
            <Box className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
              <Flex align="center" gap="3" className="mb-3">
                <CheckCircle className="w-6 h-6 text-blue-600" />
                <Text size="2" weight="medium" className="text-gray-900">
                  Automated Review
                </Text>
              </Flex>
              <Text size="1" className="text-gray-600 mb-4">
                AI-powered automatic application scoring
              </Text>
              <Flex justify="between" align="center">
                <Text size="1" className="text-green-600 font-medium">
                  Enabled
                </Text>
                <Switch checked={true} size="1" />
              </Flex>
            </Box>

            {/* Manual Review */}
            <Box className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
              <Flex align="center" gap="3" className="mb-3">
                <Users className="w-6 h-6 text-green-600" />
                <Text size="2" weight="medium" className="text-gray-900">
                  Manual Review
                </Text>
              </Flex>
              <Text size="1" className="text-gray-600 mb-4">
                Staff manually review each application
              </Text>
              <Flex justify="between" align="center">
                <Text size="1" className="text-green-600 font-medium">
                  Enabled
                </Text>
                <Switch checked={true} size="1" />
              </Flex>
            </Box>

            {/* Interview Process */}
            <Box className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
              <Flex align="center" gap="3" className="mb-3">
                <GraduationCap className="w-6 h-6 text-orange-600" />
                <Text size="2" weight="medium" className="text-gray-900">
                  Interview Process
                </Text>
              </Flex>
              <Text size="1" className="text-gray-600 mb-4">
                Include interviews in admission process
              </Text>
              <Flex justify="between" align="center">
                <Text size="1" className="text-gray-500 font-medium">
                  Optional
                </Text>
                <Switch checked={false} size="1" />
              </Flex>
            </Box>
          </Grid>
        </Box>
      </RadixCard>

      {/* Notification Settings */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
          <Flex align="center" gap="3">
            <Box className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-orange-600" />
            </Box>
            <Box>
              <Heading size="4" className="text-gray-900 mb-1">
                Notification Settings
              </Heading>
              <Text size="2" className="text-gray-600">
                Configure notification preferences for admissions
              </Text>
            </Box>
          </Flex>
        </Box>

        <Box className="p-6">
          <Grid columns="2" gap="6">
            <Box>
              <Flex direction="column" gap="6">
                {/* Email Notifications */}
                <Flex justify="between" align="center">
                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 block"
                    >
                      Email notifications
                    </Text>
                    <Text size="1" className="text-gray-600">
                      Send admission updates via email
                    </Text>
                  </Box>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                    size="2"
                  />
                </Flex>

                {/* SMS Notifications */}
                <Flex justify="between" align="center">
                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 block"
                    >
                      SMS notifications
                    </Text>
                    <Text size="1" className="text-gray-600">
                      Send admission updates via SMS
                    </Text>
                  </Box>
                  <Switch
                    checked={smsNotifications}
                    onCheckedChange={setSmsNotifications}
                    size="2"
                  />
                </Flex>
              </Flex>
            </Box>

            <Box>
              <Text
                size="2"
                weight="medium"
                className="text-gray-900 mb-2 block"
              >
                Default application status
              </Text>
              <Text size="1" className="text-gray-600 mb-3 block">
                Initial status for new applications
              </Text>
              <Select.Root
                value={defaultApplicationStatus}
                onValueChange={setDefaultApplicationStatus}
                size="2"
              >
                <Select.Trigger className="w-full" />
                <Select.Content>
                  <Select.Item value="pending">Pending Review</Select.Item>
                  <Select.Item value="under_review">Under Review</Select.Item>
                  <Select.Item value="awaiting_documents">
                    Awaiting Documents
                  </Select.Item>
                  <Select.Item value="interview_scheduled">
                    Interview Scheduled
                  </Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>
          </Grid>
        </Box>
      </RadixCard>
    </Box>
  );
}
