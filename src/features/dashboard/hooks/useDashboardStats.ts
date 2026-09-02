import { useMemo } from 'react'
import { format, isToday, isWithinInterval, subDays } from 'date-fns'

import { useVisitorStore } from '#/features/visitors'
import { useAppointmentStore } from '#/features/appointments'

export function useDashboardStats() {
  const visitors = useVisitorStore((state) => state.visitors)
  const appointments = useAppointmentStore((state) => state.appointments)

  return useMemo(() => {
    const todaysVisitors = visitors.filter((v) =>
      isToday(new Date(v.createdDate)),
    )
    const checkedIn = visitors.filter((v) => v.status === 'checked-in')
    const checkedOut = visitors.filter((v) => v.status === 'checked-out')
    const pendingApproval = visitors.filter((v) => v.status === 'pending')
    const expectedVisitors = appointments.filter(
      (a) => a.approvalStatus === 'approved' && isToday(new Date(a.visitDate)),
    )

    const last7Days = Array.from({ length: 7 }, (_, index) => {
      const date = subDays(new Date(), 6 - index)
      const count = visitors.filter((v) =>
        isWithinInterval(new Date(v.createdDate), {
          start: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          end: new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            23,
            59,
            59,
          ),
        }),
      ).length
      return { day: format(date, 'EEE'), visitors: count }
    })

    const byDepartment = Object.entries(
      visitors.reduce<Record<string, number>>((acc, v) => {
        acc[v.department] = (acc[v.department] ?? 0) + 1
        return acc
      }, {}),
    )
      .map(([department, count]) => ({ department, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)

    const byPurpose = Object.entries(
      visitors.reduce<Record<string, number>>((acc, v) => {
        acc[v.purpose] = (acc[v.purpose] ?? 0) + 1
        return acc
      }, {}),
    )
      .map(([purpose, count]) => ({ purpose, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)

    const recentActivity = [...visitors]
      .sort(
        (a, b) =>
          new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime(),
      )
      .slice(0, 8)

    return {
      todaysVisitorsCount: todaysVisitors.length,
      checkedInCount: checkedIn.length,
      checkedOutCount: checkedOut.length,
      pendingApprovalCount: pendingApproval.length,
      expectedVisitorsCount: expectedVisitors.length,
      weeklyTotal: last7Days.reduce((sum, d) => sum + d.visitors, 0),
      last7Days,
      byDepartment,
      byPurpose,
      recentActivity,
    }
  }, [visitors, appointments])
}
