import { useMemo, useState } from 'react'
import { QrCodeIcon, SearchIcon, UserCheckIcon } from 'lucide-react'

import type { Visitor } from '#/features/visitors'
import { Input } from '#/shared/components/ui/input'
import { Button } from '#/shared/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/shared/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '#/shared/components/ui/tabs'
import { Avatar, AvatarFallback } from '#/shared/components/ui/avatar'
import { StatusBadge } from '#/shared/components/StatusBadge'
import { useVisitorStore } from '#/features/visitors'
import { useAppointmentStore } from '#/features/appointments'

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function CheckInSearchPanel({
  onSelectVisitor,
}: {
  onSelectVisitor: (visitor: Visitor) => void
}) {
  const visitors = useVisitorStore((state) => state.visitors)
  const appointments = useAppointmentStore((state) => state.appointments)
  const [query, setQuery] = useState('')

  const eligibleVisitors = useMemo(
    () =>
      visitors.filter((v) => v.status === 'approved' || v.status === 'pending'),
    [visitors],
  )

  const results = useMemo(() => {
    if (!query.trim()) return eligibleVisitors.slice(0, 8)
    const lower = query.toLowerCase()
    return eligibleVisitors.filter(
      (visitor) =>
        visitor.fullName.toLowerCase().includes(lower) ||
        visitor.visitorId.toLowerCase().includes(lower) ||
        visitor.company.toLowerCase().includes(lower),
    )
  }, [eligibleVisitors, query])

  const todaysApprovedAppointments = useMemo(
    () =>
      appointments.filter((a) => a.approvalStatus === 'approved').slice(0, 8),
    [appointments],
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Find Visitor</CardTitle>
        <CardDescription>
          Search by name, scan a QR pass, or find a scheduled appointment.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
      <Tabs defaultValue="manual" className="w-full">
  <TabsList className="mb-4 grid w-full grid-cols-3 rounded-lg">
    <TabsTrigger
      value="manual"
      className="w-full text-center"
    >
      Search
    </TabsTrigger>

    <TabsTrigger
      value="appointment"
      className="w-full text-center"
    >
      Appointment
    </TabsTrigger>

    <TabsTrigger
      value="qr"
      className="w-full text-center"
    >
      QR Code
    </TabsTrigger>
  </TabsList>

          <TabsContent value="manual" className="flex flex-col gap-3">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name, visitor ID, or company..."
                className="pl-8"
              />
            </div>
            <div className="flex flex-col divide-y rounded-lg border">
              {results.length === 0 && (
                <p className="p-4 text-center text-sm text-muted-foreground">
                  No matching visitors found.
                </p>
              )}
              {results.map((visitor) => (
                <button
                  key={visitor.id}
                  type="button"
                  onClick={() => onSelectVisitor(visitor)}
                  className="flex items-center justify-between gap-3 p-3 text-left transition hover:bg-accent/50"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                      <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                        {initials(visitor.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="leading-tight">
                      <p className="font-medium">{visitor.fullName}</p>
                      <p className="text-xs text-muted-foreground">
                        {visitor.company} · {visitor.visitorId}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={visitor.status} />
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="appointment" className="flex flex-col gap-3">
            <div className="flex flex-col divide-y rounded-lg border">
              {todaysApprovedAppointments.length === 0 && (
                <p className="p-4 text-center text-sm text-muted-foreground">
                  No approved appointments found.
                </p>
              )}
              {todaysApprovedAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between gap-3 p-3"
                >
                  <div className="leading-tight">
                    <p className="font-medium">{appointment.visitorName}</p>
                    <p className="text-xs text-muted-foreground">
                      {appointment.meetingRoom} · {appointment.visitTime} with{' '}
                      {appointment.hostEmployeeName}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const matched = visitors.find(
                        (v) =>
                          v.fullName === appointment.visitorName &&
                          v.company === appointment.visitorCompany,
                      )
                      if (matched) {
                        onSelectVisitor(matched)
                      } else {
                        onSelectVisitor({
                          id: appointment.id,
                          visitorId: appointment.appointmentId,
                          fullName: appointment.visitorName,
                          company: appointment.visitorCompany,
                          phone: '',
                          email: '',
                          identityNumber: '',
                          avatarSeed: appointment.visitorName,
                          purpose: appointment.purpose,
                          hostEmployeeId: appointment.hostEmployeeId,
                          hostEmployeeName: appointment.hostEmployeeName,
                          department: appointment.department,
                          vehicleNumber: null,
                          visitorType: 'guest',
                          status: 'approved',
                          checkInTime: null,
                          checkOutTime: null,
                          operator: null,
                          badgeReturned: null,
                          remarks: null,
                          createdDate: appointment.createdDate,
                        })
                      }
                    }}
                  >
                    <UserCheckIcon />
                    Select
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="qr">
            <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-12 text-center">
              <QrCodeIcon className="size-10 text-muted-foreground" />
              <p className="text-sm font-medium">Scan visitor QR pass</p>
              <p className="max-w-xs text-xs text-muted-foreground">
                Point the visitor's QR invitation or badge at the camera to
                check them in instantly.
              </p>
              <Button variant="outline" size="sm" disabled>
                Waiting for camera...
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
