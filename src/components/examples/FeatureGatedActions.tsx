import React from 'react';
import { FeatureGate } from '../guards/FeatureGate';
import { CapabilityGate } from '../guards/CapabilityGate';
import { UpgradeHint } from '../upsell/UpgradeHint';
import { Button } from '@radix-ui/themes';

/**
 * Example component showing how to gate individual actions and buttons
 * This demonstrates the pattern for gating specific features within a loaded page
 */
export function FeatureGatedActions() {
  return (
    <div className="space-y-4 p-4">
      <h2 className="text-lg font-semibold">Feature-Gated Actions Example</h2>

      {/* Basic feature gate - button is disabled when feature not available */}
      <FeatureGate
        feature="fees.reminders.email"
        fallback={
          <UpgradeHint
            neededPlan="growth"
            message="Automated email reminders are part of Growth plan."
            context="action_button"
          />
        }
      >
        <CapabilityGate cap="fees.reminders.email">
          <Button className="bg-green-600 hover:bg-green-700">
            Send Email Reminders
          </Button>
        </CapabilityGate>
      </FeatureGate>

      {/* SMS reminders require Scale plan */}
      <FeatureGate
        feature="fees.reminders.smswa"
        fallback={
          <UpgradeHint
            neededPlan="scale"
            message="SMS reminders are part of Scale plan."
            context="action_button"
          />
        }
      >
        <CapabilityGate cap="fees.reminders.smswa">
          <Button className="bg-blue-600 hover:bg-blue-700">
            Send SMS Reminders
          </Button>
        </CapabilityGate>
      </FeatureGate>

      {/* Advanced analytics require Growth plan */}
      <FeatureGate
        feature="analytics.view"
        fallback={
          <UpgradeHint
            neededPlan="growth"
            message="Advanced analytics are part of Growth plan."
            context="action_button"
          />
        }
      >
        <CapabilityGate cap="analytics.view">
          <Button className="bg-purple-600 hover:bg-purple-700">
            View Advanced Analytics
          </Button>
        </CapabilityGate>
      </FeatureGate>

      {/* Enterprise-only features */}
      <FeatureGate
        feature="admissions.view"
        fallback={
          <UpgradeHint
            neededPlan="enterprise"
            message="Admissions management is part of Enterprise plan."
            context="action_button"
          />
        }
      >
        <CapabilityGate cap="admissions.view">
          <Button className="bg-red-600 hover:bg-red-700">
            Manage Admissions
          </Button>
        </CapabilityGate>
      </FeatureGate>
    </div>
  );
}
