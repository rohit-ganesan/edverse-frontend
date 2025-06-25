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
  GraduationCap,
  Users,
  BookOpen,
  Award,
  Bell,
  Save,
  RotateCcw,
} from 'lucide-react';

export function Settings(): JSX.Element {
  const [autoEnrollment, setAutoEnrollment] = useState(true);
  const [allowWaitlist, setAllowWaitlist] = useState(true);
  const [requirePrerequisites, setRequirePrerequisites] = useState(true);
  const [enableCertificates, setEnableCertificates] = useState(true);
  const [maxEnrollment, setMaxEnrollment] = useState('50');
  const [courseDuration, setCourseDuration] = useState('16');
  const [passingGrade, setPassingGrade] = useState('70');
  const [defaultCredits, setDefaultCredits] = useState('3');

  const handleSaveSettings = () => {
    console.log('Saving courses settings...');
    // Implementation would save settings to backend
  };

  const handleResetSettings = () => {
    console.log('Resetting to default settings...');
    // Implementation would reset to default values
    setAutoEnrollment(true);
    setAllowWaitlist(true);
    setRequirePrerequisites(true);
    setEnableCertificates(true);
    setMaxEnrollment('50');
    setCourseDuration('16');
    setPassingGrade('70');
    setDefaultCredits('3');
  };

  return (
    <Box className="space-y-8">
      {/* Settings Header */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
          <Flex justify="between" align="center">
            <Box>
              <Heading size="5" className="text-gray-900 mb-1">
                Courses Settings
              </Heading>
              <Text size="3" className="text-gray-600">
                Configure course enrollment policies and academic standards
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
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="w-4 h-4 mr-1" />
                Save Settings
              </RadixButton>
            </Flex>
          </Flex>
        </Box>
      </RadixCard>

      <Grid columns="2" gap="8">
        {/* Enrollment Settings */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <Flex align="center" gap="3">
              <Box className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </Box>
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Enrollment Settings
                </Heading>
                <Text size="2" className="text-gray-600">
                  Configure student enrollment policies
                </Text>
              </Box>
            </Flex>
          </Box>

          <Box className="p-6">
            <Flex direction="column" gap="6">
              {/* Auto Enrollment */}
              <Flex justify="between" align="center">
                <Box>
                  <Text
                    size="2"
                    weight="medium"
                    className="text-gray-900 block"
                  >
                    Auto-enrollment
                  </Text>
                  <Text size="1" className="text-gray-600">
                    Automatically enroll eligible students
                  </Text>
                </Box>
                <Switch
                  checked={autoEnrollment}
                  onCheckedChange={setAutoEnrollment}
                  size="2"
                />
              </Flex>

              {/* Allow Waitlist */}
              <Flex justify="between" align="center">
                <Box>
                  <Text
                    size="2"
                    weight="medium"
                    className="text-gray-900 block"
                  >
                    Allow waitlist
                  </Text>
                  <Text size="1" className="text-gray-600">
                    Students can join waitlist when course is full
                  </Text>
                </Box>
                <Switch
                  checked={allowWaitlist}
                  onCheckedChange={setAllowWaitlist}
                  size="2"
                />
              </Flex>

              {/* Require Prerequisites */}
              <Flex justify="between" align="center">
                <Box>
                  <Text
                    size="2"
                    weight="medium"
                    className="text-gray-900 block"
                  >
                    Require prerequisites
                  </Text>
                  <Text size="1" className="text-gray-600">
                    Enforce prerequisite course completion
                  </Text>
                </Box>
                <Switch
                  checked={requirePrerequisites}
                  onCheckedChange={setRequirePrerequisites}
                  size="2"
                />
              </Flex>

              {/* Enable Certificates */}
              <Flex justify="between" align="center">
                <Box>
                  <Text
                    size="2"
                    weight="medium"
                    className="text-gray-900 block"
                  >
                    Enable certificates
                  </Text>
                  <Text size="1" className="text-gray-600">
                    Issue completion certificates to students
                  </Text>
                </Box>
                <Switch
                  checked={enableCertificates}
                  onCheckedChange={setEnableCertificates}
                  size="2"
                />
              </Flex>
            </Flex>
          </Box>
        </RadixCard>

        {/* Academic Standards */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-100">
            <Flex align="center" gap="3">
              <Box className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-purple-600" />
              </Box>
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Academic Standards
                </Heading>
                <Text size="2" className="text-gray-600">
                  Configure grading and completion requirements
                </Text>
              </Box>
            </Flex>
          </Box>

          <Box className="p-6">
            <Flex direction="column" gap="6">
              {/* Passing Grade */}
              <Box>
                <Text
                  size="2"
                  weight="medium"
                  className="text-gray-900 mb-2 block"
                >
                  Minimum passing grade (%)
                </Text>
                <Text size="1" className="text-gray-600 mb-3 block">
                  Minimum grade required to pass a course
                </Text>
                <TextField.Root
                  value={passingGrade}
                  onChange={(e) => setPassingGrade(e.target.value)}
                  size="2"
                  placeholder="70"
                />
              </Box>

              {/* Default Credits */}
              <Box>
                <Text
                  size="2"
                  weight="medium"
                  className="text-gray-900 mb-2 block"
                >
                  Default credit hours
                </Text>
                <Text size="1" className="text-gray-600 mb-3 block">
                  Standard credit hours for new courses
                </Text>
                <TextField.Root
                  value={defaultCredits}
                  onChange={(e) => setDefaultCredits(e.target.value)}
                  size="2"
                  placeholder="3"
                />
              </Box>

              {/* Course Duration */}
              <Box>
                <Text
                  size="2"
                  weight="medium"
                  className="text-gray-900 mb-2 block"
                >
                  Default course duration (weeks)
                </Text>
                <Text size="1" className="text-gray-600 mb-3 block">
                  Standard duration for semester courses
                </Text>
                <TextField.Root
                  value={courseDuration}
                  onChange={(e) => setCourseDuration(e.target.value)}
                  size="2"
                  placeholder="16"
                />
              </Box>
            </Flex>
          </Box>
        </RadixCard>
      </Grid>

      {/* Course Categories */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
          <Flex align="center" gap="3">
            <Box className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-orange-600" />
            </Box>
            <Box>
              <Heading size="4" className="text-gray-900 mb-1">
                Course Categories
              </Heading>
              <Text size="2" className="text-gray-600">
                Configure available course types and categories
              </Text>
            </Box>
          </Flex>
        </Box>

        <Box className="p-6">
          <Grid columns="3" gap="6">
            {/* Core Courses */}
            <Box className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors">
              <Flex align="center" gap="3" className="mb-3">
                <BookOpen className="w-6 h-6 text-orange-600" />
                <Text size="2" weight="medium" className="text-gray-900">
                  Core Courses
                </Text>
              </Flex>
              <Text size="1" className="text-gray-600 mb-4">
                Required courses for degree completion
              </Text>
              <Flex justify="between" align="center">
                <Text size="1" className="text-green-600 font-medium">
                  Enabled
                </Text>
                <Switch checked={true} size="1" />
              </Flex>
            </Box>

            {/* Electives */}
            <Box className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors">
              <Flex align="center" gap="3" className="mb-3">
                <Users className="w-6 h-6 text-blue-600" />
                <Text size="2" weight="medium" className="text-gray-900">
                  Electives
                </Text>
              </Flex>
              <Text size="1" className="text-gray-600 mb-4">
                Optional courses for additional credits
              </Text>
              <Flex justify="between" align="center">
                <Text size="1" className="text-green-600 font-medium">
                  Enabled
                </Text>
                <Switch checked={true} size="1" />
              </Flex>
            </Box>

            {/* Honors Courses */}
            <Box className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors">
              <Flex align="center" gap="3" className="mb-3">
                <Award className="w-6 h-6 text-purple-600" />
                <Text size="2" weight="medium" className="text-gray-900">
                  Honors Courses
                </Text>
              </Flex>
              <Text size="1" className="text-gray-600 mb-4">
                Advanced courses for high-achieving students
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

      {/* Enrollment Limits */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-cyan-50 to-blue-50 border-b border-cyan-100">
          <Flex align="center" gap="3">
            <Box className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-cyan-600" />
            </Box>
            <Box>
              <Heading size="4" className="text-gray-900 mb-1">
                Enrollment Limits
              </Heading>
              <Text size="2" className="text-gray-600">
                Configure capacity and enrollment restrictions
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
                Maximum enrollment per course
              </Text>
              <Text size="1" className="text-gray-600 mb-3 block">
                Default capacity limit for new courses
              </Text>
              <TextField.Root
                value={maxEnrollment}
                onChange={(e) => setMaxEnrollment(e.target.value)}
                size="2"
                placeholder="50"
              />
            </Box>

            <Box>
              <Text
                size="2"
                weight="medium"
                className="text-gray-900 mb-2 block"
              >
                Enrollment priority
              </Text>
              <Text size="1" className="text-gray-600 mb-3 block">
                Priority system for course enrollment
              </Text>
              <Select.Root defaultValue="year" size="2">
                <Select.Trigger className="w-full" />
                <Select.Content>
                  <Select.Item value="year">By Academic Year</Select.Item>
                  <Select.Item value="gpa">By GPA</Select.Item>
                  <Select.Item value="major">By Major</Select.Item>
                  <Select.Item value="random">Random Selection</Select.Item>
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
                Course Notifications
              </Heading>
              <Text size="2" className="text-gray-600">
                Configure enrollment and course-related notifications
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
                Enrollment deadline reminder (days)
              </Text>
              <Text size="1" className="text-gray-600 mb-3 block">
                Send reminder before enrollment deadline
              </Text>
              <TextField.Root defaultValue="7" size="2" placeholder="7" />
            </Box>

            <Box>
              <Text
                size="2"
                weight="medium"
                className="text-gray-900 mb-2 block"
              >
                Course start notification
              </Text>
              <Text size="1" className="text-gray-600 mb-3 block">
                When to notify students about course start
              </Text>
              <Select.Root defaultValue="3days" size="2">
                <Select.Trigger className="w-full" />
                <Select.Content>
                  <Select.Item value="1day">1 Day Before</Select.Item>
                  <Select.Item value="3days">3 Days Before</Select.Item>
                  <Select.Item value="1week">1 Week Before</Select.Item>
                  <Select.Item value="disabled">Disabled</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>
          </Grid>
        </Box>
      </RadixCard>
    </Box>
  );
}
