import { format } from 'date-fns'
import { ShieldCheckIcon } from 'lucide-react'

import type { Visitor } from '#/features/visitors'
import { Avatar, AvatarFallback } from '#/shared/components/ui/avatar'

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function VisitorBadgeCard({ visitor }: { visitor: Visitor }) {
  return (
    <div className="mx-auto w-full max-w-xs overflow-hidden rounded-2xl border bg-card shadow-sm print:shadow-none">
      <div className="flex items-center gap-2 bg-primary px-4 py-3 text-primary-foreground">
        <ShieldCheckIcon className="size-4" />
        <span className="text-sm font-semibold tracking-wide">
          VISITOR PASS
        </span>
      </div>
      <div className="flex flex-col items-center gap-2 px-4 py-5">
        <Avatar className="size-20">
          <AvatarFallback className="bg-primary/10 text-2xl font-semibold text-primary">
            {initials(visitor.fullName)}
          </AvatarFallback>
        </Avatar>
        <p className="text-center text-lg font-semibold leading-tight">
          {visitor.fullName}
        </p>
        <p className="text-center text-sm text-muted-foreground">
          {visitor.company}
        </p>
        <div className="mt-2 w-full rounded-lg bg-muted/50 p-3 text-xs">
          <div className="flex justify-between py-0.5">
            <span className="text-muted-foreground">Visitor ID</span>
            <span className="font-medium">{visitor.visitorId}</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="text-muted-foreground">Host</span>
            <span className="font-medium">{visitor.hostEmployeeName}</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="text-muted-foreground">Purpose</span>
            <span className="font-medium">{visitor.purpose}</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="text-muted-foreground">Valid Date</span>
            <span className="font-medium">
              {format(
                new Date(visitor.checkInTime ?? visitor.createdDate),
                'MMM d, yyyy',
              )}
            </span>
          </div>
        </div>
        <div className="mt-2 grid h-16 w-full grid-cols-12 gap-px overflow-hidden rounded bg-foreground/90 p-2">
          {Array.from({ length: 48 }).map((_, index) => (
            <div
              key={index}
              className={index % 3 === 0 ? 'bg-background' : 'bg-transparent'}
            />
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground">
          Please wear this badge visibly at all times on premises.
        </p>
      </div>
    </div>
  )
}
