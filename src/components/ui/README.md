# UI Components

This directory contains reusable UI components built on top of Radix UI primitives with consistent theming and styling.

## Core Components

### Radix Wrappers

- `RadixButton.tsx` - Button component with consistent styling
- `RadixCard.tsx` - Card container component
- `RadixTextField.tsx` - Text input component
- `RadixRadioGroup.tsx` - Radio button group component
- `RadixSeparator.tsx` - Divider/separator component

### Layout Components

- `PageHeader.tsx` - Standardized page header with title, description, and actions
- `StatsGrid.tsx` - Responsive grid for displaying statistics cards
- `StatsCard.tsx` - Individual statistic display with icon and optional trend
- `ActionCard.tsx` - Colored alert/action containers for important information ⭐ IMPROVED
- `ActionCardGrid.tsx` - Grid layout for multiple action cards ⭐ IMPROVED

### Form Components

- `FormField.tsx` - Form field wrapper with label and validation
- `Toast.tsx` - Toast notification component

### Utility Components

- `LineItem.tsx` - Simple line item display component

## ActionCard Components ⭐ IMPROVED LAYOUT

### ActionCard

Standardized colored containers for alerts, actions, and important information with enhanced layout and visual hierarchy.

**Latest Improvements:**

- **Enhanced Spacing**: Increased padding from `p-4` to `p-6` for better breathing room
- **Improved Alignment**: Changed from center to start alignment for better text flow
- **Better Icon Sizing**: Larger icons (12x12) with improved background opacity
- **Enhanced Typography**: Better text spacing with `leading-relaxed` and `mb-1` for titles
- **Stronger Visual Hierarchy**: Darker text colors and more prominent borders
- **Subtle Shadows**: Added `shadow-sm` for depth and professional appearance
- **Responsive Layout**: Better flex layout with `flex-1` and `min-w-0` for text overflow handling

**Usage:**

```tsx
import { ActionCard } from 'components/ui/ActionCard';
import { Send, Calendar } from 'lucide-react';

// Simple action card
<ActionCard
  title="Payment Reminder"
  description="Send reminders to students with overdue payments"
  variant="info"
  action={{
    label: "Send Reminders",
    icon: Send,
    onClick: () => handleSendReminders()
  }}
/>

// Complex action card with multiple actions and icon
<ActionCard
  title="Active Session: Mathematics 101"
  description="25/30 students checked in • Room A-101"
  variant="success"
  icon={Calendar}
  actions={[
    {
      label: "Monitor",
      icon: Eye,
      variant: "outline",
      onClick: () => handleMonitor()
    },
    {
      label: "End Session",
      onClick: () => handleEndSession()
    }
  ]}
/>
```

**Variants:**

- `info` - Blue theme for informational content
- `success` - Green theme for positive actions/status
- `warning` - Orange theme for cautionary alerts
- `error` - Red theme for urgent/critical alerts
- `primary` - Purple theme for primary actions
- `secondary` - Gray theme for secondary actions

### ActionCardGrid

Grid layout manager for multiple action cards with improved spacing.

**Usage:**

```tsx
import { ActionCardGrid } from 'components/ui/ActionCardGrid';

<ActionCardGrid
  cards={[
    {
      title: 'Send Notifications',
      description: 'Notify students about upcoming events',
      variant: 'info',
      action: {
        label: 'Send',
        icon: Send,
        onClick: () => handleSend(),
      },
    },
    {
      title: 'Generate Reports',
      description: 'Download detailed analytics',
      variant: 'success',
      action: {
        label: 'Generate',
        icon: Download,
        onClick: () => handleGenerate(),
      },
    },
  ]}
  columns="3"
/>;
```

## Design Principles

1. **Consistency** - All components follow the same design patterns and color schemes
2. **Accessibility** - Proper ARIA labels, keyboard navigation, and screen reader support
3. **Flexibility** - Components accept custom props while maintaining design consistency
4. **Type Safety** - Full TypeScript support with proper interfaces
5. **Performance** - Optimized for React rendering and bundle size
6. **Visual Hierarchy** - Clear typography scale and color contrast ⭐ NEW

## Color System

### Action Card Variants (Updated)

- **Blue (info)**: `bg-blue-50 border-blue-500 text-blue-900` with blue-700 descriptions
- **Green (success)**: `bg-green-50 border-green-500 text-green-900` with green-700 descriptions
- **Orange (warning)**: `bg-orange-50 border-orange-500 text-orange-900` with orange-700 descriptions
- **Red (error)**: `bg-red-50 border-red-500 text-red-900` with red-700 descriptions
- **Purple (primary)**: `bg-purple-50 border-purple-500 text-purple-900` with purple-700 descriptions
- **Gray (secondary)**: `bg-gray-50 border-gray-500 text-gray-900` with gray-700 descriptions

### Layout Specifications

- **Card Padding**: `p-6` (24px) for comfortable spacing
- **Icon Size**: `w-12 h-12` (48px) with `w-6 h-6` (24px) inner icons
- **Border Width**: `border-l-4` (4px) for strong visual accent
- **Typography**: Title with `mb-1` spacing, description with `leading-relaxed`
- **Shadow**: `shadow-sm` for subtle depth
- **Flex Layout**: `justify-between align-start gap-4` for optimal spacing

## Usage Guidelines

1. **Import Path**: Always use absolute imports from `components/ui/`
2. **Prop Consistency**: Use the standardized prop interfaces
3. **Icon Usage**: Use Lucide React icons for consistency
4. **Spacing**: Follow the established spacing patterns (mb-6, p-6, etc.)
5. **Variants**: Choose appropriate variants based on the action/alert type
6. **Layout**: Leverage the improved flex layout for responsive design ⭐ NEW

## Testing

Components are tested using Jest and React Testing Library. Test files are located in the `__tests__` directory.

## Contributing

When adding new components:

1. Follow the existing naming conventions
2. Add proper TypeScript interfaces
3. Include comprehensive props documentation
4. Add test coverage
5. Update this README with usage examples
6. Maintain the established visual hierarchy and spacing patterns ⭐ NEW

### NoticeItem

The `NoticeItem` component provides a standardized way to display notices and notifications with proper null safety and date formatting.

```tsx
import { NoticeItem } from 'components/ui/NoticeItem';
import { Info } from 'lucide-react';

<NoticeItem
  id="notice-1"
  title="System Maintenance"
  message="Scheduled maintenance will occur this weekend."
  type="info"
  createdAt={new Date()}
  icon={Info}
  onClick={() => console.log('Notice clicked')}
/>;
```

**Props:**

- `id` (required): Unique identifier for the notice
- `title` (required): Notice title text
- `message` (optional): Notice description/message
- `type` (required): Notice type - 'success', 'info', 'warning', or 'error'
- `createdAt` (required): Date/timestamp when notice was created (supports multiple formats)
- `icon` (required): Lucide icon component to display
- `onClick` (optional): Click handler function
- `className` (optional): Additional CSS classes

**Features:**

- Robust date formatting with multiple timestamp format support
- Proper null safety and error handling
- Type-based color coding and icons
- Responsive design with hover effects
- Accessibility support

### StatsCard

Display statistical information with icons and optional trend indicators.

```tsx
import { StatsCard } from 'components/ui/StatsCard';
import { Users } from 'lucide-react';

<StatsCard
  title="Total Users"
  value="1,234"
  icon={Users}
  iconColor="text-blue-600"
  iconBgColor="bg-blue-100"
  trend={{ value: '5%', isPositive: true }}
/>;
```

### PageHeader

Standardized page header with title, description, and action buttons.

```tsx
import { PageHeader } from 'components/ui/PageHeader';
import { Plus, Download } from 'lucide-react';

<PageHeader
  title="Dashboard"
  description="Welcome to your dashboard"
  actions={[
    {
      label: 'Export Data',
      icon: Download,
      onClick: () => console.log('Export clicked'),
    },
    {
      label: 'Add New',
      icon: Plus,
      onClick: () => console.log('Add clicked'),
      isPrimary: true,
    },
  ]}
/>;
```

## Design Principles

1. **Consistency**: All components follow the same design patterns and use consistent spacing, colors, and typography
2. **Accessibility**: Components include proper ARIA labels, keyboard navigation, and screen reader support
3. **Null Safety**: All components include proper validation and error handling for props
4. **Responsive**: Components work across different screen sizes
5. **Theming**: Components support both light and dark themes through Tailwind CSS classes
6. **Type Safety**: Full TypeScript support with proper interfaces and prop validation

## Styling

Components use Tailwind CSS for styling with consistent design tokens:

- **Colors**: Primary (blue), success (green), warning (orange), error (red)
- **Spacing**: Consistent padding and margin using Tailwind scale
- **Typography**: Radix UI Text and Heading components with size variants
- **Shadows**: Subtle shadows for depth and hierarchy
- **Borders**: Consistent border radius and colors

## Error Handling

All components include comprehensive error handling:

- Prop validation with helpful error messages
- Graceful fallbacks for missing or invalid data
- Console warnings for development debugging
- Safe rendering that prevents crashes

## Testing

Components should be tested for:

- Proper rendering with valid props
- Error handling with invalid props
- Accessibility compliance
- Responsive behavior
- Theme switching (light/dark mode)
