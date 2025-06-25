import { useState } from 'react';
import { Box, Flex, Text, Heading, Grid, Switch } from '@radix-ui/themes';
import { RadixCard } from 'components/ui/RadixCard';
import { RadixButton } from 'components/ui/RadixButton';
import {
  Upload,
  CheckCircle,
  AlertTriangle,
  FileText,
  Send,
  Settings,
  Bell,
  Clock,
  Shield,
  Save,
  RotateCcw,
} from 'lucide-react';
import { useResultManagement } from '../hooks/useResultManagement';
import { SkeletonCard } from 'components/ui/Skeleton';

export function PublishResults({
  isLoading = false,
}: {
  isLoading?: boolean;
}): JSX.Element {
  const [autoNotify, setAutoNotify] = useState(true);
  const [requireApproval, setRequireApproval] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [batchPublishing, setBatchPublishing] = useState(false);

  const { publishResults, bulkUploadResults } = useResultManagement();

  const handleBulkUpload = () => {
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx,.xls';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        bulkUploadResults(file);
      }
    };
    input.click();
  };

  const handlePublishSelected = () => {
    const selectedIds = ['1', '2'];
    publishResults(selectedIds);
  };

  const handleSaveSettings = () => {
    console.log('Saving publish settings...');
  };

  const handleResetSettings = () => {
    console.log('Resetting to default settings...');
    setAutoNotify(true);
    setRequireApproval(true);
    setEmailNotifications(true);
    setBatchPublishing(false);
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
      {/* Publish Header */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100">
          <Flex justify="between" align="center">
            <Box>
              <Heading size="5" className="text-gray-900 mb-1">
                Publish Results
              </Heading>
              <Text size="3" className="text-gray-600">
                Manage result publication and notification settings
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
        {/* Publishing Actions */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
            <Flex align="center" gap="3">
              <Box className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Send className="w-5 h-5 text-green-600" />
              </Box>
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Publishing Actions
                </Heading>
                <Text size="2" className="text-gray-600">
                  Publish and manage student results
                </Text>
              </Box>
            </Flex>
          </Box>

          <Box className="p-6">
            <Flex direction="column" gap="6">
              {/* Quick Actions */}
              <Flex gap="4" className="mb-4">
                <RadixButton
                  variant="solid"
                  size="3"
                  onClick={handleBulkUpload}
                  className="bg-blue-600 hover:bg-blue-700 flex-1"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Bulk Upload Results
                </RadixButton>
                <RadixButton
                  variant="solid"
                  size="3"
                  onClick={handlePublishSelected}
                  className="bg-green-600 hover:bg-green-700 flex-1"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Publish Selected
                </RadixButton>
              </Flex>

              {/* Warning Notice */}
              <Box className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <Flex align="center" gap="3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-yellow-800 block mb-1"
                    >
                      Important Notice
                    </Text>
                    <Text size="2" className="text-yellow-700">
                      Once results are published, they cannot be modified
                      without proper authorization. Please review all results
                      carefully before publishing.
                    </Text>
                  </Box>
                </Flex>
              </Box>

              {/* Empty State */}
              <Box className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                <Box className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </Box>
                <Box className="mb-4">
                  <Text
                    size="3"
                    weight="medium"
                    className="text-gray-900 block mb-2"
                  >
                    No pending results to publish
                  </Text>
                  <Text size="2" className="text-gray-500 block">
                    Upload or add results to see them here for publishing
                  </Text>
                </Box>
                <RadixButton
                  variant="outline"
                  size="2"
                  onClick={handleBulkUpload}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Results
                </RadixButton>
              </Box>
            </Flex>
          </Box>
        </RadixCard>

        {/* Publishing Settings */}
        <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
          <Box className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
            <Flex align="center" gap="3">
              <Box className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-purple-600" />
              </Box>
              <Box>
                <Heading size="4" className="text-gray-900 mb-1">
                  Publishing Settings
                </Heading>
                <Text size="2" className="text-gray-600">
                  Configure publication preferences
                </Text>
              </Box>
            </Flex>
          </Box>

          <Box className="p-6">
            <Flex direction="column" gap="6">
              {/* Auto Notify */}
              <Flex justify="between" align="center">
                <Flex align="center" gap="3">
                  <Box className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Bell className="w-4 h-4 text-blue-600" />
                  </Box>
                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 block"
                    >
                      Auto-notify students
                    </Text>
                    <Text size="1" className="text-gray-600">
                      Automatically send notifications when results are
                      published
                    </Text>
                  </Box>
                </Flex>
                <Switch
                  checked={autoNotify}
                  onCheckedChange={setAutoNotify}
                  size="2"
                />
              </Flex>

              {/* Require Approval */}
              <Flex justify="between" align="center">
                <Flex align="center" gap="3">
                  <Box className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-orange-600" />
                  </Box>
                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 block"
                    >
                      Require approval
                    </Text>
                    <Text size="1" className="text-gray-600">
                      Results need administrative approval before publishing
                    </Text>
                  </Box>
                </Flex>
                <Switch
                  checked={requireApproval}
                  onCheckedChange={setRequireApproval}
                  size="2"
                />
              </Flex>

              {/* Email Notifications */}
              <Flex justify="between" align="center">
                <Flex align="center" gap="3">
                  <Box className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Send className="w-4 h-4 text-green-600" />
                  </Box>
                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 block"
                    >
                      Email notifications
                    </Text>
                    <Text size="1" className="text-gray-600">
                      Send email notifications to students and parents
                    </Text>
                  </Box>
                </Flex>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                  size="2"
                />
              </Flex>

              {/* Batch Publishing */}
              <Flex justify="between" align="center">
                <Flex align="center" gap="3">
                  <Box className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-purple-600" />
                  </Box>
                  <Box>
                    <Text
                      size="2"
                      weight="medium"
                      className="text-gray-900 block"
                    >
                      Batch publishing
                    </Text>
                    <Text size="1" className="text-gray-600">
                      Enable scheduled batch publishing of results
                    </Text>
                  </Box>
                </Flex>
                <Switch
                  checked={batchPublishing}
                  onCheckedChange={setBatchPublishing}
                  size="2"
                />
              </Flex>
            </Flex>
          </Box>
        </RadixCard>
      </Grid>

      {/* Publishing History */}
      <RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
        <Box className="p-6 bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-100">
          <Flex justify="between" align="center">
            <Box>
              <Heading size="4" className="text-gray-900 mb-1">
                Recent Publishing Activity
              </Heading>
              <Text size="2" className="text-gray-600">
                Track recent result publications and notifications
              </Text>
            </Box>
          </Flex>
        </Box>

        <Box className="p-6">
          <Box className="text-center py-12">
            <Box className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </Box>
            <Box className="space-y-2">
              <Text size="3" weight="medium" className="text-gray-900 block">
                No recent activity
              </Text>
              <Text size="2" className="text-gray-500 block">
                Publishing activity will appear here once you start publishing
                results
              </Text>
            </Box>
          </Box>
        </Box>
      </RadixCard>
    </Box>
  );
}
