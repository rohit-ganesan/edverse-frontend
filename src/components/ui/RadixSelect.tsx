import React from 'react';
import * as Select from '@radix-ui/react-select';
import { ChevronDownIcon, CheckIcon } from '@radix-ui/react-icons';

interface RadixSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const RadixSelect: React.FC<RadixSelectProps> = ({
  value,
  onValueChange,
  placeholder,
  disabled = false,
  className = '',
  children,
}) => {
  return (
    <Select.Root
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <Select.Trigger
        className={`inline-flex items-center justify-between rounded-md px-3 py-2 text-sm leading-none bg-white border border-gray-300 text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        aria-label="Select option"
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon className="text-gray-400">
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="overflow-hidden bg-white rounded-md shadow-lg border border-gray-200">
          <Select.Viewport className="p-1">{children}</Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

interface RadixSelectItemProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export const RadixSelectItem: React.FC<RadixSelectItemProps> = ({
  value,
  children,
  disabled = false,
}) => {
  return (
    <Select.Item
      value={value}
      disabled={disabled}
      className="relative flex items-center px-8 py-2 text-sm text-gray-900 rounded-sm cursor-pointer hover:bg-blue-50 focus:bg-blue-50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
        <CheckIcon />
      </Select.ItemIndicator>
    </Select.Item>
  );
};
