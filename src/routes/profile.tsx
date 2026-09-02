import { createFileRoute } from '@tanstack/react-router'

import { ProfilePage } from '#/features/profile'
import { requireAuth } from '#/shared/lib/auth-guard'

export const Route = createFileRoute('/profile')({
  beforeLoad: requireAuth,
  component: ProfilePage,
})
