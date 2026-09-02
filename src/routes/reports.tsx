import { createFileRoute } from '@tanstack/react-router'

import { ReportsPage } from '#/features/reports'
import { requireAuth } from '#/shared/lib/auth-guard'

export const Route = createFileRoute('/reports')({
  beforeLoad: requireAuth,
  component: ReportsPage,
})
