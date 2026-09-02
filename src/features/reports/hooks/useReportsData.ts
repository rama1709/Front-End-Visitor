import { useMemo } from 'react'
import {
  format,
  isWithinInterval,
  startOfMonth,
  subDays,
  subMonths,
} from 'date-fns'

import { useVisitorStore } from '#/features/visitors'

export function useReportsData() {
  const visitors = useVisitorStore((state) => state.visitors)

  return useMemo(() => {
    const daily = Array.from({ length: 14 }, (_, index) => {
      const date = subDays(new Date(), 13 - index)
      const count = visitors.filter((v) => {
        const created = new Date(v.createdDate)
        return (
          created.getFullYear() === date.getFullYear() &&
          created.getMonth() === date.getMonth() &&
          created.getDate() === date.getDate()
        )
      }).length
      return { label: format(date, 'MMM d'), count }
    })

    const weekly = Array.from({ length: 8 }, (_, index) => {
      const start = subDays(new Date(), (7 - index) * 7)
      const end = subDays(new Date(), (6 - index) * 7)
      const count = visitors.filter((v) =>
        isWithinInterval(new Date(v.createdDate), { start, end }),
      ).length
      return { label: `Wk ${index + 1}`, count }
    })

    const monthly = Array.from({ length: 6 }, (_, index) => {
      const date = subMonths(new Date(), 5 - index)
      const count = visitors.filter((v) => {
        const created = new Date(v.createdDate)
        return (
          created.getFullYear() === date.getFullYear() &&
          created.getMonth() === date.getMonth()
        )
      }).length
      return { label: format(date, 'MMM yyyy'), count }
    })

    const byDepartment = Object.entries(
      visitors.reduce<Record<string, number>>((acc, v) => {
        acc[v.department] = (acc[v.department] ?? 0) + 1
        return acc
      }, {}),
    )
      .map(([department, count]) => ({ department, count }))
      .sort((a, b) => b.count - a.count)

    const byType = Object.entries(
      visitors.reduce<Record<string, number>>((acc, v) => {
        acc[v.visitorType] = (acc[v.visitorType] ?? 0) + 1
        return acc
      }, {}),
    )
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)

    const frequentVisitors = Object.entries(
      visitors.reduce<
        Record<string, { name: string; company: string; count: number }>
      >((acc, v) => {
        const key = `${v.fullName}__${v.company}`
        const existing = acc[key] ?? {
          name: v.fullName,
          company: v.company,
          count: 0,
        }
        existing.count += 1
        acc[key] = existing
        return acc
      }, {}),
    )
      .map(([, value]) => value)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    const thisMonthTotal = visitors.filter((v) =>
      isWithinInterval(new Date(v.createdDate), {
        start: startOfMonth(new Date()),
        end: new Date(),
      }),
    ).length

    return {
      daily,
      weekly,
      monthly,
      byDepartment,
      byType,
      frequentVisitors,
      totalVisitors: visitors.length,
      thisMonthTotal,
    }
  }, [visitors])
}
