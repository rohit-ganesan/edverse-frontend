// ============================================================================
// PRICING API CLIENT
// ============================================================================
// Frontend utilities for fetching backend-driven pricing
// Keeps frontend completely stateless for pricing data
// ============================================================================

import { supabase } from './supabase';

export interface PricingPlan {
  plan_key: 'free' | 'starter' | 'growth';
  plan_name: string;
  currency: string;
  region: string | null;
  period: 'month' | 'year';
  price_version_id: string | null;
  amount_cents: number;
  trial_days: number;
  features: string[];
  effective_from: string | null;
  stripe_price_id: string | null;
  sort_order: number;
}

export interface PricingResponse {
  plans: PricingPlan[];
  as_of: string;
  currency: string;
  region: string | null;
  period: string;
}

export interface StartSubscriptionRequest {
  tenant_id: string;
  plan_key: 'free' | 'starter' | 'growth';
  currency?: string;
  region?: string;
  period?: 'month' | 'year';
  stripe_payment_method_id?: string;
}

export interface StartSubscriptionResponse {
  subscription: {
    id: string;
    tenant_id: string;
    plan_key: string;
    plan_name: string;
    status: string;
    amount_cents: number;
    currency: string;
    billing_period: string;
    trial_days: number;
    current_period_start: string;
    current_period_end: string | null;
    price_version_id: string;
    stripe_subscription_id: string | null;
  };
  requires_payment: boolean;
  client_secret?: string;
}

/**
 * Fetch current public pricing from backend
 * This replaces all hardcoded pricing in the frontend
 */
export async function fetchPricing({
  currency = 'USD',
  region,
  period = 'month',
}: {
  currency?: string;
  region?: string;
  period?: 'month' | 'year';
} = {}): Promise<PricingResponse> {
  try {
    const url = new URL(
      `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/get-pricing`
    );
    url.searchParams.set('currency', currency);
    if (region) url.searchParams.set('region', region);
    url.searchParams.set('period', period);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();

    console.log(
      `[pricing] Fetched ${data.plans?.length || 0} plans for ${currency}/${region}/${period}`
    );

    return data;
  } catch (error) {
    console.error('[pricing] Failed to fetch pricing:', error);
    throw error;
  }
}

/**
 * Start or upgrade a subscription
 * Always uses the current price version (grandfathering previous customers)
 */
export async function startSubscription(
  request: StartSubscriptionRequest
): Promise<StartSubscriptionResponse> {
  try {
    const { data, error } = await supabase.functions.invoke(
      'start-subscription',
      {
        body: request,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (error) {
      console.error('[pricing] Subscription creation failed:', error);
      throw error;
    }

    console.log(
      `[pricing] Successfully started subscription for tenant ${request.tenant_id}, plan ${request.plan_key}`
    );

    return data;
  } catch (error) {
    console.error('[pricing] Failed to start subscription:', error);
    throw error;
  }
}

/**
 * Format price for display
 */
export function formatPrice(
  amountCents: number,
  currency: string = 'USD'
): string {
  if (amountCents === 0) return '$0';

  const amount = amountCents / 100;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Get period display text
 */
export function formatPeriod(period: string, trialDays?: number): string {
  const periodText = period === 'month' ? 'per month' : 'per year';

  if (trialDays && trialDays > 0) {
    return `${periodText} (${trialDays}-day free trial)`;
  }

  return periodText;
}

/**
 * Calculate savings for annual plans
 */
export function calculateAnnualSavings(
  monthlyPrice: number,
  annualPrice: number
): {
  savingsPercent: number;
  savingsAmount: number;
} {
  if (monthlyPrice === 0 || annualPrice === 0) {
    return { savingsPercent: 0, savingsAmount: 0 };
  }

  const annualEquivalent = monthlyPrice * 12;
  const savingsAmount = annualEquivalent - annualPrice;
  const savingsPercent = Math.round((savingsAmount / annualEquivalent) * 100);

  return { savingsPercent, savingsAmount };
}

/**
 * Check if a plan is a current plan for a tenant
 */
export function isCurrentPlan(planKey: string, currentPlan?: string): boolean {
  return planKey === currentPlan;
}

/**
 * Determine if a plan requires payment
 */
export function requiresPayment(plan: PricingPlan): boolean {
  return plan.amount_cents > 0;
}

/**
 * Get upgrade button text
 */
export function getUpgradeButtonText(
  plan: PricingPlan,
  currentPlan?: string,
  isCurrentPlan?: boolean
): string {
  if (isCurrentPlan) {
    return 'Current Plan';
  }

  if (plan.plan_key === 'free') {
    return 'Get Started';
  }

  if (!currentPlan || currentPlan === 'free') {
    return `Upgrade to ${plan.plan_name}`;
  }

  return 'Contact Sales';
}

/**
 * Check if user can manage billing for a tenant
 */
export function canManageBilling(userRole?: string): boolean {
  return userRole === 'owner' || userRole === 'admin';
}

/**
 * Get user-friendly error message from API error
 */
export function getErrorMessage(error: any): string {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.error) return error.error;
  return 'An unexpected error occurred';
}
