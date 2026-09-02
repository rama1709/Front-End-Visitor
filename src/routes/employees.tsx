import { createFileRoute } from '@tanstack/react-router'

import { EmployeesPage } from '#/features/employees'
import { requireAuth } from '#/shared/lib/auth-guard'

export const Route = createFileRoute('/employees')({
  beforeLoad: requireAuth,
  component: EmployeesPage,
})
