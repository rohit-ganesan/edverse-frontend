import { ReactNode, useState } from 'react';
import { Box, Flex } from '@radix-ui/themes';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
  className?: string;
}

export function DashboardLayout({
  children,
  className = '',
}: DashboardLayoutProps): JSX.Element {
  const [isRearrangeMode, setIsRearrangeMode] = useState(false);

  const handleToggleRearrangeMode = () => {
    setIsRearrangeMode(!isRearrangeMode);
  };

  return (
    <Box className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${className}`}>
      <Flex className="h-screen">
        {/* Sidebar */}
        <Sidebar
          isRearrangeMode={isRearrangeMode}
          onToggleRearrangeMode={handleToggleRearrangeMode}
        />

        {/* Main Content Area */}
        <Box className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Header
            isRearrangeMode={isRearrangeMode}
            onToggleRearrangeMode={handleToggleRearrangeMode}
          />

          {/* Main Content */}
          <Box className="flex-1 overflow-auto">
            <Box className="p-6">{children}</Box>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
