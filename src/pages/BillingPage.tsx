import React, { useState, useEffect } from 'react';
import { Box, Flex, Text, Button } from '@radix-ui/themes';
import { CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { useAccess } from '../context/AccessContext';
import { useNavigate } from 'react-router-dom';
import {
  fetchPricing,
  formatPrice,
  formatPeriod,
  getUpgradeButtonText,
  isCurrentPlan,
  type PricingPlan,
} from '../lib/pricing';
import { startSubscription } from '../lib/pricing';
import { useAuth } from '../features/auth/AuthContext';

export const BillingPage: React.FC = () => {
  const { plan, refreshAccess } = useAccess();
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscribingPlan, setSubscribingPlan] = useState<string | null>(null);

  // Fetch pricing from backend
  useEffect(() => {
    const loadPricing = async () => {
      try {
        setLoading(true);
        setError(null);

        const pricingData = await fetchPricing({
          currency: 'USD',
          period: 'month',
        });

        setPlans(pricingData.plans);
      } catch (err) {
        console.error('Failed to load pricing:', err);
        setError(err instanceof Error ? err.message : 'Failed to load pricing');
      } finally {
        setLoading(false);
      }
    };

    loadPricing();
  }, []);

  return (
    <Box className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Box className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Box className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Box>

        <Box className="text-center mb-12">
          <Text
            size="6"
            weight="bold"
            className="text-gray-900 dark:text-gray-100 mb-4"
          >
            Choose Your Plan
          </Text>
          <Text size="4" className="text-gray-600 dark:text-gray-400">
            Select the perfect plan for your educational institution
          </Text>
        </Box>

        {/* Loading State */}
        {loading && (
          <Box className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <Text size="3" className="text-gray-600 dark:text-gray-400">
              Loading pricing information...
            </Text>
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Box className="text-center py-12">
            <Text size="4" className="text-red-600 dark:text-red-400 mb-4">
              Failed to load pricing
            </Text>
            <Text size="3" className="text-gray-600 dark:text-gray-400 mb-4">
              {error}
            </Text>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </Box>
        )}

        {/* Plans Grid */}
        {!loading && !error && (
          <Flex gap="6" wrap="wrap" justify="center">
            {plans.map((planItem) => (
              <Box
                key={planItem.plan_key}
                className={`
                bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-80
                ${isCurrentPlan(planItem.plan_key, plan) ? 'ring-2 ring-blue-500' : ''}
              `}
              >
                <Box className="text-center mb-6">
                  <Flex
                    align="center"
                    justify="center"
                    gap="2"
                    className="mb-2"
                  >
                    <Text
                      size="5"
                      weight="bold"
                      className="text-gray-900 dark:text-gray-100"
                    >
                      {planItem.plan_name}
                    </Text>
                    {isCurrentPlan(planItem.plan_key, plan) && (
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                    )}
                  </Flex>
                  <Flex align="baseline" justify="center" gap="1">
                    <Text
                      size="6"
                      weight="bold"
                      className="text-blue-600 dark:text-blue-400"
                    >
                      {formatPrice(planItem.amount_cents, planItem.currency)}
                    </Text>
                    <Text size="3" className="text-gray-500 dark:text-gray-400">
                      {formatPeriod(planItem.period, planItem.trial_days)}
                    </Text>
                  </Flex>
                </Box>

                <Box className="space-y-3 mb-6">
                  {planItem.features.map((feature, index) => (
                    <Flex key={index} align="center" gap="2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <Text
                        size="2"
                        className="text-gray-700 dark:text-gray-300"
                      >
                        {feature}
                      </Text>
                    </Flex>
                  ))}
                </Box>

                <Box className="text-center">
                  {isCurrentPlan(planItem.plan_key, plan) ? (
                    <Box className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                      <Text
                        size="2"
                        className="text-gray-600 dark:text-gray-400"
                      >
                        Current Plan
                      </Text>
                    </Box>
                  ) : (
                    <button
                      className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors ${subscribingPlan === planItem.plan_key ? 'opacity-70 cursor-wait' : ''}`}
                      disabled={!!subscribingPlan}
                      onClick={async () => {
                        try {
                          setSubscribingPlan(planItem.plan_key);
                          setError(null);
                          // Require tenant_id from profile
                          const tenantId = userProfile?.tenant_id;
                          if (!tenantId) {
                            throw new Error('No tenant selected');
                          }
                          await startSubscription({
                            tenant_id: tenantId,
                            plan_key: planItem.plan_key,
                            currency: planItem.currency,
                            period: planItem.period,
                          });
                          await refreshAccess();
                          navigate(-1);
                        } catch (e: any) {
                          setError(
                            e?.message || 'Failed to start subscription'
                          );
                        } finally {
                          setSubscribingPlan(null);
                        }
                      }}
                    >
                      {subscribingPlan === planItem.plan_key
                        ? 'Processing…'
                        : getUpgradeButtonText(
                            planItem,
                            plan,
                            isCurrentPlan(planItem.plan_key, plan)
                          )}
                    </button>
                  )}
                </Box>
              </Box>
            ))}
          </Flex>
        )}

        <Box className="text-center mt-12">
          <Text size="3" className="text-gray-600 dark:text-gray-400">
            Need help choosing? Contact our sales team for a personalized
            consultation.
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default BillingPage;
