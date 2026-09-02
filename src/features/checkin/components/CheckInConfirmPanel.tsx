import { useState } from 'react'
import {
  CameraIcon,
  PrinterIcon,
  UploadIcon,
  UserRoundIcon,
} from 'lucide-react'
import { toast } from 'sonner'

import type { Visitor } from '#/features/visitors'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/shared/components/ui/card'
import { Button } from '#/shared/components/ui/button'
import { Avatar, AvatarFallback } from '#/shared/components/ui/avatar'
import { Separator } from '#/shared/components/ui/separator'
import { StatusBadge } from '#/shared/components/StatusBadge'
import { useVisitorStore } from '#/features/visitors'

const CURRENT_OPERATOR = 'Front Desk 1'

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function CheckInConfirmPanel({
  visitor,
  onCheckedIn,
}: {
  visitor: Visitor | null
  onCheckedIn: (visitor: Visitor) => void
}) {
  const checkInVisitor = useVisitorStore((state) => state.checkInVisitor)
  const [photoTaken, setPhotoTaken] = useState(false)
  const [idUploaded, setIdUploaded] = useState(false)

  if (!visitor) {
    return (
      <Card className="flex h-full items-center justify-center">
        <CardContent className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
          <UserRoundIcon className="size-10" />
          <p className="text-sm">Select a visitor to begin check-in.</p>
        </CardContent>
      </Card>
    )
  }

  const alreadyCheckedIn =
    visitor.status === 'checked-in' || visitor.status === 'checked-out'

  return (
    <Card>
      <CardHeader>
        <CardTitle>Check-In Confirmation</CardTitle>
        <CardDescription>
          Capture visitor details before printing a badge.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
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

        <Separator />

        <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div className="flex justify-between rounded-lg border p-3">
            <span className="text-muted-foreground">Host</span>
            <span className="font-medium">{visitor.hostEmployeeName}</span>
          </div>
          <div className="flex justify-between rounded-lg border p-3">
            <span className="text-muted-foreground">Purpose</span>
            <span className="font-medium">{visitor.purpose}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Button
            type="button"
            variant={photoTaken ? 'secondary' : 'outline'}
            onClick={() => {
              setPhotoTaken(true)
              toast.success('Photo captured')
            }}
          >
            <CameraIcon />
            {photoTaken ? 'Photo Captured' : 'Capture Photo'}
          </Button>
          <Button
            type="button"
            variant={idUploaded ? 'secondary' : 'outline'}
            onClick={() => {
              setIdUploaded(true)
              toast.success('ID uploaded')
            }}
          >
            <UploadIcon />
            {idUploaded ? 'ID Uploaded' : 'Upload ID'}
          </Button>
        </div>

        <Button
          className="mt-2"
          size="lg"
          disabled={alreadyCheckedIn}
          onClick={() => {
            checkInVisitor(visitor.id, CURRENT_OPERATOR)
            toast.success(`${visitor.fullName} checked in successfully`)
            onCheckedIn({
              ...visitor,
              status: 'checked-in',
              checkInTime: new Date().toISOString(),
              operator: CURRENT_OPERATOR,
            })
          }}
        >
          <PrinterIcon />
          {alreadyCheckedIn ? 'Already Checked In' : 'Check In & Print Badge'}
        </Button>
      </CardContent>
    </Card>
  )
}
