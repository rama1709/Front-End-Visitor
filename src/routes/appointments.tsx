import { createFileRoute } from '@tanstack/react-router'

import { AppointmentsPage } from '#/features/appointments'
import { requireAuth } from '#/shared/lib/auth-guard'

export const Route = createFileRoute('/appointments')({
  beforeLoad: requireAuth,
  component: AppointmentsPage,
})
