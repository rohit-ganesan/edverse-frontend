# Courses Management Module

## Overview

The Courses module handles comprehensive course curriculum management, student enrollment, and academic program administration within the educational management system.

## Structure

### Main Components

- **CoursesPage.tsx** - Main page component with tab navigation
- **components/CourseCard.tsx** - Individual course display component
- **hooks/useCoursesData.ts** - Data fetching and state management hook
- **index.ts** - Module exports

### Tabs

- **Overview** - Dashboard view with course statistics and listings
- **Analytics** - Course performance metrics and completion analysis
- **Settings** - Configuration options for course management

## Features

- Course curriculum management
- Student enrollment and capacity tracking
- Credit and duration management
- Instructor assignment
- Certification tracking
- Academic program organization

## Data Structure

Courses contain the following information:

- Basic details (name, code, description)
- Academic information (credits, duration)
- Enrollment data (current/maximum capacity)
- Instructor assignment
- Active/inactive status

## Usage

```typescript
import { CoursesPage, useCoursesData } from 'pages/Courses';

// Use the main page component
<CoursesPage />

// Use the data hook
const { courses, stats, isLoading } = useCoursesData();
```

## Future Enhancements

- Prerequisite management
- Course material integration
- Assessment and grading systems
- Learning path recommendations
- Integration with LMS platforms
