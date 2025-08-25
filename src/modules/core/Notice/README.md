# Notice Page

A comprehensive notice board management system with modern UI design and advanced analytics capabilities.

## Directory Structure

```
src/pages/Notice/
├── NoticePage.tsx              # Main component with tab navigation
├── index.ts                    # Barrel exports
├── types.ts                    # TypeScript interfaces
├── README.md                   # This documentation
├── tabs/                       # Tab-specific components
│   ├── AllNotices.tsx         # Complete notice management with filters
│   ├── Recent.tsx             # Recent activity and trending notices
│   ├── Drafts.tsx             # Draft management and publishing
│   └── Analytics.tsx          # Performance analytics and insights
├── components/                 # Reusable components
│   ├── NoticeCard.tsx         # Individual notice display cards
│   ├── CategoryAnalysisCard.tsx # Category performance analytics
│   └── TopNoticeItem.tsx      # Top performing notice items
└── hooks/                     # Custom business logic
    ├── useNoticeData.ts       # Data management & filtering
    └── useNoticeManagement.ts # Utility functions & actions
```

## Features

### 🔍 All Notices Tab

- **Advanced Search**: Real-time search across titles, content, and authors
- **Multi-Filter System**: Category, priority, status, and audience filters
- **Pinned Notices**: Special highlighting for important announcements
- **Bulk Actions**: Mass operations on selected notices
- **Smart Sorting**: Multiple sorting options with visual indicators

### ⚡ Recent Tab

- **Activity Dashboard**: 24-hour and weekly activity summaries
- **Top Performers**: Ranking system based on engagement metrics
- **Quick Actions**: Streamlined access to common operations
- **Real-time Updates**: Live activity feed with animations

### 📝 Drafts Tab

- **Draft Management**: Comprehensive draft lifecycle management
- **Auto-save Functionality**: Automatic saving of work in progress
- **Publishing Workflow**: Streamlined draft-to-published pipeline
- **Progress Tracking**: Visual indicators for draft completion status

### 📊 Analytics Tab

- **Performance Metrics**: Comprehensive engagement analytics
- **Category Analysis**: Deep-dive into category performance
- **Trend Visualization**: Time-based performance charts
- **Audience Insights**: Detailed audience reach and engagement data

## Component Architecture

### Main Component

```typescript
// NoticePage.tsx - Root component with tab navigation
export function NoticePage(): JSX.Element;
```

### Data Hooks

```typescript
// useNoticeData.ts - Data management and filtering
export function useNoticeData(): {
  notices: Notice[];
  pinnedNotices: Notice[];
  recentNotices: Notice[];
  draftNotices: Notice[];
  analytics: NoticeAnalytics;
  filters: NoticeFilters;
  updateFilter: (key: keyof NoticeFilters, value: any) => void;
  resetFilters: () => void;
};

// useNoticeManagement.ts - Utility functions and actions
export function useNoticeManagement(): {
  // Color and styling helpers
  getPriorityColor: (priority: PriorityLevel) => string;
  getCategoryColor: (category: CategoryType) => string;
  // Icon helpers
  getPriorityIcon: (priority: PriorityLevel) => LucideIcon;
  getCategoryIcon: (category: CategoryType) => LucideIcon;
  // Action handlers
  handleCreateNotice: () => void;
  handleEditNotice: (id: string) => void;
  handleDeleteNotice: (id: string) => void;
  // ... more handlers
};
```

### Reusable Components

```typescript
// NoticeCard.tsx - Individual notice display
interface NoticeCardProps {
  notice: Notice;
  showActions?: boolean;
  compact?: boolean;
  className?: string;
}

// CategoryAnalysisCard.tsx - Category performance display
interface CategoryAnalysisCardProps {
  category: CategoryAnalysis;
  rank: number;
  className?: string;
}

// TopNoticeItem.tsx - Top performer ranking display
interface TopNoticeItemProps {
  notice: Notice;
  rank: number;
  className?: string;
}
```

## Type System

### Core Types

```typescript
interface Notice {
  id: string;
  title: string;
  content: string;
  author: string;
  authorRole: string;
  targetAudience: 'all' | 'students' | 'instructors' | 'administrators';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'academic' | 'administrative' | 'event' | 'emergency' | 'general';
  status: 'draft' | 'published' | 'archived';
  publishDate: string;
  expiryDate?: string;
  isPinned: boolean;
  attachments?: Attachment[];
  views: number;
  likes: number;
  comments: number;
  tags: string[];
}

interface NoticeAnalytics {
  totalNotices: number;
  publishedNotices: number;
  draftNotices: number;
  urgentNotices: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  averageEngagement: number;
  topCategories: CategoryAnalysis[];
  engagementTrend: EngagementData[];
  audienceReach: AudienceData[];
}
```

## Styling & Design

### Modern UI Elements

- **Gradient Headers**: Unique color schemes for each tab
- **Card-based Layout**: Consistent shadow-xl and border-0 styling
- **Animation System**: Staggered fade-in and slide-in effects
- **Color Coding**: Priority and category-based visual indicators
- **Responsive Design**: Mobile-first approach with proper breakpoints

### Color Palette

```css
/* Tab-specific gradients */
.all-notices {
  background: from-blue-50 to-indigo-50;
}
.recent {
  background: from-green-50 to-emerald-50;
}
.drafts {
  background: from-amber-50 to-yellow-50;
}
.analytics {
  background: from-violet-50 to-purple-50;
}

/* Priority colors */
.urgent {
  color: red;
}
.high {
  color: orange;
}
.medium {
  color: yellow;
}
.low {
  color: blue;
}

/* Category colors */
.academic {
  color: blue;
}
.administrative {
  color: purple;
}
.event {
  color: green;
}
.emergency {
  color: red;
}
.general {
  color: gray;
}
```

## Usage Examples

### Basic Implementation

```typescript
import { NoticePage } from 'pages/Notice';

// In your router
<Route path="/notices" element={<NoticePage />} />
```

### Using Individual Components

```typescript
import { NoticeCard, useNoticeData } from 'pages/Notice';

function CustomNoticeList() {
  const { notices } = useNoticeData();

  return (
    <div className="space-y-4">
      {notices.map(notice => (
        <NoticeCard
          key={notice.id}
          notice={notice}
          compact
        />
      ))}
    </div>
  );
}
```

### Custom Filtering

```typescript
import { useNoticeData } from 'pages/Notice';

function FilteredNotices() {
  const { notices, updateFilter } = useNoticeData();

  return (
    <div>
      <input
        onChange={(e) => updateFilter('search', e.target.value)}
        placeholder="Search notices..."
      />
      {/* Notice list */}
    </div>
  );
}
```

## Performance Considerations

### Optimization Features

- **Memoized Calculations**: All analytics computed with useMemo
- **Efficient Filtering**: Optimized filter operations
- **Lazy Loading**: Progressive loading for large notice lists
- **Animation Delays**: Staggered animations to prevent UI blocking

### Memory Management

- **Cleanup Handlers**: Proper cleanup in useEffect hooks
- **Debounced Search**: 300ms debounce on search inputs
- **Pagination Ready**: Structure supports future pagination implementation

## Best Practices

### Component Guidelines

1. **Single Responsibility**: Each component has a focused purpose
2. **Prop Interface**: Well-defined TypeScript interfaces
3. **Error Boundaries**: Graceful error handling
4. **Accessibility**: ARIA labels and keyboard navigation

### State Management

1. **Local State**: Use useState for component-specific state
2. **Shared State**: Use custom hooks for cross-component data
3. **Performance**: Minimize re-renders with proper dependencies

### Styling Standards

1. **Tailwind Classes**: Consistent utility-first approach
2. **Modern Design**: Shadow-xl, rounded corners, gradients
3. **Responsive**: Mobile-first responsive design
4. **Animation**: Smooth transitions and micro-interactions

## Future Enhancements

### Planned Features

- [ ] Real-time notifications
- [ ] Rich text editor for notices
- [ ] File attachment management
- [ ] Advanced scheduling system
- [ ] Email notification integration
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Notice templates system

### Technical Improvements

- [ ] Virtual scrolling for large lists
- [ ] Offline support with service workers
- [ ] Advanced caching strategies
- [ ] Performance monitoring
- [ ] A/B testing framework
