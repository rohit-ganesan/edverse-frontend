import { ComponentProps } from 'react';
import { Card } from '@radix-ui/themes';
import { cn } from 'lib/utils';

interface RadixCardProps extends ComponentProps<typeof Card> {
  children: React.ReactNode;
  cardVariant?: 'default' | 'elevated' | 'outlined';
  className?: string;
}

export function RadixCard({
  children,
  cardVariant = 'default',
  className,
  ...props
}: RadixCardProps): JSX.Element {
  return (
    <Card
      className={cn(
        // Base styles
        'transition-all duration-200',
        // Card variant styles
        cardVariant === 'elevated' && 'shadow-lg hover:shadow-xl',
        cardVariant === 'outlined' &&
          'border border-gray-200 dark:border-gray-700',
        cardVariant === 'default' && 'shadow-sm hover:shadow-md',
        // Custom className
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
}
