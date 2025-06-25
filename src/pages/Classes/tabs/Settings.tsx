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
  Clock,
  Users,
  BookOpen,
  Calendar,
  Bell,
  Save,
  RotateCcw,
  MapPin,
} from 'lucide-react';
import { SkeletonCard, SkeletonText } from 'components/ui/Skeleton';

export function Settings({
  isLoading = false,
}: {
  isLoading?: boolean;
}): JSX.Element {
  const [autoCreateSchedule, setAutoCreateSchedule] = useState(true);
  const [allowOverlapping, setAllowOverlapping] = useState(false);
  const [requireApproval, setRequireApproval] = useState(true);
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [defaultDuration, setDefaultDuration] = useState('45');
  const [breakTime, setBreakTime] = useState('15');
  const [maxStudents, setMaxStudents] = useState('30');
  const [defaultRoom, setDefaultRoom] = useState('Room 101');

  const handleSaveSettings = () => {
    console.log('Saving classes settings...');
    // Implementation would save settings to backend
  };

  const handleResetSettings = () => {
    console.log('Resetting to default settings...');
    // Implementation would reset to default values
    setAutoCreateSchedule(true);
    setAllowOverlapping(false);
    setRequireApproval(true);
    setEnableNotifications(true);
    setDefaultDuration('45');
    setBreakTime('15');
    setMaxStudents('30');
    setDefaultRoom('Room 101');
  };

  if (isLoading) {
    return (
      <Box className="space-y-8">
        <SkeletonCard height={80} />
        <div className="grid grid-cols-2 gap-8">
          <SkeletonCard height={320} />
          <SkeletonCard height={320} />
        </div>
      </Box>
    );
  }

  return (
    <Box className="space-y-8">
      {/* Settings Header */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <Flex justify="between" align="center">
            <Box>
              <Heading size="5" className="text-gray-900 mb-1">
                Classes Settings
              </Heading>
              <Text size="3" className="text-gray-600">
                Configure class scheduling preferences and management policies
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
                className="bg-blue-600 hover:bg-blue-700"
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
          <Box className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
            <Flex align="center" gap="3">
              <Box className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <SettingsIcon className="w-5 h-5 text-green-600" />
              </Box>
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  General Settings
                </Heading>
                <Text size="2" className="text-gray-600">
                  Basic class management configuration
                </Text>
              </Box>
            </Flex>
          </Box>

          <Box className="p-6">
            <Flex direction="column" gap="6">
              {/* Auto Create Schedule */}
              <Flex justify="between" align="center">
                <Box>
                  <Text
                    size="2"
                    weight="medium"
                    className="text-gray-900 block"
                  >
                    Auto-create schedule
                  </Text>
                  <Text size="1" className="text-gray-600">
                    Automatically generate class schedules based on preferences
                  </Text>
                </Box>
                <Switch
                  checked={autoCreateSchedule}
                  onCheckedChange={setAutoCreateSchedule}
                  size="2"
                />
              </Flex>

              {/* Allow Overlapping */}
              <Flex justify="between" align="center">
                <Box>
                  <Text
                    size="2"
                    weight="medium"
                    className="text-gray-900 block"
                  >
                    Allow overlapping classes
                  </Text>
                  <Text size="1" className="text-gray-600">
                    Permit scheduling of overlapping class sessions
                  </Text>
                </Box>
                <Switch
                  checked={allowOverlapping}
                  onCheckedChange={setAllowOverlapping}
                  size="2"
                />
              </Flex>

              {/* Require Approval */}
              <Flex justify="between" align="center">
                <Box>
                  <Text
                    size="2"
                    weight="medium"
                    className="text-gray-900 block"
                  >
                    Require schedule approval
                  </Text>
                  <Text size="1" className="text-gray-600">
                    New schedules need administrator approval
                  </Text>
                </Box>
                <Switch
                  checked={requireApproval}
                  onCheckedChange={setRequireApproval}
                  size="2"
                />
              </Flex>

              {/* Enable Notifications */}
              <Flex justify="between" align="center">
                <Box>
                  <Text
                    size="2"
                    weight="medium"
                    className="text-gray-900 block"
                  >
                    Enable notifications
                  </Text>
                  <Text size="1" className="text-gray-600">
                    Send notifications for schedule changes
                  </Text>
                </Box>
                <Switch
                  checked={enableNotifications}
                  onCheckedChange={setEnableNotifications}
                  size="2"
                />
              </Flex>
            </Flex>
          </Box>
        </RadixCard>

        {/* Schedule Settings */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-100">
            <Flex align="center" gap="3">
              <Box className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-600" />
              </Box>
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Schedule Settings
                </Heading>
                <Text size="2" className="text-gray-600">
                  Configure timing and duration preferences
                </Text>
              </Box>
            </Flex>
          </Box>

          <Box className="p-6">
            <Flex direction="column" gap="6">
              {/* Default Duration */}
              <Box>
                <Text
                  size="2"
                  weight="medium"
                  className="text-gray-900 mb-2 block"
                >
                  Default class duration (minutes)
                </Text>
                <Text size="1" className="text-gray-600 mb-3 block">
                  Standard duration for new class sessions
                </Text>
                <TextField.Root
                  value={defaultDuration}
                  onChange={(e) => setDefaultDuration(e.target.value)}
                  size="2"
                  placeholder="45"
                />
              </Box>

              {/* Break Time */}
              <Box>
                <Text
                  size="2"
                  weight="medium"
                  className="text-gray-900 mb-2 block"
                >
                  Break time between classes (minutes)
                </Text>
                <Text size="1" className="text-gray-600 mb-3 block">
                  Minimum gap between consecutive classes
                </Text>
                <TextField.Root
                  value={breakTime}
                  onChange={(e) => setBreakTime(e.target.value)}
                  size="2"
                  placeholder="15"
                />
              </Box>

              {/* Max Students */}
              <Box>
                <Text
                  size="2"
                  weight="medium"
                  className="text-gray-900 mb-2 block"
                >
                  Maximum students per class
                </Text>
                <Text size="1" className="text-gray-600 mb-3 block">
                  Default capacity limit for new classes
                </Text>
                <TextField.Root
                  value={maxStudents}
                  onChange={(e) => setMaxStudents(e.target.value)}
                  size="2"
                  placeholder="30"
                />
              </Box>
            </Flex>
          </Box>
        </RadixCard>
      </Grid>

      {/* Class Types Configuration */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
          <Flex align="center" gap="3">
            <Box className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-orange-600" />
            </Box>
            <Box>
              <Heading size="4" className="text-gray-900 mb-1">
                Class Types Configuration
              </Heading>
              <Text size="2" className="text-gray-600">
                Configure available class types and their settings
              </Text>
            </Box>
          </Flex>
        </Box>

        <Box className="p-6">
          <Grid columns="3" gap="6">
            {/* Lecture */}
            <Box className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors">
              <Flex align="center" gap="3" className="mb-3">
                <BookOpen className="w-6 h-6 text-orange-600" />
                <Text size="2" weight="medium" className="text-gray-900">
                  Lecture
                </Text>
              </Flex>
              <Text size="1" className="text-gray-600 mb-4">
                Traditional classroom lectures
              </Text>
              <Flex justify="between" align="center">
                <Text size="1" className="text-green-600 font-medium">
                  Enabled
                </Text>
                <Switch checked={true} size="1" />
              </Flex>
            </Box>

            {/* Lab Session */}
            <Box className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors">
              <Flex align="center" gap="3" className="mb-3">
                <Users className="w-6 h-6 text-blue-600" />
                <Text size="2" weight="medium" className="text-gray-900">
                  Lab Session
                </Text>
              </Flex>
              <Text size="1" className="text-gray-600 mb-4">
                Hands-on laboratory sessions
              </Text>
              <Flex justify="between" align="center">
                <Text size="1" className="text-green-600 font-medium">
                  Enabled
                </Text>
                <Switch checked={true} size="1" />
              </Flex>
            </Box>

            {/* Tutorial */}
            <Box className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors">
              <Flex align="center" gap="3" className="mb-3">
                <Calendar className="w-6 h-6 text-purple-600" />
                <Text size="2" weight="medium" className="text-gray-900">
                  Tutorial
                </Text>
              </Flex>
              <Text size="1" className="text-gray-600 mb-4">
                Small group tutorial sessions
              </Text>
              <Flex justify="between" align="center">
                <Text size="1" className="text-green-600 font-medium">
                  Enabled
                </Text>
                <Switch checked={true} size="1" />
              </Flex>
            </Box>
          </Grid>
        </Box>
      </RadixCard>

      {/* Room & Location Settings */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-cyan-50 to-blue-50 border-b border-cyan-100">
          <Flex align="center" gap="3">
            <Box className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-cyan-600" />
            </Box>
            <Box>
              <Heading size="4" className="text-gray-900 mb-1">
                Room & Location Settings
              </Heading>
              <Text size="2" className="text-gray-600">
                Configure default rooms and location preferences
              </Text>
            </Box>
          </Flex>
        </Box>

        <Box className="p-6">
          <Grid columns="2" gap="6">
            <Box>
              <Text
                size="2"
                weight="medium"
                className="text-gray-900 mb-2 block"
              >
                Default classroom
              </Text>
              <Text size="1" className="text-gray-600 mb-3 block">
                Default room assignment for new classes
              </Text>
              <Select.Root
                value={defaultRoom}
                onValueChange={setDefaultRoom}
                size="2"
              >
                <Select.Trigger className="w-full" />
                <Select.Content>
                  <Select.Item value="Room 101">Room 101</Select.Item>
                  <Select.Item value="Room 102">Room 102</Select.Item>
                  <Select.Item value="Lab A">Computer Lab A</Select.Item>
                  <Select.Item value="Lab B">Computer Lab B</Select.Item>
                  <Select.Item value="Auditorium">Main Auditorium</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>

            <Box>
              <Text
                size="2"
                weight="medium"
                className="text-gray-900 mb-2 block"
              >
                Room booking priority
              </Text>
              <Text size="1" className="text-gray-600 mb-3 block">
                Priority level for automatic room booking
              </Text>
              <Select.Root defaultValue="medium" size="2">
                <Select.Trigger className="w-full" />
                <Select.Content>
                  <Select.Item value="low">Low Priority</Select.Item>
                  <Select.Item value="medium">Medium Priority</Select.Item>
                  <Select.Item value="high">High Priority</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>
          </Grid>
        </Box>
      </RadixCard>

      {/* Notification Settings */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-pink-50 to-rose-50 border-b border-pink-100">
          <Flex align="center" gap="3">
            <Box className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-pink-600" />
            </Box>
            <Box>
              <Heading size="4" className="text-gray-900 mb-1">
                Notification Settings
              </Heading>
              <Text size="2" className="text-gray-600">
                Configure when and how notifications are sent
              </Text>
            </Box>
          </Flex>
        </Box>

        <Box className="p-6">
          <Grid columns="2" gap="6">
            <Box>
              <Text
                size="2"
                weight="medium"
                className="text-gray-900 mb-2 block"
              >
                Notify before class (minutes)
              </Text>
              <Text size="1" className="text-gray-600 mb-3 block">
                Send reminder notifications before class starts
              </Text>
              <TextField.Root defaultValue="15" size="2" placeholder="15" />
            </Box>

            <Box>
              <Text
                size="2"
                weight="medium"
                className="text-gray-900 mb-2 block"
              >
                Notification method
              </Text>
              <Text size="1" className="text-gray-600 mb-3 block">
                Preferred method for sending notifications
              </Text>
              <Select.Root defaultValue="email" size="2">
                <Select.Trigger className="w-full" />
                <Select.Content>
                  <Select.Item value="email">Email Only</Select.Item>
                  <Select.Item value="sms">SMS Only</Select.Item>
                  <Select.Item value="both">Email & SMS</Select.Item>
                  <Select.Item value="app">App Notification</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>
          </Grid>
        </Box>
      </RadixCard>
    </Box>
  );
}
