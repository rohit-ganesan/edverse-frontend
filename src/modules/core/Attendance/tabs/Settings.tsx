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
  MapPin,
  Smartphone,
  Camera,
  Fingerprint,
  Save,
  RotateCcw,
} from 'lucide-react';
import { SkeletonCard } from 'components/ui/Skeleton';

export function Settings({
  isLoading = false,
}: {
  isLoading?: boolean;
}): JSX.Element {
  const [autoMarkAbsent, setAutoMarkAbsent] = useState(true);
  const [allowLateEntry, setAllowLateEntry] = useState(true);
  const [requireLocation, setRequireLocation] = useState(false);
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [graceTime, setGraceTime] = useState('15');
  const [sessionTimeout, setSessionTimeout] = useState('120');
  const [defaultLocation, setDefaultLocation] = useState('Main Campus');

  const handleSaveSettings = () => {
    console.log('Saving attendance settings...');
    // Implementation would save settings to backend
  };

  const handleResetSettings = () => {
    console.log('Resetting to default settings...');
    // Implementation would reset to default values
    setAutoMarkAbsent(true);
    setAllowLateEntry(true);
    setRequireLocation(false);
    setEnableNotifications(true);
    setGraceTime('15');
    setSessionTimeout('120');
    setDefaultLocation('Main Campus');
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
        <Box className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100">
          <Flex justify="between" align="center">
            <Box>
              <Heading size="5" className="text-gray-900 mb-1">
                Attendance Settings
              </Heading>
              <Text size="3" className="text-gray-600">
                Configure attendance tracking preferences and policies
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
                  Basic attendance tracking configuration
                </Text>
              </Box>
            </Flex>
          </Box>

          <Box className="p-6">
            <Flex direction="column" gap="6">
              {/* Auto Mark Absent */}
              <Flex justify="between" align="center">
                <Box>
                  <Text
                    size="2"
                    weight="medium"
                    className="text-gray-900 block"
                  >
                    Auto-mark absent students
                  </Text>
                  <Text size="1" className="text-gray-600">
                    Automatically mark students as absent after session ends
                  </Text>
                </Box>
                <Switch
                  checked={autoMarkAbsent}
                  onCheckedChange={setAutoMarkAbsent}
                  size="2"
                />
              </Flex>

              {/* Allow Late Entry */}
              <Flex justify="between" align="center">
                <Box>
                  <Text
                    size="2"
                    weight="medium"
                    className="text-gray-900 block"
                  >
                    Allow late entry
                  </Text>
                  <Text size="1" className="text-gray-600">
                    Students can check in after session start time
                  </Text>
                </Box>
                <Switch
                  checked={allowLateEntry}
                  onCheckedChange={setAllowLateEntry}
                  size="2"
                />
              </Flex>

              {/* Require Location */}
              <Flex justify="between" align="center">
                <Box>
                  <Text
                    size="2"
                    weight="medium"
                    className="text-gray-900 block"
                  >
                    Require location verification
                  </Text>
                  <Text size="1" className="text-gray-600">
                    Students must be within specified location to check in
                  </Text>
                </Box>
                <Switch
                  checked={requireLocation}
                  onCheckedChange={setRequireLocation}
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
                    Send notifications for attendance events
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

        {/* Time Settings */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
            <Flex align="center" gap="3">
              <Box className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-600" />
              </Box>
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Time Settings
                </Heading>
                <Text size="2" className="text-gray-600">
                  Configure timing and duration preferences
                </Text>
              </Box>
            </Flex>
          </Box>

          <Box className="p-6">
            <Flex direction="column" gap="6">
              {/* Grace Time */}
              <Box>
                <Text
                  size="2"
                  weight="medium"
                  className="text-gray-900 mb-2 block"
                >
                  Grace time (minutes)
                </Text>
                <Text size="1" className="text-gray-600 mb-3 block">
                  Time allowed for late check-in before marking as late
                </Text>
                <TextField.Root
                  value={graceTime}
                  onChange={(e) => setGraceTime(e.target.value)}
                  size="2"
                  placeholder="15"
                />
              </Box>

              {/* Session Timeout */}
              <Box>
                <Text
                  size="2"
                  weight="medium"
                  className="text-gray-900 mb-2 block"
                >
                  Session timeout (minutes)
                </Text>
                <Text size="1" className="text-gray-600 mb-3 block">
                  Auto-end session after specified duration
                </Text>
                <TextField.Root
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  size="2"
                  placeholder="120"
                />
              </Box>

              {/* Default Location */}
              <Box>
                <Text
                  size="2"
                  weight="medium"
                  className="text-gray-900 mb-2 block"
                >
                  Default location
                </Text>
                <Text size="1" className="text-gray-600 mb-3 block">
                  Default location for new attendance sessions
                </Text>
                <Select.Root
                  value={defaultLocation}
                  onValueChange={setDefaultLocation}
                  size="2"
                >
                  <Select.Trigger className="w-full" />
                  <Select.Content>
                    <Select.Item value="Main Campus">Main Campus</Select.Item>
                    <Select.Item value="Computer Lab 1">
                      Computer Lab 1
                    </Select.Item>
                    <Select.Item value="Computer Lab 2">
                      Computer Lab 2
                    </Select.Item>
                    <Select.Item value="Lecture Hall A">
                      Lecture Hall A
                    </Select.Item>
                    <Select.Item value="Lecture Hall B">
                      Lecture Hall B
                    </Select.Item>
                  </Select.Content>
                </Select.Root>
              </Box>
            </Flex>
          </Box>
        </RadixCard>
      </Grid>

      {/* Check-in Methods */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
          <Flex align="center" gap="3">
            <Box className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-purple-600" />
            </Box>
            <Box>
              <Heading size="4" className="text-gray-900 mb-1">
                Check-in Methods
              </Heading>
              <Text size="2" className="text-gray-600">
                Configure available attendance check-in methods
              </Text>
            </Box>
          </Flex>
        </Box>

        <Box className="p-6">
          <Grid columns="3" gap="6">
            {/* QR Code */}
            <Box className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
              <Flex align="center" gap="3" className="mb-3">
                <Camera className="w-6 h-6 text-blue-600" />
                <Text size="2" weight="medium" className="text-gray-900">
                  QR Code
                </Text>
              </Flex>
              <Text size="1" className="text-gray-600 mb-4">
                Students scan QR code to check in
              </Text>
              <Flex justify="between" align="center">
                <Text size="1" className="text-green-600 font-medium">
                  Enabled
                </Text>
                <Switch checked={true} size="1" />
              </Flex>
            </Box>

            {/* Manual Entry */}
            <Box className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
              <Flex align="center" gap="3" className="mb-3">
                <SettingsIcon className="w-6 h-6 text-gray-600" />
                <Text size="2" weight="medium" className="text-gray-900">
                  Manual Entry
                </Text>
              </Flex>
              <Text size="1" className="text-gray-600 mb-4">
                Instructors manually mark attendance
              </Text>
              <Flex justify="between" align="center">
                <Text size="1" className="text-green-600 font-medium">
                  Enabled
                </Text>
                <Switch checked={true} size="1" />
              </Flex>
            </Box>

            {/* Biometric */}
            <Box className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
              <Flex align="center" gap="3" className="mb-3">
                <Fingerprint className="w-6 h-6 text-orange-600" />
                <Text size="2" weight="medium" className="text-gray-900">
                  Biometric
                </Text>
              </Flex>
              <Text size="1" className="text-gray-600 mb-4">
                Fingerprint or face recognition
              </Text>
              <Flex justify="between" align="center">
                <Text size="1" className="text-gray-500 font-medium">
                  Coming Soon
                </Text>
                <Switch checked={false} disabled size="1" />
              </Flex>
            </Box>
          </Grid>
        </Box>
      </RadixCard>

      {/* Location Settings */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
          <Flex align="center" gap="3">
            <Box className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-orange-600" />
            </Box>
            <Box>
              <Heading size="4" className="text-gray-900 mb-1">
                Location Settings
              </Heading>
              <Text size="2" className="text-gray-600">
                Configure location-based attendance restrictions
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
                Allowed radius (meters)
              </Text>
              <Text size="1" className="text-gray-600 mb-3 block">
                Maximum distance from location for check-in
              </Text>
              <TextField.Root defaultValue="100" size="2" placeholder="100" />
            </Box>

            <Box>
              <Text
                size="2"
                weight="medium"
                className="text-gray-900 mb-2 block"
              >
                Location accuracy
              </Text>
              <Text size="1" className="text-gray-600 mb-3 block">
                Required GPS accuracy for location verification
              </Text>
              <Select.Root defaultValue="medium" size="2">
                <Select.Trigger className="w-full" />
                <Select.Content>
                  <Select.Item value="low">Low (±50m)</Select.Item>
                  <Select.Item value="medium">Medium (±20m)</Select.Item>
                  <Select.Item value="high">High (±10m)</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>
          </Grid>
        </Box>
      </RadixCard>
    </Box>
  );
}
