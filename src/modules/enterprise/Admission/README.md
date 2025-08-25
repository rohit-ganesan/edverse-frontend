# Admission Module

This module handles all admission-related functionality including application processing, program management, and analytics.

## Structure

```
src/pages/Admission/
├── components/          # Reusable components
│   └── ApplicationCard.tsx
├── hooks/              # Custom hooks
│   └── useAdmissionData.ts
├── tabs/               # Tab components
│   ├── Overview.tsx
│   └── Analytics.tsx
├── types.ts           # TypeScript type definitions
├── AdmissionPage.tsx  # Main page component
├── index.ts           # Module exports
└── README.md          # This file
```

## Components

### AdmissionPage

Main page component that orchestrates the entire admission interface with tabs, stats, and actions.

### ApplicationCard

Reusable component for displaying application information with modern styling and interaction capabilities.

## Hooks

### useAdmissionData

Custom hook that provides:

- Application data
- Program information
- Statistical calculations
- Loading and error states

## Tabs

### Overview

Displays recent applications, status distribution, popular programs, and upcoming deadlines with modern gradient cards.

### Analytics

Comprehensive analytics dashboard with charts, trends, and performance metrics using RadixCard components with gradient headers.

## Types

All TypeScript interfaces are defined in `types.ts`:

- `Application` - Student application data
- `Document` - Application document information
- `AcademicScore` - Academic performance metrics
- `AdmissionProgram` - Program details
- `AdmissionStats` - Statistical data

## Features

- Modern RadixCard components with gradient headers
- Responsive grid layouts
- Interactive application cards
- Comprehensive analytics dashboard
- Filter and search capabilities
- Export functionality
- Real-time statistics

## Usage

```tsx
import { AdmissionPage } from 'pages/Admission';

// Use in router
<Route path="/admission" element={<AdmissionPage />} />;
```

## Future Enhancements

- Real-time notifications
- Document upload and verification
- Interview scheduling
- Email integration
- Advanced filtering and search
- Bulk operations
