import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'

import { requireAuth } from '#/shared/lib/auth-guard'
import { useSearchStore } from '#/shared/hooks/useSearchStore'
import { PageHeader } from '#/shared/components'
import {
  DashboardStatCards,
  RecentActivityTable,
  VisitorsByDepartmentChart,
  VisitorsByPurposeChart,
  VisitorsPerDayChart,
  useDashboardStats,
} from '#/features/dashboard'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: requireAuth,
  component: DashboardPage,
})

function DashboardPage() {
  const stats = useDashboardStats()
  const query = useSearchStore((state) => state.query)

  const filteredRecentActivity = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return stats.recentActivity
    return stats.recentActivity.filter((visitor) =>
      [
        visitor.fullName,
        visitor.company,
        visitor.hostEmployeeName,
        visitor.purpose,
        visitor.visitorId,
      ].some((field) => field?.toLowerCase().includes(term)),
    )
  }, [stats.recentActivity, query])

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description="Overview of today's visitor activity and weekly statistics."
      />

      <DashboardStatCards stats={stats} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <VisitorsPerDayChart data={stats.last7Days} />
        <VisitorsByDepartmentChart data={stats.byDepartment} />
        <VisitorsByPurposeChart data={stats.byPurpose} />
      </div>

      <RecentActivityTable visitors={filteredRecentActivity} />
    </div>
  )
}
