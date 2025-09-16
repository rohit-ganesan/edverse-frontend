import { ReactNode } from 'react';
import { Box, Tabs, Tooltip } from '@radix-ui/themes';
import { Lock } from 'lucide-react';

interface TabItem {
  value: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
  tooltip?: ReactNode;
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
          {tabs.map((tab) => {
            const trigger = (
              <Tabs.Trigger
                key={tab.value}
                value={tab.value}
                disabled={tab.disabled}
                className={[
                  'px-4 py-2 rounded-md font-medium transition-all',
                  'data-[state=active]:bg-gray-200 dark:data-[state=active]:bg-gray-700',
                  'data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100 data-[state=active]:shadow-sm',
                  tab.disabled
                    ? 'cursor-not-allowed text-gray-700 dark:text-gray-300'
                    : 'text-gray-700 dark:text-gray-300',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <span className="inline-flex items-center gap-2">
                  {tab.label}
                  {tab.disabled && <Lock className="w-3 h-3 text-amber-500" />}
                </span>
              </Tabs.Trigger>
            );

            return tab.disabled && tab.tooltip ? (
              <Tooltip key={tab.value} content={tab.tooltip}>
                <span className="inline-flex">{trigger}</span>
              </Tooltip>
            ) : (
              trigger
            );
          })}
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
