# Paid Add-ons & Feature Grants Implementation

This document describes the comprehensive paid add-ons system implemented in EdVerse, which allows tenants to purchase individual features above their base plan.

## Overview

The system implements **Grants Mode**: `effective_features = plan ⊖ disables ⊕ active grants`, where:
- **Plan features**: Base features included in the tenant's subscription plan
- **Disables**: Features turned off via `tenant_features.enabled=false` (off-switch only)
- **Active grants**: Features unlocked via paid add-ons, trials, or promotional grants

## Architecture

### Backend (Supabase)

#### Database Schema

1. **`tenant_feature_grants`** - Stores active feature grants
   - `tenant_id`, `feature`, `reason` (paid_addon/trial/promo/contract/support)
   - `starts_at`, `expires_at` (nullable for permanent grants)
   - `metadata` (JSONB for Stripe subscription details)

2. **`tenant_feature_grant_events`** - Audit trail for grant lifecycle
   - Tracks granted, revoked, expired, extended events
   - Stores metadata about each event

#### Edge Functions

1. **`get-access-data`** - Enhanced to compute effective features
   - Fetches plan features, tenant disables, and active grants
   - Computes: `plan ⊖ disables ⊕ grants`
   - Returns `effective_features` array

2. **`stripe-webhook`** - Manages grants based on subscription changes
   - Maps Stripe price IDs to feature keys
   - Adds/removes grants based on active subscription items
   - Logs audit events

### Frontend (React)

#### Access System

1. **`useAccessCheck`** - Primary access control hook
   - Enforces `neededPlan` at highest priority
   - Checks features and capabilities
   - Returns detailed access reasons

2. **Guard Components**
   - `RouteGuard` - Route-level access control
   - `FeatureGate` - Feature-level gating
   - `CapabilityGate` - Capability-level gating

3. **UpgradeHint** - Enhanced upgrade prompts
   - Shows add-on specific CTAs with pricing
   - Differentiates between plan upgrades and add-ons

#### Configuration

1. **`ADDON_CONFIGS`** - Maps Stripe price IDs to features
   - Includes pricing, descriptions, categories
   - Centralized configuration for consistency

2. **Routes** - Enhanced with `neededPlan` enforcement
   - Plan-first gating before feature/capability checks
   - Consistent use of `fees.reconcile` for advanced fees

## Key Features

### 1. Plan-First Enforcement

```typescript
// Plan rank: free=0, starter=1, growth=2, scale=3, enterprise=4
const accessCheck = useAccessCheck({
  feature: 'fees.reconcile',
  neededPlan: 'scale' // Blocks Free, Starter, Growth plans
});
```

### 2. Feature Grants

```typescript
// A Free tenant with a grant for fees.online receives the feature
const effectiveFeatures = [
  ...planFeatures,           // Free plan features
  ...activeGrants.map(g => g.feature) // fees.online from grant
];
```

### 3. Add-on CTAs

```typescript
// UpgradeHint automatically shows add-on specific messaging
<UpgradeHint feature="fees.online" />
// Shows: "Enable Online Payments — $29/mo"
```

### 4. Comprehensive Telemetry

```typescript
// Track all access events
trackRouteLocked({
  feature: 'fees.reconcile',
  plan: 'growth',
  neededPlan: 'scale',
  reason: 'plan'
});
```

## Usage Examples

### Route Protection

```typescript
// Protect a route with plan + feature + capability requirements
<RouteGuard 
  neededPlan="scale"
  feature="fees.reconcile"
  cap="fees.reconcile"
  routePath="/fees-advanced"
>
  <AdvancedFeesPage />
</RouteGuard>
```

### Feature Gating

```typescript
// Gate a feature with plan enforcement
<FeatureGate feature="fees.online" neededPlan="growth">
  <OnlinePaymentsButton />
</FeatureGate>
```

### Action Gating

```typescript
// Gate actions based on capabilities
<CapabilityGate cap="fees.reconcile">
  <ReconcileButton />
</CapabilityGate>
```

### Access Checking

```typescript
// Check access programmatically
const { canAccess, reason } = useAccessCheck({
  feature: 'analytics.advanced',
  neededPlan: 'growth'
});

if (!canAccess && reason?.neededPlan) {
  // Show upgrade prompt
}
```

## Database Operations

### Adding a Grant

```sql
INSERT INTO tenant_feature_grants (
  tenant_id, feature, reason, metadata
) VALUES (
  'tenant-uuid',
  'fees.online',
  'paid_addon',
  '{"stripe_subscription_id": "sub_123", "stripe_price_id": "price_online_payments"}'
);
```

### Checking Active Grants

```sql
-- Get all active grants for a tenant
SELECT feature, reason, expires_at 
FROM tenant_feature_grants 
WHERE tenant_id = 'tenant-uuid'
  AND (expires_at IS NULL OR expires_at > NOW())
  AND starts_at <= NOW();
```

### Helper Functions

```sql
-- Check if a specific feature is granted
SELECT is_feature_granted('tenant-uuid', 'fees.online');

-- Get all active grants
SELECT * FROM get_active_grants('tenant-uuid');
```

## Stripe Integration

### Webhook Processing

1. **Subscription Created/Updated**
   - Extract active subscription items
   - Map price IDs to features
   - Upsert grants for paid features

2. **Subscription Cancelled/Deleted**
   - Remove grants for cancelled features
   - Log revocation events

### Price ID Mapping

```typescript
const STRIPE_PRICE_TO_FEATURE = {
  'price_online_payments': 'fees.online',
  'price_sms_reminders': 'fees.reminders.smswa',
  'price_advanced_analytics': 'analytics.advanced',
  // ... more mappings
};
```

## Testing Matrix

### 1. Free Admin
- ✅ `/fees` opens (view only)
- ❌ `/payments-online` locked with UpgradeHint
- ❌ "Send Reminder" button shows UpgradeHint

### 2. Growth Admin (no grants)
- ✅ `/fees` opens with all basic actions
- ❌ `/payments-online` shows UpgradeHint (paid add-on)
- ❌ "SMS Reminders" locked (Scale plan)

### 3. Enterprise Admin
- ✅ `/fees-advanced` opens (has `fees.reconcile`)
- ✅ All fee actions available
- ✅ Admissions management available

### 4. Admissions Role
- ✅ Can read/update admissions and students
- ✅ Capabilities: `['students.view','students.crud','admissions.view','admissions.crud']`

## Security Considerations

### Row Level Security (RLS)

1. **Feature Grants**
   - Read: Tenant members
   - Write: Owner/admin only

2. **Grant Events**
   - Read: Tenant members
   - Insert: Owner/admin only

### Access Validation

1. **Server-side**: RLS policies enforce tenant isolation
2. **Client-side**: Access checks provide UX gating
3. **Edge Functions**: Service role key for webhook processing

## Deployment Checklist

### Backend

- [ ] Run `migrate-feature-grants.sql` on Supabase
- [ ] Deploy updated `get-access-data` edge function
- [ ] Deploy new `stripe-webhook` edge function
- [ ] Configure Stripe webhook endpoint

### Frontend

- [ ] Update access types and hooks
- [ ] Deploy enhanced guard components
- [ ] Update route configurations
- [ ] Test access enforcement

### Configuration

- [ ] Update Stripe price ID mappings
- [ ] Configure add-on pricing and descriptions
- [ ] Set up telemetry tracking
- [ ] Test grant lifecycle

## Monitoring & Analytics

### Key Metrics

1. **Access Events**
   - Route locks by reason (plan/feature/capability)
   - Feature locked views
   - Action locks

2. **Grant Lifecycle**
   - Add-ons enabled/disabled
   - Trial conversions
   - Grant expirations

3. **User Behavior**
   - Upgrade hint interactions
   - Billing page visits
   - Add-on purchases

### Telemetry Events

```typescript
// Route access
'route_locked' // { feature, cap, plan, neededPlan, reason }

// Grant lifecycle
'addon_enabled' // { feature, reason, plan, metadata }
'addon_disabled' // { feature, reason, plan, metadata }
'addon_expired' // { feature, reason, plan, metadata }

// User interactions
'feature_locked_viewed' // { feature, plan, neededPlan, context }
'action_locked' // { action, cap, plan, context }
```

## Troubleshooting

### Common Issues

1. **Grants not appearing**
   - Check `tenant_feature_grants` table
   - Verify `expires_at` and `starts_at` dates
   - Check RLS policies

2. **Access still blocked after grant**
   - Refresh access context
   - Verify grant is active
   - Check feature key consistency

3. **Stripe webhook failures**
   - Verify webhook endpoint URL
   - Check Stripe signature verification
   - Review webhook logs

### Debug Queries

```sql
-- Check active grants for a tenant
SELECT * FROM tenant_feature_grants 
WHERE tenant_id = 'tenant-uuid' 
  AND (expires_at IS NULL OR expires_at > NOW())
  AND starts_at <= NOW();

-- Check grant events
SELECT * FROM tenant_feature_grant_events 
WHERE tenant_id = 'tenant-uuid' 
ORDER BY created_at DESC;

-- Verify RLS policies
SELECT * FROM pg_policies 
WHERE tablename = 'tenant_feature_grants';
```

## Future Enhancements

### Planned Features

1. **Bulk Operations**
   - Grant multiple features at once
   - Batch grant management

2. **Advanced Analytics**
   - Grant usage tracking
   - ROI analysis for add-ons

3. **Automated Workflows**
   - Trial expiration notifications
   - Automatic grant renewals

4. **Integration APIs**
   - REST endpoints for grant management
   - Webhook customization

### Migration Path

The system is designed to be backward compatible:
- Existing `tenant_features` continue to work
- Plan-based access remains unchanged
- New grants layer on top of existing system

## Support

For questions or issues with the paid add-ons system:

1. Check this documentation
2. Review database logs and edge function logs
3. Test with the provided examples
4. Contact the development team

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Status**: Production Ready
