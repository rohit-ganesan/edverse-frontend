import { ComponentProps } from 'react';
import { Card } from '@radix-ui/themes';

interface RadixCardProps extends ComponentProps<typeof Card> {
  children: React.ReactNode;
}

export function RadixCard({ children, ...props }: RadixCardProps): JSX.Element {
  return <Card {...props}>{children}</Card>;
}
