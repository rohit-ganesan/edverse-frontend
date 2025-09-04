import React from 'react';
import { useAccess } from '../../context/AccessContext';
import { Text, Card, Badge } from '@radix-ui/themes';

export function AccessDebugger() {
  const { plan, role, features, capabilities, isLoading, isInitialized } =
    useAccess();

  if (isLoading) {
    return (
      <Card className="p-4 m-4">
        <Text>Loading access data...</Text>
      </Card>
    );
  }

  if (!isInitialized) {
    return (
      <Card className="p-4 m-4">
        <Text>Access not initialized</Text>
      </Card>
    );
  }

  return (
    <Card className="p-4 m-4">
      <Text size="4" weight="bold" className="mb-4">
        Access Debug Information
      </Text>

      <div className="space-y-4">
        <div>
          <Text weight="bold">Plan:</Text>
          <Badge color="blue" className="ml-2">
            {plan}
          </Badge>
        </div>

        <div>
          <Text weight="bold">Role:</Text>
          <Badge color="green" className="ml-2">
            {role}
          </Badge>
        </div>

        <div>
          <Text weight="bold">Features ({features.length}):</Text>
          <div className="mt-2 flex flex-wrap gap-1">
            {features.map((feature) => (
              <Badge key={feature} color="gray" variant="soft">
                {feature}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <Text weight="bold">Capabilities ({capabilities.length}):</Text>
          <div className="mt-2 flex flex-wrap gap-1">
            {capabilities.map((cap) => (
              <Badge key={cap} color="purple" variant="soft">
                {cap}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
