// Main component
export { ResultPage } from './ResultPage';

// Types
export type {
  StudentResult,
  Subject,
  ResultAnalytics,
  SubjectAnalysis,
  ResultFilters,
} from './types';

// Hooks
export { useResultData } from './hooks/useResultData';
export { useResultManagement } from './hooks/useResultManagement';

// Components
export { ResultCard } from './components/ResultCard';
export { TopPerformerItem } from './components/TopPerformerItem';
export { SubjectAnalysisCard } from './components/SubjectAnalysisCard';

// Tab components
export { Overview } from './tabs/Overview';
export { StudentResults } from './tabs/StudentResults';
export { Analytics } from './tabs/Analytics';
export { PublishResults } from './tabs/PublishResults';
