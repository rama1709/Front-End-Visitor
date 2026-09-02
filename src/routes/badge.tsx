import { createFileRoute } from '@tanstack/react-router'

import { BadgePrintingPage } from '#/features/badge'
import { requireAuth } from '#/shared/lib/auth-guard'

export const Route = createFileRoute('/badge')({
  beforeLoad: requireAuth,
  component: BadgePrintingPage,
})
