import { createFileRoute } from '@tanstack/react-router'

import { VisitorRegisterPage } from '#/features/visitor-register'

// Public landing page: visitors self-register here without signing in.
// Admin/staff login lives at /login, dashboard at /dashboard.
export const Route = createFileRoute('/')({
  component: VisitorRegisterPage,
})
