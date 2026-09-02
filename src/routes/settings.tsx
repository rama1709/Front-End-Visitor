import { createFileRoute } from '@tanstack/react-router'

import { SettingsPage } from '#/features/settings'
import { requireAuth } from '#/shared/lib/auth-guard'

export const Route = createFileRoute('/settings')({
  beforeLoad: requireAuth,
  component: SettingsPage,
})
