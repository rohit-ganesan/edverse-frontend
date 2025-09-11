import React from 'react';
import { RouteGuard, useRouteAccess } from '../components/routing/RouteGuard';
import { FeatureGate } from '../components/guards/FeatureGate';
import { CapabilityGate } from '../components/guards/CapabilityGate';
import { useAccessCheck } from '../hooks/useAccessCheck';
import {
  Card,
  Flex,
  Text,
  Heading,
  Box,
  Container,
  Badge,
} from '@radix-ui/themes';

/**
 * Example component demonstrating the new access system
 */
export function AccessTestingExamples(): JSX.Element {
  return (
    <Container size="4" className="p-6">
      <Heading size="8" className="mb-8">
        Access System Examples
      </Heading>

      {/* Route Guard Examples */}
      <Box className="mb-8">
        <Heading size="6" className="mb-4">
          Route Guards
        </Heading>

        {/* Plan-based route guard */}
        <Card className="mb-4">
          <Heading size="4" className="mb-2">
            Growth Plan Route
          </Heading>
          <RouteGuard neededPlan="growth" routePath="/analytics">
            <Box className="bg-green-100 p-4 rounded">
              ✅ This route requires Growth plan or higher
            </Box>
          </RouteGuard>
        </Card>

        {/* Feature-based route guard */}
        <Card className="mb-4">
          <Heading size="4" className="mb-2">
            Online Payments Route
          </Heading>
          <RouteGuard
            feature="fees.online"
            cap="fees.online"
            routePath="/payments-online"
          >
            <Box className="bg-green-100 p-4 rounded">
              ✅ This route requires fees.online feature and capability
            </Box>
          </RouteGuard>
        </Card>

        {/* Enterprise route guard */}
        <Card className="mb-4">
          <Heading size="4" className="mb-2">
            Admissions Route
          </Heading>
          <RouteGuard
            neededPlan="growth"
            feature="admissions.view"
            routePath="/admissions"
          >
            <Box className="bg-green-100 p-4 rounded">
              ✅ This route requires Enterprise plan and admissions.view feature
            </Box>
          </RouteGuard>
        </Card>
      </Box>

      {/* Feature Gate Examples */}
      <Box className="mb-8">
        <Heading size="6" className="mb-4">
          Feature Gates
        </Heading>

        <Card className="mb-4">
          <Heading size="4" className="mb-2">
            Advanced Fees Feature
          </Heading>
          <FeatureGate feature="fees.reconcile" neededPlan="growth">
            <Box className="bg-green-100 p-4 rounded">
              ✅ Advanced fees reconciliation is available
            </Box>
          </FeatureGate>
        </Card>

        <Card className="mb-4">
          <Heading size="4" className="mb-2">
            Online Payments Feature
          </Heading>
          <FeatureGate feature="fees.online">
            <Box className="bg-green-100 p-4 rounded">
              ✅ Online payments are enabled
            </Box>
          </FeatureGate>
        </Card>
      </Box>

      {/* Capability Gate Examples */}
      <Box className="mb-8">
        <Heading size="6" className="mb-4">
          Capability Gates
        </Heading>

        <Card className="mb-4">
          <Heading size="4" className="mb-2">
            Student Management
          </Heading>
          <CapabilityGate cap="students.crud">
            <Box className="bg-green-100 p-4 rounded">
              ✅ You can create, update, and delete students
            </Box>
          </CapabilityGate>
        </Card>

        <Card className="mb-4">
          <Heading size="4" className="mb-2">
            Fee Reconciliation
          </Heading>
          <CapabilityGate cap="fees.reconcile">
            <Box className="bg-green-100 p-4 rounded">
              ✅ You can reconcile fee payments
            </Box>
          </CapabilityGate>
        </Card>
      </Box>

      {/* Hook Examples */}
      <Box className="mb-8">
        <Heading size="6" className="mb-4">
          Access Check Hooks
        </Heading>

        <AccessCheckExample />
        <RouteAccessExample />
      </Box>
    </Container>
  );
}

/**
 * Example component using useAccessCheck hook
 */
function AccessCheckExample(): JSX.Element {
  const accessCheck = useAccessCheck({
    feature: 'fees.reconcile',
    cap: 'fees.reconcile',
    neededPlan: 'growth',
  });

  return (
    <Card className="mb-4">
      <Heading size="4" className="mb-2">
        useAccessCheck Hook
      </Heading>
      <Box className="space-y-2">
        <Text size="2">
          Access Allowed: {accessCheck.allowed ? '✅ Yes' : '❌ No'}
        </Text>
        {accessCheck.reason && (
          <Box className="bg-gray-100 p-3 rounded">
            <Text size="2" weight="bold" className="mb-2">
              Access Denied Reason:
            </Text>
            <ul className="list-disc list-inside ml-2">
              {accessCheck.reason.neededPlan && (
                <li>
                  <Text size="2">
                    Needs Plan: {accessCheck.reason.neededPlan}
                  </Text>
                </li>
              )}
              {accessCheck.reason.missingFeature && (
                <li>
                  <Text size="2">
                    Missing Feature: {accessCheck.reason.missingFeature}
                  </Text>
                </li>
              )}
              {accessCheck.reason.missingCapability && (
                <li>
                  <Text size="2">
                    Missing Capability: {accessCheck.reason.missingCapability}
                  </Text>
                </li>
              )}
              {accessCheck.reason.currentPlan && (
                <li>
                  <Text size="2">
                    Current Plan: {accessCheck.reason.currentPlan}
                  </Text>
                </li>
              )}
            </ul>
          </Box>
        )}
      </Box>
    </Card>
  );
}

/**
 * Example component using useRouteAccess hook
 */
function RouteAccessExample(): JSX.Element {
  const routeAccess = useRouteAccess({
    feature: 'analytics.view',
    neededPlan: 'growth',
  });

  return (
    <Card className="mb-4">
      <Heading size="4" className="mb-2">
        useRouteAccess Hook
      </Heading>
      <Box className="space-y-2">
        <Text size="2">
          Can Access: {routeAccess.canAccess ? '✅ Yes' : '❌ No'}
        </Text>
        <Text size="2">
          Plan Blocked: {routeAccess.isPlanBlocked ? '❌ Yes' : '✅ No'}
        </Text>
        <Text size="2">
          Feature Blocked: {routeAccess.isFeatureBlocked ? '❌ Yes' : '✅ No'}
        </Text>
        <Text size="2">
          Capability Blocked:{' '}
          {routeAccess.isCapabilityBlocked ? '❌ Yes' : '✅ No'}
        </Text>
      </Box>
    </Card>
  );
}
