// Growth Module - Growth Plan Features
// These components are lazy-loaded behind feature flags

import React from 'react';
import { Box, Text } from '@radix-ui/themes';

// Analytics
export { default as AnalyticsPage } from './AnalyticsPage';

// Parent Portal
export { default as ParentPortalPage } from './ParentPortalPage';

// Advanced Announcements
export { default as NoticeBoardAdvancedPage } from './NoticeBoardAdvancedPage';

// Join Codes
export { default as JoinCodesPage } from './JoinCodesPage';

// Online Payments
export { default as PaymentsOnlinePage } from './PaymentsOnlinePage';

// Default export for lazy loading
const GrowthModule: React.FC = () => {
  return (
    <Box className="p-6">
      <Text className="text-2xl font-bold mb-4">Growth Features</Text>
      <Text className="text-gray-600">
        This module contains advanced features available on the Growth plan.
      </Text>
    </Box>
  );
};

export default GrowthModule;
