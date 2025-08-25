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
  FileText,
  Target,
  BookOpen,
  CheckCircle,
  Bell,
  Save,
  RotateCcw,
  Calendar,
} from 'lucide-react';
import { SkeletonCard } from 'components/ui/Skeleton';

export function Settings({
  isLoading = false,
}: {
  isLoading?: boolean;
}): JSX.Element {
  const [autoUpdateProgress, setAutoUpdateProgress] = useState(true);
  const [requireApproval, setRequireApproval] = useState(true);
  const [enableVersioning, setEnableVersioning] = useState(true);
  const [trackCompletion, setTrackCompletion] = useState(true);
  const [defaultDuration, setDefaultDuration] = useState('16');
  const [minObjectives, setMinObjectives] = useState('5');
  const [maxTopics, setMaxTopics] = useState('20');
  const [reviewCycle, setReviewCycle] = useState('annual');

  const handleSaveSettings = () => {
    console.log('Saving syllabus settings...');
  };

  const handleResetSettings = () => {
    console.log('Resetting to default settings...');
    setAutoUpdateProgress(true);
    setRequireApproval(true);
    setEnableVersioning(true);
    setTrackCompletion(true);
    setDefaultDuration('16');
    setMinObjectives('5');
    setMaxTopics('20');
    setReviewCycle('annual');
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
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-100">
          <Flex justify="between" align="center">
            <Box>
              <Heading size="5" className="text-gray-900 mb-1">
                Syllabus Settings
              </Heading>
              <Text size="3" className="text-gray-600">
                Configure curriculum management and learning objective tracking
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
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <Flex align="center" gap="3">
              <Box className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </Box>
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Content Management
                </Heading>
                <Text size="2" className="text-gray-600">
                  Configure syllabus content policies
                </Text>
              </Box>
            </Flex>
          </Box>

          <Box className="p-6">
            <Flex direction="column" gap="6">
              <Flex justify="between" align="center">
                <Box>
                  <Text
                    size="2"
                    weight="medium"
                    className="text-gray-900 block"
                  >
                    Auto-update progress
                  </Text>
                  <Text size="1" className="text-gray-600">
                    Automatically track completion progress
                  </Text>
                </Box>
                <Switch
                  checked={autoUpdateProgress}
                  onCheckedChange={setAutoUpdateProgress}
                  size="2"
                />
              </Flex>

              <Flex justify="between" align="center">
                <Box>
                  <Text
                    size="2"
                    weight="medium"
                    className="text-gray-900 block"
                  >
                    Require approval
                  </Text>
                  <Text size="1" className="text-gray-600">
                    New syllabi need administrator approval
                  </Text>
                </Box>
                <Switch
                  checked={requireApproval}
                  onCheckedChange={setRequireApproval}
                  size="2"
                />
              </Flex>

              <Flex justify="between" align="center">
                <Box>
                  <Text
                    size="2"
                    weight="medium"
                    className="text-gray-900 block"
                  >
                    Enable versioning
                  </Text>
                  <Text size="1" className="text-gray-600">
                    Keep track of syllabus version history
                  </Text>
                </Box>
                <Switch
                  checked={enableVersioning}
                  onCheckedChange={setEnableVersioning}
                  size="2"
                />
              </Flex>

              <Flex justify="between" align="center">
                <Box>
                  <Text
                    size="2"
                    weight="medium"
                    className="text-gray-900 block"
                  >
                    Track completion
                  </Text>
                  <Text size="1" className="text-gray-600">
                    Monitor learning objective completion
                  </Text>
                </Box>
                <Switch
                  checked={trackCompletion}
                  onCheckedChange={setTrackCompletion}
                  size="2"
                />
              </Flex>
            </Flex>
          </Box>
        </RadixCard>

        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
            <Flex align="center" gap="3">
              <Box className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-green-600" />
              </Box>
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Learning Standards
                </Heading>
                <Text size="2" className="text-gray-600">
                  Configure curriculum requirements
                </Text>
              </Box>
            </Flex>
          </Box>

          <Box className="p-6">
            <Flex direction="column" gap="6">
              <Box>
                <Text
                  size="2"
                  weight="medium"
                  className="text-gray-900 mb-2 block"
                >
                  Default duration (weeks)
                </Text>
                <Text size="1" className="text-gray-600 mb-3 block">
                  Standard duration for new syllabi
                </Text>
                <TextField.Root
                  value={defaultDuration}
                  onChange={(e) => setDefaultDuration(e.target.value)}
                  size="2"
                  placeholder="16"
                />
              </Box>

              <Box>
                <Text
                  size="2"
                  weight="medium"
                  className="text-gray-900 mb-2 block"
                >
                  Minimum learning objectives
                </Text>
                <Text size="1" className="text-gray-600 mb-3 block">
                  Required minimum objectives per syllabus
                </Text>
                <TextField.Root
                  value={minObjectives}
                  onChange={(e) => setMinObjectives(e.target.value)}
                  size="2"
                  placeholder="5"
                />
              </Box>

              <Box>
                <Text
                  size="2"
                  weight="medium"
                  className="text-gray-900 mb-2 block"
                >
                  Maximum topics per syllabus
                </Text>
                <Text size="1" className="text-gray-600 mb-3 block">
                  Recommended maximum topics to cover
                </Text>
                <TextField.Root
                  value={maxTopics}
                  onChange={(e) => setMaxTopics(e.target.value)}
                  size="2"
                  placeholder="20"
                />
              </Box>
            </Flex>
          </Box>
        </RadixCard>
      </Grid>

      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
          <Flex align="center" gap="3">
            <Box className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-orange-600" />
            </Box>
            <Box>
              <Heading size="4" className="text-gray-900 mb-1">
                Subject Categories
              </Heading>
              <Text size="2" className="text-gray-600">
                Configure available subject areas and their settings
              </Text>
            </Box>
          </Flex>
        </Box>

        <Box className="p-6">
          <Grid columns="4" gap="6">
            {[
              { name: 'Core Subjects', icon: BookOpen, color: 'orange' },
              { name: 'Electives', icon: Target, color: 'blue' },
              { name: 'Advanced Placement', icon: CheckCircle, color: 'green' },
              { name: 'Remedial', icon: FileText, color: 'purple' },
            ].map((category) => (
              <Box
                key={category.name}
                className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors"
              >
                <Flex align="center" gap="3" className="mb-3">
                  <category.icon
                    className={`w-6 h-6 text-${category.color}-600`}
                  />
                  <Text size="2" weight="medium" className="text-gray-900">
                    {category.name}
                  </Text>
                </Flex>
                <Flex justify="between" align="center">
                  <Text size="1" className="text-green-600 font-medium">
                    Enabled
                  </Text>
                  <Switch checked={true} size="1" />
                </Flex>
              </Box>
            ))}
          </Grid>
        </Box>
      </RadixCard>

      <Grid columns="2" gap="8">
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-cyan-50 to-blue-50 border-b border-cyan-100">
            <Flex align="center" gap="3">
              <Box className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-cyan-600" />
              </Box>
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Review & Updates
                </Heading>
                <Text size="2" className="text-gray-600">
                  Configure review cycles and update policies
                </Text>
              </Box>
            </Flex>
          </Box>

          <Box className="p-6">
            <Flex direction="column" gap="6">
              <Box>
                <Text
                  size="2"
                  weight="medium"
                  className="text-gray-900 mb-2 block"
                >
                  Review cycle
                </Text>
                <Text size="1" className="text-gray-600 mb-3 block">
                  How often syllabi should be reviewed
                </Text>
                <Select.Root
                  value={reviewCycle}
                  onValueChange={setReviewCycle}
                  size="2"
                >
                  <Select.Trigger className="w-full" />
                  <Select.Content>
                    <Select.Item value="semester">Every Semester</Select.Item>
                    <Select.Item value="annual">Annually</Select.Item>
                    <Select.Item value="biannual">Every 2 Years</Select.Item>
                    <Select.Item value="manual">Manual Review</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Box>

              <Box>
                <Text
                  size="2"
                  weight="medium"
                  className="text-gray-900 mb-2 block"
                >
                  Update notification
                </Text>
                <Text size="1" className="text-gray-600 mb-3 block">
                  When to notify about syllabus updates
                </Text>
                <Select.Root defaultValue="immediate" size="2">
                  <Select.Trigger className="w-full" />
                  <Select.Content>
                    <Select.Item value="immediate">Immediately</Select.Item>
                    <Select.Item value="daily">Daily Digest</Select.Item>
                    <Select.Item value="weekly">Weekly Summary</Select.Item>
                    <Select.Item value="disabled">Disabled</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Box>
            </Flex>
          </Box>
        </RadixCard>

        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-pink-50 to-rose-50 border-b border-pink-100">
            <Flex align="center" gap="3">
              <Box className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-pink-600" />
              </Box>
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Notifications
                </Heading>
                <Text size="2" className="text-gray-600">
                  Configure syllabus-related notifications
                </Text>
              </Box>
            </Flex>
          </Box>

          <Box className="p-6">
            <Flex direction="column" gap="6">
              <Box>
                <Text
                  size="2"
                  weight="medium"
                  className="text-gray-900 mb-2 block"
                >
                  Progress milestone alerts
                </Text>
                <Text size="1" className="text-gray-600 mb-3 block">
                  Notify when completion milestones are reached
                </Text>
                <Select.Root defaultValue="25" size="2">
                  <Select.Trigger className="w-full" />
                  <Select.Content>
                    <Select.Item value="10">Every 10%</Select.Item>
                    <Select.Item value="25">Every 25%</Select.Item>
                    <Select.Item value="50">Every 50%</Select.Item>
                    <Select.Item value="disabled">Disabled</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Box>

              <Box>
                <Text
                  size="2"
                  weight="medium"
                  className="text-gray-900 mb-2 block"
                >
                  Deadline reminders
                </Text>
                <Text size="1" className="text-gray-600 mb-3 block">
                  Send reminders before syllabus deadlines
                </Text>
                <TextField.Root defaultValue="7" size="2" placeholder="7" />
              </Box>
            </Flex>
          </Box>
        </RadixCard>
      </Grid>
    </Box>
  );
}
