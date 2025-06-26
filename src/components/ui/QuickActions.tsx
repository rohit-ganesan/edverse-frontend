import React from 'react';
import { Text } from '@radix-ui/themes';
import { LucideIcon } from 'lucide-react';

interface QuickActionItem {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
}

interface QuickActionsProps {
  actions: QuickActionItem[];
  className?: string;
}

// Icon wrapper component
const IconWrapper: React.FC<{
  IconComponent: LucideIcon;
  className?: string;
  size?: number;
}> = ({ IconComponent, className = '', size = 16 }) => {
  return <IconComponent className={className} size={size} />;
};

// Seamless action card component
const SeamlessActionCard: React.FC<{
  action: QuickActionItem;
  index: number;
}> = ({ action, index }) => {
  return (
    <button
      key={index}
      className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 
                 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm
                 transition-all duration-200 flex items-center gap-2 min-w-fit
                 text-sm font-medium shadow-sm
                 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 dark:text-gray-100"
      onClick={action.onClick}
    >
      <IconWrapper
        IconComponent={action.icon}
        className="text-gray-600 dark:text-gray-200"
        size={16}
      />
      <Text
        size="2"
        className="text-gray-700 dark:text-gray-100 font-medium whitespace-nowrap"
      >
        {action.label}
      </Text>
    </button>
  );
};

export function QuickActions({
  actions,
  className = '',
}: QuickActionsProps): JSX.Element {
  return (
    <div className={`flex items-center gap-2 justify-end mb-6 ${className}`}>
      {actions.map((action, index) => (
        <SeamlessActionCard key={index} action={action} index={index} />
      ))}
    </div>
  );
}
