import { Flex, Text, Box } from '@radix-ui/themes';
import * as RadioGroup from '@radix-ui/react-radio-group';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadixRadioGroupProps {
  name: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  required?: boolean;
  helperText?: string;
  error?: string;
  className?: string;
}

export function RadixRadioGroup({
  name,
  label,
  value,
  onChange,
  options,
  required = false,
  helperText,
  error,
  className = '',
}: RadixRadioGroupProps): JSX.Element {
  return (
    <Box className={className}>
      {label && (
        <Text
          size="2"
          weight="medium"
          className="block mb-3 text-gray-900 dark:text-gray-100"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Text>
      )}

      <RadioGroup.Root
        value={value}
        onValueChange={onChange}
        name={name}
        required={required}
        className="flex flex-col gap-3"
      >
        {options.map((option) => (
          <Flex key={option.value} align="center" gap="3" className="group">
            <RadioGroup.Item
              value={option.value}
              className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500 transition-colors cursor-pointer"
            >
              <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-2 after:h-2 after:rounded-full after:bg-white" />
            </RadioGroup.Item>
            <Box
              className="flex-1 cursor-pointer"
              onClick={() => onChange(option.value)}
            >
              <Text
                size="2"
                weight="medium"
                className="text-gray-900 dark:text-gray-100 block"
              >
                {option.label}
              </Text>
              {option.description && (
                <Text size="1" className="text-gray-600 dark:text-gray-400">
                  {option.description}
                </Text>
              )}
            </Box>
          </Flex>
        ))}
      </RadioGroup.Root>

      {helperText && !error && (
        <Text size="1" className="text-gray-600 dark:text-gray-400 mt-2 block">
          {helperText}
        </Text>
      )}

      {error && (
        <Text size="1" className="text-red-600 dark:text-red-400 mt-2 block">
          {error}
        </Text>
      )}
    </Box>
  );
}
