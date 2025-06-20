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
  // Validate required props
  if (!label || typeof label !== 'string') {
    console.error('FormField: label is required and must be a string');
    return (
      <Box className={className || ''}>
        <Text size="2" className="text-red-600">
          Error: Invalid field label
        </Text>
      </Box>
    );
  }

  // Safe value handling
  const safeValue = value || '';

  // Safe change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    try {
      if (onChange && typeof onChange === 'function') {
        const newValue = e?.target?.value || '';
        onChange(newValue);
      }
    } catch (error) {
      console.error('FormField: Error in onChange handler:', error);
    }
  };

  const getReadOnlyStyles = (): string => {
    switch (readOnlyVariant) {
      case 'highlighted':
        return 'py-2 px-3 bg-gray-50 dark:bg-gray-800 rounded-md min-h-[36px] flex items-center';
      case 'default':
        return 'py-2';
      default:
        return 'py-2';
    }
  };

  return (
    <Box className={className || ''}>
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
            value={safeValue}
            onChange={handleChange}
            placeholder={placeholder || ''}
            size="2"
          />
        )
      ) : (
        <Box className={getReadOnlyStyles()}>
          <Text size="2" className="text-gray-900 dark:text-gray-100">
            {safeValue || 'Not set'}
          </Text>
        </Box>
      )}
    </Box>
  );
}
