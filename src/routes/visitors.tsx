import { createFileRoute } from '@tanstack/react-router'

import { VisitorsPage } from '#/features/visitors'
import { requireAuth } from '#/shared/lib/auth-guard'

export const Route = createFileRoute('/visitors')({
  beforeLoad: requireAuth,
  component: VisitorsPage,
})
