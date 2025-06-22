# UI Components

This directory contains reusable UI components built on top of Radix UI primitives. All components follow consistent design patterns and provide comprehensive TypeScript interfaces.

## Component Overview

### Core Components

- **RadixButton**: Styled button component with variants and sizes
- **RadixCard**: Container component with header and content sections
- **RadixTextField**: Input field with consistent styling
- **RadixRadioGroup**: Radio button group component
- **RadixSeparator**: Visual separator component

### Layout Components

- **PageHeader**: Consistent page header with title and actions
- **TabContainer**: Reusable tab container with consistent styling
- **StatsGrid**: Grid layout for statistics cards
- **StatsCard**: Individual statistic display card

### Modern UI Components ⭐ REFACTORED

All Modern UI components have been refactored to match the intended design pattern inspired by Attendance and Results pages:

- **ModernCard**: Enhanced card component with RadixCard base, shadow-xl, gradient headers
- **ModernStatsCard**: Modern statistics card with proper shadows, rings, and RadixCard base
- **ModernStatsGrid**: Clean grid layout without gradient containers, proper animations
- **ModernActivityItem**: Activity feed item with enhanced borders and shadows
- **ModernProgressBar**: Progress visualization with RadixCard base and gradient headers
- **ModernGradientContainer**: Gradient background container (legacy, use sparingly)

### Specialized Components

- **ImprovedNoticeCard**: Expandable notice card with progressive disclosure
- **InstructorCard**: Detailed instructor information card
- **StudentCard**: Student profile card with academic info
- **DepartmentCard**: Department overview card
- **PersonAvatar**: User avatar component
- **StatusBadge**: Status indicator badge
- **Toast**: Notification toast component

## Design System - Modern UI Pattern

### Intended Look & Feel

The Modern UI components now follow the consistent design pattern established in Attendance and Results pages:

**RadixCard Base Structure:**

```tsx
<RadixCard className="p-0 shadow-xl border-0 bg-white overflow-hidden">
  {/* Optional Gradient Header */}
  <Box className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
    <Heading size="5">Title</Heading>
    <Text size="3">Subtitle</Text>
  </Box>

  {/* Content */}
  <Box className="p-6">Content goes here</Box>
</RadixCard>
```

### Visual Design Principles

**1. Shadows & Elevation:**

- Base: `shadow-xl` for cards
- Hover: `hover:shadow-2xl` for enhanced depth
- Interactive: `hover:scale-[1.02]` for subtle scaling

**2. Gradient Headers:**

- Blue: `from-blue-50 to-indigo-50 border-b border-blue-100`
- Green: `from-green-50 to-emerald-50 border-b border-green-100`
- Orange: `from-orange-50 to-amber-50 border-b border-orange-100`
- Purple: `from-purple-50 to-violet-50 border-b border-purple-100`
- Gray: `from-gray-50 to-gray-100 border-b border-gray-200`

**3. Typography Hierarchy:**

- Card Titles: `Heading size="5"` (text-xl, 20px)
- Card Subtitles: `Text size="3"` (text-base, 16px)
- Stats Values: `Text size="4"` (text-lg, 18px) with `font-bold`
- Stats Labels: `Text size="2"` (text-sm, 14px) with `font-medium`

**4. Icon Treatment:**

- Container: `w-12 h-12` with `rounded-xl`
- Background: Color-specific (e.g., `bg-green-100`)
- Ring: Matching color ring (e.g., `ring-green-200`)
- Icon: 6x6 with matching text color (e.g., `text-green-600`)
- Shadow: `shadow-sm` for subtle depth

**5. Spacing & Padding:**

- Card Headers: `p-6` for generous breathing room
- Card Content: `p-6` for consistency
- Icon Gaps: `gap-4` between icon and content
- Grid Gaps: `gap-6` for medium spacing, `gap-8` for large

### Component Examples

#### ModernStatsCard

```tsx
<ModernStatsCard
  icon={<Users />}
  value="150"
  label="Total Students"
  iconColor="blue"
  size="md"
/>
```

**Features:**

- RadixCard base with `shadow-xl`
- Color-coded icon containers with rings
- Proper text hierarchy and truncation
- Hover effects with scaling

#### ModernCard

```tsx
<ModernCard
  title="Today's Sessions"
  subtitle="2 sessions scheduled"
  headerGradient="blue"
  statusIndicator={{ position: 'left', color: 'green' }}
>
  <Content />
</ModernCard>
```

**Features:**

- Gradient headers with proper typography
- Status indicators (left/top positioning)
- Consistent padding and spacing
- Enhanced hover effects

#### ModernProgressBar

```tsx
<ModernProgressBar
  title="Attendance Progress"
  subtitle="Today's check-in status"
  segments={[
    { value: 32, color: 'green', label: 'Present' },
    { value: 2, color: 'orange', label: 'Late' },
    { value: 1, color: 'red', label: 'Absent' },
  ]}
  total={35}
  showPercentage={true}
  animated={true}
/>
```

**Features:**

- RadixCard base with gradient header
- Multi-segment progress visualization
- Statistics display with proper spacing
- Smooth animations

## Text Overflow Handling

All Modern UI components include comprehensive text overflow protection:

### Overflow Prevention Features

- **Truncation**: Long text is truncated with ellipsis using `truncate` class
- **Line Clamping**: Multi-line text is limited using `line-clamp-2` and `line-clamp-3`
- **Container Constraints**: Components use `min-w-0` and `flex-1` for proper flex behavior
- **Word Breaking**: Long words are broken using `word-break-break-word`
- **Responsive Layout**: Components adapt to different screen sizes gracefully

### Implementation Details

- **ModernActivityItem**: Names truncate, descriptions use 2-line clamp
- **ModernStatsCard**: Values truncate, labels use 2-line clamp
- **ModernCard**: Titles truncate, subtitles use 2-line clamp
- **ModernProgressBar**: Headers truncate, statistics wrap responsively
- **ModernStatsGrid**: Responsive column layout prevents overflow

## Responsive Design

### Grid Responsiveness

```tsx
// ModernStatsGrid responsive columns
columns={{
  initial: '1',    // Mobile: 1 column
  xs: '2',         // Small: 2 columns
  sm: '3',         // Medium: 3 columns (if total >= 3)
  md: columns      // Large: specified columns
}}
```

### Breakpoint Strategy

- **Mobile First**: Single column layout for small screens
- **Progressive Enhancement**: Add columns as screen size increases
- **Content Aware**: Adjust columns based on content amount

## Animation System

### Staggered Animations

```tsx
// Grid items with staggered delays
style={{ animationDelay: `${index * 100}ms` }}
className="animate-in fade-in-0 slide-in-from-bottom-2 duration-700"
```

### Animation Classes

- `animate-in fade-in-0 slide-in-from-bottom-4 duration-500` - Grid containers
- `animate-in fade-in-0 slide-in-from-bottom-2 duration-700` - Individual items
- `animate-in slide-in-from-right-1 duration-300` - Side panels
- `hover:scale-[1.02]` - Interactive hover scaling

## Usage Guidelines

### Do's ✅

- Use `ModernStatsCard` for statistics display
- Apply gradient headers for visual hierarchy
- Use consistent spacing (p-6 for headers/content)
- Include proper hover effects and animations
- Follow the established color system
- Use RadixCard as the base for all card components

### Don'ts ❌

- Don't use `ModernGradientContainer` for new components
- Don't mix different shadow levels within the same section
- Don't use custom card styling - stick to the established pattern
- Don't forget text overflow protection
- Don't use inconsistent padding/spacing

## Migration Guide

### From Old Modern Components

```tsx
// OLD: ModernStatsGrid with gradient container
<ModernStatsGrid
  containerGradient="blue"
  variant="glass"
/>

// NEW: Clean ModernStatsGrid
<ModernStatsGrid
  variant="default"
  // Gradient removed, uses clean design
/>
```

### Pattern Updates

1. **Shadow System**: All cards now use `shadow-xl` as base
2. **Typography**: Consistent Heading/Text sizes across components
3. **Icons**: Standardized sizing and color treatment
4. **Spacing**: Unified padding system (p-6 for main areas)
5. **Gradients**: Only in headers, not full containers

## Accessibility Features

- **Keyboard Navigation**: All interactive components support keyboard navigation
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Focus Management**: Visible focus indicators and logical tab order
- **Color Contrast**: All text meets WCAG AA contrast requirements
- **Responsive Design**: Components work across all device sizes

## Performance Optimizations

- **Lazy Loading**: Large components support lazy loading
- **Memoization**: Complex calculations are memoized
- **Efficient Rendering**: Components avoid unnecessary re-renders
- **Bundle Splitting**: Components can be imported individually
- **Responsive Images**: Images are optimized for different screen sizes

## Best Practices

1. **Consistent Design**: Always use the Modern UI pattern for new features
2. **Shadow Hierarchy**: Use `shadow-xl` for cards, `shadow-2xl` for hover states
3. **Typography**: Follow the established Heading/Text size system
4. **Color Usage**: Use the predefined color combinations for icons
5. **Spacing**: Maintain consistent padding (p-6) and gaps (gap-6)
6. **Animation**: Use staggered delays for multiple components (100ms intervals)
7. **Text Overflow**: Always consider text overflow scenarios in layouts
8. **Responsive**: Test components across different screen sizes
