import { ComponentProps } from 'react';
import { Button } from '@radix-ui/themes';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ComponentProps<typeof Button> {
  loading?: boolean;
}

export function RadixButton({
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps): JSX.Element {
  return (
    <Button disabled={disabled || loading} {...props}>
      {loading && <Loader2 className="animate-spin -ml-1 mr-3 h-4 w-4" />}
      {children}
    </Button>
  );
}

// Also export as Button for backward compatibility
export { RadixButton as Button };
