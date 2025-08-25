// Main page component
export { AttendancePage } from './AttendancePage';

// Tab components
export { Overview } from './tabs/Overview';
export { LiveTracking } from './tabs/LiveTracking';
export { Records } from './tabs/Records';
export { Analytics } from './tabs/Analytics';
export { Settings } from './tabs/Settings';

// Shared components
export { SessionCard } from './components/SessionCard';
export { ActivityItem } from './components/ActivityItem';
export { StatsOverview } from './components/StatsOverview';

// Hooks
export { useAttendanceData } from './hooks/useAttendanceData';
export { useSessionManagement } from './hooks/useSessionManagement';

// Types
export type {
  Student,
  AttendanceRecord,
  AttendanceSession,
  AttendanceStatus,
  SessionStatus,
  AttendanceMethod,
} from './types';
