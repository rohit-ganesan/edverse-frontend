import React from 'react';
import type { Plan } from '../../types/access';
import { useAccessCheck } from '../../hooks/useAccessCheck';
import InlineUpgradeHint from '../upsell/InlineUpgradeHint';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  cap?: string;
  feature?: string;
  neededPlan?: Plan;
  hintMessage?: string;
  context?: string;
};

export function GuardedButton({
  cap,
  feature,
  neededPlan,
  hintMessage,
  context = 'guarded_button',
  disabled,
  children,
  ...rest
}: Props): JSX.Element {
  const check = useAccessCheck({ cap, feature, neededPlan });

  if (check.allowed) {
    return (
      <button disabled={disabled} {...rest}>
        {children}
      </button>
    );
  }

  const needed = (check.reason?.neededPlan as Plan) || 'starter';
  return (
    <div className="inline-flex items-center gap-2">
      <button disabled className="opacity-50 cursor-not-allowed" {...rest}>
        {children}
      </button>
      <InlineUpgradeHint
        neededPlan={needed}
        message={hintMessage}
        context={context}
      />
    </div>
  );
}

export default GuardedButton;
