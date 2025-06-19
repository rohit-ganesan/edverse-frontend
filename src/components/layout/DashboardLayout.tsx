import { ReactNode } from 'react';
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
  return (
    <Box className={`min-h-screen bg-gray-50 ${className}`}>
      <Flex className="h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <Box className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Header />

          {/* Main Content */}
          <Box className="flex-1 overflow-auto">
            <Box className="p-6">{children}</Box>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
