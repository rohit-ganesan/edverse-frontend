import React from 'react';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Box, Text, Button, Badge } from '@radix-ui/themes';
import type { Plan } from '../../types/access';
import { useUpgradeTelemetry } from '../../hooks/useUpgradeTelemetry';
import { usePlan } from '../../context/AccessContext';

type Props = {
  neededPlan: Plan;
  message?: string;
  context?: string;
};

export function InlineUpgradeHint({
  neededPlan,
  message,
  context = 'inline_hint',
}: Props): JSX.Element {
  const navigate = useNavigate();
  const currentPlan = usePlan();
  const { trackUpgradeClicked, trackUpgradeShown } = useUpgradeTelemetry();

  // Fire lightweight shown event
  // eslint-disable-next-line react-hooks/rules-of-hooks
  React.useEffect(() => {
    trackUpgradeShown(neededPlan, context);
  }, [neededPlan, context, trackUpgradeShown]);

  const onClick = () => {
    trackUpgradeClicked(currentPlan, neededPlan, context);
    navigate('/billing');
  };

  return (
    <Box className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-amber-50 border border-amber-200">
      <Lock className="w-3 h-3 text-amber-600" />
      <Text size="1" className="text-amber-700">
        {message || `Requires ${neededPlan} plan`}
      </Text>
      <Badge size="1" color="amber" variant="soft">
        {neededPlan.toUpperCase()}
      </Badge>
      <Button
        size="1"
        variant="ghost"
        onClick={onClick}
        className="text-amber-700 hover:text-amber-900"
      >
        Upgrade
      </Button>
    </Box>
  );
}

export default InlineUpgradeHint;
