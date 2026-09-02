import { Link, useRouterState } from '@tanstack/react-router'
import {
  BadgeCheckIcon,
  CalendarClockIcon,
  DoorOpenIcon,
  FileBarChart2Icon,
  LayoutDashboardIcon,
  LogOutIcon,
  SettingsIcon,
  ShieldCheckIcon,
  UserSquare2Icon,
  UsersIcon,
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '#/shared/components/ui/sidebar'

const NAV_ITEMS = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboardIcon },
  { title: 'Visitors', url: '/visitors', icon: UsersIcon },
  { title: 'Appointments', url: '/appointments', icon: CalendarClockIcon },
  { title: 'Hosts / Employees', url: '/employees', icon: UserSquare2Icon },
] as const

const OPERATIONS_ITEMS = [
  { title: 'Check In', url: '/checkin', icon: DoorOpenIcon },
  { title: 'Check Out', url: '/checkout', icon: LogOutIcon },
  { title: 'Badge Printing', url: '/badge', icon: BadgeCheckIcon },
] as const

const INSIGHTS_ITEMS = [
  { title: 'Reports', url: '/reports', icon: FileBarChart2Icon },
  { title: 'Settings', url: '/settings', icon: SettingsIcon },
] as const

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  const isActive = (url: string) =>
    url === '/' ? pathname === '/' : pathname.startsWith(url)

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <ShieldCheckIcon className="size-4.5" />
                </div>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate font-semibold">VMS</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Visitor Management
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isActive(item.url)}
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Front Desk</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {OPERATIONS_ITEMS.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isActive(item.url)}
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Insights</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {INSIGHTS_ITEMS.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isActive(item.url)}
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="rounded-lg bg-sidebar-accent/60 p-3 text-xs text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden">
          <p className="font-medium text-sidebar-foreground">Northwind Tower</p>
          <p>Front Desk Console v1.0</p>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
