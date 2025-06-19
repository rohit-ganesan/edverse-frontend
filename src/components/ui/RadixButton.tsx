import { ComponentProps } from 'react';
import { Button as RadixButton } from '@radix-ui/themes';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ComponentProps<typeof RadixButton> {
  loading?: boolean;
}

export function Button({
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps): JSX.Element {
  return (
    <RadixButton disabled={disabled || loading} {...props}>
      {loading && <Loader2 className="animate-spin -ml-1 mr-3 h-4 w-4" />}
      {children}
    </RadixButton>
  );
}
