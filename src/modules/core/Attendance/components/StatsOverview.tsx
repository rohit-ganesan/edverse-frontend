import { StatsGrid } from 'components/ui/StatsGrid';
import { UserCheck, UserX, AlertCircle, TrendingUp } from 'lucide-react';

interface StatsOverviewProps {
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  attendanceRate: number;
}

export function StatsOverview({
  totalPresent,
  totalAbsent,
  totalLate,
  attendanceRate,
}: StatsOverviewProps): JSX.Element {
  return (
    <StatsGrid
      stats={[
        {
          title: 'Present Today',
          value: totalPresent.toString(),
          icon: UserCheck,
          iconColor: 'text-green-600',
          iconBgColor: 'bg-green-100',
        },
        {
          title: 'Absent Today',
          value: totalAbsent.toString(),
          icon: UserX,
          iconColor: 'text-red-600',
          iconBgColor: 'bg-red-100',
        },
        {
          title: 'Late Arrivals',
          value: totalLate.toString(),
          icon: AlertCircle,
          iconColor: 'text-orange-600',
          iconBgColor: 'bg-orange-100',
        },
        {
          title: 'Attendance Rate',
          value: `${attendanceRate}%`,
          icon: TrendingUp,
          iconColor: 'text-blue-600',
          iconBgColor: 'bg-blue-100',
        },
      ]}
    />
  );
}
