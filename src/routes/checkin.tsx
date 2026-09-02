import { createFileRoute } from '@tanstack/react-router'

import { CheckInPage } from '#/features/checkin'
import { requireAuth } from '#/shared/lib/auth-guard'

export const Route = createFileRoute('/checkin')({
  beforeLoad: requireAuth,
  component: CheckInPage,
})
