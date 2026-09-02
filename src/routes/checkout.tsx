import { createFileRoute } from '@tanstack/react-router'

import { CheckOutPage } from '#/features/checkout'
import { requireAuth } from '#/shared/lib/auth-guard'

export const Route = createFileRoute('/checkout')({
  beforeLoad: requireAuth,
  component: CheckOutPage,
})
