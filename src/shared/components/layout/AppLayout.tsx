import { useRouterState } from '@tanstack/react-router'

import { AppSidebar } from './AppSidebar'
import { AppNavbar } from './AppNavbar'
import type * as React from 'react'

import { SidebarInset, SidebarProvider } from '#/shared/components/ui/sidebar'

// Routes that render their own full-page layout (no sidebar/navbar chrome).
const CHROMELESS_ROUTES = new Set(['/', '/login'])

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  if (CHROMELESS_ROUTES.has(pathname)) {
    return <>{children}</>
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppNavbar />
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
