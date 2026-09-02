import { redirect } from '@tanstack/react-router'

import { isSessionAuthenticated } from '#/features/auth'

/**
 * Route `beforeLoad` guard used by every protected page. Redirects to the
 * login screen (preserving the intended destination) when there is no
 * authenticated session.
 */
export function requireAuth({ location }: { location: { href: string } }) {
  if (!isSessionAuthenticated()) {
    throw redirect({
      to: '/login',
      search: { redirect: location.href },
    })
  }
}
