# Fee Module

This module handles all fee-related functionality including payment tracking, collection management, and financial analytics.

## Structure

```
src/pages/Fee/
├── components/          # Reusable components
│   └── PaymentCard.tsx
├── hooks/              # Custom hooks
│   └── useFeeData.ts
├── tabs/               # Tab components
│   ├── Overview.tsx
│   └── Analytics.tsx
├── types.ts           # TypeScript type definitions
├── FeePage.tsx        # Main page component
├── index.ts           # Module exports
└── README.md          # This file
```

## Components

### FeePage

Main page component that orchestrates the entire fee management interface with tabs, stats, and actions.

### PaymentCard

Reusable component for displaying payment information with status indicators, overdue highlighting, and action buttons.

## Hooks

### useFeeData

Custom hook that provides:

- Payment data
- Fee structure information
- Reminder management
- Statistical calculations
- Loading and error states

## Tabs

### Overview

Displays recent payments, overdue payments, payment methods distribution, and upcoming due dates with modern gradient cards.

### Analytics

Comprehensive financial analytics dashboard with collection trends, payment status distribution, and performance metrics using RadixCard components with gradient headers.

## Types

All TypeScript interfaces are defined in `types.ts`:

- `FeeStructure` - Fee category and structure data
- `Payment` - Payment transaction information
- `Reminder` - Communication reminder details
- `FeeStats` - Financial statistics

## Features

- Modern RadixCard components with gradient headers
- Responsive grid layouts
- Interactive payment cards with status indicators
- Overdue payment highlighting
- Comprehensive financial analytics
- Collection trend analysis
- Payment method distribution
- Automated reminder system
- Export functionality
- Real-time statistics

## Usage

```tsx
import { FeePage } from 'pages/Fee';

// Use in router
<Route path="/fee" element={<FeePage />} />;
```

## Payment Status Types

- **Paid** - Full payment completed
- **Partial** - Partial payment made
- **Pending** - Payment due but not yet made
- **Overdue** - Payment past due date

## Future Enhancements

- Payment gateway integration
- Automated reminder scheduling
- Bulk payment processing
- Receipt generation
- Financial reporting
- Integration with accounting systems
- Mobile payment support
- Payment plan management
