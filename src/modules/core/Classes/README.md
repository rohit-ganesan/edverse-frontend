# Classes Management Module

## Overview

The Classes module provides comprehensive management of class schedules, student enrollment, and classroom activities within the educational management system.

## Structure

### Main Components

- **ClassesPage.tsx** - Main page component with tab navigation
- **components/ClassCard.tsx** - Individual class display component
- **hooks/useClassesData.ts** - Data fetching and state management hook
- **index.ts** - Module exports

### Tabs

- **Overview** - Dashboard view with statistics and class listings
- **Analytics** - Performance metrics and attendance analysis
- **Settings** - Configuration options for class management

## Features

- Class scheduling and timetable management
- Student enrollment tracking
- Instructor assignment
- Attendance monitoring
- Performance analytics

## Data Structure

Classes contain the following information:

- Basic details (name, subject, grade, section)
- Instructor assignment
- Schedule information
- Student enrollment count
- Active/inactive status

## Usage

```typescript
import { ClassesPage, useClassesData } from 'pages/Classes';

// Use the main page component
<ClassesPage />

// Use the data hook
const { classes, stats, isLoading } = useClassesData();
```

## Future Enhancements

- Real-time attendance tracking
- Assignment management integration
- Parent communication features
- Advanced scheduling algorithms
