import { ComponentProps, forwardRef } from 'react';
import { TextField, Text } from '@radix-ui/themes';

interface TextFieldProps extends ComponentProps<typeof TextField.Root> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const RadixTextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, helperText, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <Text as="label" size="2" weight="medium" className="block">
            {label}
          </Text>
        )}
        <TextField.Root ref={ref} {...props} />
        {error && (
          <Text size="1" color="red" className="block">
            {error}
          </Text>
        )}
        {helperText && !error && (
          <Text size="1" color="gray" className="block">
            {helperText}
          </Text>
        )}
      </div>
    );
  }
);

RadixTextField.displayName = 'RadixTextField';
