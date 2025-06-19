import { ComponentProps } from 'react';
import { Separator } from '@radix-ui/themes';

interface RadixSeparatorProps extends ComponentProps<typeof Separator> {}

export function RadixSeparator(props: RadixSeparatorProps): JSX.Element {
  return <Separator {...props} />;
}
