import { ReactNode } from 'react';
import { Box, Tabs } from '@radix-ui/themes';

interface TabItem {
  value: string;
  label: string;
  content: ReactNode;
}

interface TabContainerProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (value: string) => void;
  className?: string;
}

export function TabContainer({
  tabs,
  activeTab,
  onTabChange,
  className = '',
}: TabContainerProps): JSX.Element {
  return (
    <Tabs.Root value={activeTab} onValueChange={onTabChange}>
      {/* Tab Navigation */}
      <Box className={`mb-6 ${className}`}>
        <Tabs.List className="bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 rounded-lg p-1">
          {tabs.map((tab) => (
            <Tabs.Trigger
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:bg-gray-200 dark:data-[state=active]:bg-gray-700 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100 data-[state=active]:shadow-sm px-4 py-2 rounded-md font-medium transition-all text-gray-700 dark:text-gray-300"
            >
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </Box>

      {/* Tab Content */}
      {tabs.map((tab) => (
        <Tabs.Content
          key={tab.value}
          value={tab.value}
          className="focus:outline-none"
        >
          {tab.content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
