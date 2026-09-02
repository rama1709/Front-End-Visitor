import { useRouterState } from '@tanstack/react-router'
import {
  BellIcon,
  LogOutIcon,
  SearchIcon,
  SettingsIcon,
  UserIcon,
} from 'lucide-react'
import { toast } from 'sonner'

import { SidebarTrigger } from '#/shared/components/ui/sidebar'
import { Separator } from '#/shared/components/ui/separator'
import { Input } from '#/shared/components/ui/input'
import { Button } from '#/shared/components/ui/button'
import { Badge } from '#/shared/components/ui/badge'
import {
  Avatar,
  AvatarFallback,
} from '#/shared/components/ui/avatar'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/shared/components/ui/dropdown-menu'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/shared/components/ui/popover'

import ThemeToggle from '#/shared/components/ThemeToggle'

import { useAuthStore } from '#/features/auth'
import { useNotifications } from '#/features/notifications/useNotifications'

import { useSearchStore } from '#/shared/hooks/useSearchStore'
import { getSearchConfig } from '#/shared/lib/search-config'

function formatNotificationTime(
  createdAt: Date | null,
): string {
  if (!createdAt) {
    return 'Just now'
  }

  const now = new Date()

  const difference =
    now.getTime() - createdAt.getTime()

  if (difference < 0) {
    return 'Just now'
  }

  const minutes = Math.floor(
    difference / (1000 * 60),
  )

  if (minutes < 1) {
    return 'Just now'
  }

  if (minutes < 60) {
    return `${minutes}m ago`
  }

  const hours = Math.floor(minutes / 60)

  if (hours < 24) {
    return `${hours}h ago`
  }

  const days = Math.floor(hours / 24)

  return `${days}d ago`
}

export function AppNavbar() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  const user = useAuthStore(
    (state) => state.user,
  )

  const logout = useAuthStore(
    (state) => state.logout,
  )

  const query = useSearchStore(
    (state) => state.query,
  )

  const setQuery = useSearchStore(
    (state) => state.setQuery,
  )

  const clearQuery = useSearchStore(
    (state) => state.clear,
  )

  const {
    notifications,
    unreadCount,
    error: notificationError,
    markAsRead,
  } = useNotifications()

  const searchConfig =
    getSearchConfig(pathname)

  const displayName =
    user?.name ?? 'Guest User'

  const displayRole =
    user?.role ?? 'Not signed in'

  const initials =
    user?.avatarInitials ?? 'GU'

  const handleLogout = () => {
    logout()
    clearQuery()

    toast.success(
      'Signed out successfully',
    )

    window.location.href = '/login'
  }

  const handleProfile = () => {
    window.location.href = '/profile'
  }

  const handleSettings = () => {
    window.location.href = '/settings'
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur-sm">
      <SidebarTrigger className="-ml-1" />

      <Separator
        orientation="vertical"
        className="mr-1 h-4"
      />

      {/* SEARCH */}
      <div className="relative hidden max-w-sm flex-1 md:block">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={query}
          onChange={(event) =>
            setQuery(event.target.value)
          }
          placeholder={
            searchConfig.placeholder
          }
          className="h-8 bg-muted/40 pl-8"
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <ThemeToggle />

        {/* NOTIFICATIONS */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
            >
              <BellIcon />

              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex size-2 rounded-full bg-destructive" />
              )}

              <span className="sr-only">
                Notifications
              </span>
            </Button>
          </PopoverTrigger>

          <PopoverContent
            align="end"
            className="w-80 p-0"
          >
            <div className="flex items-center justify-between border-b px-4 py-3">
              <p className="text-sm font-semibold">
                Notifications
              </p>

              <Badge variant="secondary">
                {unreadCount} new
              </Badge>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notificationError ? (
                <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                  {notificationError}
                </div>
              ) : notifications.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                  No notifications
                </div>
              ) : (
                notifications.map(
                  (notification) => (
                    <div
                      key={notification.id}
                      onClick={() => {
                        if (!notification.read) {
                          void markAsRead(
                            notification.id,
                          )
                        }
                      }}
                      className={`flex cursor-pointer flex-col gap-1 border-b px-4 py-3 text-sm last:border-b-0 hover:bg-accent/50 ${
                        !notification.read
                          ? 'bg-muted/30'
                          : ''
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium">
                          {notification.title}
                        </p>

                        <span className="shrink-0 text-xs text-muted-foreground">
                          {formatNotificationTime(
                            notification.createdAt,
                          )}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        {notification.message}
                      </p>
                    </div>
                  ),
                )
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* USER MENU */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="gap-2 px-1.5"
            >
              <Avatar className="size-7">
                <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <span className="hidden text-sm font-medium sm:inline">
                {displayName}
              </span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-56"
          >
            <DropdownMenuLabel className="flex flex-col">
              <span>{displayName}</span>

              <span className="text-xs font-normal text-muted-foreground">
                {displayRole}
              </span>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onSelect={handleProfile}
            >
              <UserIcon />
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={handleSettings}
            >
              <SettingsIcon />
              Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              variant="destructive"
              onSelect={handleLogout}
            >
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}