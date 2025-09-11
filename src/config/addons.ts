/**
 * Add-on feature configuration
 * Maps Stripe Price IDs to feature keys and metadata
 */

export interface AddonConfig {
  feature: string;
  label: string;
  price: string;
  description: string;
  category:
    | 'payments'
    | 'communication'
    | 'analytics'
    | 'security'
    | 'customization'
    | 'management';
  plan: 'free' | 'starter' | 'growth' | 'scale' | 'enterprise';
  popular?: boolean;
}

// TODO: Replace with actual Stripe Price IDs when available
// MVP: Commenting out add-ons to focus on simple 3-tier plan structure
// TODO: Re-enable post-MVP for advanced features
// export const ADDON_CONFIGS: Record<string, AddonConfig> = {} as any;

// export const ADDON_CONFIGS_DISABLED_FOR_MVP: Record<string, AddonConfig> = {
//   // Online Payments add-on
//   price_online_payments: {
//     feature: 'fees.online',
//     label: 'Online Payments',
//     price: '$29/mo',
//     description:
//       'Accept credit card and bank transfer payments online with secure Stripe integration',
//     category: 'payments',
//     plan: 'growth',
//     popular: true,
//   },

//   // SMS/WhatsApp reminders add-on
//   price_sms_reminders: {
//     feature: 'fees.reminders.smswa',
//     label: 'SMS/WhatsApp Reminders',
//     price: '$19/mo',
//     description:
//       'Send automated payment reminders via SMS and WhatsApp to reduce late payments',
//     category: 'communication',
//     plan: 'scale',
//   },

//   // Advanced analytics add-on
//   price_advanced_analytics: {
//     feature: 'analytics.advanced',
//     label: 'Advanced Analytics',
//     price: '$39/mo',
//     description:
//       'Get detailed insights into your school performance with advanced reporting',
//     category: 'analytics',
//     plan: 'growth',
//   },

//   // SSO add-on
//   price_sso: {
//     feature: 'auth.sso',
//     label: 'Single Sign-On',
//     price: '$49/mo',
//     description:
//       'Integrate with your existing identity provider (Google Workspace, Microsoft 365, etc.)',
//     category: 'security',
//     plan: 'scale',
//   },

//   // Audit logs add-on
//   price_audit_logs: {
//     feature: 'audit.logs',
//     label: 'Audit Logs',
//     price: '$29/mo',
//     description:
//       'Track all system changes and user activities for compliance and security',
//     category: 'security',
//     plan: 'scale',
//   },

//   // Branding add-on
//   price_branding: {
//     feature: 'settings.branding',
//     label: 'Custom Branding',
//     price: '$39/mo',
//     description:
//       'Customize your school portal with your logo, colors, and branding',
//     category: 'customization',
//     plan: 'enterprise',
//   },

//   // Admissions add-on
//   price_admissions: {
//     feature: 'admissions.view',
//     label: 'Admissions Management',
//     price: '$59/mo',
//     description:
//       'Streamline your student admissions process with advanced workflows',
//     category: 'management',
//     plan: 'enterprise',
//   },

//   // Advanced syllabus add-on
//   price_syllabus_advanced: {
//     feature: 'syllabus.advanced',
//     label: 'Advanced Curriculum',
//     price: '$49/mo',
//     description:
//       'Create and manage complex curriculum structures with prerequisites and dependencies',
//     category: 'management',
//     plan: 'enterprise',
//   },
// };

// /**
//  * Get add-on config by feature key
//  */
// export function getAddonByFeature(feature: string): AddonConfig | null {
//   const addon = Object.values(ADDON_CONFIGS).find((a) => a.feature === feature);
//   return addon || null;
// }

// /**
//  * Get add-on config by Stripe price ID
//  */
// export function getAddonByPriceId(priceId: string): AddonConfig | null {
//   return ADDON_CONFIGS[priceId] || null;
// }

// /**
//  * Get all add-ons for a specific plan
//  */
// export function getAddonsForPlan(plan: string): AddonConfig[] {
//   return Object.values(ADDON_CONFIGS).filter((addon) => addon.plan === plan);
// }

// /**
//  * Get add-ons by category
//  */
// export function getAddonsByCategory(
//   category: AddonConfig['category']
// ): AddonConfig[] {
//   return Object.values(ADDON_CONFIGS).filter(
//     (addon) => addon.category === category
//   );
// }

// /**
//  * Get popular add-ons
//  */
// export function getPopularAddons(): AddonConfig[] {
//   return []; // Disabled for MVP
// }
