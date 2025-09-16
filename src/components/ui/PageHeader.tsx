import React from 'react';
import { Box, Flex, Text, Heading, Tooltip } from '@radix-ui/themes';
import { RadixButton } from './RadixButton';
import { LucideIcon, Lock } from 'lucide-react';
import { useAccessCheck } from '../../hooks/useAccessCheck';
import type { Plan } from '../../types/access';
import { getMinPlanForFeature } from '../../config/planFeatures';

interface ActionButton {
  label: string;
  icon?: LucideIcon;
  variant?: 'solid' | 'outline' | 'ghost';
  onClick?: () => void;
  isPrimary?: boolean;
  gate?: {
    cap?: string;
    feature?: string;
    neededPlan?: Plan;
    tooltip?: string;
  };
}

interface PageHeaderProps {
  title: string;
  description: string;
  actions?: ActionButton[];
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions = [],
  className = '',
}: PageHeaderProps): JSX.Element {
  // Validate required props
  if (!title || typeof title !== 'string') {
    console.error('PageHeader: title is required and must be a string');
    return (
      <Box className={`mb-8 ${className || ''}`}>
        <Heading size="8" className="text-gray-900 dark:text-white mb-2">
          Error: Invalid Title
        </Heading>
        <Text size="4" className="text-gray-600 dark:text-gray-400">
          The page title is missing or invalid.
        </Text>
      </Box>
    );
  }

  if (!description || typeof description !== 'string') {
    console.error('PageHeader: description is required and must be a string');
    return (
      <Box className={`mb-8 ${className || ''}`}>
        <Heading size="8" className="text-gray-900 dark:text-white mb-2">
          {title}
        </Heading>
        <Text size="4" className="text-gray-600 dark:text-gray-400">
          Error: Invalid description
        </Text>
      </Box>
    );
  }

  // Ensure actions is an array
  const safeActions = Array.isArray(actions) ? actions : [];

  // Filter out invalid actions
  const validActions = safeActions.filter((action) => {
    if (!action || typeof action !== 'object') {
      console.warn('PageHeader: Invalid action object found');
      return false;
    }

    if (!action.label || typeof action.label !== 'string') {
      console.warn('PageHeader: Action must have a valid label');
      return false;
    }

    return true;
  });

  const getRequiredPlanText = (opts?: {
    neededPlan?: Plan;
    feature?: string;
    tooltip?: string;
  }) => {
    if (opts?.tooltip) return opts.tooltip;
    const plan = (
      opts?.neededPlan ||
      (opts?.feature
        ? (getMinPlanForFeature(opts.feature) as Plan)
        : undefined) ||
      ('starter' as Plan)
    ).toUpperCase();
    return (
      <div className="flex items-center gap-2">
        <Lock className="w-3 h-3 text-amber-500" />
        <span className="text-amber-300">Requires {plan} plan</span>
      </div>
    );
  };

  const handleActionClick = (action: ActionButton, index: number): void => {
    try {
      if (action.onClick && typeof action.onClick === 'function') {
        action.onClick();
      } else {
        console.warn(
          `PageHeader: Action "${action.label}" has no onClick handler`
        );
      }
    } catch (error) {
      console.error(
        `PageHeader: Error executing action "${action.label}":`,
        error
      );
    }
  };

  function HeaderAction({
    action,
    index,
  }: {
    action: ActionButton;
    index: number;
  }) {
    // Always call the hook once with resolved params to satisfy Rules of Hooks
    const check = useAccessCheck({
      cap: action.gate?.cap,
      feature: action.gate?.feature,
      neededPlan: action.gate?.neededPlan,
    });
    const allowed = action.gate ? check.allowed : true;

    const IconComponent = action.icon;
    const variant = action.isPrimary ? 'solid' : action.variant || 'outline';

    if (allowed) {
      return (
        <RadixButton
          key={`action-${index}-${action.label}`}
          variant={variant}
          size="3"
          onClick={() => handleActionClick(action, index)}
          className={action.isPrimary ? 'bg-blue-600 hover:bg-blue-700' : ''}
        >
          {IconComponent && <IconComponent className="w-4 h-4" />}
          {action.label}
        </RadixButton>
      );
    }

    return (
      <Tooltip
        key={`action-${index}-${action.label}`}
        content={getRequiredPlanText({
          neededPlan: action.gate?.neededPlan as any,
          feature: action.gate?.feature,
          tooltip: action.gate?.tooltip,
        })}
      >
        <span>
          <RadixButton
            variant={variant}
            size="3"
            disabled
            className="opacity-60 cursor-not-allowed text-gray-400 dark:text-gray-300"
          >
            <Lock className="w-4 h-4" />
            {action.label}
          </RadixButton>
        </span>
      </Tooltip>
    );
  }

  return (
    <Box className={`mb-8 ${className || ''}`}>
      <Flex justify="between" align="center" className="mb-6">
        <Box>
          <Heading size="8" className="text-gray-900 dark:text-white mb-2">
            {title}
          </Heading>
          <Text size="4" className="text-gray-600 dark:text-gray-400">
            {description}
          </Text>
        </Box>
        {validActions.length > 0 && (
          <Flex gap="3" align="center">
            {validActions.map((action, index) => (
              <HeaderAction
                key={`${action.label}-${index}`}
                action={action}
                index={index}
              />
            ))}
          </Flex>
        )}
      </Flex>
    </Box>
  );
}
