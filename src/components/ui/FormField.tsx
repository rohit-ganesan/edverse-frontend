import { ReactNode } from 'react';
import { Box, Text } from '@radix-ui/themes';
import { RadixTextField } from './RadixTextField';

interface FormFieldProps {
  label: string;
  value?: string;
  placeholder?: string;
  isEditing?: boolean;
  onChange?: (value: string) => void;
  children?: ReactNode;
  className?: string;
  readOnlyVariant?: 'default' | 'highlighted';
}

export function FormField({
  label,
  value = '',
  placeholder,
  isEditing = false,
  onChange,
  children,
  className = '',
  readOnlyVariant = 'highlighted',
}: FormFieldProps): JSX.Element {
  const getReadOnlyStyles = (): string => {
    switch (readOnlyVariant) {
      case 'highlighted':
        return 'py-2 px-3 bg-gray-50 dark:bg-gray-800 rounded-md min-h-[36px] flex items-center';
      default:
        return 'py-2';
    }
  };

  return (
    <Box className={className}>
      <Text
        size="2"
        weight="medium"
        className="text-gray-700 dark:text-gray-300 block mb-3"
      >
        {label}
      </Text>
      {isEditing ? (
        children || (
          <RadixTextField
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            size="2"
          />
        )
      ) : (
        <Box className={getReadOnlyStyles()}>
          <Text size="2" className="text-gray-900 dark:text-gray-100">
            {value || 'Not set'}
          </Text>
        </Box>
      )}
    </Box>
  );
}
