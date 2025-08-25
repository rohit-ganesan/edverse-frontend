import { Lock } from 'lucide-react';
import { usePlan } from '../../context/AccessContext';

type Needed = 'starter' | 'growth' | 'scale' | 'enterprise';

export function UpgradeHint({
  neededPlan,
  message,
  ctaHref = '/billing',
}: {
  neededPlan: Needed;
  message?: string;
  ctaHref?: string;
}) {
  const plan = usePlan();
  return (
    <div className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
      <div className="mt-0.5">
        <Lock className="h-5 w-5" aria-hidden />
      </div>
      <div className="flex-1">
        <div className="font-semibold">
          Locked on current plan (<span className="uppercase">{plan}</span>)
        </div>
        <div className="mt-1 text-sm text-neutral-700">
          {message ?? `This feature requires the ${neededPlan} plan.`}
        </div>
        <a
          href={ctaHref}
          className="mt-3 inline-flex items-center rounded-lg bg-black px-3 py-2 text-sm font-medium text-white"
        >
          Upgrade to {neededPlan}
        </a>
      </div>
    </div>
  );
}
