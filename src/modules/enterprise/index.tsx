// Enterprise Module - Enterprise Plan Features
// These components are lazy-loaded behind feature flags

import React from 'react';
import { Box, Text } from '@radix-ui/themes';

// Admissions
export { default as AdmissionsPage } from './Admission/AdmissionsPage';
export * from './Admission';

// Advanced Fees
export { default as FeeAdvancedPage } from './FeeAdvancedPage';

// Audit Logs
export { default as AuditLogsPage } from './AuditLogsPage';

// SSO/SAML
export { default as SSOSAMLPage } from './SSOSAMLPage';

// Branding
export { default as BrandingPage } from './BrandingPage';

// Advanced Syllabus
export { default as SyllabusAdvancedPage } from './Syllabus/SyllabusAdvancedPage';
export * from './Syllabus';

// Integrations
export { default as IntegrationsPage } from './IntegrationsPage';

// Default export for lazy loading
const EnterpriseModule: React.FC = () => {
  return (
    <Box className="p-6">
      <Text className="text-2xl font-bold mb-4">Enterprise Features</Text>
      <Text className="text-gray-600">
        This module contains enterprise features available on the Enterprise
        plan.
      </Text>
    </Box>
  );
};

export default EnterpriseModule;
