import React from 'react';
import { Grid } from '@radix-ui/themes';
import { ActionCard } from './ActionCard';
import { LucideIcon } from 'lucide-react';

interface ActionCardData {
  title: string;
  description: string;
  variant: 'info' | 'success' | 'warning' | 'error' | 'primary' | 'secondary';
  action?: {
    label: string;
    icon?: LucideIcon;
    variant?: 'solid' | 'outline' | 'ghost';
    onClick?: () => void;
    className?: string;
  };
  actions?: {
    label: string;
    icon?: LucideIcon;
    variant?: 'solid' | 'outline' | 'ghost';
    onClick?: () => void;
    className?: string;
  }[];
  icon?: LucideIcon;
}

interface ActionCardGridProps {
  cards: ActionCardData[];
  columns?: '2' | '3' | '4';
  className?: string;
}

export function ActionCardGrid({
  cards,
  columns = '3',
  className = '',
}: ActionCardGridProps): JSX.Element {
  return (
    <Grid columns={columns} gap="4" className={`mb-6 ${className}`}>
      {cards.map((card, index) => (
        <ActionCard
          key={index}
          title={card.title}
          description={card.description}
          variant={card.variant}
          action={card.action}
          actions={card.actions}
          icon={card.icon}
        />
      ))}
    </Grid>
  );
}
