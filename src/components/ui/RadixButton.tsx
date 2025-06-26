import { ComponentProps } from 'react';
import { Button } from '@radix-ui/themes';
import { Loader2 } from 'lucide-react';
import { cn } from 'lib/utils';

interface ButtonProps extends ComponentProps<typeof Button> {
  loading?: boolean;
  variant?: 'solid' | 'outline' | 'ghost' | 'soft';
}

export function RadixButton({
  loading = false,
  disabled,
  children,
  className = '',
  variant = 'solid',
  ...props
}: ButtonProps): JSX.Element {
  // Tailwind classes for dark mode support
  const base = 'transition-colors duration-150 font-medium';
  const variants = {
    solid:
      'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:text-white dark:hover:bg-blue-800',
    outline:
      'border border-gray-300 text-blue-700 bg-white hover:bg-gray-50 dark:border-gray-600 dark:text-blue-300 dark:bg-gray-800 dark:hover:bg-gray-700',
    ghost:
      'bg-transparent text-blue-700 hover:bg-gray-100 dark:text-blue-300 dark:hover:bg-gray-700',
    soft: 'bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800',
  };
  return (
    <Button
      disabled={disabled || loading}
      className={cn(base, variants[variant], className)}
      {...props}
    >
      {loading && <Loader2 className="animate-spin -ml-1 mr-3 h-4 w-4" />}
      {children}
    </Button>
  );
}

// Also export as Button for backward compatibility
export { RadixButton as Button };
