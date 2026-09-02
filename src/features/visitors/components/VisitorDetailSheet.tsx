import { format } from 'date-fns'
import { CarIcon, MailIcon, PhoneIcon } from 'lucide-react'

import { useVisitorStore } from '../hooks/useVisitorStore'
import type { Visitor } from '../types'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '#/shared/components/ui/sheet'
import { Avatar, AvatarFallback } from '#/shared/components/ui/avatar'
import { Separator } from '#/shared/components/ui/separator'
import { Button } from '#/shared/components/ui/button'
import { StatusBadge } from '#/shared/components/StatusBadge'

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function DetailRow({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

export function VisitorDetailSheet({
  visitor,
  open,
  onOpenChange,
}: {
  visitor: Visitor | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const approveVisitor = useVisitorStore((state) => state.approveVisitor)
  const rejectVisitor = useVisitorStore((state) => state.rejectVisitor)

  if (!visitor) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Visitor Details</SheetTitle>
          <SheetDescription>{visitor.visitorId}</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-4 pb-6">
          <div className="flex items-center gap-3">
            <Avatar className="size-14">
              <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
                {initials(visitor.fullName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-base font-semibold">{visitor.fullName}</p>
              <p className="text-sm text-muted-foreground">{visitor.company}</p>
              <StatusBadge status={visitor.status} className="mt-1" />
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-lg border p-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <PhoneIcon className="size-3.5" /> {visitor.phone}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MailIcon className="size-3.5" /> {visitor.email}
            </div>
            {visitor.vehicleNumber && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <CarIcon className="size-3.5" /> {visitor.vehicleNumber}
              </div>
            )}
          </div>

          <Separator />

          <div className="flex flex-col divide-y">
            <DetailRow label="Identity Number" value={visitor.identityNumber} />
            <DetailRow label="Purpose" value={visitor.purpose} />
            <DetailRow label="Host Employee" value={visitor.hostEmployeeName} />
            <DetailRow label="Department" value={visitor.department} />
            <DetailRow label="Visitor Type" value={visitor.visitorType} />
            <DetailRow
              label="Registered"
              value={format(new Date(visitor.createdDate), 'MMM d, yyyy HH:mm')}
            />
            {visitor.checkInTime && (
              <DetailRow
                label="Checked In"
                value={format(
                  new Date(visitor.checkInTime),
                  'MMM d, yyyy HH:mm',
                )}
              />
            )}
            {visitor.checkOutTime && (
              <DetailRow
                label="Checked Out"
                value={format(
                  new Date(visitor.checkOutTime),
                  'MMM d, yyyy HH:mm',
                )}
              />
            )}
            {visitor.operator && (
              <DetailRow label="Operator" value={visitor.operator} />
            )}
          </div>

          {visitor.status === 'pending' && (
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  rejectVisitor(visitor.id)
                  onOpenChange(false)
                }}
              >
                Reject
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  approveVisitor(visitor.id)
                  onOpenChange(false)
                }}
              >
                Approve
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
