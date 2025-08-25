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
  DollarSign,
  Bell,
  CreditCard,
  Save,
  RotateCcw,
  FileText,
} from 'lucide-react';
import { SkeletonCard } from '../../../../components/ui/Skeleton';

export function Settings({
  isLoading = false,
}: {
  isLoading?: boolean;
}): JSX.Element {
  const [autoSendReminders, setAutoSendReminders] = useState(true);
  const [allowPartialPayments, setAllowPartialPayments] = useState(true);
  const [enableLateFees, setEnableLateFees] = useState(true);
  const [requireApproval, setRequireApproval] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [reminderDays, setReminderDays] = useState('7');
  const [lateFeePercentage, setLateFeePercentage] = useState('5');
  const [gracePeriod, setGracePeriod] = useState('15');
  const [defaultCurrency, setDefaultCurrency] = useState('USD');

  const handleSaveSettings = () => {
    console.log('Saving fee settings...');
    // Implementation would save settings to backend
  };

  const handleResetSettings = () => {
    console.log('Resetting to default settings...');
    // Implementation would reset to default values
    setAutoSendReminders(true);
    setAllowPartialPayments(true);
    setEnableLateFees(true);
    setRequireApproval(false);
    setEmailNotifications(true);
    setSmsNotifications(false);
    setReminderDays('7');
    setLateFeePercentage('5');
    setGracePeriod('15');
    setDefaultCurrency('USD');
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
        <Box className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
          <Flex justify="between" align="center">
            <Box>
              <Heading size="5" className="text-gray-900 mb-1">
                Fee Management Settings
              </Heading>
              <Text size="3" className="text-gray-600">
                Configure fee collection policies and payment preferences
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
                  Basic fee collection configuration
                </Text>
              </Box>
            </Flex>
          </Box>

          <Box className="p-6">
            <Flex direction="column" gap="6">
              {/* Auto Send Reminders */}
              <Flex justify="between" align="center">
                <Box>
                  <Text
                    size="2"
                    weight="medium"
                    className="text-gray-900 block"
                  >
                    Auto-send payment reminders
                  </Text>
                  <Text size="1" className="text-gray-600">
                    Automatically send reminders for due payments
                  </Text>
                </Box>
                <Switch
                  checked={autoSendReminders}
                  onCheckedChange={setAutoSendReminders}
                  size="2"
                />
              </Flex>

              {/* Allow Partial Payments */}
              <Flex justify="between" align="center">
                <Box>
                  <Text
                    size="2"
                    weight="medium"
                    className="text-gray-900 block"
                  >
                    Allow partial payments
                  </Text>
                  <Text size="1" className="text-gray-600">
                    Students can pay fees in installments
                  </Text>
                </Box>
                <Switch
                  checked={allowPartialPayments}
                  onCheckedChange={setAllowPartialPayments}
                  size="2"
                />
              </Flex>

              {/* Enable Late Fees */}
              <Flex justify="between" align="center">
                <Box>
                  <Text
                    size="2"
                    weight="medium"
                    className="text-gray-900 block"
                  >
                    Enable late fees
                  </Text>
                  <Text size="1" className="text-gray-600">
                    Charge additional fees for late payments
                  </Text>
                </Box>
                <Switch
                  checked={enableLateFees}
                  onCheckedChange={setEnableLateFees}
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
                    Require payment approval
                  </Text>
                  <Text size="1" className="text-gray-600">
                    Manual approval required for all payments
                  </Text>
                </Box>
                <Switch
                  checked={requireApproval}
                  onCheckedChange={setRequireApproval}
                  size="2"
                />
              </Flex>
            </Flex>
          </Box>
        </RadixCard>

        {/* Financial Settings */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
            <Flex align="center" gap="3">
              <Box className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </Box>
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Financial Settings
                </Heading>
                <Text size="2" className="text-gray-600">
                  Configure financial policies and calculations
                </Text>
              </Box>
            </Flex>
          </Box>

          <Box className="p-6">
            <Flex direction="column" gap="6">
              {/* Late Fee Percentage */}
              <Box>
                <Text
                  size="2"
                  weight="medium"
                  className="text-gray-900 mb-2 block"
                >
                  Late fee percentage (%)
                </Text>
                <Text size="1" className="text-gray-600 mb-3 block">
                  Percentage of original amount charged as late fee
                </Text>
                <TextField.Root
                  value={lateFeePercentage}
                  onChange={(e) => setLateFeePercentage(e.target.value)}
                  size="2"
                  placeholder="5"
                />
              </Box>

              {/* Grace Period */}
              <Box>
                <Text
                  size="2"
                  weight="medium"
                  className="text-gray-900 mb-2 block"
                >
                  Grace period (days)
                </Text>
                <Text size="1" className="text-gray-600 mb-3 block">
                  Days after due date before late fees apply
                </Text>
                <TextField.Root
                  value={gracePeriod}
                  onChange={(e) => setGracePeriod(e.target.value)}
                  size="2"
                  placeholder="15"
                />
              </Box>

              {/* Default Currency */}
              <Box>
                <Text
                  size="2"
                  weight="medium"
                  className="text-gray-900 mb-2 block"
                >
                  Default currency
                </Text>
                <Text size="1" className="text-gray-600 mb-3 block">
                  Primary currency for fee calculations
                </Text>
                <Select.Root
                  value={defaultCurrency}
                  onValueChange={setDefaultCurrency}
                  size="2"
                >
                  <Select.Trigger className="w-full" />
                  <Select.Content>
                    <Select.Item value="USD">USD ($)</Select.Item>
                    <Select.Item value="EUR">EUR (€)</Select.Item>
                    <Select.Item value="GBP">GBP (£)</Select.Item>
                    <Select.Item value="INR">INR (₹)</Select.Item>
                    <Select.Item value="CAD">CAD (C$)</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Box>
            </Flex>
          </Box>
        </RadixCard>
      </Grid>

      {/* Payment Methods */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
          <Flex align="center" gap="3">
            <Box className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-purple-600" />
            </Box>
            <Box>
              <Heading size="4" className="text-gray-900 mb-1">
                Payment Methods
              </Heading>
              <Text size="2" className="text-gray-600">
                Configure available payment methods for students
              </Text>
            </Box>
          </Flex>
        </Box>

        <Box className="p-6">
          <Grid columns="3" gap="6">
            {/* Credit/Debit Card */}
            <Box className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
              <Flex align="center" gap="3" className="mb-3">
                <CreditCard className="w-6 h-6 text-blue-600" />
                <Text size="2" weight="medium" className="text-gray-900">
                  Credit/Debit Card
                </Text>
              </Flex>
              <Text size="1" className="text-gray-600 mb-4">
                Online card payments via secure gateway
              </Text>
              <Flex justify="between" align="center">
                <Text size="1" className="text-green-600 font-medium">
                  Enabled
                </Text>
                <Switch checked={true} size="1" />
              </Flex>
            </Box>

            {/* Bank Transfer */}
            <Box className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
              <Flex align="center" gap="3" className="mb-3">
                <FileText className="w-6 h-6 text-green-600" />
                <Text size="2" weight="medium" className="text-gray-900">
                  Bank Transfer
                </Text>
              </Flex>
              <Text size="1" className="text-gray-600 mb-4">
                Direct bank transfer with reference number
              </Text>
              <Flex justify="between" align="center">
                <Text size="1" className="text-green-600 font-medium">
                  Enabled
                </Text>
                <Switch checked={true} size="1" />
              </Flex>
            </Box>

            {/* Cash Payment */}
            <Box className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
              <Flex align="center" gap="3" className="mb-3">
                <DollarSign className="w-6 h-6 text-orange-600" />
                <Text size="2" weight="medium" className="text-gray-900">
                  Cash Payment
                </Text>
              </Flex>
              <Text size="1" className="text-gray-600 mb-4">
                In-person cash payments at office
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
                Configure notification preferences and timing
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
                      Send payment reminders via email
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
                      Send payment reminders via SMS
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
                Reminder frequency (days)
              </Text>
              <Text size="1" className="text-gray-600 mb-3 block">
                Days before due date to send first reminder
              </Text>
              <TextField.Root
                value={reminderDays}
                onChange={(e) => setReminderDays(e.target.value)}
                size="2"
                placeholder="7"
              />
            </Box>
          </Grid>
        </Box>
      </RadixCard>
    </Box>
  );
}
