import {
  CalendarCheck2Icon,
  ClockAlertIcon,
  LogInIcon,
  LogOutIcon,
  UsersRoundIcon,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/shared/components/ui/card'
import { cn } from '#/shared/lib/utils'

interface StatCardProps {
  label: string
  value: number
  icon: LucideIcon
  accent: string
}

function StatCard({ label, value, icon: Icon, accent }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <CardDescription className="text-sm font-medium">
          {label}
        </CardDescription>
        <div
          className={cn(
            'flex size-8 items-center justify-center rounded-lg',
            accent,
          )}
        >
          <Icon className="size-4" />
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle className="text-2xl font-semibold tabular-nums">
          {value.toLocaleString()}
        </CardTitle>
      </CardContent>
    </Card>
  )
}

export function DashboardStatCards({
  stats,
}: {
  stats: {
    todaysVisitorsCount: number
    checkedInCount: number
    checkedOutCount: number
    pendingApprovalCount: number
    expectedVisitorsCount: number
  }
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <StatCard
        label="Today's Visitors"
        value={stats.todaysVisitorsCount}
        icon={UsersRoundIcon}
        accent="bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400"
      />
      <StatCard
        label="Checked In"
        value={stats.checkedInCount}
        icon={LogInIcon}
        accent="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
      />
      <StatCard
        label="Checked Out"
        value={stats.checkedOutCount}
        icon={LogOutIcon}
        accent="bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-400"
      />
      <StatCard
        label="Pending Approval"
        value={stats.pendingApprovalCount}
        icon={ClockAlertIcon}
        accent="bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400"
      />
      <StatCard
        label="Expected Visitors"
        value={stats.expectedVisitorsCount}
        icon={CalendarCheck2Icon}
        accent="bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400"
      />
    </div>
  )
}
